# Stock
这篇还没看labuladong的，但是我在leetcode上看过这篇题解[Most consistent ways of dealing with the series of stock problems](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/solutions/75924/most-consistent-ways-of-dealing-with-the-series-of-stock-problems/?orderBy=most_votes)，觉得非常nice，简直是买股票杀手！

## 中文翻译

## 最一致的处理股票系列问题方法

至此，相信你已经完成了一系列股票相关问题（并没有哈哈）。

- [121. Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/#/description)
- [122. Best Time to Buy and Sell Stock II](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/#/description)
- [123. Best Time to Buy and Sell Stock III](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/#/description)
- [188. Best Time to Buy and Sell Stock IV](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/)
- [714. Best Time to Buy and Sell Stock with Transaction Fee](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/)


对于每个问题，我们都能获取到优秀的帖子告诉我们如何解决。然而，大部分帖子并没有点出这一系列问题之间的关联，并且难以形成一个套路来解决这一系列问题。这里我将介绍一个非常通用的解决方案，专门针对六个股票买卖问题。



### I--通用解决方案

抛砖引玉：如果提供一个数组代表每天的股票价格，是什么决定了我们能获取的最大收益？

我们肯定能快速想到的问题大概是“这取决于我们在哪一天，并且允许的最大交易次数”。当然，这些都是重要的因素，因为他们体现在前四个问题的要求中。但是这里有一个隐藏的因素并不是很明显但在确定最大利润的时候却很重要，下面是详细说明：

首先让我们阐明符号来简化我们的分析。让`prices`代表股票价格，一个长度为n的数组。`i`代表第`i`天（范围是0 ~ n-1），`k`代表允许最大的交易次数，`T[i][k]`代表在第`i`天，在允许最大交易`k`次的情况下能获取的最大收益。显然base case就是`T[-1][k] = T[i][0] = 0`， 这代表，没有股票或者没有交易次数即没有收益（注意第一天是`i = 0`因此`i = -1`代表没有股票）。现在如果我们能够以某种方式将`T[i][k]`和它的子问题们关联起来如`T[i - 1][k]`，`T[i][k - 1]`，`T[i - 1][k - 1]`，我们将有一个有效的递归关系，那么该如何实现？

最直接的方式是查看第`i`天的行动，我们有多少选择？答案是三个：**买入，抛出，不动**。我们应该选哪个？答案是：不知道，但是去找出是哪一个很简单。我们能够尝试每个选择，然后选择那个最能满足最大收益的，如果没有其他限制的话。但是，我们确实是有一个限制，就是不允许同时进行多次交易，这意味着如果我们决定在第`i`天购买，则应该有`0`份股票在我们的手里；如果我们决定在第`i`天卖出去，那么必须有`1`份股票在我们手里。我们手里的股票数量就是之前提到会影响最大收益的隐藏因素。

因此我们对`T[i][k]`的定义应该被分为两种：`T[i][k][0]`和`T[i][k][1]`，前者表示在第`i`天，允许交易`k`次的情况下手里有`0`份股票，后者代表在第`i`天，允许交易`k`次的情况下手里有`1`份股票，现在我们的base case 以及递归关系可以这样表示：

1. Base cases:
```
T[-1][k][0] = 0, T[-1][k][1] = -Infinity
T[i][0][0] = 0, T[i][0][1] = -Infinity
```

2. Recurrence relation:
```
T[i][k][0] = max(T[i - 1][k][0], T[i - 1][k][1] + prices[i]) // max(休息，抛出)
T[i][k][1] = max(T[i - 1][k][1], T[i - 1][k - 1][0] - prices[i]) // max(休息，购入)
```

对于base cases,`T[-1][k][0] = T[i][0][0] = 0`之前已经提过，`T[-1][k][1] = T[i][0][1] = -Iinfinity`强调一个事实是我们不可能在不允许交易和买不到股票的情况下拥有股票。

对于`T[i][k][0]`在递归关系中，在第`i`天只可以不动和抛出，因为我们在结束那天只有0份股票。`T[i - 1][k][0]`代表着不动的最大收益，`T[i - 1][k][1] + prices[i]`代表着如果抛出的最大收益。注意允许交易的次数`k`仍然不变，因为只有买入和抛出这一对事件发生以后才算一次交易，那么买入这件事上就消耗了一次交易次数。

对于`T[i][k][1]`在递归关系中，在第`i`天只可以不动和购买，因为在第`i`天手里有1份股票。`T[i - 1][k][1]`代表着不动的最大收益，`T[i - 1][k - 1][0] - prices[i]`代表着前一天购买的最大收益，注意这种情况下发生了购买，因此交易数要-1。

为了找到最后一天的最大收益，我们只需要简单地循环`prices`这个数组并且更新`T[i][k][0]`和`T[i][k][1]`根据上述的递归关系。最后的答案就是`T[i][k][0]`，卖出去总是有收益的。

### II-实际应用

前面提到的六个股票问题都是按照`k`的值来分类的，`k`是允许交易的最大次数（后两种还有额外的要求，比如“cooldown”或者“transaction fee”）。我将把通用解决方案一一应用到它们中的每一个。

#### Case I: `k = 1`

对于这种情况，在每天我们只有两个不知道的变量：`T[i][1][0]`和`T[i][1][1]`，以及递归关系如下：
```
T[i][1][0] = max(T[i - 1][1][0], T[i - 1][1][1] + prices[i])
T[i][1][1] = max(T[i - 1][1][1], T[i - 1][0][0] - prices[i]) = max(T[i - 1][1][1], -prices[i])
```
对于第二个递归关系，T[i - 1][0][0]是base case之一，没有交易次数，无法购买股票。

可以直接写出一个O(n)空间和时间复杂度的算法，基于上述两个等式。

其实不难看出`T[i][1][0]`以及`T[i][1][1]`只跟T[i - 1][1][0]`和`T[i - 1][1][1]`有关系，那么根本不需要申请三维数组空间，只需两个指针记录一下前两个状态即可。

```js
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    // T[i][1][0] = max(T[i - 1][1][0], T[i - 1][1][1] + prices[i]
    // T[i][1][1] = max(T[i - 1][1][1], -prices[i])

    var T_i_1_0 = 0;
    var T_i_1_1 = Number.MIN_SAFE_INTEGER;

    for (let i = 0; i < prices.length; i++) {
        T_i_1_0 = Math.max(T_i_1_0, T_i_1_1 + prices[i]);
        T_i_1_1 = Math.max(T_i_1_1, -prices[i]);
    }

    return T_i_1_0;
};
```


#### case II: k = +Infinity
[122. Best Time to Buy and Sell Stock II](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/#/description)

如果`k`是正无穷，那么`k`与`k-1`将没有什么区别，那么暗示了一个点：
```
T[i][k][0] = max(T[i - 1][k][0], T[i - 1][k][1] + prices[i]) 
T[i][k][1] = max(T[i - 1][k][1], T[i - 1][k][0] - prices[i]) 
```

```js
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    var T_ik0 = 0;
    var T_ik1 = Number.MIN_SAFE_INTEGER;

    for (let price of prices) {
        var old_T_ik0 = T_ik0;
        T_ik0 = Math.max(T_ik0, T_ik1 + price);
        T_ik1 = Math.max(T_ik1, old_T_ik0 - price);
    }

    return T_ik0;
};
```

#### case III: k = 2

[123. Best Time to Buy and Sell Stock III](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/#/description)

##### 常规解法：dp table

```java
public int maxProfit(int[] prices) {
    int max_k = 2, n = prices.length;
    int[][][] dp = new int[n][max_k + 1][2];

    for (int i = 0; i < n; i++) {
        for (int k = max_k; k >= 1; k--) {
            if (i - 1 == -1) {
                // 处理 base case
                dp[i][k][0] = 0;
                dp[i][k][1] = -prices[i];
                continue;
            }

            if (k == 0) {
                // base case
                dp[i][k][0] = 0;
                dp[i][k][1] = -Interger.MIN_VALUE;
                continue;
            }

            dp[i][k][0] = Math.max(dp[i-1][k][0], dp[i-1][k][1] + prices[i]);
            dp[i][k][1] = Math.max(dp[i-1][k][1], dp[i-1][k-1][0] - prices[i]);
        }
    }
    
    // 穷举了 n × max_k × 2 个状态，正确。
    return dp[n - 1][max_k][0];
}
```

##### 穷举所有状态转移方程

与`k=1`的情况相似，目前每一天的状态有以下几种`T[i][1][0]` `T[i][1][1]` `T[i][2][1]` `T[i][2][0]`，对应的递归关系如下：
```
T[i][2][0] = max(T[i - 1][2][0], T[i - 1][2][1] + price[i])
T[i][2][1] = max(T[i - 1][2][1], T[i - 1][1][1] - price[i])
T[i][1][0] = max(T[i - 1][1][0], T[i - 1][1][1] + price[i])
T[i][1][1] = max(T[i - 1][1][1], T[i - 1][0][1] - price[i]) = max(T[i - 1][1][1], -price[i])
```

```js
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    var T_i20 = 0;
    var T_i21 = Number.MIN_SAFE_INTEGER;
    var T_i10 = 0;
    var T_i11 = Number.MIN_SAFE_INTEGER;

    for (let price of prices) {
        T_i20 = Math.max(T_i20, T_i21 + price); 
        T_i21 = Math.max(T_i21, T_i10 - price);
        T_i10 = Math.max(T_i10, T_i11 + price);
        T_i11 = Math.max(T_i11, -price);
    }

    return T_i20;
};
```

#### 找零钱问题思考

突然想到这个问题是因为这里的coin的数量可以是无限的，以为也需要用类似caseII的情况来分析，即`k = +Infinity`，但其实并不是类似问题，因`coin`的数量并不是状态，而是这道题最终需要求的最值！

[coin change](https://leetcode.com/problems/coin-change/submissions/901618434/)

#### caseIV: k = +arbitary

这种情况就比较复杂了，如果光用caseIII的dp table来解决，那么总共要穷举n × max_k × 2个状态，如果max_k是无穷大，那么空间消耗也是无穷大，就解不了这个问题。但是这题有一个边界条件，就是n / 2，如果k > n / 2，那么k与k = +Infinity情况相同，因为一天买一天卖，最多允许交易的次数 = 总天数 / 2。

```java
class Solution {
    public int maxProfit(int k, int[] prices) {
        int n = prices.length;

        // k = infinity
        // T[i][k][0] = Math.max(T[i - 1][k][0], T[i - 1][k][1] + prices[i])
        // T[i][k][1] = Math.max(T[i - 1][k][1], T[i - 1][k - 1][0] - prices[i])

        if (k > n / 2) {
            int T_ik0 = 0;
            int T_ik1 = Integer.MIN_VALUE;

            for (int price: prices) {
                T_ik0 = Math.max(T_ik0, T_ik1 + price);
                T_ik1 = Math.max(T_ik1, -price);
            }

            return T_ik0;
        }

        int[][][] dp = new int[n][k + 1][2];

        for (int i = 0; i < prices.length; i++) {
            for (int j = k; j >= 0; j--) {
                // base case
                if (i - 1 == -1) {
                    dp[i][j][0] = 0;
                    dp[i][j][1] = -prices[i];
                    continue;
                }

                // base case
                if (j == 0) {
                    dp[i][j][0] = 0;
                    dp[i][j][1] = Integer.MIN_VALUE;
                    continue;
                }

                dp[i][j][0] = Math.max(dp[i - 1][j][0], dp[i - 1][j][1] + prices[i]);
                dp[i][j][1] = Math.max(dp[i - 1][j][1], dp[i - 1][j - 1][0] - prices[i]);
            }
        }

        return dp[n - 1][k][0];
    }
}
```
两个base case持有股票数=1给的值是不一样的，这里是我的思考：
1. i - 1 = -1的情况说明这是股票交易的第一天，也就是可以取到i = 0的情况（这一天已经可以买股票了），如果不买就=0，卖就得亏prices[i]元
    对于1这种情况我一开始给的是Integer.MIN_VALUE，是有问题的，这里之所以是base case，是因为无法从前一天做推导。
2. j == 0 这种情况不一样，这种情况的意思是，允许最大交易次数为0的情况下，不应该持有任何股票！！所以是dp[i][j][1] = Integer.MIN_VALUE;


#### caseV: cooldown

由于卖出后一天不能再买，得等一天，状态转移方程：
```
T[i][k][0] = max(T[i - 1][k][0], T[i - 1][k][1] + prices[i]) 
T[i][k][1] = max(T[i - 1][k][1], T[i - 2][k][0] - prices[i]) // 区别在这里
```


```java
class Solution {
    public int maxProfit(int[] prices) {
        // rest, sell
        // T[i][k][0] = max(T[i - 1][k][0], T[i - 1][k][1] + price)
        // rest, buy
        // T[i][k][1] = max(T[i - 1][k][1], T[i - 2][k][0] - price)
        // i = 0, 1时， i - 1 和 i - 2都是不合法的索引，所以需要特化处理

        int n = prices.length;
        int[][] dp = new int[n][2];

        for (int i = 0; i < n; i++) {
            if (i - 1 == -1) {
                dp[i][0] = 0;
                dp[i][1] = -prices[i];
                continue;
            }

            // 前两天都是base case 
            if (i - 2 == -1) {
                dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1] + prices[i]);
                // dp[i][1] = Math.max(dp[i - 1][1], dp[-1][0] - prices[i]);
                // dp[i][1] = Math.max(dp[i - 1][1], 0 - prices[i]);
                dp[i][1] = Math.max(dp[i - 1][1], -prices[i]);
                continue;
            }

            dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1] + prices[i]);
            dp[i][1] = Math.max(dp[i - 1][1], dp[i - 2][0] - prices[i]);
        }

        return dp[n - 1][0];
    }
}
```

##### 状态压缩

本质上今天的状态只跟`i - 1`和`i - 2`有关系。

```java

public int maxProfit(int[] prices) {
    // rest, sell
    // T[i][k][0] = max(T[i - 1][k][0], T[i - 1][k][1] + price)
    // rest, buy
    // T[i][k][1] = max(T[i - 1][k][1], T[i - 2][k][0] - price)

    int preT_ik0 = 0, T_ik0 = 0, T_ik1 = Integer.MIN_VALUE;

    for (int price: prices) {
        int old_Tik0 = T_ik0;
        T_ik0 = Math.max(T_ik0, T_ik1 + price);
        T_ik1 = Math.max(T_ik1, preT_ik0 - price);
        preT_ik0 = old_Tik0;
    }

    return T_ik0;
}
```

#### caseVI: k = +Infinity, with transaction fee

```
 // rest or sell
 T[i][k][0] = max(T[i - 1][k][0], T[i - 1][k][1] + price)
 // rest or buy
 T[i][k][1] = max(T[i - 1][k][1], T[i - 1][k - 1][0] - price - fee)
            = max(T[i - 1][k][1], T[i - 1][k][0] - price - fee)

 // k = Infinity，已经不需要考虑k 这个状态了 
 T[i][0] = max(T[i - 1][0], T[i - 1][1] + price)
 T[i][1] = max(T[i - 1][1], T[i - 1][0] - price - fee)
```

这个状态转移方程是有问题的，实际上是卖的时候才收手续费，而不是买，我是看example才醒悟过来：
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b841dc53f08404cac1f019d68db294e~tplv-k3u1fbpfcp-watermark.image?)

代码里已经更正：

```java
class Solution {
    public int maxProfit(int[] prices, int fee) {
        // rest or sell
        // T[i][k][0] = max(T[i - 1][k][0], T[i - 1][k][1] + price)
        // rest or buy
        // T[i][k][1] = max(T[i - 1][k][1], T[i - 1][k][0] - price - fee)

        int n = prices.length;
        int[][] dp = new int[n][2];

        for (int i = 0; i < n; i++) {
            if (i - 1 == -1) {
                dp[i][0] = 0;
                dp[i][1] = -prices[i];
                continue;
            }

            dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1] + prices[i] - fee);
            dp[i][1] = Math.max(dp[i - 1][1], dp[i - 1][0] - prices[i]);
        }
    
        return dp[n - 1][0];
    }
}
```

##### 状态压缩


不要再用int类型，避免整形溢出。

```
class Solution {
    public int maxProfit(int[] prices, int fee) {
        // rest or sell
        // T[i][k][0] = max(T[i - 1][k][0], T[i - 1][k][1] + price - fee)
        // rest or buy
        // T[i][k][1] = max(T[i - 1][k][1], T[i - 1][k][0] - price)

        long T_ik0 = 0, T_ik1 = Integer.MIN_VALUE;

        for (int price: prices) {
            long old_Tik0 = T_ik0;

            T_ik0 = Math.max(T_ik0, T_ik1 + price - fee);
            T_ik1 = Math.max(T_ik1, old_Tik0 - price);
        }

        return (int)T_ik0;
    }
}
```