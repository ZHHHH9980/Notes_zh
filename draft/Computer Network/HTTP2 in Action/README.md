# HTTP2 in Action Overview

干货知识点总结

## 001、HTTP/1.1的基本性能问题

### 低效的HTTP/1.1

书上举了一个例子,一个简单的HTML页面带着一些文本和两张图片,假设客服端和服务端的往返时延在100ms：
```
client -> server => 50ms
server -> client => 50ms
```
处理单个请求需要10ms。

那么这个加载到渲染完整个HTML的时间大致如图：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4bdc3b88171846d482d677f0b53c5366~tplv-k3u1fbpfcp-watermark.image?)

处理HTML和图片仅花费60ms，然而网页数据传输却花费了300ms，占整个处理时间的80%。

从120ms的标志位开始，client发送了图片1的请求，却只能被阻塞，等到230ms这个位置收到了图片1的响应才能再次发送图片2的请求，再次等待一个往返时间。这个过程是非常低效的，也是HTTP/1.1的主要性能问题。

> By the way，提高带宽并不能解决延迟问题，这里的时延是由物理媒介（光信号传播）造成的，取决于两地之间的距离。就像是两个高速收费站，在已经畅通无阻的情况下，不管收费站多增多少个收费口，都无法改变两地之间汽车的行驶速度，性能瓶颈已经不在带宽上了。

> 这里还提到了Pipelining的概念，也就是不需要等到图片1响应结束，直接像流水线一样请求图片2，能够减少一个往返时延，但是这个东西从未真正实现

### 解决HTTP/1.1性能问题的方案

1. 使用多个HTTP请求
2. 合并HTTP请求

#### 使用多个HTTP请求

优势：与管道化技术不同，同时使用多个HTTP并发请求并不会有队头阻塞问题，因为每个HTTP请求各自独立，实现起来成本较低。

劣势：同时管理多个HTTP请求会增大客户端和服务器的开销，打开更多的TCP连接需要时间，并且维护链接需要更多的内存和CPU。因此浏览器一般在一个域名下会有六个并发请求的限制。

#### 合并HTTP请求

核心手段是合并一些文件，包括图片，CSS文件，JS文件等，从而减少HTTP请求次数，减少建立TCP连接等开销。

做前端的同学可能会比较有感受，合并多个小图标到一整张图片（雪碧图），然后通过CSS文件来控制显示整张图片的哪个小部分（切图），哈哈哈哈。

劣势：

- 比如首屏可能只用精灵图的几个小图片，但是却要下载整个精灵图，会影响FMP
- 如果合并的过多，文件过于臃肿，如果要改一行JS代码都需要重新下载整个合并文件。

### 背景

抛开背景谈技术就是耍流氓，为什么HTTP/1.1变得低效？

本质上还是因为目前网页的内容越来越丰富，需要加载的资源越来越多，不再是以前的纯文本加几张图片。现在的发展潮流，Web网页尤其是首屏就包含文字+图片+CSS样式文件+JS交互处理文件还有音视频文件等，HTTP/1.1的设计（一个HTTP包含一个TCP请求）难以支撑一下子并发请求太多资源。

### HTTP/1.1的其他问题

HTTP/1.1是一个简单的文本协议，即使消息体内可以包含二进制数据（图片等文件），但**请求和首部都要求是文本的形式**。文本可读性高，但对机器处理并不友好，处理起来相对复杂，效率较低。

由于可读性的文本不能高效编码导致消息较大，在早期只有单个的请求就无所谓，但现在请求越来越多，就会增加传输的负担，降低效率。

并且HTTP首部应用范围广，会带来很多重复性问题。
比如，如果只有首页需要cookie进行身份校验等，但每个发向服务器的请求都会带上cookie。同时还会有一些安全校验的的首部`Content-Security-Policy`，每次发送请求都需要带上，进一步突出了效率低下的问题。

总的来说HTTP/1.1有以下问题

- 性能（并发限制）
- 安全（明文传输）
- 无法包含状态

# HTTP2

### HTTP2对Web性能影响

书中举了一个[例子](https://https.tunetheweb.com/performance-test-360/)，同时加载360张图片，使用HTTP/1.1和HTTP2的效果差异：

![image.png](https://s2.loli.net/2023/03/03/ruqdzAoHFnkc2sY.png)

从这个例子可以得出两个结论：
- 在大量请求数的情况下，HTTP2的性能优于HTTP/1.1
- HTTPS对比HTTP并不会消耗太多性能

通过chrome的抓包工具分析：

- HTTP/1.1：最多六个并发请求，并且得等待上一次请求响应才能发起下一次请求
![image.png](https://s2.loli.net/2023/03/03/mQptKTDh5egjcH2.png)

- HTTP2：没有阻塞的情况，几乎是同一时间并发完成请求
![image.png](https://s2.loli.net/2023/03/03/bzKpkUlL2wNdgsB.png)

但是有一个点是，HTTP2也是有并发数限制的，在这个例子中也不是并发同时请求360幅图片：

![image.png](https://s2.loli.net/2023/03/03/k3QINZycl8ersDa.png)

即使使用H2也会有阻塞的情况，是由于并发数限制带来的，但总体性能肯定是优于HTTP/1.1。

## 002 HTTP2协议基础

HTTP2作为一个大版本更新，跟1.1主要有以下区别：

- 二进制协议 (Binary protocol)
- 多路复用 (mutiplexed)
- 流量控制
- 数据流优先级(stream prioritization)
- 头部压缩(header compression)
- 服务端推送(server push)

### 使用二进制替代文本格式

使用基于文本的协议，要先发完请求，并且接收完响应之后才能开始下一个请求。而HTTP/2是一个完全的二进制协议，HTTP消息被分成清晰定义的数据帧发送。所有的HTTP/2消息都是用分块编码技术。

这里的帧和TCP的数据包有点类似，收到所有数据帧后，组合成完整的HTTP消息。

### 多路复用代替同步(synchronous)请求

HTTP/1是同步的、独占(single)的请求-响应协议。现代网络请求的情况下，网页通常包含上百个资源，通过并发请求获取，每个HTTP/1.1都需要建立TCP连接，开销非常大。

![image.png](https://s2.loli.net/2023/03/03/OxJLa1gEjntpKWv.png)

HTTP2允许在单个连接上是同时执行多个请求，每个HTTP请求获响应使用不同的流。通过使用二进制分帧层，给每个帧分屏一个流标识符，以支持同时发出多个独立请求。

![image.png](https://s2.loli.net/2023/03/03/HNaqG1sB6U4hJcM.png)

严格意义上来说，帧并不是同时发送的，比较还是基于TCP，在TCP连接上依然是依次发送，但重点是HTTP2请求发出后不需要阻塞到响应返回就可以发出新的请求。

每个请求都有一个新的、自增的流ID。返回相应时用相同的流ID，和HTTP连接一样，流是往返的。响应完成后，**流将被关闭**。这点跟HTTP/1.1不同，HTTP/1.1中的Connection: keep-alive会让连接保持打开，并且可以重新发送新的请求。

图4.2解释了两个基本原理：

- HTTP/2使用多个二进制帧发送HTTP请求和响应，使用单个TCP连接，以流的方式多路复用。
- HTTP/2与HTTP/1不同主要在消息发送的层面上。那么在更上层，核心的概念不变，比如请求包含一个方法（REST架构），首部、正文、状态码、缓存、Cookie等都与HTTP/1保持一致。

### 流优先级和流量控制

流优先级就是在HTTP2中有大量并发请求，那么相较于HTTP1的并发数限制，优先级对于HTTP2更为重要，需要去区分出哪些是关键资源并且优先请求。

在transport layer，TCP为了避免超出对方接受能力，会根据对方的接收窗口进行流量控制。而HTTP2要在流的层面上实现流量控制，比如在视频网页，用户暂停了视频，那么暂停视频流，加载页面其他资源是更好的选择。

### 首部压缩

HTTP首部通常用于携带与请求和响应相关的额外信息。首部中有很多信息是重复的，以下首部会随着每个请求都会发送，通常和之前的请求使用相同的值：

- Cookie 
- User-Agent
- Host
- Accept 客服端期望格式
- Accept-Encoding 定义压缩格式

还有些`Content Security Policy`首部用于安全的响应首部，可能会大和重复，造成资源浪费。

那么HTTP2通过压缩首部来减小传输开销，这是HTTP1所不具备的功能。

### 服务端推送

有点类似于`WebSocket`，不需要客户端请求，由服务器主动推送，比如一些必备的静态CSS文件等，可以减少一个请求的时延。

## 003 如何创建HTTP2连接

目前所有的Web浏览器都仅支持基于HTTPS来建立HTTP/2连接。

规范文档提供了三种建立HTTP/2连接的方法：
- 使用HTTPS协商
- 使用HTTP `Upgrade`首部
- 和之前的连接保持一致

### 1 使用HTTPS协商(negotiation)

在HTTPS握手过程中，可以同时完成HTTP/2协商，这样就不需要建立连接时增加一次跳转。这里的跳转指的是http->https，换scheme后浏览器会跳转到新的URL，那么https->http2就无需新增scheme。

#### HTTPS 握手过程

[具体看这一篇](https://github.com/ZHHHH9980/Notes_zh/blob/master/draft/Computer%20Network/web-protocol/HTTPS.md)

#### ALPN (Application Layer Protocol Negotiation)

ALPN给ClientHello和ServerHello这两个消息添加了功能扩展，客户端用它来声明应用层支持的协议。

客户端：我支持http/1.1和h2，用哪个都行。

服务端：用ServerHello来确定协商之后用哪个协议。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/68df2ce387c94a7388843ccc5d0719d5~tplv-k3u1fbpfcp-watermark.image?)


用curl来查看HTTPS握手使用ALPN：
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/94498b7102ff441f8472d36e468660ca~tplv-k3u1fbpfcp-watermark.image?)

### 2 使用HTTP Upgrade首部

浏览器只支持基于加密连接的HTTP/2，如果是浏览器以外的场景才需要关注这个方式。

### 3 和之前的连接保持一致

如果客户端事先知道服务器已经支持HTTP/2，那么可以马上开始使用。比如根据Alt-Svc首部(HTTP/1.1)或者ALTSVC帧推断之前的连接信息。

## 004 HTTP/2帧