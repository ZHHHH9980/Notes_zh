# HTTP 面试题 

## 什么是跨域 ?
在前后端分离的开发模式中，经常会遇到跨域问题，即 Ajax 请求发出去了，服务器也成功响应了，前端就是拿不到这个响应。实际上请求已经到达浏览器，只不过因为安全策略被拦截了。

### URI的组成

回顾一下 URI 的组成:
![image.png](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/22/170ffd7ac23846fe~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.awebp)

- **scheme 表示协议名，比如http, https, file等等。后面必须和://连在一起。**
- user:passwd@ 表示登录主机时的用户信息，不过很不安全，不推荐使用，也不常用。
- **host:port表示主机名和端口。**
- path表示请求路径，标记资源所在位置。
- query表示查询参数，为key=val这种形式，多个键值对之间用&隔开。
- fragment表示 URI 所定位的资源内的一个锚点，浏览器可以根据这个锚点跳转到对应的位置。

浏览器遵循同源政策(scheme(协议)、host(主机)和port(端口)都相同则为同源)。非同源站点有这样一些限制:

- 不能读取和修改对方的 DOM
- 不读访问对方的 Cookie、IndexDB 和 LocalStorage
- 限制 XMLHttpRequest 请求。(后面的话题着重围绕这个)

当浏览器向目标 URI 发 Ajax 请求时，只要当前 URL 和目标 URL 不同源，则产生跨域，被称为跨域请求。

#### TODO: 浏览器是如何进行拦截的？

## 参考

[（建议精读）HTTP灵魂之问，巩固你的 HTTP 知识体系](https://juejin.cn/post/6844904100035821575#heading-8)