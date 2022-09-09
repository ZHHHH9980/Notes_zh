# leetcode

## [23. Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/)

合并 K 个有序链表，非常经典的题目，这里使用优先级队列解题。思路是将所有的节点存入小根堆，然后调用`delMin`这个 api 获取最小的节点拼接成一个新的有序链表。
由于`insert`与`delMin`都是需要 logN 级别的开销，总共就是 N\*logN 的时间复杂度，因为重新创建节点，加上堆的空间一共是 O(2N)的空间复杂度。

```js
// 最小堆
class PriorityQueue {
  constructor() {
    this.pq = [];
    this.N = 0;
  }

  insert(node) {
    this.pq[++this.N] = node;
    this.swim(this.N);
  }

  swap(a, b) {
    let temp = this.pq[a];
    this.pq[a] = this.pq[b];
    this.pq[b] = temp;
  }

  swim(k) {
    // k is child, k / 2 is parent
    while (k > 1 && this.pq[k].val < this.pq[Math.floor(k / 2)].val) {
      this.swap(k, Math.floor(k / 2));
      k = Math.floor(k / 2);
    }
  }

  sink(k) {
    // 最小堆 从子元素里找到最小的跟父元素交换
    while (k * 2 <= this.N) {
      let min = k * 2;

      if (min + 1 <= this.N && this.pq[min + 1].val < this.pq[min].val) {
        min = min + 1;
      }

      // 如果子元素比父元素大就没有交换必要了
      if (this.pq[min].val > this.pq[k].val) {
        break;
      }

      this.swap(min, k);
      k = min;
    }
  }

  delMin() {
    let min = this.pq[1];
    this.pq[1] = this.pq[this.N--];
    this.sink(1);

    return min;
  }
}

var mergeKLists = function (lists) {
  var pq = new PriorityQueue();

  for (let i = 0; i < lists.length; i++) {
    var listNode = lists[i];

    while (listNode) {
      pq.insert(new ListNode(listNode.val));
      listNode = listNode.next;
    }
  }

  var dummy = new ListNode(0);
  var cur = dummy;

  while (pq.N) {
    var node = pq.delMin();
    cur.next = node;
    cur = node;
  }

  return dummy.next;
};
```
