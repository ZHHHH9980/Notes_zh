<!--
 * @Author: ZHHHH9980 howzhongzh@gmail.com
 * @Date: 2023-05-03 18:24:26
 * @LastEditors: ZHHHH9980 howzhongzh@gmail.com
 * @LastEditTime: 2023-05-03 19:16:00
 * @FilePath: /frontend/react/router.md
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
# Router

根据不同的path渲染不同的页面。

![image.png](https://s2.loli.net/2023/05/03/etMlUdzIFphuxcN.png)

两种实现方式：
1. hash 路由
2. Browser 路由 用h5的浏览器aps实现

## Hash router

主要是通过`hashchange`来监听路由变化来做一些相应处理。

```html
<body>
    <a href="#/a">a</a>
    <a href="#/b">b</a>

    <script>
        window.addEventListener('hashchange', () => {
            console.log('window.location.hash', window.location.hash);
        })
    </script>
</body>
```

## Browser router

HTML5提供了`history api`包括：
- history.pushState()
- history.replaceState()
- window.onpopstate


### pushState

- history.pushState(stateObject, title, url)
    - 存储url对应的状态对象，可以在`onpopstate`事件中获取，也可以在`history`中获取
    - 标题
    - 设定的url

- pushState向浏览器历史堆栈压入一个url State，并改变历史堆栈的指针指向栈顶

### replaceState

- 该接口与pushState参数相同

### onpopstate

- window.onpopstate
- 在浏览器前进、后退以及执行`history.forward`,`history.back`和`history.go`触发，这些操作有一个共性，修改了历史堆栈的当前指针

#### history stack

![image.png](https://s2.loli.net/2023/05/03/TmKSAg3eyIkl9oE.png)

![image.png](https://s2.loli.net/2023/05/03/6tiTSzbWoHafwrj.png)