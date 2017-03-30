'use strict'
/* global chrome:true */
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