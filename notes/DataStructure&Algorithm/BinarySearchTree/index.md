# Blance Binary Search Tree

> 高级的数据结构都是由低级的数据结构演化而成的，今天终于对这句话有所理解。
> 具体代码实现放在 code.ts 中

## Binary Search Tree

## 增删改查

接口定义

```ts
interface IBinarySearchTree<Key, Value> {
  add(key: Key, value: Value): TreeNode<Key, Value>;
  delete(key: Key): TreeNode<Key, Value> | null;
  get(key: Key): TreeNode<Key, Value> | null;
  update(key: Key): TreeNode<Key, Value> | null;
}
```

### comparable

这里在二叉搜索树内部建立一个比较器，用于维护二叉搜索树性质。

```ts
  private _compare(a: Key, b: Key) {
    return a - b;
  }
```

### 左小右大

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/046c9e1abc3947a5bb39e2b611e81e06~tplv-k3u1fbpfcp-watermark.image?)

`add` `get` `update`都是根据这个逻辑进行操作。

### delete

删除相对麻烦一些，一共有三种情况

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c211e542191147c2b65dbfe0d69f6379~tplv-k3u1fbpfcp-watermark.image?)

#### 1. 被删除节点的子节点个数 <= 1

如果有一个子节点，直接让 parent 指向被删除节点的子节点。

> ![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53ab4b6c7d4143dc914fb753c7ec0dd9~tplv-k3u1fbpfcp-watermark.image?)

如果被删除节点是叶子节点，那么直接让 parent 指向 null 即可。

#### 2. 被删除节点的子节点个数 = 2

这种情况稍微麻烦一些，需要找到前驱或者后继节点。前驱节点是左子树`key`最大的节点，后继节点是右子树`key`最小的节点。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af12131111464d3abbef276b7a369387~tplv-k3u1fbpfcp-watermark.image?)

这样处理过后，删除前驱节点所在的空间即可，即删除一个叶子节点，跟上面的逻辑一样。

这里稍微探讨一下为什么可以使用前驱/后继节点，
我们中序遍历一下以 7 为根节点所在的树。

```
[58, 64, 76, 79, 82]
     ^ 前驱节点
```

中序遍历这棵树，前驱节点一定位于根节点的前一个位置，从数组中用 64 取代 76 的位置，之后删除 64，依然能保证数组是有序的，那么用这个数组按照中序遍历的方式生成树，也能保证是一颗二叉搜索树。

## AVL Tree

由于 BST 的特性，如果一直按照从小到大的顺序添加，会退化成链表，这样性能就比较低，最差是 O(n)的级别。
AVL Tree 严格限制左右子树的高度差 < 2，保证了增删改查的效率接近 O(logN)

## 增删改查

## afterAdd

新增节点可能会导致父级节点/祖先节点左右子树的高度差>=2，我们称这种现象为**失衡**。因此在 BST 的基础上，需要向上查找新增节点的所有祖先节点，以保证树的高度平衡。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d6a9bb03d39401aa024f80e3e92bff8~tplv-k3u1fbpfcp-watermark.image?)

由于需要判断判断是否平衡，因此每个节点都需要额外记录当前树的高度。如果遍历过程中发现平衡，就更新高度即可，一旦发现不平衡，就通过一些操作恢复平衡，一共有四种失衡的情况。

### LL

失衡发生在左子树(left)的左子节点(left)上。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f414bfa204a425ebcf7deabaf37c025~tplv-k3u1fbpfcp-watermark.image?)

对 grand 进行右旋可解。

### RR

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca8c7348936947c08c113e895f2a7d11~tplv-k3u1fbpfcp-watermark.image?)

对 grand 进行左旋可解。

### LR

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72a35965610d4fbfbf121d095a14232c~tplv-k3u1fbpfcp-watermark.image?)

### RL

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e267ec2b8204cd0925befd239926025~tplv-k3u1fbpfcp-watermark.image?)

虽然是四种失衡，但是本质上只有左旋和右旋，根据不同的情况进行旋转即可。
**额外需要注意的地方**，遍历到祖先节点发现失衡之后，如何知道是以上四种的哪一种？

仅需要挑出最高的子树，并且判断出子树位于左还是右即可。
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b759d5fd9be4816aa59168be9f8d75e~tplv-k3u1fbpfcp-watermark.image?)

## afterDelete

与`add`有些不同的地方是，删除某个节点之后，可能会导致它的祖先节点全部失衡。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/006b81e03d9e4195a3a8510d233d2b59~tplv-k3u1fbpfcp-watermark.image?)

如图所示，因此在删除之后的调整会与添加有一些差异，差异就在删除需要一直向上查找到根节点，确保所有祖先节点都是平衡的。

## Red Black Tree
