# graph

## 回溯算法与 DFS 的区别

```js
// DFS
function traverse(root) {
  if (root == null) return;

  // 前序遍历
  for (let child of root.children) {
    traverse(root);
  }
  // 后序遍历
}

// backtrack
function backtrack(root) {
  if (root == null) return;

  for (let child of root.children) {
    // 做选择
    backtrack(root);
    // 撤销选择
  }
}
```

前序遍历作用的时机是将要进入一个节点，后序遍历的作用时机是将要离开一个节点。那么回溯中的做选择是类似的，做选择是将要进入一个节点，撤销选择是离开一个节点。他们位于 for 循环不同位置是因为关注的重点不同。**DFS 关注树节点的状态，而回溯关注的是树枝。**

多叉树遍历
![img](https://labuladong.github.io/algo/images/backtracking/4.jpg)

回溯
[![img](https://labuladong.github.io/algo/images/backtracking/5.jpg)](https://labuladong.github.io/algo/images/backtracking/5.jpg)

## 图的遍历

## 摘抄自

https://labuladong.github.io/algo/4/31/105/
