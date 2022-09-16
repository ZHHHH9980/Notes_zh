# binary-search

704. Binary Search

...



### [34. Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/)

比较麻烦的是左右边界的二分查找：

考虑两种情况：

1. target 过大/过小导致出界
2. target值存在

### 左侧边界

![在这里插入图片描述](https://img-blog.csdnimg.cn/0a3bbb06543d42cbb6102d050b923700.png)



两边都闭合的写法：

```js
var findLeft = (nums, target) => {
    var left = 0,
        right = nums.length - 1;
    
    while (left <= right) {
        var mid = Math.floor((left + right) / 2);
        
        if (target > nums[mid]) {
            left = mid + 1;
        } else if (target < nums[mid]) {
            right = mid - 1;
        } else {
            right = mid - 1;
        }
    }
  
    // 越界
    if (left === nums.length) return -1;
    
    // 参考情况1和2
    return nums[left] === target ? left : -1;
}
```



左闭右开：

```js

// [left, right)
var findLeft = (nums, target) => {
    var left = 0,
        right = nums.length;
    
    while (left < right) {
        var mid = Math.floor((left + right) / 2);
        
        if (target > nums[mid]) {
            left = mid + 1;
        } else if (target < nums[mid]) {
            // right是开区间，直接等于mid，就排除mid了
            right = mid;
        } else {
            right = mid;
        }
    }
    
    if (left === nums.length) return -1;
    
    return nums[left] === target ? left : -1;
}
```



### 右侧边界

![在这里插入图片描述](https://img-blog.csdnimg.cn/50fb3f54af7e423f919cf5ca3780ddd4.png)

参考第二种情况，这里打算取right作为右侧边界值，**那么第一种情况就会越界**

```js

var findRight = (nums, target) => {
    var left = 0,
        right = nums.length - 1;
    
    while (left <= right) {
        var mid = Math.floor((left + right) / 2);
        
        if (target > nums[mid]) {
            left = mid + 1;
        } else if (target < nums[mid]) {
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }
    
    // 越界
    if (right < 0) return -1;
    
    // 参考情况2和3
    return nums[right] === target ? right: -1;
}
```

最后套用上面的两个函数即可：

```js
var searchRange = function(nums, target) {
    return [findLeft(nums, target), findRight(nums, target)]
};
```



### 总结

无论是左闭右开还是左闭右闭，查找左右边界，直接画图，考虑target小于数组最小值，大于最大值，target在数组范围的三种情况即可。
