## Link-Layer

数据链路层提供直连（网络介质的直连）两个设备直接的通信功能。
比如以太网的共享介质/以太网交换机。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ef3c12d9b124a7e9d70f39bc2b97649~tplv-k3u1fbpfcp-watermark.image?)

## IP 协议

IP 协议在数据链路层的基础上，实现了跨介质的通信(end to end)。

- 不可靠，无连接的数据报传输服务。

### DS Field & ECN Field

DS: Differentiated Service 差分服务
ECN: Explict Congestion Notification 显式拥塞报告

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/89e9cc222e554d868a19415b42325c48~tplv-k3u1fbpfcp-watermark.image?)

CE: Congestion Experienced
ECN 需要与上层协议如 TCP 一起配合使用。

## ARP 协议

对于操作系统，仅获取到目标的 IP 地址是不足以在网络中进行传输的，因为 IP 地址是一个逻辑地址，不足以标识底层硬件的地址，因此需要 APR 协议提供 IP 地址到物理硬件地址的一个映射。

如果在同一个交换机中，那么需要获取到需要目标主机 IP 地址对应的 MAC 地址，如果不在同一个交换机，需要知道目标网段的网关 IP 地址对应的 MAC 地址。

### 交换机工作原理实例

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e24c586dd15b4f179ed13d991aad7951~tplv-k3u1fbpfcp-watermark.image?)

交换机处理并记录发送者 的 MAC 和端口号

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f1f5fd2b9a6e4aedb1778e5698443099~tplv-k3u1fbpfcp-watermark.image?)

开始广播

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/699960e3ab40446ea33dcd36f7cc1522~tplv-k3u1fbpfcp-watermark.image?)

对于 PC2，它会将 PC1 的 IP 和 MAC 写入自己的高速缓存中
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bdd76cc6982d4e79b877267d1408ebca~tplv-k3u1fbpfcp-watermark.image?)

开始回复响应（单播）
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9491d38880df4ec19533698abe72c565~tplv-k3u1fbpfcp-watermark.image?)

交换机同时也会学习并且记录 PC2 的 端口和 MAC 地址。

响应只有 PC1 能收到，因为交换机已经记录了 PC1 的端口和 MAC 地址。
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4cfedf699017490eb108e62b057aebe6~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f75a695829b4640b389354d939f1c88~tplv-k3u1fbpfcp-watermark.image?)


## TCP

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad66487962004385af6f9635e40919ec~tplv-k3u1fbpfcp-watermark.image?)

建立连接与断开连接的七个操作。
服务端建立链接的SYN和ACK是可以合并的，那为什么断开连接的ACK和FIN不能够合并？

因为TCP是全双工的一个通信机制，客户端发送FIN和接收到来自服务端的ACK，只是**断开了客服端对服务端的发送**，那么对于服务端，它是可以继续发送其他数据，之后再决定是否断开连接。