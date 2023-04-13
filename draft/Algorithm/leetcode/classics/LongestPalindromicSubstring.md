# [5. Longest Palindromic Substringlabuladong](https://leetcode.com/problems/longest-palindromic-substring/description/)

## DP 解法

dp[i][j]代表从String s[i...j]是否为回文串。
```
字符串长度 =  j - i + 1

if (j - i + 1 < 4) 
a ab aba
在字符串长度 < 4的情况下，如果s.charAt(i) == s.charAt(j)，那么这就是一个回文串

if (j - i + 1 >= 4)
字符串长度 >= 4 的情况下，如果s.charAt(i) == s.charAt(j)，那么还需要根据dp[i + 1][j - 1]的结果来推导是不是回文串。
```

```js
class Solution {
    public String longestPalindrome(String s) {
        int n = s.length();
        String res = "";

        boolean[][] dp = new boolean[n][n];

        for (int i = n - 1; i >= 0; i--) {
            for (int j = i; j < n; j++) {
                dp[i][j] = s.charAt(i) == s.charAt(j) && (j - i < 3 || dp[i + 1][j - 1]);

                if (dp[i][j] && res.length() < j - i + 1) {
                    res = s.substring(i, j + 1);
                }
            }
        }
        return res;
    }
}
```

## 双指针

### 判断一个字符串是否为回文串

```js
var isPalindrome = function(s) {
    let left = 0,
        right = s.length - 1;
    
    while(left < right) {
        if (s.chatAt(left) !== s.chatAt(right)) {
            return false;
        }

        left++;
        right--;
    }

    return true;
}
```

这里是经典的双指针相遇，但是最长回文串的话还得是中心向两边扩散的方式。

### 最长回文字符串

```js
/**
 * @param {string} s
 * @return {string}
 */
 function palindrome(s, left, right) {
    var len = s.length;

    while(left >= 0 && right < len && s[left] === s[right]) {
        left--;
        right++;
    }

    return s.substring(left + 1, right);
}

 function longestPalindrome(s) {
    var res = '';

    for (let i = 0; i < s.length; i++) {
        let s1 = palindrome(s, i, i);
        let s2 = palindrome(s, i, i + 1);

        res = s1.length > res.length ? s1: res;
        res = s2.length > res.length ? s2: res;
    }

    return res;
}
```

思路就是
```
for (let i = 0; i < s.length; i++) {
    // 从i开始 向两边扩算寻找奇数的最长回文串
    // 从i, i + 1开始 向两边扩散寻找偶数的最长回文串

    res = Math.max(s1, s2)
}
```