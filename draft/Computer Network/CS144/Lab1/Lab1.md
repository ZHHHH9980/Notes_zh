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


## 我的思路

前提
- 字节流第一个索引是从0开始的，因此我期待重组的索引是从0开始(_expect_index = 0)

### 1. 存储
每当`push_substring`执行就会有字符串进来。
我声明了一个`map`用于记录每个字符。
两种情况：
1. 如果当前索引对应的字符已经存在，则跳过
2. 如果当前索引还未存过字符，那么存入map，并且未重组的字节数+1


```c++
void StreamReassembler::push_substring(const string &data, const size_t index, const bool eof) {

    for (size_t i = 0; i < data.length(); i++) {
        size_t cur_index = index + i;

        // 当前字符不存在
        if (_map.find(cur_index) == _map.end()) {
            // 存进map
            _map[cur_index] = data[i];

            // 未重组的数量+1
            _unassembled_bytes_count++;
        } else {
            // 已经存在
            continue;
        }
    }
}
```

### 2.重组
存储完毕后开始重组，从当前期待的索引(_expect_index)开始，如果_expect_index存在于map，那么取出放入字节流内。并且写入的字符数不能超过容量(_capacity)

```c++
void StreamReassembler::push_substring(const string &data, const size_t index, const bool eof) {
    //...
    
    // check是否存在连续的数据，继续拼接
    while (_map.find(_expect_index) != _map.end() && _output.buffer_size() < _capacity) {
        _output.write(_map[_expect_index]);
        _unassembled_bytes_count--;
        _expect_index++;
    }
}
```

### 3. eof的判断

```c++
void StreamReassembler::push_substring(const string &data, const size_t index, const bool eof) {
    if (eof) {
        _eof = eof;
    }

    // 1. 存储
    // 2. 重组

    // 文件结尾 并且不存在需要重组的字符串了
    if (_eof && _unassembled_bytes_count == 0) {
        _output.end_input();
    }
}
```


以我目前的水平判断，有两个问题。
1. 使用map多少有点问题，因为如果字符串特别大，那么map里面会存储大量的键值对。
2. 如果期待的索引和当前`push_substring`传入的`index`相等，那么应该直接写入，而没必要再存储了。


最后的话还是过不了所有测试，倒在了其中一个测试的一个case，是一个大循环，debug会在某个断点卡住，现在的能力还无法判断出问题到底出在哪儿。

就挂在这么一个test上了...
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6aa959aa25c04577a42f4879c04d1675~tplv-k3u1fbpfcp-watermark.image?)

