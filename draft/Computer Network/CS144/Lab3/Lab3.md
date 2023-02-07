# Lab3


```c++
    //! \brief Construct by taking ownership of a string
    Buffer(std::string &&str) noexcept : _storage(std::make_shared<std::string>(std::move(str))) {}
```

这个问题参考这篇文章：
[stackoverflow](https://stackoverflow.com/questions/5481539/what-does-t-double-ampersand-mean-in-c11)

本质上是为了右值引用，在Lab里面是提供一份源字符串的引用，但跟const-lvalue不同，并不能保证源数据不变。

- 1.19 解决了好几个test
- 1.20 就剩send_extra这个test了，明天要过年了，估计搞不定，这个应该是最有难度也是最能帮助理解sender ACK处理的机制的test了。
- 1.21 要限制做实验的时间了，不能一天到晚钻空子写，得穿插学点其他的东西。
- 1.22 大年初一搞定
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb95525aa89d4737b8b04930b1c9b8d5~tplv-k3u1fbpfcp-watermark.image?)


## Part1.中文翻译

Lab3需要实现连接的另一端:`TCPSender`是一个将外部字节流转换成`segement`（将形成不可靠的`datagram`）的工具。从`ByteStream`中读取数据，并将其转换成一系列向外传输的TCP segsments。在另一端，一个TCP接收器会将这些segment反转成原来的字节流，并且发送ACK和window建议值给发送方。

TCP发送器和接收器各自负责TCP segment中的一部分。TCP发送器写入所有跟TCP接收器相关联的字段。在LAB2这些字段是seqno,SYN,payload,以及FIN。然而，TCP发送器只读取接收器写的字段：ACK和window size。

高亮的地方是TCP发送器关心的：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4eab0507623493189d7b728a63dd368~tplv-k3u1fbpfcp-watermark.image?)

你的TCP发送器的职责有以下几点：

- 一直跟进接收器的window(处理收到的ACK和window size)
- 通过从`ByteSream`中读取数据产生新的TCP segments（如果需要，得包括SYN和FIN）来及时填充window，并且发送它们。发送器应该一直保持发送segments直到窗口已经满了，或者字节流已经为空。
- 一直跟踪那些发送出去但是没收到ACK的segment，我们称为 "outstanding" segment
- 如果在一定时间内发送了segment但还没收到ACK，重新发送 outstanding segments 

> 为什么要做这些？基本准则就是无论接收器是否允许发送（填充窗口），一直保持重发直到接收器接收到每个segment。这个称作ARQ（自动重发请求），发送器分割字节流成一个一个segments并且发送它们，按照接收器允许的范围尽可能地发。接收器会将乱序的segement自行重组。

## 3.1 TCP发送器怎么知道一个segment丢失了？

你的TCP发送器将会发送一系列的TCPSegments。每一个都会包含从字节流中读取的子串（也可能为空），用一个序列号来seqno来标识它在流中的位置，并且标记SYN标志在流初始的位置，以及FIN表示在结尾。

除了发送这些segments，TCP发送器需要一直跟踪这些发送出去的segments,直到他们都被完全接收到。TCP发送器的持有者会定期调用TCP发送器的`tick`方法，标识过了多长时间。TCP发送器的职责是浏览一遍发生出去的segment集合，并且界定是否最早之前的segment发出去等了太久都没有接收到ACK，如果是，那么它需要被重新发送。

这里有一些关于什么是外出时间过长的规则。你需要实现这个逻辑，并且它比较多细节，但是这周会提供很多可靠的单元测试，更加完善的测试将在LAB4.只要能够通过这些测试100%，那么你的实现就是可靠的。

> 为什么需要做这些？一整个目标就是让发送器检测何时segments丢失并且需要重发。在重传之前发送多久是很重要的：不应该等太久（因为会导致接收应用的延迟），但也不应该等了一小会就马上重传，这会浪费互联网珍贵的资源。

    1. 每隔几微秒，TCP发送器的`tick`方法将被调用，其中有一个参数会告知相比上次调用已经过了多少微秒。使用它来维护TCP存活总微秒数的概念。不要调用任何CPU的时间和时钟的函数-tick函数将是唯一用于获取过期时间的方法。这将保证所有事情可控并且可测试。

    2. 当TCP发送器已经被构建，会提供一个参数告知一个超时重传(retransmission timeout-RTO)的值。RTO标识了在重传之前要等多久。RTO的值会根据时间不断改变，但是初始值总是相同的。`_initial_retransmission_timeout`保存了RTO的初始值。

    3.你将实现重传计时器：一个在特定时间启动的提醒，一旦超出RTO，告警将触发。我们强调这个时间流逝的概念是来自于`tick`方法，并不是当天的实际时间。

    4. 每当一个包含数据的segment（长度不为0）被发送，如果计时器没有启动，开启一个计时器以确保能在几微秒后超时。

    5. 一旦所有发送出去的数据接收到了对应ACK，停止重传计时器。

    6. 如果`tick`被调用以及重传计时器已经超时：
        a. 重传最早发送的（最低的seqno)且没有完全被TCP接收器接收的segment。你需要在内部的数据结构存储传出去的segment来实现这个机制。

        b. 如果window size 不为0：
            i. 保持跟踪连续重传的数量，在你重传后增加这个值。你的TCPConnection将用这个信息去决定这个链接是否没什么希望并且需要被废弃。
            ii.RTO加到两倍。这个被称为“指数退避(exponential backoff)”，它减缓了重传的次数，避免在糟糕的网络中继续添乱。

        c. 重置重传计时器并且开启它

    7. 当接收器提供标识着成功接收到新的数据的ACK：
        a. 将RTO设置回初始值
        b. 如果发送器还有在发送的数据，重启重传计时器
        c. 重置连续重传次数为0

建议在一个分离的class内，实现重传计时器的功能。

## 3.2 实现TCP发送器

主要有四个事件需要处理，每个事件都最终都可能导致发送TCP segment。

1. void fill_window()

    TCPSender被要求填充window: 从输入字节流里读取数据并且尽可能多发送TCPSegments，长度具体会根据窗口的大小来定。

    你需要保证每个发送的TCPSegment长度完全符合接受者内部的窗口。让每个独立的TCPSegment尽可能地大，但不超过限定值1452bytes。

    你能够使用`length_in_sequence_space`这个方法去统计一个segment占用的序列号。注意SYN和FIN也都会占用一个序列号，意味着他们会占用window的空间。

2. void ack_received (const WrappingInt32 ackno, const uint16_t window_size)

    接收器已经接收到对应的segment，携带着ACK以及窗口大小返回。TCP发送器应该扫描自身对于发送出去的segment集合并且移除那些已经被接收的部分。如果产生新的空间，TCP发送器应该再次填充窗口。

3. void tick (const size_t ms_since_last_tick)

    跟上次调用的间隔——具体的微秒数。发送器也许需要去重传那些已经传输的segment。

4. void send_empty_segment(): TCP发送器在没有连续空间的情况下也应该生成并发送TCPSegment，并且准确设置序列号。如果持有者（TCPConnection)需要发送一个空的ACK的情况下会很有用。注意：如果是这样的segment，并不占用序列号，不需要跟踪也不需要重传。

## 3.4 FAQ

- 如何发送一个segment?

    把它推入_segments_out这个队列。对于TCPSender而言，只要把它推送进去就认为它已经被发送。持有者会马上把它pop出去，通过使用segments_out这个方法。

- 等等，我如何既发送一个segment并且同时跟踪？我是否必须复制一份segment，这会不会太浪费了？

    当你发送包含数据的segment，你将需要push into _segments_out 这个队列，并且持有在内部数据结构一份复制品，这样你才能持续跟踪发送出去可能需要重传的segment。这并不是非常浪费，因为segment的payload通过引用计数只读字符串（Buffer对象）的方式存储。因此不需要担心，并不是真正复制payload中的数据。

- 在获得一个ACK之前，我的TCPSender应该假设接受者的窗口大小是多大？

    1字节

- 如果一个ACK只是确认部分传出的segment已经被接收到，我该做什么？我应该剪切掉那些已经被传输的部分吗?

    TCP发送器有这个能力，但是为了这门课的目的，没必要搞那些花里胡哨的。将每个segment当做是被完全"outstanding"，直到被完全接收到（占用所有的序列号都小于ACK）

- 如果我发送了三个独立的segment，包含“a","b","c",但他们都没被确认接受，我能在之后发送一个更大的segement包含“abc"吗？或者还是一个一个单独传送？

    依然是这个问题：TCP发送器有这个能力，但不用考虑那么多。只需要独立跟踪每个segment，当重传计时器超时，重新发送最早的segment。

- 我应该在记录发送端的数据结构里面存储空的段并且在必要的时候发送它们吗？

    不，只有那些传输了一些数据，在连续空间消费了长度的segment需要记录并且在必要的时候重传。并不真正写入TCP接收器的（比如没有数据的，SYN和FIN）不需要被记录和重传。

## tricky part

中间让我最头疼的一个部分，这里几乎让我推倒了之前的思路（直接在fill_window中填充数据并且立即发送），但是这个test case 居然在fill_window之后还不发送，而是等到第一个ACK之后才发送，当时觉得得获取到对方的window_sizz之后才能发送，但是之前的test case似乎又没有这个逻辑，之前的逻辑都是ASAP。我的关注点一直在于获取到对方的window size之后才能发送，事实上这里的问题是，没有收到第一个ACK，也就是Sender还没确认连接，所以无法发送任何数据！

我几乎重构了我的代码，在fill_window填充到内部的数据结构，在ack_received以及tick内发送数据...导致为了通过这个case，让前面的test case全部挂了...

指的反思的一点是：关键点一定要commit，否则重构代码有可能弄乱之前的逻辑，发现这条路走不通以后又得改回去。

```c++
        {
            TCPConfig cfg;
            WrappingInt32 isn(rd());
            const size_t rto = uniform_int_distribution<uint16_t>{30, 10000}(rd);
            cfg.fixed_isn = isn;
            cfg.rt_timeout = rto;

            TCPSenderTestHarness test{"Don't add FIN if this would make the segment exceed the receiver's window", cfg};
            test.execute(ExpectSegment{}.with_no_flags().with_syn(true).with_payload_size(0).with_seqno(isn));
            test.execute(WriteBytes("abc").with_end_input(true)); // <=== hard part
            test.execute(AckReceived{WrappingInt32{isn + 1}}.with_win(3));
            test.execute(ExpectState{TCPSenderStateSummary::SYN_ACKED});
            test.execute(ExpectSegment{}.with_payload_size(3).with_data("abc").with_seqno(isn + 1).with_no_flags());
            test.execute(AckReceived{WrappingInt32{isn + 2}}.with_win(2));
            test.execute(ExpectNoSegment{});
            test.execute(AckReceived{WrappingInt32{isn + 3}}.with_win(1));
            test.execute(ExpectNoSegment{});
            test.execute(AckReceived{WrappingInt32{isn + 4}}.with_win(1));
            test.execute(ExpectSegment{}.with_payload_size(0).with_seqno(isn + 4).with_fin(true));
        }
```


## 终于能看懂这篇文章

[TCP 为什么是三次握手，而不是两次或四次](https://www.zhihu.com/question/24853633/answer/115173386)

---------------------------------

## Part2. 重新学习
进入Lab4之后感觉自己写的很乱，全是面向测试编程，参考学习了别人的笔记，看看别人是怎么思考的。

TCPSender主要有三个功能需要实现：
- ack_received 接收到remote发过来的ack，决定是否更新自身窗口值，重启定时器等
- fill_window 这个fill_window我理解实际上是填充remote window，根据当前Sended的状态来发送segment
- timer 超时重传定时器

## 2.1 ack_received

自动重传有两种协议，一种是停止等待协议，另一种是流水线（pipelining)协议，这里需要实现的自然是效率高的pipelining,常见的pipelining的协议有两种：

1. **Go-Back-N protocol**
2. **Selective Repeat protocal**

维护一个Silding window，size = 1采用Go-Back-N, size > 1 采用 Selective Repeat

```
Go-Back-N
发送 N, N + 1, N + 2
Sliding window = [N], wait for ACK = NextSeqNumber， 如果ACK = NextSeqNumber超时，将会重传N，N + 1,N + 2

Seletive Repeat
发送 N, N + 1, N + 2
Sliding window = [N, N + 1, N + 2], wait for ACK = N + 1, N + 2, N + 3
如果ACK = N + 1 超时，超时前接收到ACK = N + 2, N + 3
将会重传只重传N 这个segment

```

这里是《自顶向下》的原文，跟实验文档对应上了：

> Thus, TCP's error-recovery mechanism is probably best categorized as a hybrid of GBN & SR protocols

**TCP 超时机制更像是二者的结合，TCP本地只维护一个`NextSeqNumber`（Go-Back_N)，通过`SendBase`（初始值）和`NextSeqNumber`来确认哪个包没收到，从而只重传没收到的初始包(Seletive Repeat)。**


```
// 发送窗口
sender_window = [sendBase, _next_seqno]
```

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4121c73338240c49f071977bac55524~tplv-k3u1fbpfcp-watermark.image?)

那么对于sender:

1. 如果收到的ack不属于发送窗口的范围，将直接忽略。
2. 如果收到的ack属于这个范围，那么这个ack的含义是之前的所有segment都被确认接收到了，重传队列里应该移除ACK之前的segment。

## 2.2 fill_window

首先TCP Sender是有以下状态需要维护的：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97024277dfad4d96be28cbc80910bb72~tplv-k3u1fbpfcp-watermark.image?)

那么fill_window需要根据这些状态决定发送哪些segment。


## 2.3 timer

- 超时了重传哪个segment?

    根据2.1 的描述，如果出现超时的情况，重传sendBase对应的segment。

- 定时器开启，关闭的时机

RFC6298:
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/196d4e516bbf4a749fff1f679f15285f~tplv-k3u1fbpfcp-watermark.image?)


## 参考

[计算机网络学习笔记-CS144](https://tarplkpqsm.feishu.cn/docx/doxcnpBEN4SG3vA9pVyCoANigBh)

[康宇's blog](https://www.cnblogs.com/kangyupl/p/stanford_cs144_labs.html)

[Lexssama's Blogs](https://lexssama.github.io/2021/04/08/CS144-lab3/)

[RFC 6298](https://datatracker.ietf.org/doc/rfc6298/?include_text=1)


