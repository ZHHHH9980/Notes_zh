// 基于红黑树构建哈希表

// Key是一定要具备可比性的，不然没法存在红黑树里面
// 如果Key是自定义类 要存在hashCode和equals这些api

class RedBlackTreeNodeForHashMap<Key, Value> {
  public key: Key;
  public val: Value;
  public parent: RedBlackTreeNodeForHashMap<Key, Value> | null;
  public left: RedBlackTreeNodeForHashMap<Key, Value> | null;
  public right: RedBlackTreeNodeForHashMap<Key, Value> | null;
  public color: typeof RED | typeof BLACK;
  public hash: number;

  constructor(
    key: Key,
    val: Value,
    parent: RedBlackTreeNodeForHashMap<Key, Value> | null
  ) {
    this.key = key;
    this.val = val;
    this.left = null;
    this.right = null;
    this.parent = parent;
    this.color = RED;
    this.hash = this._hashCode();
  }

  private _hashCode() {
    return 0;
  }

  public isLeftChild() {
    return this.parent !== null && this.parent.left === this;
  }

  public isRightChild() {
    return this.parent !== null && this.parent.right === this;
  }

  public sibling() {
    return this === this.parent?.left
      ? (this.parent as RedBlackTreeNodeForHashMap<Key, Value>).right
      : (this.parent as RedBlackTreeNodeForHashMap<Key, Value>).left;
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
class RedBlackTreeForHashMap<Key, Value> {
  protected _isBlack(node: RedBlackTreeNodeForHashMap<Key, Value> | null) {
    return node === null || node.color === BLACK;
  }

  protected _isRed(node: RedBlackTreeNodeForHashMap<Key, Value> | null) {
    return node && node.color === RED;
  }

  protected _black(node: RedBlackTreeNodeForHashMap<Key, Value> | null) {
    if (node) node.color = BLACK;
    return node;
  }

  protected _red(node: RedBlackTreeNodeForHashMap<Key, Value>) {
    if (node) node.color = RED;
    return node;
  }
}

class HashMap<Key, Value> extends RedBlackTreeForHashMap<Key, Value> {
  private _size: number;
  private _table: RedBlackTreeNodeForHashMap<Key, Value>[];

  constructor(defaultSize = 256) {
    super();
    this._table = new Array(defaultSize);
  }

  private _hashcode(key: Key): number {
    return 0;
  }

  // 根据key 生成 hashCode 然后生成对应的索引 （桶的位置）
  private _index(key: Key) {
    if (key == null) {
      return 0;
    }

    let hash = this._hashcode(key);
    hash = hash ^ ((hash >> 16) & (this._table.length - 1));

    return hash;
  }

  /**
   * hash值相同，未必是两个相同的key!
   *
   * @private
   * @param {Key} k1
   * @param {Key} k2
   * @param {number} h1 k1 的 hashCode
   * @param {number} h2 k2 的 hashCode
   * @return {*}
   * @memberof HashMap
   */
  private _compare(k1: Key, k2: Key, h1: number, h2: number) {
    let result = h1 - h2;

    // 1. hash值不同
    if (result !== 0) {
      return result;
    }

    // 2. hash值相等，是同一个key
    if (k1 === k2) {
      return 0;
    }

    // 3. hash值相等，但是不是同一个key
    // 这里涉及到类的比较和内存地址的比较，js写不下去了..
    if (k1 !== null && k2 !== null) {
    }

    // k1 == null && k2 !== null
    // k1 !== null && k2 == null
  }

  private _rotateLeft(grand: RedBlackTreeNodeForHashMap<Key, Value>) {
    const parent = grand.right as RedBlackTreeNodeForHashMap<Key, Value>;
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
  private _rotateRight(grand: RedBlackTreeNodeForHashMap<Key, Value>) {
    const parent = grand.left as RedBlackTreeNodeForHashMap<Key, Value>;
    const child = parent.right;

    grand.left = child;
    parent.right = grand;

    this._afterRotate(grand, parent, child);
  }

  private _afterRotate(
    grand: RedBlackTreeNodeForHashMap<Key, Value>,
    parent: RedBlackTreeNodeForHashMap<Key, Value>,
    child: RedBlackTreeNodeForHashMap<Key, Value> | null
  ) {
    // update grand's parent's child
    if (grand.isLeftChild()) {
      (grand.parent as RedBlackTreeNodeForHashMap<Key, Value>).left = parent;
    } else if (grand.isRightChild()) {
      (grand.parent as RedBlackTreeNodeForHashMap<Key, Value>).right = parent;
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
  private _afterAddNode(node: RedBlackTreeNodeForHashMap<Key, Value>) {
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
    const grandparent = parent.parent as RedBlackTreeNodeForHashMap<Key, Value>;

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

  public size() {
    return this._size;
  }

  public put(key: Key, val: Value) {
    this._size++;
    let index = this._index(key);
    let root = this._table[index];

    // 空桶
    if (root == null) {
      root = new RedBlackTreeNodeForHashMap(key, val, null);
      this._table[index] = root;
      return null;
    }

    let parent = root;
    let cur: RedBlackTreeNodeForHashMap<Key, Value> | null = root;
    let cmp = 0;

    let h1 = this._hashcode(key);

    // 找到当前节点要挂载的parent
    while (cur != null) {
      cmp = this._compare(key, cur.key, h1, cur.hash);
      parent = cur;

      if (cmp > 0) {
        cur = cur.right;
      } else if (cmp < 0) {
        cur = cur.left;
      } else {
        // 直接更新val
        cur.val = val;
        return;
      }
    }

    const newNode = new RedBlackTreeNodeForHashMap<Key, Value>(
      key,
      val,
      parent
    );

    // 父节点上添加新节点
    if (parent.key > key) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }

    this._afterAddNode(newNode);
  }

  /**
   * 之前对于不可比较类型且hashCode相等的情况下 仅比较内存地址是不靠谱的
   *
   * @private
   * @param {RedBlackTreeNodeForHashMap<Key, Value>} node
   * @param {Key} needGetKey
   * @memberof HashMap
   */
  private _get(
    cur: RedBlackTreeNodeForHashMap<Key, Value> | null,
    needGetKey: Key
  ) {
    let needGetHash = needGetKey == null ? 0 : this._hashcode(needGetKey);

    let result = null;

    while (cur !== null) {
      let curKey = cur.key;
      let curHash = cur.hash;

      /* 先比较hash */
      if (needGetHash > curHash) {
        cur = cur.right;
      } else if (needGetHash < curHash) {
        cur = cur.left;
      } else if (needGetKey === curKey) {
        return cur;

        /* key可比较 */
      } else if (typeof needGetKey === "number" && typeof curKey === "number") {
        // 用number类型代表可比较类型
        if (needGetKey > curKey) {
          cur = cur.right;
        } else if (needGetKey < curKey) {
          cur = cur.left;
        } else {
          return cur;
        }

        /* key不可比较, 递归查所有节点 */
      } else if (cur.right !== null) {
        result = this._get(cur.right, needGetKey);
        return result;
      } else if (cur.left !== null) {
        result = this._get(cur.left, needGetKey);
        return result;
      } else {
        return null;
      }

      return null;
    }
  }

  public get(key: Key) {
    const root = this._table[this._index(key)];
    return root === null ? null : this._get(root, key);
  }
}
