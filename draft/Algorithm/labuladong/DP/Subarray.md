<!--
 * @Author: ZHHHH9980 howzhongzh@gmail.com
 * @Date: 2023-04-30 18:13:01
 * @LastEditors: ZHHHH9980 howzhongzh@gmail.com
 * @LastEditTime: 2023-05-04 22:46:22
 * @FilePath: /Notes_zh/draft/Algorithm/labuladong/DP/Subarray.md
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
# Subarray

## [53. Maximum Subarray](https://leetcode.com/problems/maximum-subarray/description/)

直觉上是 maxSub(A, i, j) 表示Arr[i...j] 中最大的子数组，但这样很难找到递归关系

maxSub(A, i) 表示 Arr[0...i]中子数组的最大和

如果 Sum[0...i - 1]的子数组最大和都已经<0，那就没必要将Sum弄得更小

maxSub(A, i) = (maxSub(A, i - 1) < 0 ? 0: maxSub(A, i - 1)) + A[i]

## [918. Maximum Sum Circular Subarray](https://leetcode.com/problems/maximum-sum-circular-subarray/description/?envType=study-plan&id=dynamic-programming-i)

两种情况：

![image.png](https://s2.loli.net/2023/05/02/HIwDVAtRBocE4XF.png)

1. 最大的子数组位于环形数组中段部分。
2. 最大的子数组位于环形数组的头尾两端。

### Prove of the second case 第二种情况的证明

max(prefix+suffix)
= max(total sum - subarray)
= total sum + max(-subarray)
= total sum - min(subarray)

那么maximumSum = max(max(subarray), total - min(subarray))


### Corner case 边界情况

有一种情况是，如果数组里边的元素都是负数，那么maxSum = max(A)， minSum = sum(A)

在这种情况下，max(maxSum, total - minSum) = 0 意味着空子数组值最大，但根据描述，我们需要返回max(A)，而不是空子数组的和


### code


```ts
function maxSubarraySumCircular(nums: number[]): number {
  var maxSum = nums[0];
  var minSum = nums[0];

  var minDp = [nums[0]];
  var maxDp = [nums[0]];

  var total = nums[0];

  for (let i = 1; i < nums.length; i++) {
    maxDp[i] = (maxDp[i - 1] < 0 ? 0 : maxDp[i - 1]) + nums[i];
    maxSum = Math.max(maxDp[i], maxSum);

    minDp[i] = (minDp[i - 1] > 0 ? 0 : minDp[i - 1]) + nums[i];
    minSum = Math.min(minDp[i], minSum);

    total += nums[i];
  }

  return maxSum > 0 ? Math.max(total - minSum, maxSum): maxSum;
}
```


## [152. Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray/description/?envType=study-plan&id=dynamic-programming-i)

灵感来自：

![image.png](https://s2.loli.net/2023/05/03/fJV8R91NQ7H3U45.png)

也就是说数组不存在0的情况下，最大的product一定来自于prefix or suffix。

## Coner Case

如果数组中间出现了0，那么之后产物的Product都会是0。0当然需要统计，但不应该影响之后curMax的计算。

```ts
function maxProduct(nums: number[]): number {
  var leftMax = Number.MIN_SAFE_INTEGER;
  var leftCur = 1;
  var rightMax = Number.MIN_SAFE_INTEGER;
  var rightCur = 1;

  for (let i = 0; i < nums.length; i++) {
    if (leftCur === 0) {
      leftCur = 1;
    }

    leftCur = leftCur * nums[i];
    leftMax = Math.max(leftCur, leftMax);
    
  }

  for (let i = nums.length - 1; i >= 0; i--) {
    if (rightCur === 0) {
      rightCur = 1;
    }

    rightCur = rightCur * nums[i];
    rightMax = Math.max(rightCur, rightMax);
    
  }

  return Math.max(leftMax, rightMax);
};
```

## [1567. Maximum Length of Subarray With Positive Product](https://leetcode.com/problems/maximum-length-of-subarray-with-positive-product/description/?envType=study-plan&id=dynamic-programming-i)

这道题我很喜欢，虽然我想不到状态转移方程，尤其是想不到负数product长度也可以影响到正数的product最长长度。非常巧妙，我很喜欢。

```ts
function getMaxLen(nums: number[]): number {
  var n = nums.length;

  // 默认是0，没产生positive product
  // pos 定义 以i为结尾的子数组最长正数product长度
  var pos = new Array(n).fill(0);
  // neg 定义 以i为结尾的子数组最长负数product长度
  var neg = new Array(n).fill(0);
  var res = 0;

  // 初始化
  if (nums[0] > 0) {
    pos[0] = 1;
    res = 1;
  } else if (nums[0] < 0) {
    neg[0] = 1;
  }

  for (let i = 1; i < n; i++) {
    if (nums[i] > 0) { // 遇到正数
      // 以i - 1为结尾的正数Product 子数组长度+1
      pos[i] = pos[i - 1] + 1;
      
      // 如果以i - 1为结尾存在负数的Product，在原有基础上+1 否则以i结尾不存在子数组有负数product
      neg[i] = neg[i - 1] > 0 ? neg[i - 1] + 1 : 0;
    } else if (nums[i] < 0) { // 遇到负数
      // * 如果存在以i - 1为结尾的负数product，在他的基础上+1，否则不存在正数的product，返回0
      pos[i] = neg[i - 1] > 0 ? neg[i - 1] + 1 : 0;

      // * 如果存在以i - 1为结尾的整数product，在它的基础上+1，否则以i结尾仅有长度为1的负数product
      neg[i] = pos[i - 1] > 0 ? pos[i - 1] + 1 : 1;
    }

    res = Math.max(res, pos[i]);
  }

  return res;
}
```

## Reference

### 53
[DP solution & some thoughts](https://leetcode.com/problems/maximum-subarray/solutions/20193/dp-solution-some-thoughts/)

### 918

[One Pass](https://leetcode.com/problems/maximum-sum-circular-subarray/solutions/178422/one-pass/?envType=study-plan&id=dynamic-programming-i&orderBy=most_votes)


### 152

inspiration: 
[java-c-python-it-can-be-more-simple](https://leetcode.com/problems/maximum-product-subarray/solutions/183483/java-c-python-it-can-be-more-simple/?envType=study-plan&id=dynamic-programming-i&orderBy=most_votes)

code from :
[C++ || Kadane's Algo || Full Explanation](https://leetcode.com/problems/maximum-product-subarray/solutions/3321410/c-kadane-s-algo-full-explanation/?envType=study-plan&id=dynamic-programming-i)


### 1567

[[Python3/Go/Java] Dynamic Programming O(N) time O(1) space](https://leetcode.com/problems/maximum-length-of-subarray-with-positive-product/solutions/819329/python3-go-java-dynamic-programming-o-n-time-o-1-space/?envType=study-plan&id=dynamic-programming-i&orderBy=most_votes)
