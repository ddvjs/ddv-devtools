'use strict'
/* global chrome:true */
function getSelectedTabIdByChrome () {
  return getSelectedTabByChrome().then(info => (info.id || info.tabId || 0))
}

function getSelectedTabByChrome () {
  return new Promise(function (resolve, reject) {
    try {
      chrome.tabs.getSelected(info => info ? resolve(info) : reject(new Error('get selected fail')))
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = {
  getSelectedTabIdByChrome,
  getSelectedTabByChrome
}
