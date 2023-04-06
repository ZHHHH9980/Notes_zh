# [11. Container With Most Water](https://leetcode.com/problems/container-with-most-water/)

接雨水问题

1.柱子的范围 0 ~ n - 1
2.能接雨水的范围 1 ~ n - 2

定义：当前这一列i，左侧最高的柱子高度为l_max，右侧最高的柱子高度为r_max。

能接到雨水的前提是height[i] < Math.min(l_max, r_max)，能接到的雨水为most = Math.min(l_max, r_max) - height[i]

O(N^2)的暴力解法

```js
 // O(N^2)
 var trap = function (height) {

  var n = height.length;
  var res = 0;

  for (let i = 1; i <= n - 2; i++) {
    var l_max = 0;
    var r_max = 0;

    var l = i - 1;
    var r = i + 1;

    while (l >= 0) {
      l_max = Math.max(l_max, height[l]);
      l--;
    }

    while (r <= n - 1) {
      r_max = Math.max(r_max, height[r]);
      r++;
    }

    var most = Math.min(l_max, r_max);

    if (most > height[i]) {
      res += most - height[i];
    }
  }

  return res;
};

```

## O(N)解法

突然想到一种解法，可以额外开一个等量的数组用于记录每个位置的l_max和r_max。

```js
let l_max = 0;
let record = [];

for (let i = 0; i < n; i++) {
    if (height[i] > l_max) {
        l_max = height[i];
    }
    record[i] = { l_max };
}

let r_max = 0;

for (let i = n - 1; i >= 0; i--) {
    if (height[i] > r_max) {
        r_max = height[i];
    }
    record[i] = { ...record, r_max };
}
```

那么再改改里面的逻辑即可，不要重新遍历了。

空间换时间，O(n^2)是过不了的，那么这个解法就可以通过了，不过能想到O(n^2)，那么想到优化也不难：

```js

var trap = function (height) {
  // 柱子的范围 0 ~ n - 1
  // 能接雨水的范围 1 ~ n - 2

  var n = height.length;
  var res = 0;

  let l_max = 0;
  let record = [];

  for (let i = 0; i < n; i++) {
    if (height[i] > l_max) {
      l_max = height[i];
    }
    record[i] = { l_max };
  }

  let r_max = 0;

  for (let i = n - 1; i >= 0; i--) {
    if (height[i] > r_max) {
      r_max = height[i];
    }
    record[i] = { ...record[i], r_max };
  }

  for (let i = 1; i <= n - 2; i++) {
    var left_max = record[i].l_max;
    var right_max = record[i].r_max;

    var most = Math.min(left_max, right_max);

    if (most > height[i]) {
      res += most - height[i];
    }
  }

  return res;
}
```

## O(1) 双指针解法

```js
var trap = function(height) {
    var left = 0,
        right = height.length - 1;
        l_max = 0,
        r_max = 0;

    while (left < right) {
        l_max = Math.max(l_max, height[left]);
        r_max = Math.max(r_max, height[right]);

        left++;
        right--;
    }
}
```

`l_max`代表[0...left]的最大高度，`r_max`代表[right...height.length - 1]的最大高度。

```js
var trap = function(height) {
    var left = 0,
        right = height.length - 1;
        l_max = 0,
        r_max = 0,
        res = 0;

    while (left < right) {
        l_max = Math.max(l_max, height[left]);
        r_max = Math.max(r_max, height[right]);

        if (l_max < r_max) {
            res += l_max - height[left];
            left++;
        } else {
            res += r_max - height[right];
            right--;
        }
    }

    return res;
}
```

# [11. Container With Most Water](https://leetcode.com/problems/container-with-most-water/)

其实这道题要比上道题更简单才是，因为柱子本质上是一条细线，是没有宽度的。

如果是上一道题，如果只知道height[left]和height[right]，是没有办法计算能接多少水的，因为不知道里面柱子具体的高度。

但如果是这道题，是可以知道能接多少雨水的，直接用 Math.min(height[left], height[right]) * (right - left)就可以知道接了多少雨水。

那么双指针技巧解决是最高效的。

```js
var maxArea = function(height) {
    var left = 0,
        right = height.length - 1,
        res = 0;

    while (left < right) {
        var curArea = Math.min(height[left], height[right]) * (right - left);
        res = Math.max(curArea, res);

        // 能不能接更多雨水取决于短板
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }

    return res;
};
```