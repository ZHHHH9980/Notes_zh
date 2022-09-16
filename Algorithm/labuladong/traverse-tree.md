# traverse-tree



## serialize & deserialize

[leetcode 297 Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/)

## preorder-serialize

```
//         1
//       /   \
//      2     3
//     / \   /  \
//    #   # 4    5

preorder (root - left - right):
1,2,#,#,3,4,#,#,5,#,#
```

### serialize

```js
var serialize = function (root) {
  var str = "";
  var traverse_preorder = (root) => {
    if (root === null) {
      str += "#,";
      return;
    }

    str += `${root.val},`;
    traverse_preorder(root.left);
    traverse_preorder(root.right);
  };

  traverse_preorder(root);

  // 去掉最后一个,
  return str.slice(0, -1);
};
```

### preorder-deserialize

```js
preorder (root - left - right):

  ↓---↓ ->left
1,2,#,#,3,4,#,#,5,#,#
^ root  ↑___________↑ right

```

前序遍历中，根节点的索引一直在首位。

```js
var makeTree = (list) => {
  if (list.length === 0) {
    return null;
  };
  
  var first = list.shift();
  if (first === '#') {
    return null;
  }
  var root = new TreeNode(first);
  root.left = makeTree(list);
  root.right = makeTree(list);
  
  return root
}

var deserialize = function (str) {
  var list = str.split(',');
  return makeTree(list)
};
```



## postorder-serialize

```
//         1
//       /   \
//      2     3
//     / \   /  \
//    #   # 4    5

postorder (left - right - root):
#,#,2,#,#,4,#,#,5,3,1
```

### serialize

```js
var traverse_postoreder = function (root) {
  if (root === null) {
    return "#,";
  }

  const leftTree = traverse_postoreder(root.left);
  const rightTree = traverse_postoreder(root.right);

  return leftTree + rightTree + `${root.val},`;
};

var serialize = function (root) {
  const res = traverse_postoreder(root);
  return res.slice(0, -1);
};
```

### deserialize

```
postorder (left - right - root):

↓---↓ ->left
#,#,2,#,#,4,#,#,5,3,1
      ↑___right___↑ ^ root
  
```

后序遍历，root节点在末尾，并且得**先构建右子树。**

```js
var makeTree = (list) => {
  if (list.length === 0) {
    return null;
  }

  var last = list.pop();

  if (last === "#") {
    return null;
  }

  var rightTree = makeTree(list);
  var leftTree = makeTree(list);

  var root = new TreeNode(last);
  root.right = rightTree;
  root.left = leftTree;

  return root;
};

var deserialize = function (str) {
  var list = str.split(",");
  return makeTree(list);
};
```



## 参考

https://mp.weixin.qq.com/s/DVX2A1ha4xSecEXLxW_UsA