//         BBST (Balance Binary Search Tree)
//        /    \
//    RB Tree  AVL Tree

const RED = true;
const BLACK = false;
class RedBlackTreeNode<Key, Value> extends TreeNode<Key, Value> {
  public parent: RedBlackTreeNode<Key, Value> | null;
  public left: RedBlackTreeNode<Key, Value> | null;
  public right: RedBlackTreeNode<Key, Value> | null;
  public color: typeof RED | typeof BLACK;

  public isLeftChild() {
    return this.parent !== null && this.parent.left === this;
  }

  public isRightChild() {
    return this.parent !== null && this.parent.right === this;
  }

  constructor(key, val, parent) {
    super(key, val);
    this.parent = parent;
  }
}

class RedBlackTree<Key, Value> extends BBST<Key, Value> {
  public root: RedBlackTreeNode<Key, Value> | null;

  constructor() {
    super();
    this.root = null;
  }

  public size() {
    return this._size;
  }

  private _isBlack(node: RedBlackTreeNode<Key, Value>) {
    return node && node.color === BLACK;
  }

  private _black(node: RedBlackTreeNode<Key, Value>) {
    if (node) node.color = BLACK;
  }

  private _afterAddNode(node: RedBlackTreeNode<Key, Value>) {
    const parent = node.parent;

    // 添加的是根节点
    if (parent === null) {
      this._black(node);
      return;
    }

    // if
  }
}
