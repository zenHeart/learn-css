# transition

过渡属性，控制 css 属性渐变分隔


合法的动画属性

* [css property](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties)


## 知识点
1. **transition-delay**
  1. 默认值为 0 理解触发
  2. 正值必须状态超过 delay 时间才触发，动画执行在满足触发后会延迟执行
  3. 负值会超前执行，若超出动画持续时间则直接切换到结束状态
  4. list 可使用 delay 触发各选项出现时机
2. **transition-duraiton** 设置动画时间
   1. 默认为 0
   2. 逗号分隔多个值，每个值对应 duration-property 顺序
   3. duration-property 为 all 时的效果？？？
