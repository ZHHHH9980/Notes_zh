# house-robber

- [198. House Robber](https://leetcode.com/problems/house-robber/)
- [213. House Robber II](https://leetcode.com/problems/house-robber-ii/)
- [337. House Robber III](https://leetcode.com/problems/house-robber-iii/)

## 198. House Robber
第一题还挺简单的，如果做完了`stock`相关的题目，第一题就跟`buy and sell with cooldown`类似，有一天的冷冻期。

### 状态转移方程
```
// 今天的最优解 = max(不动，抢劫)
T[i] = max(T[i - 1], T[i - 2] + money)
```

### code

```java
class Solution {

    public int rob(int[] nums) {
        // T[i] = max(T[i - 1], T[i - 2] + money);

        int dp_i1 = 0, dp_i2 = 0;
        for (int money: nums) {
            int olddp_i1 = dp_i1;
            dp_i1 = Math.max(dp_i1, dp_i2 + money);
            dp_i2 = olddp_i1;
        }

        return dp_i1;
    }
}
```


过几天自己用递归写了一版，好几次都没通过，一个是memo，一个是memo存在的判断
```
if (memo[n]) {
    return memo[n];
}
```

本来这行代码没啥，但是如果test case是这种场景，那就一直进不去memo里边...

```
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
```

```ts
// do(n) 代表从0 - n号房抢劫的最大收益
function doRob(n: number, nums: number[], memo = {}) {
    if (n < 0) {
        return 0;
    }

    // if (memo[n]) 
    if (memo[n] !== undefined) {
        return memo[n];
    }

    const rob = doRob(n - 2, nums, memo) + nums[n];
    const noRob = doRob(n - 1, nums, memo);

    memo[n] = Math.max(rob, noRob);

    return memo[n];
}

function rob(nums: number[]): number {
    var n = nums.length;

    return doRob(n - 1, nums);
};
```


## 213. House Robber II

到这道题就开始自闭了，环形数组，压根不知道该怎么找状态方程。

首先首尾不能拿同时被抢，那么会有三种情况：
![image.png](https://s2.loli.net/2023/02/26/LpQs5IlGyo92Sca.png)

实际上只需要考虑情况二和情况三，抢钱都是正数，要保证收益最大化。

那么要改一下之前的写法，加入范围。

```java
class Solution {
    public int rob(int[] nums) {
        int n = nums.length;
        if (n == 1) {
            return nums[0];
        }

        return Math.max(
            robRange(nums, 0, n - 2),
            robRange(nums, 1, n - 1)
        );
    }

    public int robRange(int[] nums, int start, int end) {
        // T[i] = max(T[i - 1], T[i - 2] + money);

        int dp_i1 = 0, dp_i2 = 0;
        for (int i = end; i >= start; i--) {
            int olddp_i1 = dp_i1;
            dp_i1 = Math.max(dp_i1, dp_i2 + nums[i]);
            dp_i2 = olddp_i1;
        }

        return dp_i1;
    }
}
```

`robRange`这种状态压缩的写法是基于
```
 T[i] = max(T[i - 1], T[i - 2] + money);
```

这个状态方程，可见当前状态只跟前两个状态相关，这就是妥妥的斐波那契数列，不用想太复杂。

因此还有一个边界条件，也就是在长度为1的情况下，斐波那契的推导意义就不大了，至少需要两个状态来做推导。

```
if (n == 1) {
    return nums[0];
}
```

### [House Robber III](https://leetcode.com/problems/house-robber-iii/)

dp函数的定义是，传入当前根节点，返回一个二元组，第一个值返回抢根节点的最大值，第二只返回不抢根节点的最大值。

```js
/**
 * @param {TreeNode} root
 * @return {number, number}[]
 */
 // [rob, no_rob] 抢/不抢当前根节点的最大值

var dp = function(root) {
    if (root == null) {
        return [0, 0];
    }

    var left = dp(root.left);
    var right = dp(root.right);

    var rob = root.val + left[1] + right[1];

    // 抢不抢子节点看情况
    var no_rob = Math.max(left[0], left[1]) + Math.max(right[0], right[1]);

    return [rob, no_rob];
}

/**
 * @param {TreeNode} root
 * @return {number}
 */
var rob = function(root) {
    var [rob, no_rob] = dp(root);

    return Math.max(rob, no_rob);
};

```