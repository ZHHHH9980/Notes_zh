# description with code

## 添加

得先写出添加的逻辑，再处理添加后导致的失衡。

流程图：
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13c5740317d645ecadeba47ceba3f5ab~tplv-k3u1fbpfcp-watermark.image?)

```ts
class RedBlackTree<Key, Value> {
  private _size: number;

  public put(key: Key, value: Value) {
    this._size++;

    if (this.root == null) {
      this.root = new RedBlackTreeNode(key, value);
      return;
    }

    let parent = this.root;
    let cur = this.root;

    while (cur != null) {
      parent = cur;
      if (cur.key > key) {
        cur = cur.left;
      } else if (cur.key < key) {
        cur = cur.right;
      } else {
        cur.value = value;
        return;
      }
    }

    const newNode = new RedBlackTreeNode(key, value, parent);

    if (parent.key > key) {
      parent.left = newNode;
    } else if (parent.key < key) {
      parent.right = newNode;
    }

    this._afterput(newNode);
  }

  private _afterput(newNode: RedBlackTreeNode<Key, Value>) {
    const parent = newNode.parent;

    if (this._isBlack(parent)) {
      return;
    }

    // parent节点是红色
    const uncle = parent.sibling();
    const grandparent = parent.parent;

    // 叔叔节点是红色
    if (this._isRed(uncle)) {
      this._red(grandparent);
      this._black(parent);
      this._black(uncle);
      this._afterput(grandparent);
    }

    // 叔叔节点是黑色
    if (parent.isLeftChild()) {
      // L
      if (newNode.isLeftChild()) {
        // LL
        this._black(parent);
        this._red(grandparent);
        this._rotateRight(grandparent);
      } else {
        // LR
        this._black(newNode);
        this._red(grandparent);
        this._rotateLeft(parent);
        this._rotateRight(grandparent);
      }
    } else {
      // R
      if (newNode.isLeftChild()) {
        // RL
        this._black(newNode);
        this._red(grandparent);
        this._rotateRight(parent);
        this._rotateLeft(grandparent);
      } else {
        // RR
        this._black(parent);
        this._red(grandparent);
        this.rotateLeft(grandparent);
      }
    }
  }
}
```

## 删除

流程判断图
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/99c00e5f2adf4a3995e04c14a424585e~tplv-k3u1fbpfcp-watermark.image?)

### 「处理兄弟节点为黑色，并且至少有一个红色子节点的情况」

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85deaeb366d346498fb5634dc738f5ce~tplv-k3u1fbpfcp-watermark.image?)
这里有三种情况：

1. 红色子节点在黑色兄弟节点右侧
2. 红色子节点在黑色兄弟节点左侧
3. 黑色兄弟有两个红色子节点

对于情况 1，我们需要先**左旋兄弟节点**，这样红色节点都位于黑色兄弟节点左侧，以保证三种情况可以统一处理。

```ts
class RBTree {
  // ...
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

      this._afterDelete(node, null);
      return;
    }

    // 有两个子节点
    if (node.left && node.right) {
      const presuccessor = node.getPresuccessor();
      // 覆盖
      node.val = presuccessor.val;
      node.key = presuccessor.key;

      // 前驱节点一定是度为1/0的节点
      if (presuccessor.isLeftChild()) {
        presuccessor.parent.left = presuccessor.left;
      } else if (presuccessor.isRightChild()) {
        presuccessor.parent.right = presuccessor.left;
      }

      // 更新parent
      if (presuccessor.left !== null) {
        presuccessor.left.parent = presuccessor.parent;
      }

      this._afterDelete(node, presuccessor);
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

    // 更新parent
    child.parent = node.parent;

    this._afterDelete(node, null);
  }

  // 删除节点后会调用这个方法，将删除节点和取代节点传入
  private _afterDelete(deleteNode, replacement) {
    /*   删除的节点是红色  */
    if (isRed(deleteNode)) {
      return;
    }

    /* 删除的节点是黑色  */
    // 用于取代的节点是红色
    if (isRed(replacement)) {
      Black(replacement);
      return;
    }

    let parent = deleteNode.parent;

    // 删除的是根节点（边界情况）
    if (parent == null) {
      return;
    }

    // 删除的是黑色叶子节点
    // 判断被删除的node是左还是右
    // 两种情况【这里要严谨！】
    // 1. parent 下溢进入这里的情况，并没有真正删除,检查它是左树还是右树
    // 2. parent -(left)-> child -> null =>  parent -(left)-> null 的删除方式
    // isLeftChild => parent.left !== null && this === parent.left
    const left = parent.left == null || node.isLeftChild();

    let sibling = left ? parent.right : parent.left;
    if (left) {
      // 被删除节点位于左侧，兄弟节点位于右侧 (对称)
    } else {
      // 被删除节点位于右侧，兄弟节点位于左侧 (对称)

      /* 处理兄弟节点为红色的情况 */
      if (isRed(sibling)) {
        // 兄弟节点为红色，转成黑色
        black(sibling);
        red(parent);
        rotateRight(parent);
        // 旋转后更换兄弟
        sibling = parent.left;
      }

      /* 处理兄弟节点为黑色的情况 */
      if (isBlack(sibling.left) && isBlack(sibling.right)) {
        // 兄弟节点没有一个红色子节点，兄弟节点染红，父节点需要染黑（向下合并）
        const parentIsBlack = isBlack(parent);
        black(parent);
        red(sibling);

        // 原来的节点被删除，父节点成为新的黑色叶子节点，也会发生下溢
        if (parentIsBlack) {
          afterDelete(parent, null);
        }
      } else {
        // 处理兄弟节点为黑色，并且至少有一个红色子节点的情况

        // 兄弟节点至少有一个红色子节点，向兄弟节点借元素
        if (isBlack(sibling.left)) {
          // 兄弟节点左边是黑色，右边是红色，先旋转兄弟节点
          rotateLeft(sibling);
          // 需要更新新的兄弟节点
          sibling = parent.left;
        }

        // 借上去的兄弟节点成为了中心节点，那么要继承parent的颜色
        sibling.color = parent.color;
        black(sibling.left);
        black(parent);
        // 右旋后就会让被删除的节点借到parent节点
        rotateRight(parent);
      }
    }
  }
}
```
