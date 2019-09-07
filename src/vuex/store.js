import Vue from 'vue'
import Vuex from 'vuex'
// import { request } from '@/utils/request'
// import config from '@/config'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userinfo: {},
    hasLogin: false,
    route: '',
    previewImg: false,
    initCard: false
  },
  mutations: {

  },
  actions: {
    // getBookListAction: async ({commit}, type) => {
    //   console.log('type', type)
    //   const a = await request('http://localhost:4000').catch(err => {
    //     console.log('err', err)
    //   })
    //   console.log(a)
    //   const url = `${config.host}/word/getBookList?type=${this.tpyeInfo.title}`
    //   const res = await request(url)
    //     .catch(err => {
    //       throw err
    //     })
    //   return res
    // }
  }
})

export default store
