# Lab1-rethinking

靠自己完成了90%+，也非常不错了，但是效率啥的还是挺差的，也没有老师教，只能参考别人的代码了，我觉得这不是抄袭，我是自己动手在先，再参考别人的看差距在哪。

## reference
[Lab1](https://www.misaka-9982.com/2022/01/25/CS144-Lab1/)

能够自己实现并且用两种解法的的确确是大佬，但是他的代码跟他的思路示意图用的变量名不一样，看起来晕晕乎乎的，只好直接放弃那些高深的图，直接看代码。
这里会用自己的方式对齐示意图和代码。

## 思路
一些私有变量名解释：
- `unassem_index` 未重组的字符串的首index,初始化为0
- `unass_size` 未重组字符串的个数
- `_capacity` 之前提过的容量
- `_buffer` 用于存储未能重组的字符串


那么我们考虑以下三种情况：

### 1. index >= unassem_index
这种情况是传入的数据(data)跟我们期待要重组的字符索引之间是有一段间距，间距可=0

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/73530b81d0fa4d749d6df0dc54338c9e~tplv-k3u1fbpfcp-watermark.image?)

**注意这里能够存储的只有`capacity`跟`data`重合的部分**，为什么？

因为如果中间那段空白后面传入了，是期待先重组的，不能舍头逐末。想想如果把data全放进去了，之后不够容量放前面的的子串，就无法成功重组了。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/395544d72d15434ab3bba157ef511b89~tplv-k3u1fbpfcp-watermark.image?)

再看看doc的原图，刻意没有把红色部分画完整。

### 2. index + data.length() < unassem_index


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a0333be672f4798bec0cba3a0e5ca97~tplv-k3u1fbpfcp-watermark.image?)


这种情况不需要考虑，因为传入的数据已重组完了。


### 3. index + data.length() > unassem_index


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e6042f75bf884b798b8a4b91b0cf38c0~tplv-k3u1fbpfcp-watermark.image?)
这种情况会产生交集的部分，交集部分是已经重组了，只需要写入未产生交集的部分，当然也需要考虑`capacity`的限制。





### 组装的逻辑

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26968ae45c7d41fd812bb4113d0f7f42~tplv-k3u1fbpfcp-watermark.image?)

bitmap的索引跟buffey一一对应，如果buffer中缺少重组的字符，那么bitmap对应的位置等于false。

每次截取完字符串之后我们就开始判断是否可以重组，判断重组的逻辑就是判断队头是否为true，如果为true，说明已经可以开始重组。

重组之后呢，不仅需要写入`ByteStream`，还需根据写入的字符长度更新`unassem_index`以及`unassem_size`这个两个变量。

```c++
void StreamReassembler::check_contiguous() {
    string data = "";

    // 看看是否需要重组
    while (bitmap.front()) {
        bitmap.pop_front();
        bitmap.push_back(false);
        data += buffer.front();
        buffer.pop_front();
        buffer.push_back("/0");
    }

    if (data.length() > 0) {
        output.write(data.length());

        _unassem_index += data.length();
        _unass_size -= data.length();
    }
}
```


## 完整代码

stream_reassembler.hh
```c++
#ifndef SPONGE_LIBSPONGE_STREAM_REASSEMBLER_HH
#define SPONGE_LIBSPONGE_STREAM_REASSEMBLER_HH

#include "byte_stream.hh"

#include <cstdint>
#include <map>
// #include <string>

//! \brief A class that assembles a series of excerpts from a byte stream (possibly out of order,
//! possibly overlapping) into an in-order byte stream.
class StreamReassembler {
  private:
    // Your code here -- add private members as necessary.

    ByteStream _output;  //!< The reassembled in-order byte stream
    size_t _capacity;    //!< The maximum number of bytes
    size_t _unass_size = 0;
    size_t _unassem_index = 0;
    bool _eof = false;

    std::deque<bool> bitmap;
    // 存放的是未重组的字符
    std::deque<char> buffer;

    void deal_blank(const std::string &data, size_t index, size_t len);
    void deal_overlap(const std::string &data, size_t index, size_t len);
    void check_contiguous();

  public:
    //! \brief Construct a `StreamReassembler` that will store up to `capacity` bytes.
    //! \note This capacity limits both the bytes that have been reassembled,
    //! and those that have not yet been reassembled.
    StreamReassembler(const size_t capacity);

    //! \brief Receive a substring and write any newly contiguous bytes into the stream.
    //!
    //! The StreamReassembler will stay within the memory limits of the `capacity`.
    //! Bytes that would exceed the capacity are silently discarded.
    //!
    //! \param data the substring
    //! \param index indicates the index (place in sequence) of the first byte in `data`
    //! \param eof the last byte of `data` will be the last byte in the entire stream
    void push_substring(const std::string &data, const uint64_t index, const bool eof);

    //! \name Access the reassembled byte stream
    //!@{
    const ByteStream &stream_out() const { return _output; }
    ByteStream &stream_out() { return _output; }
    //!@}

    //! The number of bytes in the substrings stored but not yet reassembled
    //!
    //! \note If the byte at a particular index has been pushed more than once, it
    //! should only be counted once for the purpose of this function.
    size_t unassembled_bytes() const;

    //! \brief Is the internal state empty (other than the output stream)?
    //! \returns `true` if no substrings are waiting to be assembled
    bool empty() const;
};

#endif  // SPONGE_LIBSPONGE_STREAM_REASSEMBLER_HH

```

stream_reassembler.cc

```c++
#include "stream_reassembler.hh"

#include "iostream"



template <typename... Targs>
void DUMMY_CODE(Targs &&.../* unused */) {}

using namespace std;

StreamReassembler::StreamReassembler(const size_t capacity)
    : _output(capacity), _capacity(capacity), bitmap(capacity, false), buffer(capacity, '\0') {}

void StreamReassembler::deal_blank(const std::string &data, size_t index, size_t len) {
    size_t offset = index - _unassem_index;
    size_t rest = _capacity - _output.buffer_size() - offset;

    // 可能会超出容量
    size_t real_write_count = min(rest, len);

    if (len > rest) {
        _eof = false;
    }

    for (size_t i = 0; i < real_write_count; i++) {
        // 已经接收过
        if (bitmap[i + offset]) {
            continue;
        }
        bitmap[i + offset] = true;
        buffer[i + offset] = data[i];
        _unass_size++;
    }
}

void StreamReassembler::deal_overlap(const std::string &data, size_t index, size_t len) {
    size_t offset = _unassem_index - index;
    size_t rest = _capacity - _output.buffer_size();
    size_t need_write_bytes_count = len - offset;

    // 可能会超出容量
    size_t real_write_count = min(rest, need_write_bytes_count);

    if (len > rest) {
        _eof = false;
    }

    for (size_t i = 0; i < real_write_count; i++) {
        if (bitmap[i]) {
            continue;
        }

        bitmap[i] = true;
        // 注意只写入未重叠的部分
        buffer[i] = data[i + offset];

        _unass_size++;
    }
}

void StreamReassembler::check_contiguous() {
    string data = "";

    // 看看是否需要重组
    while (bitmap.front()) {
        data += buffer.front();
        bitmap.pop_front();
        bitmap.push_back(false);
        buffer.pop_front();
        buffer.push_back('\0');
    }

    if (data.length() > 0) {
        _output.write(data);

        _unassem_index += data.length();
        _unass_size -= data.length();
    }
}

//! \details This function accepts a substring (aka a segment) of bytes,
//! possibly out-of-order, from the logical stream, and assembles any newly
//! contiguous substrings and writes them into the output stream in order.
void StreamReassembler::push_substring(const string &data, const size_t index, const bool eof) {
    if (eof) {
        _eof = true;
    }

    size_t len = data.length();

    // finish reassembling
    if (len == 0 && _eof && _unass_size == 0) {
        _output.end_input();
        return;
    }

    // 边界case:
    // if (index > _unassem_index + _capacity) {
    //     return;
    // }

    if (index >= _unassem_index) {  // 第一种情况
        deal_blank(data, index, len);
    } else if (index + len > _unassem_index) {  // 第三种情况
        deal_overlap(data, index, len);
    }

    check_contiguous();

    if (_eof && _unass_size == 0) {
        _output.end_input();
    }
}

size_t StreamReassembler::unassembled_bytes() const { return _unass_size; }

bool StreamReassembler::empty() const { return _unass_size == 0; }

```


## 总结

1. buffer与bitmap两个双端队列，一个存储字符，一个用于判断是否可以重组。
    - 一旦写入字节流，buffer会加入空字符串，bitmap会加入false以此来代表释放出buffer的一个单位空间。
    - 在这一点上远远超过我直接map<index, char>的设计，如果传入的字符串很长，那么这个map将会存储大量的数据。
2. 根据index unassem_index 以及 capacity三者的关系来判断截取哪一部分写入buffer。
3. 巧妙判断bitmap队头是否为true来确认是否可以拼接，一次性拼接完再调用`_output.write`写入字节流，这个远比我之前一个一个字符写入强太多了。
