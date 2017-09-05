---
title: bem    
tags: css rule      
birth: 2017-09-05      
modified: 2017-09-05      
---

bem
===
**前言:讲解 css bem 命名规范**

---

## 概述
BEM 是一套 css 组织规范.
相比原生 css 他解决了如下问题.
* 定义了一套 css 命名标准,增强 css 维护性

BEM 是`blocke,element,modifier` 的首字母缩写.

### block
块代表一个视图组件.
* 块按照组件功能命名,例如 `nav`
    ```html
    <!-- 正确 ,表示错误信息-->
    <div class="error"></div>
    
    <!-- 错误,只是说明了修饰,并未说明具体的功能 -->
    <div class="red-text"></div>
    ``` 
* 块不能影响布局环境
    * 不能在块的类中包含 `margin,position` 等影响视图的属性
* 块的命名之间使用 `-` 划线间隔
    
    
### element
元素是块的一部分,是组成组件的一个单元.

* 元素和块之间用 `__` 隔开
* 元素同样需要按照功能命名
    ```html
    <!-- 查找表单块 -->
    <form class="search-form">
        <!-- 查找表单块的输入元素 -->
        <input class="search-form__input">
    
        <!-- 查找表单块按钮 -->
        <button class="search-form__button">Search</button>
    </form> 
    ```
* 元素之间可以形成嵌套
    ```html
    <form class="search-form">
         <!--外层是元素内容区-->
        <div class="search-form__content">
            <input class="search-form__input">
    
            <button class="search-form__button">Search</button>
        </div>
    </form>
    
    <form class="search-form">
        <div class="search-form__content">
            <!--错误元素内容区内命名不应该在嵌套别的元素-->
            <input class="search-form__content__input">
    
            <!-- 推荐直接使用 search-form__button  或 search-form__content-button 来划分元素-->
            <button class="search-form__content__button">Search</button>
        </div>
    </form>
    ```
* 元素属于块不该独立存在

> 对于不依赖于其他结构的视图命名为块
> 无法对存在,依托于其他结构的视图创建为元素
> 不要让元素之间产生依赖,利用块将组件进一步细分

### Modifier
修改器描述块或元素的状态变化.

* 利用 `_` 隔开元素或块
* 常见的修改器类型
    * 布尔值
    ```html
    <!-- _focused 描述表单聚焦是的状态 -->
    <form class="search-form search-form_focused">
        <input class="search-form__input">
    
        <!-- _disabled 描述按键未使能状态 -->
        <button class="search-form__button search-form__button_disabled">Search</button>
    </form> 
    ```
    * 键值对`
    ```html
    <!--  -->
    <form class="search-form search-form_theme_islands">
        <input class="search-form__input">
    
        <!-- The `button` element has the `size` modifier with the value `m` -->
        <button class="search-form__button search-form__button_size_m">Search</button>
    </form>
    
    <!-- You can't use two identical modifiers with different values simultaneously -->
    <form class="search-form
                 search-form_theme_islands
                 search-form_theme_lite">
    
        <input class="search-form__input">
    
        <button class="search-form__button
                       search-form__button_size_s
                       search-form__button_size_m">
            Search
        </button>
    </form> 
    ```
* 修改器只会修改属性,而不是替换属性
    
### mixed
结合 bem 的规则.
实现组件的复用,逻辑如下.

```html
<!-- 标题头块 -->
<div class="header">
    <!--该结构既是搜索块,同样是标题块子元素-->
    <div class="search-form header__search-form"></div>
</div> 
```

* bem 避免了 css 对视图结构的依赖   

### 文档结构

* 块是根目录,元素是子目录,每个元素下对应 js,css
* 多级结构之间支持嵌套
```
search-form/                           # Directory of the search-form
    __input/                           # Subdirectory of the search-form__input
        search-form__input.css         # CSS implementation of the
        search-form__input.js          # JavaScript implementation of the
                                       # search-form__input element
    __button/                          # Subdirectory of the search-form__button
                                       # element
        search-form__button.css
        search-form__button.js

    _theme/                            # Subdirectory of the search-form_theme
                                       # modifier
        search-form_theme_islands.css  # CSS implementation of the search-form block
                                       # that has the theme modifier with the value
                                       # islands
        search-form_theme_lite.css     # CSS implementation of the search-form block
                                       # that has the theme modifier with the value
                                       # lite

    search-form.css                    # CSS implementation of the search-form block
    search-form.js                     # JavaScript implementation of the
                          
```

> 感觉该规则可以作为 css 依赖包管理,像 npm 一样安装 css 插件



