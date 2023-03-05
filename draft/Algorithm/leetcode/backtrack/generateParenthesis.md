# [22. Generate Parenthesis](https://leetcode.com/problems/generate-parentheses/submissions/)

## 递归解法

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