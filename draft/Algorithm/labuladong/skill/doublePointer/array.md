# Array

## 快慢指针

## 两头靠近指针
### [167. Two Sum II - Input Array Is Sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/)

用这道题作为模板就很好哈哈。

```js
/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(numbers, target) {
    var lo = 0,
        hi = numbers.length - 1;
    
    while (lo < hi) {
        var total = numbers[lo] + numbers[hi];
        
        if (total < target) {
            lo++;
        } else if (total > target) {
            hi--;
        } else {
            return [lo + 1, hi + 1]
        }
    }
};
```

## 追逐指针

## [26. Remove Duplicates from Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array/)

删除**有序数组**的重复项，利用覆盖的方式来删除，而不是新增一个数组。

思路是快指针一直在前面探路，慢指针负责指向不重复数组部分的最后一个元素。

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function(nums) {

    var fast = 0,
    slow = 0;

    while(fast < nums.length) {
        if (nums[fast] !== nums[slow]) {
            slow++;
            nums[slow] = nums[fast];
        }

        fast++;
    }

    return slow + 1;
};
```



## 参考

[双指针技巧秒杀七道数组题目](https://labuladong.github.io/algo/di-yi-zhan-da78c/shou-ba-sh-48c1d/shuang-zhi-fa4bd/)