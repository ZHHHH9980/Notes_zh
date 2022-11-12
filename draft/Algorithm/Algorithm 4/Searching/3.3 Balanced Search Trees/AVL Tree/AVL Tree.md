# AVL Tree

AVL Tree 主要基于之前的 BST 迭代版本实现。

## 一些基本概念

- 平衡因子： 左右子树高度差绝对值。
- AVL 树： 所有节点的平衡因子<= 1。（高度相对平衡的一颗 BST）
- 旋转： 新增节点会导致 BST 失衡，即平衡因子>1，通过一些处理（旋转）让树回复平衡

## 添加后带来的失衡，旋转恢复平衡

红色方块是新增节点

图片来自小码哥教育，仅用于学习。

- LL 右旋转
  LL 指的是当前失衡节点的左子节点（Left）的左子节点（left）新增节点导致的失衡。因此需要将当前节点向右侧旋转，成为左子节点的右节点（g 的变化）

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5cec6d1925b4cd1a6c28ec36060d257~tplv-k3u1fbpfcp-watermark.image?)

- RR 左旋转
  与之前类似，失衡节点发生在 right.right,因此只需要将失衡节点左旋，成为右子节点的左子节点。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b4332d7d0ec46cab44b353b1e917676~tplv-k3u1fbpfcp-watermark.image?)

- LR
  这种情况需要旋转两次，RR 先转 p 节点，LL 再转 g 节点。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f7d35670eb44d7e89181490ab93bb91~tplv-k3u1fbpfcp-watermark.image?)

- RL

先左旋转 p，再右旋转 g
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/058d26e729924f18832ebb65d0076840~tplv-k3u1fbpfcp-watermark.image?)

如何判断是到底是哪种类型的偏重，LL？RR?
关键看高度差来自哪颗树，先从 g 开始分析，最高的那棵树如果在左侧就是 L，再往下到 p，最高的那棵树在左侧也是 L，那么就是 LL。

具体实现的 code 写在 AVL Tree.ts

## 删除节点后带来的失衡问题

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0de5266e7ff14b0c89e6841bea5448fd~tplv-k3u1fbpfcp-watermark.image?)

如果是这种情况：
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/76ad03a120164b77a78aceececd7e006~tplv-k3u1fbpfcp-watermark.image?)

两种旋转应该是对称的，因此不论是 LL，LR，RR，RL 都会产生这种情况。一旦产生高度变化，所有的祖先节点都有可能发生失衡，因此删除的复杂度最差应该是 logN 级别。

失衡是**删除节点之后**产生的现象，因此可以在之前实现 BST 删除的代码之后直接添加相关恢复平衡的代码，而无需重写删除。

## AVL 树的时间复杂度分析

- 查找 O(logN)
- 添加 O(logN)，需要 O(1)复杂度的旋转
- 删除 O(logN)，最坏情况下需要 O(logN)的旋转

```ts
  private _afterAddNode(newNode: AVLTreeNode<Key, Value>) {
    while ((newNode = newNode.parent) !== null) {
      if (this._isBalanced(newNode)) {
        this._updateHeight(newNode);
      } else {
        this._rebalance(newNode);
        // 区别在这里
        break;
      }
    }
  }

  private _afterRemove(newNode: AVLTreeNode<Key, Value>) {
    while ((newNode = newNode.parent) !== null) {
      if (this._isBalanced(newNode)) {
        this._updateHeight(newNode);
      } else {
        this._rebalance(newNode);
      }
    }
  }
```
