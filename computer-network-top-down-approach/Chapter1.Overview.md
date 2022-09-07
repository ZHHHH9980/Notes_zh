# Computer Network and the Internet
<br/>

## 1. The Network Core

### 1.1 Packet Switching 分组交换

To send a message from a source end system to a desination end system, the source breaks long messages into smaller chunks of data known as **packets**

为了从源端系统发送信息到目标端系统，将长信息分割成一块一块的数据称作**packets**

Most packets switches use **store and forward transmission** at the inputs to the links.

为什么需要存储再转发？这种行为往往是因为输入速率>输出速率导致的。packet在路由器需要查路由表找到对应的路径再转发，这需要花费一定的时间。
<br/>
<br/>

### 1.2 Queuing Delays and Packet Loss 排队时延与分组丢失

Each packet switch has mutiple links attached to it.For each attached link, the packet switch has an **output buffer**,which stores packets that the router is about to send into that link.

分组交换机有多个连接，为了这些连接传来的分组，分组交换机维护了一个**output buffer**

Thus, in addition to the store-and-forward delays, packets suffer output buffer **queue delays**.

因此，除了存储和转发的时延，分组还得遭受队列的排队时延。



### Layer
![在这里插入图片描述](https://img-blog.csdnimg.cn/7ac27e2c901943d9953ac4e9766098f1.png)



层级之间表象上是对等传输的，实际上是通过调用下层的服务实现的。

自底向上：

物理层在电路中将光信号、电磁波代表的0/1转成以帧为单位的数据传给数据链路层。

数据链路层以下层服务为基础，解决了点到点(P2P)之间的数据传输。

互联网中有多个节点，网络层以数据链路层的服务为基础，解决了端到端（E2E）之间的数据传输。

传输层在网络层服务的基础上，主要提供了两个服务：

1. 可靠的传输保障。
2. 主机上有多个进程，解决了进程与进程之间的数据传输。

应用层上运行各种应用。

<br/>
<br/>



## Application Layer




### CS: 144 Lab 0: webget

通过webget这个实验可以对HTTP request message有个理性的认识：

![在这里插入图片描述](https://img-blog.csdnimg.cn/2468e3fd387344b0b90ac37900ecd8a9.png)
