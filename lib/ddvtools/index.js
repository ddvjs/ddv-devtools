'use strict'
/* global chrome:true */
import Vue from 'vue'
import ddvtoolsApp from './ddvtoolsApp.vue'
import router from './router'
var isInit = false
const port = chrome.runtime.connect({
  name: 'ddvtools'
})
const ddvtools = {
  tabId: 0,
  app: new Vue({
    el: '#ddvtoolsAppRootElementBox',
    router,
    render (h) {
      return h(ddvtoolsApp)
    }
  }),
  _init () {
    if (isInit) {
      return
    }
    isInit = true
  }
}

Vue.config.productionTip = false
ddvtools._init()
// 导出模块
export default ddvtools
