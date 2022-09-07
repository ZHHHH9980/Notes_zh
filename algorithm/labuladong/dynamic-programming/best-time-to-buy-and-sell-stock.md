# best-time-to-buy-and-sell-stock

系列问题：

1. [121. Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/#/description)
2. [122. Best Time to Buy and Sell Stock II](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/#/description)
3. [123. Best Time to Buy and Sell Stock III](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/#/description)
4. [188. Best Time to Buy and Sell Stock IV](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/#/description)
5. [309. Best Time to Buy and Sell Stock with Cooldown](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/#/description)
6. [714. Best Time to Buy and Sell Stock with Transaction Fee](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/description/)



n denote the length of `stock price array`

i denote the i-th day (i range in [0, n - 1])

`k` denote the maximum number of transactions allowed to complete（代表能完成几次交易）

so we get the base case:

```
T[-1][k] = T[i][0] = 0
// -1 day means no stock
// 0 transaction 
```



The most straightforward way would be looking at actions taken on the `i-th` day. How many options do we have? The answer is three: **buy**, **sell**, **rest**. 

在每一天我们有三种选择，买，卖，休息。



 However, we do have an extra restriction saying no multiple transactions are allowed at the same time, meaning if we decide to **buy** on the `i-th` day, there should be `0` stock held in our hand before we buy; if we decide to **sell** on the `i-th` day, there should be exactly `1` stock held in our hand before we sell.

然而，我们不能同时进行多笔交易，意味着如果我们决定买今天的股票，那么手上的股票为0，如果决定卖今天的股票，那么手上的股票必须为1；



Therefore our definition of `T[i][k]` should really be split into two: `T[i][k][0]` and `T[i][k][1]`, where the **former** denotes the maximum profit at the end of the `i-th` day with at most `k` transactions and with `0` stock in our hand AFTER taking the action, while the **latter** denotes the maximum profit at the end of the `i-th` day with at most `k` transactions and with `1` stock in our hand AFTER taking the action. 

因此我们对T\[i][k]的定义分两种，`T[i][k][0]` and `T[i][k][1]` 前者代表在i-th 这天，**完成**k次交易的限制下，手里头没有股票的最大收益。后者代表在代表在i-th 这天，**完成**k次交易的限制下，手里头有一只股票的最大收益。



结合上述，可以得到以下推导：

1. base case

```
T[-1][k][0] = 0
T[i][0][0] = 0

T[-1][k][1] = -Infinity
T[i][0][1] = -Infinity
```

在i = -1,k = 0的情况下，拥有0支股票的价值为0；



while `T[-1][k][1] = T[i][0][1] = -Infinity` emphasizes the fact that it is impossible for us to have `1` stock in hand if there is no stock available or no transactions are allowed.

我们用-Infinity强调一个事实，在i = -1，k = 0的情况下，不可能拥有一只股票。



2. 状态转移方程

```
// rest or sell
T[i][k][0] = max(T[i - 1][k][0], T[i - 1][k][1] + price[i])

// rest or buy
T[i][k][1] = max(T[i - 1][k][1], T[i - 1][k - 1][0] - price[i])
// 如果选择买股票，那么完成的交易数k+1
```



> 这里着重提醒一下，**时刻牢记「状态」的定义**，状态 `k` 的定义并不是「已进行的交易次数」，而是「最大交易次数的上限限制」。如果确定今天进行一次交易，**且要保证截至今天最大交易次数上限为 `k`，那么昨天的最大交易次数上限必须是 `k - 1`**。



### case I: k = 1

1. base case 

```js
T[-1][k][0] = 0
T[i][0][0] = 0

T[-1][k][1] = -Infinity
T[i][0][1] = -Infinity
```

2. 状态转移方程

```
T[i][1][0] = max(T[i - 1][1][0], T[i - 1][1][1] + price[i])
T[i][1][1] = max(T[i - 1][1][1], T[i - 1][0][0] - price[i])
					 = max(T[i - 1][1][1], 0 - price[i])
```

由于k都是1，所以对最终状态无影响，简化状态转移方程：

```
T[i][0] = max(T[i - 1][0], T[i - 1][1] + price[i])
T[i][1] = max(T[i - 1][1], - price[i])
```



### code

```js
var maxProfit = function(prices) {
    var n = prices.length;
    var dp = new Array();
    for (let i = 0; i < n; i++) {
        dp[i] = [];
    }
    
    for (let i = 0; i < n; i++) {
        // 对-1进行特殊化处理
        if (i - 1 === -1) {
            // dp[i][0] = Math.max(dp[-1][0], dp[-1][1] + prices[i])
            // dp[i][0] = Math.max(0, -Infinity + prices[i])
            dp[i][0] = 0;
            
            // dp[i][1] = Math.max(dp[-1][1], -prices[i])
            // dp[i][1] = Math.max(-Infinity, -prices[i])
            dp[i][1] = -prices[i]
            continue;
        }
        
        dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1] + prices[i])
        dp[i][1] = Math.max(dp[i - 1][1], -prices[i])
    }
    
    return dp[n - 1][0]
};
```

状态压缩，可以避免特殊化处理：

```js
var maxProfit = function(prices) {
    var n = prices.length;
  	// k = 1
    dp_i_1_0 = 0;
    dp_i_1_1 = -Infinity;
    
    for (let i = 0; i < n; i++) {
    
        dp_i_1_0 = Math.max(dp_i_1_0, dp_i_1_1 + prices[i])
        dp_i_1_1 = Math.max(dp_i_1_1, -prices[i])
    }
    
    return dp_i_1_0
};
```



### case II: k = +Infinity

```js
T[i][k][0] = max(T[i - 1][k][0], T[i - 1][k][1] + prices[i])

// k is +infinity, so [k - 1 & k] is no difference 
T[i][k][1] = max(T[i - 1][k][1], T[i - 1][k - 1][0] - prices[i])
					 = max(T[i - 1][k][1], T[i - 1][k][0] - prices[i])
```

base case:

```
T[0][k][0] = 0
T[0][k][1] = -Infinity
```



### code

```js
var maxProfit = function(prices) {
    var dp_i_k_0 = 0,
        dp_i_k_1 = -Infinity;
    
    for (let i = 0; i < prices.length; i++) {
        var pre_i_k_0 = dp_i_k_0;
        
        dp_i_k_0 = Math.max(dp_i_k_0, dp_i_k_1 + prices[i]);
        dp_i_k_1 = Math.max(dp_i_k_1, pre_i_k_0 - prices[i])
    }
    
    return dp_i_k_0
};
```



 ## case III: k = 2

注意：只能同时拥有一支股票

```js
// rest or sell
T[i][1][0] = max(T[i - 1][1][0], T[i - 1][1][1] + prices[i])
// rest or buy (T[i - 1][0][0] = 0)
T[i][1][1] = max(T[i - 1][1][1], T[i - 1][0][0] - prices[i])
					 = max(T[i - 1][1][1], - prices[i])

// rest or buy
T[i][2][1] = max(T[i - 1][2][1], T[i - 1][1][0] - prices[i])
// rest or sell
T[i][2][0] = max(T[i - 1][2][0], T[i - 1][2][1] + prices[i])
```



### code

```js
var maxProfit = function(prices) {
    var T_i_1_0 = 0,
        T_i_2_0 = 0,
        T_i_1_1 = -Infinity,
        T_i_2_1 = -Infinity;
    
    for (let i = 0; i < prices.length; i++) {
        T_i_2_0 = Math.max(T_i_2_0, T_i_2_1 + prices[i])
        T_i_2_1 = Math.max(T_i_2_1, T_i_1_0 - prices[i])
        T_i_1_0 = Math.max(T_i_1_0, T_i_1_1 + prices[i]);
        T_i_1_1 = Math.max(T_i_1_1, -prices[i])  
    }
    
    return T_i_2_0
};
```



## case IV: k = +Infinity with cooldown 

```js
// [buy, sell, cooldown, buy, sell]

// rest or buy
T[i][k][1] = max(T[i - 1][k][1], T[i - 2][k - 1][0] - prices[i])
					 = max(T[i - 1][k][1], T[i - 2][k][0] - prices[i])
// 因为购买有冷冻期，所以取前两天的状态，保证状态准确转移

// rest or sell（sell是没有限制的，buy才有）
T[i][k][0] = max(T[i - 1][k][0], T[i - 1][k][1] + prices[i])
```





### reference

https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/discuss/108870/Most-consistent-ways-of-dealing-with-the-series-of-stock-problems