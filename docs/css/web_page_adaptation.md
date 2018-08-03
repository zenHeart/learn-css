---
title: web_page_adaptation    
tags: css ui      
birth: 2017-10-25      
modified: 2017-10-25      
---

web_page_adaptation
===
**前言:讲解 web app 屏幕适配逻辑**

## todo 
总结页面适配的步骤
1. 拿到设计稿,计算页面尺寸
2. 利用 rem 配比
3. 更具不同屏幕适配对应配比


## 
`viewport` 
* `物理像素` 屏幕上最小的显示尺寸
* `设备独立像素` 计算机虚拟的像素尺寸
    > css 像素是设备独立像素
* `设备像素比` 物理像素/设备独立像素 
    > 是至横轴或纵轴单方向的像素比,通过 `window.devicePixelRatio` 获知
* `位图像素` 理论上一个像素对应一个物理像素


## 参考资料
* [ ]  [页面适配](http://www.html-js.com/article/Mobile-terminal-H5-mobile-terminal-HD-multi-screen-adaptation-scheme%203041)
* [ ]  [移动 web 页面适配方案](http://www.html-js.com/article/Mobile-terminal-H5-mobile-terminal-HD-multi-screen-adaptation-scheme%203041)
* [ ]  [web 移动适配](http://www.cnblogs.com/PeunZhang/p/3407453.html)
* [ ]  [淘宝设计稿](http://www.cnblogs.com/lyzg/p/4877277.html)
* [ ]  [页面兼容性测试](http://resizer.cn/)
