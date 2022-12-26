# 红黑树

> 目标：根据文字描述产生总体认识。

重学主要是因为学过了 AVL 树，并且对 B 树有所了解，再次学习又有新的感受。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78762ae27e0b4e2cbaa8a4ce2b17f48a~tplv-k3u1fbpfcp-watermark.image?)

红黑树跟最有拥有三个键值的 B 树（四阶 B 树）具有等价性，黑色节点跟子节点(RED)融合在一起，形成一个 B 树节点。
注意：具有三个 key 的 B 树节点，等价到红黑树上，就是一个黑色节点与两个红色子节点；具有两个 key 的 B 树节点，等价于一个黑色节点与一个红色节点。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45cc0ade0bb34b119a035cf26350d0b0~tplv-k3u1fbpfcp-watermark.image?)

### 红色存在的意义

红色的存在就是为了与**相邻的黑色节点**相结合，完美的表示一个 B 树节点。

其他比较重要的性质

- 根节点一定是黑色
- 新增节点是红色
- null 空节点是黑色
- 不能同时存在两个相邻的红色节点

## 添加

### 添加的所有情况

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e2b2def3cd94318be94118c003a22e0~tplv-k3u1fbpfcp-watermark.image?)

1. parent = BLACK

   **由于新增节点都是红色节点**，如果父节点为黑色，那么红黑节点相融合，就不需要任何操作。

2. parent = RED

   新增的节点是红色，如果新增节点的 parent 节点也是红色，从 B 树角度出发，说明 parent 已经融合成了一个 B 树节点，那么新增的节点已经溢出，需要重新平衡。

   1. 叔叔节点不是红色

      - LL
      - RR
      - LR
      - RL

   2. 叔叔节点是红色

### 2.1 叔叔节点不是红色

叔叔节点指的是父节点的另外一个兄弟（同级）节点，比如 50 的叔叔节点是 null，也就是黑色节点。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f3e02a5742745a9bb3e8877d66d13a1~tplv-k3u1fbpfcp-watermark.image?)

#### LL/RR

这里有点像 AVL 树中的 LL/RR，LL 指的是两个相连的红色节点位于左子节点和左子节点的左子节点。

新增节点命名为 newNode

LL: 右旋 newNode.parent.parent

RR: 左旋 newNode.parent.parent

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0decba9258354df9b118949bf5ba1b66~tplv-k3u1fbpfcp-watermark.image?)
（图中 灰色节点别管，只是示意这里可以添加）

以左旋为例，新的根节点会变成黑色，发生旋转实际上是**一个链表**。经过旋转后变成一颗相对平衡的子树，从 B 树角度上说是一个含有 3 个 key 的 B 树节点。

#### LR/RL

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c28e068e53d401aaddc9cd827c06242~tplv-k3u1fbpfcp-watermark.image?)

与 AVL 树类似，需要旋转两次

LR：先左旋 newNode.parent 之后右旋 newNode.parent.parent

RL：先右旋 newNode.parent 之后左旋 newNode.parent.parent

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0201a4fdf5f54dafaa3f68e2b77725fc~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a3ccb8ef1c704f22a6899e8524a2930e~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d9c42d0576c42b48b945f76111a31ac~tplv-k3u1fbpfcp-watermark.image?)

### 2.2 叔叔节点是红色

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3017a28c2caa4f7f9fc9df121b566d0d~tplv-k3u1fbpfcp-watermark.image?)

#### LL/RR

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2ca204bd46346608063270fd94e95e3~tplv-k3u1fbpfcp-watermark.image?)

#### 等价于 B 树的上溢

对于叔叔节点是红色的情况，从 B 树角度上来看是产生了一个拥有 4 个 key 的节点（上溢），需要分裂成两个黑色根节点，并且将原来的中心节点向上合并。中心节点向上合并后需要染成红色（新添加）节点。

**这种情况只需要染色，不需要旋转。**
注意这里有个细节，向上合并的节点会变红，上溢之后会导致新的红黑失衡的情况。向上递归处理即可。

#### LR/RL

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cbf41fe3a5b04b7582f1b8b8264548df~tplv-k3u1fbpfcp-watermark.image?)

也是类似，只需要染色，注意，如果上溢到根节点，就直接将根节点染黑即可。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/90c7ef3d253e4bee93a55d9c2d368a0b~tplv-k3u1fbpfcp-watermark.image?)
比如这种情况，55 上溢，38，和 55 右侧节点变黑，55 上溢变红，再将 55 染黑即可（因为是根节点）。并不破坏性质。

流程图：
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13c5740317d645ecadeba47ceba3f5ab~tplv-k3u1fbpfcp-watermark.image?)

## 删除

> 需要特别注意的点是，最终删除的节点一定是**叶子节点**！
> 因为，如果删除的不是叶子节点，也会用前驱/后继节点替换当前要删除的非叶子节点，那么最终删除的还是前驱/后继节点。

### 删除叶子节点

1.删除 RED 节点

删除红色节点并不影响红黑树结构，直接删除即可。

2.删除 BLACK 节点

1.  拥有两个 RED 节点的黑色节点
2.  拥有一个 RED 节点的黑色节点
3.  黑色叶子节点

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8437f187d42946259b71989f7e58a088~tplv-k3u1fbpfcp-watermark.image?)

### 2.1 删除拥有两个 RED 节点的黑色节点

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a54dae6df264e99b2f112e3260102d2~tplv-k3u1fbpfcp-watermark.image?)

这里一开始也没想明白，后来画了图就懂了。
最终还是会走到判断删除节点为红色的情况下的逻辑，因为覆盖删除的逻辑不会出现这种情况。

### 2.2 删除拥有一个 RED 节点的黑色节点

用子节点（RED）替代要删除的黑色节点，并且将 RED 节点染黑即可维持红黑树性质。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3076a3853bb348169280c35ca0c20be0~tplv-k3u1fbpfcp-watermark.image?)

replacement 是替代的红色子节点

black(replacement) 染黑即可维持性质

### 2.3 删除黑色叶子节点(最复杂情况)

#### 2.3.1 删除黑色叶子节点 - 兄弟节点为黑色

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/782c61a480d44320b65615a060f1da04~tplv-k3u1fbpfcp-watermark.image?)

下溢指的是拥有两个 key 的 B 树节点，应该拥有 3 个 children，但删除过后仅剩两个。
这时候就要从同一层的兄弟节点中去“借”一个节点以保证树的平衡。

<br/>

#### 2.3.1.1 黑色兄弟节点至少有一个红色子节点

1.考虑红色节点的位置，进行旋转。

2.旋转后的中心节点继承 deleteNode.parent 的颜色。

3.中心节点的左右节点染黑色。

兄弟节点至少有一个红色子节点的情况有以下三种：
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a9ce78637e6482c8ff906ae6f391754~tplv-k3u1fbpfcp-watermark.image?)

其中情况 2、3 是一样的，那么对于情况 1 ：
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/42abb353a4044b0cb87f5ccc0da4e6c4~tplv-k3u1fbpfcp-watermark.image?)
左旋一波 sibling，就可以三种情况统一了。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fbdf986bdfcd48c88de5d9ec43caf9d7~tplv-k3u1fbpfcp-watermark.image?)
之后右旋 parent，sibling 变成中心节点，继承 parent 颜色，左右节点容染黑。

<br/>

#### 2.3.1.2 黑色兄弟节点没有红色子节点

这种情况就没有办法从同级的节点中“借”一个节点维护红黑树性质。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/690351f8628548b28094b49417b56c62~tplv-k3u1fbpfcp-watermark.image?)

将黑色兄弟染成红色，deleteNode.parent 染黑。

如果 parent.color = BLACK
那么 parent 替代了原来被删除节点的位置**与被染红的兄弟节点形成新的节点**，相当于也被删除，同样存在叶子节点缺少导致下溢的问题，那么再递归处理 parent 即可。

#### 2.3.2 删除黑色叶子节点 - 兄弟节点为红色

对于兄弟是红色节点的情况，这里举个实例：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/383e7c2a18154906aeb4cfc617b19a1a~tplv-k3u1fbpfcp-watermark.image?)

我们对 80 进行右旋，这样就让 76 成为自己的兄弟节点，既然产生了黑色的兄弟节点，那么就又回到了「黑色兄弟」节点的相关逻辑。

**那么在实际代码里这里应该最先处理**

## 时间复杂度

### 红黑树

- 搜索 O(logN)
- 添加 O(logN) O(1)级别旋转操作
- 删除 O(logN) O(1)级别旋转操作

平衡标准比较宽松，最长路径不会超过最短路径两倍

### AVL 树

- 搜索 O(logN)
- 添加 O(logN) O(1)级别旋转操作
- 删除 O(logN) 最差需要 O(logN)级别旋转操作

平衡标准比较严格，左右子树高度差不超过 1

搜索次数远远大于插入和删除，选择 AVL 树；搜索、插入、删除次数差不多，选择红黑树。

### other

[在线生成红黑树](https://www.wxqsearch.cn/demo/rbtree)
