# css 的布局原理

**详解 css 的布局原理**

----

## 概述
本章会详细讲解 css 如何实现基本的布局。这里着重参考 css2.2 第九章和第十章进行表述。

## 视觉格式化模型
当采用 html 编写好文档结构时,浏览器如何依据 css 的规则来渲染文档内容呢?
根据 css 规范,浏览器会将文档中的每个元素转换为一个个盒子,而这套将元素装换为视图盒的规则即为视觉格式化模型。

决定元素盒的布局有如下因素决定。
* 盒子的尺寸
* 盒子的类型,规范中包含如下典型类型
  * 行内盒子(inline)
  * 行内级盒子(inline-level)
  * 原子行内级盒子(atomic inline-level)
  * 块盒子(block)
* 定位的方案(positioning scheme)
  * 普通流布局
  * 浮动定位
  * 绝对定位
* 文档树中其他元素:该盒的子元素或兄弟元素
* 视口尺寸与位置
* 所包含的图片的尺寸
* 其他的某些外部因素

若出现嵌套关系,则父元素的内容区作为子元素布局空间(包含块),但是子元素大小不受父元素空间限制,当子元素超出父元素布局限制时称为溢出。

## 术语表
* `块(block)` 抽象概念,在文档流中一个独立的布局区域,块与块在垂直方向上一次堆叠
* `包含块(containing block)` 包含其他盒子的块称为包含块
* `盒子(box)` 一个布局抽象概念
  > 注意盒子和元素不一定是一一对应,有时多个元素会生成一个盒子,有时一个元素会生成多个盒子(如匿名盒子)
* ``


## 参考资料
* <https://beta.developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Visual_formatting_model>
* <https://beta.developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context>
* <https://beta.developer.mozilla.org/en-US/docs/Web/CSS/writing-mode>