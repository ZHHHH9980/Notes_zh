# Getting Started

> [all the wireshark lab links](https://gaia.cs.umass.edu/kurose_ross/wireshark.php)
<br/>
心心念念的wireshark抓包之旅即将开始！工作的时候大佬就是用这个排查问题，查出TCP一直重连，发出来的问题诊断就是wireshark的抓包截图，因此还是有必要好好了解一下的。

## packet sniffer
![在这里插入图片描述](https://img-blog.csdnimg.cn/3f355d5eb06c4db6af26eba46c419501.png)

器如其名，数据包嗅探器捕捉计算机发送和接收的数据；并且将不同的协议内容展示出来。嗅探器本身是消极的，不会主动发送任何数据包，取而代之的是复制在计算机中执行的应用和协议中的数据包。


## packet sniffer structure

大概介绍了一下数据嗅探器的结构。

![在这里插入图片描述](https://img-blog.csdnimg.cn/c918e6d2e8424d7e9e74511d88034f51.png)


The packet capture library 复制所有传送到数据链路层的帧(frame)，回忆一下之前在章节1.5讨论关于各种高层协议，比如HTTP、FTP、TCP、UDP或者IP所有messages都最终会被封装进数据链路层的帧当中。

## packet analyzer
数据包嗅探器的第二部分是`packet analyzer`，主要展示所有协议中的数据。为了打到这个目的，`packet analyzer`必须能理解所有根据协议传输的message。比如一个HTTP的message,`packet analyzer`先解析以太网的`frame`，以便能够解析IP 数据报，便能够从IP数据包中提取出TCP的`segment`，最终解析TCP `segement`，便能提取出封装在里头的HTTP message。
最终能在面板看上看到诸如:”GET“，”POST“等字段。

之后就是如何安装wireshark，就不赘述了。