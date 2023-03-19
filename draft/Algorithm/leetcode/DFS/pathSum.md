# pathSum

> Given the root of a binary tree and an integer targetSum, return all root-to-leaf paths where the sum of the node values in the path equals targetSum.

关键是**root-to-leaf**，那么肯定需要遍历所有节点了。既然是根节点到叶子节点的路径和，首先应该想到DFS

## DFS

本质上是用了回溯的思想，不停向深处选择节点，选完以后择出符合条件的路径，之后再撤销选择。

```js
// DFS - backtrack
var traverse = function (root, targetSum, res,  curVal, note) {
    if (targetSum === curVal && !root.left && !root.right) {
        res.push(note.map(i => i));
        return;
    }

    if (root.left) {
        curVal += root.left.val;
        note.push(root.left.val);

        traverse(root.left, targetSum, res, curVal, note);

        note.pop();
        curVal -= root.left.val;
    }

    if (root.right) {
        curVal += root.right.val;
        note.push(root.right.val);

        traverse(root.right, targetSum, res, curVal, note);

        note.pop();
        curVal -= root.right.val;
    }
}

var pathSum = function(root, targetSum) {
    if (!root) {
        return [];
    }

    var res = [];

    var dummy = new TreeNode()
    dummy.left = root;
    traverse(dummy, targetSum, res, null, [])

    return res;
};
```

但是个人认为这种写法不够优雅，应该不需要添加守卫，主要原因是判断当前节点的左右子节点决定是否进入递归，其实只需要在一开始判断当前节点是否为Null即可，即使左右子节点是null，进入下一个递归函数也会立即返回。

### 改良一下 recursive + backtrac

```js

var traverse = function (root, targetSum, res,  curVal, note) {
    // 在这里判断即可，那么根节点可以直接传入，就不需要传守卫了
    if (root == null) {
        return;
    }

    curVal += root.val;
    note.push(root.val);

    if (targetSum === curVal && !root.left && !root.right) {
        res.push(note.map(i => i));
        note.pop();
        return;
    } else {
        traverse(root.left, targetSum, res, curVal, note);
        traverse(root.right, targetSum, res, curVal, note);
    }

    note.pop();
    curVal -= root.val;
}

var pathSum = function(root, targetSum) {
    if (!root) {
        return [];
    }

    var res = [];

    traverse(root, targetSum, res, 0, []):

    return res;
};
```

### iterative

一句话总结，迭代的方式只能用`后序遍历`，为什么？

后序遍历的输出结果：left -> right -> root，意味着root将最后输出，最后输出是因为root位于栈最底部，根据这道题的逻辑，root应该一直参与所有路径的计算，那么每次遍历到叶子节点的时候，root都在栈内（参与计算）。

而前序和中序遍历，都会在右子树遍历完成之前提前将root弹出栈，一旦弹出就无法参与路径计算。

```js
var pathSum = function(root, targetSum) {
    if (!root) {
        return [];
    }

    var res = [];
    var stack = [];
    var record = [];
    var cur = root;
    var sum = 0;
    var prev = null;

    while(cur != null || stack.length) {
        // make choice
        while (cur != null) {
            stack.push(cur);
            record.push(cur.val);
            sum += cur.val;
            cur = cur.left;
        }

        // cur = null
        // cur = stack.peek();
        var cur = stack[stack.length - 1];

        // if it has right subtree
        if (cur.right !== null && cur.right !== prev) {
            cur = cur.right;
            continue;
        }

        // leaf
        if (cur.left == null && cur.right == null && sum == targetSum) {
            // 叶子节点且符合条件
            res.push(record.map(i => i));
        }

        cur = stack.pop();
        sum -= cur.val;
        record.pop();
        
        // 已经被遍历过了，避免重复进入
        prev = cur;
        // 继续看下一个栈节点
        cur = null;
    }

    return res;
};
```

为什么要记录prev ?

主要是因为peek的操作。
