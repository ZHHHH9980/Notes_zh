# Application Layer

## 2.1 Principles of Network Applications

网络最复杂的部分都放在网络边缘，对于应用层，并不需要关心底层的硬件实现。

### 2.1.1 Network Application Architectures

现代网络应用架构一般有两种

1. client-server architecture
   客户端-服务端架构，数据集中在 served 端，客户端为用户代理发送请求。
2. peer to peer architecture
   P2P 架构，数据分布在各个主机中，并没有一个集中的数据中心。

### 2.1.2 Process communicating

在一个主机上会运行多个应用，操作系统会为每个应用开启一个进程，应用与应用直接的数据传输也是进程与进程之间的通信。传输层为应用层建立了一个提供数据传输服务的接口，称为**`socket`**,应用层通过操作`socket`提供的 API 来达到数据传输到对等层的目的。

### 2.1.3

略

### 2.1.4 Transport Services Provided by the Internet

一般传输层向应用层提供两种服务：

1. 可靠的 TCP 传输服务，具有超时重传，错误检测，顺序发送顺序接收等机制。
2. 不可靠的 UDP 传输服务，顺序发送乱序接收，不需要握手，性能较好，适用于实时多媒体应用，对丢包现象可容忍度较高的场景。

### 2.1.5 Application-Layer Protocols

应用层协议目前主要有 HTTP（应用于 Web 端），SMTP（应用于电子邮件）。

## 2.2 The Web and HTTP

> 打算阅读 HTTP2 in action 这本书，到时候也会对每个章节写一些笔记~

- 大部分都网页都包含一个 HTML 文件，用于描述网页结构，该文件的传输主要就是通过 HTTP 协议，HTML 文件会通过 URL 的形式引入其他的多媒体文件，比如图片、视频样式表、JS 代码等等。
- HTTP 是运行在 TCP 之上的。
- HTTP 是无状态协议，不会记录用户之前是否访问过等操作，比如`GET`请求是幂等的，无论进行多少次`GET`请求，返回结果都是一样的。

### 2.2.2 Non-Persistent and Persistent Connections

Non-Persistent: 每次请求响应都单独建立一个 TCP 连接。
Persistent: 复用同一个 TCP 链接进行多次请求响应的操作。

书中还提到一个比较有意思的内容：一个 HTML 引用了十张 JPEG 格式图片，client 端是串行建立 10 个 TCP 连接还是并行建立？

> In their default modes, most browsers open 5 to 10 parallel TCP connections, and each of these connections handles one request-response transaction.

粗略的客户端请求一个 HTML 到接收的耗时计算：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ef4fc2c00d64514a08fbffe3ad4e90b~tplv-k3u1fbpfcp-watermark.image?)

需要两个 RTT(round trip time)以及所有文件接收的时间。

HTTP with Persistent Connections，优势不用多说，就是带来性能上的节约，并且能够实现流水线请求(不需要等待上一次请求响应即可请求下一个 object)，在设置的时长后请求会被服务端关闭。

### 2.2.3 HTTP 消息格式

传统的 HTTP 请求数据格式：

```
GET /somedir/page.html HTTP/1.1
Host: www.someschool.edu
Connection: close
User-agent: Mozilla/5.0
Accept-language: fr
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e8fd32ec31c4babb01aed684ca4aece~tplv-k3u1fbpfcp-watermark.image?)

分别是请求行，头部行，空行，和实体部分。实体部分在`GET`请求为空，`POST`请求中才会用到。

传统的 HTTP 响应格式：

```

HTTP/1.1 200 OK
Connection: close
Date: Tue, 18 Aug 2015 15:44:04 GMT
Server: Apache/2.2.3 (CentOS)
Last-Modified: Tue, 18 Aug 2015 15:11:03 GMT Content-Length: 6821
Content-Type: text/html

```

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/77ef9667ee31482892bf4a14c1e77bc8~tplv-k3u1fbpfcp-watermark.image?)

分别是状态行，头部行，空行和实体。状态行有一个特别之处就是状态码，面试特别喜欢考，表示各种 HTTP 响应的状态。

### 2.2.4 User-Server Interaction: Cookies

HTTP 的服务是无状态的，不维护任何用户信息，正因为它的简洁设计才能让高性能的 Web 服务器能够同时处理几千个 TCP 连接。但是网页是有辨识不同用户的需求的(根据不同用户定制化服务)，因此 cookie 就是为了解决这个需求而诞生。

cookie 技术的四个组成：

1. 作为头部行出现在 HTTP 响应消息。
2. 作为头部行出现在 HTTP 请求消息。
3. cookie 文件会被浏览器保存。
4. 存储到后端的数据库中。

如图所示：
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b24c9e3e30604e188695d96a1e6f1416~tplv-k3u1fbpfcp-watermark.image?)

### 2.2.5 Web Caching

代理服务器是 Web 缓存的一个重要角色，请求先打到代理服务器上检查是否具有相关内容，如果有就直接返回，没有再向源服务器请求相关资源。

CDN(Content Distribution Network)内容分发网络就是使用这个技术，在各个关键节点部署代理服务器，从而实现大部分资源加速获取。

### 2.2.6 The Conditional GET

缓存能够减少相应时长，但是也带来了一个问题，缓存的内容是持续不变的，但是真正源服务器的 object 是可能会改变的。因此引入了条件 GET 方法。

第一次请求，服务器响应消息的头部行中带有`Last-Modified`。

```
HTTP/1.1 200 OK
Date: Sat, 3 Oct 2015 15:39:29
Server: Apache/1.3.0 (Unix)
Last-Modified: Wed, 9 Sep 2015 09:23:24 Content-Type: image/gif
(data data data data data ...)
```

在下一次 GET 请求中包含`If-Modified-Since`：这个头部行，这个头部行就是从上一次响应的`Last-Modified`中取出来的。这就是条件 GET 请求的关键。

```
GET /fruit/kiwi.gif HTTP/1.1
Host: www.exotiquecuisine.com
If-modified-since: Wed, 9 Sep 2015 09:23:24

```

这次请求，服务器发现`If-modified-since`和本地维护的`Last-Modified`能够对应上，就不会返回相应实体，而是返回一个带有`304`状态码的响应消息,通知客户端内容并未修改。

```
HTTP/1.1 304 Not Modified
Date: Sat, 10 Oct 2015 15:39:29 Server: Apache/1.3.0 (Unix)
(empty entity body)
```

> 第七版是没有 HTTP/2 的内容的，不过没有关系，具体的内容会在 HTTP2 in Action 做一些总结~
> Email 也不再赘述了。用的不多。

<br/>

## 2.4 DNS - 因特网的目录服务

DNS(domain name system)域名解析系统，本质上就是将对人类友好的域名 url 转换成对机器友好的 IP 地址。
单点服务的劣势就不多说了，DNS 是一个分布、继承式的数据库。
DNS 的组成：

- Root DNS servers. 根域名系统服务
- Top-level domain servers. 顶级域名系统服务，如.com
- Authritative DNS servers. 权威域名系统服务，比如一个大型的组织机构维护的一个域名解析服务。

域名查询的逐级查询。

每一级域名都有自己的 DNS 服务器，存放下级域名的 IP 地址。

所以，如果想要查询域名 gaia.cs.umass.edu 的 IP 地址，需要三个步骤。

第一步，查询根域名.root 服务器，获得顶级域名服务器.edu（又称 TLD 服务器）的 IP 地址，用于解析.edu

第二步，查询 TLD 服务器 .edu，获得一级域名服务器 dns.umass.edu 的 IP 地址, 用于解析 umass.edu

第三步，查询一级域名服务器（权威域名服务器（Authoritative Name Server）） dns.umass.edu，获得域名 gaia.cs.umass.edu 的真正 IP 地址。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c43f43fce6ff4bb0b987bc89ee76d3ef~tplv-k3u1fbpfcp-watermark.image?)

另一种是递归。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/494f29825ccd45d5b5dd8640d2ba6ba8~tplv-k3u1fbpfcp-watermark.image?)

上面三种服务器只用来查询下一级域名的 IP 地址，而 1.1.1.1 这类 DNS 服务器则把分步骤的查询过程自动化，方便用户一次性得到结果，所以它称为递归 DNS 服务器（recursive DNS server），即可以自动递归查询。

我们平常说的 DNS 服务器，一般都是指递归 DNS 服务器。它把 DNS 查询自动化了，只要向它查询就可以了。

它内部有缓存，可以保存以前查询的结果，下次再有人查询，就直接返回缓存里面的结果。所以它能加快查询，减轻源头 DNS 服务器的负担。

## Reference

[DNS 原理入门](https://www.ruanyifeng.com/blog/2016/06/dns.html)

[DNS 查询原理详解](https://www.ruanyifeng.com/blog/2022/08/dns-query.html)

## 2.7 Socket Programming: Creating Network Applications
