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

