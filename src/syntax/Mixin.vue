<template>
  <details open>
    <summary>混入 mixin</summary>
    <details>
      <summary>
        采用 mixin 定义可复用的代码片段,
        <strong>mixin 使用时可以省略 () 括号</strong>
      </summary>
      <p class="n2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam, sed?</p>
      <p class="n3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam, sed?</p>
    </details>
    <details>
      <summary>采用 mixin 定义可复用的代码片段,实例 2 表格复用片段</summary>
      <table>
        <tr>1</tr>
        <tr>2</tr>
        <tr>3</tr>
        <tr>4</tr>
      </table>
    </details>
    <details>
      <summary>使用多层嵌套的 mixin</summary>
      <span class="highlight-label">danger label</span>
    </details>
  </details>
</template>

<script>
  export default {
    
  }
</script>

<style lang="stylus" scoped>
ellipse(line = 2)
  overflow hidden
  display -webkit-box
  -webkit-line-clamp line
  -webkit-box-orient vertical
  word-wrap break-word

.n2,.n3
  border 1px solid #000
.n2
  width 100px
  // 注意默认值时必须带括号否则无法识别
  ellipse()
.n3
  width 100px
  ellipse 4


stripe(even=gray,odd=silver)
  tr
    background odd
  tr:nth-child(even)
    background even

table
  stripe()
  width 50%
  text-align center



label()
  display inline-block
  padding 0 10px
  background gray
highlight()
  color red
  border 1px solid yellow
highlightLabel() 
  label()
  highlight()

.highlight-label 
  highlightLabel()
</style>