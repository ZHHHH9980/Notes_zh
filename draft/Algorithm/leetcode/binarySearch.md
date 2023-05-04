# binarySearch

## [852. Peak Index in a Mountain Array](https://leetcode.com/problems/peak-index-in-a-mountain-array/description/?envType=study-plan&id=binary-search-i)

这道题算二分里边比较困难的题目。

```ts
function peakIndexInMountainArray(arr: number[]): number {
    // [1, 5, 4, 2, 1]
    //        ^ mid
    // if A[mid] > A[mid + 1], right = mid

    // [1, 2, 4, 5, 1]
    //        ^ mid
    // if A[mid] < A[mid + 1], left = mid + 1

    
    var left = 0;
    var right = arr.length;

    while (left < right) {
        // 向下取整，也就是索引偏左
        var mid = Math.floor((left + right) / 2);

        if (arr[mid] > arr[mid + 1]) {
            right = mid;
        } else if (arr[mid] < arr[mid + 1]) {
            left = mid + 1;
        } 
    }

    return left;
};
```

这里边有个细节就是 `arr[mid]`与`arr[mid + 1]`来判断新区间的范围，为什么不用arr[mid]与arr[mid - 1]
``` js
if (arr[mid] > arr[mid + 1]) {
    right = mid;
} else if (arr[mid] < arr[mid + 1]) {
    left = mid + 1;
} 
```

主要是mid的取值:
```js
    var mid = Math.floor((left + right) / 2); // 是向下取整的
    [0, 1]
     ^ mid
```


## [367. Valid Perfect Square](https://leetcode.com/problems/valid-perfect-square/description/?envType=study-plan&id=binary-search-i)

square number:
```
1 = 1
4 = 1 + 3
9 = 1 + 3 + 5 
16 = 1 + 3 + 5 + 7
```

### 解法1

```
function isPerfectSquare(num: number): boolean {
    var target = num;
    var cur = 1;

    while (target > 0) {
        target -= cur;
        cur += 2;
    }

    return target === 0;
};
```

纯线性的逼近，不过能想到这个方法其实这道题基本上就解决了，剩下的不过是用二分优化一下。


### 解法2

```
function isPerfectSquare(num: number): boolean {
    var high = num;
    var low = 1;

    while (low < high) {
        var mid = Math.floor((low + high) / 2);

        if (mid * mid > num) {
            high = mid - 1;
        } else if (mid * mid < num) {
            low = mid + 1;
        } else {
            return true;
        }
    }

    return low * low === num; 
};
```

这个解法一开始还有点没反应过来，本质上就是Square Number的取值肯定在 [1, num] 之间，不断取mid，逼近这个具体的值即可，直到逼近到某一个具体的值还没拿到，说明就不是Perfect Square Number。
