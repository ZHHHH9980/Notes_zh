
# C144 Lab
2022.12.25
Lab0直接把我劝退，后来恶补了《计算机网络：自顶向下》这本书（B站有配套视频）才敢再次来挑战，作为一个前端，只会JS，真的是充满了挑战..

12.27 想法都有，只是对于C++语法的陌生，让我不得不一直google查询一些api来支持我的实现，然后js是不关注类型的，虽然面向对象有接触过，读起来依然有些吃力。

12.28 好几天了，中间有其他事情干扰，不过还是完成了，这次是第二次尝试，不再像刚开始那样随便放弃了，还是挺有成就感的~

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee66683e040c4a079e79bb2982fca442~tplv-k3u1fbpfcp-watermark.image?)

## 实验准备

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8bdc6b6eee3b4b4497d00a03a8fc3690~tplv-k3u1fbpfcp-watermark.image?)

由于我用的是M2的Macbook，直接使用VirtualBox会报错，幸好CS144给了一个备用方案，UTM+image的组合也能够运行~

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ac5770eb4a54bf58bfb52ab4e18da25~tplv-k3u1fbpfcp-watermark.image?)

试了一下，UTM 还是太弱了，需要自己配置网络，连DNS都无法解析。
还是得用`VirtualBox`，只好明天去公司换电脑...

CS144已经为我们配置好了SSH，只要启动虚拟机即可在Vscode上连接，cool！

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17dbb677c188412eb8e9c7b560b83b93~tplv-k3u1fbpfcp-watermark.image?)

（vscode通过SSH远程连接本质上是让我们使用vscode来编写代码，真正调用API还是得在虚拟机上）

## 调试

调试我参考了这篇文章中的vscode配置，我理解debug在编程中是必须的，即使是写JS代码我都选择用vscode调试，而不是`console.log`

https://www.cnblogs.com/kangyupl/p/stanford_cs144_labs.html

## Lab0
说实话第一次做Lab0都有点把我劝退了，全英文文档，看的我有些吃力，而且不太能get到到底我要做什么才能完成任务，为了先完成一个Lab参考了好几份别人的答案才完成。现在间隔大概四五个月我再次打开Lab0的doc，不太确定是不是完善了doc，感觉没有那么困难了。


### webget
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2051ee06ddd4f64aec4924dc2fc60a2~tplv-k3u1fbpfcp-watermark.image?)

文档说的非常清楚了，让我们读sponge的文档，并且特别注意`FileDescriptor`,`Socket`,以及`TCPSocket`和`Address`这些类。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a60ca7fe19d43df9bda8c8395914ad1~tplv-k3u1fbpfcp-watermark.image?)

其实三个类是有继承关系的。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8c2c0ca1f0743548af527c531c55952~tplv-k3u1fbpfcp-watermark.image?)
说的也很清楚了，需要用TCP作为支持去建立链接发生请求，并且接收数据，像之前发送HTTP请求那样。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/acf778b42b534bdda7b98e5589194dee~tplv-k3u1fbpfcp-watermark.image?)
要用什么类和注意点都说了。

关于使用TCPSocket，突然想到《计算机网络：自顶向下》这本书上的Socket Programming 有关TCP的部分。

client端,python代码是这样的：
```python
from socket import *
serverName = 'servername'
serverPort = 12000

clientSocket = socket(AF_INET, SOCK_STREAM)
clientSocket.connect((serverName, serverPort))

sentence = raw_input('Input lowercase sentence:')
clientSocket.send(sentence.encode())
modifiedSentence = clientSocket.recv(1024)
clientSocket.close()
```

server端：
```python
from socket import *
serverPort = 12000
serverSocket = socket(AF_INET, SOCK_STREAM)
serverSocket.bind(('', serverPort))
serverSocket.listen(1)
```

当时想也没想，傻傻把server端的代码直接抄上去了，还在那儿bind，问题就出在没理解发送请求的到底是哪一端，我作为发送请求方，当然是用client端的代码。

TCPSocket下有个connect方法，接收Address类作为参数：
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/609052349dfa447caadeed8c80256938~tplv-k3u1fbpfcp-watermark.image?)

Address有好几个构造函数，其中比较符合的就是红框那个，因为`get_URL`会给提供`hostname`，但是`service`这里真的难到我了，我以为就是把`path`传进去...结果test怎么也不过。
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b03e6b2132ef4c0284026e6cc95c3a7e~tplv-k3u1fbpfcp-watermark.image?)

没想到答案藏在`address.cc`这个文件里，里面有Address函数对于servicd的注释.. 是来自于`etc/services`这个文件。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53acf541fdca4a14a6d0aeb4d37d93a1~tplv-k3u1fbpfcp-watermark.image?)


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5576d9f2330f46b091a03b67989da6b0~tplv-k3u1fbpfcp-watermark.image?)
后面的80/tcp代表的是http协议对于tcp socket的默认端口号（书上有）

因此才能得到下面这两行代码：
```c++
void get_URL(const string &host, const string &path) {
    TCPSocket socket;
    socket.connect(Address(host, "http"));
}
```

之后是发送请求了，socket有`write`这个方法，是继承自`fileDescriptor`，`fileDescriptor`在听郑烇老师讲课的时候好像提过，就像是一个文件的指针，我们操作一个`fileDescriptor`就像是在操作文件，那么socket继承了这个类，就像是两扇门一样，这边写入，另一边就能读取。

> 敲代码的时候还有一个尴尬的点是，C++不像js那样''/""都可以表示字符串，C++只能用""表示字符串，因此我拼接的时候一直报错... 看了一下example才反应过来..

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
    // eof 在 fileDescriptor中有这个api 标识是否读取到文件末尾
    // 其实这里想表示的就是Socket做了一层抽象，就像IO读取文件一样
    // 数据从网络的一端读取到另一端
    while (socket.eof() == false) {
        std::cout << socket.read();
    }

    socket.close();
}

```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6127f9dad9440dfa3b987e875c2f6ac~tplv-k3u1fbpfcp-watermark.image?)

### An in-memory reliable byte stream 内存中的可靠字节流

大意是实现一个抽象：两端都可以读写的字节流，这个字节流会在有限的内存中被读取，那么必须解决一个问题就是：字节流的大小超过了内存限制。让我想到类似队列的机制，队尾进，队头出，如果队列满了就先不读取，空了再读。

Lab里面描述的最后一段也是大概这个意思：
> . An object with a capacity of only one byte could still carry a stream that is
terabytes and terabytes long, as long as the writer keeps writing one byte at a time and the
reader reads each byte before the writer is allowed to write the next byte.

一开始是想用C++ 中的Queue数据结构，没想到这个数据结构没有api能支撑`peek`头部的多个字符。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8eb71e9c3b924898a7b5a1791e4fce9a~tplv-k3u1fbpfcp-watermark.image?)

看了下`Deque`里面有个api是头部迭代器`cbegin()`，看了下实例应该能实现我们的需求~

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eee1024bc05c4b959c45658b186de067~tplv-k3u1fbpfcp-watermark.image?)

让我卡住很久的地方就是class的声明，我一直在用JS构造函数的方式在创建一个新的双端队列，但是一直不成功，报错提示获取不到对象。
后来只能参考一个大佬的代码才把双端队列创建出来，并且成功在成员函数中访问~

```c++
class ByteStream {
  private:
    size_t _capacity = 0;
    size_t _byteswritten = 0;
    size_t _bytesread = 0;
    bool _inputEnded = false;
    std::deque<char> _queue = {}; // here
}
```
调试真的非常非常重要，接下来我都基本按照测试用例编程了.. 不过目前感觉lab0就是为了后面准备的。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ec1b7a542bb45e88935bd4620d49c66~tplv-k3u1fbpfcp-watermark.image?)


## conclusion

### webget
最后做个小总结，`webget`这个作业让我们用`TCP Socket`这个Api去发起HTTP请求读取数据，读取到数据是以`stream`（流）的形式返回的，那么会有一个`eof`作为流结束的标识来结束整个HTTP响应的获取。

### bytestream

我们总说TCP是基于字节流，那么到底什么是字节流？字节流就是维护了一块有限大小的队列（内存），在这块有限的内存中，通过控制写入和读取的量，就像水龙头一样可以控制流量，来确保所有的数据都能被成功传输而不超出内存限制。


### code

```c++
#include "byte_stream.hh"

#include <deque>
#include <iostream>

// Dummy implementation of a flow-controlled in-memory byte stream.

// For Lab 0, please replace with a real implementation that passes the
// automated checks run by `make check_lab0`.

// You will need to add private members to the class declaration in `byte_stream.hh`

template <typename... Targs>
void DUMMY_CODE(Targs &&.../* unused */) {}

using namespace std;

ByteStream::ByteStream(const size_t capacity) { _capacity = capacity; }

size_t ByteStream::write(const string &data) {
    if (_queue.size() == _capacity) {
        return 0;
    }

    size_t remainCapacity = _capacity - _queue.size();
    size_t realCount = remainCapacity >= data.length() ? data.length() : remainCapacity;
    _byteswritten += realCount;

    for (size_t i = 0; i < realCount; i++) {
        _queue.emplace_back(data[i]);
    }

    return realCount;
}

//! \param[in] len bytes will be copied from the output side of the buffer
string ByteStream::peek_output(const size_t len) const {
    string str;

    for (size_t i = 0; i < len; i++) {
        str += *(_queue.cbegin() + i);
    }

    return str;
}

//! \param[in] len bytes will be removed from the output side of the buffer
void ByteStream::pop_output(const size_t len) {
    for (size_t i = 0; i < len; i++) {
        _queue.pop_front();
        _bytesread++;
    }
}

//! Read (i.e., copy and then pop) the next "len" bytes of the stream
//! \param[in] len bytes will be popped and returned
//! \returns a string
std::string ByteStream::read(const size_t len) {
    size_t count = len;
    string str;
    while (!_queue.empty()) {
        if (count > 0) {
            count--;
            str += _queue.front();
            _queue.pop_front();
            _bytesread++;
        }
    }

    return str;
}

void ByteStream::end_input() { _inputEnded = true; }

bool ByteStream::input_ended() const { return _inputEnded; }

size_t ByteStream::buffer_size() const { return _queue.size(); }

bool ByteStream::buffer_empty() const { return _queue.empty(); }

bool ByteStream::eof() const { return _inputEnded && _queue.empty(); }

size_t ByteStream::bytes_written() const { return _byteswritten; }

size_t ByteStream::bytes_read() const { return _bytesread; }

size_t ByteStream::remaining_capacity() const { return _capacity - _queue.size(); }

```