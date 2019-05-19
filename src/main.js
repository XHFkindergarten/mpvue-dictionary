import Vue from 'vue'
import App from './App'
import { request } from './utils/request'
import store from './vuex/store'
import message from './utils/message'

Vue.config.productionTip = false
App.mpType = 'app'

Vue.prototype.$request = request
Vue.prototype.$store = store
Vue.prototype.$message = message

const app = new Vue(App)
app.$mount()
