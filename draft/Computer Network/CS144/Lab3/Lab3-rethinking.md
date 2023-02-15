# Lab3-rethinking

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/46833ee416e84943a55306967b190b8f~tplv-k3u1fbpfcp-watermark.image?)

重写Sender的时候发现好多ackno，seq，被绕晕了。

Sender是需要额外维护一个队列用于保存发送出去的segment用于超时重传的，那么一旦收到远端传来的ackno，就得将已经确认收到的segment出队。

那么**要判断哪些segments已经被确认接收到，是需要结合本地发送端seqno+len和远端传回来的ackno**判断的，这幅图有助于理解本地发送端Seq与远端传回ack之间的关系。
