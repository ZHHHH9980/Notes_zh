/*
  BST check
校验一棵树是否是平衡二叉树
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

const checkHeight = (root) => {
  if (root == null) {
    return [0, true, true];
  }

  const [leftHeight, leftPass] = checkHeight(root.left);
  const [rightHeight, rightPass] = checkHeight(root.right);

  const curHeight = root.height;
  const realHeight = 1 + Math.max(leftHeight, rightHeight);

  const curPass = leftPass && rightPass && realHeight === curHeight;
  const isBalance = Math.abs(leftHeight - rightHeight) <= 1;

  if (!curPass) {
    console.log("root", root);
    console.log("leftPass", leftPass);
    console.log("rightPass", rightPass);
    console.log("realHeight", realHeight);
    console.log("curHeight", curHeight);
  }

  return [realHeight, curPass, isBalance];
};

const isValidAVLBST = (root) => {
  const [_, heightPass, isBalance] = checkHeight(root);
  return heightPass && isBalance && isValidBST(root);
};
