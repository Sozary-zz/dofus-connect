import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueMaterial from 'vue-material'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material-design-icons/styles.css'
import 'vue-material/dist/theme/default-dark.css'


Vue.use(VueAxios, axios)
Vue.use(VueMaterial)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')