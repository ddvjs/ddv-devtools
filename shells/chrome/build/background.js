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
/******/ 	return __webpack_require__(__webpack_require__.s = 110);
/******/ })
/************************************************************************/
/******/ ({

/***/ 110:
/***/ (function(module, exports) {

// the background script runs all the time and serves as a central message
// hub for each vue devtools (panel + proxy + backend) instance.

const ports = {}

chrome.runtime.onConnect.addListener(port => {
  let tab
  let name
  if (isNumeric(port.name)) {
    tab = port.name
    name = 'devtools'
    installProxy(+port.name)
  } else {
    tab = port.sender.tab.id
    name = 'backend'
  }

  if (!ports[tab]) {
    ports[tab] = {
      devtools: null,
      backend: null
    }
  }
  ports[tab][name] = port

  if (ports[tab].devtools && ports[tab].backend) {
    doublePipe(tab, ports[tab].devtools, ports[tab].backend)
  }
})

function isNumeric (str) {
  return +str + '' === str
}

function installProxy (tabId) {
  chrome.tabs.executeScript(tabId, {
    file: '/build/proxy.js'
  }, function (res) {
    if (!res) {
      ports[tabId].devtools.postMessage('proxy-fail')
    } else {
      console.log('injected proxy to tab ' + tabId)
    }
  })
}

function doublePipe (id, one, two) {
  one.onMessage.addListener(lOne)
  function lOne (message) {
    if (message.event === 'log') {
      return console.log('tab ' + id, message.payload)
    }
    console.log('devtools -> backend', message)
    two.postMessage(message)
  }
  two.onMessage.addListener(lTwo)
  function lTwo (message) {
    if (message.event === 'log') {
      return console.log('tab ' + id, message.payload)
    }
    console.log('backend -> devtools', message)
    one.postMessage(message)
  }
  function shutdown () {
    console.log('tab ' + id + ' disconnected.')
    one.onMessage.removeListener(lOne)
    two.onMessage.removeListener(lTwo)
    one.disconnect()
    two.disconnect()
    ports[id] = null
  }
  one.onDisconnect.addListener(shutdown)
  two.onDisconnect.addListener(shutdown)
  console.log('tab ' + id + ' connected.')
}

chrome.runtime.onMessage.addListener((req, sender) => {
  if (sender.tab && req.vueDetected) {
    chrome.browserAction.setIcon({
      tabId: sender.tab.id,
      path: {
        16: 'icons/16.png',
        48: 'icons/48.png',
        128: 'icons/128.png'
      }
    })
    chrome.browserAction.setPopup({
      tabId: sender.tab.id,
      popup: req.devtoolsEnabled ? 'popups/enabled.html' : 'popups/disabled.html'
    })
  }
})


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYzcxM2NlMmI4ZjRmYmYzNzVlMWQ/ODA2OCoqKioqIiwid2VicGFjazovLy8uL3NyYy9iYWNrZ3JvdW5kLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7OztBQ2hFQTs7O0FBR0EsTUFBTSxLQUFLLEdBQUcsRUFBRTs7QUFFaEIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksSUFBSTtFQUMzQyxJQUFJLEdBQUc7RUFDUCxJQUFJLElBQUk7RUFDUixJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7SUFDeEIsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJO0lBQ2YsSUFBSSxHQUFHLFVBQVU7SUFDakIsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztHQUN6QixNQUFNO0lBQ0wsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7SUFDeEIsSUFBSSxHQUFHLFNBQVM7R0FDakI7O0VBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtJQUNmLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRztN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QUFHLENBQUMsV0FBVyxFQUFFO0lBQ2pDLE1BQU0sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDO01BQzNCLEtBQUssRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7TUFDcEIsSUFBSSxFQUFFO1FBQ0osRUFBRSxFQUFFLGNBQWM7UUFDbEIsRUFBRSxFQUFFLGNBQWM7UUFDbEIsR0FBRyxFQUFFLGVBQWU7T0FDckI7S0FDRixDQUFDO0lBQ0YsTUFBTSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUM7TUFDNUIsS0FBSyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRTtNQUNwQixLQUFLLEVBQUUsR0FBRyxDQUFDLGVBQWUsR0FBRyxxQkFBcUIsR0FBRyxzQkFBc0I7S0FDNUUsQ0FBQztHQUNIO0NBQ0YsQ0FBQyIsImZpbGUiOiJiYWNrZ3JvdW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMTEwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBjNzEzY2UyYjhmNGZiZjM3NWUxZCIsIi8vIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdCBydW5zIGFsbCB0aGUgdGltZSBhbmQgc2VydmVzIGFzIGEgY2VudHJhbCBtZXNzYWdlXG4vLyBodWIgZm9yIGVhY2ggdnVlIGRldnRvb2xzIChwYW5lbCArIHByb3h5ICsgYmFja2VuZCkgaW5zdGFuY2UuXG5cbmNvbnN0IHBvcnRzID0ge31cblxuY2hyb21lLnJ1bnRpbWUub25Db25uZWN0LmFkZExpc3RlbmVyKHBvcnQgPT4ge1xuICBsZXQgdGFiXG4gIGxldCBuYW1lXG4gIGlmIChpc051bWVyaWMocG9ydC5uYW1lKSkge1xuICAgIHRhYiA9IHBvcnQubmFtZVxuICAgIG5hbWUgPSAnZGV2dG9vbHMnXG4gICAgaW5zdGFsbFByb3h5KCtwb3J0Lm5hbWUpXG4gIH0gZWxzZSB7XG4gICAgdGFiID0gcG9ydC5zZW5kZXIudGFiLmlkXG4gICAgbmFtZSA9ICdiYWNrZW5kJ1xuICB9XG5cbiAgaWYgKCFwb3J0c1t0YWJdKSB7XG4gICAgcG9ydHNbdGFiXSA9IHtcbiAgICAgIGRldnRvb2xzOiBudWxsLFxuICAgICAgYmFja2VuZDogbnVsbFxuICAgIH1cbiAgfVxuICBwb3J0c1t0YWJdW25hbWVdID0gcG9ydFxuXG4gIGlmIChwb3J0c1t0YWJdLmRldnRvb2xzICYmIHBvcnRzW3RhYl0uYmFja2VuZCkge1xuICAgIGRvdWJsZVBpcGUodGFiLCBwb3J0c1t0YWJdLmRldnRvb2xzLCBwb3J0c1t0YWJdLmJhY2tlbmQpXG4gIH1cbn0pXG5cbmZ1bmN0aW9uIGlzTnVtZXJpYyAoc3RyKSB7XG4gIHJldHVybiArc3RyICsgJycgPT09IHN0clxufVxuXG5mdW5jdGlvbiBpbnN0YWxsUHJveHkgKHRhYklkKSB7XG4gIGNocm9tZS50YWJzLmV4ZWN1dGVTY3JpcHQodGFiSWQsIHtcbiAgICBmaWxlOiAnL2J1aWxkL3Byb3h5LmpzJ1xuICB9LCBmdW5jdGlvbiAocmVzKSB7XG4gICAgaWYgKCFyZXMpIHtcbiAgICAgIHBvcnRzW3RhYklkXS5kZXZ0b29scy5wb3N0TWVzc2FnZSgncHJveHktZmFpbCcpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCdpbmplY3RlZCBwcm94eSB0byB0YWIgJyArIHRhYklkKVxuICAgIH1cbiAgfSlcbn1cblxuZnVuY3Rpb24gZG91YmxlUGlwZSAoaWQsIG9uZSwgdHdvKSB7XG4gIG9uZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIobE9uZSlcbiAgZnVuY3Rpb24gbE9uZSAobWVzc2FnZSkge1xuICAgIGlmIChtZXNzYWdlLmV2ZW50ID09PSAnbG9nJykge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd0YWIgJyArIGlkLCBtZXNzYWdlLnBheWxvYWQpXG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCdkZXZ0b29scyAtPiBiYWNrZW5kJywgbWVzc2FnZSlcbiAgICB0d28ucG9zdE1lc3NhZ2UobWVzc2FnZSlcbiAgfVxuICB0d28ub25NZXNzYWdlLmFkZExpc3RlbmVyKGxUd28pXG4gIGZ1bmN0aW9uIGxUd28gKG1lc3NhZ2UpIHtcbiAgICBpZiAobWVzc2FnZS5ldmVudCA9PT0gJ2xvZycpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndGFiICcgKyBpZCwgbWVzc2FnZS5wYXlsb2FkKVxuICAgIH1cbiAgICBjb25zb2xlLmxvZygnYmFja2VuZCAtPiBkZXZ0b29scycsIG1lc3NhZ2UpXG4gICAgb25lLnBvc3RNZXNzYWdlKG1lc3NhZ2UpXG4gIH1cbiAgZnVuY3Rpb24gc2h1dGRvd24gKCkge1xuICAgIGNvbnNvbGUubG9nKCd0YWIgJyArIGlkICsgJyBkaXNjb25uZWN0ZWQuJylcbiAgICBvbmUub25NZXNzYWdlLnJlbW92ZUxpc3RlbmVyKGxPbmUpXG4gICAgdHdvLm9uTWVzc2FnZS5yZW1vdmVMaXN0ZW5lcihsVHdvKVxuICAgIG9uZS5kaXNjb25uZWN0KClcbiAgICB0d28uZGlzY29ubmVjdCgpXG4gICAgcG9ydHNbaWRdID0gbnVsbFxuICB9XG4gIG9uZS5vbkRpc2Nvbm5lY3QuYWRkTGlzdGVuZXIoc2h1dGRvd24pXG4gIHR3by5vbkRpc2Nvbm5lY3QuYWRkTGlzdGVuZXIoc2h1dGRvd24pXG4gIGNvbnNvbGUubG9nKCd0YWIgJyArIGlkICsgJyBjb25uZWN0ZWQuJylcbn1cblxuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChyZXEsIHNlbmRlcikgPT4ge1xuICBpZiAoc2VuZGVyLnRhYiAmJiByZXEudnVlRGV0ZWN0ZWQpIHtcbiAgICBjaHJvbWUuYnJvd3NlckFjdGlvbi5zZXRJY29uKHtcbiAgICAgIHRhYklkOiBzZW5kZXIudGFiLmlkLFxuICAgICAgcGF0aDoge1xuICAgICAgICAxNjogJ2ljb25zLzE2LnBuZycsXG4gICAgICAgIDQ4OiAnaWNvbnMvNDgucG5nJyxcbiAgICAgICAgMTI4OiAnaWNvbnMvMTI4LnBuZydcbiAgICAgIH1cbiAgICB9KVxuICAgIGNocm9tZS5icm93c2VyQWN0aW9uLnNldFBvcHVwKHtcbiAgICAgIHRhYklkOiBzZW5kZXIudGFiLmlkLFxuICAgICAgcG9wdXA6IHJlcS5kZXZ0b29sc0VuYWJsZWQgPyAncG9wdXBzL2VuYWJsZWQuaHRtbCcgOiAncG9wdXBzL2Rpc2FibGVkLmh0bWwnXG4gICAgfSlcbiAgfVxufSlcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9iYWNrZ3JvdW5kLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==