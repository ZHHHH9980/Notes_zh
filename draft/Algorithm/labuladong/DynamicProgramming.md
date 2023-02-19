# DP

## [509. Fibonacci Number](https://leetcode.com/problems/fibonacci-number/description)

**千万不要看不起暴力解，动态规划问题最困难的就是写出这个暴力解，即状态转移方程**。

```js

/**
 * @param {number} n
 * @return {number}
 */
 
// 1. 暴力递归
var fib = function(n) {
    if (n == 0 || n == 1) {
        return n;
    }

    return fib(n - 1) + fib(n - 2);
};

// 2. recursion with memo
var fib = function(n, memo = {}) {
    if (n == 0 || n == 1) {
        return n;
    }

    if (memo[n] !== undefined) {
        return memo[n];
    }

    var res = fib(n - 2, memo) + fib(n - 1, memo);

    memo[n] = res;

    return res;
}


// 3. record with table
var fib = function(n) {
    var table = [0, 1];

    for (let i = 2; i <= n; i++) {
        table[i] = table[i - 2] + table[i - 1];
    }

    return table[n];
}

// 压缩状态
var fib = function(n) {
    if (n == 0 || n == 1) {
        return n;
    }
    
    var t_0 = 0;
    var t_1 = 1;

    for (let i = 2; i <= n; i++) {
        var temp = t_1;
        t_1 = t_0 + t_1;
        t_0 = temp;
    }

    return t_1;
}
```

##