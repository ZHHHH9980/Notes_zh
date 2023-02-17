# TCP

## 总览-TCP的构成

![Figure.1](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/73a28253bb294627b32605addddfeeb2~tplv-k3u1fbpfcp-watermark.image?)

整个实验都将围绕这幅图展开，一步一步实现图中的每一个部分，最终组成一个可以让两台计算机具有可互操作性的`TCPSocket`。

## Lab0
### webget

### TCPSocket能做什么？
HTTP是基于TCP的请求，实验的热身部分会让我们用`telnet`发送一个HTTP请求，那么webget将在代码层面基于`TCPSocket`发送一个HTTP请求，让我们理解实现一个`TCPSocket`能做什么。

webget.cc
```c++
void get_URL(const string &host, const string &path) {
    TCPSocket socket;
    socket.connect(Address(host, "http"));
    socket.write("GET " + path + " HTTP/1.1\r\n");
    socket.write("Host: " + host + "\r\n");
    socket.write("Connection: close\r\n");
    socket.write("\r\n");

    // Then you'll need to print out everything the server sends back,
    // (not just one call to read() -- everything) until you reach
    // the "eof" (end of file).
    while (socket.eof() == false) {
        ::cout << socket.read();
    }

    socket.close();

    // cerr << "Function called: get_URL(" << host << ", " << path << ").\n";
    // cerr << "Warning: get_URL() has not been implemented yet.\n";
}
```

webget中，我们创建了一个`TCPSocket`实例，构建了一个GET请求，不断监听`socket.eof()`，获取所有的返回消息并且输出。

TCPSocket能做什么？当然是发送HTTP请求了！它是HTTP的核心部分，即使是HTTP/2都依赖TCP。

### ByteStream

Lab0第二部分主要是让我们实现一个`ByteStream`，TCP是基于字节流传输的。参考TCP构成的那副图片，字节流在TCP发送端与接收端都有使用：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/63a46f614025499cbd6be185df2b15b0~tplv-k3u1fbpfcp-watermark.image?)

那到底什么什么字节流？通过这个Lab可以对字节流有一个更清晰具体的认识。

具体实现：

byte_stream.hh
```c++
class ByteStream {
  private:
    // 容量
    size_t _capacity = 0;
    // 已经写入的字节数
    size_t _byteswritten = 0;
    // 已经读取的字节数
    size_t _bytesread = 0;
    // 用于存储字节的队列
    std::deque<char> _queue = {};
    // 标识字节流的输入是否已经结束
    bool _inputEnded = false;

    // ...
}
```

byte_stream.cc
```c++
ByteStream::ByteStream(const size_t capacity) { _capacity = capacity; }

size_t ByteStream::write(const string &data) {
    if (_inputEnded) {
        return 0;
    }

    size_t remainCapacity = _capacity - _queue.size();
    size_t realCount = remainCapacity >= data.length() ? data.length() : remainCapacity;
    _byteswritten += realCount;

    for (size_t i = 0; i < realCount; i++) {
        _queue.push_back(data[i]);
    }

    return realCount;
}

std::string ByteStream::read(const size_t len) {
    size_t count = len;
    string str;

    while (!_queue.empty()) {
        if (count == 0) {
            break;
        }

        count--;
        str += _queue.front();
        _queue.pop_front();
    }
    return str;
}
```

通过头文件定义以及字节流核心实现的API，可以得出字节流的特点：

1. 字节流可以读取和写入字节，本质上是操作内部维护的队列
2. 有固定的容量，写入的字节数不能超出这个容量
3. 基于这个容量维护了一个队列
4. 一旦`_inputEnded`标识为true，字节流不再支持写入

### 小节
我们总说TCP是基于字节流，那么到底什么是字节流？字节流就是维护了一块有限大小的队列（内存），在这块有限的内存中，通过控制写入和读取的量，就像水龙头一样可以控制流量，来确保所有的数据都能被成功传输而不超出内存限制。

## Lab1 

Lab1主要是实现一个字符重组器，由于segment是乱序到达的，那么只要给每个到达的子串添加一个索引，就可以知道他们在整个字符串里的位置，即使乱序到达也可以按照顺序拼接。

重组器和字节流的关系如图：
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/395544d72d15434ab3bba157ef511b89~tplv-k3u1fbpfcp-watermark.image?)

在重组器中会维护一个滑动窗口，容量为capacity，用于存储未读取的字符串（已重组和未重组），一旦从中读取，滑动窗口左移，继续接受子串。

实现思路大概是维护两个队列，一个用于存储字符串，一个用于标识当前索引是否已经接收到字符。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be8c9f8994984853acea264ad7309e94~tplv-k3u1fbpfcp-watermark.image?)


那么对于传入的子串需要考虑窗口容量，即子串index和length跟窗口expect_index和capacity的关系，有重叠的部分都需要截取。

实验的这部分实现主要是为了`TCPReceiver`提供重组乱序segment的能力。


## Lab2 
Lab2有两个组成部分：
1. 提供两个方法让32位和64位整型索引互相转换，也就是将64位索引压缩成32位放入TCP头部（节省传输字节大小）
2. 实现一个TCPReceiver

1.部分就不过多赘述了，看实验文档基本上能理解个大概，说实话这块后边都是看别人的代码，实在是想不到通过检查点进行四舍五入那部分操作。

### TCPSegment的组成


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ec6276a7aa64b6ab4a1f3542128ebc1~tplv-k3u1fbpfcp-watermark.image?)
TCP segement组成，非灰色的是TCPReceiver需要重点关注的字段。

### TCPReceiver

#### 状态流转

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/755a8116296648bd83cb2440f1e15316~tplv-k3u1fbpfcp-watermark.image?)
这个状态流转图一开始不知道有什么作用，甚至没有太多考虑它，直接面向测试编程，也能通过。但是其实并不难理解，就是处理接收到各种segments应有的状态，比如LISTEN态就是在等待SYN，如果先接收的不是SYN，而是带有数据的segment，那么应该直接丢弃，而不是将状态流转到SYN_RECV。

#### 犯的错误

TCPReceiveg顾名思义就是用来处理接收到的segments，由于是乱序到达，可能存在一些边界情况：
1. 带有data的segment到了，但是带有SYN的segment还没接收
2. 带有SYN和FIN的segment（占两个字节）到达了，但是没有足够的空间
3. ...

一开始写基本上是面向测试编程，就是按照正常情况和上述的一些边界case一点点往`segment_received`这个core api里补充。

我在这里犯了两个错误：
1. 面向测试编程，导致我没有太多思考，没有充分利用StreamAssembler的能力。
   
     StreamAssembler足够健壮，应该是能根据自身的窗口自动截取字符串，但我一直在`segment_received`里使用StreamAssembler.remain_capacity(); 来判断是否有足够空间装下这些字符...从而更新内部维护的`ackno`。
    甚至如果收到了带有FIN的segment还自己手动判断是否有足够空间，如果有再调用 StreamAssembler..stream_out().end_input();

现在回过头看真是太蠢了... 直接在`StreamAssembler.push_substring`里给eof标志即可。

```c++
void TCPReceiver::segment_received(const TCPSegment &seg) {
    auto header = seg.header();

    /* Status: LISTEN  */
    if (!header.syn && !_synReceived) {
        return;
    }

    bool eof = false;
    string data = seg.payload().copy();

    /* Status: SYN_RECV */
    if (header.syn && !_synReceived) {
        _ISN = header.seqno;
        _synReceived = true;

        /* Status: SYN_RECV -> FIN_RECV */
        if (header.fin) {
            _finReceived = eof = true;
        }

        _reassembler.push_substring(data, 0, eof);

        return;
    }

    /* Status: SYN_RECV -> FIN_RECV */
    if (_synReceived && header.fin) {
        _finReceived = eof = true;
    }

    // seqno -> absolute seqno -> stream index
    uint64_t checkpoint = _reassembler.ack_index();
    uint64_t abs_seq = unwrap(header.seqno, _ISN, checkpoint);
    uint64_t stream_index = abs_seq - 1;

    // push data into reassembler
    _reassembler.push_substring(data, stream_index, eof);
}
```

至于`ackno`只需要根据StreamAssembler预期的index(_reassembler.ack_index())以及它的状态即可判断，这里是参考其他人的代码，写的真的完美，直接对应上了实验文档：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a0422d3a1cfb43a990663e784bc7d11f~tplv-k3u1fbpfcp-watermark.image?)

```c++
optional<WrappingInt32> TCPReceiver::ackno() const {
    if (!_synReceived) {
        return nullopt;
    }

    // 这巧妙的转换。。。直接将三者完美关联起来
    // stream index -> absolute seqno -> seqno
    return wrap(_reassembler.ack_index() + 1 + (_finReceived && _reassembler.empty()), _ISN);
}
```

## Lab3

Lab3主要是实现TCPSender

> It will be your TCPSender’s responsibility to:

• Keep track of the receiver’s window (processing incoming acknos and window sizes)

• Fill the window when possible, by reading from the ByteStream, creating new TCP
segments (including SYN and FIN flags if needed), and sending them. The sender
should keep sending segments until either the window is full or the ByteStream is
empty.

• Keep track of which segments have been sent but not yet acknowledged by the receiver—
we call these “outstanding” segments

• Re-send outstanding segments if enough time passes since they were sent, and they
haven’t been acknowledged yet

• 一直跟进远端receiver的window(处理收到的ACK和window size)

主要就是通过这个api
```c++
bool TCPSender::ack_received(const WrappingInt32 ackno, const uint16_t window_size) 
```

• 通过从`ByteSream`中读取数据产生新的TCP segments（如果需要，得包括SYN和FIN）来及时填充window，并且发送它们。发送器应该一直保持发送segments直到窗口已经满了，或者字节流已经为空。

这块指的是`fill_window`的实现，在这个api根据远端的窗口大小进行数据填充和发送。

• 一直跟踪那些发送出去但是没收到ACK的segment，我们称为 "outstanding" segment

• 如果在一定时间内发送了segment但还没收到ACK，重新发送 outstanding segments 

这块主要是timer的实现，指的就是TCP的超时重传

### TCPSegment

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d24abfee672240d58bbcdc44f15958e6~tplv-k3u1fbpfcp-watermark.image?)

TCPSender主要是关心除了灰色的部分，在不同的状态下填充对应的segment。

### 状态流转

一开始真不懂这个状态流转图有啥意义，但后来转过头发现如果不懂这个，完全面向测试编程，代码是非常糟糕的。
它描述了Sender的状态流转，以及不同状态下`fill_window`应该做些什么。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d5367d1ce4e4a2b8c5d47e9b58c7315~tplv-k3u1fbpfcp-watermark.image?)

### fill_window
作用：根据当前Sender状态填充发送窗口，并且发送segments

一些私有变量定义：
- _send_base 发送窗口左侧
- _next_seqno 下一个segment的绝对序列号
- _bytes_in_flight 已经发送出去并且未被ACK的字节数

```c++
void TCPSender::fill_window() {
    /*  status: CLOSED  -> waiting for stream to begin (no SYN sent)"; */
    if (_next_seqno == 0) {
        TCPSegment synSegment;
        synSegment.header().syn = true;
        send_segment(synSegment);
        return;

        /*  status: SYN_SENT  -> stream started but nothing acknowledged; */
    } else if (_next_seqno == _bytes_in_flight) {
        return;
    }

    size_t remote_window_size = _remote_window_size == 0 ? 1 : _remote_window_size;
    size_t remote_remain_size = 0;

    // 这里不会溢出是因为每次发送都不会超出远端接收窗口大小
    // _next_seq - _send_base 是发送端窗口大小
    while ((remote_remain_size = remote_window_size - (_next_seqno - _send_base))) {
        size_t size = min(remote_remain_size, TCPConfig::MAX_PAYLOAD_SIZE);
        TCPSegment segment;

        /* status: SYN_ACKED = "stream ongoing" */
        if (!_stream.eof()) {
            segment.payload() = Buffer(_stream.read(size));

            // 恰好读取完毕 并且远处还有多余的空间可以放FIN
            if (_stream.eof() && remote_remain_size - segment.length_in_sequence_space() > 0) {
                segment.header().fin = true;
            }

            if (segment.length_in_sequence_space() == 0) {
                return;
            }

            send_segment(segment);
        }
        /* status: SYN_ACKED = "stream has reached EOF, but FIN flag hasn't been sent yet" */
        else if (_stream.eof()) {
            // remember that SYN and FIN flags each occupy one sequence number
            if (_next_seqno < _stream.bytes_written() + 2) {
                segment.header().fin = true;
                send_segment(segment);
            }
            /* status: FIN_SENT & FIN_ACKED */
            else {
                _fin_acked = true;
                return;
            }
        }
    }
}
```

1. status: SYN_ACKED等这些状态的判断条件都在`tcp_state.cc`里面。
2. _next_seqno - _send_base即发送端窗口大小，这个窗口大小不能超过远端窗口大小，参考《自顶向下》：
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bbbaeea683f640489ab4e00fc9e0ecc8~tplv-k3u1fbpfcp-watermark.image?)
3. 即使远端窗口大小=0，也要默认为1
    > If the receiver has announced a
window size of zero, the fill window method should act like the window size is
one. The sender might end up sending a single byte that gets rejected (and not
acknowledged) by the receiver, but this can also provoke the receiver into sending
a new acknowledgment segment where it reveals that more space has opened up
in its window. Without this, the sender would never learn that it was allowed to
start sending again.

本质上是通过类似心跳的机制，不断获取最新的远端窗口的值，来确认何时可以发送数据。

### send_segments

作用：发送segments，记录已经发送的segments，更新成员变量

1. 更新_bytes_in_flight 以及 _next_seqno
2. 我们需要在内部维护一个队列_segments_track，用于超时重传;
3. _segments_out.push表示发送出去。

```c++
void TCPSender::send_segment(TCPSegment &seg) {
    seg.header().seqno = wrap(_next_seqno, _isn);
    _bytes_in_flight += seg.length_in_sequence_space();
    _next_seqno += seg.length_in_sequence_space();

    _segments_track.push(seg);
    _segments_out.push(seg);

}
```

### ack_received

这里的ack_received原本返回值应该是void，但是改成了bool，主要是为了之后通知上层TCPConnection是否接收到了合法的ackno。

```c++
bool TCPSender::ack_received(const WrappingInt32 ackno, const uint16_t window_size) {
    uint64_t abs_ackno = unwrap(ackno, _isn, _send_base);

    // invalid ack
    if (abs_ackno > _next_seqno) {
        return false;
    }

    _remote_window_size = static_cast<size_t>(window_size);

    if (abs_ackno <= _send_base) {
        return false;
    }

    // 能进入这个逻辑说明
    // abs_ackno > sendBase对应的ack(_ackno) && abs_ackno < _next_seqno
    // 发送窗口可以右移
    _send_base = abs_ackno;

    while (!_segments_track.empty()) {
        TCPSegment seg = _segments_track.front();

        // seg.seqno + seg.length > ack 说明该seg还没被确认接收，终止出队
        if (ackno.raw_value() <
            seg.header().seqno.raw_value() + static_cast<uint32_t>(seg.length_in_sequence_space())) {
            break;
        }

        _bytes_in_flight -= seg.length_in_sequence_space();
        _segments_track.pop();
    }

    // sendBase 左移，继续填充发送窗口
    fill_window();

    return true;
}
```

前半部分还是围绕这幅图，看看ackno是否合法（落入发送窗口范围）：
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bbbaeea683f640489ab4e00fc9e0ecc8~tplv-k3u1fbpfcp-watermark.image?)

如果是合法的，那么就右移滑动窗口，并且把已经确认接收到的segment从`segment_track`里面移除。
ack了发送的segment之后，窗口又有了新的空间，继续`fill_window`发送数据。

### timer 

文档里推荐计时器单独写一个类。

1. 调用时机以及重置等操作可参考 RFC6298:
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/196d4e516bbf4a749fff1f679f15285f~tplv-k3u1fbpfcp-watermark.image?)

2. 重传机制
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

3. 拥塞控制

     计时器有一个特点，就是超时后如果远端窗口大小不为0，那么说明网络可能发生拥塞，那么需要double RTO，这就是TCP拥塞控制。

    具体实现：
```c++
class TCPTimer {
  private:
    // 是否开启
    bool _start;

    unsigned int _initial_RTO;
    unsigned int _current_RTO;
    unsigned int _pass_time;

  public:
    // 重传次数
    unsigned int retransimission_count;

    TCPTimer(unsigned int rext_timeout)
        : _start(false)
        , _initial_RTO(rext_timeout)
        , _current_RTO(rext_timeout)
        , _pass_time(0)
        , retransimission_count(0) {}

    bool running() { return _start; }

    void close() {
        _start = false;
        _pass_time = 0;
        _current_RTO = _initial_RTO;
        retransimission_count = 0;
    }

    void start() {
        _start = true;
        _current_RTO = _initial_RTO;
        retransimission_count = 0;
        _pass_time = 0;
    }

    void keepOrDouble_RTO_and_restart(const size_t window) {
        if (!_start) {
            return;
        }

        // 远端窗口还有空间，但是依然超时
        if (window != 0) {
            _current_RTO *= 2;
        }

        _pass_time = 0;
        retransimission_count += 1;
    }

    bool isTimeout(const size_t ms_since_last_tick) {
        if (!_start) {
            return false;
        }

        if (ms_since_last_tick + _pass_time >= _current_RTO) {
            return true;
        }

        _pass_time += ms_since_last_tick;

        return false;
    }
};
```

根据RFC添加部分计时器逻辑：

`send_segment`:
```c++
void TCPSender::send_segment(TCPSegment &seg) {
    seg.header().seqno = wrap(_next_seqno, _isn);
    _bytes_in_flight += seg.length_in_sequence_space();
    _next_seqno += seg.length_in_sequence_space();

    _segments_track.push(seg);
    _segments_out.push(seg);

    /*
    RFC 6298 5.1
    Every time a packet containing data is sent(including a retransmission), if the timer is not running, start it
    */
    // timer
    if (!_timer.running()) {
        _timer.start();
    }
}
```

`ack_received`:
```c++
bool TCPSender::ack_received(const WrappingInt32 ackno, const uint16_t window_size) {
    uint64_t abs_ackno = unwrap(ackno, _isn, _send_base);

    // invalid ack
    if (abs_ackno > _next_seqno) {
        return false;
    }

    _remote_window_size = static_cast<size_t>(window_size);

    if (abs_ackno <= _send_base) {
        return false;
    }

    // 发送窗口可以左移了
    _send_base = abs_ackno;

    /* RFC 6298 5.3
     when an ACK is received that acknowledges new data, restart the retransmission timer so that it will expire
     after RTO seconds
     */
    _timer.start();

    while (!_segments_track.empty()) {
        TCPSegment seg = _segments_track.front();

        // seg.seqno + seg.length > ack 说明该seg还没被确认接收，终止出队
        if (ackno.raw_value() <
            seg.header().seqno.raw_value() + static_cast<uint32_t>(seg.length_in_sequence_space())) {
            break;
        }

        _bytes_in_flight -= seg.length_in_sequence_space();
        _segments_track.pop();
    }

    // sendBase 左移，继续填充发送窗口
    fill_window();

    /*
    RFC 6298 5.2
    When all outstanding data has been acknowledged, turn off the retransimission timer
    */
    if (_segments_track.empty()) {
        _timer.close();
    }

    return true;
}
```

`tick`

```c++
bool TCPSender::tick(const size_t ms_since_last_tick) {
    if (!_timer.running() || !_timer.isTimeout(ms_since_last_tick)) {
        return false;
    }

    /*
    RFC 6298 5.2
    When all outstanding data has been acknowledged, turn off the retransimission timer
    */
    if (_segments_track.empty()) {
        _timer.close();
        return false;
    }

    _timer.keepOrDouble_RTO_and_restart(_remote_window_size);

    /*
    RFC 6298 5.4
    Retransmit the earliest segment that has not been acknowledged by the TCP receiver
    */
    _segments_out.push(_segments_track.front());

    return true;
}
```


## Lab4

