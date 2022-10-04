
// AVL TREE
class AVLTreeNode<Key, Value> extends BSTTreeNode<Key, Value> {
  public parent: AVLTreeNode<Key, Value> | null;
  public left: AVLTreeNode<Key, Value> | null;
  public right: AVLTreeNode<Key, Value> | null;
  public height: number;

  public isLeftChild() {
    return this.parent !== null && this.parent.left === this;
  }

  public isRightChild() {
    return this.parent !== null && this.parent.right === this;
  }

  public tallerChild() {
    const leftHeight = this.left ? this.left.height : 0;
    const rightHeight = this.right ? this.right.height : 0;

    return leftHeight > rightHeight ? this.left : this.right;
  }

  constructor(key, val, parent) {
    super(key, val, parent);
    this.height = 1;
  }
}

class AVLBST<Key, Value> {
  private root: AVLTreeNode<Key, Value> | null;
  private _size: number;

  constructor() {
    this.root = null;
    this._size = 0;
  }

  public size() {
    return this._size;
  }

  private _compare(a, b) {
    return a - b;
  }

  private _getHeight(node: AVLTreeNode<Key, Value>) {
    return node !== null ? node.height : 0;
  }

  private _isBalanced(node: AVLTreeNode<Key, Value>) {
    var leftHeight = this._getHeight(node.left);
    var rightHeight = this._getHeight(node.right);

    return Math.abs(leftHeight - rightHeight) <= 1;
  }

  private _updateHeight(node: AVLTreeNode<Key, Value>) {
    var leftHeight = this._getHeight(node.left);
    var rightHeight = this._getHeight(node.right);

    node.height = 1 + Math.max(leftHeight, rightHeight);
  }

  private _rotateLeft(grand: AVLTreeNode<Key, Value>) {
    const parent = grand.right;
    const child = parent.left;

    grand.right = child;
    this._updateHeight(grand);
    parent.left = grand;
    this._updateHeight(parent);

    // update parent's parent's left or right
    if (grand.isLeftChild()) {
      grand.parent.left = parent;
    } else if (grand.isRightChild()) {
      grand.parent.right = parent;
    } else {
      this.root = parent;
    }

    parent.parent = grand.parent;
    grand.parent = parent;
    if (child !== null) {
      child.parent = grand;
    }
  }

  private _rotateRight(grand: AVLTreeNode<Key, Value>) {
    const parent = grand.left;
    const child = parent.right;

    grand.left = child;
    // change child, update height
    this._updateHeight(grand);

    parent.right = grand;
    // change child, update height
    this._updateHeight(parent);

    // update parent's parent's left or right
    if (grand.isLeftChild()) {
      grand.parent.left = parent;
    } else if (grand.isRightChild()) {
      grand.parent.right = parent;
    } else {
      this.root = parent;
    }

    // update relative node's parent
    parent.parent = grand.parent;
    grand.parent = parent;
    if (child !== null) {
      child.parent = grand;
    }
  }

  private _rebalance(grandparent: AVLTreeNode<Key, Value>) {
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

  private _afterAddNode(newNode: AVLTreeNode<Key, Value>) {
    // 新添加的节点只会导致父级节点的失衡
    while ((newNode = newNode.parent) !== null) {
      // 新增节点有可能仍然保持平衡，但是需要更新高度
      if (this._isBalanced(newNode)) {
        this._updateHeight(newNode);
      } else {
        this._rebalance(newNode);
        break;
      }
    }
  }

  private _afterDelete(newNode: AVLTreeNode<Key, Value>) {
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
  private _delete_v2(node: AVLTreeNode<Key, Value>) {
    if (node == null) {
      return null;
    }

    this._size--;

    if (node.left && node.right) {
      const presuccessor = node.getPresuccessor() as AVLTreeNode<Key,Value>;
      // 覆盖
      node.val = presuccessor.val;
      node.key = presuccessor.key;
      node = presuccessor;
    }

    const child = node.left ? node.left : node.right;
    
    if (child !== null) { // 度为1 
      child.parent = node.parent;
    } 

      if (node.isLeftChild()) {
        node.parent.left = child;
      } else if (node.isRightChild()) {
        node.parent.right = child;
      } else { // 根节点
        this.root = child;
      }

      this._afterDelete(node);
  }

  public get(key: Key) {
    if (this.root == null) {
      return null;
    }

    let cur: AVLTreeNode<Key, Value> | null = this.root;

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
      this.root = new AVLTreeNode(key, val, null);
      this._size++;
      this._afterAddNode(this.root);
      return;
    }

    let parent = this.root;
    let cur: AVLTreeNode<Key, Value> | null = this.root;

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
    const newNode = new AVLTreeNode<Key, Value>(key, val, parent);
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

