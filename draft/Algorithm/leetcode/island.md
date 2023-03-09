# Island

## DFS
二叉树遍历：
```
traverse(TreeNode root) {
    traverse(root.left);
    traverse(root.right);
}
```

dfs：
```
void dfs(int[][] grid, int i, int j, boolean[][] visited) {
    int m = grid.length;
    int n = grid.length;

    if (i == -1 || j == -1 || i == m || j == n) {
        return;
    }

    // 已经访问过
    if (visited[i][j]) {
        return;
    }

    visited[i][j] = true;

    if (grid[i][j] == 1) {
        dfs(grid, i + 1, j); // 下
        dfs(grid, i - 1, j); // 上
        dfs(grid, i, j + 1); // 右
        dfs(grid, i, j - 1); // 左
    }
}
```

### [1020. Number of Enclaves](https://leetcode.com/problems/number-of-enclaves/description/)

思路是先用DFS淹没掉周围的岛屿，剩余的岛屿就是要统计的。


```java
class Solution {
    public void dfs(int[][] grid,int i,int j,int m,int n) {
        if (i == -1 || j == -1 || i == m || j == n) {
            return;
        }

        if (grid[i][j] == 1) {
            grid[i][j] = 0;

            dfs(grid, i - 1, j, m, n);
            dfs(grid, i + 1, j, m, n);
            dfs(grid, i, j + 1, m, n);
            dfs(grid, i, j - 1, m, n);
        }
    }

    public int numEnclaves(int[][] grid) {
        int m = grid.length;
        int n = grid[0].length;
        int res = 0;
        
        for (int i = 0; i < m; i++) {
            dfs(grid, i, 0, m, n);
            dfs(grid, i, n - 1, m, n);
        }

        for (int j = 0; j < n; j++) {
            dfs(grid, 0, j, m, n);
            dfs(grid, m - 1, j, m, n);
        }

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1) {
                    res++;
                }
            }
        }

        return res;
    }
}

```

### [1254. Number of Closed Islands](https://leetcode.com/problems/number-of-closed-islands/)

也是同样的思路，先淹没周围的岛屿，再计算且淹没被环绕的岛屿数量。

```java
class Solution {
    public void dfs(int[][] grid, int i, int j) {
        int m = grid.length;
        int n = grid[0].length;

        if (i == -1 || j == -1 || i == m || j == n) {
            return;
        }

        if (grid[i][j] == 0) {
            grid[i][j] = 1;
            
            dfs(grid, i - 1, j);
            dfs(grid, i + 1, j);
            dfs(grid, i, j - 1);
            dfs(grid, i, j + 1);
        }
    }

    public int closedIsland(int[][] grid) {
        int m = grid.length;
        int n = grid[0].length;
        int res = 0;

        for (int i = 0; i < m; i++) {
            dfs(grid, i, 0);
            dfs(grid, i, n - 1);
        }

        for (int j = 0; j < n; j++) {
            dfs(grid, 0, j);
            dfs(grid, m - 1, j);
        }

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 0) {
                    res++;
                    dfs(grid, i, j);
                }
            }
        }

        return res;
    }
}
```

### [1905. Count Sub Islands](https://leetcode.com/problems/count-sub-islands/description/)

这道题有点难，但也很有意思。

grid1的岛屿称为A，grid2的岛屿称为B。

#### 思路
如果要判断B为A的子岛屿，那么A岛屿陆地`cell`要覆盖B所有的陆地`cell`，如果反过来思考，那么B岛屿陆地`cell`在A中必须都是陆地，如果有海水，就说明不是子岛屿。

那么根据这个思路，把不是子岛屿的全部淹没掉，剩余的岛屿就是子岛屿。

```java
class Solution {
    public void dfs(int[][] grid, int i, int j) {
        int m = grid.length;
        int n = grid[0].length;

        if (i == -1 || j == -1 || i == m || j == n) {
            return;
        }

        if (grid[i][j] == 1) {
            grid[i][j] = 0;

            dfs(grid, i - 1, j);
            dfs(grid, i + 1, j);
            dfs(grid, i, j - 1);
            dfs(grid, i, j + 1);
        }
    }
    public int countSubIslands(int[][] grid1, int[][] grid2) {
        int m = grid1.length;
        int n = grid1[0].length;
        int res = 0;

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid1[i][j] == 0 && grid2[i][j] == 1) {
                    // 不是子岛屿，淹没
                    dfs(grid2, i, j);
                }
            }
        }

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid2[i][j] == 1) {
                    res++;
                    dfs(grid2, i, j);
                }
            }
        }

        return res;
    }
}
```


## 参考

[一文秒杀所有岛屿题目](https://labuladong.github.io/algo/di-san-zha-24031/bao-li-sou-96f79/yi-wen-mia-4f482/)