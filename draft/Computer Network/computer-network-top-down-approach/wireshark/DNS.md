# DNS

## 1. nslookup

实验用的是`nslookup`这个工具。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/482fbb1bf24a4f81a04cab12f33aebd0~tplv-k3u1fbpfcp-watermark.image?)

```
nslookup www.jd.com
```

意思是请发送主机名为`www.jd.com`的 IP 地址给我。

第一部分：
Server 表示的是代理的 DNS 域名，Address 是它的 IP 地址。

第二部分：
`Name`和`Address`标识了请求的`www.jd.com`的主机名称以及 IP 地址。

```
nslookup -type=NS jd.com
```

![图1](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c9e946b00f143f1a57c9ff1cab75040~tplv-k3u1fbpfcp-watermark.image?)图 1

代表：请发送对`jd.com`的权威服务器主机名称,如果不写`type`，`nslookup`默认返回 IP 地址作为响应。

Non-authoritative answer 之后都是权威 DNS 服务器主机名称，但是`nslookup`将它们标识为`Non-authoritative`意思表示它们都是从缓存中取出来的，并不是直接从权威 DNS 服务器中取到的主机名称。
最终，`nslookup`还会“好心地”将权威 DNS 服务器的主机名和 IP 返回。

## 2. ipconfig

不太好用，先略过。

## 3.wireshark

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d08cee1fd29427e90fe61075002cb43~tplv-k3u1fbpfcp-watermark.image?)

4.  Locate the DNS query and response messages. Are then sent over UDP or TCP?

    一开始看到好多 TCP 的包还以为是 TCP，点开 DNS 的包才发现是 UDP，以后面试就可以问下这个，DNS 是 基于 TCP 还是 UDP？

5.  What is the destination port for the DNS query message? What is the source port
    of DNS response message?

        53

6.  To what IP address is the DNS query message sent? Use ipconfig to determine the IP address of your local DNS server. Are these two IP addresses the same?

    wireshark 中 DNS 本地代理服务器的 IP 地址

    ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b304ccc7ffe747868d01e4e3e9c810a6~tplv-k3u1fbpfcp-watermark.image?)

    跟之前`nslookup`的代理 IP 地址是一样的，如图 1。

7.  Examine the DNS query message. What “Type” of DNS query is it? Does the query message contain any “answers”?

    ![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c65f7005105a4a46a2223bc8b572f110~tplv-k3u1fbpfcp-watermark.image?)

    type A ，查询 IP 地址的意思。

8.  Examine the DNS response message. How many “answers” are provided? What
    do each of these answers contain?

    ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/61a9b5e0254a4b77a079f0cfe26de360~tplv-k3u1fbpfcp-watermark.image?)

    抓抓包还是挺有意思的，非常直观。

9.  Consider the subsequent TCP SYN packet sent by your host. Does the destination IP address of the SYN packet correspond to any of the IP addresses provided in the DNS response message?

    是有相关 TCP 连接建立，目标 IP 就是 DNS 的 reponse 中的 IP 地址。

10. This web page contains images. Before retrieving each image, does your host issue new DNS queries?

    图片都是直接引用域名下的某个文件夹，不会再产生 DNS 请求。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f339381f471441f9226323857ffabbe~tplv-k3u1fbpfcp-watermark.image?)

11. What is the destination port for the DNS query message? What is the source port of DNS response message?

    desination port: 53 , source port: 65421

12. To what IP address is the DNS query message sent? Is this the IP address of your default local DNS server?

    192.168.1.1,yep.

13. Examine the DNS query message. What “Type” of DNS query is it? Does the query message contain any “answers”?

    type A.

14. Examine the DNS response message. How many “answers” are provided? What do each of these answers contain?

    ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/655906dc9ecc4b1dabf01c952ced00a0~tplv-k3u1fbpfcp-watermark.image?)

    three. `Name`,`Type`,`Class`,`TTL`,`Data Length`,`Address`(IP)/`CNAME`(host name).

15. Provide a screenshot.

后面都是类似的抓包了，就不都写上了。
