# BackTrack

## 回溯框架

- 为什么是在for循环里进行操作？

    1. for 循环在递归树的同一层进行遍历(做决策)，符合策略的进入下一层
    2. 回溯更像是BFS跟DFS的结合，本质上是穷举整颗多叉树

- 递归函数的逻辑是进入递归树的下一层

```java
void traverse(TreeNode root) {
    for (TreeNode child : root.childern) {
        // 前序位置需要的操作
        traverse(child);
        // 后序位置需要的操作
    }
}

```

[46. Permutations](https://leetcode.com/problems/permutations/)

- 全排列应该是最简单的回溯问题了

```c++
class Solution {

public:
    vector<vector<int>> permute(vector<int>& nums) {
        
        vector<int> used(nums.size(), false);
        vector<vector<int>> result {};
        vector<int> temp {};

        backtrack(nums, result, temp, used);

        return result;
    }

    void backtrack(vector<int>& nums, vector<vector<int>>& res, vector<int>& temp, vector<int>& used) {
        // recursion endpoint
        if (temp.size() == nums.size()) {
            res.push_back(temp);
            return;
        }

        for (int i = 0; i < nums.size(); i++) {
            if (used[i]) {
                continue;
            }

            // make choice 
            used[i] = true;
            temp.push_back(nums[i]);

            backtrack(nums, res, temp, used);

            // reset
            used[i] = false;
            temp.pop_back();
        }
    }
};
```


[N-Queen](https://leetcode.com/problems/n-queens/submissions/884816052/)
N皇后问题，棋盘选择放"."或者"Q"，每个column是一个决策点，每一个row是递归树的层。

```c++

class Solution {
private:
    vector<vector<string>> result{};
public:
    bool isValid(vector<string>& board, int& row, int col, int& n) {
        
        for (int i = 1; i <= row; i++) {
            // 正上方
            if (board[row - i][col] == 'Q') {
                return false;
            }

            // 左上方
            if (col - i >= 0 && board[row - i][col - i] == 'Q') {
                return false;
            }

            // 右上方
            if (col + i < n && board[row - i][col + i] == 'Q') {
                return false;
            }
        }

        return true;
    }

    void backtrack(vector<string>& board, int& n, int row) {
        if (row == n) {
            result.push_back(board);
        }

        for (int col = 0; col < n; col++) {

            if (!isValid(board, row, col, n)) {
                continue;
            }

            // make choice
            board[row][col] = 'Q';

            backtrack(board, n, row + 1);

            // back choice
            board[row][col] = '.';
        }
    }

    vector<vector<string>> solveNQueens(int n) {
        // '.' 表示空，'Q' 表示皇后，初始化空棋盘
        vector<string> board(n, string(n, '.'));
        
        backtrack(board, n, 0);

        return result;
    }
};
```

[494. Target Sum](https://leetcode.com/problems/target-sum/)

这道题也可以用回溯的思路，没有用for循环是因为递归树上只有两个节点，一个是选择"+"，一个是选择"-"。

```c++
class Solution {
public:
    int backtrack(vector<int>& nums, int& target, int index, int curVal) {
        if (index == nums.size()) {
            return curVal == target ? 1 : 0;
        }

        return backtrack(nums, target, index + 1, curVal - nums[index]) + backtrack(nums, target, index + 1, curVal + nums[index]);
    }

    int findTargetSumWays(vector<int>& nums, int target) {
        return backtrack(nums, target, 0, 0);
    }
};

```


## 排列-组合-子集问题

### 元素无重复不可复选

[216. Combination Sum III](https://leetcode.com/problems/combination-sum-iii/description/)

为了避免重复选择同一元素，进入递归的索引需要+1

```js
var backtrack = function(target, n, res, start, record = []) {
    if (record.length == n && target == 0) {
        res.push(record.map(i => i));
        return;
    }

    // 超出限定长度 直接终止
    if (record.length > n) {
        return;
    }

    for (let i = start; i <= 9; i++) {
        if (i > target) {
            continue;
        }

        record.push(i);
        backtrack(target - i, n, res, i + 1, record);
        record.pop();
    }
}

var combinationSum3 = function(k, n) {
     var res = [];

     backtrack(n, k, res, 1);

     return res;
};
```

### 元素无重复可复选

[39. Combination Sum](https://leetcode.com/problems/combination-sum/description/)

输入数组内元素无重复的的，可以重复选择。

这里一开始没想到怎么处理这种问题，进入递归后又从第一个元素开始做选择。

### 错误解法
``` js
var backtrack = function(candidates, target, res, record = []) {
    if (target == 0) {
        res.push(record.map(i => i));
        return;
    }

    // 每次都从0开始，也就是以前选过的元素还会再次选择
    for (let i = 0; i < candidates.length; i++) {
        var num = candidates[i];

        if (num > target) {
            continue;
        }

        // make choice
        record.push(num);
        backtrack(candidates, target - num, res, record);
        
        // reset choice
        record.pop();
    }
}
```

那么就会出现重复的组合：
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cafae7f7f6e34e59a3f1efd7400ccf7f~tplv-k3u1fbpfcp-watermark.image?)

那么为了避免出现重复组合，应该传入目前的索引作为起点（避免再从0开始重复做选择）

```js
/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */

var backtrack = function(candidates, start, target, res, record = []) {
    if (target == 0) {
        res.push(record.map(i => i));
        return;
    }

    for (let i = start; i < candidates.length; i++) {
        var num = candidates[i];

        if (num > target) {
            continue;
        }

        // make choice
        record.push(num);
        
        // 剪掉之前已经选过的部分
        backtrack(candidates, i, target - num, res, record);
        
        // reset choice
        record.pop();
    }
}

var combinationSum = function(candidates, target) {
    var res = [];
    backtrack(candidates, 0, target, res);

    return res;
};
```