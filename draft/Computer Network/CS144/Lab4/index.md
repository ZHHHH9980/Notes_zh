# Lab4 记录

- 1.23 大年初二开始翻译Lab4，没想到从入门到放弃，又一步一步走到Lab4，Lab3没有参考任何他人的代码，全靠C++ API文档+面向测试编程完成。
- 算上Lab0，总共是有7个Lab，预计会有8个Lab，最后一个Lab是给自己加的，编写整个总结的文档。
- 1.28 以为Lab4会比较简单，把Sender和Receiver整合在一起即可，没想到很可能需要重写一部分代码。看了别人的笔记和文档，提到了一些我面向测试编程忽略的概念。
- Lab4 遇到了个恶心的bug，直接导致shell脚本写的test case全挂
- 2.8 基本上是完成了 Lab4 ，虽然有几个test case会偶发报错，尴尬的是没有发出任何数据包就fail了，可能暂时没有时间去排查了
- 看了这篇博客突然对整个实验有了一些比较清晰的认识，[kiprey](https://kiprey.github.io/2021/11/cs144-lab4/)

## 遇到的大坑

在`stream_reassembler.cc`会有一段拼接字符串的逻辑

```c++
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
        // 在这里输出了data
        // cout << "data: " << data << endl;
        _output.write(data);

        _unassem_index += data.length();
        _unass_size -= data.length();
    }
}
```

通过cout输出了data，估计是持有了data导致无法被获取，总之因为这段代码，所有fsm开头的test case 全挂了..