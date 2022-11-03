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
    this.color = RED;
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

  public getPresuccessor() {
    let node = this.left;

    if (!node) {
      return null;
    }

    while (node.right) {
      node = node.right;
    }

    return node;
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

  public get(key: Key) {
    if (this.root == null) {
      return null;
    }

    let cur: RedBlackTreeNode<Key, Value> | null = this.root;

    while (cur != null) {
      if (cur.key > key) {
        cur = cur.left;
      } else if (cur.key < key) {
        cur = cur.right;
      } else {
        return cur;
      }
    }

    return null;
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

    // 找到当前节点要挂载的parent
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

  public delete(key: Key) {
    const node = this.get(key);
    return node && this._delete(node);
  }

  /*
   * @param node: 待删除节点
   */
  private _delete(node: RedBlackTreeNode<Key, Value>) {
    if (node == null) {
      return null;
    }

    this._size--;

    // 度为2，找到前驱节点，覆盖要被删除的节点
    // 这样要被删除的节点就变为度 = 1 或者 = 0
    if (node.left && node.right) {
      const presuccessor = node.getPresuccessor() as RedBlackTreeNode<
        Key,
        Value
      >;

      // 覆盖
      node.val = presuccessor.val;
      node.key = presuccessor.key;
      // 将删除前驱节点
      node = presuccessor;
    }

    const child = node.left ? node.left : node.right;

    if (child !== null) {
      // node是度为1的节点
      // 更改parent指针
      child.parent = node.parent;

      if (node.parent === null) {
        // node 是根节点，但不是叶子节点
        this.root = child;
      } else if (node == node.parent.left) {
        node.parent.left = child;
      } else if (node === node.parent.right) {
        node.parent.right = child;
      }

      this._afterDelete(node, child);
    } else if (node.parent === null) {
      // node是度为0的叶子节点，也是根节点
      this.root = null;

      this._afterDelete(node, null);
    } else {
      // node是度为0的叶子节点，不是根节点
      if (node == node.parent.left) {
        node.parent.left = null;
      } else if (node === node.parent.right) {
        node.parent.right = null;
      }

      this._afterDelete(node, null);
    }
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

  // @param node 添加的新节点
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

  private _afterDelete(deleteNode, replacement) {
    // 删除的节点是红色
    if (this._isRed(deleteNode)) {
      return;
    }

    // 删除的节点是黑色
    // 用于取代的节点是红色
    if (this._isRed(replacement)) {
      this._black(replacement);
      return;
    }

    let parent = deleteNode.parent;

    // 删除的是根节点（边界情况）
    if (parent == null) {
      return;
    }

    // 删除的是黑色叶子节点
    // 两种情况【这里要严谨！】
    // 1. parent -(left)-> child -> null =>  parent -(left)-> null 的删除方式
    // 2. parent 下溢进入这里的情况，并没有真正删除
    // isLeftChild => parent.left !== null && this === parent.left
    const left = parent.left == null || parent.isLeftChild();

    let sibling = left ? parent.right : parent.left;
    if (left) {
      // 被删除节点位于左侧，兄弟节点位于右侧
    } else {
      // 被删除节点位于右侧，兄弟节点位于左侧

      if (this._isRed(sibling)) {
        // 兄弟节点为红色，转成黑色
        this._black(sibling);
        this._red(parent);
        this._rotateRight(parent);
        // 旋转后更换兄弟
        sibling = parent.left;
      }

      // 处理兄弟节点为黑色的情况
      if (this._isBlack(sibling.left) && this._isBlack(sibling.right)) {
        // 兄弟节点没有一个红色子节点，兄弟节点染红，父节点需要染黑（向下合并）
        const parentIsBlack = this._isBlack(parent);
        this._black(parent);
        this._red(sibling);
        // 原来的节点被删除，父节点成为新的黑色叶子节点，也会发生下溢
        if (parentIsBlack) {
          this._afterDelete(parent, null);
        }
      } else {
        // 「处理兄弟节点为黑色，并且至少有一个红色子节点的情况」

        // 兄弟节点至少有一个红色子节点，向兄弟节点借元素
        if (this._isBlack(sibling.left)) {
          // 兄弟节点左边是黑色，先旋转兄弟节点
          this._rotateLeft(sibling);
          // 需要更新新的兄弟节点
          sibling = parent.left;
        }

        // 借上去的兄弟节点成为了中心节点，那么要继承parent的颜色
        sibling.color = parent.color;
        this._black(sibling.left);
        this._black(parent);
        // 右旋后就会让被删除的节点借到parent节点
        this._rotateRight(parent);
      }
    }
  }
}
