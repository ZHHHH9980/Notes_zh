# Balanced Search Trees

## 1 Red Black Tree

> 一开始看红黑树是震惊的，一堆奇奇怪怪的概念，尤其是难以理解所谓的”黑色完美平衡“，看的还是英文版，非常非常吃力，后来没办法了，为了理解算法本身看回了之前买的中文版，花了两个周末的时间勉强理解了一些概念。

### 2-3 Tree

2-3 树允许一个节点上存在 1~2 个 key，这点跟二叉查找树不同，神奇的是它能够达到完美平衡（树的高度一致）
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e7f4c2715ea481cb6f2c1293ff3a4d9~tplv-k3u1fbpfcp-watermark.image?)

2-node 指的是含有一个键值两个分支的节点，3-node 指的是含有两个键值三个分支的节点。
以此类推，4-node 是含有三个键值，四个分支的节点，这种节点一旦产生，需要变换一下，否则就不能叫 2-3 树了。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26d6b7e522594832887a593d590bbe44~tplv-k3u1fbpfcp-watermark.image?)

这种变换是有目的性的，它保证了树的高度均匀增长，而不是退化成链表！
书上还用一幅图证明了 4-node 变换并不会影响树的平衡性！

即使一直变换，树的整体平衡都不会被破坏！

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bfca98d6764e477da5213aa5d668471d~tplv-k3u1fbpfcp-watermark.image?)

2-3Tree 从理论上是可以实现完美平衡，但是这种数据结构要考虑的情况非常多（插入节点是 2-node 还是 3-node，插入的父节点是 2-node 还是 3-node 等等） 3-node 破坏了二叉树原本的数据结构，需要维护新的数据结构是很麻烦的，为了不破坏原有的数据结构，因此将 2-3tree 的思想转移到了红黑树上，用红色链接代表 3-node 节点的存在。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ffa175638ecf43e8bb5160a789960e3e~tplv-k3u1fbpfcp-watermark.image?)

### Red Black Tree

红黑树的定义：

- 红色链接均为左连接；
- 没有一个节点可以连接两个红色链接；
- 树是”黑色完美平衡”的，任意空链接到跟节点上的黑链接数量相同；

比如上面那副图，less than a 的空链接到根节点的路径是 3，greater than b 的空链接到根节点的路径是 2，但是前者路径中存在一条红色链接，因此黑链接的数量是相同的， 也就达到了“黑色完美平衡“。

一一对应：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/867d0a76c0304369a0f59f48dcd6e6ab~tplv-k3u1fbpfcp-watermark.image?)

再次证明红黑树跟 23 树的关系，因此红黑树的红色链接也可以理解成就是 23 树种的 3 节点。在红黑树是用红色链接相连的两个节点，23 树中是一个节点，本质上**并不会破坏整个树的平衡，以及空链接到根节点的路径 h**

红黑树有三个关键操作

- 左旋
- 右旋
- 交换颜色

> 最奇怪的是右旋，刚开始看的时候还以为自己的英文有问题，理解错了，明明红色链接都只能在左侧，为啥要有右旋这种莫名其妙的操作？？

1. 左旋的存在性不必多说，将右侧的红链接通过旋转转到左侧。
2. 交换颜色也很好理解，本质上还是这张图：
   ![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26d6b7e522594832887a593d590bbe44~tplv-k3u1fbpfcp-watermark.image?)

[A = E = S] , = 为红色链接，对于 23 树，不能存在 4 节点，需要分割，而对于红黑树的等价性质是一个节点不能存在两个红色链接，因此需要交换颜色，让父节点变成红色。

> 这里一开始也让人困惑，为啥让父节点变成红色？

因为分割之后，会产生新的父节点，上升到 2 节点中，会让 2 节点->3 节点，3 节点是通过红色链接相连的！

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2bf6e951b604c478a3975dd63b426e1~tplv-k3u1fbpfcp-watermark.image?)

### 交换颜色的操作

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9db04fd5b8a84f19b767983ffacaf396~tplv-k3u1fbpfcp-watermark.image?)

3. 右旋的存在意义是为了让红色节点以及它的左子节点也为红色的情况下，转换成上面这幅图交换颜色前的情况，也就是一个节点上存在两个红色链接（产生一个临时的 4 节点！）。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/227fe238630840cba5c7da094204cdde~tplv-k3u1fbpfcp-watermark.image?)

这张图有两个含义：

1. 诠释了右旋转的存在意义，为了产生临时 4 节点，从而产生新的平衡树。
2. 新加入的节点都是红色的，我们应该**自底向上**去操作这颗新的树（解释了后面递归的代码顺序）
   - 即先判断是否需要左旋，再判断是否需要右旋，再判断是否需要交换颜色（产生新的临时 4 节点，分割成新的平衡树）

### code

之前提到的红色链接，我们将其放在节点上体现，节点跟父节点之间是红色链接，那么节点的值为 RED，以此表示红色链接。另外，根节点永远是黑色，新增的子节点是用红色链接相连。

```typescript
const RED = true;
const BLACK = false;
type Color = RED | BLACK;

class TreeNode<Key, Value> {
  public key: Key;
  public val: Value;
  public N: number;
  public left: TreeNode<Key, Value>;
  public right: TreeNode<Key, Value>;
  public color: Color;

  constructor(key: Key, val: Value, color: Color) {
    this.key = key;
    this.val = val;
    this.N = 1;
    this.left = null;
    this.right = null;
    this.color = color;
  }
}
```

---

```ts
class RedBlackBST<Key, Value> {
  private root: TreeNode<Key, Value>;

  constructor() {
    this.root = null;
  }

  private _isRed(h: TreeNode:<Key, Value>) {}
  private _rotateLeft(h: TreeNode:<Key, Value>) {}
  private _rotateRight(h: TreeNode:<Key, Value>) {}
  private _flipColors(h: TreeNode:<Key, Value>) {}

  private _put(h: TreeNode<Key, Value>, key: Key, val: Value) {
    if (h == null) {
      return new TreeNode(key, val);
    }

    if (key < h.key) {
      h.left = this._put(h.left, key, val);
    } else if (key > h.key) {
      h.right = this._put(h.right, key, val);
    } else {
      h.val = val;
    }

    if(this._isRed(h.right) && !this._isRed(h.left)) {
        h = this._rotateLeft(h);
    }

    if(this._isRed(h.left) && this._isRed(h.left.left)) {
        h = this._rotateRight(h);
    }

    if(this._isRed(h.left) && this._isRed(h.right)) {
        h = this._flipColors(h);
    }

    h.N = this.size(h.left) + this.size(h.right) + 1;
    return h;
  }

  public put(key: Key, val: Value) {
    this.root = this._put(this.root, key, val);
    this.root.color = BLACK;
  }
}
```

旋转等核心实现
这里放一个左旋的过程图：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f64a6a89338445e886c4dd97df96e22e~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/afeea0f34160440ba754486c0e1b71d0~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cfae1bd52ddd468593d850f3ddee8cda~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/01481bc1a8f54863b48c08def3569d5d~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/965915f8f20b44a88a5d504f31aa080d~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c069104b31846eca92ee592cac95a94~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8ef356daf5b04c7a885adc6b727c25da~tplv-k3u1fbpfcp-watermark.image?)

> 为什么以这种方式可以交换两个节点的颜色？

主要原因还是因为父子节点的位置互换了，返回了新的父节点，旧的父节点成为了子节点，而**红色链接/红色节点一定向更重的地方倾斜**，观察图，具有红色的节点都是含有两个圆角三角形的，这是为了保证完美黑色平衡！

左旋写完以后右旋其实非常简单，只需要把 left<->right 互相交换就行。

而交换颜色的实现也很简单，只需要左右子节点变黑，自身变红即可。

```ts
class RedBlackBST<Key, Value> {

  private _isRed(h: TreeNode:<Key, Value>) {
    return h.color === RED;
  }

  private _rotateLeft(h: TreeNode:<Key, Value>) {
    const x = h.right;
    h.right = x.left;
    x.left = h;
    x.color = h.color;
    h.color = RED;
    x.N = h.N;
    h.N = 1 + this.size(h.left) + this.size(h.right);

    return x;
  }

  private _rotateRight(h: TreeNode:<Key, Value>) {
    const x = h.left;
    h.left = x.right;
    x.right = h;
    x.color = h.color;
    h.color = RED;
    x.N = h.N;
    h.N = 1 + this.size(h.left) + this.size(h.right);

    return x;
  }

  private _flipColors(h: TreeNode:<Key, Value>) {
    h.color = RED
    h.left.color = BLACK;
    h.right.color = BLACK;
  }

  // ...
}

```
