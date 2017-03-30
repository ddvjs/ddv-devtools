'use strict'
/* global chrome:true */
import Vue from 'vue'
import devtoolsApp from './devtoolsApp.vue'
var isInit = false
const isChromeDevtools = typeof chrome !== 'undefined' && chrome && chrome.runtime && chrome.devtools && chrome.devtools.inspectedWindow
const devtools = {
  tabId: 0,
  app: new Vue({
    el: '#devtoolsAppRootElementBox',
    render (h) {
      return h(devtoolsApp)
    }
  }),
  _init () {
    if (isInit) {
      return
    }
    isInit = true
    if (isChromeDevtools) {
      this._initByChromeDevtools()
    } else {
      this._initByBrowserAction()
      console && console.log && console.info('initByBrowserAction')
    }
  },
  _initByBrowserAction () {
  },
  _initByChromeDevtools () {
    if (!isChromeDevtools) {
      console.error('isChromeDevtools is false')
      return
    }
    var onDisconnect, timer
    this.onProtMsgLastTime = new Date()
    // 标签id
    this.tabId = chrome.devtools.inspectedWindow.tabId
    // 建立连接
    this.port = chrome.runtime.connect({
      name: 'devtools-tabId-' + this.tabId
    })
    // 监听消息事件
    this.port.onMessage.addListener(onMsgPort)
    // 断开连接事件
    onDisconnect = () => {
      timer && clearInterval(timer)
      if (!onDisconnect) {
        return
      }
      try {
        // 试图断开
        this.port.disconnect && this.port.disconnect()
      } catch (e) {}
      try {
        // 移除消息监听事件
        this.port.onMessage.removeListener(onMsgPort)
        // 移除断开监听事件
        this.port.onDisconnect.removeListener(onDisconnect)
      } catch (e) {}
      // 断开连接
      try {
        (typeof this._onPortDisconnect === 'function') && this._onPortDisconnect()
      } catch (e) {}
      // 清理
      onDisconnect = timer = void 0
    }
    // 添加断开连接事件监听
    this.port.onDisconnect.addListener(onDisconnect)
    // 初始化
    this.port.postMessage({
      tabId: this.tabId,
      type: 'devtools',
      action: 'init'
    })
    // 定时器
    timer = setInterval(() => {
      if (((new Date()) - this.onProtMsgLastTime) > (50 * 1000)) {
        // 50秒都没有通讯
        return (typeof onDisconnect === 'function') && onDisconnect()
      } else if (!(onDisconnect && timer)) {
        return (typeof onDisconnect === 'function') && onDisconnect()
      } else {
        this.sendToBackground({
          tabId: this.tabId,
          type: 'devtools',
          action: 'ping'
        }).catch(e => {
          (typeof onDisconnect === 'function') && onDisconnect()
        })
      }
    }, 1500)
  },
  _onPortDisconnect () {
    clearTimeout(this.reConnectPortTimer || 0)
    this.reConnectPortTimer = setTimeout(() => {
      isChromeDevtools && this._initByChromeDevtools && this._initByChromeDevtools()
    }, 500)
  },
  _onPortMsg (msg) {
    this.onProtMsgLastTime = new Date()
    alert('msg' + JSON.stringify(msg))
  },
  sendToBackground (msg) {
    try {
      return Promise.resolve(this.port.postMessage(msg))
    } catch (e) {
      return Promise.reject(e)
    }
  }
}
const onMsgPort = function (msg) {
  devtools._onPortMsg(msg)
}

Vue.config.productionTip = false

devtools._init()
// 导出模块
export default devtools
