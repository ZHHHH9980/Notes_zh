# Wireshark Lab: HTTP

出师不利，抓了半天都包没抓到，还以为是 chrome 重定向到了 https，后来才发现是开了代理。

这里留个 TODO，代理是什么原理？为啥抓不到数据包？

## 1. The Basic HTTP GET/response interaction

### browser request

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3274be0dbea74493b783a0a160e6c0d5~tplv-k3u1fbpfcp-watermark.image?)

### server response

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7e5da0aa13545f09f767c2ec650995e~tplv-k3u1fbpfcp-watermark.image?)

1. Is your browser running HTTP version 1.0 or 1.1? What version of HTTP is the
   server running?

   两个都是 1.1

2. What languages (if any) does your browser indicate that it can accept to the
   server?

   详情直接看请求头的`Accept-Language`字段

3. What is the IP address of your computer? Of the gaia.cs.umass.edu server?

   ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/991959ac96ab45b5b74e266910d959c0~tplv-k3u1fbpfcp-watermark.image?)

4. What is the status code returned from the server to your browser?

   200

5. When was the HTML file that you are retrieving last modified at the server?

   ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/10cd2b2133f94ecd9c513f248895682a~tplv-k3u1fbpfcp-watermark.image?)

6. How many bytes of content are being returned to your browser?

   `Content-Length: 128`

7. By inspecting the raw data in the packet content window, do you see any headers
   within the data that are not displayed in the packet-listing window? If so, name
   one.

## 2. The HTTP CONDITIONAL GET/response interaction

Answer the following questions:

8. Inspect the contents of the first HTTP GET request from your browser to the
   server. Do you see an “IF-MODIFIED-SINCE” line in the HTTP GET?

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa998a092c1540a69e7a1616622bf106~tplv-k3u1fbpfcp-watermark.image?)

By the way, 这个`IF-MODIFIED-SINCE` 正好是上个响应头的`Last-Modified`

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f3b25fa014c543bcbc7599234de2df2b~tplv-k3u1fbpfcp-watermark.image?)

也就是说第二次请求带着上一次的`Last-Modified`去请求，如果未发生变化，服务端会返回 304。

9.  Inspect the contents of the server response. Did the server explicitly return the
    contents of the file? How can you tell?

    Yeah, because there're `Content-Type` & `Content-Type`field indicate the files' content.

10. Now inspect the contents of the second HTTP GET request from your browser to
    the server. Do you see an “IF-MODIFIED-SINCE:” line in the HTTP GET? If
    so, what information follows the “IF-MODIFIED-SINCE:” header?

        Date

11. What is the HTTP status code and phrase returned from the server in response to
    this second HTTP GET? Did the server explicitly return the contents of the file?
    Explain.

        is 304. No, there is no `Content-Type` like field.

## 3. Retrieving Long Documents

这次的 html 文件比较大，达到了 4500 个字节，因此拆成了三个 TCP 的`segement`进行传输，在 wireshark 中用`reassembled PDU`标识。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b47d7e7d12254c2aa673a79755909112~tplv-k3u1fbpfcp-watermark.image?)

12. How many HTTP GET request messages did your browser send? Which packet
    number in the trace contains the GET message for the Bill or Rights?

        one.

13. Which packet number in the trace contains the status code and phrase associated
    with the response to the HTTP GET request?

        ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e595db659345471684fd10b266053952~tplv-k3u1fbpfcp-watermark.image?)
        See the diagram.

14. What is the status code and phrase in the response?

    See the diagram.

15. How many data-containing TCP segments were needed to carry the single HTTP
    response and the text of the Bill of Rights?

        three.

## 4. HTML Documents with Embedded Objects

16. How many HTTP GET request messages did your browser send? To which
    Internet addresses were these GET requests sent?

    ![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f7c9863824641e088a65c6e5f75c83d~tplv-k3u1fbpfcp-watermark.image?) 4. see the figure.

17. Can you tell whether your browser downloaded the two images serially, or
    whether they were downloaded from the two web sites in parallel? Explain.

    Downloaded serially, see the time.

    ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c5b2ba658124c75bb2c179901e73a70~tplv-k3u1fbpfcp-watermark.image?)

After the first image response came back, the next request would be sent.

个人感觉这里主要是实验观察 html 引入其他 object 也会发送 HTTP 请求的场景。比如请求图片，是串行而不是并行。
根据浏览器的 Performance 捕捉功能也可以看出来，每次接收到图片的返回结果才会开启下一个图片的请求。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8fd5a58a1bcb41a8b66f005a8de278f7~tplv-k3u1fbpfcp-watermark.image?)

## 5 HTTP Authentication

接下来是访问一个有密码保护的 html 文件。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33d503bf7e5d4758a07200826ccf3c53~tplv-k3u1fbpfcp-watermark.image?)

18. What is the server’s response (status code and phrase) in response to the initial
    HTTP GET message from your browser?

          401 UnAuthorized.

19. When your browser’s sends the HTTP GET message for the second time, what new field is included in the HTTP GET message?

    ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c5cead518f74b44b2feedac8735a717~tplv-k3u1fbpfcp-watermark.image?)

这个字段之后的是 Base64 编码的用户名和密码，这里直接明文传输了。第八章会讨论如何加密。
