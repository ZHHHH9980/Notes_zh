# [22. Generate Parenthesis](https://leetcode.com/problems/generate-parentheses/submissions/)

这道题在DFS和回溯的情况下，需要把握好"("和")"的关系，也就是生成字符串的过程中(append)，"("个数永远大于等于")"，否则将无法生成一个合法的括号。


## 递归解法

这里应该叫DFS更合适

```js
var _generate = function(n, str, left, right, res) {
    if (str.length == n*2) {
        res.push(str);
        return;
    }

    if (left == right) {
        _generate(n, str + '(', left + 1, right, res);
    }

    if (left > right) {
        if (left != n) {
            _generate(n, str + '(', left + 1, right, res);
        }
        _generate(n, str + ')', left, right + 1, res);
    }
}

var generateParenthesis = function(n) {
    let res = [];
    
    _generate(n, '', 0, 0, res);
    return res;
};
```

## 回溯解法

回溯解法真的爱了，先选择，行不行再说，不行后续会撤销这个选择。

```js

var backtrack = function (left_rest, right_rest, record, res) {

  // 右括号比左括号多，不符合
  if (right_rest < left_rest) {
    return;
  }
  
  // 不能小于0
  if (right_rest < 0 || left_rest < 0) {
    return;
  }

  // 都用完了，是答案之一
  if (left_rest == 0 && right_rest == 0) {
    res.push(record.join(''));
    return;
  }

  // 选择左括号试试
  record.push("(");
  backtrack(left_rest - 1, right_rest, record, res);
  // 撤销
  record.pop();

  record.push(")");
  backtrack(left_rest, right_rest - 1, record, res);
  record.pop();
};

var generateParenthesis = function (n) {
  var res = [];
  var record = [];

  backtrack(n, n, record, res);

  return res;
};
```

## DP 

dp[i] 定义：包含i对有效匹配的括号。

```
dp[0] = [""]
dp[1] = ["()"]
dp[2] = ["()()", "(())"]
```

现在已知dp[2], dp[1], dp[0], 如何推导出dp[3] ? 

```
( + dp[0] ) + dp[2] = ()()() and ()(())
( + dp[1] ) + dp[1] = (())()
( + dp[2] ) + dp[0] = (()()) and ((()))
```

因此这个递归关系式为：
```
dp[i] = ( + dp[j] ) + dp[i - j - 1]

j 的范围为 [0...i - 1]
```

那么现在需要生成n对有效括号的组合，i的范围为[0...n], j的范围为[0...i-1]，根据递归关系取出之前的子组合生成新的组合即可：

```js

 function generateParenthesis(n) {
  var dp = [[""]];

  for (let i = 1; i <= n; i++) {
    dp[i] = [];
    for (let j = 0; j < i; j++) {
      var left = dp[j];
      var right = dp[i - j - 1];
      
      for (let l of left) {
        for (let r of right) {
          dp[i].push(`(${l})${r}`);
        }
      }
    }
  }

  return dp[n];
}
```

### 参考

[DP](https://leetcode.com/problems/generate-parentheses/solutions/594770/c-2-solutions-backtracking-and-dp/?q=DP&orderBy=most_votes)