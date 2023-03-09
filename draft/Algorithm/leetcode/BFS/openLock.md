# Openlock 

## BFS 框架

BFS寻找最短路径代码框架：
```ts
function BFS(Node start, Node target) {
    const queue = [start];
    const visited = new Set();
    let step = 0;

    visited.add(start);
    
    while (!queue.empty()) {
        int sz = queue.length;
        
        for (let i = 0; i < sz; i++) {
            const node = queue.shift();

            if (node == target) {
                return step;
            }

            // node.adj -> 指的是跟node相邻的所有节点
            // 避免走回头路
            if (!visited.has(node.adj())) {
                queue.push(node.adj());
            }
        }

        step++;
    }
}
```

## BFS跟DFS的区别

BFS像面一样逐渐覆盖推进：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7682c2747b2e4ca0acba0422af0e0503~tplv-k3u1fbpfcp-watermark.image?)

用队列的方式存储，先进先出，最先进入的根节点最先出队。

DFS像一条线：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3693fbb9b7ca4590bad76155cf1df234~tplv-k3u1fbpfcp-watermark.image?)

用栈的方式存储，先进后出，最先进入的根节点最后出队。常见的框架是递归，即利用函数的调用栈实现DFS。

## [752. Open the Lock](https://leetcode.com/problems/open-the-lock/)

这里的密码就像是图里的一个节点，每走一步就是像图周围节点进发。为了避免走重复的路，需要一个`visited`map来记录已经走过的路。

这道题一开始我的选择是先走后记录:
```js
const node = queue.shift();
visited[node] = true;
```

但这样会出现一个问题：
```
0000 -> 0001 -> 0002 -> 0003 -> 0004 -> 0005
0000 -> 0009 -> 0008 -> 0007 -> 0006 -> 0005
```

从0000开始走5steps，会有重合的密码，如果先走后记录就会在队列里出现很多重复的code。

那么如果选择在转后立即记录：
```js
if (!visited[up]) {
    queue.push(up);
    visited[up] = true;
}

if (!visited[down]) {
    queue.push(down);
    visited[down] = true;
}
```

```
0000 -> 0001 -> 0002 -> 0003 -> 0004 -在这里记录> 0005
0000 -> 0009 -> 0008 -> 0007 -> 0006 -×> 0005 up的时候已经存在了，不会重复添加，就可以避免队列出现重复
```

### 完整code
```js

// 0001 0010 0100 1000
//  ↑
// 0000 看似旋转了8次，实际上只走了 1step
//  ↓
// 0009 0090 0900 9000

var goUp = function (code, index) {
 var codeArr = code.split('');
 var cur = codeArr[index];

 if (cur === '9') {
     cur = '0';
 } else {
     cur = String(Number(cur) + 1);
 }

 codeArr[index] = cur;

 return codeArr.join('');
}

var goDown = function (code, index) {
 var codeArr = code.split('');
 var cur = codeArr[index];

 if (cur === '0') {
     cur = '9';
 } else {
     cur = String(Number(cur) - 1);
 }

 codeArr[index] = cur;

 return codeArr.join('');
}

var openLock = function(deadends, target) {
    var queue = ['0000'];
    var step = 0;
    var visited = {};
    var deadendsMap = {};

    for (let i = 0; i < deadends.length; i++) {
        deadendsMap[deadends[i]] = true;
    }

    while(queue.length) {
        const len = queue.length;

        for (let i = 0; i < len; i++) {
            const node = queue.shift();
            // visited[node] = true;

            if (deadendsMap[node]) {
                continue;
            }

            if (node == target) {
                return step;
            }

            for (let j = 0; j < 4; j++) {
                const up = goUp(node, j);
                const down = goDown(node, j);

                if (!visited[up]) {
                    queue.push(up);
                    visited[up] = true;
                }

                if (!visited[down]) {
                    queue.push(down);
                    visited[down] = true;
                }
            }
        }

        step++;
    }

    return -1;
};

```
