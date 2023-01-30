# Transport Layer

## 1. Multiplexing and Demultiplexing

多路复用和解复用。

网络层IP协议解决了端到端的通信，但是每个操作系统上运行着许多应用进程，在此基础上传输层的TCP/UDP提供了进程之间的通信能力。在同一个host上区分不同的应用进程的能力就叫多路复用（发送端），接收端称作解复用。

### TCP如何进行多路复用和解复用

本质上TCP socket维护了一个四元组

```
Socket -> [sourceIP, sourcePort, targetIP, targetPort]
```

将TCP的`segement`的头部将会放入`targetIP`，`targetPort`用于区分不同进程。

接收端将`targetIP`，`targetPort`从头部取出，找到对应接收端维护的Socket。



Python 建立TCP socket(client)

```
clientSocket = socket(AF_INET, SOCK_STREAM) 
clientSocket.connect((serverName,12000)) // socket中绑定targetIP, targetPort 
```



### UDP如何进行多路复用

UDP本质上维护的是一个二元组

```
Socket -> [sourceIP, sourcePort]
```

在UDP的数据报中封装了`targetIP`,`targetPort`（UDP Socket只维护本地的相关信息）



Python建立UDP socket(client)

```
clientSocket = socket(AF_INET, SOCK_DGRAM)
message = input(’Input lowercase sentence:’) 
clientSocket.sendto(message.encode(),(serverName, serverPort)) // 区别
```



## 2.Building a realiable data transfer

ARQ(Automatic Repeat reQuest) protocols fundamentally have these 3 capabilities:

1. Error detection
2. Receiver feedback
3. Retransmission

### alternating-bit protocol

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80e995f9618a40e3beb173303ee27a6d~tplv-k3u1fbpfcp-watermark.image?)



### pipelined protocol

![image-20220820224231334](/Users/bytedance/Library/Application Support/typora-user-images/image-20220820224231334.png)

一次只传一个Data packet效率太低，改进成pipelining的方式。
常见的pipelining的协议有两种：

1. **Go-Back-N protocol**
2. **Selective Repeat protocal**

维护一个Silding window，size = 1采用Go-Back-N, size > 1 采用 Selective Repeat

```
Go-Back-N
发送 N, N + 1, N + 2
Sliding window = [N], wait for ACK = NextSeqNumber， 如果ACK = NextSeqNumber超时，将会重传N，N + 1,N + 2

Seletive Repeact
发送 N, N + 1, N + 2
Sliding window = [N, N + 1, N + 2], wait for ACK = N + 1, N + 2, N + 3
如果ACK = N + 1 超时，超时前接收到ACK = N + 2, N + 3
将会重传只重传N 这个segement

```

> Thus, TCP's error-recovery mechanism is probably best categorized as a hybrid of GBN & SR protocols

TCP 超时机制更像是二者的结合，TCP本地只维护一个`NextSeqNumber`（Go-Back_N)，通过`SendBase`（初始值）和`NextSeqNumber`来确认哪个包没收到，从而只重传没收到的初始包(SendBase)



### 3.TCP为什么是三次握手，而不是两次，四次

C <------> S

**四次握手**
1.1 C 发送SYN, **client's seq**
1.2 S 确认接收并且发送ACK,**记录client端的seq**
1.3 S 发送SYN, **server's seq**
1.4 C 发送ACK, **记录server端的seq**

回想之前的ACK，都是在当前**接收的包的序号+1**，表示成功接收的同时发送一个期待值
那么1.2 & 1.3是可以合并的



**三次握手**

2.1 C 发送SYN, **client's seq**
2.2 S 确认接收并且发送ACK = client'seq + 1,**记录client端的seq**, SYN, **server'seq**
2.3 C 发送ACK, **记录server端的seq**



**两次握手**
3.1 C 发送SYN, seq = client_isn
3.2 S 确认接收并且发送 SYN, seq = server_isn, ACK = client_isn + 1,**记录client端的seq**

这里少了一步对**Server端seq**的确认接收，存在两端的初始序号对不上的问题。



## Reference

https://www.zhihu.com/question/24853633/answer/115173386
