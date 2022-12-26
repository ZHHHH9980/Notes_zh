# Computer Network and the Internet

<br/>

## 1. The Network Core

## 1.1 Packet Switching 分组交换

To send a message from a source end system to a desination end system, the source breaks long messages into smaller chunks of data known as **packets**

为了从源端系统发送信息到目标端系统，将长信息分割成一块一块的数据称作**packets**

Most packets switches use **store and forward transmission** at the inputs to the links.

为什么需要存储再转发？这种行为往往是因为输入速率>输出速率导致的。packet 在路由器需要查路由表找到对应的路径再转发，这需要花费一定的时间。
<br/>
<br/>

## 1.2 Queuing Delays and Packet Loss 排队时延与分组丢失

Each packet switch has mutiple links attached to it.For each attached link, the packet switch has an **output buffer**,which stores packets that the router is about to send into that link.

分组交换机有多个连接，为了这些连接传来的分组，分组交换机维护了一个**output buffer**

Thus, in addition to the store-and-forward delays, packets suffer output buffer **queue delays**.

因此，除了存储和转发的时延，分组还得忍受队列的排队时延。

## 1.4 Delay, Loss, and Throughput in Packet-Switched Networkds

### Type of Delay

- Processing Delay. 处理时延。处理时延包括很多因素，比如分组到达路由器需要进行差错校验。

- Queueing Delay. 排队时延。如果处于网络比较拥塞的情况下，队列中的分组比较多，那么排队时延就会比较长，如果没有排队的现象，那么时延几乎为 0。排队时延范围在实际上在几毫秒到几微秒。

- Transmission Delay. 传输时延。分组的长度是 L 个比特，传输速率 R=10Mbps，那么传输时延就是 L/R。

- Propagation Delay. 传播时延。传播时延跟传输时延差异非常大，传播时延指的是分组在物理媒介上传输消耗的时间，两台主机相连可以忽略不计，如果链路距离非常长，那么这个传播时延就不可忽略。

### 1.4.2 Queuing Delay and Packet Loss

假设 a 代表分组到达队列的平均速率，L 代表所有分组具有的比特个数，那么平均到达队列的比特速率为 La(bits/sec)，R 代表传输速率，就是队列将分组发送出去的速率(bits/sec),La/R 称作流量强度(traffic intensity)
if La/R > 1，那么队列的输入速率会大于输出速率，平均排队时延就会变得无限大。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f47fe4db6db4ea2a2ba5c0ef239d11b~tplv-k3u1fbpfcp-watermark.image?)

`packet loss`
当输入速率大于输出速率，那么队列就会塞满，当分组到达一个满队列，就会被丢弃(drop),这也是为什么分组会丢失。

### 1.4.3 End-to-End Delay

端到端时延
d_end = N(d_proc + d_trans + d_prop)

N 代表跳数。

### 1.4.4 Throughput in Computer Networks

F 个比特在 T 秒内全部到另一端，那么平均吞吐量就为 F/T bits/sec.

`bottlenect link`
瓶颈链路指的是一条链路中会受最小链路的吞吐量影响限制，R= min{R1,R2,...,RN}

## 1.5 Protocal Layers and their Service Model

### Layer

![在这里插入图片描述](https://img-blog.csdnimg.cn/7ac27e2c901943d9953ac4e9766098f1.png)

层级之间表象上是对等传输的，实际上是通过调用下层的服务实现的。

自底向上：

物理层在电路中将光信号、电磁波代表的 0/1 转成以帧为单位的数据传给数据链路层。

数据链路层以下层服务为基础，解决了点到点(P2P)之间的数据传输。

互联网中有多个节点，网络层以数据链路层的服务为基础，解决了端到端（E2E）之间的数据传输。

传输层在网络层服务的基础上，主要提供了两个服务：

1. 可靠的传输保障。
2. 主机上有多个进程，解决了进程与进程之间的数据传输。

应用层上运行各种应用。

### 1.5.2 Encapsulation

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca6571dd78534779a0b3dc99a18c1b79~tplv-k3u1fbpfcp-watermark.image?)

下层服务接收到上层服务传输的数据包，都要进行一层封装，等传输到对等的协议实体上再解封装，从而实现对等层上的协议数据传输。

<br/>
<br/>

## Application Layer

### CS: 144 Lab 0: webget

通过 webget 这个实验可以对 HTTP request message 有个理性的认识：

![在这里插入图片描述](https://img-blog.csdnimg.cn/2468e3fd387344b0b90ac37900ecd8a9.png)
