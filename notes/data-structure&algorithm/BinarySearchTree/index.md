# BinarySearchTree

> 高级的数据结构都是由低级的数据结构演化而成的，今天终于对这句话有所理解。
> 具体代码实现放在 code.ts 中

## 增删改查

接口定义

```ts
interface IBinarySearchTree<Key, Value> {
  add(key: Key, value: Value): TreeNode<Key, Value>;
  delete(key: Key): TreeNode<Key, Value> | null;
  get(key: Key): TreeNode<Key, Value> | null;
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

`add`和`get`都是根据这个逻辑进行添加和查找。

### delete

删除相对麻烦一些，一共有三种情况

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c211e542191147c2b65dbfe0d69f6379~tplv-k3u1fbpfcp-watermark.image?)
