'use strict'
/* global chrome:true */
import Vue from 'vue'
import popupsApp from './popupsApp.vue'
var isInit = false
// 引入 events 模块
const events = require('events')
// 创建 eventEmitter 对象
const ddvPopups = window.ddvPopups = new events.EventEmitter()
const isChromePopups = typeof chrome !== 'undefined' && chrome && chrome.runtime
// const port = chrome.runtime.connect({
//   name: 'devtools-tabId-' + chrome.devtools.inspectedWindow.tabId
// })
chrome.browserAction.setIcon({
  path: chrome.extension.getURL('icons/128-devtools.png'),
  tabId: 19
}, function () {})
Object.assign(ddvPopups, {
  tabId: 0,
  app: new Vue({
    el: '#popupsAppRootElementBox',
    render (h) {
      return h(popupsApp)
    }
  }),
  _init () {
    if (isInit) {
      return
    }
    isInit = true
    this._initRun()
  },
  _initRun () {
    if (!isChromePopups) {
      console.error('isChromePopups is false')
      return
    }
    var onDisconnect, timer, onMsgPortBindPort
    this.onProtMsgLastTime = new Date()
    // 标签id
    // this.tabId = chrome.devtools.inspectedWindow.tabId
    // 试图建立连接
    try {
      // 建立连接
      this.port = chrome.runtime.connect({
        name: 'popups'
      })
      this.reTryConnectBackgroundPortNum = 0
    } catch (e) {
      if (++this.reTryConnectBackgroundPortNum < 5) {
        console.error('试图建立后台连接失败，正在进行第' + this.reTryConnectBackgroundPortNum + '次尝试重连\n请刷新本页面，否则DdvRestfulApi插件将无法正常运行')
        typeof this._onPortDisconnect === 'function' && this._onPortDisconnect()
      } else {
        // 刷新
        window.location.reload(true)
      }
      return
    }
    // 消息
    onMsgPortBindPort = onMsgPort.bind(this.port)
    // 监听消息事件
    this.port.onMessage.addListener(onMsgPortBindPort)
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
        this.port.onMessage.removeListener(onMsgPortBindPort)
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
      type: 'popups',
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
          type: 'popups',
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
      isChromePopups && this._initRun && this._initRun()
    }, 500)
  },
  sendToBackground (msg) {
    try {
      return Promise.resolve(this.port.postMessage(msg))
    } catch (e) {
      return Promise.reject(e)
    }
  }
})
const onMsgPort = function (msg) {
  ddvPopups.protMsgLastTime = new Date()
  ddvPopups.emit('portMessage', msg, this)
}

Vue.config.productionTip = false
console.log(chrome)

document.write('sss-1<br>')
var winBackgroundPage = chrome.extension.getBackgroundPage()
document.write('sss-2<br>')
if (winBackgroundPage) {
  document.write('sss-3<br>')
  // winBackgroundPage
}

ddvPopups._init()
// 导出模块
export default ddvPopups
