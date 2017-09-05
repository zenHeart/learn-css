css 布局要义
===
---
_前言：透彻理解 css 的布局_

## 序言
本文的目的是希望从繁杂的 css 布局细节中，提炼出一条主线，使读者能认清布局的本质，不至于在
盒模型、块格式化语境、堆叠规则、外边距塌陷等术语上陷入迷局。而是能够从一个宏观的层面上理解布局，
在需要深入细节的时候又知道如何考究。总结一下就是希望达到**宏观把握，微观理解**的地步。

在开始讲解之前先讲明大概主线及限制。

限制：
   1. 只考虑连续媒体布局(例如屏幕)，不包含页布局(例如在打印模式下的布局)
   2. 不会去深究细节，比如CSS 的属性含义，规则详解等，但是会讨论必须知晓的原则和如何**RTFM**

主线:   
    1. 从布局的起因开始按照从简到繁的原则逐渐讲解。
    2. 尽量利用代码来解释原理。
    

## 基本概念
浏览器会将 html 内容装变为文档树，而文档树中的每一个元素都会有由一个或多个盒模型组成，而这些盒模型便是组成
整个页面的基础。

```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
   <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
                            <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <title>Document</title>
       <style>
       div {
           width: 100px;
           height: 100px;
           border: 5px solid red;
       padding:10px;
       margin:10px;
           background: blue;}
       </style>
   </head>
   <body>
   <div>测试文本</div>
     
   </body>
   </html> 
```
效果如下

1. 渲染顺序从基本元素开始逐级向上讲解
    1. 每个元素都会生成盒模型
    2. 匿名元素和文本会有匿名盒
    3. 一个元素可能生成多个盒，每个`li`元素由两个行内盒组成行盒
    4. 盒的图形如下
    
    ![](https://www.w3.org/TR/css3-box/box.png)

2. 包含块有祖先元素盒模型的内容区组成
    1. 根元素包含块为 视大小
    2. 包含块不一定是邻近祖先，比如 absolute 和 fix 的定位
    3. 行内盒的包含块是内边距围成的区域
<img style = "background:white" src="https://www.w3.org/TR/css3-box/anonymous.png">

