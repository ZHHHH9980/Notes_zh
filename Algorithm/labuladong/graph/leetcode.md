# graph

## [797. All Paths From Source to Target](https://leetcode.com/problems/all-paths-from-source-to-target/)

在有向无环图中找到所有路径，这里就是多叉树的遍历，结合了这篇的[回溯算法和 DFS 的区别]两者的共同特点，进入节点加入路径，离开节点从路径中撤销。

```js
var allPathsSourceTarget = function (graph) {
  var path = [];
  var track = [];

  var traverse = (graph, node, path) => {
    var n = graph.length;

    // add node into track
    track.push(node);

    // find the target
    if (node === n - 1) {
      path.push(track.map((i) => i));

      // remove the choice, otherwise the target will keep in the track
      track.pop();

      return;
    }

    // graph[node] save all the neighbours of node, like traverse a multitree
    for (let neighbour of graph[node]) {
      traverse(graph, neighbour, path, track);
    }

    // remove the choice
    track.pop();
  };

  traverse(graph, 0, path);

  return path;
};
```

TODO: 还需要对邻接表有了解。
