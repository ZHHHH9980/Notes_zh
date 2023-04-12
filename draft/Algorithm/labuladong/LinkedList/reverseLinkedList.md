# reverseLinkedList

## 
翻转一整个链表

```js
// 递归函数定义： 传入一个链表头，返回新的翻转后的链表头
// head -> 1 -> 2 -> 3 -> null
// head -> 3 -> 2 -> 1 -> null

var reverse = function (head) {
    if (head == null || head.next == null) {
        return head;
    }

    var last = reverse(head.next);
    head.next.next = head;
    head.next = null;

    return last;
}
```


## 反转链表前 N 个节点

实现这样一个函数，传入head和要翻转的个数，返回新的翻转后的list。

```js
// head -> 1 -> 2 -> 3 -> 4 -> 5 -> null
// reverseN(head, 3)
// newHead -> 3 -> 2 -> 1 -> 4 -> 5 -> null
function reverseN(head, n) {}
```

```js
// 翻转后：
// newHead -> 3 -> 2 -> 1(head)
// 4 -> 5 -> null 需要把这条也拼接上，那么就需要记录4（后驱节点）
``

代码实现：

```js
var successor = null;

function reverseN(head, n) {
    if (n == 1) {
        // 记录后驱节点
        successor = head.next;
        return head;
    }

    var last = reverseN(head.next, n - 1);
    head.next.next = head; 
    head.next = successor;

    return last;
}
```

![image.png](https://s2.loli.net/2023/03/26/WJgEftvu1qxl2sp.png)


## [https://leetcode.com/problems/reverse-linked-list-ii/](https://leetcode.com/problems/reverse-linked-list-ii/)

翻转部分链表。

```js

var successor = null;

function reverseN(head, n) {
    if (n == 1) {
        // 记录后驱节点
        successor = head.next;
        return head;
    }

    var last = reverseN(head.next, n - 1);
    head.next.next = head; 
    head.next = successor;

    return last;
}
```

假设left为1，那么就是reverseN的逻辑，翻转前right个节点：

```js
var reverseBetween = function(head, left, right) {
    if (left == 1) {
        return reverseN(head, right);
    }
};
```

对于head来说，要反转的索引区间是[left, right]，那么对于head.next来说，要反转的索引区间就是[left - 1, right - 1]

那么我们不断把head.next扔进递归函数，直到触发base case，让递归函数替我们解决问题即可：

```js
var reverseBetween = function(head, left, right) {
    if (left == 1) {
        return reverseN(head, right);
    }

    head.next = reverseBetween(head.next, left - 1, right - 1);
    return head;
};
```

精彩绝伦！！！