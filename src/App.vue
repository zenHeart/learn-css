<template>
  <div>
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
details 
  padding 10px
</style>