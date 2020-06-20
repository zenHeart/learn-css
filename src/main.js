import Vue from 'vue'
import App from './App.vue'
let components = {};

Vue.config.productionTip = false

const requireComponent = require.context('./syntax', false, /\w+\.vue$/)

requireComponent.keys().forEach(filename => {
  const componentConfig = requireComponent(filename)
  const componentName = filename.replace(/^\.\//, '').replace(/.\w+$/, '');
  const component = componentConfig.default || componentConfig;

  Vue.component(componentName, component)
  components[componentName] = component;
})

new Vue({
  render: h => h(App),
  data: {
    components
  }
}).$mount('#app')