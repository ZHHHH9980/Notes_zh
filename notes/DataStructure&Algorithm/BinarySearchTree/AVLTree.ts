// >>>>>>> AVL Tree

class AVLTree_Node<Key, Value> {
  public key: Key;
  public val: Value;
  public left: AVLTree_Node<Key, Value> | null;
  public right: AVLTree_Node<Key, Value> | null;
  public parent: AVLTree_Node<Key, Value> | null;
  public height: number;

  constructor(
    key: Key,
    val: Value,
    parent: AVLTree_Node<Key, Value> | null = null
  ) {
    this.key = key;
    this.val = val;
    this.left = null;
    this.right = null;
    this.parent = parent;
    this.height = 1;
  }

  public isLeftChild() {
    return this.parent !== null && this.parent.left === this;
  }

  public isRightChild() {
    return this.parent !== null && this.parent.right === this;
  }

  public isBalance() {
    let leftHeight = this.left === null ? 0 : this.left.height;
    let rightHeight = this.right === null ? 0 : this.right.height;

    return Math.abs(leftHeight - rightHeight) < 2;
  }

  public tallerChild() {
    let leftHeight = this.left === null ? 0 : this.left.height;
    let rightHeight = this.right === null ? 0 : this.right.height;

    return leftHeight > rightHeight ? this.left : this.right;
  }
}

interface IAVLTree<Key, Value> {
  add(key: Key, value: Value): AVLTree_Node<Key, Value>;
  delete(key: Key): AVLTree_Node<Key, Value> | null;
  get(key: Key): AVLTree_Node<Key, Value> | null;
}

class AVLTree<Key extends number | bigint, Value>
  implements IAVLTree<Key, Value>
{
  public root: AVLTree_Node<Key, Value> | null;

  constructor() {
    this._size = 0;
  }

  private _getPresuccessor(node: AVLTree_Node<Key, Value>) {
    let left = node.left as AVLTree_Node<Key, Value>;

    while (left.right !== null) {
      left = left.right;
    }

    return left;
  }

  private _size: number;

  private _compare(a: Key, b: Key) {
    return a - b;
  }

  private _rotateLeft(grand: AVLTree_Node<Key, Value>) {
    const parent = grand.right as AVLTree_Node<Key, Value>;
    const child = parent.left;
    grand.right = child;
    parent.left = grand;
    this._updateHeight(grand);
    this._updateHeight(parent);

    if (grand.isLeftChild()) {
      (grand.parent as AVLTree_Node<Key, Value>).left = child;
    } else if (grand.isRightChild()) {
      (grand.parent as AVLTree_Node<Key, Value>).right = child;
    } else {
      // parent is root
      this.root = parent;
    }

    if (child !== null) {
      child.parent = grand;
    }

    parent.parent = grand.parent;
    grand.parent = parent;
  }

  private _rotateRight(grand: AVLTree_Node<Key, Value>) {
    const parent = grand.left as AVLTree_Node<Key, Value>;
    const child = parent.right;
    grand.left = child;
    parent.right = grand;
    this._updateHeight(grand);
    this._updateHeight(parent);

    if (grand.isLeftChild()) {
      (grand.parent as AVLTree_Node<Key, Value>).left = child;
    } else if (grand.isRightChild()) {
      (grand.parent as AVLTree_Node<Key, Value>).right = child;
    } else {
      // parent is root
      this.root = parent;
    }

    if (child !== null) {
      child.parent = grand;
    }

    parent.parent = grand.parent;
    grand.parent = parent;
  }

  private _updateHeight(node: AVLTree_Node<Key, Value>) {
    let leftHeight = node.left === null ? 0 : node.left.height;
    let rightHeight = node.right === null ? 0 : node.right.height;

    node.height = 1 + Math.max(leftHeight, rightHeight);
  }

  private _rebalance(grand: AVLTree_Node<Key, Value>) {
    const parent = grand.tallerChild() as AVLTree_Node<Key, Value>;
    const node = parent.tallerChild() as AVLTree_Node<Key, Value>;

    if (parent.isLeftChild()) {
      // L
      if (node.isLeftChild()) {
        // LL
        this._rotateRight(grand);
      } else {
        // LR
        this._rotateLeft(parent);
        this._rotateRight(grand);
      }
    } else {
      // R
      if (node.isLeftChild()) {
        // RL
        this._rotateLeft(parent);
        this._rotateRight(grand);
      } else {
        // RR
        this._rotateLeft(grand);
      }
    }
  }

  private _afterAdd(newNode: AVLTree_Node<Key, Value>) {
    let cur: null | AVLTree_Node<Key, Value> = newNode;

    while ((cur = cur.parent) !== null) {
      if (cur.isBalance()) {
        this._updateHeight(cur);
      } else {
        this._rebalance(cur);
        break;
      }
    }
  }

  private _afterDelete(deleteNode: AVLTree_Node<Key, Value>) {
    let cur: null | AVLTree_Node<Key, Value> = deleteNode;

    while ((cur = cur.parent) !== null) {
      if (cur.isBalance()) {
        this._updateHeight(cur);
      } else {
        this._rebalance(cur);
      }
    }
  }

  public get(key: Key) {
    if (this._size === 0) {
      return null;
    }

    let cur = this.root;
    const cmp = this._compare(key, (cur as AVLTree_Node<Key, Value>).key);

    do {
      if (cmp < 0) {
        cur = (cur as AVLTree_Node<Key, Value>).left;
      } else if (cmp > 0) {
        cur = (cur as AVLTree_Node<Key, Value>).right;
      } else {
        return cur;
      }
    } while (cur !== null);

    return null;
  }

  public add(key: Key, value: Value) {
    if (this._size === 0) {
      this._size++;
      this.root = new AVLTree_Node(key, value);
      return this.root;
    }

    let cur = this.root;
    let parent = this.root;
    const cmp = this._compare(key, (cur as AVLTree_Node<Key, Value>).key);

    do {
      parent = cur;
      if (cmp < 0) {
        cur = (cur as AVLTree_Node<Key, Value>).left;
      } else if (cmp > 0) {
        cur = (cur as AVLTree_Node<Key, Value>).right;
      } else {
        (cur as AVLTree_Node<Key, Value>).val = value;
        return cur as AVLTree_Node<Key, Value>;
      }
    } while (cur !== null);

    const newTreeNode = new AVLTree_Node(key, value, parent);

    if (cmp < 0) {
      (parent as AVLTree_Node<Key, Value>).left = newTreeNode;
    } else {
      (parent as AVLTree_Node<Key, Value>).right = newTreeNode;
    }
    this._size++;

    this._afterAdd(newTreeNode);

    return newTreeNode;
  }

  public delete(key: Key) {
    let deleteNode = this.get(key);

    // deleteNode is not exist
    if (deleteNode === null) {
      return null;
    }

    // deleteNode is root
    if (deleteNode === this.root) {
      this._size = 0;
      this.root = null;
      return deleteNode;
    }

    // deleteNode has two children
    if (deleteNode.left !== null && deleteNode.right !== null) {
      const presuccessor = this._getPresuccessor(deleteNode);
      deleteNode.key = presuccessor.key;
      deleteNode.val = presuccessor.val;

      deleteNode = presuccessor;
    }

    // deleteNode 's child less than 2
    let child = deleteNode.left ? deleteNode.left : deleteNode.right;

    if (deleteNode.isLeftChild()) {
      (deleteNode.parent as AVLTree_Node<Key, Value>).left = child;
    } else {
      (deleteNode.parent as AVLTree_Node<Key, Value>).right = child;
    }

    this._size--;

    this._afterDelete(deleteNode);
    return deleteNode;
  }
}
