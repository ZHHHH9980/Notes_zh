# Data plane

> the network layer can be decomposed into two interacting layers, the **data plane** and the **control plane**.

网络层可以被分为两个互相作用的层面，数据平面和控制平面。

## 4.1 Overview of Network Layer

两个 host 信息传递，发送方的 Network Layer 从上层 Transport Layer 接收帧(segements)，封装成数据报(datagram)发送给附近的路由。

1. 路由器中数据平面的主要职责是从输入向输出转发(forwarding)数据报,是**局部的**行为。
2. 路由器中控制平面主要是协调一系列路由器转发行为从而保证数据报(datagram)能够端到端(end to end)传输,是**整体**的行为。

### 4.1.1 Forwarding and Routing

回归一下链路层的职责，将分组(packet)点到点(point to point)进行传输。
整个网络中有多个路由节点，那么网络层的主要职责，将分组(packet)从一个 host 传到另一个 host。要保证这个功能的实现主要有两种能力组成。

1. 转发(forwarding)。

   (packet)分组到达路由器的输入端，需要在合适的输出端发送出去。在通常情况下，一个分组(packet)可能会被路由丢弃(可能是分组来源于恶意端口，或者目标被禁用),也有可能被复用传到多个输出端口。

2. 路由

   网络层必须决定发送方到接收方分组的传输路径。这种决定路径的算法称作路由选择算法。

转发主要是硬件层面的，路由通常在软件层面实现，通常要花费几秒钟(seconds)。

网络路由的一个核心元素是转发表(forward table)，路由对接收到的分组头部进行校 0 验，根据头部信息从转发表中查到对应的索引(index)。

如图所示：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e658fae70d484287b6529dec9cfda385~tplv-k3u1fbpfcp-watermark.image?)

### Control Plane

控制平面有两种方式，一种是传统的方式，一种是 SDN 的方式。

1. 传统的方式通过路由算法计算出路由表。
2. SDN 如 Figure 4.3 所示，在远程控制器上计算路由表。这种方式更加灵活。称作软件定义网络(software-defined networking)

### 4.1.2 网络服务模型

网络模型定义了从发送方到接收方端到端传输的特性。

The Internet's network layer provides a single service, known as **best-effort service**.

互联网网络层提供了一个简单的服务称作尽力而为服务。既不能保证分组一定被接收，也不能保证按照发送顺序接收。

## 4.2 What's inside a Router ?

- Input ports

  输入端口具有多个核心功能。一是物理层物理连接到路由器的终点。二起到数据链路层与其他链路互通操作的作用。更重要的是起到了一个查找的功能，控制分组(Control packets)携带了路由协议信息就需要从输入端口转发到路由处理器(routing processor)

- Switch fabric

  连接路由器的输入和输出端口。

- Output ports

  输出端口存储从 Switch fabric 接收到的分组，并且传输给外部连接。这里提供了必要的链路层和物理层的能力。

- Routing Processor.

  路由处理器起到控制平面的功能。在传统路由器中，它执行路由协议维护路由表和链路状态信息。在 SDN 的路由器中，主要负责跟远端控制器(remote controller)通信，接收由 remote controller 传来的转发表，并且将这些转发表安装到 Input ports 中。

### 4.2.1 Input Port Processing and Destination-Based Forwarding

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/179eb35b83d24f42a1d9f5c1cd358ada~tplv-k3u1fbpfcp-watermark.image?)

线路终点-> 数据连接传输（将数据链路层的 PDU 解封装） -> 查找，转发，排队

之后是介绍接口匹配规则，遵循的是**longest prefix matching**，哪个能匹配到最多的前缀就走哪个接口，匹配不成功还有一个 otherwise 接口。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/06c80078f8f347099b6443cdec884d2e~tplv-k3u1fbpfcp-watermark.image?)
书上的例子可以匹配到 0 号接口的 21 位，因此走 0 号。

Switch 就不多提了，感觉跟软件关系不大。

### 4.2.4 哪里会发生排队？

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8eaac87930c44ecb808190ef3d66f044~tplv-k3u1fbpfcp-watermark.image?)

在链路比较拥塞的情况下，输入速率大于输出速率，内存占用就会不断上涨。当 Output 的队列满了以后就会出现分组丢失(packet lost)的情况，因为 ouput 的内存是有限的。

### Input Queueing

输入端也会产生排队现象。

由于输出端口一次只能通过一个分组，如果存在输入端同时有两个分组需要从同一个输出端输出，那么就会产生排队现象。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7892f5b056194d5a8a32ab6159662928~tplv-k3u1fbpfcp-watermark.image?)

这种情况称作**head-of-line(HOL) blocking** 队头阻塞。

### 4.2.4 Packet scheduling

分组调度的几种策略。

#### First-in-First-Out

这种就是数据结构中队列一样的模型。

#### Priority Queueing

队列分成两种 一种高优一种低优，得等高优的全部清空，低优先级的队列才能传输分组。

### WFQ(weighted Fair Queueing)

重量加权算法，保证多个队列的重量（packet 个数)接近，之后按照编号 123 的顺序依次出队。核心点在于`Fair`，公平。

## 4.3 The Internet Protocol

### 4.3.1 IPv4 Datagram Format

IPv4 数据报格式

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bad6d290c86d480c8a35a1f3e81f27a9~tplv-k3u1fbpfcp-watermark.image?)

从左到右从上到下:

- Version：标识了 IP 的版本，路由器通过这个对对应版本数据报进行解析，这里是解析 IPv4 版本的 datagram。

- Header length: 通常是 20 字节，从上到下五行刚好 20 字节，但是有时候会有一些额外的选项在 Options 中。这时候头部长度就决定到底解析到哪里算是头部。

- TOS: 老师说现在很少用了，先不深究了。

- Datagram length: 为了适应以太网的帧长度，数据包往往会有最大显值，很少超过 1500 个字节。

- Indentifier, flags, fragmentation offset: 主要是作用于 IP datagram 分片(fragmentation)中。通过计算与头部的一个偏移量得到数据报的具体顺序。之所以要分片是为了适应以太网的帧大小，之前提过这里通常不会超过 1500 字节。

- Time-to-line: 数据报剩余存活次数，如果=0，它将会被丢弃。

- Protocol: 这个字段决定 IP datagram 最终交给 TCP 还是 UDP 进行解析。

- Header checksum: 路由器会用这个字段进行 IP datagram 的差错校验。

- Source and destination IP address. 目标和源 IP 地址 这个不多解释了。

- Options: 一些拓展字段。

- Data(payload)： 传输层入 TCP/UDP 中的段(segement)都包含在这里。

### 4.3.2 IPv4 Datagram Fragmentation

The maximum amount of data that a link-layer frame can carry is called the **maximum transmission unit(MTU)**.

MTU 代表着数据链路层帧的最大传输数量。每个 IP datagram 需要被封装到数据链路层的 frame 中，为了适应不同大小的 MTU，IP datagram 常常需要被分片传输。

> 电子书是第八版的，已经删除了分片的图片介绍了。

### 4.3.3 IPv4 Addressing

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/40f87bd3b1734cc4a87e68781e3ae8e0~tplv-k3u1fbpfcp-watermark.image?)

IP 地址为该子网分配地址：223.1.1.0/24, 这个子网由三个主机接口地址加上一个路由器接口的地址(223.1.1.4)组成，/24 代表子网掩码，左侧前 24 位标识子网的地址。

`subnet`
因为 IP 地址是有限的，因此 IP 为孤岛分配了一个地址称为子网(subnet)

#### Obtaining a Host Address: The Dynamic Host Configuration Protocol

一旦一个机构申请到了一块 IP 地址，就会通过动态主机配置协议随机为机构中的主机随机动态分配一个临时的 IP 地址。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f508da00b814a32a9197e28dcb36caf~tplv-k3u1fbpfcp-watermark.image?)

### IPv6 Datagram Format

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fba4237d1dfd4fc09e3202fc309626e0~tplv-k3u1fbpfcp-watermark.image?)
（感觉这图有点问题，怎么上面还是 32bits?）
IPv6 数据报格式,相比 Ipv4:

- 扩展了地址能力。IPv6 将 IP 地址的容量从 32 位提升到了 128 位。IPv6 引入了一种新的地址类型，称为选播地址，允许将数据报传递到一组主机中的任何一个。

- 头部精简到 40 个字节。IPv4 很多字段被废弃，加速了路由器的解析速度。

- 流标记(Flow labeling)。标识了是音频或者视频传输的数据包。

IPv6 不再提供的服务。

- 分片与重组。IPv6 不会再将数据报拆分和重新组合，如果传输的数据包过大，那么 IPv6 协议中会直接丢弃这个数据报，并且通过 ICMP 协议发给发送方一个"Packet Too Big"的一个错误信息，让发送放发送一个更小一些的数据报。

- Header Checksum(头部校验和)。IPv6 不再支持头部校验和，因为上层传输层服务和下层数据链路层的以太网协议通常会实现这个功能，校验和需要在分组每次达到路由器的时候重新计算，非常消耗时间。

Options(选项)。这个字段删去后，生成了固定 40 字节长度的 IP 头部。

#### Transition from IPv4 to IPv6

IPv4 的数以亿计的设备已经遍布全球，因此一次性全部升级显然不太可能，因此会存在 IPv4 与 IPv6 共存的情况，那么两者通信就需要一个转换(transition)的过程。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18166d79ecfb4cc7a65416608b0bf2e0~tplv-k3u1fbpfcp-watermark.image?)

在 IPv4 和 IPv6 之间有一些系列介入机制称作隧道(tunnel), 当 IPv6 的数据报向 IPv4 传输，隧道会将 IPv6 的字段封装到 IPv4 中，并且生成 IPv4 的头部。如果是 IPv4 向 IPv6 传输数据报，那么隧道还会解封装 IPv4 的头部，放出 IPv6 的数据报。

### 4.4 广义的转发和 SDN

在网络核心的第二层和第三层中增加太多的中间盒子(middlebox),会增加网络维护的负担，因此有了一个更加优雅的方案，SDN，将统一的控制能力交给远端的控制器。在 SDN 中，路由器被称作分组交换机(packet switch)更加准确。SDN 引入了“匹配和行为”(match and action)的范式，OpenFlow（一个非常成功和广泛使用的 SDN 方式）。

"match"匹配各个层之间的关键字段。
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1873004aebeb497dad4408f6e57419c8~tplv-k3u1fbpfcp-watermark.image?)

"action"可以进行各种操作。

- 转发。
- 丢弃。
- 修改字段(modify-field)。Figure 4.29 中的十个字段都可以修改，非常强大。
