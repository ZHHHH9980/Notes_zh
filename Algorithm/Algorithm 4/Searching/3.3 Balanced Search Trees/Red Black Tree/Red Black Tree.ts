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

  public sibling() {
    return this === this.parent?.left
      ? (this.parent as RedBlackTreeNode<Key, Value>).right
      : (this.parent as RedBlackTreeNode<Key, Value>).left;
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

  private _isBlack(node: RedBlackTreeNode<Key, Value> | null) {
    return node === null || node.color === BLACK;
  }

  private _isRed(node: RedBlackTreeNode<Key, Value> | null) {
    return node && node.color === RED;
  }

  private _black(node: RedBlackTreeNode<Key, Value> | null) {
    if (node) node.color = BLACK;
    return node;
  }

  private _red(node: RedBlackTreeNode<Key, Value>) {
    if (node) node.color = RED;
    return node;
  }

  private _afterAddNode(node: RedBlackTreeNode<Key, Value>) {
    const parent = node.parent;

    // 添加的是根节点(根节点一定是黑色）
    if (parent === null) {
      this._black(node);
      return;
    }

    // 父节点是黑色， 直接返回
    if (this._isBlack(parent)) {
      return;
    }

    // 接下来是父节点为红色节点的情况

    // 叔叔节点
    const uncle = parent.sibling();
    // 祖父节点
    const grandparent = parent.parent as RedBlackTreeNode<Key, Value>;

    // 叔叔节点是红色
    if (this._isRed(uncle)) {
      this._black(parent);
      this._black(uncle);
      // 染红组父节点，
      // 在B树中相当于向上添加的新节点
      // 在红黑树中可能会产生双红相连的现象。
      this._red(grandparent);
      this._afterAddNode(grandparent);
      return;
    }

    // 叔叔节点不是红色
    if (parent.isLeftChild()) {
      // L
      if (node.isLeftChild()) {
        // LL
        this._black(parent);
        this._red(grandparent);
        this._rotateRight(grandparent);
      } else {
        // LR
        this._red(grandparent);
        this._black(node);
        this._rotateLeft(parent);
        this._rotateRight(grandparent);
      }
    } else {
      // R
      if (node.isLeftChild()) {
        // RL
        this._red(grandparent);
        this._black(node);
        this._rotateRight(parent);
        this._rotateLeft(grandparent);
      } else {
        // RR
        this._black(parent);
        this._red(grandparent);
        this._rotateLeft(grandparent);
      }
    }
  }
}
