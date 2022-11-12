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

interface IBinarySearchTree<Key, Value> {
  add(key: Key, value: Value): TreeNode<Key, Value>;
  delete(key: Key): TreeNode<Key, Value> | null;
  get(key: Key): TreeNode<Key, Value> | null;
}

type Comparable<Key> = (a: Key, b: Key) => number;

class BinarySearchTree<Key extends number | bigint, Value>
  implements IBinarySearchTree<Key, Value>
{
  private _size: number;

  private _compare(a: Key, b: Key) {
    return a - b;
  }

  public add(key: Key, value: Value) {
    return null;
  }

  public delete(key: Key) {
    return null;
  }

  public get(key: Key) {
    return null;
  }
}
