# description with code

## 删除

流程判断图
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/99c00e5f2adf4a3995e04c14a424585e~tplv-k3u1fbpfcp-watermark.image?)

### 处理兄弟节点为黑色，并且至少有一个红色子节点的情况

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85deaeb366d346498fb5634dc738f5ce~tplv-k3u1fbpfcp-watermark.image?)

```js
class RBTree {
  // ...
  // BST 删除节点后会调用这个方法，将删除节点和取代节点传入
  afterDelete(deleteNode, replacement) {
    // 删除的节点是红色
    if (isRed(deleteNode)) {
      return;
    }

    // 删除的节点是黑色
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

      if (isRed(sibling)) {
        // 兄弟节点为红色，转成黑色
        black(sibling);
        red(parent);
        rotateRight(parent);
        // 旋转后更换兄弟
        sibling = parent.left;
      }

      // 处理兄弟节点为黑色的情况
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
        // 兄弟节点至少有一个红色子节点，向兄弟节点借元素
        if (isBlack(sibling.left)) {
          // 兄弟节点左边是黑色，先旋转兄弟节点
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
