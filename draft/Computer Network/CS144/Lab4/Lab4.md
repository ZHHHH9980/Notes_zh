# Lab4

## 翻译

## 要做什么

`TCPConnection`是一个包罗万象的模块，组合了`TCPSender`以及`TCPReceiver`，并且负责连接的全局管理。连接中的TCP段能够被封装成UDP/IP数据报，使你的代码能够数以亿计的电脑使用TCP语音交流。

简短的注意事项: `TCPConnection`几乎只是组合了之前实验中实现的几个模块，`TCPConnection`本身实现不超过100行代码。如果你的发送器和接收器足够健壮，这将是一个简短的lab。否则，你将需要花费大量时间debug，我们鼓励你将读test code作为最后手段。（对不起，我只能面向测试编程）。

回想一下：TCP 可靠地传送一堆流量控制的字节流，每个方向一个。两方参与TCP链接，每一方同时充当发送方和接收方。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/635b58e53d4942409a4e134a524efc65~tplv-k3u1fbpfcp-watermark.image?)

上图的两个部分称作连接的两个端点，你的`TCPConnection`充当其中一端，负责接收和发送帧，确保发送方和接收方收到并且有机会参与修改他们关心的字段。

接下来是`TCPConnection`需要遵守的基本原则：

**接受帧(segments)。**如上图所示，当`resment_received`这个方法被调用，`TCPConnection`从Internet中接收`TCPSegments`并且做如下操作：

- 如果RST这个标志已经被设置，让输入和输出流进入错误状态并且永久终止连接。
- 将segments提供给`TCPReceiver`，让它检查它所关心的字段：seqno,SYN,payload,以及FIN。
- 如果ACK这个标志被设置，通知`TCPSender`它关心的字段：ackno以及window_size。
- 如果接受的segment占用了任意的序列号，`TCPConnection`确保至少发送一个segment作为回复，给予一个ackno和window sizd的更新反馈。
- 有一个额外的case是需要`TCPConnection`中的`segment_received()`这个方法额外处理的：去响应一个"keep-alive" segment。一端可能选择发送一个非法的序列号segment用于查看你的TCPConnection是否仍然存活。你的TCPConnection应该回复这些"keep-alive"帧，即使他们并不占用任何序列号。实现代码有点像下面这段：

```
if (_receiver.ackno().has_value() and (seg.length_in_sequence_space() == 0)
and seg.header().seqno == _receiver.ackno().value() - 1) {
_sender.send_empty_segment();
}
```

**发送帧。** `TCPConenction`将基于Internet发送`TCPSegment`：

- 任何时候 TCPSender 已经将一个段推入outgoing queue，并设置了它负责传出段的字段：（seqno、syn、payload 和 fin）。
- 在发送segment之前，`TCPConnection`将向`TCPReceiver`获取它负责的字段：ackno和window_size。如果有ackno，将在TCPSegment中设置ACK这个标志位。

**当时间流逝** `TCPConection`将通过操作系统定期调用`tick`方法。这时候，`TCPConnectoin`需要做：
- 告诉`TCPSender` 过了多久。
- 如果连续重传的次数超过限制值，放弃这个连接，并且发送一个重置segment去到另一端。
- 如有必要，结束连接。

最终，整个`TCPSegment`的架构大概如下，发送放写入以及接收方写入的字段使用不同的颜色：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/38e54c27f60947aa9bae7053ffd2f3ca~tplv-k3u1fbpfcp-watermark.image?)

需要花费一些时间浏览整个class文档。大部分的实现主要是参与将TCPSender以及TCPReceiver适时地协调在一起。繁重的工作尽可能交给TCPSendey以及TCPReceiver，然而并非所有的事情都可以这样做，还是有麻烦的部分需要TCPConnection自己解决，比如一些涉及全局行为的微妙之处。最困难的部分是决定何时终止TCPConnection，并且声明它不再活动。

## FAQ 

- 我该怎么开始？

也许最好的方式就是从TCPSender和TCPReceiver的一些方法中进行适配，比如：`remaining_outbound_capacity()`，`bytes_in_flight()`和`unassembled_bytes`。
之后将选择一些写入的方法：`connect`，`write()`以及`end_input_stream`。这些方法也许需要操作outbound ByteStream（TCPSender持有的）以及通知TCPSender。

- 应用如何从内部stream读取数据？

`TCPConnection::inbound_stream()`已经在头文件中被实现。不需要做任何额外的操作。

- TCPConnection需要任何数据结构和算法吗？

不，真的不需要。困难的部分已经交给你已经实现的TCPSender和TCPReceiver。这里的工作只是去适配所有事情，解决一些连接范围内的细节，这些细节不被Sendeh和Receiver考虑在内。

- TCPConnection如何知道时间过了多久？

类似TCPSender的tick方法，不需要使用如何方法去获取时间。

- 如果来了一个RST segment, TCPConnection需要做什么?

reset flag 意味着立刻结束连接。如果你接收到了一个RST segment，你应该在inbound和outbound ByteStreams中设置error flag，任意连续调用`TCPConnection::active()`都应该返回false。

- 我该什么时候发送一个RST segment？

有两个场景你需要终止整个连接：
1. 如果发送方连续重传失败
2. TCPConnection 销毁器已经调用而连接仍然活跃(active() return true).发送一个RST segment跟接收一个的效果类似：连接已经失效，两边的ByteStream都该进入错误状态。

- 等等，我如何发送一个RST segment？序列号是什么？

发送一个segment需要一个合适的序列号。你需要调用TCPSendeq去生成一个有合适序列号的空segment（通过调用 `send_empty_segment()`）这个方法。或者你可以让他进入发送窗口。

- ACK flag设置的目的是什么？ 不总是有一个ackno？

几乎所有的TCPSegment有ackno，并且设置了ACK这个标志位。但有一个例外是连接最开始的时候，在receiver需要确认接收到任何帧之前。

- 如果TCPReceiver想要通告一个大于TCPSegment::header().win字段的窗口大小，我应该发送什么window size?

发送你能发送最大的，你会发现`std::numeric_limits`这个类会有帮助。

## TCP连接的终止：达成共识需要费一些劲

TCPConnection一项重要的工作是决定何时结束连接。当这件事发生时，它会释放它占用的本地端口号，对传入的segment停止发送ack，考虑让连接终止，让它的`active()`方法返回false。

有两种方式让一个连接终止。在不正常的关闭中，TCPConnection发送或接受了设置了rst的segment，在这种情况下inbound or outbound ByteStream都应该立即处于错误状态，active()应该立即返回false。

一个完全关闭是不出错的情况下结束。这更加复杂，但是这很美妙因为尽可能保证了两个字节流已经完全可靠地传输给接收方。在下一节，当一个完全关闭发生，我们会给出一个实际的反馈。

由于两军问题，不可能保证两边的对等点都能完全关闭，但是TCP非常接近。接下来会描述如何做到。从一端的视角(一个连接，我们称作本地peer)，与远程对等点连接完全关闭有四个前置条件：

1. inbound stream 已经完全重组并且结束
2. outbound stream 已经被本地应用终止，并且发送了一个FIN segment给远程对等点。
3. outbound stream 发送的数据都被远端确认接收到了。
4. local TCPConnection 非常自信远端对等点也能够满足前置条件#3，有两种替代的情况发生：
    选项A：两个stream结束后拖延一会。前提条件1和3是true，以及远端对等点似乎已经收到了整个stream的ack。本地对等点没法确定，因为TCP不会发送可靠的ack，也就是不会ack acks。但是本地对等点非常自信远端对等点已经收到它的ack，因为远端对等点似乎不重传任何东西，之后本地对等点稍等一会（等对方的定时任务）来确认以上情况。

    准确描述如下，当1和3已经满足，以及自从本地对等点收到任一segment已经过了至少十次初始重传超时的时间间隔，那么一个连接已经结束。这被称作(lingering)在两个stream结束之后，来确保远端的对等点并没有尝试重传任何我们需要的数据。这意味着TCPConnection需要存活一段时间，占有一个本地的端口号并且还存在可能去响应接收到的segment，即使TCPSender和TCPReceiver已经完全结束了它们的工作，两个streams也都结束。

    选项B：被动关闭。当1和3已经满足，本地对等点可以100%确认远程对等点满足前提条件3。这为什么可行？因为远端对等点是首先去结束这个流的。

    底线是，如果 TCPConnection 的inbound stream 在 TCPConnection 发送 fin 段之前结束，则 TCPConnection 不需要在两个流完成后停留。(这种情况我思考了一下，是因为如果远端没有接收到Fin也无所谓，因为远端会停留一段时间，作为本地不需要care是否接收到也会主动关闭的)


### 一个TCP连接的终止（实践总结）

实际角度上意味着你的TCPConnection拥有一个成员变量`_linger_after_streams_finish`，暴露给外部。这个变量开始为true，如果在TCPConnection在它的outbound stream达到EOF之前，inbound stream结束了，这个变量需要设置为false。（也就是接收流在发送流之前结束）

前提条件1和3满足的任何时候， `linger_after_streams_finish` 为 false,连接结束。否则你需要拖延：只有在收到最后一个段后经过了足够的时间（10 × cfg.rt 超时）后，连接才会完成。

## 全局状态管理

参考了其他同学的博客，多多少少都提到了要维护 TCPConnection 的一个全局状态，这个状态对应着 TCPSender 以及 TCPReceiver 处于何种状态。具体可参考`tcpstate.cc`。

拿`tcpstate.cc`一部分代码代码举例，此时`TCPConnection`处于`FIN_WAIT_1`这个状态，那么receiver和sender对应的状态就是`SYN_RECV`以及`FIN_SENT`。

```c++
case TCPState::State::FIN_WAIT_1:
    _receiver = TCPReceiverStateSummary::SYN_RECV;
    _sender = TCPSenderStateSummary::FIN_SENT;
    break;
```
## 状态流转控制

这个点非常让人头疼，一开始即便看了其他人的博客也很晕，主要是因为这张图:
![tcpConnectionState.png](https://img2020.cnblogs.com/blog/1608954/202009/1608954-20200914214827124-2104730079.png)

虽然上边有不同颜色箭头表示是Client端和Server端，但是尤其到`FIN_WAIT1`等挥手阶段，就有点不知所措，直到我看到下面这两幅图才清晰一些：

![image.png](https://kiprey.github.io/2021/11/cs144-lab4/20180328001537836.jpg)
![image.png](https://kiprey.github.io/2021/11/cs144-lab4/20180328001111303.jpg)

在接收到segment的时候，可以直接根据当前的sender和received的状态做出判断，比如下面这段就可以直接处理Server端：`LISTEN` -> `SYN_RCVD`。
```c++
void TCPConnection::segment_received(const TCPSegment &seg) {
    // 如果是 LISEN 到了 SYN
    if (TCPState::state_summary(_receiver) == TCPReceiverStateSummary::SYN_RECV &&
        TCPState::state_summary(_sender) == TCPSenderStateSummary::CLOSED) {
        // 此时肯定是第一次调用 fill_window，因此会发送 SYN + ACK
        connect();
        return;
    }
}
```

基本的思路就是：只要按照上面那两幅图先把常规流程实现，再慢慢补充细节和错误处理即可。