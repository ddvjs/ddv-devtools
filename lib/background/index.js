'use strict'
/* global chrome:true */
const ddvBackground = window.ddvBackground = Object.create(null)

Object.assign(ddvBackground, {

})

chrome.runtime.onConnect.addListener(port => {
  console.log('port',port)
  port.postMessage({'ddd':'ss'})
  port.onMessage.addListener(msg=>{
  	console.log(msg)
  })
  port.onDisconnect.addListener(msg=>{
  	console.log('onDisconnect',msg)
  })
})
console.log('xxxx34',chrome.extension.getURL(''))

