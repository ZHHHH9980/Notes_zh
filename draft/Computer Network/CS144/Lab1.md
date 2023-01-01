# Lab1 stitching substrings into a byte stream
（将子字符串拼接成字节流）
12.29 开始 话说如果没有任何计算机网络理论基础就做这个，估计没法整，所以选择听B站的《计算机网络：自顶向下》再来做实验才是正确的路径。


## stream reassembler
In Lab 1, you’ll implement a stream reassembler —a module that stitches small pieces
of the byte stream (known as substrings, or segments) back into a contiguous stream
of bytes in the correct sequence

Lab1需要实现一个流重组器，是能够将分散的字节流（子字符串）重组成正确顺序的模块。

还给了个示意图：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/73a28253bb294627b32605addddfeeb2~tplv-k3u1fbpfcp-watermark.image?)


### Putting substring in sequence (按顺序放置子串)

The TCP sender is dividing its byte stream up into short segments (substrings no more than
about 1,460 bytes apiece) so that they each fit inside a datagram. But the network might
reorder these datagrams, or drop them, or deliver them more than once. The receiver must
reassemble the segments into the contiguous stream of bytes that they started out as.

substring不会超过1460字节，这是因为以太网MTU的限制是1500字节，减掉IPv4头部40个字节的大小。那么任务就是将打散的`segements`进行重组。

`StreamReassembler`会接收子串，包含字节字符串以及索引，这个索引指向的是该字符串的第一个字节位于整个流中的索引。

### capacity

之后还强调了一下容量，已经重组的字符（但未读取）和未重组的子串之和不能超出这个容量大小。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/395544d72d15434ab3bba157ef511b89~tplv-k3u1fbpfcp-watermark.image?)