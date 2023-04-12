# linkedList

## [21. Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists/)

双指针，哪个小拼接哪一个，其实我觉得难点在于`dummy`，需要有一个作为头结点的记录者。

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
var mergeTwoLists = function(list1, list2) {
   var dummy = new ListNode(-1) ;
   var p = dummy;
   var p1 = list1;
   var p2 = list2;

   while(p1 !== null && p2 !== null) {
    if (p1.val < p2.val) {
        p.next = p1;
        p1 = p1.next;
    } else {
        p.next = p2;
        p2 = p2.next;
    }
    p = p.next;
   }

   if (p1 !== null) {
    p.next = p1;
   }

   if (p2 !== null) {
    p.next = p2;
   }

   return dummy.next;
};
```

突然看到东哥文章里有很重要的一句话：

>  经常有读者问我，什么时候需要用虚拟头结点？我这里总结下：当你需要创造一条新链表的时候，可以使用虚拟头结点简化边界情况的处理。
>  比如说，让你把两条有序链表合并成一条新的有序链表，是不是要创造一条新链表？再比你想把一条链表分解成两条链表，是不是也在创造新链表？这些情况都可以使用虚拟头结点简化边界情况的处理。

## [86. Partition List](https://labuladong.github.io/algo/di-yi-zhan-da78c/shou-ba-sh-8f30d/shuang-zhi-0f7cc/)

```
1 -> 4 -> 3 -> 2 -> 5 -> 2

partition:
1 -> 2 -> 2
4 -> 3 -> 5
```

思路是拆成两条链表，既然生成了新的链表，那么就需要用`dummy`帮忙记录头节点。


```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} x
 * @return {ListNode}
 */
var partition = function(head, x) {
    var p = head; 
    var dummy1 = new ListNode(-1);
    var dummy2 = new ListNode(-1);
    var p1 = dummy1,
    p2 = dummy2;

    while(p !== null) {
        if (p.val < x) {
            p1.next = p;
            p1 = p1.next;
        } else {
            p2.next = p;
            p2 = p2.next;
        }

        // 断开p节点的next
        var temp = p.next;
        p.next = null;
        p = p.next;
    }

    p1.next = dummy2.next;

    return dummy1;
};
```

## [19. Remove Nth Node From End of List](https://leetcode.com/problems/remove-nth-node-from-end-of-list/)

在n个节点长度中找到倒数第k个节点，正数的话是 n - k + 1步，通过一次遍历：

```js
1 -> 2 -> 3 -> 4 -> 5 -> null
          ^ p1 = k 

1 -> 2 -> 3 -> 4 -> 5 -> null
          ^ p1 = k  ^n
// 先走k步，剩余 n - k 步

1 -> 2 -> 3 -> 4 -> 5 -> null
^p2       ^ p1 = k   
// 此时用p2记录头节点

1 -> 2 -> 3 -> 4 -> 5 -> null
               ^p2       ^ p1 = n - k + 1
// p2 跟 p1同步前进 n - k + 1步，那么就找到了正数n - k + 1的位置
```

```js
function findTheEnd(head, k) {
    var p1 = head;
    for (let i = 0; i < k; i++) {
        p1 = p1.next;
    }

    var p2 = head;

    while(p1 !== null) {
        p1 = p1.next;
        p2 = p2.next;
    }

    return p2;
}
```

这个dummy用的真是神了 直接避免了`end.next.next`的情况。

```js
var removeNthFromEnd = function(head, n) {

    var dummy = new ListNode(-1);
    dummy.next = head;
    var end = findTheEnd(dummy, n + 1);
    end.next = end.next.next;

    return dummy.next;
};
```

## [160. Intersection of Two Linked Lists](https://leetcode.com/problems/intersection-of-two-linked-lists/)

让两个链表「逻辑上」拼接在一起：

![image.png](https://labuladong.github.io/algo/images/%e9%93%be%e8%a1%a8%e6%8a%80%e5%b7%a7/6.jpeg)

```js
/**
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
var getIntersectionNode = function(headA, headB) {
    var p1 = headA;
    var p2 = headB;    

    while (p1 !== p2) {
        if (p1 == null) {
            p1 = headB;
        } else {
            p1 = p1.next;
        }

        if (p2 == null) {
            p2 = headA;
        } else {
            p2 = p2.next;
        }
    }

    return p1;
};

```

即使不相交，最后也会同时走到「逻辑上」拼接好的等长节点的最后一个Null节点，那么p1 === p2，结束。

## 参考

[双指针技巧秒杀七道链表题目](https://labuladong.github.io/algo/di-yi-zhan-da78c/shou-ba-sh-8f30d/shuang-zhi-0f7cc/)