# Trie

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8df3b58f3c574c15af3abb3ea5e23779~tplv-k3u1fbpfcp-watermark.image?)

节点标红色，代表该字母是单词结尾。

Trie 本质上是一颗多叉树，这里采用哈希表存储子节点。

```ts
interface TrieNode<Value> {
  children: Map<string, TrieNode<Value>>;
  isWordEnd: boolean; // 标识单词结尾
  value?: Value; // 如果是一个完整单词节点(isWordEnd = true)，这里存储的是完整的单词
}
```

## 增删改查

### 查询

```ts
class Trie {
  public contains(key: string) {
    return this._node(key) != null;
  }

  public get(key: string) {
    let node = this._node(key);
    return node == null ? null : node.value;
  }

  // 根据字符串获取某个节点
  private _node(key: string) {
    const len = key.length;

    let node = this.root;
    for (let i = 0; i < len; i++) {
      let char = key.charAt(i);

      node = node.getChildren().get(char);

      if (node == null) {
        return null;
      }
    }

    // 看看它是不是一个单词，还是其他单词的前缀
    return node.isWordEnd ? node : null;
  }
}
```

从根节点开始查找每个节点的`children`指针。

如果没找到，返回`null`。

如果找到最后一个节点并且`isWordEnd` = true，那么说明这个单词存在，返回这个节点。遍历的次数就是单词中字母的个数。

### 添加

与查询类似的遍历

发现为`null`，在`children`这个 Map 上新增一个节点

```
Map.put(charater, new TrieNode)
```

如果不为`null`，不做任何操作。

遍历结束，判断遍历结束的节点`isWordEnd`这个属性，如果为`false`，设置成`true`,并且传入`value`。

### 删除

删除指的是删除完整的单词。

考虑单词是否存在，如果存在才删除。

思路是现根据`get`方法获取单词结尾的 node

1. 如果不存在/存在但是`isWordEnd = false`，那么不需要做任何操作

2. 接下来的情况是 存在&`isWordEnd = true`

- 有子节点 set isWordEnd = false
- 无子节点 那么需要删除该节点，就要从上级节点的`children`存储的`hashMap`中删除并且要知道要删除节点在`hashMap`里面对应 key，因此`TrieNode`需要多存储一个`parent`标识父级节点，并且需要存储 node 对应的字母。
