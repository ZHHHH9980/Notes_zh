# greedy Algorithm

## [435. Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/description/)

先求最多有多少个不重叠的区间，边界相同并不算重叠，只能算接触。

思路是先给所有区间按照结束点来升序排序，然后选出所有区间结束最早的。具体的直接看最底下的参考吧。

```ts
function maxOverlapping(intervals: number[][]): number {
    let count = 1;
    let x_end = intervals[0][1];

    for (let interval of intervals) {
        if (x_end <= interval[0]) {
            x_end = interval[1];
            count++;
        }
    }

    return count;
};
```

```ts
function eraseOverlapIntervals(intervals: number[][]): number {
    var len = intervals.length;
    
    intervals.sort((a, b) => {
        return (a[1] - b[1]);
    })

    return len - maxOverlapping(intervals);
};
```

## [452. Minimum Number of Arrows to Burst Balloons]

最少需要多少次发射才能戳破所有气球，也就是求没有重叠的区间有多少个。

这里跟之前不太一样的地方是，如果边界相同也会同时戳破，那么判断条件就需要改一下。

```ts
function findMinArrowShots(points: number[][]): number {
    points.sort((a, b) => {
        return a[1] - b[1];
    });

    var count = 1;
    var x_end = points[0][1];

    for (let point of points) {
        // [3, 4] [4, 5] 算是重叠的 都会被戳破
        if (x_end < point[0]) {
            count++;
            x_end = point[1];
        }
    }

    return count;
};
```

## 参考
[贪心算法之区间调度问题](https://labuladong.github.io/algo/di-er-zhan-a01c6/tan-xin-le-9bedf/tan-xin-su-c41e8/)