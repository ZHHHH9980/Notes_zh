# [698. Partition to K Equal Sum Subsets](https://leetcode.com/problems/partition-to-k-equal-sum-subsets/)

很少有哪篇系列让我卡这么久了，即使做了一些回溯算法的题目，看到这篇还是津津有味。

## 两个视角
**视角一，如果我们切换到这 `n` 个数字的视角，每个数字都要选择进入到 `k` 个桶中的某一个**。

[![img](https://labuladong.github.io/algo/images/%e9%9b%86%e5%90%88%e5%88%92%e5%88%86/5.jpeg)](https://labuladong.github.io/algo/images/集合划分/5.jpeg)

**视角二，如果我们切换到这 `k` 个桶的视角，对于每个桶，都要遍历 `nums` 中的 `n` 个数字，然后选择是否将当前遍历到的数字装进自己这个桶里**。

[![img](https://labuladong.github.io/algo/images/%e9%9b%86%e5%90%88%e5%88%92%e5%88%86/6.jpeg)](https://labuladong.github.io/algo/images/集合划分/6.jpeg)

## 从数字的视角选择桶

常规for循环：
```js
for (let i = 0; i < nums.length; i++) {
    console.log('nums[i], nums[i]);
}
```

改成递归：
```js
function traverse(nums, index) {
    if (index === nums.length) {
        return ;
    }

    traverse(nums, index + 1);
}
```

用for循环的伪代码：
```js
var bucket = [];

// 穷举数字
for (let index = 0; index < nums.length; index++) {
    for (let i = 0; i < k; i++) {
        // 决策： nums[i] 是否进入第i个桶
    }
}
```

改成回溯算法：

```js
var bucket = new Array(k);

// 穷举数字
function backtrack(nums, index) { 
    if (nums.length == index) {
        return ;
    }

    for (let i = 0; i < bucket.length; i++) {
        // 选择装进这个桶
        bucket[i] += nums[index];
        // 继续穷举下一个数字
        backtrack(nums, index + 1);
        // 从这个桶撤出来
        bucket[i] -= nums[index];
    }
}
```


完善代码：

```js
var backtrack = function(nums, index, bucket, target) {
    if (index == nums.length) {
        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i] != target) {
                return false;
            }
        }

        return true;
    }

    for (let i = 0; i < bucket.length; i++) {
        // 剪枝
        if (bucket[i] + nums[index] > target) {
            continue;
        }

        // 把这个数字放入桶
        bucket[i] += nums[index];

        // 继续穷举，看看下个数字适合进入哪个桶
        if (backtrack(nums, index + 1, bucket, target)) {
            return true;
        }

        // 把这个数字从桶中撤销
        bucket[i] -= nums[index];
    }

    // 穷举了所有桶，也没找到合适的桶
    return false;
}

var canPartitionKSubsets = function(nums, k) {
    var sum = nums.reduce((acc, i) => acc + i, 0);

    if (sum % k != 0) {
        return false;
    }

    var target = sum / k;

    var bucket = new Array(k).fill(0);

    return backtrack(nums, 0, bucket, target);
};
```

这种写法确实能算出正确答案，但无法通过所有测试用例，后边的会超时。


## 参考

[经典回溯算法：集合划分问题](https://labuladong.github.io/algo/di-san-zha-24031/bao-li-sou-96f79/jing-dian--93320/)