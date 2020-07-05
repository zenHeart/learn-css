---
description: 详细讲解 float 属性的使用
---

# float 布局

float 是一个 css 属性。用来实现文字环绕的效果。

## float 属性
浮动属性可以取如下值

* **left** 元素靠父容器左边对齐
* **right** 元素靠父容器右边对齐
* **none** 元素不浮动
* **inline-start** 元素浮动到父容器文本流的开始侧方向
* **inline-end** 元素浮动到父容器文本流结束侧方向

> 注意后两种目前草案状态,当改变父容器 direction 属性的文本的排布规则时,inline-start 表示根据文本排布的启始侧方向对齐,inline-end 根据文本排布的结束侧方向对齐

详见示例 [浮动属性值](./float-value.html)

### float 和 position

float 属性也可以实现元素定位,参看示例 [浮动和定位](./float-with-position.html) 可以看出
1. 当 position **采用 absolute,fixed 定位时浮动会失效**。
2. **sticky** 定位模式下,浮动和粘滞定位会同时起效果

> 注意除了定位,父容器的 `display` 属性也会影响子元素的布局特性,参看 [浮动和 display](./float-with-display.html) 验证差别。


### 浮动塌陷
浮动会脱离正常文档流,这导致浮动容器不会再父容器占据空间,参看示例 [浮动塌陷](./float-collapse.html)。根据示例和 [css 2.2 规范 9.5 float ](https://www.w3.org/TR/CSS22/visuren.html#floats) 章节
1. 浮动元素脱离文档流不会占据父容器空间
2. 内联元素的内容区域会排布在浮动元素之后

## clear 属性
由于浮动元素会导致与其相邻的元素内容区环绕浮动元素,可以利用 clear 属性控制,这些相邻元素是否环绕。

clear 可以取如下值

* **none** 无效果
* **left** 若元素左边有浮动元素,则该元素下移清除左浮动
* **right** 若元素右侧有浮动元素,则该元素下移清除右侧环绕
* **both** 只有元素两侧有浮动就会导致该元素下移清除环绕
* **inline-start** 相对于文本流的开始方向清除浮动
* **inline-end** 相对于文本流结束方向清除浮动

参看示例 [清除属性](./clear-value.html) 

clear 属性会修改浮动元素后相邻的元素,清除浮动后的元素会在浮动元素之下进行排列。

### clear 生效条件
根据 [css 2.2 9.5.2 clear 属性可知](https://www.w3.org/TR/CSS22/visuren.html#flow-control) clear 属性在如下条件无效

1. 对于元素内部的浮动,采用 clear 无效
2. 对于不处于其他 BFC 中的浮动不起效果

参看示例 [clear 和 BFC](./clear-bfc.html) 此示例说明如下问题

1. 若浮动元素处于新的 BFC 当中则,相邻的元素设置 clear 属性无效
2. clear 清除特性不受 DOM 元素结构相邻的影响,而是根据排列规则确定的

## 浮动清除
浮动元素造成的父容器塌陷,有两种解决方案。

1. 使用 clear 属性清除浮动
2. 使浮动元素处于新的 BFC 清除浮动

参见 [浮动塌陷清除](./float-collapse-clean.html) 示例各方法。



## 参考资料
* [all float](https://css-tricks.com/all-about-floats/)
* [How Floating Works](https://bitsofco.de/how-floating-works/)

