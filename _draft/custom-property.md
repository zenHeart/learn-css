# css 自定义属性

## 什么是自定义属性
css 自定义属性是前缀 `--` 开头的属性。
可以利用自定义属性实现 css 中设置变量的效果。


## 如何使用自定义属性
1. 定义自定义属性
   
   ```css
   :root {
     --warn: red;
   }

   ```

   > 注意如下两点
   > **1. 自定义属性必须使用 -- 开头**
   > **2. 自定义属性类似变量所以大小写敏感**

2. 使用 `var(属性名)`引用自定义属性

  ```css
  .warn {
    color: var(--warn)
  }
  ```

示例参见 [基本使用](../docs/examples/customer-property/basic-use.html)


## 核心特性
### 组合自定义属性
可以在定义自定义属性时依赖其他的自定义属性。

```css
:root {
  --main-color: #c06;
  --accent-background: linear-gradient(to top, var(--main-color), white);
}
```

参见示例 [嵌套使用自定义属性](../docs/examples/customer-property/rely-other-depency.html)


### 属性名作用域
属性名作用域取决于申明环境,可以在子元素内覆盖属性, 重置子元素样式 。 该操作不影响父元素的值的属性。

```css
.parent {
  --warn: red;
}
.children {
  /* 该操作只会覆盖 children 元素下的效果,对其他子元素任为父元素设定的属性值 */
  --warn: orange;
}
```
参见示例 [子元素属性值覆盖](../docs/examples/customer-property/customer-scope.html)


### var
**`var(自定义属性名,默认值)` 当自定义属性值不存在时,支持传入第二个参数作为默认值。**

```css
.warn {
  /* 若未检测到变量使用默认值 */
  color: var(--warn, red)
}
```

参见示例 [var 默认值](../docs/examples/customer-property/var-default.html)


var 只能作为值替代,不允许替换属性名。

```css
:root {
  --prop: color
}

.warn {
  /* 非法只能作为值 */
  var(--prop): red
}
```

var 的结果可以部分替换属性值。

```css
:root {
  --border-color: red;
}

div {
  border: 1px solid var(--border-color)
}
```

当 var 的结果为数值时,不支持直接合并 `px` 等单位, 单可利用 `calc` 函数组合运算。

```css
nav {
  --width: 100;
  /* 非法 */
  width: var(--width)px;
}

/* 利用 calc 组合运算 */
:root {
  --nav-width: 100px;
}
.content {
  width: calc( 100% - var(--nav-width) )
}
```

参见示例 [calc 处理 var 数值]()

## js 使用自定义属性
```js
// 获取内联样式属性名
element.style.getPropertyValue("--my-var");

// 获取该元素所有定义的属性名
getComputedStyle(element).getPropertyValue("--my-var");

// 设置元素的属性名
element.style.setProperty("--my-var", 4);
```

参见示例 [js 控制属性名](../docs/examples/customer-property/js-control-property.html)



## 代办事项
* [ ] 不支持嵌套

## 参考资料
* [CSS Custom Properties for Cascading Variables Module Level 1](https://drafts.csswg.org/css-variables/#defining-variables)