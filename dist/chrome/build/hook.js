/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 45);
/******/ })
/************************************************************************/
/******/ ({

/***/ 45:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

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
/* harmony default export */ __webpack_exports__["default"] = content;

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

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgM2E1ZDYyNjMwYTI3NGJkYzMzYjUiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9odWEvRG9jdW1lbnRzL+WFtuS7lumhueebri9kZHYtZGV2dG9vbHMvbGliL2NvbnRlbnQvaG9vay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7OztBQ2hFWTs7QUFFWixJQUFJLE1BQU0sR0FBRyxLQUFLO0FBQ2xCLE1BQU0sT0FBTyxHQUFHO0VBQ2QsS0FBSyxDQUFDLEdBQUc7SUFDUCxJQUFJLE1BQU0sRUFBRTtNQUNWLE1BQU07S0FDUDtJQUNELE1BQU0sR0FBRyxJQUFJO0lBQ2IsSUFBSSxDQUFDLFFBQVEsRUFBRTtHQUNoQjtFQUNELFFBQVEsQ0FBQyxHQUFHO0lBQ1YsSUFBSSxZQUFZLEVBQUUsS0FBSztJQUN2QixJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxJQUFJLEVBQUU7O0lBRW5DLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7TUFDakMsSUFBSSxFQUFFLFNBQVM7S0FDaEIsQ0FBQzs7SUFFRixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENB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LEVBQUU7O0FBRWYsOERBQWUsT0FBTyIsImZpbGUiOiJob29rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNDUpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDNhNWQ2MjYzMGEyNzRiZGMzM2I1IiwiJ3VzZSBzdHJpY3QnXG4vKiBnbG9iYWwgY2hyb21lOnRydWUgKi9cbnZhciBpc0luaXQgPSBmYWxzZVxuY29uc3QgY29udGVudCA9IHtcbiAgX2luaXQgKCkge1xuICAgIGlmIChpc0luaXQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpc0luaXQgPSB0cnVlXG4gICAgdGhpcy5faW5pdFJ1bigpXG4gIH0sXG4gIF9pbml0UnVuICgpIHtcbiAgICB2YXIgb25EaXNjb25uZWN0LCB0aW1lclxuICAgIHRoaXMub25Qcm90TXNnTGFzdFRpbWUgPSBuZXcgRGF0ZSgpXG4gICAgLy8g5bu656uL6L+e5o6lXG4gICAgdGhpcy5wb3J0ID0gY2hyb21lLnJ1bnRpbWUuY29ubmVjdCh7XG4gICAgICBuYW1lOiAnY29udGVudCdcbiAgICB9KVxuICAgIC8vIOebkeWQrOa2iOaBr+S6i+S7tlxuICAgIHRoaXMucG9ydC5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIob25Nc2dQb3J0KVxuICAgIC8vIOaWreW8gOi/nuaOpeS6i+S7tlxuICAgIG9uRGlzY29ubmVjdCA9ICgpID0+IHtcbiAgICAgIHRpbWVyICYmIGNsZWFySW50ZXJ2YWwodGltZXIpXG4gICAgICBpZiAoIW9uRGlzY29ubmVjdCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIOivleWbvuaWreW8gFxuICAgICAgICB0aGlzLnBvcnQuZGlzY29ubmVjdCAmJiB0aGlzLnBvcnQuZGlzY29ubmVjdCgpXG4gICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgdHJ5IHtcbiAgICAgICAgLy8g56e76Zmk5raI5oGv55uR5ZCs5LqL5Lu2XG4gICAgICAgIHRoaXMucG9ydC5vbk1lc3NhZ2UucmVtb3ZlTGlzdGVuZXIob25Nc2dQb3J0KVxuICAgICAgICAvLyDnp7vpmaTmlq3lvIDnm5HlkKzkuovku7ZcbiAgICAgICAgdGhpcy5wb3J0Lm9uRGlzY29ubmVjdC5yZW1vdmVMaXN0ZW5lcihvbkRpc2Nvbm5lY3QpXG4gICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgLy8g5pat5byA6L+e5o6lXG4gICAgICB0cnkge1xuICAgICAgICAodHlwZW9mIHRoaXMuX29uUG9ydERpc2Nvbm5lY3QgPT09ICdmdW5jdGlvbicpICYmIHRoaXMuX29uUG9ydERpc2Nvbm5lY3QoKVxuICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgIC8vIOa4heeQhlxuICAgICAgb25EaXNjb25uZWN0ID0gdGltZXIgPSB2b2lkIDBcbiAgICB9XG4gICAgLy8g5re75Yqg5pat5byA6L+e5o6l5LqL5Lu255uR5ZCsXG4gICAgdGhpcy5wb3J0Lm9uRGlzY29ubmVjdC5hZGRMaXN0ZW5lcihvbkRpc2Nvbm5lY3QpXG4gICAgLy8g5Yid5aeL5YyWXG4gICAgdGhpcy5wb3J0LnBvc3RNZXNzYWdlKHtcbiAgICAgIHR5cGU6ICdjb250ZW50JyxcbiAgICAgIGFjdGlvbjogJ2luaXQnXG4gICAgfSlcbiAgICAvLyDlrprml7blmahcbiAgICB0aW1lciA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIGlmICgoKG5ldyBEYXRlKCkpIC0gdGhpcy5vblByb3RNc2dMYXN0VGltZSkgPiAoNTAgKiAxMDAwKSkge1xuICAgICAgICAvLyA1MOenkumDveayoeaciemAmuiur1xuICAgICAgICByZXR1cm4gKHR5cGVvZiBvbkRpc2Nvbm5lY3QgPT09ICdmdW5jdGlvbicpICYmIG9uRGlzY29ubmVjdCgpXG4gICAgICB9IGVsc2UgaWYgKCEob25EaXNjb25uZWN0ICYmIHRpbWVyKSkge1xuICAgICAgICByZXR1cm4gKHR5cGVvZiBvbkRpc2Nvbm5lY3QgPT09ICdmdW5jdGlvbicpICYmIG9uRGlzY29ubmVjdCgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNlbmRUb0JhY2tncm91bmQoe1xuICAgICAgICAgIHR5cGU6ICdjb250ZW50JyxcbiAgICAgICAgICBhY3Rpb246ICdwaW5nJ1xuICAgICAgICB9KS5jYXRjaChlID0+IHtcbiAgICAgICAgICAodHlwZW9mIG9uRGlzY29ubmVjdCA9PT0gJ2Z1bmN0aW9uJykgJiYgb25EaXNjb25uZWN0KClcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9LCAxNTAwKVxuICB9LFxuICBfb25Qb3J0RGlzY29ubmVjdCAoKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMucmVDb25uZWN0UG9ydFRpbWVyIHx8IDApXG4gICAgdGhpcy5yZUNvbm5lY3RQb3J0VGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuX2luaXRSdW4gJiYgdGhpcy5faW5pdFJ1bigpXG4gICAgfSwgNTAwKVxuICB9LFxuICBfb25Qb3J0TXNnIChtc2cpIHtcbiAgICB0aGlzLm9uUHJvdE1zZ0xhc3RUaW1lID0gbmV3IERhdGUoKVxuICAgIGFsZXJ0KCdtc2cnICsgSlNPTi5zdHJpbmdpZnkobXNnKSlcbiAgfSxcbiAgc2VuZFRvQmFja2dyb3VuZCAobXNnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5wb3J0LnBvc3RNZXNzYWdlKG1zZykpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGUpXG4gICAgfVxuICB9XG59XG5jb25zdCBvbk1zZ1BvcnQgPSBmdW5jdGlvbiAobXNnKSB7XG4gIGNvbnRlbnQuX29uUG9ydE1zZyhtc2cpXG59XG5cbmNvbnRlbnQuX2luaXQoKVxuLy8g5a+85Ye65qih5Z2XXG5leHBvcnQgZGVmYXVsdCBjb250ZW50XG5cbi8qXG5cbmNvbnNvbGUubG9nKCdob29rJylcbnZhciBwb3J0ID0gY2hyb21lLnJ1bnRpbWUuY29ubmVjdCh7XG4gIG5hbWU6ICdjb250ZW50LXNjcmlwdCdcbn0pXG5wb3J0LnBvc3RNZXNzYWdlKHtqb2tlOiBcIktub2NrIGtub2NrXCJ9KTtcbnBvcnQub25NZXNzYWdlLmFkZExpc3RlbmVyKGZ1bmN0aW9uKG1zZykge1xuICAgIGlmIChtc2cucXVlc3Rpb24gPT0gXCJXaG8ncyB0aGVyZT9cIilcbiAgICAgICAgcG9ydC5wb3N0TWVzc2FnZSh7YW5zd2VyOiBcIk1hZGFtZVwifSk7XG4gICAgZWxzZSBpZiAobXNnLnF1ZXN0aW9uID09IFwiTWFkYW1lIHdobz9cIilcbiAgICAgICAgcG9ydC5wb3N0TWVzc2FnZSh7YW5zd2VyOiBcIk1hZGFtZS4uLiBCb3ZhcnlcIn0pO1xufSk7XG5jb25zb2xlLmxvZygyMzMsdGhpcylcblxuKi9cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL1VzZXJzL2h1YS9Eb2N1bWVudHMv5YW25LuW6aG555uuL2Rkdi1kZXZ0b29scy9saWIvY29udGVudC9ob29rLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==