# 媒体查询

**详解媒体查询的使用及注意事项**

-----

## 概述
媒体查询是 CSS3 新增属性,
可以通过对呈现网页设备的检查,来显示特定的样式类。基于该技术可以实现响应式布局。

## 基本语法
参看 [示例][font-change],当屏幕尺寸低于 375px 时。
字体会自动变大以适应小屏手机。

媒体查询的基本格式如下:

```
@media [逻辑操作符] [媒体类型] <媒体特征> {
	<css 规则>
}
```

当检测到符合对应媒体特征的设备时,在采用对应的 css 规则。媒体查询的学习重点就是各种媒体特征及的学习。

更具体的语法规则参见
* [@media 说明](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media#%E6%AD%A3%E5%BC%8F%E8%AF%AD%E6%B3%95)
* [媒体特征说明](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Media_queries#%E4%BC%AA%E8%8C%83%E5%BC%8F)

### 引用方式
可以采用如下方式引入媒体查询

1. 采用 `@media` 和 `@import` 指令
2. 利用标签的 `media` 熟悉
	```html
	<h1 media="(max-width:320px) { }">
	```
3. 使用 `Window.matchMedia` 或 `MediaQueryList.addListener` 方法


### 媒体类型
支持如下媒体类型

* `all` 适用于所有设备,默认值
* `print` 打印设备,或者页面在预览模式下的样式
* `screen` 屏幕设备
* `speech` 语音设备

参见 [打印模式][print] 利用 print 实现在打印模式下样式的修改。

### 逻辑操作符
可以采用逻辑操作符组合多条媒体查询规则,
完成复杂逻辑判断。典型的操作符包括:

* `and` 与逻辑类似 `&&` 
* `or` 或逻辑类似 `||`
* `not` 取反类似 `!`
* `only` 防止老旧的浏览器不支持带媒体属性的查询而应用到给定的样式
* `,` 类似 `or` 逻辑



## 媒体特征
媒体查询的核心就是各种媒体特征。
通过组合这些特征来匹配特定设备应用相应的 css 特性。

### 特征前缀
大部分的媒体查询属性都支持如下前缀。

* `max-` 表示符合媒体查询属性的最大匹配值
* `min-` 表示符合媒体查询属性的最小匹配值

### 特征属性
媒体查询支持参考 [mdn 媒体特征](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media#%E5%AA%92%E4%BD%93%E7%89%B9%E6%80%A7) 如下表

* `height` 输出设备渲染区域高度,支持前缀
* `width` 输出设备渲染区域宽度,支持前缀
* `orientation` 判断设备横竖屏,`landscape` 横屏,`portrait` 竖屏
* `color` 指定设备的颜色单元的位数限制,**注意不支持某颜色单元则位数为 0,若均支持则取显示位数最小的颜色单元**,支持前缀
* `color-index` 指定设备的支持的颜色数量,支持前缀
* `aspect-ratio` 设备显示区域宽高比,支持前缀
* `device-aspect-ratio` 描述设备宽高比,支持前缀
* `device-height` 设备高度,支持前缀
* `device-width` 设备宽度,支持前缀
* `grid` 判断输出设备是网格设备还是位图设备,默认为网格设备
* `monochrome` 黑白（灰度）设备每个像素的比特数
* `resolution` 分辨率,屏幕为像素密度,打印机为 dpi
* `scan` 电视输出设备的扫描过程
* 


## 测试媒体查询
除了采用 css 监测媒体变化,还可使用 js 监听媒体查询。
参考 [测试媒体查询](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Testing_media_queries) 具体步骤如下

1. 利用 [matchMedia](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/matchMedia) 方法注册需要监听的媒体特征
2. 上述方法会返回 [MediaQueryList](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaQueryList) 对象,检查 `matches` 属性可以判断是否检查成功
3. 此外可以利用返回对象的 `addListener` 和 `removeListener` 方法挂载监听事件。

具体使用参看 [示例][test-media]


## 延伸阅读
* [css 媒体查询规范](https://www.w3.org/TR/css3-mediaqueries/)
* [mdn @media](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media#%E6%AD%A3%E5%BC%8F%E8%AF%AD%E6%B3%95)


[font-change]: ../examples/media-query/1.font-change.html
[print]: ../examples/media-query/print.html
[test-media]:  ../examples/media-query/test-media.html

