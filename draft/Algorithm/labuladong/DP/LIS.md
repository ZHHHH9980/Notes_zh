# LIS

## [300. Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/submissions/934670282/)

dp[i] 表示以nums[i]为结尾的最长子序列长度

```ts
function lengthOfLIS(nums: number[]): number {
    var len = nums.length;
    var dp = new Array(len).fill(1);
    var max = 1;

    for (let i = 1; i < nums.length; i++) {
        var res = 0;

        // 往回找，挨个找到 「比nums[i]小的元素」 && 「更长的序列」
        for (let j = i; j >= 0; j--) {
            if (nums[i] > nums[j]) {
                res = Math.max(res, dp[j]);
            }
        }
        dp[i] = res + 1;
        max = Math.max(dp[i], max);
    }

    return max;
};
```

时间复杂度: O(n^2)

## [32. Longest Valid Parentheses](https://leetcode.com/problems/longest-valid-parentheses/)

dp[i] 代表 从s[0...i]具有多少个有效的括号。

```
if (s[i] == ')' && '('.length > 0) {
    // (() )
    //     ^ i

    dp[i] = dp[i - 1] + 2;

    // ( )( ( ) )
    //   ^      ^ i
    //   i - dp[i]
        
    if (i - dp[i] > 0) {
        dp[i] += dp[i - dp[i]];
    }
}
```

加上上一个的")"的存储和以前的，有点难想到说实话。

```ts
// ...()
// ...))
function longestValidParentheses(s: string): number {
    var max = 0;
    var open = 0;
    var dp = new Array(s.length).fill(0);

    for (let i = 0; i < s.length; i++) {
        if (s[i] === '(') {
            open++;
        }

        if (s[i] === ')' && open > 0) {
            dp[i] = dp[i - 1] + 2;

            // add previous
            if (i - dp[i] > 0) {
                dp[i] += dp[i - dp[i]];
            }
            open--;
        }
        max = Math.max(max, dp[i]);
    }

    return max;
};
```

## 参考

[My O(n) solution using a stack](https://leetcode.com/problems/longest-valid-parentheses/solutions/14126/my-o-n-solution-using-a-stack/?show=1&orderBy=most_votes)

https://leetcode.com/problems/longest-valid-parentheses/solutions/1139990/longest-valid-parentheses-short-easy-w-explanation-using-stack/?show=1&orderBy=most_votes