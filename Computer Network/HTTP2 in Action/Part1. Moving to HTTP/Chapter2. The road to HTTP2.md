# Chapter2. The road to HTTP/2

### 2.1.1 HTTP/1.1's fundamental performance problem

文中假设一个 HTML 文件中引用了两张图片：
![image.png](https://drek4537l1klr.cloudfront.net/pollard/Figures/fig2_2_alt.jpg)

可以粗浅地分析出，浏览器与服务器大多数时间都在等待资源的传输，真正处理资源的时间很短。

现代互联网最大的问题之一不是带宽，而是延迟，延迟`Latency`是将单个消息发送到服务器的需要的时间，而带宽`bandwidth`决定用户能从消息中下载多少内容。带宽能够不断增加，但是延迟受物理因素影响，传输速度已经接近光速。

### Pipelining for HTTP/1.1

HTTP/1.1 管道化支持在收到相应之前发出请求，也就是浏览器知道要请求两个图片，可以先后连续发送两个请求。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd85f1fb7e7742659685db4b88f77903~tplv-k3u1fbpfcp-watermark.image?)

管道化虽然能够提高性能，但是并未得到主流浏览器支持，很难实现，而且容易出错。即使支持，也依然会存在队头拥塞问题，即请求 1 的图片未响应，请求 2 的即使到达客户端也不会响应。
