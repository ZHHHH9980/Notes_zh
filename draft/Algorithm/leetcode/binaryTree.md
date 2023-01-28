# Binary Tree

## postorder traversal
[112. Path Sum](https://leetcode.com/problems/path-sum/description/)

- 二叉树后序遍历

```c++
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
public:
    bool hasPathSum(TreeNode* root, int targetSum) {
        if (root == nullptr) {
            return false;
        }

        // leaf node 
        if (root->left == nullptr && root->right == nullptr) {
            return targetSum == root->val;
        }

        bool leftExist {false};
        bool rightExist {false};

        if (root->left != nullptr) {
            leftExist = hasPathSum(root->left, targetSum - root->val);
        }

        if (root->right != nullptr) {
            rightExist = hasPathSum(root->right, targetSum - root->val);
        }

        return leftExist || rightExist;
    }
};
```

计算逻辑：
1. 有子节点继续向下遍历
2. 无子节点判断当前值是否相等