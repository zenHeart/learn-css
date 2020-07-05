---
description: 详细讲解 flex 布局
---

# flex

css 存在两种典型盒模型。
* `block` 块级盒实现垂直方向堆叠
* `inline` 内联盒实现水平方向堆叠

为了实现父元素对子元素空间分配,布局细节的控制, 提出了 flex


## flex 核心概念

* **主轴** 决定元素的默认铺排方向,有水平,垂直两个方向,默认为水平
* **交叉轴** 和主轴垂直

flex 布局的学习重点是理解 flex 盒模型及其子元素的布局特性。
并掌握 flex 相关的 css 属性。采用 flex 布局的基本步骤如下

1. 采用 `display:flex` 设置父元素为 flex 盒模型
	> flex 布局会改变默认盒模型特性,示例参看 [flex-context](./flex-context.html)
2. 设置 flex 盒模型相关特性
3. 设置flex 盒模型中子元素相关特性

## flex 快速入门
1. 采用 `display:flex` 设置父元素为 flex 盒模型
2. `flex-direction` 定义 flex 盒模型的主轴方向
	> 主轴决定了 flex 容器如何铺排子元素
3. 定义 flex 盒模型如何铺排子元素
	1. `flex-wrap` 定义子元素溢出是否换行
    2. `justify-content` 定义子元素在主轴上的堆叠规则
    3. `align-items` 定义子元素在纵轴上的堆叠规则
4. 定义子元素铺排规则
	2. `flex-grow` 定义子元素如何利用主轴剩余空间
	3. `flex-shrink` 定义子元素如何处理主轴溢出空间
	4. `self-align` 定义子元素在主轴排列规则
	5. `order` 定义子元素在主轴排列顺序

参见示例

### 元素的排列
* `align-items` 改变元素在交叉轴上的排列方式
  * `stretch` 延伸高度
  * `flex-start` 开头对齐
  * `flex-center` 中间对齐
  * `flex-end` 底部对齐

### 设置子元素规则
子元素默认宽度为内容宽度

## flex 属性详解


### flex-wrap
由于 flex 为一维布局意味着,它只会在一个方向上进行堆叠。
默认堆叠沿着主轴方向逐一排列,为了避免在一个维度下排列可采用 `flex-wrap:wrap` 来设置 flex容器。该特性当 flex 布局在主轴上溢出时回在交叉轴进行堆叠。

> 利用 `flex-direction` 和 `flex-wrap` 可以实现一个等高的二维布局,利用 `flex-flow` 来同时设置上述两个属性

## 典型布局

## 阅读