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
/******/ 	return __webpack_require__(__webpack_require__.s = 114);
/******/ })
/************************************************************************/
/******/ ({

/***/ 114:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_src_backend_hook__ = __webpack_require__(18);
// This script is injected into every page.


// inject the hook
const script = document.createElement('script')
script.textContent = ';(' + __WEBPACK_IMPORTED_MODULE_0_src_backend_hook__["a" /* installHook */].toString() + ')(window)'
document.documentElement.appendChild(script)
script.parentNode.removeChild(script)


/***/ }),

/***/ 18:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = installHook;
// this script is injected into every page.

/**
 * Install the hook on window, which is an event emitter.
 * Note because Chrome content scripts cannot directly modify the window object,
 * we are evaling this function by inserting a script tag. That's why we have
 * to inline the whole event emitter implementation here.
 *
 * @param {Window} window
 */

function installHook (window) {
  let listeners = {}

  const hook = {
    Vue: null,

    on (event, fn) {
      event = '$' + event
      ;(listeners[event] || (listeners[event] = [])).push(fn)
    },

    once (event, fn) {
      event = '$' + event
      function on () {
        this.off(event, on)
        fn.apply(this, arguments)
      }
      ;(listeners[event] || (listeners[event] = [])).push(on)
    },

    off (event, fn) {
      event = '$' + event
      if (!arguments.length) {
        listeners = {}
      } else {
        const cbs = listeners[event]
        if (cbs) {
          if (!fn) {
            listeners[event] = null
          } else {
            for (let i = 0, l = cbs.length; i < l; i++) {
              const cb = cbs[i]
              if (cb === fn || cb.fn === fn) {
                cbs.splice(i, 1)
                break
              }
            }
          }
        }
      }
    },

    emit (event) {
      event = '$' + event
      let cbs = listeners[event]
      if (cbs) {
        const args = [].slice.call(arguments, 1)
        cbs = cbs.slice()
        for (let i = 0, l = cbs.length; i < l; i++) {
          cbs[i].apply(this, args)
        }
      }
    }
  }

  hook.once('init', Vue => {
    hook.Vue = Vue
  })

  hook.once('vuex:init', store => {
    hook.store = store
  })

  Object.defineProperty(window, '__VUE_DEVTOOLS_GLOBAL_HOOK__', {
    get () {
      return hook
    }
  })
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYzcxM2NlMmI4ZjRmYmYzNzVlMWQ/ODA2OCoiLCJ3ZWJwYWNrOi8vLy4vc3JjL2hvb2suanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9odWEvRG9jdW1lbnRzL+WFtuS7lumhueebri9kZHYtZGV2dG9vbHMvc3JjL2JhY2tlbmQvaG9vay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7OztBQ2hFQTtBQUFBO0FBQzhDOzs7QUFHOUMsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUM7QUFDL0MsTUFBTSxDQUFDLFdBQVcsR0FBRyxJQUFJLEdBQUcscUVBQVcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxXQUFXO0FBQ2hFLFFBQVEsQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztBQUM1QyxNQUFNLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7Ozs7Ozs7OztBQ1ByQztBQUFBOzs7Ozs7Ozs7OztBQVdPLFNBQVMsV0FBVyxFQUFFLE1BQU0sRUFBRTtFQUNuQyxJQUFJLFNBQVMsR0FBRyxFQUFFOztFQUVsQixNQUFNLElBQUksR0FBRztJQUNYLEdBQUcs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dWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxMTQpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGM3MTNjZTJiOGY0ZmJmMzc1ZTFkIiwiLy8gVGhpcyBzY3JpcHQgaXMgaW5qZWN0ZWQgaW50byBldmVyeSBwYWdlLlxuaW1wb3J0IHsgaW5zdGFsbEhvb2sgfSBmcm9tICdzcmMvYmFja2VuZC9ob29rJ1xuXG4vLyBpbmplY3QgdGhlIGhvb2tcbmNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpXG5zY3JpcHQudGV4dENvbnRlbnQgPSAnOygnICsgaW5zdGFsbEhvb2sudG9TdHJpbmcoKSArICcpKHdpbmRvdyknXG5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYXBwZW5kQ2hpbGQoc2NyaXB0KVxuc2NyaXB0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2NyaXB0KVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2hvb2suanMiLCIvLyB0aGlzIHNjcmlwdCBpcyBpbmplY3RlZCBpbnRvIGV2ZXJ5IHBhZ2UuXG5cbi8qKlxuICogSW5zdGFsbCB0aGUgaG9vayBvbiB3aW5kb3csIHdoaWNoIGlzIGFuIGV2ZW50IGVtaXR0ZXIuXG4gKiBOb3RlIGJlY2F1c2UgQ2hyb21lIGNvbnRlbnQgc2NyaXB0cyBjYW5ub3QgZGlyZWN0bHkgbW9kaWZ5IHRoZSB3aW5kb3cgb2JqZWN0LFxuICogd2UgYXJlIGV2YWxpbmcgdGhpcyBmdW5jdGlvbiBieSBpbnNlcnRpbmcgYSBzY3JpcHQgdGFnLiBUaGF0J3Mgd2h5IHdlIGhhdmVcbiAqIHRvIGlubGluZSB0aGUgd2hvbGUgZXZlbnQgZW1pdHRlciBpbXBsZW1lbnRhdGlvbiBoZXJlLlxuICpcbiAqIEBwYXJhbSB7V2luZG93fSB3aW5kb3dcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gaW5zdGFsbEhvb2sgKHdpbmRvdykge1xuICBsZXQgbGlzdGVuZXJzID0ge31cblxuICBjb25zdCBob29rID0ge1xuICAgIFZ1ZTogbnVsbCxcblxuICAgIG9uIChldmVudCwgZm4pIHtcbiAgICAgIGV2ZW50ID0gJyQnICsgZXZlbnRcbiAgICAgIDsobGlzdGVuZXJzW2V2ZW50XSB8fCAobGlzdGVuZXJzW2V2ZW50XSA9IFtdKSkucHVzaChmbilcbiAgICB9LFxuXG4gICAgb25jZSAoZXZlbnQsIGZuKSB7XG4gICAgICBldmVudCA9ICckJyArIGV2ZW50XG4gICAgICBmdW5jdGlvbiBvbiAoKSB7XG4gICAgICAgIHRoaXMub2ZmKGV2ZW50LCBvbilcbiAgICAgICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgfVxuICAgICAgOyhsaXN0ZW5lcnNbZXZlbnRdIHx8IChsaXN0ZW5lcnNbZXZlbnRdID0gW10pKS5wdXNoKG9uKVxuICAgIH0sXG5cbiAgICBvZmYgKGV2ZW50LCBmbikge1xuICAgICAgZXZlbnQgPSAnJCcgKyBldmVudFxuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgIGxpc3RlbmVycyA9IHt9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBjYnMgPSBsaXN0ZW5lcnNbZXZlbnRdXG4gICAgICAgIGlmIChjYnMpIHtcbiAgICAgICAgICBpZiAoIWZuKSB7XG4gICAgICAgICAgICBsaXN0ZW5lcnNbZXZlbnRdID0gbnVsbFxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGNicy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgY29uc3QgY2IgPSBjYnNbaV1cbiAgICAgICAgICAgICAgaWYgKGNiID09PSBmbiB8fCBjYi5mbiA9PT0gZm4pIHtcbiAgICAgICAgICAgICAgICBjYnMuc3BsaWNlKGksIDEpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBlbWl0IChldmVudCkge1xuICAgICAgZXZlbnQgPSAnJCcgKyBldmVudFxuICAgICAgbGV0IGNicyA9IGxpc3RlbmVyc1tldmVudF1cbiAgICAgIGlmIChjYnMpIHtcbiAgICAgICAgY29uc3QgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKVxuICAgICAgICBjYnMgPSBjYnMuc2xpY2UoKVxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGNicy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICBjYnNbaV0uYXBwbHkodGhpcywgYXJncylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhvb2sub25jZSgnaW5pdCcsIFZ1ZSA9PiB7XG4gICAgaG9vay5WdWUgPSBWdWVcbiAgfSlcblxuICBob29rLm9uY2UoJ3Z1ZXg6aW5pdCcsIHN0b3JlID0+IHtcbiAgICBob29rLnN0b3JlID0gc3RvcmVcbiAgfSlcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkod2luZG93LCAnX19WVUVfREVWVE9PTFNfR0xPQkFMX0hPT0tfXycsIHtcbiAgICBnZXQgKCkge1xuICAgICAgcmV0dXJuIGhvb2tcbiAgICB9XG4gIH0pXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL1VzZXJzL2h1YS9Eb2N1bWVudHMv5YW25LuW6aG555uuL2Rkdi1kZXZ0b29scy9zcmMvYmFja2VuZC9ob29rLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==