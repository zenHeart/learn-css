<template>
  <details>
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
      <summary>
        mixin 中使用 {block} 变量扩展混入时传入的内容
        <ol>
          <li>
            <strong>定义混入时使用 {block} 插入混入内容</strong>
          </li>
          <li>
            <strong>采用 +混入名 引用内容</strong>
          </li>
        </ol>
      </summary>
      <p class="title">
        <span class="tag">a</span>
      </p>
      <span class="tag">a</span>
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

<style lang="stylus" scoped>
// 块混入示例
tag()
  .tag
    display inline-block
    padding 2px 10px
    background silver
    color red
    // 使用 block 插入覆盖内容
    {block}

tag()
.title
  +tag()
    background gray
    color green


</style>