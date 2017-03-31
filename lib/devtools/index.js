'use strict'
/* global chrome:true */
import Vue from 'vue'
import devtoolsApp from './devtoolsApp.vue'
// 引入 events 模块
const events = require('events')
// 创建 eventEmitter 对象
const ddvDevtools = window.ddvDevtools = new events.EventEmitter()
var isInit = false
const isChromeDevtools = typeof chrome !== 'undefined' && chrome && chrome.runtime && chrome.devtools && chrome.devtools.inspectedWindow
Object.assign(ddvDevtools, {
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
    var onDisconnect, timer, onMsgPortBindPort
    this.protMsgLastTime = new Date()
    // 标签id
    this.tabId = chrome.devtools.inspectedWindow.tabId
    // 试图建立连接
    try {
      // 建立连接
      this.port = chrome.runtime.connect({
        name: 'devtools-tabId-' + this.tabId
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
    // 消息
    onMsgPortBindPort = onMsgPort.bind(this.port)
    // 监听消息事件
    this.port.onMessage.addListener(onMsgPortBindPort)
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
      if (((new Date()) - this.protMsgLastTime) > (50 * 1000)) {
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
    }, 3500)
  },
  _onPortDisconnect () {
    clearTimeout(this.reConnectPortTimer || 0)
    this.reConnectPortTimer = setTimeout(() => {
      isChromeDevtools && this._initByChromeDevtools && this._initByChromeDevtools()
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
  ddvDevtools.protMsgLastTime = new Date()
  ddvDevtools.emit('portMessage', msg, this)
}
// 消息
ddvDevtools.on('portMessage', (msg, port) => {
  if (msg && msg.type && msg.action) {
    if (!ddvDevtools.emit('portMessage::' + msg.type + '::' + msg.action, msg, port)) {
      console.log('ddvDevtools-portMessage', msg, port)
    }
  } else {
    console.log('ddvDevtools-portMessage', msg, port)
  }
})
// 心跳-pong
ddvDevtools.on('portMessage::background::pong', (msg, port) => {
  ddvDevtools.tabId = msg && msg.tabId || ddvDevtools.tabId || 0
})

Vue.config.productionTip = false

ddvDevtools._init()
// 导出模块
export default ddvDevtools
