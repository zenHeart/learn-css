---
title: readme    
tags:       
birth: 2017-09-07      
modified: 2017-09-07      
---

readme
===
**前言:记录 css 调试中的缺陷及常见使用错误**

---

## z-index 的故障
### 场景
* iphone 6s wechat 6.5.15
* z-index 无法将元素置于上层.

### 原因
* 父元素关键参数
    * z-index 0
    * position absolute
    * bottom  60px
* 底部 footer
    * z-index 0
    * position fixed
* 弹出层
    * position fixed
    * z-index 1

单纯的修改弹出层 z-index 无法起作用

必须修改父元素
    * z-index 1
    * bottom 0
才可正常显示

但是在桌面无此问题.

> 需要深入研究 z-index 的作用机制
