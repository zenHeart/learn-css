<template>
  <div class="container">
    <components v-for="val in mountComponents" :is="val" :key="val.name"></components>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  computed: {
    mountComponents() {
      return this.$root.components
    }
  }
}
</script>
<style lang="stylus">
detail(conterName=counter,prefix ='')
  counter-reset conterName
  {prefix}details
    padding 10px
    counter-increment conterName
    {prefix}summary
      list-style none
      &::before
        content counter(conterName) '.'
        padding-right 10px
    {block}
  
.container
  +detail(concept,'>')
    detail(example)
        


</style>