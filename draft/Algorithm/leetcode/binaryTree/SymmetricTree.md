# [101. Symmetric Tree](https://leetcode.com/problems/symmetric-tree/description/)

判断这棵树是否是镜像。

## 解法一：BFS 层序遍历 + 双指针


```js
// [4, null, 3, 3, null, 4]
// ^left                 ^ right
// 双指针不断靠近，如果出现left !== right则认为这一层就不是对称的

```

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isSymmetric = function(root) {
    var queue = [root];

    while(queue.length) {
        var len = queue.length;

        var left = 0,
            right = len - 1;

        while(left < right) {
            var leftVal = queue[left] ? queue[left].val : queue[left];
            var rightVal = queue[right] ? queue[right].val: queue[right];
            if (leftVal !== rightVal) {
                return false;
            }
            left++;
            right--;
        }

        for (let i = 0; i < len; i++) {
            var node = queue.shift();
        
            if (node) {
                queue.push(node.left ? node.left: null);
                queue.push(node.right? node.right: null);
            }
        }
    }

    return true;
};

```

## 解法二： DFS

判断一棵树是否是对称的，就看他的左右子节点是否相等，以及
1. 左子节点的左子节点 是否等于右子节点的右子节点
2. 左子结点的右子节点 是否等于右子节点的左子节点

这个我是真想不到..

```java
public boolean isSymmetric(TreeNode root) {
    return root==null || isSymmetricHelp(root.left, root.right);
}

private boolean isSymmetricHelp(TreeNode left, TreeNode right){
    if(left==null || right==null)
        return left==right;
    if(left.val!=right.val)
        return false;
    return isSymmetricHelp(left.left, right.right) && isSymmetricHelp(left.right, right.left);
}
```