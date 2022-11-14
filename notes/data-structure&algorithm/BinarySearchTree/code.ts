class BSTTreeNode<Key, Value> {
  public key: Key;
  public val: Value;
  public left: BSTTreeNode<Key, Value> | null;
  public right: BSTTreeNode<Key, Value> | null;
  public parent: BSTTreeNode<Key, Value> | null;

  constructor(
    key: Key,
    val: Value,
    parent: BSTTreeNode<Key, Value> | null = null
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
}

interface IBinarySearchTree<Key, Value> {
  add(key: Key, value: Value): BSTTreeNode<Key, Value>;
  delete(key: Key): BSTTreeNode<Key, Value> | null;
  get(key: Key): BSTTreeNode<Key, Value> | null;
}

type Comparable<Key> = (a: Key, b: Key) => number;

class BinarySearchTree<Key extends number | bigint, Value>
  implements IBinarySearchTree<Key, Value>
{
  public root: BSTTreeNode<Key, Value> | null;

  private _getPresuccessor(node: BSTTreeNode<Key, Value>) {
    let left = node.left as BSTTreeNode<Key, Value>;

    while (left.right !== null) {
      left = left.right;
    }

    return left;
  }

  private _size: number;

  private _compare(a: Key, b: Key) {
    return a - b;
  }

  public get(key: Key) {
    if (this._size === 0) {
      return null;
    }

    let cur = this.root;
    const cmp = this._compare(key, (cur as BSTTreeNode<Key, Value>).key);

    do {
      if (cmp < 0) {
        cur = (cur as BSTTreeNode<Key, Value>).left;
      } else if (cmp > 0) {
        cur = (cur as BSTTreeNode<Key, Value>).right;
      } else {
        return cur;
      }
    } while (cur !== null);

    return null;
  }

  public add(key: Key, value: Value) {
    if (this._size === 0) {
      this._size++;
      this.root = new BSTTreeNode(key, value);
      return this.root;
    }

    let cur = this.root;
    let parent = this.root;
    const cmp = this._compare(key, (cur as BSTTreeNode<Key, Value>).key);

    do {
      parent = cur;
      if (cmp < 0) {
        cur = (cur as BSTTreeNode<Key, Value>).left;
      } else if (cmp > 0) {
        cur = (cur as BSTTreeNode<Key, Value>).right;
      } else {
        (cur as BSTTreeNode<Key, Value>).val = value;
        return cur as BSTTreeNode<Key, Value>;
      }
    } while (cur !== null);

    const newTreeNode = new BSTTreeNode(key, value, parent);

    if (cmp < 0) {
      (parent as BSTTreeNode<Key, Value>).left = newTreeNode;
    } else {
      (parent as BSTTreeNode<Key, Value>).right = newTreeNode;
    }
    this._size++;

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
      (deleteNode.parent as BSTTreeNode<Key, Value>).left = child;
    } else {
      (deleteNode.parent as BSTTreeNode<Key, Value>).right = child;
    }

    this._size--;

    return deleteNode;
  }
}
