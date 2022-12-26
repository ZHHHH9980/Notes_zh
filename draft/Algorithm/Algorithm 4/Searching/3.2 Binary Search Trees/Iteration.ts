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

class BSTTreeNode<Key, Value> extends TreeNode<Key, Value> {
  public parent: BSTTreeNode<Key, Value> | null;
  public left: BSTTreeNode<Key, Value> | null;
  public right: BSTTreeNode<Key, Value> | null;

  constructor(key: Key, value: Value, parent: BSTTreeNode<Key, Value> | null) {
    super(key, value);
    this.parent = parent;
  }

  public isLeftChild() {
    return this.parent !== null && this.parent.left === this;
  }

  public isRightChild() {
    return this.parent !== null && this.parent.right === this;
  }

  // 找到左子树最右的节点就是前驱节点
  private _getPresuccessor(node: BSTTreeNode<Key, Value>) {
    while (node !== null && node.right !== null) {
      node = node.right;
    }

    return node;
  }

  // 获取前驱节点
  public getPresuccessor() {
    return this._getPresuccessor(this.left);
  }
}

class BST_Interation<Key, Value> {
  private root: BSTTreeNode<Key, Value> | null;
  private _size: number;

  constructor() {
    this.root = null;
    this._size = 0;
  }

  private _compare(a, b) {
    return a - b;
  }

  public size() {
    return this._size;
  }

  // 自己写的，虽然很多，但是暂时测出什么问题
  private _delete(node: BSTTreeNode<Key, Value>) {
    if (node == null) {
      return null;
    }

    this._size--;

    // 叶子节点
    if (!node.left && !node.right) {
      if (node.isLeftChild()) {
        node.parent.left = null;
      } else if (node.isRightChild()) {
        node.parent.right = null;
      } else {
        // 删除的是根节点
        this.root = null;
      }

      console.log("delete leaf");
      return;
    }

    // 有两个子节点
    if (node.left && node.right) {
      const presuccessor = node.getPresuccessor();
      // 覆盖
      node.val = presuccessor.val;
      node.key = presuccessor.key;

      if (presuccessor.isLeftChild()) {
        presuccessor.parent.left = presuccessor.left;
      } else if (presuccessor.isRightChild()) {
        presuccessor.parent.right = presuccessor.left;
      }

      console.log("delete two");
      return;
    }

    // 只有一个子节点
    const child = node.left ? node.left : node.right;
    if (node.isLeftChild()) {
      node.parent.left = child;
    } else if (node.isRightChild()) {
      node.parent.right = child;
    } else {
      // 删除的是根节点
      this.root = child;
    }
    child.parent = node.parent;

    console.log("delete one");
  }

  /*
   * @param node: 待删除节点
   */
  private _delete_v2(node: BSTTreeNode<Key, Value>) {
    if (node == null) {
      return null;
    }

    this._size--;

    if (node.left && node.right) {
      const presuccessor = node.getPresuccessor();
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
  }

  public delete(key: Key) {
    const node = this.get(key);
    return this._delete_v2(node);
  }

  public get(key: Key) {
    if (this.root == null) {
      return null;
    }

    let cur: BSTTreeNode<Key, Value> | null = this.root;

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
      this.root = new BSTTreeNode(key, val, null);
      this._size++;
      return;
    }

    let parent = this.root;
    let cur: BSTTreeNode<Key, Value> | null = this.root;

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
    // 父节点上添加
    if (cmp > 0) {
      parent.left = new BSTTreeNode(key, val, parent);
    } else {
      parent.right = new BSTTreeNode(key, val, parent);
    }

    this._size++;
  }
}

// 配合 bstCheck.js 使用
function generateBST() {
  var unique = {};
  var arr = [];
  for (let i = 0; i < 100; i++) {
    const val = Math.round(Math.random() * 100);
    if (!unique[val]) {
      unique[val] = true;
      arr.push(val);
    }
  }

  var bst = new BST_Interation<number, number>();

  // 添加随机生成的树
  for (let i = 0; i < arr.length; i++) {
    bst.put(arr[i], i);
  }

  // 概率删除部分key
  Object.keys(unique).forEach((key) => {
    if (Math.random() * 100 > 70) {
      bst.delete(Number(key));
    }
  });

  return bst;
}
