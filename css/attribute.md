# CSS 属性表详解
## 定位
### 视窗平面定位属性
pisition
top
right
bottom
left<br>
利用位置和相对各包含块距离定位元素决定了元素在视窗中的位置
### 垂直定位属性
z-index<br>
决定了元素在 z 轴的层叠次序

### 裁剪属性
clip<br>
不属于定位属性决定了定位后的元素若溢出包含块，溢出区域的处理问题

## 布局
### 元素显示特性属性
display
visibility
overflow
overflow-x
overflow-y<br>
这些属性决定了元素以何种模型进行显示，单元素自身特性不会发生变化
### 元素显示特性属性
float
clear<br>
元素排布特性决定了元素以何种方式进行对齐，可以理解为特殊定位
## 尺寸
width
min-width
max-width
height
min-height
max-height<br>
盒模型尺寸属性，注意只针对块元素，和以块元素显示的行内元素。
## 外边距
margin
margin-top
margin-right
margin-bottom
margin-left<br>
就是盒模型外边距属性对表格不适用

##内边距
padding
padding-top
padding-left
padding-bottom
padding-left<br>
就是盒模型内边距属性对表格不适用
## 边框
### 整体边框属性
border
border-width
border-style
border-color<br>
这一组元素用于设置整体边框的某个方面，宽度、线型、颜色注意 border 属性只能整体定义

### 单边边框属性定义分为上、右、下、左四组
border-top
border-top-width
border-top-style
border-top-color

border-right
border-right-width
border-right-style
border-right-color

border-bottom
border-bottom-width
border-bottom-style
border-bottom-color

border-left
border-left-width
border-left-style
border-left-color

### 圆角边框属性
border-radius
border-top-left-radius
border-top-right-radius
border-bottom-right-radius
border-bottom-left-radius<br>
分别定义了左上、右上、右下、左下四个边的圆角

### 定义了盒阴影
box-shadow用来产生阴影对于按钮这个属性非常有用

语法：

    box-shadow：none | <shadow> [ , <shadow> ]*
    <shadow> = inset? && <length>{2,4} && <color>?

属性值的意义：

阴影类型: 参数是可选如果不设值，其默认的投影方式是外阴影；如果取其唯一值“inset”,就是将外阴影变成内阴影，也就是说设置阴影类型为“inset”时，其投影就是内阴影；

X-offset: 是指阴影水平偏移量其值可以是正负值可以取正负值，如果值为正值，则阴影在对象的右边，反之其值为负值时，阴影在对象的左边；

Y-offset: 是指阴影的垂直偏移量，其值也可以是正负值，如果为正值，阴影在对象的底部，反之其值为负值时，阴影在对象的顶部；

阴影模糊半径: 此参数是可选，，但其值只能是为正值，如果其值为0时，表示阴影不具有模糊效果，其值越大阴影的边缘就越模糊；

阴影扩展半径: 此参数可选，其值可以是正负值，如果值为正，则整个阴影都延展扩大，反之值为负值是，则缩小

阴影颜色: 此参数可选，如果不设定任何颜色时，浏览器会取默认色，但各浏览器默认色不一样，特别是在webkit内核下的safari和chrome浏览器将无色，也就是透明，建议不要省略此参数。

使用说明: 每个阴影属性可以重复 1 - 4 次分别对应左上角、右上角、右下角、左下角每个阴影默认的大小即为盒的大小，注意阴影是占用盒模型空间的，所以在快对齐时，
左边的阴影会消失。可以利用外边距来解决这个问题。暂时将内部阴影理解为内边框。内外的区别在于内边框由外向里排列，外边框由里向外层叠。
[属性demo](http://css3gen.com/box-shadow/)
<div style="width:100px;height:100px;background:rgba(255,23,24,0.1);
           box-shadow: inset 0px  0px 0px 5px green,
                       inset  0px  0px 0px 10px cyan,
                       inset  0px  0px 0px 15px orange,
                       inset 0px  0px 0px 20px purple;
                       border:5px solid yellow;
                       margin:20px;"></div>

### 盒图像
border-image
border-image-source
border-image-slice
border-image-width
border-image-outset
border-image-repeat
利用 border 可以实现流动框的功能

语法：

    border-image：<' border-image-source '> || <' border-image-slice '>
    [ / <' border-image-width '> | / <' border-image-width '>?/ <' border-image-outset '> ]?
    || <' border-image-repeat '>

属性值的意义：

<' border-image-source '>：选择图像路径,及时设置 URL 可以采用绝对和相对地址。

<' border-image-slice '>：设置或检索对象的边框背景图的分割方式，分割将整个区域切成了9块，具体讲解见连接[分割](https://www.qianduan.net/css3border-image-bian-kuang-tu-xiang-xiang-jie/)。

<' border-image-width '>：设置或检索对象的边框厚度。这个属性和 border-width 相同

<' border-image-outset '>：设置或检索对象的边框背景图的扩展。没搞懂啊

<' border-image-repeat '>：设置或检索对象的边框图像的平铺方式。就是延伸和重复没有

补充：边框图像背景中最重要的是 slice 属性，将整个边框分为了九宫格，利用 fill 表示内容区，来进行映射。
[属性demo](http://www.css-generator.net/border-image/)

## 背景图片

background
background-color
background-image
background-repeat
background-attachment
background-position
background-origin
background-clip
background-size

利用背景产生花样文本，这个地方值得玩一下。

##
##
##
##
##
##
##
##
##
##
