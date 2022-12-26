/*
isValidBST
校验一棵树是否是二叉搜索树
关键点是 
- 根节点 要大于 左子树节点最大值
- 根节点 要小于 右子树节点最小值 
*/
const isValidBST = (root, lo = -Infinity, hi = Infinity) => {
  if (!root) return true;
  if (root.key <= lo || root.key >= hi) return false;

  return (
    isValidBST(root.left, lo, root.key) && isValidBST(root.right, root.key, hi)
  );
};
