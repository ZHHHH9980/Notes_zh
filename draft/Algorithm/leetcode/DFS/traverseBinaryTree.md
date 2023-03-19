# traverseBinaryTree

 非递归遍历二叉树

## 前序，中序，后序遍历迭代模板

后序遍历稍微复杂一些，如果要输出当前根节点，需要确认根节点的右子树都已经输出过or不存在右子树才能输出根节点。

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

#### code

```js
var preorderTraversal = function(root) {
    if (!root) {
        return [];
    }

    var stack = [];
    var res = [];
    var cur = root;

    while (cur != null || stack.length) {
        while (cur != null) {
            res.push(cur.val);
            stack.push(cur);
            cur = cur.left;
        }

        cur = stack.pop();
        cur = cur.right;
    }

    return res;
};
```

### 中序遍历

跟前序遍历类似，只是输出的时机得改成出栈之后，因为要先输出所有左子树节点。

#### code

```js
var inorderTraversal = function(root) {
    if (!root) {
        return [];
    }

    var res = [];
    var stack = [];
    var cur = root;

    while (cur != null || stack.length != 0) {

        while(cur != null) {
            stack.push(cur);
            cur = cur.left;
        }

        cur = stack.pop();
        res.push(cur.val);
        // 转向
        cur = cur.right;
    }

    return res;
};
```


### 后序遍历

后序遍历不能像之前一样直接输出根节点的结果,需要判断根节点是不是叶子节点或者根节点的右子树已经遍历完毕才能输出。

1. 右子节点为null

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e121c96f84554c63b4efe5dc38f762e1~tplv-k3u1fbpfcp-watermark.image?)

2. 右子节点不为null

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3638dd39cfba41bc964561e84ca8f716~tplv-k3u1fbpfcp-watermark.image?)

这种情况就不能直接输入根节点55，而是将cur指向cur.right(68)。

3. 右子节点已经遍历过

如何确认右子节点68已经遍历过？
遍历的时候用一个变量记录。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a374ff416f314a55997cedef725a8b4e~tplv-k3u1fbpfcp-watermark.image?)

这样判断是否输出这个根节点需要加个条件：

```js
if (cur.right == null || cur.right == last) {
    result.push(cur.val);
}
```

#### code

```js
var postorderTraversal = function(root) {
    if (!root) {
        return [];
    }

    var stack = [];
    var cur = root;
    var res = [];
    var last = null;

    while(cur != null || stack.length) {
        while (cur != null) {
            stack.push(cur);
            cur = cur.left;
        }
        // cur  = null

        // peek
        cur = stack[stack.length - 1];

        if (cur.right == null || cur.right == last) {
            cur = stack.pop();
            res.push(cur.val);

            // 最后遍历的节点，按照左->右->根，那么这个节点就是右子树的根节点，右子树根节点已经输出了
            // 根节点就可以输出了
            last = cur;

            // 继续出栈
            cur = null;
        } else {
            cur = cur.right;
        }
    }

    return res;
};
```

这里在总结一下为什么需要记录last这个变量，根因还是因为`peek`这个操作，并不会让根节点root直接出栈。

场景：

```
    root
       \
      right

    stack = [root]
```

流程
1. stack 已经让root 压栈
2. cur = stack.peek() -> cur = root
3. 发现cur.right !== null -> cur = right
4. 输出right.val
5. cur = null
6. cur = stack.peek() -> cur = root 此时又回到原点 如果不记录right是否被访问，那么将会死循环