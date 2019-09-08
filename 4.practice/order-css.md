# css 书写顺序

**详解 css 的书写顺序**

---

## 概述
按照 css 的布局规则,建议从布局到细节书写 css 样式。则根据引擎的布局顺序则书写顺序如下:

1. 定位相关 (确定元素的定位
   1. `position`
   2. `z-index`
   3. `top,right...`
2. 布局模型相关 (盒模型从内容块向外书写)
   1. `display`
   2. `float`
   3. `width,heigh`
   4. `padding`
   5. `border`
   6. `margin`
3. 样式相关
   1. `background`
   2. `color`
4. 文本设置
   1. `font-family`
   2. `font-size`
   3. `line-height`
5. 其他设置