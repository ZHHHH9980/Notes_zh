# 前缀和数组

## 计算范围和
[303. Range Sum Query - Immutable](https://leetcode.com/problems/range-sum-query-immutable/)


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58cb631dd99d4f1a8f69140b0d98af56~tplv-k3u1fbpfcp-watermark.image?)


### O(n)解法

这种解法其实有点呆，因为数组是不可变的。

``` java
class NumArray {
    private int[] nums;

    public NumArray(int[] nums) {
        this.nums = nums;    
    }
    
    public int sumRange(int left, int right) {
        int sum = 0;
        for (int i = left; i <= right; i++) {
            sum += nums[i];
        }
        return sum;
    }
}

```

### O(1)解法

核心思路是我们 new 一个新的数组 `preSum` 出来，`preSum[i]` 记录 `nums[0..i-1]` 的累加和。

![image.jpeg](https://labuladong.github.io/algo/images/%e5%b7%ae%e5%88%86%e6%95%b0%e7%bb%84/1.jpeg)

如果计算nums[left...right]的累加和，直接用preSum[right + 1] - preSum[left]即可。

```java
class NumArray {
    private int[] preSum;

    public NumArray(int[] nums) {
        preSum = new int[nums.length + 1];

        // 注意这里的数组取值范围 需要右移一位
        for(int i = 1; i <= nums.length; i++) {
            preSum[i] = preSum[i - 1] + nums[i - 1];
        }    
    }
    
    public int sumRange(int left, int right) {
        return preSum[right + 1] - preSum[left];
    }
}

```