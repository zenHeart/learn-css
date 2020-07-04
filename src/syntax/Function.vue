<template>
  <details open>
    <summary>
      函数 function,
      <strong>函数相比混入可以提供不同粒度的复用</strong>
    </summary>
    <details>
      <summary>采用函数定义属性值</summary>
      <p>
        <span class="sp">函数的结果作为属性的值,支持运算</span>
      </p>
    </details>
    <details>
      <summary>函数默认参数,入参支持传入函数</summary>
      <span class="sp1">入参赋值支持调用函数</span>
    </details>

    <details>
      <summary>支持具名参数,在执行函数时可以改变通过名字传入值,可改变传参顺序</summary>
      <span class="sp2">test</span>
    </details>
  </details>
</template>

<script>
  export default {
    
  }
</script>


<style lang="stylus" scoped>
// 定义值, 返回结果作为值
addPadding(a,b)
  a + b
mulit(a,b)
  a*b
.sp 
  font-size 12px
  padding addPadding(1px, 2)
  border 1px solid #000
.sp1 
  font-size 12px
  padding addPadding(1px, mulit(2px,2))
  border 1px solid #000
</style>

<style lang="stylus" scoped>
subract(a,b)
  a - b
.sp2
  padding-left subract(b:10px,a:20px)
  border 1px solid #000

</style>