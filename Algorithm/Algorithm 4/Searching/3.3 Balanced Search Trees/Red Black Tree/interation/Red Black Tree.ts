const RED = true;
const BLACK = false;

class RedBlackTreeNode<Key, Value> {
  public key: Key;
  public val: Value;
  public parent: RedBlackTreeNode<Key, Value> | null;
  public left: RedBlackTreeNode<Key, Value> | null;
  public right: RedBlackTreeNode<Key, Value> | null;
  public color: typeof RED | typeof BLACK;

  constructor(
    key: Key,
    val: Value,
    parent: RedBlackTreeNode<Key, Value> | null
  ) {
    this.key = key;
    this.val = val;
    this.left = null;
    this.right = null;
    this.parent = parent;
  }

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
}

class RedBlackTree<Key, Value> {
  private _size: number;
  public root: RedBlackTreeNode<Key, Value> | null;

  constructor() {
    this.root = null;
    this._size = 0;
  }

  public size() {
    return this._size;
  }

  public put(key: Key, val: Value) {
    if (this.root == null) {
      this.root = new RedBlackTreeNode(key, val, null);
      this._size++;
      this._afterAddNode(this.root);
      return;
    }

    let parent = this.root;
    let cur: RedBlackTreeNode<Key, Value> | null = this.root;

    while (cur != null) {
      parent = cur;

      if (cur.key > key) {
        cur = cur.left;
      } else if (cur.key < key) {
        cur = cur.right;
      } else {
        // 直接更新val
        cur.val = val;
        return;
      }
    }

    const newNode = new RedBlackTreeNode<Key, Value>(key, val, parent);

    // 父节点上添加新节点
    if (parent.key > key) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }

    this._afterAddNode(newNode);
    this._size++;
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

  /*
   * 左旋是 parent 位于 grand 右侧， parent需要成为新的最高级节点
   * grand 的右侧是 parent ，parent.left的位置将会变成grand
   * 那么对应就需要取 parent.left的位置的child 作为 grand.right
   *
   **        grand                  parent
   *              \                /
   *             parent   ->     grand
   *             /                 \
   *           child               child
   */

  private _rotateLeft(grand: RedBlackTreeNode<Key, Value>) {
    const parent = grand.right as RedBlackTreeNode<Key, Value>;
    const child = parent.left;

    grand.right = child;
    parent.left = grand;

    this._afterRotate(grand, parent, child);
  }

  /*
   * 右旋是 parent 位于 grand 左侧， parent需要成为新的最高级节点
   *
   *         grand              parent
   *         /                       \
   *     parent           ->         grand
   *        |                        /
   *        child                   child
   */
  protected _rotateRight(grand: RedBlackTreeNode<Key, Value>) {
    const parent = grand.left as RedBlackTreeNode<Key, Value>;
    const child = parent.right;

    grand.left = child;
    parent.right = grand;

    this._afterRotate(grand, parent, child);
  }

  private _afterRotate(
    grand: RedBlackTreeNode<Key, Value>,
    parent: RedBlackTreeNode<Key, Value>,
    child: RedBlackTreeNode<Key, Value> | null
  ) {
    // update grand's parent's child
    if (grand.isLeftChild()) {
      (grand.parent as RedBlackTreeNode<Key, Value>).left = parent;
    } else if (grand.isRightChild()) {
      (grand.parent as RedBlackTreeNode<Key, Value>).right = parent;
    } else {
      // grand == this.root
      this.root = parent;
    }

    // 1. parent 继承 grand的 parent
    // 2. parent 成为 grand parent
    parent.parent = grand.parent;
    grand.parent = parent;

    // child possibly will be null
    if (child !== null) {
      child.parent = grand;
    }
  }

  private _afterAddNode(node: RedBlackTreeNode<Key, Value>) {
    const parent = node.parent;

    // 添加的是根节点(根节点一定是黑色）
    // 或者 上溢到根节点
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
