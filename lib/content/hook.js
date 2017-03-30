'use strict'
/* global chrome:true */
var isInit = false
const content = {
  _init () {
    if (isInit) {
      return
    }
    isInit = true
    this._initRun()
  },
  _initRun () {
    var onDisconnect, timer
    this.onProtMsgLastTime = new Date()
    // 建立连接
    this.port = chrome.runtime.connect({
      name: 'content'
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
      type: 'content',
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
          type: 'content',
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
      this._initRun && this._initRun()
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
  content._onPortMsg(msg)
}

content._init()
// 导出模块
export default content

/*

console.log('hook')
var port = chrome.runtime.connect({
  name: 'content-script'
})
port.postMessage({joke: "Knock knock"});
port.onMessage.addListener(function(msg) {
    if (msg.question == "Who's there?")
        port.postMessage({answer: "Madame"});
    else if (msg.question == "Madame who?")
        port.postMessage({answer: "Madame... Bovary"});
});
console.log(233,this)

*/