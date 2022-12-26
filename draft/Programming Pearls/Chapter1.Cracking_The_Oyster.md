# Cracking the Oyster（剥开牡蛎）

## 如何排序一个磁盘文件？

输入：一个文件，内包含的整数小于 n，n <= 10^7，每个整数都是独一无二的。
输入：按照升序排列文件中的整数。
限制条件：只有 1MB 内存可供使用，运行时间尽量不超过 10s。

## 解决方案一：磁盘多路归并排序

![image](https://ask.qcloudimg.com/http-save/yehe-1433204/ehz9o9d5fr.jpeg?imageView2/2/w/1620)

算法思路
我们需要在内存里维护一个有序数组。每个输入文件当前最小的元素作为一个元素放在数组里。数组按照元素的大小保持排序状态。

1.  如果取出来的元素和当前数组中的最小元素相等，那么就可以直接将这个元素输出。再继续下一轮循环。不可能取出比当前数组最小元素还要小的元素，因为输入文件本身也是有序的。

    接下来我们开始进入循环，循环的逻辑总是从最小的元素下手，在其所在的文件取出下一个元素，和当前数组中的元素进行比较。根据比较结果进行不同的处理，这里我们使用二分查找算法进行快速比较。注意每个输入文件里面的元素都是有序的。

    ![image](https://ask.qcloudimg.com/http-save/yehe-1433204/hsjld341zk.png?imageView2/2/w/1620)

2.  否则就需要将元素插入到当前的数组中的指定位置，继续保持数组有序。然后将数组中当前最小的元素输出并移除。再进行下一轮循环。
    ![image](https://ask.qcloudimg.com/http-save/yehe-1433204/o81pn0guw0.png?imageView2/2/w/1620)
3.  如果遇到文件结尾，那就无法继续调用 next() 方法了，这时可以直接将数组中的最小元素输出并移除，数组也跟着变小了。再进行下一轮循环。当数组空了，说明所有的文件都处理完了，算法就可以结束了。
    ![image](https://ask.qcloudimg.com/http-save/yehe-1433204/wcvmone8nl.png?imageView2/2/w/1620)

    值得注意的是，数组中永远不会存在同一个文件的两个元素，如此才保证了数组的长度不会超过输入文件的数量，同时它也不会把没有结尾的文件挤出数组导致漏排序的问题。

### 二分查找

```js
// 找到左侧边界的二分搜索
function binarySearch(arr, num) {
  let lo = 0,
    hi = arr.length;

  // [lo, hi)
  while (lo < hi) {
    let mid = Math.floor((lo + hi) / 2);
    if (arr[mid] > num) {
      hi = mid;
    } else if (arr[mid] < num) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }

  return lo;
}

// normal case:
// [ 1 2 3 4]   3
//       ^ lo hi
// index = 2

// left case
// [1 2 3 4]  0
// ^ hi lo
// index = 0

// right case
// [1 2 3 4]   5
//           ^ lo hi
// index = 4

if (index < arr.length) {
  // 直接插入
  arr.splice(index, num, 1);
} else {
  // 删除当前位置的数字， 放入末尾
  arr.splice(index);
  arr.push(num);
}
```

### 思考

这个算法我是能够理解的，但是写到二分查找之后就无法进行下去了，因为 nodejs 是基于事件读取文件的，并不像其他语言一样用指针的方式可以真正做到逐行读取到内存中。
那么如果有 20 个文件，平均分割了这个大文件的所有整数并且各自自行了归并排序，最后只需要维护一个长度为 20 的升序数组，不断从各个文件里面读取数字，判断是直接输出还是插入到数组的其他位置，这个行为非常节省内存，但是时间消耗是巨大的，需要不停地进行 IO 读取，数组的插入也是非常耗时的。
