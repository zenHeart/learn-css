---
description: 讲解 css 计数器的使用
---

# 计数器
计数器是 css  内部维护的变量。
可以利用技术器实现文章段落添加序号等功能。

## 快速预览
参看示例 [文章标题序号](./couter-aritcle.html)

1. 采用 `counter-reset` 属性申明 `counter` 变量
    > 注意变量名的合法性不能为 css 关键字
2. 采用 `counter-increment` 属性申请变量递增规则
3. 在标题前伪元素使用 `counter(变量名)` 获取变量当前值

## 核心属性和值

### counter-reset
`counter-reset` 属性重置或创建计数变量,值的格式为

> `[ <custom-ident> <integer>? ]+ | none`

* **custom-ident** 为合法的计数变量
* **integer** 为整数,表示计数启始值默认为 0
  
```css
h1 {
    /* chapter section 两个计数变量同时section 值重置为 1 */
    counter-reset: chapter section 1;
}
```

### counter-increment
`counter-increment` 属性控制计数变量的值,值的格式为

> [ <custom-ident> <integer>? ]+ | none

* `custom-ident` 为计数变量
* `integer` 表示计数变量默认增量,初始值为 1

例如: 

```css
h1 {
    /* chapter page 的变量值加 1, section 变量值加 2 */
  counter-increment: chapter section 2 page;
}
```

### counter 和 counters
* `counter` 函数用于返回计数变量对应的值。
* `counters` 功能同上,输入格式有区别

两种函数语法如下

* > `counter( <custom-ident>, <counter-style>? )`
* > `counters( <custom-ident>, <string>, <counter-style>? )`

* `custom-indent` 为计数变量
* `counter-style` 控制计数的风格,支持所有合法的列表序号详见 [list-style-type](https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-type)
* `string` 连接的字符串,该字符串在出现嵌套计数器时作为连接符

参看示例 [列表序号](./coutn)

> counters 相比 counter 函数当出现嵌套结构时,counters 函数会创建嵌套计数变量而非覆盖初始变量


### counter-set
> **该属性目前浏览器未实现,功能和 counter-reset 类似**


`counter-set` 属性常见或设置计数器变量,值的格式为

> `[ <custom-ident> <integer>? ]+ | none`

* **custom-ident** 为合法的计数变量
* **integer** 为整数,表示计数启始值默认为 0


## counter rules
<!-- counter 规则及目前浏览器未实现此机制 -->

## 总结
1.  `counter-reset` 创建计数变量,计数变量支持 `[<custom-indent> <integer>]+` 模式
2. `counter-increment` 控制计数变量,支持模式同上
3. 利用 `counter` 获取计数变量的值,`counters` 具有嵌套和连接字符串的功能,函数的最后一个参数 `<counter-style>` 支持修改计数器的样式