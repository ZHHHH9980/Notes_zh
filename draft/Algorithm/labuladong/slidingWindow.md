# slidingWindow

这篇东哥写的太好了，我没什么要补充的，就贴代码吧。

## [76. Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/description/)

`substr`被废弃了，尽量用`substring`吧，刚好对应模板的[left, right)，不需要多余处理了。

```js
/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
var minWindow = function(s, t) {
    var need = {};
    var window = {};
    var left = 0;
    var right = 0;
    var valid = 0;
    // 起始位置
    var start = 0;
    // 最小长度
    var minLen = Number.MAX_SAFE_INTEGER;
    var end = 0;
    var total = 0;

    for (let i = 0; i < t.length; i++) {
        var char = t[i];

        if (!need[char]) {
            need[char] = 1;
            continue;
        }

        need[char]++;
    }
    total = Object.keys(need).length;

    while(right < s.length) {
        // 即将进入窗口的字符
        var c = s[right];
        // 扩大窗口
        right++;

        // 是符合条件的字符
        if (need[c]) {
            window[c] = window[c] ? window[c] + 1: 1;
            if (window[c] === need[c]) {
                valid++;
            }
        }

        // 出现符合条件的字符串，开始收缩
        while(valid === total) {
            // 出现更小的符合要求的字符串，更新结果
            if (right - left < minLen) {
                start = left;
                end = right;
                minLen = right - left;
            }

            // 即将移除的字符
            var d = s[left];
            // 缩小窗口
            left++;

            if (need[d]) {
                // 这个字符是需要的，那么得先valid--
                if (need[d] === window[d]) {
                    valid--;
                }
                window[d]--;
            }
        }
    }

    return s.substring(start, end);
};
```

## [3. Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/description/)

其实只要理解滑动窗口的本质，把握住[left, right)和扩张收缩时机，自己也能写出来，不需要抄代码。

```js
// 扩张时机: 一直扩张
// 扩张动作：set.add(char)
// 扩张之后记录最大长度
// 压缩时机：set.has(即将进入窗口的字符串)
// 压缩动作：set.remove(char)

var lengthOfLongestSubstring = function(s) {
    // [left, right)
    var left = 0,
    right = 0,
    set = new Set,
    maxLen = 0;


    while (right < s.length) {
        // 即将进入窗口
        var char = s[right];
        set.add(char);
        right++;

        // 要先记录，一旦发现要进入的字符是存在，就要开始收缩了。
        var len = right - left;
            maxLen = len > maxLen ? len: maxLen;

        // 即将进入窗口的字符已经存在了，那么就需要收缩
        while(set.has(s[right])) {
            var c = s[left];
            set.delete(c);
            left++;
        }
    }

    return maxLen;
};
```

## [438. Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string/description/)

```js
/**
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
var findAnagrams = function(s, p) {
    // 扩张：right指针一直右移即可
    // 扩张动作：right++
    // 收缩：窗口长度 = p.length
    // 收缩前：valid === p.length 记录index

    var left = 0,
    right = 0,
    window = {},
    need = {},
    valid = 0,
    res = [];

    for (let i = 0; i < p.length; i++){ 
        if (!need[p[i]]) {
            need[p[i]] = 1;
            window[p[i]] = 0;
            continue;
        }
        need[p[i]]++;
    }

    while(right < s.length) {
        var char = s[right];
        right++;

        if (need[char]) {
            window[char]++;
            if (window[char] === need[char]) {
                valid++;
            }
        }

        while(right - left === p.length) {
            if (valid === p.length) {
                res.push(left);
            }

            var c = s[left];
            left++;
            if (need[c]) {
                if (window[c] === need[c]) {
                    valid--;
                }
                window[c]--;
            }
        }
    }

    return res;
};
```

## 参考

https://labuladong.github.io/algo/di-yi-zhan-da78c/shou-ba-sh-8f30d/di-gui-mo--10b77/

