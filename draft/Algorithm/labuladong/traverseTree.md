<!--
 * @Author: ZHHHH9980 howzhongzh@gmail.com
 * @Date: 2023-05-05 10:41:54
 * @LastEditors: ZHHHH9980 howzhongzh@gmail.com
 * @LastEditTime: 2023-05-05 10:45:44
 * @FilePath: /Notes_zh/draft/Algorithm/labuladong/traverseTree.md
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
# Traverse tree

经典三大遍历树的方式：
1. 前序遍历 preorder
2. 中序遍历 inorder
3. 后序遍历 postorder

```js
function traverse(head) {
    // 前序遍历位置
    traverse(head.left);
    traverse(head.right);
    // 后序遍历位置
}
```

当时我太菜了，面试官让我写前序遍历，我明明写出来了他还说我写的是后序... 如果是现在肯定秒反驳他

## [234. Palindrome Linked List](https://leetcode.com/problems/palindrome-linked-list/description/)

这道题我真的非常爱，巧妙的把后续遍历用上了，利用后序遍历压栈的操作来判断回文。

![image.png](https://s2.loli.net/2023/05/05/JoQg9SX6Op8cyqU.png)

```ts

var left = null;

function traverse(right: ListNode | null) {
    if (right === null) {
        return true;
    }

    var res = traverse(right.next);

    res = res && right.val === left.val;
    left = left.next;

    return res;
}

function isPalindrome(head: ListNode | null): boolean {
    left = head;
    return traverse(head);
};
```