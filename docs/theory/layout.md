---
title: layout    
tags: css      
birth: 2017-10-18      
modified: 2017-10-18      
---

layout
===
**前言:详解 css 布局原理**

---

## 层叠步骤
1. 首先堆叠 html 元素
2. 定位元素且 `z-index` 有值.值越高
元素及其子元素层叠在前,统计按照 html 铺排.
3. 非定位元素按照 html 节点顺序铺排
4. 定位元素但 `z-index` 为 auto 按照 html
铺排.


堆叠环境的形成条件
* 根节点 `html`
* 绝对定位且 `z-index` 有值
* `opacity` 值小于 1
* css 需要渲染相当于屏幕,此时会重新创建堆叠环境.

