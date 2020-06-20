<template>
  <details open>
    <summary>选择器 selector</summary>
    <details>
      <summary>缩进表示规则集合</summary>
      <p class="indent">缩进表示规则集合</p>
    </details>

    <details>
      <summary>多行对其表示选择器组</summary>
      <p class="multi-line">换行表示选择器分组</p>
      <p class="multi-line1">test</p>
    </details>
  </details>
</template>

<script>
  export default {
    
  }
</script>

<style lang="stylus" scoped>


.indent
  border 1px solid #000

.multi-line
.multi-line1
  border 1px solid red

</style>