# Dijkstra

## 二叉树层序遍历
如果不使用while循环嵌套for循环的方式，那么需要一个额外的辅助类来记录层级。

```js
class State {
    constructor(node, depth) {
        this.node = node;
        this.depth = depth;
    }
}

function levelTraverse(root) {

    let queue = [];
    queue.push(new State(root, 1));

    while(queue.length) {
        const cur = queue.shift();
        const cur_node = cur.node;
        const cur_depth = cur.depth;
        console.log('节点:', cur_node, '在第', cur_depth, '层');

        if (cur_node.left) {
            queue.push(new State(cur_node.left, cur_depth + 1));
        }

        if (cur_node.right) {
            queue.push(new State(cur_node.right, cur_depth + 1));
        }
    }
}
```


算法签名：
```ts
// 输入一幅图和一个起点 start，计算 start 到其他节点的最短距离
function dijkstra(start: number, List<number>[] graph): number[] {}
```
