# Lab2


## The TCP Receiver TCP接收器

TCP receiver 负责接收TCP segments，重组字节流，并且决定发送一个”已获取”和流量控制的信号给接受者。
 
In TCP, `acknowledgement`意味着，接受者所期待的下一个字节的索引是多少？这个能让发送者知道，哪个字节需要发送或者重新发送。流量控制的意思是，接收方愿意接收的索引范围是多少？

## 3.1 让64位索引和32位序列号能互相转换

上个实验字节流中的每个字节都有一个64位的索引，64位足够大，因此永远不可能出现溢出的情况。
然而在TCP头部中，空间是非常珍贵的，因此每个字节的索引不再是64位而是32位的序列号，因此引来了三个复杂度：

1. 实现需要围绕32位整型

    TCP中的流可以是无限长，字节流在TCP中的传输没有任何限制。但是2^32只有4GiB，并不是非常大。一旦32位序列号增长到2^32 - 1，（也就是2进制31位全部为1），流中的下一个字节将恢复到0

2. TCP 序列号从一个随机数开始

    为了提升安全性，以及避免更早的链接产生的旧`segement`带来的困扰，TCP尝试确保序列号不能被猜到且不可能重复。因此流开始的序列号不会为0。第一个流中的序列号是一个32位随机数，称作ISN(Initial Sequence Number)。这个序列号代表SYN(流的起始点)。剩余的序列号这样表示：数据的第一个字节将会用ISN+1（模2^32)作为序列号，第二个字节是ISN+2(模2^32)，以此类推。

3. 起始点和终止点各占一个序列号

    除了确保接受所有数据的字节以外，TCP还确保可靠接收流的开始和结束，SYN代表流开始，FIN代表流结束。因此，在TCP中SYN和FIN都被分配了序列号，各占一个序列号。（ISN就是SYN占用的序列号），流中的数据中的每个字节也占用一个序列号。**注意SYN和FIN并不是流中的部分，它们不是字节，它们仅代表流的开始和结束。**

这些序列号在每个TCP的segment的header中存储并传送。再次声明，有两个流位于两个方向，每个流都有各自区分的序列号以及不同的随机ISN。这里还讨论了绝对序列号的概念（从0开始并且不会循环使用），流索引（已经在`StreamReassemblerz中实现过，每个索引代表一个字节，从0开始）

为了确保这些概念被深刻理解，考虑一个字节流仅包含三个字符"cat"，如果SYN被设置为2^32 - 2，那么对于每个字节的序列号,绝对序列号，以及流索引将是：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1c04ef589fd84b3bb799b3801f4db3ea~tplv-k3u1fbpfcp-watermark.image?)

在绝对序列号和流索引直接转换是很简单的，就是+1/-1。麻烦的是在序列号和绝对序列号之间的转换，会产生很多让人困惑麻烦的bugs。为了从系统层面避免这些bugs，我们将用一个自定义类型`WrappingInt32`来代表序列号，然后编写一个它跟绝对序列号(以uint64_t代表)。`WrappingInt32`是一个包裹类型的例子：一个类型包含了一个内置类型(在这个场景是uint32_t)并且提供一系列不同的函数和操作符。

我们将会为你定义这个类型并且提供一些有用的函数（参考 wrapping_integers.hh)，但你将在wrapping_integers.cc中实现转换：

1. WrappingInt32 wrap(uint64 t n, WrappingInt32 isn)
    
    功能：相对序列号->序列号。提供一个绝对序列号和ISN ,能够生成对应的序列号。

2. uint64_t unwrap(WrappingInt32 n, WrappingInt32 isn, uint64 t checkpoint)

    功能：序列号->相对序列号。提供一个序列号，ISN，以及绝对校验点序列号。计算与检查点最近的序列号。

    注意：检查点是必须的，因为给定一个序列号，可以产生无数绝对序列号。举例，如果ISN=0,序列号"17"对应的绝对序列号可以是"17",也可以是"2^32+17"，或者"2^33+17"等等。检查点有助于解决歧义：它是此类的用户知道“在正确答案的大致范围内”的绝对序列号。**在 TCP 实现中，将使用最后一个重组字节的索引作为检查点。**

    提示：最简单的实现应该使用`wrapping_integers.hh`中的辅助函数。`wrap/unwrap`操作应该保留偏移量，两个相差17的序列号(seqnos),对应的绝对序列号(absolute seqnos)也应该相差17.


我一开始是这样写`wrap`的,问题就出在我用一个32位无符号去模64位无符号，肯定是会导致32被转成64位，再取模。

```c++
    // absolute seqno -> seqno
WrappingInt32 wrap(uint64_t n, WrappingInt32 isn) {
    uint32_t max = 1 << 31;
    uint32_t seqno = (static_cast<uint64_t>(isn.raw_value()) + n) % max;

    return WrappingInt32{seqno};
}
```
那么应该这么写

```c++
WrappingInt32 wrap(uint64_t n, WrappingInt32 isn) {
    uint64_t max = 1 << 31;
    uint32_t seqno = (static_cast<uint64_t>(isn.raw_value()) + n) % max;

    return WrappingInt32{seqno};
}
```

但是看了下其他大佬的写法，明显优雅的多，其实只要保证在同一个维度上做模运算就不会出问题。
这个写法就是在32位无符号这个维度上运算的。
```c++
WrappingInt32 wrap(uint64_t n, WrappingInt32 isn) {
    uint32_t tmp = (n << 32) >> 32;
    return isn + tmp;
}
```

接下来是`unwrap`，这个东西真的卡了我好久，一度让我怀疑我的智商。
当时的思路是计算出n 和 checkpoint在32int下的diff绝对值，再直接加到checkpoint上。
```c++
 // seqno -> absolute seqno
uint64_t unwrap(WrappingInt32 n, WrappingInt32 isn, uint64_t checkpoint) {

    uint64_t max = 1 << 31;
    uint32_t checkpoint_seq_offset = static_cast<uint32_t>(checkpoint % max) - isn.raw_value();
    uint32_t n_offset = n.raw_value() - isn.raw_value();

    uint32_t offset = n_offset - checkpoint_seq_offset;
    uint64_t n_checkpoint_offset = static_cast<uint64_t>(abs(int(offset)));

    uint64_t res = checkpoint + n_checkpoint_offset;

    return res;

}
```
实在是搞不清楚到底错哪了，这边我只好找一份比较能[理解的代码来学习了](https://zhuanlan.zhihu.com/p/265156728)。
```c++
uint64_t unwrap(WrappingInt32 n, WrappingInt32 isn, uint64_t checkpoint) {
    uint64_t diff = n.raw_value() - isn.raw_value();

    if (checkpoint <= diff)   {
        return diff;
    }
    else {
        uint64_t size_period = 1ul << 32, quotient, remainder;   
        quotient = (checkpoint - diff) >> 32;
        remainder = ((checkpoint - diff) << 32) >> 32;
        if (remainder < size_period / 2)
            return diff + quotient * size_period;
        else
            return diff + (quotient + 1) * size_period;
    }
}
```

转成absolute_seqno可能会有多个可能的值，因为会有多次`wrap`的情况，这里考虑了两种情况，一种是无wrap，也就是checkpoint会小于等于diff，如果大于diff，就需要判断取模的余数跟哪个临界点更接近，判断的依据就是周期的一半，类似与四舍五入的操作。

## 3.2 实现TCP接收器
功能：
1. 接收segment
2. 使用`StreamReaseemblre`重组字节流
3. 计算ACK以及window size

TCP segement组成，非灰色的是需要重点关注的字段。
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f89a1eb15c624da4822177eb0ce9532e~tplv-k3u1fbpfcp-watermark.image?)

### segement_received()
主要工作方法，每次接收到segment都会被调用。
1. 如果有必要的话，设置ISN(Initial Sequence Number). 
第一个到达且带有SYN flag的segemnt的序列号将是初始序列号，需要跟踪它以保证seq和absolute seq直之间的转换。
2. 推送所有数据，或者流结束的标志给`StreamReassembler`。如果FIN被设置，那么payload的最后一个字节是整个流的最后一个字节。注意`StreamReassembler`需要流的索引从0开始，那么必须`unwrap`seqno来生成。

## TODO
1. 结合CSAPP这本书，了解64位模一个32位数会得到什么结果。
2. unwrap这块其实不是特别能理解，emmm，只能知道是一个四舍五入的操作，以后如果有时间再投入吧。

## 参考

[知乎](https://zhuanlan.zhihu.com/p/265156728)

[额外发现的B站视频](https://www.bilibili.com/video/BV1mK411f7B1/?spm_id_from=333.337.search-card.all.click&vd_source=4428275621435abc77c0ccd828a444b9)