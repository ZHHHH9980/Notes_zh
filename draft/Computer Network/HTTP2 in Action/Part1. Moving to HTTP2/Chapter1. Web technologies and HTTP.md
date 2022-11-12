# 第一章 网络技术和 HTTP

> 第一章的英文标题是 Web technologies and HTTP，不知道为啥中文版却是万维网与 HTTP

## 1.1 How the web works

主要就是提出 HTTP 是支撑 web 工作的核心技术。

### 1.1.1 The Internet versus the World Wide Web

因特网主要是依靠 IP(Internet Protocol)协议传输消息，而 web 是运行在应用层之上，依靠应用层协议 HTTP 实现数据传输。因特网之上可能会运行 SMTP、IMAP 等电子邮件服务相关协议，未必全是 HTTP，暂不能混为一谈。

### 1.1.2 What happens when you browse the web?

![image.png](https://drek4537l1klr.cloudfront.net/pollard/HighResolutionFigures/figure_1-1.png)

1. 浏览器根据 DNS(Domain Name System, 域名解析系统)服务器返回的真实地址请求网页，DNS 将`www.google.com`转成机器可识别的 IP 地址。
2. 浏览器会让你的计算机建立一个对于这个 IP 地址的标准网络端口(80)或者安全网络端口(443)的 TCP 连接。
3. 建立连接后会请求网页(web page)。这里就会用到 HTTP，具体细节将会在下一章节讨论。
4. 服务器会响应你请求的 URL 的内容，一般来说初始相应包含 HTML 格式文件，为了让用户看到丰富的媒体形式，HTML 中还会引用其他资源如 CSS 样式表、Javascript 脚本、图片、字体等等。如果返回的状态码是 301/302，比如访问`http://www.google.com`，就会返回 301，浏览器会重新定向到`https://www.google.com`，那么又会重复上述的步骤。
5. Web 浏览器负责处理响应，如果返回的是 HTML,就会构建 DOM 树，并且发现还需要获取其他资源比如 CSS、Javascript 等。
6. Web 浏览器请求额外资源，那么又要重复上述 1~5 的步骤(资源比如 JS 可能还会请求其他页面资源~)，每次请求一个资源都必须重复 1~6，这也是导致上网慢的因素。 7.浏览器获取到资源后开始渲染页面。 8.页面显示后，浏览器会在后台继续加载其他资源，比如图片等等~ 9.加载完成后，会触发`onload`的 JS 事件。

## 1.2 What is HTTP?

HTTP(HyperText Transfer Protocol)超文本传输协议，用于传输各种多媒体资源，本文，图片，视频等等。

### 1.3.1 HTTP/0.9

HTTP 成功的关键在于简单。HTTP/0.9 请求语法：

```
GET /page.html↵
```

### 1.3.2 HTTP/1.0

在 0.9 的基础上新增了一些关键特性：

- 新增`HEAE`和`POST`请求方法。
- 为消息添加版本号字段。
- HTTP headers,与请求和响应一起发送。
- 三位整数的状态码，表示是否成功等状态。

### HTTP 请求头部

```
GET /page.html HTTP/1.0↵
Header1: Value1↵
Header2: Value2↵
↵
```

### 1.3.3 HTTP/1.1

### 强制添加 HOST 首部

HTTP 请求行是一个相对路径 URL，比如`section/page.html`，但是后来的服务器上部署了多个页面，如果只是一个相对路径无法知道请求究竟打到哪个页面，因此 1.1 强制添加`Host`首部

```
GET / HTTP/1.1
Host: www.google.com
```

### 持久连接(KEEP-ALIVE)

HTTP/1.0 支持，在 1.1 被设置为默认值

```
GET /page.html HTTP/1.0
Connection: Keep-Alive
```

这个响应告诉客户端，在发送完响应后，可以在同一个连接上发送一个新的请求。对于服务端，必须使用`Content-Length`首部来定义消息响应体的长度，以便消息体传输完成后，客户端可以发起新的请求。

```
HTTP/1.0 200 OK
Date: Sun, 25 Jun 2017 13:30:24 GMT
Connection: Keep-Alive
Content-Type: text/html
Content-Length: 12345
Server: Apache
<!doctype html>
<html>
<head>
...etc.
```

服务器想要关闭连接，必须包含`Connection: Keep-Alive`首部。

HTTP/1.1 引入了其他新功能：

- 新增`PUT`，`OPTIONS`,`TRACE`还有`DELETE`等方法。
- 更好的缓存方法。（之后完善）

## 1.4 HTTPS

HTTPS 是 HTTP 的安全版本，使用 TLS（Transport Layer Security，传输层加密）协议对传输中的消息进行加密。
在 HTTP 的基础上新增三个重要概念：

1. 加密——第三方无法读取消息
2. 完整性校验——消息在传输中未被更改
3. 身份验证——服务器不是伪装的
