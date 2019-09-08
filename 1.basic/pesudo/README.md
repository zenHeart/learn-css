伪元素可以补充 DIV 的实现,
使用时注意如下特点。

1. 伪元素必须设置 **content** 属性为非 `none` 才会显示
详见 [content](https://www.w3.org/TR/CSS2/generate.html#content)
2. 伪元素默认为 `inline` 元素
3. 查看 [one div](https://a.singlediv.com/) 实现了利用一个 DIV
结合伪元素生成多种图形功能
4. 伪元素和实体元素之间产生空隙必须设置
为 `aboslute`