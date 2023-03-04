# Web protocol

## HTTP

HTTP关键还是解决人机交互之间的间隔，它门槛较低，人容易理解。

浏览器发起HTTP请求场景：
![image.png](https://s2.loli.net/2023/02/25/kEMB17mq6eWxLcD.png)

评估Web架构的关键属性：
![image.png](https://s2.loli.net/2023/02/26/rujgiNbSt6WOd9U.png)

### 性能衡量

![image.png](https://s2.loli.net/2023/02/26/tJ39E4CHG8cfQ1d.png)

### 可修改性

![image.png](https://s2.loli.net/2023/02/26/yugrtWdUj6nhJAE.png)

### URI 组成

![image.png](https://s2.loli.net/2023/02/26/cw5dEC8UrWtFAZJ.png)

## http 如何实现断点续传 和 多线程下载？

通过`Range`头部传递请求范围，比如`Range: bytes=0-499`


### Range条件请求

现在有这样的一个场景，客服端已经下载了一部分，但过了一段时间打算下载剩余部分，这个时候需要先判断剩余部分是否产生了更新，因此需要与`If-Unmodified-Since`或者`If-Match`头部配合使用，来判断是否过期

