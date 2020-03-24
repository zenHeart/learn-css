---
description: 详解 z-index 的使用
---

# z-index
z-index 控制元素在 z 层的堆叠顺序。


## z-index 属性
z-index 可以去如下值

* **auto** 堆叠层和父元素相同
* **integer** 数量为整数范围,值越大表示层级越靠上



## z-index 堆叠规则
z-index 的堆叠规则如下:

1. 默认堆叠规则
   1. 放置根元素的背景和边框
   2. 非定位元素相对根元素基于元素声明顺序进行堆叠
   3. 浮动定位元素
   4. 定位元素更与定位申明顺序进行堆叠
        > flex 的 order 也会影响堆叠顺序
    参考示例 [z-index 默认堆叠](./z-index-default.html) 理解上述规则
  
2. 对于非默认定位的元素,采用 z-index 可以修改堆叠顺序,值越大越靠上



## 堆叠层
注意 z-index 的值是相对当前堆叠层比较的。
而非 root。对于包含多个堆叠层侧元素,先在父元素上进行堆叠比较后,再在子元素上进行堆叠比较。参看示例 [z-index](./z-index.html)

z-index 比较是相对于父容器的堆叠层而言的而非 root 层。z-index 的值越大越靠上。会覆盖下层元素。

参看示例 [菜单问题](./z-index-menu.html)

由于 3 级菜单在 2 级堆叠层之上,而 2 级菜单的堆叠优先级相同。导致 2 级菜单对 3 级菜单产生了遮挡。可以通过提高对应 2 级堆叠菜单来提升 z-index。

生成堆叠层的情况详见 [对叠层](https://wiki.developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context)

## 总结
1. z-index 只有在非 static 定位才生效,参见 [css 定位](./z-index-work.html)
2. z-index 比较是针对同一个对叠层父容器而言的
3. 同一对叠层,后续元素会堆叠优先级更高


