# 括号问题

## [20. Valid Parentheses](https://leetcode.com/problems/valid-parentheses/description/)

```js
// 括号问题一般用栈解决
 // 遇到左括号入栈
 // 遇到右括号 匹配栈头，如果对得上，出栈，对不上return false
var isValid = function(s) {
    var stack = [];
    var map = {'[': ']', '(': ')', '{': '}'};

    for (let i = 0; i < s.length; i++) {
        var char = s[i];

        if (char == '(' || char == '[' || char == '{') {
            stack.push(char);
        } else { // right bracket
            var c = stack.pop();
            if (char !== map[c]) {
                return false;
            }
        }
    }

    return stack.length == 0;
};
```

## [1541. Minimum Insertions to Balance a Parentheses String](https://leetcode.com/problems/minimum-insertions-to-balance-a-parentheses-string/description/)

看到括号匹配就要想到栈。

```js
// 总归是要平衡的，所以遇到"("就先入栈，栈里面只存"("
 // 如果遇到")"
 // 先从栈里面取"(",

 // flag = true说明当前有一个"("正在作用，如果是")"可以直接平衡
 // 1. 遇到"("
 //    0. 查看flag是否为true，如果为true，说明前面生成了"("
 //       那么 res++， flag = false，入栈
 // 2. 遇到")"
 //    0. 确认前面是否有"("存在，即flag=true有那么直接消掉，flag = false
 //    1. 查看栈不为空，弹出"("，设置flag=true，过掉这一个
 //    2. 查看栈为空，借一个"("，res++，消掉这一个，flag = true

 // 最后flag = true ， res++
 // res += stack.length * 2

var minInsertions = function(s) {
    var stack = 0,
        flag = false,
        res = 0;
    
    for (let i = 0; i < s.length; i++) {
        var char = s[i];

        if (char === "(") {
            if (flag) {
                res++;
                flag = false;
            } 

            stack++;
        } else {
            if (flag) {
                flag = false;
            } else if (stack) {
                stack--;
                flag = true;
            } else {
                res++;
                flag = true;
            }
        }
    }

    if (flag) {
        res++;
    }

    if (stack) {
        res+= stack * 2;
    }

    return res;
};

```


## [921. Minimum Add to Make Parentheses Valid](https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/description/)

这题就更简单了，比上一道题考虑的还少一些，不应该是中等难度。

```js
/**
 * @param {string} s
 * @return {number}
 */
var minAddToMakeValid = function(s) {
    var stack = 0,
    res = 0;

    for (let i = 0; i < s.length; i++) {
        var char = s[i];

        if (char === '(') {
            stack++;
        } else if (char === ')' && stack) {
            stack--;
        } else {
            res++;
        }
    }

    res += stack;

    return res;
};
```