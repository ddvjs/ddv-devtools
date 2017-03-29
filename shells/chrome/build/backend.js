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
/******/ 	return __webpack_require__(__webpack_require__.s = 109);
/******/ })
/************************************************************************/
/******/ ({

/***/ 10:
/***/ (function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),

/***/ 109:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_src_backend__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_src_bridge__ = __webpack_require__(8);
// this is injected to the app page when the panel is activated.




window.addEventListener('message', handshake)

function handshake (e) {
  if (e.data.source === 'vue-devtools-proxy' && e.data.payload === 'init') {
    window.removeEventListener('message', handshake)

    let listeners = []
    const bridge = new __WEBPACK_IMPORTED_MODULE_1_src_bridge__["a" /* default */]({
      listen (fn) {
        var listener = evt => {
          if (evt.data.source === 'vue-devtools-proxy' && evt.data.payload) {
            fn(evt.data.payload)
          }
        }
        window.addEventListener('message', listener)
        listeners.push(listener)
      },
      send (data) {
        window.postMessage({
          source: 'vue-devtools-backend',
          payload: data
        }, '*')
      }
    })

    bridge.on('shutdown', () => {
      listeners.forEach(l => {
        window.removeEventListener('message', l)
      })
      listeners = []
    })

    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_src_backend__["a" /* initBackend */])(bridge)
  }
}


/***/ }),

/***/ 15:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__highlighter__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vuex__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__events__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_path__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_path__);
/* harmony export (immutable) */ __webpack_exports__["a"] = initBackend;
/* harmony export (immutable) */ __webpack_exports__["b"] = getInstanceName;
// This is the backend that is injected into the page that a Vue app lives in
// when the Vue Devtools panel is activated.







// Use a custom basename functions instead of the shimed version
// because it doesn't work on Windows
function basename (filename, ext) {
  return __WEBPACK_IMPORTED_MODULE_4_path___default.a.basename(
    filename.replace(/^[a-zA-Z]:/, '').replace(/\\/g, '/'),
    ext
  )
}

// hook should have been injected before this executes.
const hook = window.__VUE_DEVTOOLS_GLOBAL_HOOK__
const rootInstances = []
const propModes = ['default', 'sync', 'once']

const instanceMap = window.__VUE_DEVTOOLS_INSTANCE_MAP__ = new Map()
const consoleBoundInstances = Array(5)
let currentInspectedId
let bridge
let filter = ''
let captureCount = 0
let isLegacy = false

function initBackend (_bridge) {
  bridge = _bridge
  if (hook.Vue) {
    isLegacy = hook.Vue.version && hook.Vue.version.split('.')[0] === '1'
    connect()
  } else {
    hook.once('init', connect)
  }
}

function connect () {
  hook.currentTab = 'components'
  bridge.on('switch-tab', tab => {
    hook.currentTab = tab
    if (tab === 'components') {
      flush()
    }
  })

  // the backend may get injected to the same page multiple times
  // if the user closes and reopens the devtools.
  // make sure there's only one flush listener.
  hook.off('flush')
  hook.on('flush', () => {
    if (hook.currentTab === 'components') {
      flush()
    }
  })

  bridge.on('select-instance', id => {
    currentInspectedId = id
    const instance = instanceMap.get(id)
    if (instance) {
      scrollIntoView(instance)
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__highlighter__["a" /* highlight */])(instance)
    }
    bindToConsole(instance)
    flush()
    bridge.send('instance-details', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__util__["a" /* stringify */])(getInstanceDetails(id)))
  })

  bridge.on('filter-instances', _filter => {
    filter = _filter.toLowerCase()
    flush()
  })

  bridge.on('refresh', scan)
  bridge.on('enter-instance', id => __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__highlighter__["a" /* highlight */])(instanceMap.get(id)))
  bridge.on('leave-instance', __WEBPACK_IMPORTED_MODULE_0__highlighter__["b" /* unHighlight */])

  // vuex
  if (hook.store) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__vuex__["a" /* initVuexBackend */])(hook, bridge)
  } else {
    hook.once('vuex:init', store => {
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__vuex__["a" /* initVuexBackend */])(hook, bridge)
    })
  }

  // events
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__events__["a" /* initEventsBackend */])(hook.Vue, bridge)

  bridge.log('backend ready.')
  bridge.send('ready', hook.Vue.version)
  console.log('[vue-devtools] Ready. Detected Vue v' + hook.Vue.version)
  scan()
}

/**
 * Scan the page for root level Vue instances.
 */

function scan () {
  rootInstances.length = 0
  let inFragment = false
  let currentFragment = null
  walk(document, function (node) {
    if (inFragment) {
      if (node === currentFragment._fragmentEnd) {
        inFragment = false
        currentFragment = null
      }
      return true
    }
    const instance = node.__vue__
    if (instance) {
      if (instance._isFragment) {
        inFragment = true
        currentFragment = instance
      }

      // respect Vue.config.devtools option
      let baseVue = instance.constructor
      while (baseVue.super) {
        baseVue = baseVue.super
      }
      if (baseVue.config && baseVue.config.devtools) {
        rootInstances.push(instance)
      }

      return true
    }
  })
  flush()
}

/**
 * DOM walk helper
 *
 * @param {NodeList} nodes
 * @param {Function} fn
 */

function walk (node, fn) {
  if (node.childNodes) {
    for (let i = 0, l = node.childNodes.length; i < l; i++) {
      const child = node.childNodes[i]
      const stop = fn(child)
      if (!stop) {
        walk(child, fn)
      }
    }
  }

  // also walk shadow DOM
  if (node.shadowRoot) {
    walk(node.shadowRoot, fn)
  }
}

/**
 * Called on every Vue.js batcher flush cycle.
 * Capture current component tree structure and the state
 * of the current inspected instance (if present) and
 * send it to the devtools.
 */

function flush () {
  let start
  if (process.env.NODE_ENV !== 'production') {
    captureCount = 0
    start = window.performance.now()
  }
  const payload = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__util__["a" /* stringify */])({
    inspectedInstance: getInstanceDetails(currentInspectedId),
    instances: findQualifiedChildrenFromList(rootInstances)
  })
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[flush] serialized ${captureCount} instances, took ${window.performance.now() - start}ms.`)
  }
  bridge.send('flush', payload)
}

/**
 * Iterate through an array of instances and flatten it into
 * an array of qualified instances. This is a depth-first
 * traversal - e.g. if an instance is not matched, we will
 * recursively go deeper until a qualified child is found.
 *
 * @param {Array} instances
 * @return {Array}
 */

function findQualifiedChildrenFromList (instances) {
  instances = instances
    .filter(child => !child._isBeingDestroyed)
  return !filter
    ? instances.map(capture)
    : Array.prototype.concat.apply([], instances.map(findQualifiedChildren))
}

/**
 * Find qualified children from a single instance.
 * If the instance itself is qualified, just return itself.
 * This is ok because [].concat works in both cases.
 *
 * @param {Vue} instance
 * @return {Vue|Array}
 */

function findQualifiedChildren (instance) {
  return isQualified(instance)
    ? capture(instance)
    : findQualifiedChildrenFromList(instance.$children)
}

/**
 * Check if an instance is qualified.
 *
 * @param {Vue} instance
 * @return {Boolean}
 */

function isQualified (instance) {
  const name = getInstanceName(instance).toLowerCase()
  return name.indexOf(filter) > -1
}

/**
 * Capture the meta information of an instance. (recursive)
 *
 * @param {Vue} instance
 * @return {Object}
 */

function capture (instance, _, list) {
  if (process.env.NODE_ENV !== 'production') {
    captureCount++
  }
  mark(instance)
  const ret = {
    id: instance._uid,
    name: getInstanceName(instance),
    inactive: !!instance._inactive,
    isFragment: !!instance._isFragment,
    children: instance.$children
      .filter(child => !child._isBeingDestroyed)
      .map(capture)
  }
  // record screen position to ensure correct ordering
  if ((!list || list.length > 1) && !instance._inactive) {
    const rect = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__highlighter__["c" /* getInstanceRect */])(instance)
    ret.top = rect ? rect.top : Infinity
  } else {
    ret.top = Infinity
  }
  // check if instance is available in console
  const consoleId = consoleBoundInstances.indexOf(instance._uid)
  ret.consoleId = consoleId > -1 ? '$vm' + consoleId : null
  // check router view
  const isRouterView2 = instance.$vnode && instance.$vnode.data.routerView
  if (instance._routerView || isRouterView2) {
    ret.isRouterView = true
    if (!instance._inactive) {
      const matched = instance.$route.matched
      const depth = isRouterView2
        ? instance.$vnode.data.routerViewDepth
        : instance._routerView.depth
      ret.matchedRouteSegment =
        matched &&
        matched[depth] &&
        (isRouterView2 ? matched[depth].path : matched[depth].handler.path)
    }
  }
  return ret
}

/**
 * Mark an instance as captured and store it in the instance map.
 *
 * @param {Vue} instance
 */

function mark (instance) {
  if (!instanceMap.has(instance._uid)) {
    instanceMap.set(instance._uid, instance)
    instance.$on('hook:beforeDestroy', function () {
      instanceMap.delete(instance._uid)
    })
  }
}

/**
 * Get the detailed information of an inspected instance.
 *
 * @param {Number} id
 */

function getInstanceDetails (id) {
  const instance = instanceMap.get(id)
  if (!instance) {
    return {}
  } else {
    return {
      id: id,
      name: getInstanceName(instance),
      state: processProps(instance).concat(
        processState(instance),
        processComputed(instance),
        processRouteContext(instance),
        processVuexGetters(instance),
        processFirebaseBindings(instance),
        processObservables(instance)
      )
    }
  }
}

/**
 * Get the appropriate display name for an instance.
 *
 * @param {Vue} instance
 * @return {String}
 */

function getInstanceName (instance) {
  const name = instance.$options.name || instance.$options._componentTag
  if (name) {
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__util__["b" /* classify */])(name)
  }
  const file = instance.$options.__file // injected by vue-loader
  if (file) {
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__util__["b" /* classify */])(basename(file, '.vue'))
  }
  return instance.$root === instance
    ? 'Root'
    : 'Anonymous Component'
}

/**
 * Process the props of an instance.
 * Make sure return a plain object because window.postMessage()
 * will throw an Error if the passed object contains Functions.
 *
 * @param {Vue} instance
 * @return {Array}
 */

function processProps (instance) {
  let props
  if (isLegacy && (props = instance._props)) {
    // 1.x
    return Object.keys(props).map(key => {
      const prop = props[key]
      const options = prop.options
      return {
        type: 'props',
        key: prop.path,
        value: instance[prop.path],
        meta: {
          type: options.type ? getPropType(options.type) : 'any',
          required: !!options.required,
          mode: propModes[prop.mode]
        }
      }
    })
  } else if ((props = instance.$options.props)) {
    // 2.0
    return Object.keys(props).map(key => {
      const prop = props[key]
      key = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__util__["c" /* camelize */])(key)
      return {
        type: 'props',
        key,
        value: instance[key],
        meta: {
          type: prop.type ? getPropType(prop.type) : 'any',
          required: !!prop.required
        }
      }
    })
  } else {
    return []
  }
}

/**
 * Convert prop type constructor to string.
 *
 * @param {Function} fn
 */

const fnTypeRE = /^(?:function|class) (\w+)/
function getPropType (type) {
  const match = type.toString().match(fnTypeRE)
  return typeof type === 'function'
    ? match && match[1] || 'any'
    : 'any'
}

/**
 * Process state, filtering out props and "clean" the result
 * with a JSON dance. This removes functions which can cause
 * errors during structured clone used by window.postMessage.
 *
 * @param {Vue} instance
 * @return {Array}
 */

function processState (instance) {
  const props = isLegacy
    ? instance._props
    : instance.$options.props
  const getters =
    instance.$options.vuex &&
    instance.$options.vuex.getters
  return Object.keys(instance._data)
    .filter(key => (
      !(props && key in props) &&
      !(getters && key in getters)
    ))
    .map(key => ({
      key,
      value: instance._data[key]
    }))
}

/**
 * Process the computed properties of an instance.
 *
 * @param {Vue} instance
 * @return {Array}
 */

function processComputed (instance) {
  const computed = []
  const defs = instance.$options.computed || {}
  // use for...in here because if 'computed' is not defined
  // on component, computed properties will be placed in prototype
  // and Object.keys does not include
  // properties from object's prototype
  for (const key in defs) {
    const def = defs[key]
    const type = typeof def === 'function' && def.vuex
      ? 'vuex bindings'
      : 'computed'
    // use try ... catch here because some computed properties may
    // throw error during its evaluation
    let computedProp = null
    try {
      computedProp = {
        type,
        key,
        value: instance[key]
      }
    } catch (e) {
      computedProp = {
        type,
        key,
        value: '(error during evaluation)'
      }
    }

    computed.push(computedProp)
  }

  return computed
}

/**
 * Process possible vue-router $route context
 *
 * @param {Vue} instance
 * @return {Array}
 */

function processRouteContext (instance) {
  const route = instance.$route
  if (route) {
    const { path, query, params } = route
    const value = { path, query, params }
    if (route.fullPath) { value.fullPath = route.fullPath }
    if (route.hash) { value.hash = route.hash }
    if (route.name) { value.name = route.name }
    if (route.meta) { value.meta = route.meta }
    return [{
      key: '$route',
      value
    }]
  } else {
    return []
  }
}

/**
 * Process Vuex getters.
 *
 * @param {Vue} instance
 * @return {Array}
 */

function processVuexGetters (instance) {
  const getters =
    instance.$options.vuex &&
    instance.$options.vuex.getters
  if (getters) {
    return Object.keys(getters).map(key => {
      return {
        type: 'vuex getters',
        key,
        value: instance[key]
      }
    })
  } else {
    return []
  }
}

/**
 * Process Firebase bindings.
 *
 * @param {Vue} instance
 * @return {Array}
 */

function processFirebaseBindings (instance) {
  var refs = instance.$firebaseRefs
  if (refs) {
    return Object.keys(refs).map(key => {
      return {
        type: 'firebase bindings',
        key,
        value: instance[key]
      }
    })
  } else {
    return []
  }
}

/**
 * Process vue-rx observable bindings.
 *
 * @param {Vue} instance
 * @return {Array}
 */

function processObservables (instance) {
  var obs = instance.$observables
  if (obs) {
    return Object.keys(obs).map(key => {
      return {
        type: 'observables',
        key,
        value: instance[key]
      }
    })
  } else {
    return []
  }
}

/**
 * Sroll a node into view.
 *
 * @param {Vue} instance
 */

function scrollIntoView (instance) {
  const rect = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__highlighter__["c" /* getInstanceRect */])(instance)
  if (rect) {
    window.scrollBy(0, rect.top)
  }
}

/**
 * Binds given instance in console as $vm0.
 * For compatibility reasons it also binds it as $vm.
 *
 * @param {Vue} instance
 */

function bindToConsole (instance) {
  const id = instance._uid
  const index = consoleBoundInstances.indexOf(id)
  if (index > -1) {
    consoleBoundInstances.splice(index, 1)
  } else {
    consoleBoundInstances.pop()
  }
  consoleBoundInstances.unshift(id)
  for (var i = 0; i < 5; i++) {
    window['$vm' + i] = instanceMap.get(consoleBoundInstances[i])
  }
  window.$vm = instance
}

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(7)))

/***/ }),

/***/ 20:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__index__ = __webpack_require__(15);
/* harmony export (immutable) */ __webpack_exports__["a"] = initEventsBackend;



const internalRE = /^(?:pre-)?hook:/

function initEventsBackend (Vue, bridge) {
  let recording = true

  bridge.on('events:toggle-recording', enabled => {
    recording = enabled
  })

  function logEvent (vm, type, eventName, payload) {
    // The string check is important for compat with 1.x where the first
    // argument may be an object instead of a string.
    // this also ensures the event is only logged for direct $emit (source)
    // instead of by $dispatch/$broadcast
    if (typeof eventName === 'string' && !internalRE.test(eventName)) {
      bridge.send('event:triggered', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["a" /* stringify */])({
        eventName,
        type,
        payload,
        instanceId: vm._uid,
        instanceName: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__index__["b" /* getInstanceName */])(vm._self || vm),
        timestamp: Date.now()
      }))
    }
  }

  function wrap (method) {
    const original = Vue.prototype[method]
    if (original) {
      Vue.prototype[method] = function (...args) {
        const res = original.apply(this, args)
        if (recording) {
          logEvent(this, method, args[0], args.slice(1))
        }
        return res
      }
    }
  }

  wrap('$emit')
  wrap('$broadcast')
  wrap('$dispatch')
}


/***/ }),

/***/ 21:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(3);
/* harmony export (immutable) */ __webpack_exports__["a"] = highlight;
/* harmony export (immutable) */ __webpack_exports__["b"] = unHighlight;
/* harmony export (immutable) */ __webpack_exports__["c"] = getInstanceRect;


const overlay = document.createElement('div')
overlay.style.backgroundColor = 'rgba(104, 182, 255, 0.35)'
overlay.style.position = 'fixed'
overlay.style.zIndex = '99999999999999'
overlay.style.pointerEvents = 'none'

/**
 * Highlight an instance.
 *
 * @param {Vue} instance
 */

function highlight (instance) {
  if (!instance) { return }
  const rect = getInstanceRect(instance)
  if (rect) {
    showOverlay(rect)
  }
}

/**
 * Remove highlight overlay.
 */

function unHighlight () {
  if (overlay.parentNode) {
    document.body.removeChild(overlay)
  }
}

/**
 * Get the client rect for an instance.
 *
 * @param {Vue} instance
 * @return {Object}
 */

function getInstanceRect (instance) {
  if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["d" /* inDoc */])(instance.$el)) {
    return
  }
  if (instance._isFragment) {
    return getFragmentRect(instance)
  } else if (instance.$el.nodeType === 1) {
    return instance.$el.getBoundingClientRect()
  }
}

/**
 * Highlight a fragment instance.
 * Loop over its node range and determine its bounding box.
 *
 * @param {Vue} instance
 * @return {Object}
 */

function getFragmentRect ({ _fragmentStart, _fragmentEnd }) {
  let top, bottom, left, right
  util().mapNodeRange(_fragmentStart, _fragmentEnd, function (node) {
    let rect
    if (node.nodeType === 1 || node.getBoundingClientRect) {
      rect = node.getBoundingClientRect()
    } else if (node.nodeType === 3 && node.data.trim()) {
      rect = getTextRect(node)
    }
    if (rect) {
      if (!top || rect.top < top) {
        top = rect.top
      }
      if (!bottom || rect.bottom > bottom) {
        bottom = rect.bottom
      }
      if (!left || rect.left < left) {
        left = rect.left
      }
      if (!right || rect.right > right) {
        right = rect.right
      }
    }
  })
  return {
    top,
    left,
    width: right - left,
    height: bottom - top
  }
}

/**
 * Get the bounding rect for a text node using a Range.
 *
 * @param {Text} node
 * @return {Rect}
 */

const range = document.createRange()
function getTextRect (node) {
  range.selectNode(node)
  return range.getBoundingClientRect()
}

/**
 * Display the overlay with given rect.
 *
 * @param {Rect}
 */

function showOverlay ({ width = 0, height = 0, top = 0, left = 0 }) {
  overlay.style.width = ~~width + 'px'
  overlay.style.height = ~~height + 'px'
  overlay.style.top = ~~top + 'px'
  overlay.style.left = ~~left + 'px'
  document.body.appendChild(overlay)
}

/**
 * Get Vue's util
 */

function util () {
  return window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue.util
}


/***/ }),

/***/ 22:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_src_util__ = __webpack_require__(3);
/* harmony export (immutable) */ __webpack_exports__["a"] = initVuexBackend;


function initVuexBackend (hook, bridge) {
  const store = hook.store
  let recording = true

  const getSnapshot = () => __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_src_util__["a" /* stringify */])({
    state: store.state,
    getters: store.getters
  })

  bridge.send('vuex:init', getSnapshot())

  // deal with multiple backend injections
  hook.off('vuex:mutation')

  // application -> devtool
  hook.on('vuex:mutation', mutation => {
    if (!recording) { return }
    bridge.send('vuex:mutation', {
      mutation: {
        type: mutation.type,
        payload: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_src_util__["a" /* stringify */])(mutation.payload)
      },
      timestamp: Date.now(),
      snapshot: getSnapshot()
    })
  })

  // devtool -> application
  bridge.on('vuex:travel-to-state', state => {
    hook.emit('vuex:travel-to-state', state)
  })

  bridge.on('vuex:import-state', state => {
    hook.emit('vuex:travel-to-state', state)
    bridge.send('vuex:init', getSnapshot())
  })

  bridge.on('vuex:toggle-recording', enabled => {
    recording = enabled
  })
}


/***/ }),

/***/ 3:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_circular_json_es6__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_circular_json_es6___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_circular_json_es6__);
/* harmony export (immutable) */ __webpack_exports__["d"] = inDoc;
/* harmony export (immutable) */ __webpack_exports__["a"] = stringify;
/* harmony export (immutable) */ __webpack_exports__["e"] = parse;
/* harmony export (immutable) */ __webpack_exports__["h"] = isPlainObject;
/* harmony export (immutable) */ __webpack_exports__["i"] = searchDeepInObject;


function cached (fn) {
  const cache = Object.create(null)
  return function cachedFn (str) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }
}

var classifyRE = /(?:^|[-_/])(\w)/g
const classify = cached((str) => {
  return str.replace(classifyRE, toUpper)
})
/* harmony export (immutable) */ __webpack_exports__["b"] = classify;


const camelizeRE = /-(\w)/g
const camelize = cached((str) => {
  return str.replace(camelizeRE, toUpper)
})
/* harmony export (immutable) */ __webpack_exports__["c"] = camelize;


function toUpper (_, c) {
  return c ? c.toUpperCase() : ''
}

function inDoc (node) {
  if (!node) { return false }
  var doc = node.ownerDocument.documentElement
  var parent = node.parentNode
  return doc === node ||
    doc === parent ||
    !!(parent && parent.nodeType === 1 && (doc.contains(parent)))
}

/**
 * Stringify/parse data using CircularJSON.
 */

const UNDEFINED = '__vue_devtool_undefined__'
/* harmony export (immutable) */ __webpack_exports__["f"] = UNDEFINED;

const INFINITY = '__vue_devtool_infinity__'
/* harmony export (immutable) */ __webpack_exports__["g"] = INFINITY;


function stringify (data) {
  return __WEBPACK_IMPORTED_MODULE_0_circular_json_es6___default.a.stringify(data, replacer)
}

function replacer (key, val) {
  if (val === undefined) {
    return UNDEFINED
  } else if (val === Infinity) {
    return INFINITY
  } else {
    return sanitize(val)
  }
}

function parse (data, revive) {
  return revive
    ? __WEBPACK_IMPORTED_MODULE_0_circular_json_es6___default.a.parse(data, reviver)
    : __WEBPACK_IMPORTED_MODULE_0_circular_json_es6___default.a.parse(data)
}

function reviver (key, val) {
  if (val === UNDEFINED) {
    return undefined
  } else if (val === INFINITY) {
    return Infinity
  } else {
    return val
  }
}

/**
 * Sanitize data to be posted to the other side.
 * Since the message posted is sent with structured clone,
 * we need to filter out any types that might cause an error.
 *
 * @param {*} data
 * @return {*}
 */

function sanitize (data) {
  if (
    !isPrimitive(data) &&
    !Array.isArray(data) &&
    !isPlainObject(data)
  ) {
    // handle types that will probably cause issues in
    // the structured clone
    return Object.prototype.toString.call(data)
  } else {
    return data
  }
}

function isPlainObject (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

function isPrimitive (data) {
  if (data == null) {
    return true
  }
  const type = typeof data
  return (
    type === 'string' ||
    type === 'number' ||
    type === 'boolean' ||
    data instanceof RegExp
  )
}

function searchDeepInObject (obj, searchTerm) {
  var match = false
  const keys = Object.keys(obj)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const value = obj[key]
    if (compare(key, searchTerm) || compare(value, searchTerm)) {
      match = true
      break
    }
    if (isPlainObject(value)) {
      match = searchDeepInObject(value, searchTerm)
      if (match) {
        break
      }
    }
  }
  return match
}

function compare (mixedValue, stringValue) {
  if (Array.isArray(mixedValue) && searchInArray(mixedValue, stringValue.toLowerCase())) {
    return true
  }
  if (('' + mixedValue).toLowerCase().indexOf(stringValue.toLowerCase()) !== -1) {
    return true
  }
  return false
}

function searchInArray (arr, searchTerm) {
  let found = false
  for (let i = 0; i < arr.length; i++) {
    if (('' + arr[i]).toLowerCase().indexOf(searchTerm) !== -1) {
      found = true
      break
    }
  }
  return found
}


/***/ }),

/***/ 60:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),

/***/ 7:
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ 8:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_events__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_events___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_events__);


class Bridge extends __WEBPACK_IMPORTED_MODULE_0_events__["EventEmitter"] {
  constructor (wall) {
    super()
    this.setMaxListeners(Infinity)
    this.wall = wall
    wall.listen(message => {
      if (typeof message === 'string') {
        this.emit(message)
      } else {
        this.emit(message.event, message.payload)
      }
    })
  }

  /**
   * Send an event.
   *
   * @param {String} event
   * @param {*} payload
   */

  send (event, payload) {
    this.wall.send({
      event,
      payload
    })
  }

  /**
   * Log a message to the devtools background page.
   *
   * @param {String} message
   */

  log (message) {
    this.send('log', message)
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Bridge;



/***/ }),

/***/ 9:
/***/ (function(module, exports) {

function encode (data, replacer, list, seen) {
  var stored, key, value, i, l
  var seenIndex = seen.get(data)
  if (seenIndex != null) {
    return seenIndex
  }
  var index = list.length
  if (isPlainObject(data)) {
    stored = {}
    seen.set(data, index)
    list.push(stored)
    var keys = Object.keys(data)
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i]
      value = data[key]
      if (replacer) {
        value = replacer.call(data, key, value)
      }
      stored[key] = encode(value, replacer, list, seen)
    }
  } else if (Array.isArray(data)) {
    stored = []
    seen.set(data, index)
    list.push(stored)
    for (i = 0, l = data.length; i < l; i++) {
      value = data[i]
      if (replacer) {
       value = replacer.call(data, i, value)
      }
      stored[i] = encode(value, replacer, list, seen)
    }
    seen.set(data, list.length)
  } else {
    index = list.length
    list.push(data)
  }
  return index
}

function decode (list, reviver) {
  var i = list.length
  var j, k, data, key, value
  while (i--) {
    var data = list[i]
    if (isPlainObject(data)) {
      var keys = Object.keys(data)
      for (j = 0, k = keys.length; j < k; j++) {
        key = keys[j]
        value = list[data[key]]
        if (reviver) value = reviver.call(data, key, value)
        data[key] = value
      }
    } else if (Array.isArray(data)) {
      for (j = 0, k = data.length; j < k; j++) {
        value = list[data[j]]
        if (reviver) value = reviver.call(data, j, value)
        data[j] = value
      }
    }
  }
}

function isPlainObject (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

exports.stringify = function stringify (data, replacer, space) {
  try {
    return arguments.length === 1
      ? JSON.stringify(data)
      : JSON.stringify(data, replacer, space)
  } catch (e) {
    return exports.stringifyStrict(data, replacer, space)
  }
}

exports.parse = function parse (data, reviver) {
  var hasCircular = /^\s/.test(data)
  if (!hasCircular) {
    return arguments.length === 1
      ? JSON.parse(data)
      : JSON.parse(data, reviver)
  } else {
    var list = JSON.parse(data)
    decode(list, reviver)
    return list[0]
  }
}

exports.stringifyStrict = function (data, replacer, space) {
  var list = []
  encode(data, replacer, list, new Map())
  return space
    ? ' ' + JSON.stringify(list, null, space)
    : ' ' + JSON.stringify(list)
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYzcxM2NlMmI4ZjRmYmYzNzVlMWQ/ODA2OCIsIndlYnBhY2s6Ly8vL1VzZXJzL2h1YS9Eb2N1bWVudHMv5YW25LuW6aG555uuL2Rkdi1kZXZ0b29scy9+L2V2ZW50cy9ldmVudHMuanM/ZmFkNCIsIndlYnBhY2s6Ly8vLi9zcmMvYmFja2VuZC5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL2h1YS9Eb2N1bWVudHMv5YW25LuW6aG555uuL2Rkdi1kZXZ0b29scy9zcmMvYmFja2VuZC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL2h1YS9Eb2N1bWVudHMv5YW25LuW6aG555uuL2Rkdi1kZXZ0b29scy9zcmMvYmFja2VuZC9ldmVudHMuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9odWEvRG9jdW1lbnRzL+WFtuS7lumhueebri9kZHYtZGV2dG9vbHMvc3JjL2JhY2tlbmQvaGlnaGxpZ2h0ZXIuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9odWEvRG9jdW1lbnRzL+WFtuS7lumhueebri9kZHYtZGV2dG9vbHMvc3JjL2JhY2tlbmQvdnVleC5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL2h1YS9Eb2N1bWVudHMv5YW25LuW6aG555uuL2Rkdi1kZXZ0b29scy9zcmMvdXRpbC5qcz8xYmZiIiwid2VicGFjazovLy8vVXNlcnMvaHVhL0RvY3VtZW50cy/lhbbku5bpobnnm64vZGR2LWRldnRvb2xzL34vcGF0aC1icm93c2VyaWZ5L2luZGV4LmpzIiwid2VicGFjazovLy8vVXNlcnMvaHVhL0RvY3VtZW50cy/lhbbku5bpobnnm64vZGR2LWRldnRvb2xzL34vcHJvY2Vzcy9icm93c2VyLmpzPzZiNzQiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9odWEvRG9jdW1lbnRzL+WFtuS7lumhueebri9kZHYtZGV2dG9vbHMvc3JjL2JyaWRnZS5qcz83ZDhhIiwid2VicGFjazovLy8vVXNlcnMvaHVhL0RvY3VtZW50cy/lhbbku5bpobnnm64vZGR2LWRldnRvb2xzL34vY2lyY3VsYXItanNvbi1lczYvaW5kZXguanM/OTczZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsZUFBZSxTQUFTO0FBQ3hCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxHQUFHO0FBQ0gsb0JBQW9CLFNBQVM7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDN1NBO0FBQUE7O0FB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b0I7QUFDOUI7QUFDQTs7QUFFQTtBQUNBLFVBQVUsVUFBVTtBQUNwQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsWUFBWTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsK0JBQStCLHNCQUFzQjtBQUNyRDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUMvTkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixzQkFBc0I7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsVUFBVTs7Ozs7Ozs7Ozs7QUNuTEQ7O0FBRXRCLE1BQU0sTUFBTSxTQUFTLG9EQUFZLENBQUM7RUFDL0MsV0FBVyxDQUFDLENBQUMsSUFBSSxFQUFFO0lBQ2pCLEtBQUssRUFBRTtJQUNQLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDO0lBQzlCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSTtJQUNoQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sSUFBSTtNQUNyQixJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRTtRQUMvQixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztPQUNuQixNQUFNO1FBQ0wsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUM7T0FDMUM7S0FDRixDQUFDO0dBQ0g7Ozs7Ozs7OztFQVNELElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7SUFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7TUFDYixLQUFLO01BQ0wsT0FBTztLQUNSLENBQUM7R0FDSDs7Ozs7Ozs7RUFRRCxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUU7SUFDWixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUM7R0FDMUI7Q0FDRjtBQUFBO0FBQUE7Ozs7Ozs7O0FDdkNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyxPQUFPO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyxPQUFPO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsT0FBTztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLGtDQUFrQyxPQUFPO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJiYWNrZW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMTA5KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBjNzEzY2UyYjhmNGZiZjM3NWUxZCIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBBdCBsZWFzdCBnaXZlIHNvbWUga2luZCBvZiBjb250ZXh0IHRvIHRoZSB1c2VyXG4gICAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuICgnICsgZXIgKyAnKScpO1xuICAgICAgICBlcnIuY29udGV4dCA9IGVyO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSBpZiAobGlzdGVuZXJzKSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAodGhpcy5fZXZlbnRzKSB7XG4gICAgdmFyIGV2bGlzdGVuZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgICBpZiAoaXNGdW5jdGlvbihldmxpc3RlbmVyKSlcbiAgICAgIHJldHVybiAxO1xuICAgIGVsc2UgaWYgKGV2bGlzdGVuZXIpXG4gICAgICByZXR1cm4gZXZsaXN0ZW5lci5sZW5ndGg7XG4gIH1cbiAgcmV0dXJuIDA7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgcmV0dXJuIGVtaXR0ZXIubGlzdGVuZXJDb3VudCh0eXBlKTtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC9Vc2Vycy9odWEvRG9jdW1lbnRzL+WFtuS7lumhueebri9kZHYtZGV2dG9vbHMvfi9ldmVudHMvZXZlbnRzLmpzXG4vLyBtb2R1bGUgaWQgPSAxMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIi8vIHRoaXMgaXMgaW5qZWN0ZWQgdG8gdGhlIGFwcCBwYWdlIHdoZW4gdGhlIHBhbmVsIGlzIGFjdGl2YXRlZC5cblxuaW1wb3J0IHsgaW5pdEJhY2tlbmQgfSBmcm9tICdzcmMvYmFja2VuZCdcbmltcG9ydCBCcmlkZ2UgZnJvbSAnc3JjL2JyaWRnZSdcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBoYW5kc2hha2UpXG5cbmZ1bmN0aW9uIGhhbmRzaGFrZSAoZSkge1xuICBpZiAoZS5kYXRhLnNvdXJjZSA9PT0gJ3Z1ZS1kZXZ0b29scy1wcm94eScgJiYgZS5kYXRhLnBheWxvYWQgPT09ICdpbml0Jykge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgaGFuZHNoYWtlKVxuXG4gICAgbGV0IGxpc3RlbmVycyA9IFtdXG4gICAgY29uc3QgYnJpZGdlID0gbmV3IEJyaWRnZSh7XG4gICAgICBsaXN0ZW4gKGZuKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lciA9IGV2dCA9PiB7XG4gICAgICAgICAgaWYgKGV2dC5kYXRhLnNvdXJjZSA9PT0gJ3Z1ZS1kZXZ0b29scy1wcm94eScgJiYgZXZ0LmRhdGEucGF5bG9hZCkge1xuICAgICAgICAgICAgZm4oZXZ0LmRhdGEucGF5bG9hZClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBsaXN0ZW5lcilcbiAgICAgICAgbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpXG4gICAgICB9LFxuICAgICAgc2VuZCAoZGF0YSkge1xuICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgIHNvdXJjZTogJ3Z1ZS1kZXZ0b29scy1iYWNrZW5kJyxcbiAgICAgICAgICBwYXlsb2FkOiBkYXRhXG4gICAgICAgIH0sICcqJylcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgYnJpZGdlLm9uKCdzaHV0ZG93bicsICgpID0+IHtcbiAgICAgIGxpc3RlbmVycy5mb3JFYWNoKGwgPT4ge1xuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGwpXG4gICAgICB9KVxuICAgICAgbGlzdGVuZXJzID0gW11cbiAgICB9KVxuXG4gICAgaW5pdEJhY2tlbmQoYnJpZGdlKVxuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvYmFja2VuZC5qcyIsIi8vIFRoaXMgaXMgdGhlIGJhY2tlbmQgdGhhdCBpcyBpbmplY3RlZCBpbnRvIHRoZSBwYWdlIHRoYXQgYSBWdWUgYXBwIGxpdmVzIGluXG4vLyB3aGVuIHRoZSBWdWUgRGV2dG9vbHMgcGFuZWwgaXMgYWN0aXZhdGVkLlxuXG5pbXBvcnQgeyBoaWdobGlnaHQsIHVuSGlnaGxpZ2h0LCBnZXRJbnN0YW5jZVJlY3QgfSBmcm9tICcuL2hpZ2hsaWdodGVyJ1xuaW1wb3J0IHsgaW5pdFZ1ZXhCYWNrZW5kIH0gZnJvbSAnLi92dWV4J1xuaW1wb3J0IHsgaW5pdEV2ZW50c0JhY2tlbmQgfSBmcm9tICcuL2V2ZW50cydcbmltcG9ydCB7IHN0cmluZ2lmeSwgY2xhc3NpZnksIGNhbWVsaXplIH0gZnJvbSAnLi4vdXRpbCdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5cbi8vIFVzZSBhIGN1c3RvbSBiYXNlbmFtZSBmdW5jdGlvbnMgaW5zdGVhZCBvZiB0aGUgc2hpbWVkIHZlcnNpb25cbi8vIGJlY2F1c2UgaXQgZG9lc24ndCB3b3JrIG9uIFdpbmRvd3NcbmZ1bmN0aW9uIGJhc2VuYW1lIChmaWxlbmFtZSwgZXh0KSB7XG4gIHJldHVybiBwYXRoLmJhc2VuYW1lKFxuICAgIGZpbGVuYW1lLnJlcGxhY2UoL15bYS16QS1aXTovLCAnJykucmVwbGFjZSgvXFxcXC9nLCAnLycpLFxuICAgIGV4dFxuICApXG59XG5cbi8vIGhvb2sgc2hvdWxkIGhhdmUgYmVlbiBpbmplY3RlZCBiZWZvcmUgdGhpcyBleGVjdXRlcy5cbmNvbnN0IGhvb2sgPSB3aW5kb3cuX19WVUVfREVWVE9PTFNfR0xPQkFMX0hPT0tfX1xuY29uc3Qgcm9vdEluc3RhbmNlcyA9IFtdXG5jb25zdCBwcm9wTW9kZXMgPSBbJ2RlZmF1bHQnLCAnc3luYycsICdvbmNlJ11cblxuY29uc3QgaW5zdGFuY2VNYXAgPSB3aW5kb3cuX19WVUVfREVWVE9PTFNfSU5TVEFOQ0VfTUFQX18gPSBuZXcgTWFwKClcbmNvbnN0IGNvbnNvbGVCb3VuZEluc3RhbmNlcyA9IEFycmF5KDUpXG5sZXQgY3VycmVudEluc3BlY3RlZElkXG5sZXQgYnJpZGdlXG5sZXQgZmlsdGVyID0gJydcbmxldCBjYXB0dXJlQ291bnQgPSAwXG5sZXQgaXNMZWdhY3kgPSBmYWxzZVxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdEJhY2tlbmQgKF9icmlkZ2UpIHtcbiAgYnJpZGdlID0gX2JyaWRnZVxuICBpZiAoaG9vay5WdWUpIHtcbiAgICBpc0xlZ2FjeSA9IGhvb2suVnVlLnZlcnNpb24gJiYgaG9vay5WdWUudmVyc2lvbi5zcGxpdCgnLicpWzBdID09PSAnMSdcbiAgICBjb25uZWN0KClcbiAgfSBlbHNlIHtcbiAgICBob29rLm9uY2UoJ2luaXQnLCBjb25uZWN0KVxuICB9XG59XG5cbmZ1bmN0aW9uIGNvbm5lY3QgKCkge1xuICBob29rLmN1cnJlbnRUYWIgPSAnY29tcG9uZW50cydcbiAgYnJpZGdlLm9uKCdzd2l0Y2gtdGFiJywgdGFiID0+IHtcbiAgICBob29rLmN1cnJlbnRUYWIgPSB0YWJcbiAgICBpZiAodGFiID09PSAnY29tcG9uZW50cycpIHtcbiAgICAgIGZsdXNoKClcbiAgICB9XG4gIH0pXG5cbiAgLy8gdGhlIGJhY2tlbmQgbWF5IGdldCBpbmplY3RlZCB0byB0aGUgc2FtZSBwYWdlIG11bHRpcGxlIHRpbWVzXG4gIC8vIGlmIHRoZSB1c2VyIGNsb3NlcyBhbmQgcmVvcGVucyB0aGUgZGV2dG9vbHMuXG4gIC8vIG1ha2Ugc3VyZSB0aGVyZSdzIG9ubHkgb25lIGZsdXNoIGxpc3RlbmVyLlxuICBob29rLm9mZignZmx1c2gnKVxuICBob29rLm9uKCdmbHVzaCcsICgpID0+IHtcbiAgICBpZiAoaG9vay5jdXJyZW50VGFiID09PSAnY29tcG9uZW50cycpIHtcbiAgICAgIGZsdXNoKClcbiAgICB9XG4gIH0pXG5cbiAgYnJpZGdlLm9uKCdzZWxlY3QtaW5zdGFuY2UnLCBpZCA9PiB7XG4gICAgY3VycmVudEluc3BlY3RlZElkID0gaWRcbiAgICBjb25zdCBpbnN0YW5jZSA9IGluc3RhbmNlTWFwLmdldChpZClcbiAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgIHNjcm9sbEludG9WaWV3KGluc3RhbmNlKVxuICAgICAgaGlnaGxpZ2h0KGluc3RhbmNlKVxuICAgIH1cbiAgICBiaW5kVG9Db25zb2xlKGluc3RhbmNlKVxuICAgIGZsdXNoKClcbiAgICBicmlkZ2Uuc2VuZCgnaW5zdGFuY2UtZGV0YWlscycsIHN0cmluZ2lmeShnZXRJbnN0YW5jZURldGFpbHMoaWQpKSlcbiAgfSlcblxuICBicmlkZ2Uub24oJ2ZpbHRlci1pbnN0YW5jZXMnLCBfZmlsdGVyID0+IHtcbiAgICBmaWx0ZXIgPSBfZmlsdGVyLnRvTG93ZXJDYXNlKClcbiAgICBmbHVzaCgpXG4gIH0pXG5cbiAgYnJpZGdlLm9uKCdyZWZyZXNoJywgc2NhbilcbiAgYnJpZGdlLm9uKCdlbnRlci1pbnN0YW5jZScsIGlkID0+IGhpZ2hsaWdodChpbnN0YW5jZU1hcC5nZXQoaWQpKSlcbiAgYnJpZGdlLm9uKCdsZWF2ZS1pbnN0YW5jZScsIHVuSGlnaGxpZ2h0KVxuXG4gIC8vIHZ1ZXhcbiAgaWYgKGhvb2suc3RvcmUpIHtcbiAgICBpbml0VnVleEJhY2tlbmQoaG9vaywgYnJpZGdlKVxuICB9IGVsc2Uge1xuICAgIGhvb2sub25jZSgndnVleDppbml0Jywgc3RvcmUgPT4ge1xuICAgICAgaW5pdFZ1ZXhCYWNrZW5kKGhvb2ssIGJyaWRnZSlcbiAgICB9KVxuICB9XG5cbiAgLy8gZXZlbnRzXG4gIGluaXRFdmVudHNCYWNrZW5kKGhvb2suVnVlLCBicmlkZ2UpXG5cbiAgYnJpZGdlLmxvZygnYmFja2VuZCByZWFkeS4nKVxuICBicmlkZ2Uuc2VuZCgncmVhZHknLCBob29rLlZ1ZS52ZXJzaW9uKVxuICBjb25zb2xlLmxvZygnW3Z1ZS1kZXZ0b29sc10gUmVhZHkuIERldGVjdGVkIFZ1ZSB2JyArIGhvb2suVnVlLnZlcnNpb24pXG4gIHNjYW4oKVxufVxuXG4vKipcbiAqIFNjYW4gdGhlIHBhZ2UgZm9yIHJvb3QgbGV2ZWwgVnVlIGluc3RhbmNlcy5cbiAqL1xuXG5mdW5jdGlvbiBzY2FuICgpIHtcbiAgcm9vdEluc3RhbmNlcy5sZW5ndGggPSAwXG4gIGxldCBpbkZyYWdtZW50ID0gZmFsc2VcbiAgbGV0IGN1cnJlbnRGcmFnbWVudCA9IG51bGxcbiAgd2Fsayhkb2N1bWVudCwgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICBpZiAoaW5GcmFnbWVudCkge1xuICAgICAgaWYgKG5vZGUgPT09IGN1cnJlbnRGcmFnbWVudC5fZnJhZ21lbnRFbmQpIHtcbiAgICAgICAgaW5GcmFnbWVudCA9IGZhbHNlXG4gICAgICAgIGN1cnJlbnRGcmFnbWVudCA9IG51bGxcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICAgIGNvbnN0IGluc3RhbmNlID0gbm9kZS5fX3Z1ZV9fXG4gICAgaWYgKGluc3RhbmNlKSB7XG4gICAgICBpZiAoaW5zdGFuY2UuX2lzRnJhZ21lbnQpIHtcbiAgICAgICAgaW5GcmFnbWVudCA9IHRydWVcbiAgICAgICAgY3VycmVudEZyYWdtZW50ID0gaW5zdGFuY2VcbiAgICAgIH1cblxuICAgICAgLy8gcmVzcGVjdCBWdWUuY29uZmlnLmRldnRvb2xzIG9wdGlvblxuICAgICAgbGV0IGJhc2VWdWUgPSBpbnN0YW5jZS5jb25zdHJ1Y3RvclxuICAgICAgd2hpbGUgKGJhc2VWdWUuc3VwZXIpIHtcbiAgICAgICAgYmFzZVZ1ZSA9IGJhc2VWdWUuc3VwZXJcbiAgICAgIH1cbiAgICAgIGlmIChiYXNlVnVlLmNvbmZpZyAmJiBiYXNlVnVlLmNvbmZpZy5kZXZ0b29scykge1xuICAgICAgICByb290SW5zdGFuY2VzLnB1c2goaW5zdGFuY2UpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9KVxuICBmbHVzaCgpXG59XG5cbi8qKlxuICogRE9NIHdhbGsgaGVscGVyXG4gKlxuICogQHBhcmFtIHtOb2RlTGlzdH0gbm9kZXNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKi9cblxuZnVuY3Rpb24gd2FsayAobm9kZSwgZm4pIHtcbiAgaWYgKG5vZGUuY2hpbGROb2Rlcykge1xuICAgIGZvciAobGV0IGkgPSAwLCBsID0gbm9kZS5jaGlsZE5vZGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgY29uc3QgY2hpbGQgPSBub2RlLmNoaWxkTm9kZXNbaV1cbiAgICAgIGNvbnN0IHN0b3AgPSBmbihjaGlsZClcbiAgICAgIGlmICghc3RvcCkge1xuICAgICAgICB3YWxrKGNoaWxkLCBmbilcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBhbHNvIHdhbGsgc2hhZG93IERPTVxuICBpZiAobm9kZS5zaGFkb3dSb290KSB7XG4gICAgd2Fsayhub2RlLnNoYWRvd1Jvb3QsIGZuKVxuICB9XG59XG5cbi8qKlxuICogQ2FsbGVkIG9uIGV2ZXJ5IFZ1ZS5qcyBiYXRjaGVyIGZsdXNoIGN5Y2xlLlxuICogQ2FwdHVyZSBjdXJyZW50IGNvbXBvbmVudCB0cmVlIHN0cnVjdHVyZSBhbmQgdGhlIHN0YXRlXG4gKiBvZiB0aGUgY3VycmVudCBpbnNwZWN0ZWQgaW5zdGFuY2UgKGlmIHByZXNlbnQpIGFuZFxuICogc2VuZCBpdCB0byB0aGUgZGV2dG9vbHMuXG4gKi9cblxuZnVuY3Rpb24gZmx1c2ggKCkge1xuICBsZXQgc3RhcnRcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBjYXB0dXJlQ291bnQgPSAwXG4gICAgc3RhcnQgPSB3aW5kb3cucGVyZm9ybWFuY2Uubm93KClcbiAgfVxuICBjb25zdCBwYXlsb2FkID0gc3RyaW5naWZ5KHtcbiAgICBpbnNwZWN0ZWRJbnN0YW5jZTogZ2V0SW5zdGFuY2VEZXRhaWxzKGN1cnJlbnRJbnNwZWN0ZWRJZCksXG4gICAgaW5zdGFuY2VzOiBmaW5kUXVhbGlmaWVkQ2hpbGRyZW5Gcm9tTGlzdChyb290SW5zdGFuY2VzKVxuICB9KVxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGNvbnNvbGUubG9nKGBbZmx1c2hdIHNlcmlhbGl6ZWQgJHtjYXB0dXJlQ291bnR9IGluc3RhbmNlcywgdG9vayAke3dpbmRvdy5wZXJmb3JtYW5jZS5ub3coKSAtIHN0YXJ0fW1zLmApXG4gIH1cbiAgYnJpZGdlLnNlbmQoJ2ZsdXNoJywgcGF5bG9hZClcbn1cblxuLyoqXG4gKiBJdGVyYXRlIHRocm91Z2ggYW4gYXJyYXkgb2YgaW5zdGFuY2VzIGFuZCBmbGF0dGVuIGl0IGludG9cbiAqIGFuIGFycmF5IG9mIHF1YWxpZmllZCBpbnN0YW5jZXMuIFRoaXMgaXMgYSBkZXB0aC1maXJzdFxuICogdHJhdmVyc2FsIC0gZS5nLiBpZiBhbiBpbnN0YW5jZSBpcyBub3QgbWF0Y2hlZCwgd2Ugd2lsbFxuICogcmVjdXJzaXZlbHkgZ28gZGVlcGVyIHVudGlsIGEgcXVhbGlmaWVkIGNoaWxkIGlzIGZvdW5kLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGluc3RhbmNlc1xuICogQHJldHVybiB7QXJyYXl9XG4gKi9cblxuZnVuY3Rpb24gZmluZFF1YWxpZmllZENoaWxkcmVuRnJvbUxpc3QgKGluc3RhbmNlcykge1xuICBpbnN0YW5jZXMgPSBpbnN0YW5jZXNcbiAgICAuZmlsdGVyKGNoaWxkID0+ICFjaGlsZC5faXNCZWluZ0Rlc3Ryb3llZClcbiAgcmV0dXJuICFmaWx0ZXJcbiAgICA/IGluc3RhbmNlcy5tYXAoY2FwdHVyZSlcbiAgICA6IEFycmF5LnByb3RvdHlwZS5jb25jYXQuYXBwbHkoW10sIGluc3RhbmNlcy5tYXAoZmluZFF1YWxpZmllZENoaWxkcmVuKSlcbn1cblxuLyoqXG4gKiBGaW5kIHF1YWxpZmllZCBjaGlsZHJlbiBmcm9tIGEgc2luZ2xlIGluc3RhbmNlLlxuICogSWYgdGhlIGluc3RhbmNlIGl0c2VsZiBpcyBxdWFsaWZpZWQsIGp1c3QgcmV0dXJuIGl0c2VsZi5cbiAqIFRoaXMgaXMgb2sgYmVjYXVzZSBbXS5jb25jYXQgd29ya3MgaW4gYm90aCBjYXNlcy5cbiAqXG4gKiBAcGFyYW0ge1Z1ZX0gaW5zdGFuY2VcbiAqIEByZXR1cm4ge1Z1ZXxBcnJheX1cbiAqL1xuXG5mdW5jdGlvbiBmaW5kUXVhbGlmaWVkQ2hpbGRyZW4gKGluc3RhbmNlKSB7XG4gIHJldHVybiBpc1F1YWxpZmllZChpbnN0YW5jZSlcbiAgICA/IGNhcHR1cmUoaW5zdGFuY2UpXG4gICAgOiBmaW5kUXVhbGlmaWVkQ2hpbGRyZW5Gcm9tTGlzdChpbnN0YW5jZS4kY2hpbGRyZW4pXG59XG5cbi8qKlxuICogQ2hlY2sgaWYgYW4gaW5zdGFuY2UgaXMgcXVhbGlmaWVkLlxuICpcbiAqIEBwYXJhbSB7VnVlfSBpbnN0YW5jZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuXG5mdW5jdGlvbiBpc1F1YWxpZmllZCAoaW5zdGFuY2UpIHtcbiAgY29uc3QgbmFtZSA9IGdldEluc3RhbmNlTmFtZShpbnN0YW5jZSkudG9Mb3dlckNhc2UoKVxuICByZXR1cm4gbmFtZS5pbmRleE9mKGZpbHRlcikgPiAtMVxufVxuXG4vKipcbiAqIENhcHR1cmUgdGhlIG1ldGEgaW5mb3JtYXRpb24gb2YgYW4gaW5zdGFuY2UuIChyZWN1cnNpdmUpXG4gKlxuICogQHBhcmFtIHtWdWV9IGluc3RhbmNlXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cblxuZnVuY3Rpb24gY2FwdHVyZSAoaW5zdGFuY2UsIF8sIGxpc3QpIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBjYXB0dXJlQ291bnQrK1xuICB9XG4gIG1hcmsoaW5zdGFuY2UpXG4gIGNvbnN0IHJldCA9IHtcbiAgICBpZDogaW5zdGFuY2UuX3VpZCxcbiAgICBuYW1lOiBnZXRJbnN0YW5jZU5hbWUoaW5zdGFuY2UpLFxuICAgIGluYWN0aXZlOiAhIWluc3RhbmNlLl9pbmFjdGl2ZSxcbiAgICBpc0ZyYWdtZW50OiAhIWluc3RhbmNlLl9pc0ZyYWdtZW50LFxuICAgIGNoaWxkcmVuOiBpbnN0YW5jZS4kY2hpbGRyZW5cbiAgICAgIC5maWx0ZXIoY2hpbGQgPT4gIWNoaWxkLl9pc0JlaW5nRGVzdHJveWVkKVxuICAgICAgLm1hcChjYXB0dXJlKVxuICB9XG4gIC8vIHJlY29yZCBzY3JlZW4gcG9zaXRpb24gdG8gZW5zdXJlIGNvcnJlY3Qgb3JkZXJpbmdcbiAgaWYgKCghbGlzdCB8fCBsaXN0Lmxlbmd0aCA+IDEpICYmICFpbnN0YW5jZS5faW5hY3RpdmUpIHtcbiAgICBjb25zdCByZWN0ID0gZ2V0SW5zdGFuY2VSZWN0KGluc3RhbmNlKVxuICAgIHJldC50b3AgPSByZWN0ID8gcmVjdC50b3AgOiBJbmZpbml0eVxuICB9IGVsc2Uge1xuICAgIHJldC50b3AgPSBJbmZpbml0eVxuICB9XG4gIC8vIGNoZWNrIGlmIGluc3RhbmNlIGlzIGF2YWlsYWJsZSBpbiBjb25zb2xlXG4gIGNvbnN0IGNvbnNvbGVJZCA9IGNvbnNvbGVCb3VuZEluc3RhbmNlcy5pbmRleE9mKGluc3RhbmNlLl91aWQpXG4gIHJldC5jb25zb2xlSWQgPSBjb25zb2xlSWQgPiAtMSA/ICckdm0nICsgY29uc29sZUlkIDogbnVsbFxuICAvLyBjaGVjayByb3V0ZXIgdmlld1xuICBjb25zdCBpc1JvdXRlclZpZXcyID0gaW5zdGFuY2UuJHZub2RlICYmIGluc3RhbmNlLiR2bm9kZS5kYXRhLnJvdXRlclZpZXdcbiAgaWYgKGluc3RhbmNlLl9yb3V0ZXJWaWV3IHx8IGlzUm91dGVyVmlldzIpIHtcbiAgICByZXQuaXNSb3V0ZXJWaWV3ID0gdHJ1ZVxuICAgIGlmICghaW5zdGFuY2UuX2luYWN0aXZlKSB7XG4gICAgICBjb25zdCBtYXRjaGVkID0gaW5zdGFuY2UuJHJvdXRlLm1hdGNoZWRcbiAgICAgIGNvbnN0IGRlcHRoID0gaXNSb3V0ZXJWaWV3MlxuICAgICAgICA/IGluc3RhbmNlLiR2bm9kZS5kYXRhLnJvdXRlclZpZXdEZXB0aFxuICAgICAgICA6IGluc3RhbmNlLl9yb3V0ZXJWaWV3LmRlcHRoXG4gICAgICByZXQubWF0Y2hlZFJvdXRlU2VnbWVudCA9XG4gICAgICAgIG1hdGNoZWQgJiZcbiAgICAgICAgbWF0Y2hlZFtkZXB0aF0gJiZcbiAgICAgICAgKGlzUm91dGVyVmlldzIgPyBtYXRjaGVkW2RlcHRoXS5wYXRoIDogbWF0Y2hlZFtkZXB0aF0uaGFuZGxlci5wYXRoKVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbi8qKlxuICogTWFyayBhbiBpbnN0YW5jZSBhcyBjYXB0dXJlZCBhbmQgc3RvcmUgaXQgaW4gdGhlIGluc3RhbmNlIG1hcC5cbiAqXG4gKiBAcGFyYW0ge1Z1ZX0gaW5zdGFuY2VcbiAqL1xuXG5mdW5jdGlvbiBtYXJrIChpbnN0YW5jZSkge1xuICBpZiAoIWluc3RhbmNlTWFwLmhhcyhpbnN0YW5jZS5fdWlkKSkge1xuICAgIGluc3RhbmNlTWFwLnNldChpbnN0YW5jZS5fdWlkLCBpbnN0YW5jZSlcbiAgICBpbnN0YW5jZS4kb24oJ2hvb2s6YmVmb3JlRGVzdHJveScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGluc3RhbmNlTWFwLmRlbGV0ZShpbnN0YW5jZS5fdWlkKVxuICAgIH0pXG4gIH1cbn1cblxuLyoqXG4gKiBHZXQgdGhlIGRldGFpbGVkIGluZm9ybWF0aW9uIG9mIGFuIGluc3BlY3RlZCBpbnN0YW5jZS5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gaWRcbiAqL1xuXG5mdW5jdGlvbiBnZXRJbnN0YW5jZURldGFpbHMgKGlkKSB7XG4gIGNvbnN0IGluc3RhbmNlID0gaW5zdGFuY2VNYXAuZ2V0KGlkKVxuICBpZiAoIWluc3RhbmNlKSB7XG4gICAgcmV0dXJuIHt9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBpZCxcbiAgICAgIG5hbWU6IGdldEluc3RhbmNlTmFtZShpbnN0YW5jZSksXG4gICAgICBzdGF0ZTogcHJvY2Vzc1Byb3BzKGluc3RhbmNlKS5jb25jYXQoXG4gICAgICAgIHByb2Nlc3NTdGF0ZShpbnN0YW5jZSksXG4gICAgICAgIHByb2Nlc3NDb21wdXRlZChpbnN0YW5jZSksXG4gICAgICAgIHByb2Nlc3NSb3V0ZUNvbnRleHQoaW5zdGFuY2UpLFxuICAgICAgICBwcm9jZXNzVnVleEdldHRlcnMoaW5zdGFuY2UpLFxuICAgICAgICBwcm9jZXNzRmlyZWJhc2VCaW5kaW5ncyhpbnN0YW5jZSksXG4gICAgICAgIHByb2Nlc3NPYnNlcnZhYmxlcyhpbnN0YW5jZSlcbiAgICAgIClcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBHZXQgdGhlIGFwcHJvcHJpYXRlIGRpc3BsYXkgbmFtZSBmb3IgYW4gaW5zdGFuY2UuXG4gKlxuICogQHBhcmFtIHtWdWV9IGluc3RhbmNlXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEluc3RhbmNlTmFtZSAoaW5zdGFuY2UpIHtcbiAgY29uc3QgbmFtZSA9IGluc3RhbmNlLiRvcHRpb25zLm5hbWUgfHwgaW5zdGFuY2UuJG9wdGlvbnMuX2NvbXBvbmVudFRhZ1xuICBpZiAobmFtZSkge1xuICAgIHJldHVybiBjbGFzc2lmeShuYW1lKVxuICB9XG4gIGNvbnN0IGZpbGUgPSBpbnN0YW5jZS4kb3B0aW9ucy5fX2ZpbGUgLy8gaW5qZWN0ZWQgYnkgdnVlLWxvYWRlclxuICBpZiAoZmlsZSkge1xuICAgIHJldHVybiBjbGFzc2lmeShiYXNlbmFtZShmaWxlLCAnLnZ1ZScpKVxuICB9XG4gIHJldHVybiBpbnN0YW5jZS4kcm9vdCA9PT0gaW5zdGFuY2VcbiAgICA/ICdSb290J1xuICAgIDogJ0Fub255bW91cyBDb21wb25lbnQnXG59XG5cbi8qKlxuICogUHJvY2VzcyB0aGUgcHJvcHMgb2YgYW4gaW5zdGFuY2UuXG4gKiBNYWtlIHN1cmUgcmV0dXJuIGEgcGxhaW4gb2JqZWN0IGJlY2F1c2Ugd2luZG93LnBvc3RNZXNzYWdlKClcbiAqIHdpbGwgdGhyb3cgYW4gRXJyb3IgaWYgdGhlIHBhc3NlZCBvYmplY3QgY29udGFpbnMgRnVuY3Rpb25zLlxuICpcbiAqIEBwYXJhbSB7VnVlfSBpbnN0YW5jZVxuICogQHJldHVybiB7QXJyYXl9XG4gKi9cblxuZnVuY3Rpb24gcHJvY2Vzc1Byb3BzIChpbnN0YW5jZSkge1xuICBsZXQgcHJvcHNcbiAgaWYgKGlzTGVnYWN5ICYmIChwcm9wcyA9IGluc3RhbmNlLl9wcm9wcykpIHtcbiAgICAvLyAxLnhcbiAgICByZXR1cm4gT2JqZWN0LmtleXMocHJvcHMpLm1hcChrZXkgPT4ge1xuICAgICAgY29uc3QgcHJvcCA9IHByb3BzW2tleV1cbiAgICAgIGNvbnN0IG9wdGlvbnMgPSBwcm9wLm9wdGlvbnNcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6ICdwcm9wcycsXG4gICAgICAgIGtleTogcHJvcC5wYXRoLFxuICAgICAgICB2YWx1ZTogaW5zdGFuY2VbcHJvcC5wYXRoXSxcbiAgICAgICAgbWV0YToge1xuICAgICAgICAgIHR5cGU6IG9wdGlvbnMudHlwZSA/IGdldFByb3BUeXBlKG9wdGlvbnMudHlwZSkgOiAnYW55JyxcbiAgICAgICAgICByZXF1aXJlZDogISFvcHRpb25zLnJlcXVpcmVkLFxuICAgICAgICAgIG1vZGU6IHByb3BNb2Rlc1twcm9wLm1vZGVdXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9IGVsc2UgaWYgKChwcm9wcyA9IGluc3RhbmNlLiRvcHRpb25zLnByb3BzKSkge1xuICAgIC8vIDIuMFxuICAgIHJldHVybiBPYmplY3Qua2V5cyhwcm9wcykubWFwKGtleSA9PiB7XG4gICAgICBjb25zdCBwcm9wID0gcHJvcHNba2V5XVxuICAgICAga2V5ID0gY2FtZWxpemUoa2V5KVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogJ3Byb3BzJyxcbiAgICAgICAga2V5LFxuICAgICAgICB2YWx1ZTogaW5zdGFuY2Vba2V5XSxcbiAgICAgICAgbWV0YToge1xuICAgICAgICAgIHR5cGU6IHByb3AudHlwZSA/IGdldFByb3BUeXBlKHByb3AudHlwZSkgOiAnYW55JyxcbiAgICAgICAgICByZXF1aXJlZDogISFwcm9wLnJlcXVpcmVkXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBbXVxuICB9XG59XG5cbi8qKlxuICogQ29udmVydCBwcm9wIHR5cGUgY29uc3RydWN0b3IgdG8gc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKi9cblxuY29uc3QgZm5UeXBlUkUgPSAvXig/OmZ1bmN0aW9ufGNsYXNzKSAoXFx3KykvXG5mdW5jdGlvbiBnZXRQcm9wVHlwZSAodHlwZSkge1xuICBjb25zdCBtYXRjaCA9IHR5cGUudG9TdHJpbmcoKS5tYXRjaChmblR5cGVSRSlcbiAgcmV0dXJuIHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nXG4gICAgPyBtYXRjaCAmJiBtYXRjaFsxXSB8fCAnYW55J1xuICAgIDogJ2FueSdcbn1cblxuLyoqXG4gKiBQcm9jZXNzIHN0YXRlLCBmaWx0ZXJpbmcgb3V0IHByb3BzIGFuZCBcImNsZWFuXCIgdGhlIHJlc3VsdFxuICogd2l0aCBhIEpTT04gZGFuY2UuIFRoaXMgcmVtb3ZlcyBmdW5jdGlvbnMgd2hpY2ggY2FuIGNhdXNlXG4gKiBlcnJvcnMgZHVyaW5nIHN0cnVjdHVyZWQgY2xvbmUgdXNlZCBieSB3aW5kb3cucG9zdE1lc3NhZ2UuXG4gKlxuICogQHBhcmFtIHtWdWV9IGluc3RhbmNlXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuXG5mdW5jdGlvbiBwcm9jZXNzU3RhdGUgKGluc3RhbmNlKSB7XG4gIGNvbnN0IHByb3BzID0gaXNMZWdhY3lcbiAgICA/IGluc3RhbmNlLl9wcm9wc1xuICAgIDogaW5zdGFuY2UuJG9wdGlvbnMucHJvcHNcbiAgY29uc3QgZ2V0dGVycyA9XG4gICAgaW5zdGFuY2UuJG9wdGlvbnMudnVleCAmJlxuICAgIGluc3RhbmNlLiRvcHRpb25zLnZ1ZXguZ2V0dGVyc1xuICByZXR1cm4gT2JqZWN0LmtleXMoaW5zdGFuY2UuX2RhdGEpXG4gICAgLmZpbHRlcihrZXkgPT4gKFxuICAgICAgIShwcm9wcyAmJiBrZXkgaW4gcHJvcHMpICYmXG4gICAgICAhKGdldHRlcnMgJiYga2V5IGluIGdldHRlcnMpXG4gICAgKSlcbiAgICAubWFwKGtleSA9PiAoe1xuICAgICAga2V5LFxuICAgICAgdmFsdWU6IGluc3RhbmNlLl9kYXRhW2tleV1cbiAgICB9KSlcbn1cblxuLyoqXG4gKiBQcm9jZXNzIHRoZSBjb21wdXRlZCBwcm9wZXJ0aWVzIG9mIGFuIGluc3RhbmNlLlxuICpcbiAqIEBwYXJhbSB7VnVlfSBpbnN0YW5jZVxuICogQHJldHVybiB7QXJyYXl9XG4gKi9cblxuZnVuY3Rpb24gcHJvY2Vzc0NvbXB1dGVkIChpbnN0YW5jZSkge1xuICBjb25zdCBjb21wdXRlZCA9IFtdXG4gIGNvbnN0IGRlZnMgPSBpbnN0YW5jZS4kb3B0aW9ucy5jb21wdXRlZCB8fCB7fVxuICAvLyB1c2UgZm9yLi4uaW4gaGVyZSBiZWNhdXNlIGlmICdjb21wdXRlZCcgaXMgbm90IGRlZmluZWRcbiAgLy8gb24gY29tcG9uZW50LCBjb21wdXRlZCBwcm9wZXJ0aWVzIHdpbGwgYmUgcGxhY2VkIGluIHByb3RvdHlwZVxuICAvLyBhbmQgT2JqZWN0LmtleXMgZG9lcyBub3QgaW5jbHVkZVxuICAvLyBwcm9wZXJ0aWVzIGZyb20gb2JqZWN0J3MgcHJvdG90eXBlXG4gIGZvciAoY29uc3Qga2V5IGluIGRlZnMpIHtcbiAgICBjb25zdCBkZWYgPSBkZWZzW2tleV1cbiAgICBjb25zdCB0eXBlID0gdHlwZW9mIGRlZiA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWYudnVleFxuICAgICAgPyAndnVleCBiaW5kaW5ncydcbiAgICAgIDogJ2NvbXB1dGVkJ1xuICAgIC8vIHVzZSB0cnkgLi4uIGNhdGNoIGhlcmUgYmVjYXVzZSBzb21lIGNvbXB1dGVkIHByb3BlcnRpZXMgbWF5XG4gICAgLy8gdGhyb3cgZXJyb3IgZHVyaW5nIGl0cyBldmFsdWF0aW9uXG4gICAgbGV0IGNvbXB1dGVkUHJvcCA9IG51bGxcbiAgICB0cnkge1xuICAgICAgY29tcHV0ZWRQcm9wID0ge1xuICAgICAgICB0eXBlLFxuICAgICAgICBrZXksXG4gICAgICAgIHZhbHVlOiBpbnN0YW5jZVtrZXldXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29tcHV0ZWRQcm9wID0ge1xuICAgICAgICB0eXBlLFxuICAgICAgICBrZXksXG4gICAgICAgIHZhbHVlOiAnKGVycm9yIGR1cmluZyBldmFsdWF0aW9uKSdcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb21wdXRlZC5wdXNoKGNvbXB1dGVkUHJvcClcbiAgfVxuXG4gIHJldHVybiBjb21wdXRlZFxufVxuXG4vKipcbiAqIFByb2Nlc3MgcG9zc2libGUgdnVlLXJvdXRlciAkcm91dGUgY29udGV4dFxuICpcbiAqIEBwYXJhbSB7VnVlfSBpbnN0YW5jZVxuICogQHJldHVybiB7QXJyYXl9XG4gKi9cblxuZnVuY3Rpb24gcHJvY2Vzc1JvdXRlQ29udGV4dCAoaW5zdGFuY2UpIHtcbiAgY29uc3Qgcm91dGUgPSBpbnN0YW5jZS4kcm91dGVcbiAgaWYgKHJvdXRlKSB7XG4gICAgY29uc3QgeyBwYXRoLCBxdWVyeSwgcGFyYW1zIH0gPSByb3V0ZVxuICAgIGNvbnN0IHZhbHVlID0geyBwYXRoLCBxdWVyeSwgcGFyYW1zIH1cbiAgICBpZiAocm91dGUuZnVsbFBhdGgpIHZhbHVlLmZ1bGxQYXRoID0gcm91dGUuZnVsbFBhdGhcbiAgICBpZiAocm91dGUuaGFzaCkgdmFsdWUuaGFzaCA9IHJvdXRlLmhhc2hcbiAgICBpZiAocm91dGUubmFtZSkgdmFsdWUubmFtZSA9IHJvdXRlLm5hbWVcbiAgICBpZiAocm91dGUubWV0YSkgdmFsdWUubWV0YSA9IHJvdXRlLm1ldGFcbiAgICByZXR1cm4gW3tcbiAgICAgIGtleTogJyRyb3V0ZScsXG4gICAgICB2YWx1ZVxuICAgIH1dXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFtdXG4gIH1cbn1cblxuLyoqXG4gKiBQcm9jZXNzIFZ1ZXggZ2V0dGVycy5cbiAqXG4gKiBAcGFyYW0ge1Z1ZX0gaW5zdGFuY2VcbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5cbmZ1bmN0aW9uIHByb2Nlc3NWdWV4R2V0dGVycyAoaW5zdGFuY2UpIHtcbiAgY29uc3QgZ2V0dGVycyA9XG4gICAgaW5zdGFuY2UuJG9wdGlvbnMudnVleCAmJlxuICAgIGluc3RhbmNlLiRvcHRpb25zLnZ1ZXguZ2V0dGVyc1xuICBpZiAoZ2V0dGVycykge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhnZXR0ZXJzKS5tYXAoa2V5ID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6ICd2dWV4IGdldHRlcnMnLFxuICAgICAgICBrZXksXG4gICAgICAgIHZhbHVlOiBpbnN0YW5jZVtrZXldXG4gICAgICB9XG4gICAgfSlcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gW11cbiAgfVxufVxuXG4vKipcbiAqIFByb2Nlc3MgRmlyZWJhc2UgYmluZGluZ3MuXG4gKlxuICogQHBhcmFtIHtWdWV9IGluc3RhbmNlXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuXG5mdW5jdGlvbiBwcm9jZXNzRmlyZWJhc2VCaW5kaW5ncyAoaW5zdGFuY2UpIHtcbiAgdmFyIHJlZnMgPSBpbnN0YW5jZS4kZmlyZWJhc2VSZWZzXG4gIGlmIChyZWZzKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHJlZnMpLm1hcChrZXkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogJ2ZpcmViYXNlIGJpbmRpbmdzJyxcbiAgICAgICAga2V5LFxuICAgICAgICB2YWx1ZTogaW5zdGFuY2Vba2V5XVxuICAgICAgfVxuICAgIH0pXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFtdXG4gIH1cbn1cblxuLyoqXG4gKiBQcm9jZXNzIHZ1ZS1yeCBvYnNlcnZhYmxlIGJpbmRpbmdzLlxuICpcbiAqIEBwYXJhbSB7VnVlfSBpbnN0YW5jZVxuICogQHJldHVybiB7QXJyYXl9XG4gKi9cblxuZnVuY3Rpb24gcHJvY2Vzc09ic2VydmFibGVzIChpbnN0YW5jZSkge1xuICB2YXIgb2JzID0gaW5zdGFuY2UuJG9ic2VydmFibGVzXG4gIGlmIChvYnMpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMob2JzKS5tYXAoa2V5ID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6ICdvYnNlcnZhYmxlcycsXG4gICAgICAgIGtleSxcbiAgICAgICAgdmFsdWU6IGluc3RhbmNlW2tleV1cbiAgICAgIH1cbiAgICB9KVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBbXVxuICB9XG59XG5cbi8qKlxuICogU3JvbGwgYSBub2RlIGludG8gdmlldy5cbiAqXG4gKiBAcGFyYW0ge1Z1ZX0gaW5zdGFuY2VcbiAqL1xuXG5mdW5jdGlvbiBzY3JvbGxJbnRvVmlldyAoaW5zdGFuY2UpIHtcbiAgY29uc3QgcmVjdCA9IGdldEluc3RhbmNlUmVjdChpbnN0YW5jZSlcbiAgaWYgKHJlY3QpIHtcbiAgICB3aW5kb3cuc2Nyb2xsQnkoMCwgcmVjdC50b3ApXG4gIH1cbn1cblxuLyoqXG4gKiBCaW5kcyBnaXZlbiBpbnN0YW5jZSBpbiBjb25zb2xlIGFzICR2bTAuXG4gKiBGb3IgY29tcGF0aWJpbGl0eSByZWFzb25zIGl0IGFsc28gYmluZHMgaXQgYXMgJHZtLlxuICpcbiAqIEBwYXJhbSB7VnVlfSBpbnN0YW5jZVxuICovXG5cbmZ1bmN0aW9uIGJpbmRUb0NvbnNvbGUgKGluc3RhbmNlKSB7XG4gIGNvbnN0IGlkID0gaW5zdGFuY2UuX3VpZFxuICBjb25zdCBpbmRleCA9IGNvbnNvbGVCb3VuZEluc3RhbmNlcy5pbmRleE9mKGlkKVxuICBpZiAoaW5kZXggPiAtMSkge1xuICAgIGNvbnNvbGVCb3VuZEluc3RhbmNlcy5zcGxpY2UoaW5kZXgsIDEpXG4gIH0gZWxzZSB7XG4gICAgY29uc29sZUJvdW5kSW5zdGFuY2VzLnBvcCgpXG4gIH1cbiAgY29uc29sZUJvdW5kSW5zdGFuY2VzLnVuc2hpZnQoaWQpXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgNTsgaSsrKSB7XG4gICAgd2luZG93Wyckdm0nICsgaV0gPSBpbnN0YW5jZU1hcC5nZXQoY29uc29sZUJvdW5kSW5zdGFuY2VzW2ldKVxuICB9XG4gIHdpbmRvdy4kdm0gPSBpbnN0YW5jZVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC9Vc2Vycy9odWEvRG9jdW1lbnRzL+WFtuS7lumhueebri9kZHYtZGV2dG9vbHMvc3JjL2JhY2tlbmQvaW5kZXguanMiLCJpbXBvcnQgeyBzdHJpbmdpZnkgfSBmcm9tICcuLi91dGlsJ1xuaW1wb3J0IHsgZ2V0SW5zdGFuY2VOYW1lIH0gZnJvbSAnLi9pbmRleCdcblxuY29uc3QgaW50ZXJuYWxSRSA9IC9eKD86cHJlLSk/aG9vazovXG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0RXZlbnRzQmFja2VuZCAoVnVlLCBicmlkZ2UpIHtcbiAgbGV0IHJlY29yZGluZyA9IHRydWVcblxuICBicmlkZ2Uub24oJ2V2ZW50czp0b2dnbGUtcmVjb3JkaW5nJywgZW5hYmxlZCA9PiB7XG4gICAgcmVjb3JkaW5nID0gZW5hYmxlZFxuICB9KVxuXG4gIGZ1bmN0aW9uIGxvZ0V2ZW50ICh2bSwgdHlwZSwgZXZlbnROYW1lLCBwYXlsb2FkKSB7XG4gICAgLy8gVGhlIHN0cmluZyBjaGVjayBpcyBpbXBvcnRhbnQgZm9yIGNvbXBhdCB3aXRoIDEueCB3aGVyZSB0aGUgZmlyc3RcbiAgICAvLyBhcmd1bWVudCBtYXkgYmUgYW4gb2JqZWN0IGluc3RlYWQgb2YgYSBzdHJpbmcuXG4gICAgLy8gdGhpcyBhbHNvIGVuc3VyZXMgdGhlIGV2ZW50IGlzIG9ubHkgbG9nZ2VkIGZvciBkaXJlY3QgJGVtaXQgKHNvdXJjZSlcbiAgICAvLyBpbnN0ZWFkIG9mIGJ5ICRkaXNwYXRjaC8kYnJvYWRjYXN0XG4gICAgaWYgKHR5cGVvZiBldmVudE5hbWUgPT09ICdzdHJpbmcnICYmICFpbnRlcm5hbFJFLnRlc3QoZXZlbnROYW1lKSkge1xuICAgICAgYnJpZGdlLnNlbmQoJ2V2ZW50OnRyaWdnZXJlZCcsIHN0cmluZ2lmeSh7XG4gICAgICAgIGV2ZW50TmFtZSxcbiAgICAgICAgdHlwZSxcbiAgICAgICAgcGF5bG9hZCxcbiAgICAgICAgaW5zdGFuY2VJZDogdm0uX3VpZCxcbiAgICAgICAgaW5zdGFuY2VOYW1lOiBnZXRJbnN0YW5jZU5hbWUodm0uX3NlbGYgfHwgdm0pLFxuICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KClcbiAgICAgIH0pKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHdyYXAgKG1ldGhvZCkge1xuICAgIGNvbnN0IG9yaWdpbmFsID0gVnVlLnByb3RvdHlwZVttZXRob2RdXG4gICAgaWYgKG9yaWdpbmFsKSB7XG4gICAgICBWdWUucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICBjb25zdCByZXMgPSBvcmlnaW5hbC5hcHBseSh0aGlzLCBhcmdzKVxuICAgICAgICBpZiAocmVjb3JkaW5nKSB7XG4gICAgICAgICAgbG9nRXZlbnQodGhpcywgbWV0aG9kLCBhcmdzWzBdLCBhcmdzLnNsaWNlKDEpKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB3cmFwKCckZW1pdCcpXG4gIHdyYXAoJyRicm9hZGNhc3QnKVxuICB3cmFwKCckZGlzcGF0Y2gnKVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC9Vc2Vycy9odWEvRG9jdW1lbnRzL+WFtuS7lumhueebri9kZHYtZGV2dG9vbHMvc3JjL2JhY2tlbmQvZXZlbnRzLmpzIiwiaW1wb3J0IHsgaW5Eb2MgfSBmcm9tICcuLi91dGlsJ1xuXG5jb25zdCBvdmVybGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jylcbm92ZXJsYXkuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3JnYmEoMTA0LCAxODIsIDI1NSwgMC4zNSknXG5vdmVybGF5LnN0eWxlLnBvc2l0aW9uID0gJ2ZpeGVkJ1xub3ZlcmxheS5zdHlsZS56SW5kZXggPSAnOTk5OTk5OTk5OTk5OTknXG5vdmVybGF5LnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSdcblxuLyoqXG4gKiBIaWdobGlnaHQgYW4gaW5zdGFuY2UuXG4gKlxuICogQHBhcmFtIHtWdWV9IGluc3RhbmNlXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGhpZ2hsaWdodCAoaW5zdGFuY2UpIHtcbiAgaWYgKCFpbnN0YW5jZSkgcmV0dXJuXG4gIGNvbnN0IHJlY3QgPSBnZXRJbnN0YW5jZVJlY3QoaW5zdGFuY2UpXG4gIGlmIChyZWN0KSB7XG4gICAgc2hvd092ZXJsYXkocmVjdClcbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZSBoaWdobGlnaHQgb3ZlcmxheS5cbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gdW5IaWdobGlnaHQgKCkge1xuICBpZiAob3ZlcmxheS5wYXJlbnROb2RlKSB7XG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChvdmVybGF5KVxuICB9XG59XG5cbi8qKlxuICogR2V0IHRoZSBjbGllbnQgcmVjdCBmb3IgYW4gaW5zdGFuY2UuXG4gKlxuICogQHBhcmFtIHtWdWV9IGluc3RhbmNlXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEluc3RhbmNlUmVjdCAoaW5zdGFuY2UpIHtcbiAgaWYgKCFpbkRvYyhpbnN0YW5jZS4kZWwpKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgaWYgKGluc3RhbmNlLl9pc0ZyYWdtZW50KSB7XG4gICAgcmV0dXJuIGdldEZyYWdtZW50UmVjdChpbnN0YW5jZSlcbiAgfSBlbHNlIGlmIChpbnN0YW5jZS4kZWwubm9kZVR5cGUgPT09IDEpIHtcbiAgICByZXR1cm4gaW5zdGFuY2UuJGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gIH1cbn1cblxuLyoqXG4gKiBIaWdobGlnaHQgYSBmcmFnbWVudCBpbnN0YW5jZS5cbiAqIExvb3Agb3ZlciBpdHMgbm9kZSByYW5nZSBhbmQgZGV0ZXJtaW5lIGl0cyBib3VuZGluZyBib3guXG4gKlxuICogQHBhcmFtIHtWdWV9IGluc3RhbmNlXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cblxuZnVuY3Rpb24gZ2V0RnJhZ21lbnRSZWN0ICh7IF9mcmFnbWVudFN0YXJ0LCBfZnJhZ21lbnRFbmQgfSkge1xuICBsZXQgdG9wLCBib3R0b20sIGxlZnQsIHJpZ2h0XG4gIHV0aWwoKS5tYXBOb2RlUmFuZ2UoX2ZyYWdtZW50U3RhcnQsIF9mcmFnbWVudEVuZCwgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICBsZXQgcmVjdFxuICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAxIHx8IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KSB7XG4gICAgICByZWN0ID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIH0gZWxzZSBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMyAmJiBub2RlLmRhdGEudHJpbSgpKSB7XG4gICAgICByZWN0ID0gZ2V0VGV4dFJlY3Qobm9kZSlcbiAgICB9XG4gICAgaWYgKHJlY3QpIHtcbiAgICAgIGlmICghdG9wIHx8IHJlY3QudG9wIDwgdG9wKSB7XG4gICAgICAgIHRvcCA9IHJlY3QudG9wXG4gICAgICB9XG4gICAgICBpZiAoIWJvdHRvbSB8fCByZWN0LmJvdHRvbSA+IGJvdHRvbSkge1xuICAgICAgICBib3R0b20gPSByZWN0LmJvdHRvbVxuICAgICAgfVxuICAgICAgaWYgKCFsZWZ0IHx8IHJlY3QubGVmdCA8IGxlZnQpIHtcbiAgICAgICAgbGVmdCA9IHJlY3QubGVmdFxuICAgICAgfVxuICAgICAgaWYgKCFyaWdodCB8fCByZWN0LnJpZ2h0ID4gcmlnaHQpIHtcbiAgICAgICAgcmlnaHQgPSByZWN0LnJpZ2h0XG4gICAgICB9XG4gICAgfVxuICB9KVxuICByZXR1cm4ge1xuICAgIHRvcCxcbiAgICBsZWZ0LFxuICAgIHdpZHRoOiByaWdodCAtIGxlZnQsXG4gICAgaGVpZ2h0OiBib3R0b20gLSB0b3BcbiAgfVxufVxuXG4vKipcbiAqIEdldCB0aGUgYm91bmRpbmcgcmVjdCBmb3IgYSB0ZXh0IG5vZGUgdXNpbmcgYSBSYW5nZS5cbiAqXG4gKiBAcGFyYW0ge1RleHR9IG5vZGVcbiAqIEByZXR1cm4ge1JlY3R9XG4gKi9cblxuY29uc3QgcmFuZ2UgPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpXG5mdW5jdGlvbiBnZXRUZXh0UmVjdCAobm9kZSkge1xuICByYW5nZS5zZWxlY3ROb2RlKG5vZGUpXG4gIHJldHVybiByYW5nZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxufVxuXG4vKipcbiAqIERpc3BsYXkgdGhlIG92ZXJsYXkgd2l0aCBnaXZlbiByZWN0LlxuICpcbiAqIEBwYXJhbSB7UmVjdH1cbiAqL1xuXG5mdW5jdGlvbiBzaG93T3ZlcmxheSAoeyB3aWR0aCA9IDAsIGhlaWdodCA9IDAsIHRvcCA9IDAsIGxlZnQgPSAwIH0pIHtcbiAgb3ZlcmxheS5zdHlsZS53aWR0aCA9IH5+d2lkdGggKyAncHgnXG4gIG92ZXJsYXkuc3R5bGUuaGVpZ2h0ID0gfn5oZWlnaHQgKyAncHgnXG4gIG92ZXJsYXkuc3R5bGUudG9wID0gfn50b3AgKyAncHgnXG4gIG92ZXJsYXkuc3R5bGUubGVmdCA9IH5+bGVmdCArICdweCdcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChvdmVybGF5KVxufVxuXG4vKipcbiAqIEdldCBWdWUncyB1dGlsXG4gKi9cblxuZnVuY3Rpb24gdXRpbCAoKSB7XG4gIHJldHVybiB3aW5kb3cuX19WVUVfREVWVE9PTFNfR0xPQkFMX0hPT0tfXy5WdWUudXRpbFxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC9Vc2Vycy9odWEvRG9jdW1lbnRzL+WFtuS7lumhueebri9kZHYtZGV2dG9vbHMvc3JjL2JhY2tlbmQvaGlnaGxpZ2h0ZXIuanMiLCJpbXBvcnQgeyBzdHJpbmdpZnkgfSBmcm9tICdzcmMvdXRpbCdcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRWdWV4QmFja2VuZCAoaG9vaywgYnJpZGdlKSB7XG4gIGNvbnN0IHN0b3JlID0gaG9vay5zdG9yZVxuICBsZXQgcmVjb3JkaW5nID0gdHJ1ZVxuXG4gIGNvbnN0IGdldFNuYXBzaG90ID0gKCkgPT4gc3RyaW5naWZ5KHtcbiAgICBzdGF0ZTogc3RvcmUuc3RhdGUsXG4gICAgZ2V0dGVyczogc3RvcmUuZ2V0dGVyc1xuICB9KVxuXG4gIGJyaWRnZS5zZW5kKCd2dWV4OmluaXQnLCBnZXRTbmFwc2hvdCgpKVxuXG4gIC8vIGRlYWwgd2l0aCBtdWx0aXBsZSBiYWNrZW5kIGluamVjdGlvbnNcbiAgaG9vay5vZmYoJ3Z1ZXg6bXV0YXRpb24nKVxuXG4gIC8vIGFwcGxpY2F0aW9uIC0+IGRldnRvb2xcbiAgaG9vay5vbigndnVleDptdXRhdGlvbicsIG11dGF0aW9uID0+IHtcbiAgICBpZiAoIXJlY29yZGluZykgcmV0dXJuXG4gICAgYnJpZGdlLnNlbmQoJ3Z1ZXg6bXV0YXRpb24nLCB7XG4gICAgICBtdXRhdGlvbjoge1xuICAgICAgICB0eXBlOiBtdXRhdGlvbi50eXBlLFxuICAgICAgICBwYXlsb2FkOiBzdHJpbmdpZnkobXV0YXRpb24ucGF5bG9hZClcbiAgICAgIH0sXG4gICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgICBzbmFwc2hvdDogZ2V0U25hcHNob3QoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gZGV2dG9vbCAtPiBhcHBsaWNhdGlvblxuICBicmlkZ2Uub24oJ3Z1ZXg6dHJhdmVsLXRvLXN0YXRlJywgc3RhdGUgPT4ge1xuICAgIGhvb2suZW1pdCgndnVleDp0cmF2ZWwtdG8tc3RhdGUnLCBzdGF0ZSlcbiAgfSlcblxuICBicmlkZ2Uub24oJ3Z1ZXg6aW1wb3J0LXN0YXRlJywgc3RhdGUgPT4ge1xuICAgIGhvb2suZW1pdCgndnVleDp0cmF2ZWwtdG8tc3RhdGUnLCBzdGF0ZSlcbiAgICBicmlkZ2Uuc2VuZCgndnVleDppbml0JywgZ2V0U25hcHNob3QoKSlcbiAgfSlcblxuICBicmlkZ2Uub24oJ3Z1ZXg6dG9nZ2xlLXJlY29yZGluZycsIGVuYWJsZWQgPT4ge1xuICAgIHJlY29yZGluZyA9IGVuYWJsZWRcbiAgfSlcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAvVXNlcnMvaHVhL0RvY3VtZW50cy/lhbbku5bpobnnm64vZGR2LWRldnRvb2xzL3NyYy9iYWNrZW5kL3Z1ZXguanMiLCJpbXBvcnQgQ2lyY3VsYXJKU09OIGZyb20gJ2NpcmN1bGFyLWpzb24tZXM2J1xuXG5mdW5jdGlvbiBjYWNoZWQgKGZuKSB7XG4gIGNvbnN0IGNhY2hlID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuICByZXR1cm4gZnVuY3Rpb24gY2FjaGVkRm4gKHN0cikge1xuICAgIGNvbnN0IGhpdCA9IGNhY2hlW3N0cl1cbiAgICByZXR1cm4gaGl0IHx8IChjYWNoZVtzdHJdID0gZm4oc3RyKSlcbiAgfVxufVxuXG52YXIgY2xhc3NpZnlSRSA9IC8oPzpefFstXy9dKShcXHcpL2dcbmV4cG9ydCBjb25zdCBjbGFzc2lmeSA9IGNhY2hlZCgoc3RyKSA9PiB7XG4gIHJldHVybiBzdHIucmVwbGFjZShjbGFzc2lmeVJFLCB0b1VwcGVyKVxufSlcblxuY29uc3QgY2FtZWxpemVSRSA9IC8tKFxcdykvZ1xuZXhwb3J0IGNvbnN0IGNhbWVsaXplID0gY2FjaGVkKChzdHIpID0+IHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKGNhbWVsaXplUkUsIHRvVXBwZXIpXG59KVxuXG5mdW5jdGlvbiB0b1VwcGVyIChfLCBjKSB7XG4gIHJldHVybiBjID8gYy50b1VwcGVyQ2FzZSgpIDogJydcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluRG9jIChub2RlKSB7XG4gIGlmICghbm9kZSkgcmV0dXJuIGZhbHNlXG4gIHZhciBkb2MgPSBub2RlLm93bmVyRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XG4gIHZhciBwYXJlbnQgPSBub2RlLnBhcmVudE5vZGVcbiAgcmV0dXJuIGRvYyA9PT0gbm9kZSB8fFxuICAgIGRvYyA9PT0gcGFyZW50IHx8XG4gICAgISEocGFyZW50ICYmIHBhcmVudC5ub2RlVHlwZSA9PT0gMSAmJiAoZG9jLmNvbnRhaW5zKHBhcmVudCkpKVxufVxuXG4vKipcbiAqIFN0cmluZ2lmeS9wYXJzZSBkYXRhIHVzaW5nIENpcmN1bGFySlNPTi5cbiAqL1xuXG5leHBvcnQgY29uc3QgVU5ERUZJTkVEID0gJ19fdnVlX2RldnRvb2xfdW5kZWZpbmVkX18nXG5leHBvcnQgY29uc3QgSU5GSU5JVFkgPSAnX192dWVfZGV2dG9vbF9pbmZpbml0eV9fJ1xuXG5leHBvcnQgZnVuY3Rpb24gc3RyaW5naWZ5IChkYXRhKSB7XG4gIHJldHVybiBDaXJjdWxhckpTT04uc3RyaW5naWZ5KGRhdGEsIHJlcGxhY2VyKVxufVxuXG5mdW5jdGlvbiByZXBsYWNlciAoa2V5LCB2YWwpIHtcbiAgaWYgKHZhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIFVOREVGSU5FRFxuICB9IGVsc2UgaWYgKHZhbCA9PT0gSW5maW5pdHkpIHtcbiAgICByZXR1cm4gSU5GSU5JVFlcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gc2FuaXRpemUodmFsKVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZSAoZGF0YSwgcmV2aXZlKSB7XG4gIHJldHVybiByZXZpdmVcbiAgICA/IENpcmN1bGFySlNPTi5wYXJzZShkYXRhLCByZXZpdmVyKVxuICAgIDogQ2lyY3VsYXJKU09OLnBhcnNlKGRhdGEpXG59XG5cbmZ1bmN0aW9uIHJldml2ZXIgKGtleSwgdmFsKSB7XG4gIGlmICh2YWwgPT09IFVOREVGSU5FRCkge1xuICAgIHJldHVybiB1bmRlZmluZWRcbiAgfSBlbHNlIGlmICh2YWwgPT09IElORklOSVRZKSB7XG4gICAgcmV0dXJuIEluZmluaXR5XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHZhbFxuICB9XG59XG5cbi8qKlxuICogU2FuaXRpemUgZGF0YSB0byBiZSBwb3N0ZWQgdG8gdGhlIG90aGVyIHNpZGUuXG4gKiBTaW5jZSB0aGUgbWVzc2FnZSBwb3N0ZWQgaXMgc2VudCB3aXRoIHN0cnVjdHVyZWQgY2xvbmUsXG4gKiB3ZSBuZWVkIHRvIGZpbHRlciBvdXQgYW55IHR5cGVzIHRoYXQgbWlnaHQgY2F1c2UgYW4gZXJyb3IuXG4gKlxuICogQHBhcmFtIHsqfSBkYXRhXG4gKiBAcmV0dXJuIHsqfVxuICovXG5cbmZ1bmN0aW9uIHNhbml0aXplIChkYXRhKSB7XG4gIGlmIChcbiAgICAhaXNQcmltaXRpdmUoZGF0YSkgJiZcbiAgICAhQXJyYXkuaXNBcnJheShkYXRhKSAmJlxuICAgICFpc1BsYWluT2JqZWN0KGRhdGEpXG4gICkge1xuICAgIC8vIGhhbmRsZSB0eXBlcyB0aGF0IHdpbGwgcHJvYmFibHkgY2F1c2UgaXNzdWVzIGluXG4gICAgLy8gdGhlIHN0cnVjdHVyZWQgY2xvbmVcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGRhdGEpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGRhdGFcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQbGFpbk9iamVjdCAob2JqKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSdcbn1cblxuZnVuY3Rpb24gaXNQcmltaXRpdmUgKGRhdGEpIHtcbiAgaWYgKGRhdGEgPT0gbnVsbCkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgY29uc3QgdHlwZSA9IHR5cGVvZiBkYXRhXG4gIHJldHVybiAoXG4gICAgdHlwZSA9PT0gJ3N0cmluZycgfHxcbiAgICB0eXBlID09PSAnbnVtYmVyJyB8fFxuICAgIHR5cGUgPT09ICdib29sZWFuJyB8fFxuICAgIGRhdGEgaW5zdGFuY2VvZiBSZWdFeHBcbiAgKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2VhcmNoRGVlcEluT2JqZWN0IChvYmosIHNlYXJjaFRlcm0pIHtcbiAgdmFyIG1hdGNoID0gZmFsc2VcbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG9iailcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3Qga2V5ID0ga2V5c1tpXVxuICAgIGNvbnN0IHZhbHVlID0gb2JqW2tleV1cbiAgICBpZiAoY29tcGFyZShrZXksIHNlYXJjaFRlcm0pIHx8IGNvbXBhcmUodmFsdWUsIHNlYXJjaFRlcm0pKSB7XG4gICAgICBtYXRjaCA9IHRydWVcbiAgICAgIGJyZWFrXG4gICAgfVxuICAgIGlmIChpc1BsYWluT2JqZWN0KHZhbHVlKSkge1xuICAgICAgbWF0Y2ggPSBzZWFyY2hEZWVwSW5PYmplY3QodmFsdWUsIHNlYXJjaFRlcm0pXG4gICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIG1hdGNoXG59XG5cbmZ1bmN0aW9uIGNvbXBhcmUgKG1peGVkVmFsdWUsIHN0cmluZ1ZhbHVlKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KG1peGVkVmFsdWUpICYmIHNlYXJjaEluQXJyYXkobWl4ZWRWYWx1ZSwgc3RyaW5nVmFsdWUudG9Mb3dlckNhc2UoKSkpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG4gIGlmICgoJycgKyBtaXhlZFZhbHVlKS50b0xvd2VyQ2FzZSgpLmluZGV4T2Yoc3RyaW5nVmFsdWUudG9Mb3dlckNhc2UoKSkgIT09IC0xKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuZnVuY3Rpb24gc2VhcmNoSW5BcnJheSAoYXJyLCBzZWFyY2hUZXJtKSB7XG4gIGxldCBmb3VuZCA9IGZhbHNlXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCgnJyArIGFycltpXSkudG9Mb3dlckNhc2UoKS5pbmRleE9mKHNlYXJjaFRlcm0pICE9PSAtMSkge1xuICAgICAgZm91bmQgPSB0cnVlXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuICByZXR1cm4gZm91bmRcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAvVXNlcnMvaHVhL0RvY3VtZW50cy/lhbbku5bpobnnm64vZGR2LWRldnRvb2xzL3NyYy91dGlsLmpzIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIHJlc29sdmVzIC4gYW5kIC4uIGVsZW1lbnRzIGluIGEgcGF0aCBhcnJheSB3aXRoIGRpcmVjdG9yeSBuYW1lcyB0aGVyZVxuLy8gbXVzdCBiZSBubyBzbGFzaGVzLCBlbXB0eSBlbGVtZW50cywgb3IgZGV2aWNlIG5hbWVzIChjOlxcKSBpbiB0aGUgYXJyYXlcbi8vIChzbyBhbHNvIG5vIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHNsYXNoZXMgLSBpdCBkb2VzIG5vdCBkaXN0aW5ndWlzaFxuLy8gcmVsYXRpdmUgYW5kIGFic29sdXRlIHBhdGhzKVxuZnVuY3Rpb24gbm9ybWFsaXplQXJyYXkocGFydHMsIGFsbG93QWJvdmVSb290KSB7XG4gIC8vIGlmIHRoZSBwYXRoIHRyaWVzIHRvIGdvIGFib3ZlIHRoZSByb290LCBgdXBgIGVuZHMgdXAgPiAwXG4gIHZhciB1cCA9IDA7XG4gIGZvciAodmFyIGkgPSBwYXJ0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIHZhciBsYXN0ID0gcGFydHNbaV07XG4gICAgaWYgKGxhc3QgPT09ICcuJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgIH0gZWxzZSBpZiAobGFzdCA9PT0gJy4uJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgdXArKztcbiAgICB9IGVsc2UgaWYgKHVwKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICB1cC0tO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIHRoZSBwYXRoIGlzIGFsbG93ZWQgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIHJlc3RvcmUgbGVhZGluZyAuLnNcbiAgaWYgKGFsbG93QWJvdmVSb290KSB7XG4gICAgZm9yICg7IHVwLS07IHVwKSB7XG4gICAgICBwYXJ0cy51bnNoaWZ0KCcuLicpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwYXJ0cztcbn1cblxuLy8gU3BsaXQgYSBmaWxlbmFtZSBpbnRvIFtyb290LCBkaXIsIGJhc2VuYW1lLCBleHRdLCB1bml4IHZlcnNpb25cbi8vICdyb290JyBpcyBqdXN0IGEgc2xhc2gsIG9yIG5vdGhpbmcuXG52YXIgc3BsaXRQYXRoUmUgPVxuICAgIC9eKFxcLz98KShbXFxzXFxTXSo/KSgoPzpcXC57MSwyfXxbXlxcL10rP3wpKFxcLlteLlxcL10qfCkpKD86W1xcL10qKSQvO1xudmFyIHNwbGl0UGF0aCA9IGZ1bmN0aW9uKGZpbGVuYW1lKSB7XG4gIHJldHVybiBzcGxpdFBhdGhSZS5leGVjKGZpbGVuYW1lKS5zbGljZSgxKTtcbn07XG5cbi8vIHBhdGgucmVzb2x2ZShbZnJvbSAuLi5dLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMucmVzb2x2ZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVzb2x2ZWRQYXRoID0gJycsXG4gICAgICByZXNvbHZlZEFic29sdXRlID0gZmFsc2U7XG5cbiAgZm9yICh2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpID49IC0xICYmICFyZXNvbHZlZEFic29sdXRlOyBpLS0pIHtcbiAgICB2YXIgcGF0aCA9IChpID49IDApID8gYXJndW1lbnRzW2ldIDogcHJvY2Vzcy5jd2QoKTtcblxuICAgIC8vIFNraXAgZW1wdHkgYW5kIGludmFsaWQgZW50cmllc1xuICAgIGlmICh0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyB0byBwYXRoLnJlc29sdmUgbXVzdCBiZSBzdHJpbmdzJyk7XG4gICAgfSBlbHNlIGlmICghcGF0aCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgcmVzb2x2ZWRQYXRoID0gcGF0aCArICcvJyArIHJlc29sdmVkUGF0aDtcbiAgICByZXNvbHZlZEFic29sdXRlID0gcGF0aC5jaGFyQXQoMCkgPT09ICcvJztcbiAgfVxuXG4gIC8vIEF0IHRoaXMgcG9pbnQgdGhlIHBhdGggc2hvdWxkIGJlIHJlc29sdmVkIHRvIGEgZnVsbCBhYnNvbHV0ZSBwYXRoLCBidXRcbiAgLy8gaGFuZGxlIHJlbGF0aXZlIHBhdGhzIHRvIGJlIHNhZmUgKG1pZ2h0IGhhcHBlbiB3aGVuIHByb2Nlc3MuY3dkKCkgZmFpbHMpXG5cbiAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gIHJlc29sdmVkUGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihyZXNvbHZlZFBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhIXA7XG4gIH0pLCAhcmVzb2x2ZWRBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gIHJldHVybiAoKHJlc29sdmVkQWJzb2x1dGUgPyAnLycgOiAnJykgKyByZXNvbHZlZFBhdGgpIHx8ICcuJztcbn07XG5cbi8vIHBhdGgubm9ybWFsaXplKHBhdGgpXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIGlzQWJzb2x1dGUgPSBleHBvcnRzLmlzQWJzb2x1dGUocGF0aCksXG4gICAgICB0cmFpbGluZ1NsYXNoID0gc3Vic3RyKHBhdGgsIC0xKSA9PT0gJy8nO1xuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICBwYXRoID0gbm9ybWFsaXplQXJyYXkoZmlsdGVyKHBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhIXA7XG4gIH0pLCAhaXNBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gIGlmICghcGF0aCAmJiAhaXNBYnNvbHV0ZSkge1xuICAgIHBhdGggPSAnLic7XG4gIH1cbiAgaWYgKHBhdGggJiYgdHJhaWxpbmdTbGFzaCkge1xuICAgIHBhdGggKz0gJy8nO1xuICB9XG5cbiAgcmV0dXJuIChpc0Fic29sdXRlID8gJy8nIDogJycpICsgcGF0aDtcbn07XG5cbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMuaXNBYnNvbHV0ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgcmV0dXJuIHBhdGguY2hhckF0KDApID09PSAnLyc7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLmpvaW4gPSBmdW5jdGlvbigpIHtcbiAgdmFyIHBhdGhzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgcmV0dXJuIGV4cG9ydHMubm9ybWFsaXplKGZpbHRlcihwYXRocywgZnVuY3Rpb24ocCwgaW5kZXgpIHtcbiAgICBpZiAodHlwZW9mIHAgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5qb2luIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH1cbiAgICByZXR1cm4gcDtcbiAgfSkuam9pbignLycpKTtcbn07XG5cblxuLy8gcGF0aC5yZWxhdGl2ZShmcm9tLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMucmVsYXRpdmUgPSBmdW5jdGlvbihmcm9tLCB0bykge1xuICBmcm9tID0gZXhwb3J0cy5yZXNvbHZlKGZyb20pLnN1YnN0cigxKTtcbiAgdG8gPSBleHBvcnRzLnJlc29sdmUodG8pLnN1YnN0cigxKTtcblxuICBmdW5jdGlvbiB0cmltKGFycikge1xuICAgIHZhciBzdGFydCA9IDA7XG4gICAgZm9yICg7IHN0YXJ0IDwgYXJyLmxlbmd0aDsgc3RhcnQrKykge1xuICAgICAgaWYgKGFycltzdGFydF0gIT09ICcnKSBicmVhaztcbiAgICB9XG5cbiAgICB2YXIgZW5kID0gYXJyLmxlbmd0aCAtIDE7XG4gICAgZm9yICg7IGVuZCA+PSAwOyBlbmQtLSkge1xuICAgICAgaWYgKGFycltlbmRdICE9PSAnJykgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHN0YXJ0ID4gZW5kKSByZXR1cm4gW107XG4gICAgcmV0dXJuIGFyci5zbGljZShzdGFydCwgZW5kIC0gc3RhcnQgKyAxKTtcbiAgfVxuXG4gIHZhciBmcm9tUGFydHMgPSB0cmltKGZyb20uc3BsaXQoJy8nKSk7XG4gIHZhciB0b1BhcnRzID0gdHJpbSh0by5zcGxpdCgnLycpKTtcblxuICB2YXIgbGVuZ3RoID0gTWF0aC5taW4oZnJvbVBhcnRzLmxlbmd0aCwgdG9QYXJ0cy5sZW5ndGgpO1xuICB2YXIgc2FtZVBhcnRzTGVuZ3RoID0gbGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGZyb21QYXJ0c1tpXSAhPT0gdG9QYXJ0c1tpXSkge1xuICAgICAgc2FtZVBhcnRzTGVuZ3RoID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHZhciBvdXRwdXRQYXJ0cyA9IFtdO1xuICBmb3IgKHZhciBpID0gc2FtZVBhcnRzTGVuZ3RoOyBpIDwgZnJvbVBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgb3V0cHV0UGFydHMucHVzaCgnLi4nKTtcbiAgfVxuXG4gIG91dHB1dFBhcnRzID0gb3V0cHV0UGFydHMuY29uY2F0KHRvUGFydHMuc2xpY2Uoc2FtZVBhcnRzTGVuZ3RoKSk7XG5cbiAgcmV0dXJuIG91dHB1dFBhcnRzLmpvaW4oJy8nKTtcbn07XG5cbmV4cG9ydHMuc2VwID0gJy8nO1xuZXhwb3J0cy5kZWxpbWl0ZXIgPSAnOic7XG5cbmV4cG9ydHMuZGlybmFtZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIHJlc3VsdCA9IHNwbGl0UGF0aChwYXRoKSxcbiAgICAgIHJvb3QgPSByZXN1bHRbMF0sXG4gICAgICBkaXIgPSByZXN1bHRbMV07XG5cbiAgaWYgKCFyb290ICYmICFkaXIpIHtcbiAgICAvLyBObyBkaXJuYW1lIHdoYXRzb2V2ZXJcbiAgICByZXR1cm4gJy4nO1xuICB9XG5cbiAgaWYgKGRpcikge1xuICAgIC8vIEl0IGhhcyBhIGRpcm5hbWUsIHN0cmlwIHRyYWlsaW5nIHNsYXNoXG4gICAgZGlyID0gZGlyLnN1YnN0cigwLCBkaXIubGVuZ3RoIC0gMSk7XG4gIH1cblxuICByZXR1cm4gcm9vdCArIGRpcjtcbn07XG5cblxuZXhwb3J0cy5iYXNlbmFtZSA9IGZ1bmN0aW9uKHBhdGgsIGV4dCkge1xuICB2YXIgZiA9IHNwbGl0UGF0aChwYXRoKVsyXTtcbiAgLy8gVE9ETzogbWFrZSB0aGlzIGNvbXBhcmlzb24gY2FzZS1pbnNlbnNpdGl2ZSBvbiB3aW5kb3dzP1xuICBpZiAoZXh0ICYmIGYuc3Vic3RyKC0xICogZXh0Lmxlbmd0aCkgPT09IGV4dCkge1xuICAgIGYgPSBmLnN1YnN0cigwLCBmLmxlbmd0aCAtIGV4dC5sZW5ndGgpO1xuICB9XG4gIHJldHVybiBmO1xufTtcblxuXG5leHBvcnRzLmV4dG5hbWUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHJldHVybiBzcGxpdFBhdGgocGF0aClbM107XG59O1xuXG5mdW5jdGlvbiBmaWx0ZXIgKHhzLCBmKSB7XG4gICAgaWYgKHhzLmZpbHRlcikgcmV0dXJuIHhzLmZpbHRlcihmKTtcbiAgICB2YXIgcmVzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoZih4c1tpXSwgaSwgeHMpKSByZXMucHVzaCh4c1tpXSk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5cbi8vIFN0cmluZy5wcm90b3R5cGUuc3Vic3RyIC0gbmVnYXRpdmUgaW5kZXggZG9uJ3Qgd29yayBpbiBJRThcbnZhciBzdWJzdHIgPSAnYWInLnN1YnN0cigtMSkgPT09ICdiJ1xuICAgID8gZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikgeyByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKSB9XG4gICAgOiBmdW5jdGlvbiAoc3RyLCBzdGFydCwgbGVuKSB7XG4gICAgICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gc3RyLmxlbmd0aCArIHN0YXJ0O1xuICAgICAgICByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKTtcbiAgICB9XG47XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAvVXNlcnMvaHVhL0RvY3VtZW50cy/lhbbku5bpobnnm64vZGR2LWRldnRvb2xzL34vcGF0aC1icm93c2VyaWZ5L2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA2MFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gL1VzZXJzL2h1YS9Eb2N1bWVudHMv5YW25LuW6aG555uuL2Rkdi1kZXZ0b29scy9+L3Byb2Nlc3MvYnJvd3Nlci5qc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsImltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnJpZGdlIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IgKHdhbGwpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5zZXRNYXhMaXN0ZW5lcnMoSW5maW5pdHkpXG4gICAgdGhpcy53YWxsID0gd2FsbFxuICAgIHdhbGwubGlzdGVuKG1lc3NhZ2UgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBtZXNzYWdlID09PSAnc3RyaW5nJykge1xuICAgICAgICB0aGlzLmVtaXQobWVzc2FnZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZW1pdChtZXNzYWdlLmV2ZW50LCBtZXNzYWdlLnBheWxvYWQpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGFuIGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAgICogQHBhcmFtIHsqfSBwYXlsb2FkXG4gICAqL1xuXG4gIHNlbmQgKGV2ZW50LCBwYXlsb2FkKSB7XG4gICAgdGhpcy53YWxsLnNlbmQoe1xuICAgICAgZXZlbnQsXG4gICAgICBwYXlsb2FkXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2cgYSBtZXNzYWdlIHRvIHRoZSBkZXZ0b29scyBiYWNrZ3JvdW5kIHBhZ2UuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlXG4gICAqL1xuXG4gIGxvZyAobWVzc2FnZSkge1xuICAgIHRoaXMuc2VuZCgnbG9nJywgbWVzc2FnZSlcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC9Vc2Vycy9odWEvRG9jdW1lbnRzL+WFtuS7lumhueebri9kZHYtZGV2dG9vbHMvc3JjL2JyaWRnZS5qcyIsImZ1bmN0aW9uIGVuY29kZSAoZGF0YSwgcmVwbGFjZXIsIGxpc3QsIHNlZW4pIHtcbiAgdmFyIHN0b3JlZCwga2V5LCB2YWx1ZSwgaSwgbFxuICB2YXIgc2VlbkluZGV4ID0gc2Vlbi5nZXQoZGF0YSlcbiAgaWYgKHNlZW5JbmRleCAhPSBudWxsKSB7XG4gICAgcmV0dXJuIHNlZW5JbmRleFxuICB9XG4gIHZhciBpbmRleCA9IGxpc3QubGVuZ3RoXG4gIGlmIChpc1BsYWluT2JqZWN0KGRhdGEpKSB7XG4gICAgc3RvcmVkID0ge31cbiAgICBzZWVuLnNldChkYXRhLCBpbmRleClcbiAgICBsaXN0LnB1c2goc3RvcmVkKVxuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoZGF0YSlcbiAgICBmb3IgKGkgPSAwLCBsID0ga2V5cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGtleSA9IGtleXNbaV1cbiAgICAgIHZhbHVlID0gZGF0YVtrZXldXG4gICAgICBpZiAocmVwbGFjZXIpIHtcbiAgICAgICAgdmFsdWUgPSByZXBsYWNlci5jYWxsKGRhdGEsIGtleSwgdmFsdWUpXG4gICAgICB9XG4gICAgICBzdG9yZWRba2V5XSA9IGVuY29kZSh2YWx1ZSwgcmVwbGFjZXIsIGxpc3QsIHNlZW4pXG4gICAgfVxuICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHtcbiAgICBzdG9yZWQgPSBbXVxuICAgIHNlZW4uc2V0KGRhdGEsIGluZGV4KVxuICAgIGxpc3QucHVzaChzdG9yZWQpXG4gICAgZm9yIChpID0gMCwgbCA9IGRhdGEubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB2YWx1ZSA9IGRhdGFbaV1cbiAgICAgIGlmIChyZXBsYWNlcikge1xuICAgICAgIHZhbHVlID0gcmVwbGFjZXIuY2FsbChkYXRhLCBpLCB2YWx1ZSlcbiAgICAgIH1cbiAgICAgIHN0b3JlZFtpXSA9IGVuY29kZSh2YWx1ZSwgcmVwbGFjZXIsIGxpc3QsIHNlZW4pXG4gICAgfVxuICAgIHNlZW4uc2V0KGRhdGEsIGxpc3QubGVuZ3RoKVxuICB9IGVsc2Uge1xuICAgIGluZGV4ID0gbGlzdC5sZW5ndGhcbiAgICBsaXN0LnB1c2goZGF0YSlcbiAgfVxuICByZXR1cm4gaW5kZXhcbn1cblxuZnVuY3Rpb24gZGVjb2RlIChsaXN0LCByZXZpdmVyKSB7XG4gIHZhciBpID0gbGlzdC5sZW5ndGhcbiAgdmFyIGosIGssIGRhdGEsIGtleSwgdmFsdWVcbiAgd2hpbGUgKGktLSkge1xuICAgIHZhciBkYXRhID0gbGlzdFtpXVxuICAgIGlmIChpc1BsYWluT2JqZWN0KGRhdGEpKSB7XG4gICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGRhdGEpXG4gICAgICBmb3IgKGogPSAwLCBrID0ga2V5cy5sZW5ndGg7IGogPCBrOyBqKyspIHtcbiAgICAgICAga2V5ID0ga2V5c1tqXVxuICAgICAgICB2YWx1ZSA9IGxpc3RbZGF0YVtrZXldXVxuICAgICAgICBpZiAocmV2aXZlcikgdmFsdWUgPSByZXZpdmVyLmNhbGwoZGF0YSwga2V5LCB2YWx1ZSlcbiAgICAgICAgZGF0YVtrZXldID0gdmFsdWVcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIGZvciAoaiA9IDAsIGsgPSBkYXRhLmxlbmd0aDsgaiA8IGs7IGorKykge1xuICAgICAgICB2YWx1ZSA9IGxpc3RbZGF0YVtqXV1cbiAgICAgICAgaWYgKHJldml2ZXIpIHZhbHVlID0gcmV2aXZlci5jYWxsKGRhdGEsIGosIHZhbHVlKVxuICAgICAgICBkYXRhW2pdID0gdmFsdWVcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNQbGFpbk9iamVjdCAob2JqKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSdcbn1cblxuZXhwb3J0cy5zdHJpbmdpZnkgPSBmdW5jdGlvbiBzdHJpbmdpZnkgKGRhdGEsIHJlcGxhY2VyLCBzcGFjZSkge1xuICB0cnkge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID09PSAxXG4gICAgICA/IEpTT04uc3RyaW5naWZ5KGRhdGEpXG4gICAgICA6IEpTT04uc3RyaW5naWZ5KGRhdGEsIHJlcGxhY2VyLCBzcGFjZSlcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBleHBvcnRzLnN0cmluZ2lmeVN0cmljdChkYXRhLCByZXBsYWNlciwgc3BhY2UpXG4gIH1cbn1cblxuZXhwb3J0cy5wYXJzZSA9IGZ1bmN0aW9uIHBhcnNlIChkYXRhLCByZXZpdmVyKSB7XG4gIHZhciBoYXNDaXJjdWxhciA9IC9eXFxzLy50ZXN0KGRhdGEpXG4gIGlmICghaGFzQ2lyY3VsYXIpIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA9PT0gMVxuICAgICAgPyBKU09OLnBhcnNlKGRhdGEpXG4gICAgICA6IEpTT04ucGFyc2UoZGF0YSwgcmV2aXZlcilcbiAgfSBlbHNlIHtcbiAgICB2YXIgbGlzdCA9IEpTT04ucGFyc2UoZGF0YSlcbiAgICBkZWNvZGUobGlzdCwgcmV2aXZlcilcbiAgICByZXR1cm4gbGlzdFswXVxuICB9XG59XG5cbmV4cG9ydHMuc3RyaW5naWZ5U3RyaWN0ID0gZnVuY3Rpb24gKGRhdGEsIHJlcGxhY2VyLCBzcGFjZSkge1xuICB2YXIgbGlzdCA9IFtdXG4gIGVuY29kZShkYXRhLCByZXBsYWNlciwgbGlzdCwgbmV3IE1hcCgpKVxuICByZXR1cm4gc3BhY2VcbiAgICA/ICcgJyArIEpTT04uc3RyaW5naWZ5KGxpc3QsIG51bGwsIHNwYWNlKVxuICAgIDogJyAnICsgSlNPTi5zdHJpbmdpZnkobGlzdClcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC9Vc2Vycy9odWEvRG9jdW1lbnRzL+WFtuS7lumhueebri9kZHYtZGV2dG9vbHMvfi9jaXJjdWxhci1qc29uLWVzNi9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSJdLCJzb3VyY2VSb290IjoiIn0=