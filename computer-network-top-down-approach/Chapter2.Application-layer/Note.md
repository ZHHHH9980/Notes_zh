# Application Layer

## 2.1 Principles of Network Applications

网络最复杂的部分都放在网络边缘，对于应用层，并不需要关心底层的硬件实现。

### 2.1.1 Network Application Architectures

现代网络应用架构一般有两种

1. client-server architecture
   客户端-服务端架构，数据集中在 served 端，客户端为用户代理发送请求。
2. peer to peer architecture
   P2P 架构，数据分布在各个主机中，并没有一个集中的数据中心。

### 2.1.2 Process communicating

在一个主机上会运行多个应用，操作系统会为每个应用开启一个进程，应用与应用直接的数据传输也是进程与进程之间的通信。传输层为应用层建立了一个提供数据传输服务的接口，称为**`socket`**,应用层通过操作`socket`提供的 API 来达到数据传输到对等层的目的。

### 2.1.3

略

### 2.1.4 Transport Services Provided by the Internet

一般传输层向应用层提供两种服务：

1. 可靠的 TCP 传输服务，具有超时重传，错误检测，顺序发送顺序接收等机制。
2. 不可靠的 UDP 传输服务，顺序发送乱序接收，不需要握手，性能较好，适用于实时多媒体应用，对丢包现象可容忍度较高的场景。

### 2.1.5 Application-Layer Protocols

应用层协议目前主要有 HTTP（应用于 Web 端），SMTP（应用于电子邮件）。

## 2.2 The Web and HTTP
