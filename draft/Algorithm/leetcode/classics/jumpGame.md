# jumpGame

## [55. Jump Game](https://leetcode.com/problems/jump-game/description/)

### DP solution

```
dp[i] = true 表示对于index = i, 能够调到i的位置。

base case:
dp[0] = true

j 的范围为 [0...i - 1]

if (dp[j] && nums[j] + j >= i) {
    dp[i] = true;
}

dp[j] 表示能到达j的位置，nums[j] + j >= i 表示从j位置出发能到达i这个位置。
```

```js
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function(nums) {
    var n = nums.length;
    var dp = new Array(n).fill(false);
    dp[0] = true;
    

    for(let i = 1; i < n; i++) {
        for (let j = i - 1; j >= 0; j--) {
            if (dp[j] && nums[j] + j >= i) {
                dp[i] = true;
                break;
            }
        }
    }

    return dp[n - 1];
};
```

### greedy

贪心的思路是每走一步都更新一下全局的最优解，尽可能“走更多步数”来到达最后一个位置。

## 参考

[C++ Solutions - Greedy | Recursive | DP](https://leetcode.com/problems/jump-game/solutions/1150021/c-solutions-greedy-recursive-dp/?orderBy=most_votes)
