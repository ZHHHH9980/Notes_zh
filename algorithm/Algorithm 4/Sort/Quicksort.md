# Quicksort

> The quicksort algorithm's desirable features are that it is in-place (uses on ly a small auxiliary stack) and that it requires time proportional to NlogN on the average to sort an array of length N.

快速排序理想的特性有原地排序（仅需很小的辅助栈）并且对长度为 N 的数组排序只需要 NlogN 的平均时间复杂度。

## code

```js
class Quicksort extends Sort {
  constructor(arr) {
    super();

    this.arr = arr;
    this.sort(arr, 0, arr.length - 1);
  }

  sort(arr, lo, hi) {
    if (lo >= hi) {
      return;
    }

    let pivot = this.partition(arr, lo, hi);
    this.sort(arr, lo, pivot - 1);
    this.sort(arr, pivot + 1, hi);
  }
}
```

核心是`partition`的操作，需要构建一个轴点（pivot）,pivot 左侧都小于等于 pivot,右侧都大于 pivot。书上的图太清晰了，我直接照搬书了...
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d3d6400634114a4e93d0c8e4496d1c47~tplv-k3u1fbpfcp-watermark.image?)

```js
  partition(arr, lo, hi) {
    let i = lo;
    // 让j一开始指向最后一个元素
    let j = hi + 1;
    let v = arr[lo];

    while (true) {
      while (this.less(this.arr[++i], v)) {
        // 扫描到右侧边界了
        if (i == hi) break;
      }

      while (this.less(v, this.arr[--j])) {
        // 扫描到左侧边界
        if (j == lo) break;
      }

      if (i >= j) break;

      // 此时arr[i] > pivot, arr[j] < pivot,那么需要交换一下这两个元素
      this.exch(i, j);
    }
    this.exch(lo, j);

    return j;
  }
```

## 面试速记

```js
partition核心操作：
 1. 选择一个值作为轴点,这里选择arr[lo]
 2. while(true) 中左右交替扫描
 3. 左侧扫描 while(less(v, arr[++i]))
 4. 右侧扫描 while(less(arr[--j], v))
 5. 左右扫描都结束，考察i，j位置情况
 6. 扫描结束交换轴点exch(lo, j)

  v = arr[lo]

  arr = [1,2,3,8, 4,5,6,9]
         ^lo              ^hi + 1
         ^i               ^j
```
