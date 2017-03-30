'use strict'
/* global chrome:true */
// 引入 events 模块
const events = require('events')
// 创建 eventEmitter 对象
const ddvBackground = window.ddvBackground = new events.EventEmitter()
// 集合
const ports = Object.create(null)
Object.assign(ddvBackground, {
  ports,
  rootUrl: chrome.extension.getURL('')
})
// 临时监听
const onPortMessageProxy = function onPortMessageProxy (msg) {
  ddvBackground.emit('portMessage', msg, this)
}
const contentStr = 'content'
const contentStrLength = contentStr.length
const devtoolsStr = 'devtools'
const devtoolsStrLength = devtoolsStr.length
// 当有连接连接的时候
chrome.runtime.onConnect.addListener(port => {
  var t
  port.tabId = (port && port.sender && port.sender.tab && port.sender.tab.id) || port.tabId || 0
  if (!port.tabId) {
    t = port.name && /tabId-([0-9]+)/.exec(port.name) || []
    if (t && t[1]) {
      port.tabId = t[1]
    }
    t = void 0
  }
  if (port.name && port.name.substr(0, contentStrLength) === contentStr) {
    port.type = contentStr
  } else if (port.name && port.name.substr(0, devtoolsStrLength) === devtoolsStr) {
    port.type = devtoolsStr
  }
  port.tabId = parseInt(port.tabId)
  // 监听
  port.onMessage.addListener(onPortMessageProxy.bind(port))
  // 移除
  port.onDisconnect.addListener(port => {
    var tabId, t, key
    try {
      for (tabId in ports) {
        t = ports[tabId]
        for (key in t) {
          if (t[key] === port) {
            delete t[key]
          }
        }
      }
    } catch (e) {}
    try {
      port.onMessage.removeListener(onPortMessageProxy)
    } catch (e) {}
  })
})

console.log('ddvBackground', ddvBackground)
ddvBackground.on('portMessage', (msg, port) => {
  if (msg && msg.type && msg.action) {
    if (!ddvBackground.emit('portMessage::' + msg.type + '::' + msg.action, msg, port)) {
      console.log('ddvBackground-portMessage', msg, port)
    }
  } else {
    console.log('ddvBackground-portMessage', msg, port)
  }
})
ddvBackground.on('portMessage::content::ping', (msg, port) => {
  port.postMessage({
    type: 'background',
    action: 'pong'
  })
})
ddvBackground.on('portMessage::devtools::ping', (msg, port) => {
  port.postMessage({
    type: 'background',
    action: 'pong'
  })
})

