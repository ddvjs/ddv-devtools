'use strict'
/* global chrome:true */
// 引入 events 模块
const events = require('events')
// 创建 eventEmitter 对象
const ddvContent = window.ddvContent = new events.EventEmitter()
var isInit = false
Object.assign(ddvContent, {
  tabId: 0,
  reTryConnectBackgroundPortNum: 0,
  _init () {
    if (isInit) {
      return
    }
    isInit = true
    this._initRun()
  },
  _initRun () {
    var onDisconnect, timer, onMsgPortBindPort
    this.protMsgLastTime = new Date()
    // 试图建立连接
    try {
      // 建立连接
      this.port = chrome.runtime.connect({
        name: 'content'
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
      type: 'content',
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
          type: 'content',
          action: 'ping',
          tabId: this.tabId
        }).catch(e => {
          (typeof onDisconnect === 'function') && onDisconnect()
        })
      }
    }, 3500)
  },
  _onPortDisconnect () {
    clearTimeout(this.reConnectPortTimer || 0)
    this.reConnectPortTimer = setTimeout(() => {
      this._initRun && this._initRun()
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
  ddvContent.protMsgLastTime = new Date()
  ddvContent.emit('portMessage', msg, this)
}
// 消息
ddvContent.on('portMessage', (msg, port) => {
  if (msg && msg.type && msg.action) {
    if (!ddvContent.emit('portMessage::' + msg.type + '::' + msg.action, msg, port)) {
      console.log('ddvContent-portMessage', msg, port)
    }
  } else {
    console.log('ddvContent-portMessage', msg, port)
  }
})
// 心跳-pong
ddvContent.on('portMessage::background::pong', (msg, port) => {
  ddvContent.tabId = msg && msg.tabId || ddvContent.tabId || 0
})
// 初始化
ddvContent._init()
// 导出模块
export default ddvContent
