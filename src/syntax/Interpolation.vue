<template>
  <details open>
    <summary>插入 interpolation</summary>
    <details>
      <summary>替换多个值,使申明语义化</summary>
      <div class="replace">
        <span class="p1">1</span>
        <span class="p2">2</span>
        <span class="p3">3</span>
      </div>
    </details>
    <details>
      <summary>循环中使用 {} 替换局部变量</summary>
      <div class="loop">
        <span class="p1">1</span>
        <span class="p2">2</span>
        <span class="p3">3</span>
      </div>
    </details>
  </details>
</template>

<script>
  export default {
    
  }
</script>


<style lang="stylus" scoped>
.loop
  for row in  1 2 3
    .p{row}
      padding-right 20px *row


label='.p1,.p2,.p3'

.replace
  {label}
    display inline-block
    background gray
    color red
    padding 0 10px
    margin-right 10px
    border-radius 4px
</style>