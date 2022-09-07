# Priority Queues

## heap definition

堆拥有树状结构，能够保证父节点比子节点大（小），当根节点保存的是最大值成为大根堆，反之称为小根堆。

![image.png](https://pic3.zhimg.com/v2-b8a4c5fa2ab83b6f7e5345b30824dc9d_1440w.jpg?source=172ae18b)

## Binary heap representation

### array representaion

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc342693530f4b3abf6b0ef8960d2cac~tplv-k3u1fbpfcp-watermark.image?)

数组中第一个位置不用，对于子元素索引为 k，父元素的位置为`Math.floor(k / 2)`。对于父元素索引为 k，左子元素的位置为 2k，右子元素为 2k + 1。

### code

```js
class MaxPQ {
  constructor() {
    this.N = 0;
    this.pq = [];
  }

  insert(val) {
    this.pq[++this.N] = val;
    this.swim(this.N);
  }

  delMax() {
    let max = this.pq[1];
    // 第一个和最后一个元素交换位置
    this.exch(1, this.N);
    this.N--;

    // 交换位置后底部的元素上来了，需要下沉到合适的位置
    this.sink(1);
    return max;
  }

  exch(a, b) {
    let temp = this.pq[a];
    this.pq[a] = this.pq[b];
    this.pq[b] = temp;
  }

  less(i, j) {
    return this.pq[i] < this.pq[j];
  }

  sink(k) {}
  swim(k) {}
}
```

优先级队列的核心就是上浮`swim`和下沉`sink`的操作了。

`swim`

```js
    swim(k) {
    // k 在二叉堆范围内 && 父元素小于子元素，上浮
    while (k > 1 && this.less(Math.floor(k / 2), k)) {
      this.exch(Math.floor(k / 2), k);
      k = Math.floor(k / 2);
    }
  }
```

`sink`

左子元素的索引是 2k,必须要保证有子元素才能下沉，即 2k <= N。下沉的思想是从子元素中找到最大的元素交换位置，从而保证最大堆的性质。

```js
  sink(k) {
    while (2 * k <= this.N) {
      // 先假设左子元素最小
      let bigger = 2 * k;

      if (bigger + 1 <= this.N && this.less(bigger, bigger + 1)) {
        bigger += 1;
      }

      // 最大的都比当前元素小，停止操作
      if (this.less(bigger, k)) break;

      this.exch(bigger, k);

      k = bigger;
    }
  }
```


## Heapsort

> 说实话刚开始有点没理解... 看了图才明白堆排序的意图。

### heap construction 
第一步是构建堆，并不需要整个数组遍历一遍添加进优先级队列里面，只需要保证如图的五个根节点都比左右子节点大，那么就形成了一个二叉堆。

一共有k个节点，父节点的个数是Math.floor(k / 2)，范围是[1, Math.floor(k / 2)]。

对这些父节点依次进行`sink`操作即可保证都比左右子元素大。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eec710eb592147c38678c0bc9e44a38a~tplv-k3u1fbpfcp-watermark.image?)

### sortdown

通过上面的操作已经形成了一个最大堆。

重复下面的操作直到size = 0

1. 将根节点跟最后一个节点交换位置。(类似于选择排序，这里是选择一个最大的元素放入末尾)
2. 最大堆的size - 1。
3. 再下沉根节点。


> 这种写法将会忽略数组中的第一个元素！


### code

```js

class Heapsort extends Sort {
  constructor(arr) {
    super(arr);
    this.arr = arr;
  }

  exch(a, b) {
    var temp = this.arr[a];
    this.arr[a] = this.arr[b];
    this.arr[b] = temp;
  }

  sort() {
    let N = this.arr.length - 1;

    for (let k = Math.floor(N / 2); k >= 1; k--) {
      this.sink(k, N);
    }

    while (N > 1) {
      this.exch(1, N--);
      this.sink(1, N);
    }
  }

  sink(parent, end) {
    // 存在子元素
    while (parent * 2 <= end) {
      var more = parent * 2;
      if (more + 1 <= end && this.less(this.arr[more], this.arr[more + 1])) {
        more = more + 1;
      }

      // 最大的还没父元素大，停止
      if (this.less(this.arr[more], this.arr[parent])) break;

      this.exch(parent, more);
      parent = more;
    }
  }
}
```


本质上是一个NlogN的时间复杂度，具体先不分析了。
