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
