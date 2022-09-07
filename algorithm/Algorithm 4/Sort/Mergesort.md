# Mergesort

> merge: combine two ordered arrays to make one larger ordered array.

## straighforward approach

create an output array of the requisite size and then choose successively the smallest remaining item from the two input arrays to be the next item added to the output array.

直接了当的操作
取两个数组作为输入，两个数组数量和作为输出数组的长度，从两个输入数组中取出最小元素放入输出数组中。
我猜测应该是这个意思：

```js
function merge(arr1, arr2) {
  var output = new Array(arr1.length + arr2.length);
  // merge...

  return output;
}

function sort(nums, lo, hi) {
  var mid = Math.floor((lo + hi) / 2);
  var arr1 = sort(nums, lo, mid);
  var arr2 = sort(nums, mid + 1, hi);

  return merge(arr1, arr2);
}
```

但是这样是有问题的,随着要排序的数组数量不断增大，要 hold 住的 output 会越来越多，会导致使用很多额外的空间。
因此书中更建议原地合并(in-place merge),直接借助一个辅助数组修改原数组。

## in-place merge

[class Sort](./Elementary\SSort)在上一章节

### code

```js
class MergeSort extends Sort {
  constructor(arr) {
    super();
    this.aux = [];
    this.arr = arr;

    this.sort(arr, 0, arr.length - 1);

    return arr;
  }

  sort(arr, lo, hi) {
    if (lo >= hi) {
      return;
    }

    // <3>
    // divide into two halves
    // [lo, mid] & [mid + 1, hi]
    let mid = Math.floor((lo + hi) / 2);

    this.sort(arr, lo, mid);
    this.sort(arr, mid + 1, hi);

    this.merge(arr, lo, mid, hi);
  }

  merge(arr, lo, mid, hi) {
    let i = lo,
      j = mid + 1;

    // Copy a[lo...hi] to aux
    for (let k = lo; k <= hi; k++) {
      this.aux[k] = arr[k];
    }

    for (let k = lo; k <= hi; k++) {
      if (i > mid) {
        // left half is exhausted
        arr[k] = this.aux[j++];
      } else if (j > hi) {
        // right half is exhausted
        arr[k] = this.aux[i++];
      } else if (this.less(this.aux[j], this.aux[i])) {
        arr[k] = this.aux[j++];
      } else {
        // if equal, choose the left side's item
        arr[k] = this.aux[i++];
      }
    }
  }
}
```

### Analysis

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a79ae34430f4dbf8bed2fc96dd0c112~tplv-k3u1fbpfcp-watermark.image?)

元素的个数假设为 N，那么树的高度为 logN，每次递归的`merge`函数时间复杂度是 N，那么相乘之后的时间复杂度就是 N\*logN。

## Bottom-up mergesort

Top-down 的操作是通过递归不断缩小范围，直到 entry = 1，仅缩小到一个元素的时候开始将两个`subarray`进行`merge`。而 bottom-up 的思想是以最小 size = 1 开始自底向上开始`merge`，比如[4,3,2,1]，拆成[4],[3]和[2],[1]进行 merge,之后 size 乘以 2，将数组拆成[3,4]和[1,2]进行合并。

### Reference

### code

```js
class MergeSortBU extends Sort {
  constructor(arr) {
    super();
    this.aux = [];
    this.arr = arr;

    this.sort(arr);
  }

  // ...

  sort(arr) {
    let N = arr.length;

    for (let sz = 1; sz < N; sz = 2 * sz) {
      // <1>
      for (let lo = 0; lo + sz < N; lo += 2 * sz) {
        const rightBound = Math.min(lo + 2 * sz - 1, N - 1); // <2>
        // <3>
        this.merge(arr, lo, lo + sz - 1, rightBound);
      }
    }
  }
}
```

自底向上的思想是从底部按照 sz = 1...2...4 分成左右两个子数组进行归并。

- 左子数组的范围是 [lo, lo + sz - 1]
- 右边子数组的范围是 [lo + sz, lo + 2 * sz - 1]

只有理解这上面的范围才能理解边界条件

```js

<1> lo + sz < N 的 解释
具体化
N = 1, lo = 0, sz = 1
N = 2, lo = 0, sz = 1
抽象化
lo + sz是右子数组的第一个位置，如果超出数组范围N,那么就无法进行归并。

<2>
lo + 2 * sz - 1 即为右子数组的右侧边界，可能会超过N - 1（整个数组范围），那么取二者最小值即可。

<3>
这里是将左子数组的右侧边界作为mid 这个应该比较好理解,自顶向下中的<3>刚好就是按照[lo, mid]&[mid + 1, hi]来分成两个子数组的。
mid = lo + sz - 1
```
