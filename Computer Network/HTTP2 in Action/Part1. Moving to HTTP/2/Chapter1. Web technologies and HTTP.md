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
4. 服务器会响应你请求的 URL 的内容，一般来说初始相应包含 HTML 格式文件，为了让用户看到丰富的媒体形式，HTML 中还会引用其他资源如 CSS 样式表、Javascript 脚本、图片、字体等等。
