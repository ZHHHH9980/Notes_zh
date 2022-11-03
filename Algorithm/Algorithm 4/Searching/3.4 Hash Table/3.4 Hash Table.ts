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

// 基于红黑树构建哈希表
class HashMap<Key, Value> {
  private size: number;
  private table: RedBlackTreeNode<Key, Value>[];
}
