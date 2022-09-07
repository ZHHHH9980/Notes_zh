# union-find

### quick-union

```js
class UF {
  constructor(N) {
    // 存储根节点
    this.parent = new Array(N);
    for (let i = 0; i < N; i++) {
      this.parent[i] = i;
    }
    this.count = N;
  }

  count() {
    return this.count;
  }

  isConnected(p, q) {
    return find(p) === find(q);
  }

  find(p) {
    while (p !== this.parent[p]) {
      p = this.parent[p]
    }
    return p;
  }

  union(p, q) {
    var pRoot = this.find(p);
    var qRoot = this.find(q);

    if (pRoot === qRoot) {
      return;
    }
    
    // qRoot 可能是一个节点对象，未必是Integer
    // this.parent[pRoot] = this.parent[qRoot];
    this.parent[pRoot] = qRoot;
    
    this.count--;
  }
}
```

直接粗暴地将pRoot对接到qRoot上可能会出现这样的情况：

```
//    1           
//   /           
//  2      &    3

// good:
//   1
//  / \
// 2   3

// bad:
//     1
//    /
//   2
//  /
// 3
```

树的生长不平衡，查找的效率就会从O(logN)-> O(N)

### weighted quick-union

size代表以index为节点的root节点的树有几个节点。

```js
class UF {
  constructor(N) {
    this.parent = new Array(N);
    this.size = [];
    for (let i = 0; i < N; i++) {
      this.parent[i] = i;
      this.size[i] = 1;
    }
    this.count = N;
  }

  count() {
    return this.count;
  }

  isConnected(p, q) {
    return this.find(p) === this.find(q);
  }

  find(p) {
    while (p !== this.parent[p]) {
      p = this.parent[p];
    }
    return p;
  }

  union(p, q) {
    var pRoot = this.find(p);
    var qRoot = this.find(q);

    if (pRoot === qRoot) {
      return;
    }

    if (this.size[pRoot] < this.size[qRoot]) {
      // q比较大，把p接到q上
      this.parent[pRoot] = qRoot;
      this.size[qRoot] += this.size[pRoot];
    } else {
      this.parent[qRoot] = pRoot;
      this.size[pRoot] += this.size[qRoot];
    }

    this.count--;
  }

```



通常情况下都不会只存一个Number,往往是存一个对象，维护具体的用户信息等；

```js
function TreeNode(val, pid, size) {
  this.val = val;
  this.pid = pid;
  this.size = size;
}

class UF {
  constructor(N) {
    this.nodes = [];
    this.count = N;
    
    // 元素的位置不变，因此index为元素的id
    for (let i = 0; i < N; i++) {
      this.nodes[i] = new TreeNode(i, i, 1);
    }
  }

  // 拿到根节点的位置
  findRoot(index) {
    while (this.nodes[index].pid !== index) {
      index = this.nodes[index].pid;
    }

    return index;
  }

  union(pIndex, qIndex) {
    const p = this.findRoot(pIndex);
    const q = this.findRoot(qIndex);

    if (p === q) return;

    const pRoot = this.nodes[p];
    const qRoot = this.nodes[q];

    if (pRoot.size > qRoot.size) {
      qRoot.pid = pRoot.pid;
      pRoot.size += qRoot.size;
    } else {
      pRoot.pid = qRoot.pid;
      qRoot.size += pRoot.size;
    }

    // qRoot.pid = pRoot.pid;
    // pRoot.size += qRoot.size;

    this.count--;
  }

  isConnected(p, q) {
    return this.findRoot(p) === this.findRoot(q);
  }
}
```

