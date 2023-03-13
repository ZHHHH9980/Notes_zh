# traverseBinaryTree

 非递归遍历二叉树

## 前序，中序，后续遍历迭代模板

```js
function traverse(root) {
    let cur = root;
    let stack = [];

    while(cur != null || stack.length) {
        // 先遍历所有左子节点
        while (cur != null) {
            // 前序遍历操作位置
            stack.push(cur);
            cur = cur.left;
        }

        // 最左的节点遍历完了，cur = null
        // 如果是后续遍历，这里不能直接出栈，需要判断根节点有没有右子树
        cur = stack.pop();

        // 中序遍历操作位置
        cur = cur.right;
    }
}
```

### 前序遍历

顺序：根->左->右

1. DFS 遍历所有左子节点，每个左子节点同时也是子树的根节点，因此每次遍历都先输出。

```js
let cur = root;

while (cur != null) {
    // 直接输出结果
	results.add(cur.val);
	stack.push(cur);
	cur = cur.left;
}
```

2. 将访问过的左子节点挨个出栈，然后进行转向操作。

```js
if (!stack.empty()) {
	cur = stack.pop();
	// 转向
	cur = cur.right;
}
```