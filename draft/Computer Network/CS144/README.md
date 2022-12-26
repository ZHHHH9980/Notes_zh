
# 实验准备

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8bdc6b6eee3b4b4497d00a03a8fc3690~tplv-k3u1fbpfcp-watermark.image?)

由于我用的是M2的Macbook，直接使用VirtualBox会报错，幸好CS144给了一个备用方案，UTM+image的组合也能够运行~

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ac5770eb4a54bf58bfb52ab4e18da25~tplv-k3u1fbpfcp-watermark.image?)

试了一下，UTM 还是太弱了，需要自己配置网络，连DNS都无法解析。
还是得用`VirtualBox`，只好明天去公司换电脑...

CS144已经为我们配置好了SSH，只要启动虚拟机即可在Vscode上连接，cool！

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17dbb677c188412eb8e9c7b560b83b93~tplv-k3u1fbpfcp-watermark.image?)

（vscode通过SSH远程连接本质上是让我们使用vscode来编写代码，真正调用API还是得在虚拟机上）

## Lab0
说实话第一次做Lab0都有点把我劝退了，全英文文档，看的我有些吃力，而且不太能get到到底我要做什么才能完成任务，为了先完成一个Lab参考了好几份别人的答案才完成。现在间隔大概四五个月我再次打开Lab0的doc，不太确定是不是完善了doc，感觉没有那么困难了。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2051ee06ddd4f64aec4924dc2fc60a2~tplv-k3u1fbpfcp-watermark.image?)

文档说的非常清楚了，让我们读sponge的文档，并且特别注意`FileDescriptor`,`Socket`,以及`TCPSocket`和`Address`这些类。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a60ca7fe19d43df9bda8c8395914ad1~tplv-k3u1fbpfcp-watermark.image?)

其实三个类是有继承关系的。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8c2c0ca1f0743548af527c531c55952~tplv-k3u1fbpfcp-watermark.image?)
说的也很清楚了，需要用TCP作为支持去建立链接发生请求，并且接收数据，像之前发送HTTP请求那样。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/acf778b42b534bdda7b98e5589194dee~tplv-k3u1fbpfcp-watermark.image?)
要用什么类和注意点都说了。

关于使用TCPSocket，突然想到《计算机网络：自顶向下》这本书上的Socket Programming 有关TCP的部分。
python代码是这样的：
```python
from socket import *
serverName = 'servername'
serverPort = 12000
clientSocket = socket(AF_INET, SOCK_STREAM)
clientSocket.connect((serverName, serverPort))
sentence = raw_input('Input lowercase sentence:')
clientSocket.send(sentence.encode())
modifiedSentence = clientSocket.recv(1024)
clientSocket.close()
```

