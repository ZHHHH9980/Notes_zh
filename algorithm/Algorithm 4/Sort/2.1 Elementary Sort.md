# sort

即使你只使用系统自带的 sort 方法，仍有三个理由学习排序算法：

1. 通过分析排序算法学习分析算法性能
2. 定位相似的问题仍有效的技术
3. 我们经常使用排序算法作为解决其他问题的起点（二分搜索）

## Base Sort Api

```js
class Sort {
  exch(a, b) {
    var temp = this.arr[a];
    this.arr[a] = this.arr[b];
    this.arr[b] = temp;
  }

  isSorted() {
    for (let i = 1; i < this.arr.length; i++) {
      if (this.arr[i] < this.arr[i - 1]) {
        return false;
      }
    }
    return true;
  }

  less(a, b) {
    return a < b;
  }
}
```

## Selection sort

core: First, find the smallest item in the array and exchange it with the first entry. Then, find the next smallest item and exchange it with the second entry. Continue in this way until the entire array is sorted.

`code`

```js
class SelectionSort extends Sort {
  constructor(arr) {
    super();
    this.arr = arr;
  }

  sort() {
    var N = this.arr.length;

    for (let i = 0; i < N; i++) {
      var min = i;
      for (let j = i + 1; j < N; j++) {
        if (this.arr[min] > this.arr[j]) {
          min = j;
        }
      }

      this.exch(i, min);
    }
  }
}
```

时间复杂度

```
比较次数C = N - 1 + (N - 2) + ... + 2 + 1 + 0 = N(N - 1) / 2 ~= N^2/2
```

### Summary

1. Running time is insensitive to input (无论是否有序，花费的时间都差不多)
2. Data movement is minimal(数据移动最小，每次只交换两个索引所在位置的元素，不需要额外空间)

## Insertion Sort

书中的解释有点晦涩，以下直接按照自己理解写：

```js
// [ [0，2, 5] , 3, 1, 9 ]
//   ^ 有序窗口   ^ 即将进入窗口的元素
// Insertion Sort像是维护了一个有序的窗口，每次都有一个元素从右侧进入这个有序窗口，不断从后往前比较，知道落到合理位置(当前元素大于前一位的元素)停止
```

### code

```js
class InsertionSort extends Sort {
  constructor(arr) {
    super();
    this.arr = arr;
  }

  sort() {
    var N = this.arr.length;

    // 有序窗口默认有一个元素,
    for (let i = 1; i < N; i++) {
      // 从arr[j]这个元素开始进入窗口
      // j - 1的位置是上一个元素，跟它比较
      for (let j = i; j - 1 >= 0 && this.less(this.arr[j], this.arr[j - 1]); ) {
        this.exch(j, j - 1);
        // 交换位置 指针更新（一直跟着进入窗口的那个元素走）
        j--;
      }
    }
  }
}
```

### 复杂度分析

```
Insertion Sort use N^2 / 4 compares on average

best case: N - 1, 0 exchanges
worst case: N^2 / 2, N^2 / 2 exchanges
```

## Experiments

### 2.1.25 Intersion without exchanges

```js
class XInsertionSort extends Sort {
  constructor(arr) {
    super();
    this.arr = arr;
  }

  sort() {
    var N = this.arr.length;

    // 有序窗口默认有一个元素
    for (let i = 1; i < N; i++) {

      // 记录即将进入窗口的元素
      var current = this.arr[i];
      var j;

      // 比进入窗口元素大的元素都往右移动一位
      for (j = i; j - 1 >= 0 && this.less(current, this.arr[j - 1]); j--;) {
         this.arr[j] = this.arr[j - 1];
      }

      this.arr[j] = current;
    }
  }
}
```

在有序窗口中找位置，之前是每次比较都交换，这次本质上只交换一次

```
// insertion
[2,3,4] <- 1
exch: [2,3,1,4]
exch: [2,1,3,4]
exch: [1,2,3,4]

// xInsertion
var current = 1;
[2,3,4,4]
[2,3,3,4]
[2,2,3,4]
 ^ j
[1,2,3,4]
```

## Shell Sort

> Insertion Sort is slow for large unordered arrays because the only exchanges it does involve adjacent entries

插入排序在大型乱序数组的效率是很低的，因为每次都是跟相邻元素进行比较，想象最小的元素位于数组最右侧，需要交换 N - 1 次才能够归于最左的位置。

`Shell Sort`在此基础上改进了**交换的间距**，将一个数组分成了 h 长度的子数组 named `h-sorted`,这里称作步长更加恰当。

example: 13 sorted:

```
					[P H E L L S O R T E X A M S L E]
13 sorted  ^                         ^
```

从 13 开始跟 0 比较和交换（一次迈出 13 步），依次是 14-1,15-2 的位置比较和交换。

### code

```js
class ShellSort extends Sort {
  constructor(arr) {
    super();
    this.arr = arr;
  }

  sort() {
    var N = this.arr.length;
    var h = 1;

    // 步长
    while (h <= N) h = 3 * h + 1; // 1, 4, 13, 40, 121...

    // 最小就是一步了
    while (h >= 1) {
      // 最后步长会等于1，就跟Insertion Sort没区别了
      for (let i = h; i < N; i++) {
        // difficulty
        for (
          let j = i;
          j >= h && this.less(this.arr[j], this.arr[j - h]);
          j -= h
        ) {
          this.exch(j, j - h);
        }
      }
      h = Math.floor(h / 3);
    }
  }
}
```

### difficulty

如何理解 j >= h 以及 j -=h 的操作

```js
假设初始 h = 4

i = 8
[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
 ^       ^       ^
理解成[0,4]是跨度为4的有序窗口，8为即将进入窗口的元素

i = 12
[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
 ^       ^       ^          ^
理解成[0,4,8]是跨度为4的有序窗口, 12为即将进入窗口的元素

j -= h，跨度为4，每个元素的间隔也是4
j >= h，如果j = 2，h = 4 那么之前就没有元素了
```

因为之前已经将需要交换的元素中跨度较大的解决了,当跨度为 1 时，就不会有超过跨度为 4 的元素交换，大大降低了跨度为 1 的时候需要交换的次数。
