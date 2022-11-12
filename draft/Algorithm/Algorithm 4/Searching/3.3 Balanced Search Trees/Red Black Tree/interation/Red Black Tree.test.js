/*
 * 第一版 test case
 * 1. 随机生成 < 1000个节点
 * 2. 随机删除这 < 1000 个节点中的100个节点
 * 3. 校验是否是一颗二叉搜索树
 * 4. 检查是否存在两个红色节点相连的情况
 * 以上 case 通过 则认为该红黑树可使用
 */

function generateRBTree(count) {
  var set = new Set();
  var arr = [];

  for (let i = 0; i < count; i++) {
    const val = Math.round(Math.random() * count);

    if (!set.has(val)) {
      set.add(val);
      arr.push(val);
    }
  }

  var rb = new RedBlackTree();
  for (let i = 0; i < arr.length; i++) {
    rb.put(arr[i], i);
  }

  return { rb, set, valid: set.size === rb.size() };
}

function deleteRbTreeNode({ rb, set }, count) {
  const arr = Array.from(set);
  const size = rb.size();

  for (let i = 0; i < count; i++) {
    rb.delete(arr[i]);
  }

  return {
    rb,
    originSize: size,
    valid: rb.size() === size - count,
  };
}

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

function doubleRedExist(root) {
  if (root == null) {
    return false;
  }

  const leftExist = doubleRedExist(root.left);
  const rightExist = doubleRedExist(root.right);

  // 节点为红色并且存在子节点为红色
  const exist =
    root.color === RED &&
    ((root.left !== null && root.left.color === RED) ||
      (root.right !== null && root.right.color === RED));

  if (exist) {
    console.log("exist!", rb, root, root.left, root.right);
  }

  return exist || leftExist || rightExist;
}

const { rb } = deleteRbTreeNode(generateRBTree(1000), 100);

console.log("isValidBST(rb.root)", isValidBST(rb.root));
console.log("doubleRedExist(rb)", doubleRedExist(rb));
console.log("rb", rb);
