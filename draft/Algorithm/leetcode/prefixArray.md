# 前缀和数组

## 计算范围和
[303. Range Sum Query - Immutable](https://leetcode.com/problems/range-sum-query-immutable/)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58cb631dd99d4f1a8f69140b0d98af56~tplv-k3u1fbpfcp-watermark.image?)


### O(n)解法

这种解法其实有点呆，因为数组是不可变的。

``` java
class NumArray {
    private int[] nums;

    public NumArray(int[] nums) {
        this.nums = nums;    
    }
    
    public int sumRange(int left, int right) {
        int sum = 0;
        for (int i = left; i <= right; i++) {
            sum += nums[i];
        }
        return sum;
    }
}

```

### O(1)解法

核心思路是我们 new 一个新的数组 `preSum` 出来，`preSum[i]` 记录 `nums[0..i-1]` 的累加和。

比如要计算 nums[4...6]的累加和：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/615e3562a53f466ea321a84dbd5743c9~tplv-k3u1fbpfcp-watermark.image?)

现在 我们计算出 nums[0...3] 的累加和 以及nums[0...6]的累加和，两者相减，就可以得到nums[4...6]的累加和。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a0f4e6f3351f4850a7623e8f7da19b2b~tplv-k3u1fbpfcp-watermark.image?)

那么根据之前构建的`preSum`:
- preSum[4] = sum(nums[0...3])
- preSum[7] = sum(nums[0...6])

则有：

sum(nums[4...6]) = sum(nums[0...6]) - sum(nums[0...3]) = preSum[7] - preSum[4]

将计算sum(nums[4...6]) 转为一般式 sum(nums[left...right])
则有：
- sum(nums[left...right]) = preSum[right + 1]  - preSum[left]

```java
class NumArray {
    private int[] preSum;

    public NumArray(int[] nums) {
        preSum = new int[nums.length + 1];

        // 注意这里的数组取值范围 需要右移一位
        for(int i = 1; i <= nums.length; i++) {
            preSum[i] = preSum[i - 1] + nums[i - 1];
        }    
    }
    
    public int sumRange(int left, int right) {
        return preSum[right + 1] - preSum[left];
    }
}

```

### 不同的定义产生不同的解法

这次 new 一个新的数组 `preSum` 出来，`preSum[i]` 记录 `nums[0..i]` 的累加和。

那么preSum[0] 存储的就是 nums[0]的值。

则有：

sum(nums[left...right]) = preSum[left - 1] - preSum[right]

如果left = 0 会有数组越界的情况，这种情况本质上就是在求nums[0...right]累加和，那么直接返回preSum[right]即可。

```java
class NumArray {
    private int[] preSum;

    public NumArray(int[] nums) {
        preSum = new int[nums.length];
        preSum[0] = nums[0];

        for(int i = 1; i < nums.length; i++) {
            preSum[i] = preSum[i - 1] + nums[i];
        }    
    }
    
    public int sumRange(int left, int right) {
        if (left == 0) {
            return preSum[right];
        }
        return preSum[right] - preSum[left - 1];
    }
}

```

### [304. Range Sum Query 2D - Immutable](https://leetcode.com/problems/range-sum-query-2d-immutable/description/)

遍历可就太low了。

计算一个范围的矩形，可以通过四个矩形的加减计算。这四个矩形都是从原点(0,0)开始。

![jpeg](https://labuladong.github.io/algo/images/%e5%89%8d%e7%bc%80%e5%92%8c/5.jpeg)



我一开始是按照  

定义： preSum[i][j] 代表从原点(0,0) -> (i, j) 的矩阵和。

发现计算的时候特别多边界case，要考虑左上角存在(0, 0)的情况，而且还会出现左上角和右下角相等的情况
```java

class NumMatrix {
    // 定义： preSum[i][j] 代表从原点(0,0) -> (i, j) 的矩阵和
    private int[][] preSum;

    public NumMatrix(int[][] matrix) {
        int m = matrix.length;
        int n = matrix[0].length;

        preSum = new int[m][n];
        preSum[0][0] = matrix[0][0];

        for (int i = 1; i < m; i++) {
            preSum[i][0] = preSum[i - 1][0] + matrix[i][0];
        }

        for (int j = 1; j < n; j++) {
            preSum[0][j] = preSum[0][j - 1] + matrix[0][j];
        }

        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                preSum[i][j] = preSum[i - 1][j] + preSum[i][j - 1] - preSum[i - 1][j - 1] + matrix[i][j];
            }
        }
    }
    
    // public int sumRegion(int row1, int col1, int row2, int col2) {
    //     if (row1 == row2 && col1 == col2) {
    //         return preSum[row1][col1];
    //     }

    //     if (row1 == 0 || col1 == 0) {
    //         return preSum[row2][col2] - preSum[row1][col1];
    //     }
    //     return preSum[row2][col2] - preSum[row1 - 1][col2] - preSum[row2][col1 - 1] + preSum[row1 - 1][col1 - 1];
    // }
}

```


如果把定义改成： preSum[i][j] 代表matrix中从原点(0,0) -> (i - 1, j - 1) 的矩阵和

类似于上一道题的第一个定义，而且代码会简洁许多。

```java
class NumMatrix {
    // 定义： preSum[i][j] 代表从原点(0,0) -> (i - 1, j - 1) 的矩阵和
    private int[][] preSum;

    public NumMatrix(int[][] matrix) {
        int m = matrix.length;
        int n = matrix[0].length;

        preSum = new int[m + 1][n + 1];

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                // 计算matrix[i - 1][j - 1]的矩阵和
                preSum[i][j] = preSum[i - 1][j] + preSum[i][j - 1] - preSum[i - 1][j - 1] + matrix[i - 1][j - 1];
            }
        }
    }
    
    public int sumRegion(int x1, int y1, int x2, int y2) {
        return preSum[x2 + 1][y2 + 1] - preSum[x1][y2 + 1] - preSum[x2 + 1][y1] + preSum[x1][y1];
    }
}
```