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