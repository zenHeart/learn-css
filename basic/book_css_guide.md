
# 前言
开始讲解看 CSS 权威指南的体会及延伸，计划每天写以一章，题外话下午再看哲思录的时候
产生的一些小感慨，首先技术学习不要总在那里思考效率、方式这些没有营养的问题，先去做，另外
在看书的时候产生的要从知识的源头获取信息的想法非常愚蠢，规则是用来理解的，不是用来记得。书
才是精华所在，一本好书展现了一个作者对一个方面的知识结构及记忆方法，这种内在的讲解方式和规划手段，
是你更应该去深刻的学习和总结的这也是我们所说的知识体系！
>## CSS 权威指南目录结构
>> ### [1 CSS 和文档](#test)
>> ### 2 选择器
>> ### 3 结构和层叠规则
>> ### 4 值和单
>> ### 5 字体
>> ### 6 文本属性
>> ### 7 基本视觉格式化
>> ### 8 内边距边框和外边距
>> ### 9 颜色和背景
>> ### 10 浮动和定位
>> ### 11 表布局
>> ### 12 列表和生成内容
>> ### 13 用户界面样式
>> ### 14 非屏幕媒体


## 如何阅读 CSS 规范
### 属性定义格式
范例：

    'property-name'
    取值：	合法值＆语法
    初始：	初始值
    适用于：	属性适用的元素
    继承：	属性是否可继承
    百分比：	百分比值的解析方式
    媒体：	属性使用的媒体
    计算值：	如何计算计算值
取值语法规则：

    [ ]: 分组
    <>: 代表属性值
    无符号属性: 关键字

    空格:按照空格次序出现
    &&: 用来分隔两个以上必须出现的部件，顺序任意。
    ||: 用来两个以上的选项——至少出现一个，顺序任意。
    |: 用来分隔两个以上的可选选项——必须出现一个。
    优先级从上到下注意分组符、尖括号不算在其中

    任何一种类型，关键字或分组后面可以接着下列修饰符中的一个：
    *: 前面的类型，文字或分组出现0 或多次
    +: 前面的类型，文字或分组出现1 或多次
    ?: 前面的类型，文字或分组出现0 或 1
    {A,B}: 前面的类型，文字或分组出现A次以上，B次一下

初始值：用户代理默认取值，记住元素的取值顺序
1. 按照层叠规则进行取值
2. 在不存在层叠的条件下按照元素是否继承来取值
3. 若没有继承则依照用户代理的规则进行处理

适用于：按照元素类型来决定该属性的适用条件

继承：该元素的属性是否会延续到后代元素

百分比：若该元素出现 % 属性说明是相对于谁来说的

媒介：指定属性适用于那些媒体类型，说明文档树的媒体使用范围

计算值：描述属性是如何计算的

简写属性：表示利用该属性可以定义多个属性的值





## 7 基本视觉格式化
#### 基本概念
**盒模型**：在浏览器生成了标签元素的 DOM 树结构后，需要为每个元素生成渲染树，组成每个元素的矩形框我们叫做盒模型。   

<img style="background:white" src="https://www.w3.org/TR/CSS2/images/boxdim.png">

根据上图可知每各盒子由如下几部分组成 
**包含块**：元素在布局和定位时所依赖的参考矩形我们叫做包含块(containing block 后面简称 CB)。详细定义如下:    
1. 初始包含块是整个页面的视图区。
2. 对于定位是相对和静态的元素，包含块是最近祖先的内容区
3. 固定定位的元素，包含块是视图区
4. 绝对定位的元素，包含块由最近的定位方式为非默认值的祖先元素决定。   
    1. 如果祖先是行内元素，包含块是第一个和最后一个行内元素之间的区域   

利用代码来说明包含块的关系：

```html
<!DOCTYPE HTML>
<HTML>
   <HEAD>
      <TITLE>Illustration of containing blocks</TITLE>
   </HEAD>
   <BODY id="body">
      <DIV id="div1">
      <P id="p1">This is text in the first paragraph...</P>
      <P id="p2">This is text <EM id="em1"> in the 
      <STRONG id="strong1">second</STRONG> paragraph.</EM></P>
      </DIV>
   </BODY>
</HTML>
```
上面代码的包含块结构如下：

盒模型|包含块|
:---:|:---:|
html|视图区，用户代理决定
body|html
div1|body
p1|div1
p2|div1
em1|p2
strong1|p2

假设其中 `div1` 和  `em1` 都采用绝对定位则按照上面的原则变化的包含块是   

盒模型|包含块|
:---:|:---:|
div1|视图区，用户代理决定
em1|div1

没有祖先的元素，包含块都是视图区。   




范例：

    <body>
        <div>
            <p>this is paragraph</p>
        </div>
    </body>

    如上面的文档结构包含块关系如下
    div 是 P 的包含块
    body 是 div 的包含块

**块级元素**：盒模型的一种，在包含块中会垂直摆放，不会水平堆叠

**行内元素**：与块状盒不同会水平堆叠

规则： 在包含块中的块级元素横向排布时，利用 auto 属性可以将包含块中子元素水平居中，这个和 text-align
所表示的内容块水平居中不同。

范例：

    <div style="width:100px;height:100px;background:red;">
        <div style="width:30px;height:30px;background:green;margin:auto;"></div>
    </div>//将内层 DIV 水平居中
结果：
<div style="width:100px;height:100px;background:red;">
    <div style="width:30px;height:30px;
                background:green;margin:auto;
    "></div>
</div>

## 垂直边距的合并
举例：

    <ul style="border:1px solid red;">
    <li style="border:1px solid red;margin-bottom:10px;">1</li>
    <li style="border:1px solid red;margin-top:15px;margin-bottom:-6px;">2</li>
    <li style="border:1px solid red; margin-top:6px;margin-bottom:-6px;">3</li>
    <li style="border:1px solid red; margin-top:-6px;">4</li>
    </ul>

结果：
<ul style="border:1px solid red;">
<li style="border:1px solid red;margin-bottom:10px;">1</li>
<li style="border:1px solid red;margin-top:15px;margin-bottom:-6px;">2</li>
<li style="border:1px solid red; margin-top:6px;margin-bottom:-6px;">3</li>
<li style="border:1px solid red; margin-top:-6px;">4</li>
</ul>

通过上面的例子得出垂直合并的如下规则：
1. 若上下边距都为正，择取大者作为边界
2. 若有负外边距则上下边距相加的结果作为边距值

## 行内元素排布
在 HTML 元素中文本内容都会生成行框，行框是容纳文本内容的区域大小由 line-height 确定
该属性具有继承功能，以下讲解生成行框的详细过程
> 匿名文本：在包含块中未被标签所包含的文本内容
范例：

    <div>123<span>456</span></div>
    //其中 123 属于包含块 div 但是由于未被 span 包含所以属于匿名文本

> em 框：由元素的 font-size 属性确定高度，其他的字体属性可以更改字体外形

> em 框注意事项：
>> 1. 元素框并不是整个字形的大小，字形在元素框内，由字库确定大小
>> 2. 元素的基线信息封装在字库中

> 内容区：对于非文本的替换元素例如图片，是指整个替换元素盒模型大小，而对于文本就是指 em 框。
> 行内框：对于 em 元素就是指 line-height 的大小，而对于替换元素就是内容区大小

> 行内框注意事项
>> 1.有的时候当 line-height 的值小于 font-size 到一定程度时，用户代理会忽略该属性，此时
行内框大小由用户代理指定

> 基线：这里的基线包括 em 框的基线，和行框的基线
> 基线说明
>> 1. 行框的基线就是其父元素 x 所处的底端
>> 2. em 框的基线就是字体中 x 元素的底端
>> 3. 替换元素没有基线的概念但可以认为其基线就是盒模型的底端

> **行框**：是由每个元素所对应的行内框所组成，行框的上边缘为行内框中最高的上边沿，下边沿为行内框中最低的下边沿，

> 行内元素的对齐规则:
>> * 水平方向: 上依据各元素框的大小直接叠加，
>> * 垂直方向: 按照父元素的基线排列个元素块，若元素块定义了非基线的排布方式则按照定义的排布注意排列。

**详细步骤**：
1. 得到各元素的行内框高度
> * 非替换元素根据 em 框和 line-height 的值计算行内框大小
> * 替换元素更据元素的 height 和 width 及边框和内外边距来计算，相当于整个和模型的大小。
2. 计算出各行内框高度后，根据按照其 vertical-align 属性进行对齐，默认为基线对齐。
> * 父元素基线确定：各行内框元素对齐在它的父元素基线上，父元素的基线是由用户代理决定的，若规定了 line-height 的
高度则用户代理会根据行高确定基线位置，若未定义行高则基线位置是无法确定的，一般情况下我们认为,父元素的基线为它所包含
的 x 子母的下边界确定。由于这种不确定性在文本设计时，建议采用 1.5 em 来进行文本的书写。
> * 各行内框元素基线的确定：对于非替换元素是由字体 fone-size 和 font-family 决定的，基线等信息被写在字库中，我们无法确认。
> * 对于替换元素是没有基线的概念的此时我们将其盒模型的底端当作基线和父元素基线对齐。
3. 在确定了父元素基线，和各元素行内框基线后就可以计算父元素行框大小了，根据上面行框的定义即可求得行框的大小，一般认为行框，即为父元素
的边框位置，而父元素内容区即为其默认元素的 line-height 的高度。注意这里的区别。
4. 在计算初上述位置后就可以依照 vertical-align 的值来确定各行内框相对于其行框所对应的位置，这里需要说明的是，行框的高度会随着垂直对齐的
位置而发生改变，这种改变由用户代理决定。记住该属性不会影响块级元素的对齐。

**其他需要注意的事项：**
> 在使用字体和行高时尽量保证行高大于字体高度，若出现字体过小或行高远小于字体高度时，上述规则会部分失效，
由用户代理来决定到底该如何处理上述问题。

属性重点讲解 vertical-align 对齐
1. 居中对齐的参考点是 0.5 ex ex 是指小写字母 x 字符高度的一半及 x 字符交叉点到字符下边的距离，而不是
em 的高度。这里需要记住。
2. 在对对齐时利用 x 字符可以检查对齐是否符合实际对其情况。



内容区：是指容纳文本的区块

行间距：行高减去文本尺寸/2 的值

行内框：行内框高度等于 line-height

行框：是指最高行内框上边界和最低行内框下边界所围成的区域

行内容区高度确定步骤：

1. 确定个行内框的高度及上下边距
> a. 通过 line-height 算出行高，将其均分到字符框的上下边界则构成了行内框。
> b. 得到各替换元素的信息把他们加载一起

2. 将所有内容按照样式摆放在本行的基线上

3. 对于指定了垂直对齐的元素，将其按照格式在文本基线上进行偏移

4. 最后根据各行内框计算行内容区高度

可以认为 line-height 属性相当于规定了每一行元素的高度

举例：

    <span style="line-height:12px;">1234534<big>567</big></span>

<span style="line-height:12px;border:1px solid red">
1234534<strong style="font-size:24px;border:1px solid yellow;line-height:24px;">567
</strong></span><br>
<span style="line-height:12px;border:1px solid red">
1234534<strong style="line-height:px;font-size:24px;border:1px solid yellow;">567
</strong></span>

## 浮动和定位
定位的意义在于修改元素框自身所处位置满足设计者对于界面布局的需求。
浮动元素的包含块是其最近的块级祖先元素。

**float**
实现元素在包含块中的左右浮动

**clear**
清除浮动元素在某一边的浮动特性

### 定位元素
**position**
* static 正常文档流排布，块级元素生成块级框，行内元素生成行内框
* relative 相对于其包含块定位
* absolute 相对于祖先非 static 的元素定位，如果没有则相对于窗口定位
* fixed 相对于视窗本身进行定位
定位相对包含框详解：
根元素的包含块为视窗大小。
**偏移属性**
使用 top、right、left、bottom 实现上下左右的相对偏移位置的确定。
行框的内容区为字符框大小

## 表布局的实践
### 如何确定表元素的布局
1. 利用标签实现表元素的布局
采用 HTML 标签实现
2. 利用 DISPLAY 属性实现表布局
line-table 实现表的的申明
table-row 实现行定义
### 布局原则
以行为主，列的样式受限
### 表层渲染原则
渲染树按照 单元格-行-行组-列-列组-表 的层级进行图层
## 列表与生成内容
1. 理解列表的正确含义
非描述性罗列文本， 恰当组织文档结构
### 列表属性描述
list-style-type 实现前缀的定义
list-style-img 实现图像前缀的定义
list-style-position 确定标签在行内还是行外
list-style 综合属性实现前面的一起定义

<ul >
    <li style="list-style-type: upper-roman">条目一1</li>
    <li style="list-style-type: cjk-ideographic">条目一2</li>
    <li style="list-style-type: georgian;list-style-position: inside">条目一3</li>
    <li style="list-style: square inside">条目一4</li>
</ul>

### 列表布局 ###
可以看到以下列表的布局实现中，标志的位置是无法确定的。

<ul style = "border:1px green">
    <li style = "border:1px red solid">条目1</li>
    <li style = "border:1px red solid">条目2</li>
    <li style = "border:1px red solid">条目3</li>
    <li style = "border:1px red solid">条目4</li>
</ul>

伪元素中使用的 content 属性只代生成内容

### 计数器的使用及实现 ###
counter-reset - 计数复位标签 
counter-increment - 计数增加标签
CSS 的标签定义不仅仅适用于 HTML, 为了使 XML 这样的非语义化标签具有结构特性，利用 CSS 的属性来实现这个过程。所以需要区分属性是针对何种文本类型而设计的。
**可以利用计数器实现文章标题效果**

举例：
