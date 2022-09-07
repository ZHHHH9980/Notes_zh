# bag



## 0-1背包问题

描述：

给你一个可装载重量为 `W` 的背包和 `N` 个物品，每个物品有重量和价值两个属性。其中第 `i` 个物品的重量为 `wt[i]`，价值为 `val[i]`，现在让你用这个背包装物品，最多能装的价值是多少？

[![img](https://labuladong.github.io/algo/images/knapsack/1.png)](https://labuladong.github.io/algo/images/knapsack/1.png)

举个简单的例子，输入如下：

```
N = 3, W = 4
wt = [2, 1, 3]
val = [4, 2, 3]

```

算法返回 6，选择前两件物品装进背包，总重量 3 小于 `W`，可以获得最大价值 6。

状态：

1. 可选择的物品
2. 背包的容量

T\[i]\[k] 对于前i个物品，容量为k的情况下，可装入背包的最大价值。

```js
// base case
T[0][...] = T[...][0] = 0

// 求
T[N][W]
```

### code

```js
function knapsack(W, N, wt, val) {
  var dp = [];
  for (let i = 0; i <= N; i++) {
    dp[i] = i === 0 ? new Array(W + 1).fill(0) : [0];
  }

  for (let i = 1; i <= N; i++) {
    for (let w = 1; w <= W; w++) {
      var curBagIndex = i - 1;

      if (w >= wt[curBagIndex]) {
        // 不装 or 装
        // 选择装下当前背包，或得当前背包的value，并且在（前i - 1物品 & w - wt[curBag]) 中挑选价值最大的
        dp[i][w] = Math.max(
          dp[i - 1][w],
          dp[i - 1][w - wt[curBagIndex]] + val[curBagIndex]
        );

      } else {
        // 装不下
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  return dp[N][W];

```



> dp\[i-1]\[w - wt\[i-1]] 也很好理解：你如果装了第 i 个物品，就要寻求剩余重量 w - wt[i-1] 限制下的最大价值，加上第 i 个物品的价值 val[i-1]。



## 子集背包

### [416. Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/submissions/)

```
// 草稿

// definition
T[i][w] = true -> 对于前i个物品，容量为w的情况下「存在」一种方案能恰好装满背包

// base case
T[0][...] = false 
T[...][0] = true
T[0][0] = true // -> 交界处

// state tramsform
var curBagIndex = i - 1

if (nums[curBagIndex] <= w) { // 容量足够
	dp[i][w] = dp[i - 1][w - nums[curBagIndex]] || dp[i - 1][w]
} else {
	dp[i][w] = dp[i - 1][w]
}


求：T[i][sum / 2]
```

### code

```js
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canPartition = function (nums) {
  var sum = nums.reduce((a, b) => a + b, 0);

  if (sum % 2 === 1) return false;

  var N = nums.length;
  var dp = [];

  var W = Math.floor(sum / 2);

  for (let i = 0; i <= N; i++) {
    dp[i] = [true];
  }

  for (let j = 1; j <= W; j++) {
    dp[0][j] = false;
  }

  for (let i = 1; i <= N; i++) {
    for (let w = 1; w <= W; w++) {
      var curBagIndex = i - 1;
      if (nums[curBagIndex] <= w) {
        dp[i][w] = dp[i - 1][w - nums[curBagIndex]] || dp[i - 1][w];
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  return dp[N][W];

```

### 状态压缩

当前状态只跟上一行的状态有关，压缩成一维数组

```js
var canPartition = function (nums) {
  var sum = nums.reduce((a, b) => a + b, 0);

  if (sum % 2 === 1) return false;

  var N = nums.length;
  var W = Math.floor(sum / 2);

  // base case
  var dp = new Array(W + 1).fill(false);
  dp[0] = true;

  for (let i = 1; i <= N; i++) {
    // ** 必须从后往前遍历，否则上一行的状态会被覆盖 **
    for (let w = W; w >= 1; w--) {
      var curBagIndex = i - 1;
      if (nums[curBagIndex] <= w) {
        dp[w] = dp[w - nums[curBagIndex]] || dp[w];
      }
    }
  }

  return dp[W];
}
```



### 完全背包

### 322. [Coin Change](https://leetcode.com/problems/coin-change/)

```js
// definiton:
// dp[i][a] = x
// 对于前i个硬币，凑齐a元最少需要x个硬币；
// 
// base case:
// dp[0][...] = Number.MAX_SAFT_INTEGER
// dp[...][0] = 0
// dp[0][0] = 0

// state transform: 
// if a >= coin
// dp[i][a] = min(dp[i][a - coins[a]] + 1, dp[i - 1][a])
// else 
// dp[i][a] = dp[i - 1][a]
```

```js
var coinChange = function(coins, amount) {
    var N = coins.length;
    var dp = [];
    for (let i = 0; i <= N; i++) {
        dp[i] = [0]
    };
    for (let j = 1; j <= amount; j++) {
        dp[0][j] = amount + 1;
    }
    
    for (let i = 1; i <= N; i++) { 
        for (let j = 1; j <= amount; j++) {
            if (j >= coins[i - 1]) {
                var choose = dp[i][j - coins[i - 1]];
                var nochoose = dp[i - 1][j];
                
                dp[i][j] = Math.min(choose + 1, nochoose)
                
            } else {
                dp[i][j] = dp[i - 1][j]
            }
        }
    }
    
    return dp[N][amount] === amount + 1 ? -1: dp[N][amount];
};
```



状态压缩：

```js
var coinChange = function(coins, amount) {
    var N = coins.length;
    var dp = new Array(amount + 1);
    
    dp.fill(amount + 1);
    dp[0] = 0;
    
    for (let coin of coins) {
        for (let a = 1; a <= amount; a++) {

            if (a >= coin) {
                dp[a] = Math.min(dp[a - coin] + 1, dp[a])
            }

        }
    }
    
    return dp[amount] === amount + 1 ? -1: dp[amount];
};
```

> 有些答案喜欢把for..of放入内层循环，这道题刚好能够通过，因为取的是最小值，建议按照未压缩时的嵌套来写，就不会出错。



### 518. [Coin Change 2](https://leetcode.com/problems/coin-change-2/)

```js
// definition:
// 对于前i个硬币，总数为a的情况下，可凑齐的方案为x个
// dp[i][a] = x

// base case:
// dp[...][0] = 1
// dp[0][...] = 0
// dp[0][0] = 1

// state transform: 
// if a >= coin
// dp[i][a] = dp[i][a - coin] + dp[i - 1][a] // 选这个硬币和不选这个硬币的方案相加
// else
// dp[i][a] = dp[i - 1][a]
```



为什么不是

```
dp[i][a] = dp[i - 1][a - coin] + dp[i - 1][a]
```

> 这恰恰就是01背包和完全背包的区别
> dp\[i][j] = dp\[i-coins\[j-1]][j] +dp\[i][j-1] #完全背包，可以重复使用自己
> dp\[i][j] = dp\[i-coins\[j-1]][j-1] +dp\[i][j-1] #01背包，不能重复使用

dp\[i - 1][a - coin]是dp\[i][a - coin]的子集，会漏掉重复使用自己的场景。





### code

```js

var change = function(amount, coins) {
    var dp = [];
    var N = coins.length
    
    for (let i = 0; i <= N; i++) {
        dp[i] = [1];
    }
    
    for (let j = 1; j <= amount; j++) {
        dp[0][j] = 0;
    }
    
    for (let i = 1; i <= N; i++) {
        for (let a = 1; a <= amount; a++) {
            var coin = coins[i - 1];
            
            if (a >= coin) {
                // 选和不选一共有几种凑法
                dp[i][a] = dp[i][a - coin] + dp[i - 1][a]
            } else {
                dp[i][a] = dp[i - 1][a]
            }
        }
    }
    
    return dp[N][amount]
};
```



状态压缩：

```js
var change = function(amount, coins) {
    var dp = new Array(amount + 1).fill(0);
    dp[0] = 1;
    
    for (let coin of coins) {
        for (let a = 1; a <= amount; a++) {

            if (a >= coin) {
                // 选和不选一共有几种凑法
                dp[a] = dp[a - coin] + dp[a]
            } 
        }
    }
    
    return dp[amount]
};
```

