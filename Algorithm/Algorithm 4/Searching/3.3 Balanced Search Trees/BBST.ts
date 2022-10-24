class TreeNode<Key, Value> {
  public key: Key;
  public val: Value;
  public left: TreeNode<Key, Value> | null;
  public right: TreeNode<Key, Value> | null;

  constructor(key: Key, val: Value) {
    this.key = key;
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

// AVL TREE
class BBSTTreeNode<Key, Value> extends TreeNode<Key, Value> {
  public parent: BBSTTreeNode<Key, Value> | null;
  public left: BBSTTreeNode<Key, Value> | null;
  public right: BBSTTreeNode<Key, Value> | null;

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

class BBST<Key, Value> {
  protected root: BBSTTreeNode<Key, Value> | null;
  protected _size: number;

  constructor() {
    this._size = 0;
  }

  public size() {
    return this._size;
  }

  private _compare(a, b) {
    return a - b;
  }

  private _getHeight(node: BBSTTreeNode<Key, Value> | null) {
    return node !== null ? node.height : 0;
  }

  private _isBalanced(node: BBSTTreeNode<Key, Value>) {
    var leftHeight = this._getHeight(node.left);
    var rightHeight = this._getHeight(node.right);

    return Math.abs(leftHeight - rightHeight) <= 1;
  }

  private _updateHeight(node: BBSTTreeNode<Key, Value>) {
    var leftHeight = this._getHeight(node.left);
    var rightHeight = this._getHeight(node.right);

    node.height = 1 + Math.max(leftHeight, rightHeight);
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
  protected _rotateLeft(grand: BBSTTreeNode<Key, Value>) {
    const parent = grand.right as BBSTTreeNode<Key, Value>;
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
  protected _rotateRight(grand: BBSTTreeNode<Key, Value>) {
    const parent = grand.left as BBSTTreeNode<Key, Value>;
    const child = parent.right;

    grand.left = child;
    parent.right = grand;

    this._afterRotate(grand, parent, child);
  }

  protected _afterRotate(
    grand: BBSTTreeNode<Key, Value>,
    parent: BBSTTreeNode<Key, Value>,
    child: BBSTTreeNode<Key, Value> | null
  ) {
    // update grand's parent's child
    if (grand.isLeftChild()) {
      (grand.parent as BBSTTreeNode<Key, Value>).left = parent;
    } else if (grand.isRightChild()) {
      (grand.parent as BBSTTreeNode<Key, Value>).right = parent;
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

  private _rebalance(grandparent: BBSTTreeNode<Key, Value>) {
    // 挑出最高的子树
    const parent = grandparent.tallerChild();
    const node = parent.tallerChild();

    if (parent.isLeftChild()) {
      // L
      if (node.isLeftChild()) {
        // LL
        this._rotateRight(grandparent);
      } else {
        // LR
        this._rotateLeft(parent);
        this._rotateRight(grandparent);
      }
    } else {
      // R
      if (node.isLeftChild()) {
        // RL
        this._rotateRight(parent);
        this._rotateLeft(grandparent);
      } else {
        // RR
        this._rotateLeft(grandparent);
      }
    }
  }

  public _afterAddNode(newNode: any) {}
  //   private _afterAddNode(newNode: BBSTTreeNode<Key, Value>) {
  //     // 新添加的节点只会导致父级节点的失衡
  //     while ((newNode = newNode.parent) !== null) {
  //       // 新增节点有可能仍然保持平衡，但是需要更新高度
  //       if (this._isBalanced(newNode)) {
  //         this._updateHeight(newNode);
  //       } else {
  //         this._rebalance(newNode);
  //         break;
  //       }
  //     }
  //   }

  private _afterDelete(newNode: BBSTTreeNode<Key, Value>) {
    // 新添加的节点只会导致父级节点的失衡
    while ((newNode = newNode.parent) !== null) {
      // 新增节点有可能仍然保持平衡，但是需要更新高度
      if (this._isBalanced(newNode)) {
        this._updateHeight(newNode);
      } else {
        this._rebalance(newNode);
      }
    }
  }

  /*
   * @param node: 待删除节点
   */
  private _delete_v2(node: BBSTTreeNode<Key, Value>) {
    if (node == null) {
      return null;
    }

    this._size--;

    if (node.left && node.right) {
      const presuccessor = node.getPresuccessor() as BBSTTreeNode<Key, Value>;
      // 覆盖
      node.val = presuccessor.val;
      node.key = presuccessor.key;
      node = presuccessor;
    }

    const child = node.left ? node.left : node.right;

    if (child !== null) {
      // 度为1
      child.parent = node.parent;
    }

    if (node.isLeftChild()) {
      node.parent.left = child;
    } else if (node.isRightChild()) {
      node.parent.right = child;
    } else {
      // 根节点
      this.root = child;
    }

    this._afterDelete(node);
  }

  public get(key: Key) {
    if (this.root == null) {
      return null;
    }

    let cur: BBSTTreeNode<Key, Value> | null = this.root;

    while (cur != null) {
      const cmp = this._compare(cur.key, key);

      if (cmp > 0) {
        cur = cur.left;
      } else if (cmp < 0) {
        cur = cur.right;
      } else {
        return cur;
      }
    }

    return null;
  }

  public put(key: Key, val: Value) {
    if (this.root == null) {
      this.root = new BBSTTreeNode(key, val, null);
      this._size++;
      this._afterAddNode(this.root);
      return;
    }

    let parent = this.root;
    let cur: BBSTTreeNode<Key, Value> | null = this.root;

    while (cur != null) {
      const cmp = this._compare(cur.key, key);
      parent = cur;

      if (cmp > 0) {
        cur = cur.left;
      } else if (cmp < 0) {
        cur = cur.right;
      } else {
        // 直接更新val
        cur.val = val;
        return;
      }
    }

    const cmp = this._compare(parent.key, key);
    const newNode = new BBSTTreeNode<Key, Value>(key, val, parent);
    // 父节点上添加
    if (cmp > 0) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }

    this._afterAddNode(newNode);
    this._size++;
  }

  public delete(key: Key) {
    const node = this.get(key);
    return this._delete_v2(node);
  }
}

function generateAVLBST() {
  var unique = {};
  var arr = [];
  for (let i = 0; i < 100; i++) {
    const val = Math.round(Math.random() * 100);

    if (!unique[val]) {
      unique[val] = true;
      arr.push(val);
    }
  }

  var bst = new AVLBST<number, number>();
  for (let i = 0; i < arr.length; i++) {
    bst.put(arr[i], i);
  }

  return bst;
}

console.log("generateAVLBST()", generateAVLBST());
