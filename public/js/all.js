/**
 * Vue.js v0.11.10
 * (c) 2015 Evan You
 * Released under the MIT License.
 */

(function webpackUniversalModuleDefinition(root, factory) {
    if(typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if(typeof define === 'function' && define.amd)
        define(factory);
    else if(typeof exports === 'object')
        exports["Vue"] = factory();
    else
        root["Vue"] = factory();
})(this, function() {
    return /******/ (function(modules) { // webpackBootstrap
        /******/ 	// The module cache
        /******/ 	var installedModules = {};

        /******/ 	// The require function
        /******/ 	function __webpack_require__(moduleId) {

            /******/ 		// Check if module is in cache
            /******/ 		if(installedModules[moduleId])
            /******/ 			return installedModules[moduleId].exports;

            /******/ 		// Create a new module (and put it into the cache)
            /******/ 		var module = installedModules[moduleId] = {
                /******/ 			exports: {},
                /******/ 			id: moduleId,
                /******/ 			loaded: false
                /******/ 		};

            /******/ 		// Execute the module function
            /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

            /******/ 		// Flag the module as loaded
            /******/ 		module.loaded = true;

            /******/ 		// Return the exports of the module
            /******/ 		return module.exports;
            /******/ 	}


        /******/ 	// expose the modules object (__webpack_modules__)
        /******/ 	__webpack_require__.m = modules;

        /******/ 	// expose the module cache
        /******/ 	__webpack_require__.c = installedModules;

        /******/ 	// __webpack_public_path__
        /******/ 	__webpack_require__.p = "";

        /******/ 	// Load entry module and return exports
        /******/ 	return __webpack_require__(0);
        /******/ })
        /************************************************************************/
        /******/ ([
        /* 0 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)
            var extend = _.extend

            /**
             * The exposed Vue constructor.
             *
             * API conventions:
             * - public API methods/properties are prefiexed with `$`
             * - internal methods/properties are prefixed with `_`
             * - non-prefixed properties are assumed to be proxied user
             *   data.
             *
             * @constructor
             * @param {Object} [options]
             * @public
             */

            function Vue (options) {
                this._init(options)
            }

            /**
             * Mixin global API
             */

            extend(Vue, __webpack_require__(1))

            /**
             * Vue and every constructor that extends Vue has an
             * associated options object, which can be accessed during
             * compilation steps as `this.constructor.options`.
             *
             * These can be seen as the default options of every
             * Vue instance.
             */

            Vue.options = {
                directives  : __webpack_require__(12),
                filters     : __webpack_require__(13),
                partials    : {},
                transitions : {},
                components  : {}
            }

            /**
             * Build up the prototype
             */

            var p = Vue.prototype

            /**
             * $data has a setter which does a bunch of
             * teardown/setup work
             */

            Object.defineProperty(p, '$data', {
                get: function () {
                    return this._data
                },
                set: function (newData) {
                    this._setData(newData)
                }
            })

            /**
             * Mixin internal instance methods
             */

            extend(p, __webpack_require__(2))
            extend(p, __webpack_require__(3))
            extend(p, __webpack_require__(4))
            extend(p, __webpack_require__(5))

            /**
             * Mixin public API methods
             */

            extend(p, __webpack_require__(6))
            extend(p, __webpack_require__(7))
            extend(p, __webpack_require__(8))
            extend(p, __webpack_require__(9))
            extend(p, __webpack_require__(10))

            module.exports = _.Vue = Vue

            /***/ },
        /* 1 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)
            var mergeOptions = __webpack_require__(14)

            /**
             * Expose useful internals
             */

            exports.util = _
            exports.nextTick = _.nextTick
            exports.config = __webpack_require__(15)

            exports.compiler = {
                compile: __webpack_require__(16),
                transclude: __webpack_require__(17)
            }

            exports.parsers = {
                path: __webpack_require__(18),
                text: __webpack_require__(19),
                template: __webpack_require__(20),
                directive: __webpack_require__(21),
                expression: __webpack_require__(22)
            }

            /**
             * Each instance constructor, including Vue, has a unique
             * cid. This enables us to create wrapped "child
             * constructors" for prototypal inheritance and cache them.
             */

            exports.cid = 0
            var cid = 1

            /**
             * Class inehritance
             *
             * @param {Object} extendOptions
             */

            exports.extend = function (extendOptions) {
                extendOptions = extendOptions || {}
                var Super = this
                var Sub = createClass(
                    extendOptions.name ||
                    Super.options.name ||
                    'VueComponent'
                )
                Sub.prototype = Object.create(Super.prototype)
                Sub.prototype.constructor = Sub
                Sub.cid = cid++
                Sub.options = mergeOptions(
                    Super.options,
                    extendOptions
                )
                Sub['super'] = Super
                // allow further extension
                Sub.extend = Super.extend
                // create asset registers, so extended classes
                // can have their private assets too.
                createAssetRegisters(Sub)
                return Sub
            }

            /**
             * A function that returns a sub-class constructor with the
             * given name. This gives us much nicer output when
             * logging instances in the console.
             *
             * @param {String} name
             * @return {Function}
             */

            function createClass (name) {
                return new Function(
                    'return function ' + _.classify(name) +
                    ' (options) { this._init(options) }'
                )()
            }

            /**
             * Plugin system
             *
             * @param {Object} plugin
             */

            exports.use = function (plugin) {
                // additional parameters
                var args = _.toArray(arguments, 1)
                args.unshift(this)
                if (typeof plugin.install === 'function') {
                    plugin.install.apply(plugin, args)
                } else {
                    plugin.apply(null, args)
                }
                return this
            }

            /**
             * Define asset registration methods on a constructor.
             *
             * @param {Function} Constructor
             */

            var assetTypes = [
                'directive',
                'filter',
                'partial',
                'transition'
            ]

            function createAssetRegisters (Constructor) {

                /* Asset registration methods share the same signature:
                 *
                 * @param {String} id
                 * @param {*} definition
                 */

                assetTypes.forEach(function (type) {
                    Constructor[type] = function (id, definition) {
                        if (!definition) {
                            return this.options[type + 's'][id]
                        } else {
                            this.options[type + 's'][id] = definition
                        }
                    }
                })

                /**
                 * Component registration needs to automatically invoke
                 * Vue.extend on object values.
                 *
                 * @param {String} id
                 * @param {Object|Function} definition
                 */

                Constructor.component = function (id, definition) {
                    if (!definition) {
                        return this.options.components[id]
                    } else {
                        if (_.isPlainObject(definition)) {
                            definition.name = id
                            definition = _.Vue.extend(definition)
                        }
                        this.options.components[id] = definition
                    }
                }
            }

            createAssetRegisters(exports)

            /***/ },
        /* 2 */
        /***/ function(module, exports, __webpack_require__) {

            var mergeOptions = __webpack_require__(14)

            /**
             * The main init sequence. This is called for every
             * instance, including ones that are created from extended
             * constructors.
             *
             * @param {Object} options - this options object should be
             *                           the result of merging class
             *                           options and the options passed
             *                           in to the constructor.
             */

            exports._init = function (options) {

                options = options || {}

                this.$el           = null
                this.$parent       = options._parent
                this.$root         = options._root || this
                this.$             = {} // child vm references
                this.$$            = {} // element references
                this._watcherList  = [] // all watchers as an array
                this._watchers     = {} // internal watchers as a hash
                this._userWatchers = {} // user watchers as a hash
                this._directives   = [] // all directives

                // a flag to avoid this being observed
                this._isVue = true

                // events bookkeeping
                this._events         = {}    // registered callbacks
                this._eventsCount    = {}    // for $broadcast optimization
                this._eventCancelled = false // for event cancellation

                // block instance properties
                this._isBlock     = false
                this._blockStart  =          // @type {CommentNode}
                    this._blockEnd    = null     // @type {CommentNode}

                // lifecycle state
                this._isCompiled  =
                    this._isDestroyed =
                        this._isReady     =
                            this._isAttached  =
                                this._isBeingDestroyed = false

                // children
                this._children = []
                this._childCtors = {}

                // transclusion unlink functions
                this._containerUnlinkFn =
                    this._contentUnlinkFn = null

                // transcluded components that belong to the parent.
                // need to keep track of them so that we can call
                // attached/detached hooks on them.
                this._transCpnts = []
                this._host = options._host

                // push self into parent / transclusion host
                if (this.$parent) {
                    this.$parent._children.push(this)
                }
                if (this._host) {
                    this._host._transCpnts.push(this)
                }

                // props used in v-repeat diffing
                this._new = true
                this._reused = false

                // merge options.
                options = this.$options = mergeOptions(
                    this.constructor.options,
                    options,
                    this
                )

                // set data after merge.
                this._data = options.data || {}

                // initialize data observation and scope inheritance.
                this._initScope()

                // setup event system and option events.
                this._initEvents()

                // call created hook
                this._callHook('created')

                // if `el` option is passed, start compilation.
                if (options.el) {
                    this.$mount(options.el)
                }
            }

            /***/ },
        /* 3 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)
            var inDoc = _.inDoc

            /**
             * Setup the instance's option events & watchers.
             * If the value is a string, we pull it from the
             * instance's methods by name.
             */

            exports._initEvents = function () {
                var options = this.$options
                registerCallbacks(this, '$on', options.events)
                registerCallbacks(this, '$watch', options.watch)
            }

            /**
             * Register callbacks for option events and watchers.
             *
             * @param {Vue} vm
             * @param {String} action
             * @param {Object} hash
             */

            function registerCallbacks (vm, action, hash) {
                if (!hash) return
                var handlers, key, i, j
                for (key in hash) {
                    handlers = hash[key]
                    if (_.isArray(handlers)) {
                        for (i = 0, j = handlers.length; i < j; i++) {
                            register(vm, action, key, handlers[i])
                        }
                    } else {
                        register(vm, action, key, handlers)
                    }
                }
            }

            /**
             * Helper to register an event/watch callback.
             *
             * @param {Vue} vm
             * @param {String} action
             * @param {String} key
             * @param {*} handler
             */

            function register (vm, action, key, handler) {
                var type = typeof handler
                if (type === 'function') {
                    vm[action](key, handler)
                } else if (type === 'string') {
                    var methods = vm.$options.methods
                    var method = methods && methods[handler]
                    if (method) {
                        vm[action](key, method)
                    } else {
                        _.warn(
                            'Unknown method: "' + handler + '" when ' +
                            'registering callback for ' + action +
                            ': "' + key + '".'
                        )
                    }
                }
            }

            /**
             * Setup recursive attached/detached calls
             */

            exports._initDOMHooks = function () {
                this.$on('hook:attached', onAttached)
                this.$on('hook:detached', onDetached)
            }

            /**
             * Callback to recursively call attached hook on children
             */

            function onAttached () {
                this._isAttached = true
                this._children.forEach(callAttach)
                if (this._transCpnts.length) {
                    this._transCpnts.forEach(callAttach)
                }
            }

            /**
             * Iterator to call attached hook
             *
             * @param {Vue} child
             */

            function callAttach (child) {
                if (!child._isAttached && inDoc(child.$el)) {
                    child._callHook('attached')
                }
            }

            /**
             * Callback to recursively call detached hook on children
             */

            function onDetached () {
                this._isAttached = false
                this._children.forEach(callDetach)
                if (this._transCpnts.length) {
                    this._transCpnts.forEach(callDetach)
                }
            }

            /**
             * Iterator to call detached hook
             *
             * @param {Vue} child
             */

            function callDetach (child) {
                if (child._isAttached && !inDoc(child.$el)) {
                    child._callHook('detached')
                }
            }

            /**
             * Trigger all handlers for a hook
             *
             * @param {String} hook
             */

            exports._callHook = function (hook) {
                var handlers = this.$options[hook]
                if (handlers) {
                    for (var i = 0, j = handlers.length; i < j; i++) {
                        handlers[i].call(this)
                    }
                }
                this.$emit('hook:' + hook)
            }

            /***/ },
        /* 4 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)
            var Observer = __webpack_require__(49)
            var Dep = __webpack_require__(23)

            /**
             * Setup the scope of an instance, which contains:
             * - observed data
             * - computed properties
             * - user methods
             * - meta properties
             */

            exports._initScope = function () {
                this._initData()
                this._initComputed()
                this._initMethods()
                this._initMeta()
            }

            /**
             * Initialize the data.
             */

            exports._initData = function () {
                // proxy data on instance
                var data = this._data
                var keys = Object.keys(data)
                var i = keys.length
                var key
                while (i--) {
                    key = keys[i]
                    if (!_.isReserved(key)) {
                        this._proxy(key)
                    }
                }
                // observe data
                Observer.create(data).addVm(this)
            }

            /**
             * Swap the isntance's $data. Called in $data's setter.
             *
             * @param {Object} newData
             */

            exports._setData = function (newData) {
                newData = newData || {}
                var oldData = this._data
                this._data = newData
                var keys, key, i
                // unproxy keys not present in new data
                keys = Object.keys(oldData)
                i = keys.length
                while (i--) {
                    key = keys[i]
                    if (!_.isReserved(key) && !(key in newData)) {
                        this._unproxy(key)
                    }
                }
                // proxy keys not already proxied,
                // and trigger change for changed values
                keys = Object.keys(newData)
                i = keys.length
                while (i--) {
                    key = keys[i]
                    if (!this.hasOwnProperty(key) && !_.isReserved(key)) {
                        // new property
                        this._proxy(key)
                    }
                }
                oldData.__ob__.removeVm(this)
                Observer.create(newData).addVm(this)
                this._digest()
            }

            /**
             * Proxy a property, so that
             * vm.prop === vm._data.prop
             *
             * @param {String} key
             */

            exports._proxy = function (key) {
                // need to store ref to self here
                // because these getter/setters might
                // be called by child instances!
                var self = this
                Object.defineProperty(self, key, {
                    configurable: true,
                    enumerable: true,
                    get: function proxyGetter () {
                        return self._data[key]
                    },
                    set: function proxySetter (val) {
                        self._data[key] = val
                    }
                })
            }

            /**
             * Unproxy a property.
             *
             * @param {String} key
             */

            exports._unproxy = function (key) {
                delete this[key]
            }

            /**
             * Force update on every watcher in scope.
             */

            exports._digest = function () {
                var i = this._watcherList.length
                while (i--) {
                    this._watcherList[i].update()
                }
                var children = this._children
                i = children.length
                while (i--) {
                    var child = children[i]
                    if (child.$options.inherit) {
                        child._digest()
                    }
                }
            }

            /**
             * Setup computed properties. They are essentially
             * special getter/setters
             */

            function noop () {}
            exports._initComputed = function () {
                var computed = this.$options.computed
                if (computed) {
                    for (var key in computed) {
                        var userDef = computed[key]
                        var def = {
                            enumerable: true,
                            configurable: true
                        }
                        if (typeof userDef === 'function') {
                            def.get = _.bind(userDef, this)
                            def.set = noop
                        } else {
                            def.get = userDef.get
                                ? _.bind(userDef.get, this)
                                : noop
                            def.set = userDef.set
                                ? _.bind(userDef.set, this)
                                : noop
                        }
                        Object.defineProperty(this, key, def)
                    }
                }
            }

            /**
             * Setup instance methods. Methods must be bound to the
             * instance since they might be called by children
             * inheriting them.
             */

            exports._initMethods = function () {
                var methods = this.$options.methods
                if (methods) {
                    for (var key in methods) {
                        this[key] = _.bind(methods[key], this)
                    }
                }
            }

            /**
             * Initialize meta information like $index, $key & $value.
             */

            exports._initMeta = function () {
                var metas = this.$options._meta
                if (metas) {
                    for (var key in metas) {
                        this._defineMeta(key, metas[key])
                    }
                }
            }

            /**
             * Define a meta property, e.g $index, $key, $value
             * which only exists on the vm instance but not in $data.
             *
             * @param {String} key
             * @param {*} value
             */

            exports._defineMeta = function (key, value) {
                var dep = new Dep()
                Object.defineProperty(this, key, {
                    enumerable: true,
                    configurable: true,
                    get: function metaGetter () {
                        if (Observer.target) {
                            Observer.target.addDep(dep)
                        }
                        return value
                    },
                    set: function metaSetter (val) {
                        if (val !== value) {
                            value = val
                            dep.notify()
                        }
                    }
                })
            }

            /***/ },
        /* 5 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)
            var Directive = __webpack_require__(24)
            var compile = __webpack_require__(16)
            var transclude = __webpack_require__(17)

            /**
             * Transclude, compile and link element.
             *
             * If a pre-compiled linker is available, that means the
             * passed in element will be pre-transcluded and compiled
             * as well - all we need to do is to call the linker.
             *
             * Otherwise we need to call transclude/compile/link here.
             *
             * @param {Element} el
             * @return {Element}
             */

            exports._compile = function (el) {
                var options = this.$options
                if (options._linkFn) {
                    // pre-transcluded with linker, just use it
                    this._initElement(el)
                    options._linkFn(this, el)
                } else {
                    // transclude and init element
                    // transclude can potentially replace original
                    // so we need to keep reference
                    var original = el
                    el = transclude(el, options)
                    this._initElement(el)
                    // compile and link the rest
                    compile(el, options)(this, el)
                    // finally replace original
                    if (options.replace) {
                        _.replace(original, el)
                    }
                }
                return el
            }

            /**
             * Initialize instance element. Called in the public
             * $mount() method.
             *
             * @param {Element} el
             */

            exports._initElement = function (el) {
                if (el instanceof DocumentFragment) {
                    this._isBlock = true
                    this.$el = this._blockStart = el.firstChild
                    this._blockEnd = el.lastChild
                    this._blockFragment = el
                } else {
                    this.$el = el
                }
                this.$el.__vue__ = this
                this._callHook('beforeCompile')
            }

            /**
             * Create and bind a directive to an element.
             *
             * @param {String} name - directive name
             * @param {Node} node   - target node
             * @param {Object} desc - parsed directive descriptor
             * @param {Object} def  - directive definition object
             * @param {Vue|undefined} host - transclusion host component
             */

            exports._bindDir = function (name, node, desc, def, host) {
                this._directives.push(
                    new Directive(name, node, this, desc, def, host)
                )
            }

            /**
             * Teardown an instance, unobserves the data, unbind all the
             * directives, turn off all the event listeners, etc.
             *
             * @param {Boolean} remove - whether to remove the DOM node.
             * @param {Boolean} deferCleanup - if true, defer cleanup to
             *                                 be called later
             */

            exports._destroy = function (remove, deferCleanup) {
                if (this._isBeingDestroyed) {
                    return
                }
                this._callHook('beforeDestroy')
                this._isBeingDestroyed = true
                var i
                // remove self from parent. only necessary
                // if parent is not being destroyed as well.
                var parent = this.$parent
                if (parent && !parent._isBeingDestroyed) {
                    i = parent._children.indexOf(this)
                    parent._children.splice(i, 1)
                }
                // same for transclusion host.
                var host = this._host
                if (host && !host._isBeingDestroyed) {
                    i = host._transCpnts.indexOf(this)
                    host._transCpnts.splice(i, 1)
                }
                // destroy all children.
                i = this._children.length
                while (i--) {
                    this._children[i].$destroy()
                }
                // teardown all directives. this also tearsdown all
                // directive-owned watchers. intentionally check for
                // directives array length on every loop since directives
                // that manages partial compilation can splice ones out
                for (i = 0; i < this._directives.length; i++) {
                    this._directives[i]._teardown()
                }
                // teardown all user watchers.
                var watcher
                for (i in this._userWatchers) {
                    watcher = this._userWatchers[i]
                    if (watcher) {
                        watcher.teardown()
                    }
                }
                // remove reference to self on $el
                if (this.$el) {
                    this.$el.__vue__ = null
                }
                // remove DOM element
                var self = this
                if (remove && this.$el) {
                    this.$remove(function () {
                        self._cleanup()
                    })
                } else if (!deferCleanup) {
                    this._cleanup()
                }
            }

            /**
             * Clean up to ensure garbage collection.
             * This is called after the leave transition if there
             * is any.
             */

            exports._cleanup = function () {
                // remove reference from data ob
                this._data.__ob__.removeVm(this)
                this._data =
                    this._watchers =
                        this._userWatchers =
                            this._watcherList =
                                this.$el =
                                    this.$parent =
                                        this.$root =
                                            this._children =
                                                this._transCpnts =
                                                    this._directives = null
                // call the last hook...
                this._isDestroyed = true
                this._callHook('destroyed')
                // turn off all instance listeners.
                this.$off()
            }

            /***/ },
        /* 6 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)
            var Watcher = __webpack_require__(25)
            var Path = __webpack_require__(18)
            var textParser = __webpack_require__(19)
            var dirParser = __webpack_require__(21)
            var expParser = __webpack_require__(22)
            var filterRE = /[^|]\|[^|]/

            /**
             * Get the value from an expression on this vm.
             *
             * @param {String} exp
             * @return {*}
             */

            exports.$get = function (exp) {
                var res = expParser.parse(exp)
                if (res) {
                    try {
                        return res.get.call(this, this)
                    } catch (e) {}
                }
            }

            /**
             * Set the value from an expression on this vm.
             * The expression must be a valid left-hand
             * expression in an assignment.
             *
             * @param {String} exp
             * @param {*} val
             */

            exports.$set = function (exp, val) {
                var res = expParser.parse(exp, true)
                if (res && res.set) {
                    res.set.call(this, this, val)
                }
            }

            /**
             * Add a property on the VM
             *
             * @param {String} key
             * @param {*} val
             */

            exports.$add = function (key, val) {
                this._data.$add(key, val)
            }

            /**
             * Delete a property on the VM
             *
             * @param {String} key
             */

            exports.$delete = function (key) {
                this._data.$delete(key)
            }

            /**
             * Watch an expression, trigger callback when its
             * value changes.
             *
             * @param {String} exp
             * @param {Function} cb
             * @param {Boolean} [deep]
             * @param {Boolean} [immediate]
             * @return {Function} - unwatchFn
             */

            exports.$watch = function (exp, cb, deep, immediate) {
                var vm = this
                var key = deep ? exp + '**deep**' : exp
                var watcher = vm._userWatchers[key]
                var wrappedCb = function (val, oldVal) {
                    cb.call(vm, val, oldVal)
                }
                if (!watcher) {
                    watcher = vm._userWatchers[key] =
                        new Watcher(vm, exp, wrappedCb, {
                            deep: deep,
                            user: true
                        })
                } else {
                    watcher.addCb(wrappedCb)
                }
                if (immediate) {
                    wrappedCb(watcher.value)
                }
                return function unwatchFn () {
                    watcher.removeCb(wrappedCb)
                    if (!watcher.active) {
                        vm._userWatchers[key] = null
                    }
                }
            }

            /**
             * Evaluate a text directive, including filters.
             *
             * @param {String} text
             * @return {String}
             */

            exports.$eval = function (text) {
                // check for filters.
                if (filterRE.test(text)) {
                    var dir = dirParser.parse(text)[0]
                    // the filter regex check might give false positive
                    // for pipes inside strings, so it's possible that
                    // we don't get any filters here
                    return dir.filters
                        ? _.applyFilters(
                        this.$get(dir.expression),
                        _.resolveFilters(this, dir.filters).read,
                        this
                    )
                        : this.$get(dir.expression)
                } else {
                    // no filter
                    return this.$get(text)
                }
            }

            /**
             * Interpolate a piece of template text.
             *
             * @param {String} text
             * @return {String}
             */

            exports.$interpolate = function (text) {
                var tokens = textParser.parse(text)
                var vm = this
                if (tokens) {
                    return tokens.length === 1
                        ? vm.$eval(tokens[0].value)
                        : tokens.map(function (token) {
                        return token.tag
                            ? vm.$eval(token.value)
                            : token.value
                    }).join('')
                } else {
                    return text
                }
            }

            /**
             * Log instance data as a plain JS object
             * so that it is easier to inspect in console.
             * This method assumes console is available.
             *
             * @param {String} [path]
             */

            exports.$log = function (path) {
                var data = path
                    ? Path.get(this._data, path)
                    : this._data
                if (data) {
                    data = JSON.parse(JSON.stringify(data))
                }
                console.log(data)
            }

            /***/ },
        /* 7 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)
            var transition = __webpack_require__(50)

            /**
             * Append instance to target
             *
             * @param {Node} target
             * @param {Function} [cb]
             * @param {Boolean} [withTransition] - defaults to true
             */

            exports.$appendTo = function (target, cb, withTransition) {
                return insert(
                    this, target, cb, withTransition,
                    append, transition.append
                )
            }

            /**
             * Prepend instance to target
             *
             * @param {Node} target
             * @param {Function} [cb]
             * @param {Boolean} [withTransition] - defaults to true
             */

            exports.$prependTo = function (target, cb, withTransition) {
                target = query(target)
                if (target.hasChildNodes()) {
                    this.$before(target.firstChild, cb, withTransition)
                } else {
                    this.$appendTo(target, cb, withTransition)
                }
                return this
            }

            /**
             * Insert instance before target
             *
             * @param {Node} target
             * @param {Function} [cb]
             * @param {Boolean} [withTransition] - defaults to true
             */

            exports.$before = function (target, cb, withTransition) {
                return insert(
                    this, target, cb, withTransition,
                    before, transition.before
                )
            }

            /**
             * Insert instance after target
             *
             * @param {Node} target
             * @param {Function} [cb]
             * @param {Boolean} [withTransition] - defaults to true
             */

            exports.$after = function (target, cb, withTransition) {
                target = query(target)
                if (target.nextSibling) {
                    this.$before(target.nextSibling, cb, withTransition)
                } else {
                    this.$appendTo(target.parentNode, cb, withTransition)
                }
                return this
            }

            /**
             * Remove instance from DOM
             *
             * @param {Function} [cb]
             * @param {Boolean} [withTransition] - defaults to true
             */

            exports.$remove = function (cb, withTransition) {
                var inDoc = this._isAttached && _.inDoc(this.$el)
                // if we are not in document, no need to check
                // for transitions
                if (!inDoc) withTransition = false
                var op
                var self = this
                var realCb = function () {
                    if (inDoc) self._callHook('detached')
                    if (cb) cb()
                }
                if (
                    this._isBlock &&
                    !this._blockFragment.hasChildNodes()
                ) {
                    op = withTransition === false
                        ? append
                        : transition.removeThenAppend
                    blockOp(this, this._blockFragment, op, realCb)
                } else {
                    op = withTransition === false
                        ? remove
                        : transition.remove
                    op(this.$el, this, realCb)
                }
                return this
            }

            /**
             * Shared DOM insertion function.
             *
             * @param {Vue} vm
             * @param {Element} target
             * @param {Function} [cb]
             * @param {Boolean} [withTransition]
             * @param {Function} op1 - op for non-transition insert
             * @param {Function} op2 - op for transition insert
             * @return vm
             */

            function insert (vm, target, cb, withTransition, op1, op2) {
                target = query(target)
                var targetIsDetached = !_.inDoc(target)
                var op = withTransition === false || targetIsDetached
                    ? op1
                    : op2
                var shouldCallHook =
                    !targetIsDetached &&
                    !vm._isAttached &&
                    !_.inDoc(vm.$el)
                if (vm._isBlock) {
                    blockOp(vm, target, op, cb)
                } else {
                    op(vm.$el, target, vm, cb)
                }
                if (shouldCallHook) {
                    vm._callHook('attached')
                }
                return vm
            }

            /**
             * Execute a transition operation on a block instance,
             * iterating through all its block nodes.
             *
             * @param {Vue} vm
             * @param {Node} target
             * @param {Function} op
             * @param {Function} cb
             */

            function blockOp (vm, target, op, cb) {
                var current = vm._blockStart
                var end = vm._blockEnd
                var next
                while (next !== end) {
                    next = current.nextSibling
                    op(current, target, vm)
                    current = next
                }
                op(end, target, vm, cb)
            }

            /**
             * Check for selectors
             *
             * @param {String|Element} el
             */

            function query (el) {
                return typeof el === 'string'
                    ? document.querySelector(el)
                    : el
            }

            /**
             * Append operation that takes a callback.
             *
             * @param {Node} el
             * @param {Node} target
             * @param {Vue} vm - unused
             * @param {Function} [cb]
             */

            function append (el, target, vm, cb) {
                target.appendChild(el)
                if (cb) cb()
            }

            /**
             * InsertBefore operation that takes a callback.
             *
             * @param {Node} el
             * @param {Node} target
             * @param {Vue} vm - unused
             * @param {Function} [cb]
             */

            function before (el, target, vm, cb) {
                _.before(el, target)
                if (cb) cb()
            }

            /**
             * Remove operation that takes a callback.
             *
             * @param {Node} el
             * @param {Vue} vm - unused
             * @param {Function} [cb]
             */

            function remove (el, vm, cb) {
                _.remove(el)
                if (cb) cb()
            }

            /***/ },
        /* 8 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)

            /**
             * Listen on the given `event` with `fn`.
             *
             * @param {String} event
             * @param {Function} fn
             */

            exports.$on = function (event, fn) {
                (this._events[event] || (this._events[event] = []))
                    .push(fn)
                modifyListenerCount(this, event, 1)
                return this
            }

            /**
             * Adds an `event` listener that will be invoked a single
             * time then automatically removed.
             *
             * @param {String} event
             * @param {Function} fn
             */

            exports.$once = function (event, fn) {
                var self = this
                function on () {
                    self.$off(event, on)
                    fn.apply(this, arguments)
                }
                on.fn = fn
                this.$on(event, on)
                return this
            }

            /**
             * Remove the given callback for `event` or all
             * registered callbacks.
             *
             * @param {String} event
             * @param {Function} fn
             */

            exports.$off = function (event, fn) {
                var cbs
                // all
                if (!arguments.length) {
                    if (this.$parent) {
                        for (event in this._events) {
                            cbs = this._events[event]
                            if (cbs) {
                                modifyListenerCount(this, event, -cbs.length)
                            }
                        }
                    }
                    this._events = {}
                    return this
                }
                // specific event
                cbs = this._events[event]
                if (!cbs) {
                    return this
                }
                if (arguments.length === 1) {
                    modifyListenerCount(this, event, -cbs.length)
                    this._events[event] = null
                    return this
                }
                // specific handler
                var cb
                var i = cbs.length
                while (i--) {
                    cb = cbs[i]
                    if (cb === fn || cb.fn === fn) {
                        modifyListenerCount(this, event, -1)
                        cbs.splice(i, 1)
                        break
                    }
                }
                return this
            }

            /**
             * Trigger an event on self.
             *
             * @param {String} event
             */

            exports.$emit = function (event) {
                this._eventCancelled = false
                var cbs = this._events[event]
                if (cbs) {
                    // avoid leaking arguments:
                    // http://jsperf.com/closure-with-arguments
                    var i = arguments.length - 1
                    var args = new Array(i)
                    while (i--) {
                        args[i] = arguments[i + 1]
                    }
                    i = 0
                    cbs = cbs.length > 1
                        ? _.toArray(cbs)
                        : cbs
                    for (var l = cbs.length; i < l; i++) {
                        if (cbs[i].apply(this, args) === false) {
                            this._eventCancelled = true
                        }
                    }
                }
                return this
            }

            /**
             * Recursively broadcast an event to all children instances.
             *
             * @param {String} event
             * @param {...*} additional arguments
             */

            exports.$broadcast = function (event) {
                // if no child has registered for this event,
                // then there's no need to broadcast.
                if (!this._eventsCount[event]) return
                var children = this._children
                for (var i = 0, l = children.length; i < l; i++) {
                    var child = children[i]
                    child.$emit.apply(child, arguments)
                    if (!child._eventCancelled) {
                        child.$broadcast.apply(child, arguments)
                    }
                }
                return this
            }

            /**
             * Recursively propagate an event up the parent chain.
             *
             * @param {String} event
             * @param {...*} additional arguments
             */

            exports.$dispatch = function () {
                var parent = this.$parent
                while (parent) {
                    parent.$emit.apply(parent, arguments)
                    parent = parent._eventCancelled
                        ? null
                        : parent.$parent
                }
                return this
            }

            /**
             * Modify the listener counts on all parents.
             * This bookkeeping allows $broadcast to return early when
             * no child has listened to a certain event.
             *
             * @param {Vue} vm
             * @param {String} event
             * @param {Number} count
             */

            var hookRE = /^hook:/
            function modifyListenerCount (vm, event, count) {
                var parent = vm.$parent
                // hooks do not get broadcasted so no need
                // to do bookkeeping for them
                if (!parent || !count || hookRE.test(event)) return
                while (parent) {
                    parent._eventsCount[event] =
                        (parent._eventsCount[event] || 0) + count
                    parent = parent.$parent
                }
            }

            /***/ },
        /* 9 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)

            /**
             * Create a child instance that prototypally inehrits
             * data on parent. To achieve that we create an intermediate
             * constructor with its prototype pointing to parent.
             *
             * @param {Object} opts
             * @param {Function} [BaseCtor]
             * @return {Vue}
             * @public
             */

            exports.$addChild = function (opts, BaseCtor) {
                BaseCtor = BaseCtor || _.Vue
                opts = opts || {}
                var parent = this
                var ChildVue
                var inherit = opts.inherit !== undefined
                    ? opts.inherit
                    : BaseCtor.options.inherit
                if (inherit) {
                    var ctors = parent._childCtors
                    ChildVue = ctors[BaseCtor.cid]
                    if (!ChildVue) {
                        var optionName = BaseCtor.options.name
                        var className = optionName
                            ? _.classify(optionName)
                            : 'VueComponent'
                        ChildVue = new Function(
                            'return function ' + className + ' (options) {' +
                            'this.constructor = ' + className + ';' +
                            'this._init(options) }'
                        )()
                        ChildVue.options = BaseCtor.options
                        ChildVue.prototype = this
                        ctors[BaseCtor.cid] = ChildVue
                    }
                } else {
                    ChildVue = BaseCtor
                }
                opts._parent = parent
                opts._root = parent.$root
                var child = new ChildVue(opts)
                return child
            }

            /***/ },
        /* 10 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)
            var compile = __webpack_require__(16)

            /**
             * Set instance target element and kick off the compilation
             * process. The passed in `el` can be a selector string, an
             * existing Element, or a DocumentFragment (for block
             * instances).
             *
             * @param {Element|DocumentFragment|string} el
             * @public
             */

            exports.$mount = function (el) {
                if (this._isCompiled) {
                    _.warn('$mount() should be called only once.')
                    return
                }
                if (!el) {
                    el = document.createElement('div')
                } else if (typeof el === 'string') {
                    var selector = el
                    el = document.querySelector(el)
                    if (!el) {
                        _.warn('Cannot find element: ' + selector)
                        return
                    }
                }
                this._compile(el)
                this._isCompiled = true
                this._callHook('compiled')
                if (_.inDoc(this.$el)) {
                    this._callHook('attached')
                    this._initDOMHooks()
                    ready.call(this)
                } else {
                    this._initDOMHooks()
                    this.$once('hook:attached', ready)
                }
                return this
            }

            /**
             * Mark an instance as ready.
             */

            function ready () {
                this._isAttached = true
                this._isReady = true
                this._callHook('ready')
            }

            /**
             * Teardown the instance, simply delegate to the internal
             * _destroy.
             */

            exports.$destroy = function (remove, deferCleanup) {
                this._destroy(remove, deferCleanup)
            }

            /**
             * Partially compile a piece of DOM and return a
             * decompile function.
             *
             * @param {Element|DocumentFragment} el
             * @return {Function}
             */

            exports.$compile = function (el) {
                return compile(el, this.$options, true)(this, el)
            }

            /***/ },
        /* 11 */
        /***/ function(module, exports, __webpack_require__) {

            var lang   = __webpack_require__(26)
            var extend = lang.extend

            extend(exports, lang)
            extend(exports, __webpack_require__(27))
            extend(exports, __webpack_require__(28))
            extend(exports, __webpack_require__(29))
            extend(exports, __webpack_require__(30))

            /***/ },
        /* 12 */
        /***/ function(module, exports, __webpack_require__) {

            // manipulation directives
            exports.text       = __webpack_require__(31)
            exports.html       = __webpack_require__(32)
            exports.attr       = __webpack_require__(33)
            exports.show       = __webpack_require__(34)
            exports['class']   = __webpack_require__(35)
            exports.el         = __webpack_require__(36)
            exports.ref        = __webpack_require__(37)
            exports.cloak      = __webpack_require__(38)
            exports.style      = __webpack_require__(39)
            exports.partial    = __webpack_require__(40)
            exports.transition = __webpack_require__(41)

            // event listener directives
            exports.on         = __webpack_require__(42)
            exports.model      = __webpack_require__(51)

            // child vm directives
            exports.component  = __webpack_require__(43)
            exports.repeat     = __webpack_require__(44)
            exports['if']      = __webpack_require__(45)

            // child vm communication directives
            exports['with']    = __webpack_require__(46)
            exports.events     = __webpack_require__(47)

            /***/ },
        /* 13 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)

            /**
             * Stringify value.
             *
             * @param {Number} indent
             */

            exports.json = {
                read: function (value, indent) {
                    return typeof value === 'string'
                        ? value
                        : JSON.stringify(value, null, Number(indent) || 2)
                },
                write: function (value) {
                    try {
                        return JSON.parse(value)
                    } catch (e) {
                        return value
                    }
                }
            }

            /**
             * 'abc' => 'Abc'
             */

            exports.capitalize = function (value) {
                if (!value && value !== 0) return ''
                value = value.toString()
                return value.charAt(0).toUpperCase() + value.slice(1)
            }

            /**
             * 'abc' => 'ABC'
             */

            exports.uppercase = function (value) {
                return (value || value === 0)
                    ? value.toString().toUpperCase()
                    : ''
            }

            /**
             * 'AbC' => 'abc'
             */

            exports.lowercase = function (value) {
                return (value || value === 0)
                    ? value.toString().toLowerCase()
                    : ''
            }

            /**
             * 12345 => $12,345.00
             *
             * @param {String} sign
             */

            var digitsRE = /(\d{3})(?=\d)/g

            exports.currency = function (value, sign) {
                value = parseFloat(value)
                if (!isFinite(value) || (!value && value !== 0)) return ''
                sign = sign || '$'
                var s = Math.floor(Math.abs(value)).toString(),
                    i = s.length % 3,
                    h = i > 0
                        ? (s.slice(0, i) + (s.length > 3 ? ',' : ''))
                        : '',
                    v = Math.abs(parseInt((value * 100) % 100, 10)),
                    f = '.' + (v < 10 ? ('0' + v) : v)
                return (value < 0 ? '-' : '') +
                    sign + h + s.slice(i).replace(digitsRE, '$1,') + f
            }

            /**
             * 'item' => 'items'
             *
             * @params
             *  an array of strings corresponding to
             *  the single, double, triple ... forms of the word to
             *  be pluralized. When the number to be pluralized
             *  exceeds the length of the args, it will use the last
             *  entry in the array.
             *
             *  e.g. ['single', 'double', 'triple', 'multiple']
             */

            exports.pluralize = function (value) {
                var args = _.toArray(arguments, 1)
                return args.length > 1
                    ? (args[value % 10 - 1] || args[args.length - 1])
                    : (args[0] + (value === 1 ? '' : 's'))
            }

            /**
             * A special filter that takes a handler function,
             * wraps it so it only gets triggered on specific
             * keypresses. v-on only.
             *
             * @param {String} key
             */

            var keyCodes = {
                enter    : 13,
                tab      : 9,
                'delete' : 46,
                up       : 38,
                left     : 37,
                right    : 39,
                down     : 40,
                esc      : 27
            }

            exports.key = function (handler, key) {
                if (!handler) return
                var code = keyCodes[key]
                if (!code) {
                    code = parseInt(key, 10)
                }
                return function (e) {
                    if (e.keyCode === code) {
                        return handler.call(this, e)
                    }
                }
            }

            // expose keycode hash
            exports.key.keyCodes = keyCodes

            /**
             * Install special array filters
             */

            _.extend(exports, __webpack_require__(48))


            /***/ },
        /* 14 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)
            var extend = _.extend

            /**
             * Option overwriting strategies are functions that handle
             * how to merge a parent option value and a child option
             * value into the final value.
             *
             * All strategy functions follow the same signature:
             *
             * @param {*} parentVal
             * @param {*} childVal
             * @param {Vue} [vm]
             */

            var strats = Object.create(null)

            /**
             * Helper that recursively merges two data objects together.
             */

            function mergeData (to, from) {
                var key, toVal, fromVal
                for (key in from) {
                    toVal = to[key]
                    fromVal = from[key]
                    if (!to.hasOwnProperty(key)) {
                        to.$add(key, fromVal)
                    } else if (_.isObject(toVal) && _.isObject(fromVal)) {
                        mergeData(toVal, fromVal)
                    }
                }
                return to
            }

            /**
             * Data
             */

            strats.data = function (parentVal, childVal, vm) {
                if (!vm) {
                    // in a Vue.extend merge, both should be functions
                    if (!childVal) {
                        return parentVal
                    }
                    if (typeof childVal !== 'function') {
                        _.warn(
                            'The "data" option should be a function ' +
                            'that returns a per-instance value in component ' +
                            'definitions.'
                        )
                        return parentVal
                    }
                    if (!parentVal) {
                        return childVal
                    }
                    // when parentVal & childVal are both present,
                    // we need to return a function that returns the
                    // merged result of both functions... no need to
                    // check if parentVal is a function here because
                    // it has to be a function to pass previous merges.
                    return function mergedDataFn () {
                        return mergeData(
                            childVal.call(this),
                            parentVal.call(this)
                        )
                    }
                } else {
                    // instance merge, return raw object
                    var instanceData = typeof childVal === 'function'
                        ? childVal.call(vm)
                        : childVal
                    var defaultData = typeof parentVal === 'function'
                        ? parentVal.call(vm)
                        : undefined
                    if (instanceData) {
                        return mergeData(instanceData, defaultData)
                    } else {
                        return defaultData
                    }
                }
            }

            /**
             * El
             */

            strats.el = function (parentVal, childVal, vm) {
                if (!vm && childVal && typeof childVal !== 'function') {
                    _.warn(
                        'The "el" option should be a function ' +
                        'that returns a per-instance value in component ' +
                        'definitions.'
                    )
                    return
                }
                var ret = childVal || parentVal
                // invoke the element factory if this is instance merge
                return vm && typeof ret === 'function'
                    ? ret.call(vm)
                    : ret
            }

            /**
             * Hooks and param attributes are merged as arrays.
             */

            strats.created =
                strats.ready =
                    strats.attached =
                        strats.detached =
                            strats.beforeCompile =
                                strats.compiled =
                                    strats.beforeDestroy =
                                        strats.destroyed =
                                            strats.paramAttributes = function (parentVal, childVal) {
                                                return childVal
                                                    ? parentVal
                                                    ? parentVal.concat(childVal)
                                                    : _.isArray(childVal)
                                                    ? childVal
                                                    : [childVal]
                                                    : parentVal
                                            }

            /**
             * Assets
             *
             * When a vm is present (instance creation), we need to do
             * a three-way merge between constructor options, instance
             * options and parent options.
             */

            strats.directives =
                strats.filters =
                    strats.partials =
                        strats.transitions =
                            strats.components = function (parentVal, childVal, vm, key) {
                                var ret = Object.create(
                                    vm && vm.$parent
                                        ? vm.$parent.$options[key]
                                        : _.Vue.options[key]
                                )
                                if (parentVal) {
                                    var keys = Object.keys(parentVal)
                                    var i = keys.length
                                    var field
                                    while (i--) {
                                        field = keys[i]
                                        ret[field] = parentVal[field]
                                    }
                                }
                                if (childVal) extend(ret, childVal)
                                return ret
                            }

            /**
             * Events & Watchers.
             *
             * Events & watchers hashes should not overwrite one
             * another, so we merge them as arrays.
             */

            strats.watch =
                strats.events = function (parentVal, childVal) {
                    if (!childVal) return parentVal
                    if (!parentVal) return childVal
                    var ret = {}
                    extend(ret, parentVal)
                    for (var key in childVal) {
                        var parent = ret[key]
                        var child = childVal[key]
                        if (parent && !_.isArray(parent)) {
                            parent = [parent]
                        }
                        ret[key] = parent
                            ? parent.concat(child)
                            : [child]
                    }
                    return ret
                }

            /**
             * Other object hashes.
             */

            strats.methods =
                strats.computed = function (parentVal, childVal) {
                    if (!childVal) return parentVal
                    if (!parentVal) return childVal
                    var ret = Object.create(parentVal)
                    extend(ret, childVal)
                    return ret
                }

            /**
             * Default strategy.
             */

            var defaultStrat = function (parentVal, childVal) {
                return childVal === undefined
                    ? parentVal
                    : childVal
            }

            /**
             * Make sure component options get converted to actual
             * constructors.
             *
             * @param {Object} components
             */

            function guardComponents (components) {
                if (components) {
                    var def
                    for (var key in components) {
                        def = components[key]
                        if (_.isPlainObject(def)) {
                            def.name = key
                            components[key] = _.Vue.extend(def)
                        }
                    }
                }
            }

            /**
             * Merge two option objects into a new one.
             * Core utility used in both instantiation and inheritance.
             *
             * @param {Object} parent
             * @param {Object} child
             * @param {Vue} [vm] - if vm is present, indicates this is
             *                     an instantiation merge.
             */

            module.exports = function mergeOptions (parent, child, vm) {
                guardComponents(child.components)
                var options = {}
                var key
                if (child.mixins) {
                    for (var i = 0, l = child.mixins.length; i < l; i++) {
                        parent = mergeOptions(parent, child.mixins[i], vm)
                    }
                }
                for (key in parent) {
                    merge(key)
                }
                for (key in child) {
                    if (!(parent.hasOwnProperty(key))) {
                        merge(key)
                    }
                }
                function merge (key) {
                    var strat = strats[key] || defaultStrat
                    options[key] = strat(parent[key], child[key], vm, key)
                }
                return options
            }

            /***/ },
        /* 15 */
        /***/ function(module, exports, __webpack_require__) {

            module.exports = {

                /**
                 * The prefix to look for when parsing directives.
                 *
                 * @type {String}
                 */

                prefix: 'v-',

                /**
                 * Whether to print debug messages.
                 * Also enables stack trace for warnings.
                 *
                 * @type {Boolean}
                 */

                debug: false,

                /**
                 * Whether to suppress warnings.
                 *
                 * @type {Boolean}
                 */

                silent: false,

                /**
                 * Whether allow observer to alter data objects'
                 * __proto__.
                 *
                 * @type {Boolean}
                 */

                proto: true,

                /**
                 * Whether to parse mustache tags in templates.
                 *
                 * @type {Boolean}
                 */

                interpolate: true,

                /**
                 * Whether to use async rendering.
                 */

                async: true,

                /**
                 * Whether to warn against errors caught when evaluating
                 * expressions.
                 */

                warnExpressionErrors: true,

                /**
                 * Internal flag to indicate the delimiters have been
                 * changed.
                 *
                 * @type {Boolean}
                 */

                _delimitersChanged: true

            }

            /**
             * Interpolation delimiters.
             * We need to mark the changed flag so that the text parser
             * knows it needs to recompile the regex.
             *
             * @type {Array<String>}
             */

            var delimiters = ['{{', '}}']
            Object.defineProperty(module.exports, 'delimiters', {
                get: function () {
                    return delimiters
                },
                set: function (val) {
                    delimiters = val
                    this._delimitersChanged = true
                }
            })

            /***/ },
        /* 16 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)
            var config = __webpack_require__(15)
            var textParser = __webpack_require__(19)
            var dirParser = __webpack_require__(21)
            var templateParser = __webpack_require__(20)

            module.exports = compile

            /**
             * Compile a template and return a reusable composite link
             * function, which recursively contains more link functions
             * inside. This top level compile function should only be
             * called on instance root nodes.
             *
             * @param {Element|DocumentFragment} el
             * @param {Object} options
             * @param {Boolean} partial
             * @param {Boolean} transcluded
             * @return {Function}
             */

            function compile (el, options, partial, transcluded) {
                var isBlock = el.nodeType === 11
                // link function for param attributes.
                var params = options.paramAttributes
                var paramsLinkFn = params && !partial && !transcluded && !isBlock
                    ? compileParamAttributes(el, params, options)
                    : null
                // link function for the node itself.
                // if this is a block instance, we return a link function
                // for the attributes found on the container, if any.
                // options._containerAttrs are collected during transclusion.
                var nodeLinkFn = isBlock
                    ? compileBlockContainer(options._containerAttrs, params, options)
                    : compileNode(el, options)
                // link function for the childNodes
                var childLinkFn =
                    !(nodeLinkFn && nodeLinkFn.terminal) &&
                    el.tagName !== 'SCRIPT' &&
                    el.hasChildNodes()
                        ? compileNodeList(el.childNodes, options)
                        : null

                /**
                 * A composite linker function to be called on a already
                 * compiled piece of DOM, which instantiates all directive
                 * instances.
                 *
                 * @param {Vue} vm
                 * @param {Element|DocumentFragment} el
                 * @return {Function|undefined}
                 */

                function compositeLinkFn (vm, el) {
                    var originalDirCount = vm._directives.length
                    var parentOriginalDirCount =
                        vm.$parent && vm.$parent._directives.length
                    if (paramsLinkFn) {
                        paramsLinkFn(vm, el)
                    }
                    // cache childNodes before linking parent, fix #657
                    var childNodes = _.toArray(el.childNodes)
                    // if this is a transcluded compile, linkers need to be
                    // called in source scope, and the host needs to be
                    // passed down.
                    var source = transcluded ? vm.$parent : vm
                    var host = transcluded ? vm : undefined
                    // link
                    if (nodeLinkFn) nodeLinkFn(source, el, host)
                    if (childLinkFn) childLinkFn(source, childNodes, host)

                    /**
                     * If this is a partial compile, the linker function
                     * returns an unlink function that tearsdown all
                     * directives instances generated during the partial
                     * linking.
                     */

                    if (partial && !transcluded) {
                        var selfDirs = vm._directives.slice(originalDirCount)
                        var parentDirs = vm.$parent &&
                            vm.$parent._directives.slice(parentOriginalDirCount)

                        var teardownDirs = function (vm, dirs) {
                            var i = dirs.length
                            while (i--) {
                                dirs[i]._teardown()
                            }
                            i = vm._directives.indexOf(dirs[0])
                            vm._directives.splice(i, dirs.length)
                        }

                        return function unlink () {
                            teardownDirs(vm, selfDirs)
                            if (parentDirs) {
                                teardownDirs(vm.$parent, parentDirs)
                            }
                        }
                    }
                }

                // transcluded linkFns are terminal, because it takes
                // over the entire sub-tree.
                if (transcluded) {
                    compositeLinkFn.terminal = true
                }

                return compositeLinkFn
            }

            /**
             * Compile the attributes found on a "block container" -
             * i.e. the container node in the parent tempate of a block
             * instance. We are only concerned with v-with and
             * paramAttributes here.
             *
             * @param {Object} attrs - a map of attr name/value pairs
             * @param {Array} params - param attributes list
             * @param {Object} options
             * @return {Function}
             */

            function compileBlockContainer (attrs, params, options) {
                if (!attrs) return null
                var paramsLinkFn = params
                    ? compileParamAttributes(attrs, params, options)
                    : null
                var withVal = attrs[config.prefix + 'with']
                var withLinkFn = null
                if (withVal) {
                    var descriptor = dirParser.parse(withVal)[0]
                    var def = options.directives['with']
                    withLinkFn = function (vm, el) {
                        vm._bindDir('with', el, descriptor, def)
                    }
                }
                return function blockContainerLinkFn (vm) {
                    // explicitly passing null to the linkers
                    // since v-with doesn't need a real element
                    if (paramsLinkFn) paramsLinkFn(vm, null)
                    if (withLinkFn) withLinkFn(vm, null)
                }
            }

            /**
             * Compile a node and return a nodeLinkFn based on the
             * node type.
             *
             * @param {Node} node
             * @param {Object} options
             * @return {Function|null}
             */

            function compileNode (node, options) {
                var type = node.nodeType
                if (type === 1 && node.tagName !== 'SCRIPT') {
                    return compileElement(node, options)
                } else if (type === 3 && config.interpolate && node.data.trim()) {
                    return compileTextNode(node, options)
                } else {
                    return null
                }
            }

            /**
             * Compile an element and return a nodeLinkFn.
             *
             * @param {Element} el
             * @param {Object} options
             * @return {Function|null}
             */

            function compileElement (el, options) {
                if (checkTransclusion(el)) {
                    // unwrap textNode
                    if (el.hasAttribute('__vue__wrap')) {
                        el = el.firstChild
                    }
                    return compile(el, options._parent.$options, true, true)
                }
                var linkFn, tag, component
                // check custom element component, but only on non-root
                if (!el.__vue__) {
                    tag = el.tagName.toLowerCase()
                    component =
                        tag.indexOf('-') > 0 &&
                        options.components[tag]
                    if (component) {
                        el.setAttribute(config.prefix + 'component', tag)
                    }
                }
                if (component || el.hasAttributes()) {
                    // check terminal direcitves
                    linkFn = checkTerminalDirectives(el, options)
                    // if not terminal, build normal link function
                    if (!linkFn) {
                        var dirs = collectDirectives(el, options)
                        linkFn = dirs.length
                            ? makeNodeLinkFn(dirs)
                            : null
                    }
                }
                // if the element is a textarea, we need to interpolate
                // its content on initial render.
                if (el.tagName === 'TEXTAREA') {
                    var realLinkFn = linkFn
                    linkFn = function (vm, el) {
                        el.value = vm.$interpolate(el.value)
                        if (realLinkFn) realLinkFn(vm, el)
                    }
                    linkFn.terminal = true
                }
                return linkFn
            }

            /**
             * Build a link function for all directives on a single node.
             *
             * @param {Array} directives
             * @return {Function} directivesLinkFn
             */

            function makeNodeLinkFn (directives) {
                return function nodeLinkFn (vm, el, host) {
                    // reverse apply because it's sorted low to high
                    var i = directives.length
                    var dir, j, k, target
                    while (i--) {
                        dir = directives[i]
                        // a directive can be transcluded if it's written
                        // on a component's container in its parent tempalte.
                        target = dir.transcluded
                            ? vm.$parent
                            : vm
                        if (dir._link) {
                            // custom link fn
                            dir._link(target, el)
                        } else {
                            k = dir.descriptors.length
                            for (j = 0; j < k; j++) {
                                target._bindDir(dir.name, el,
                                    dir.descriptors[j], dir.def, host)
                            }
                        }
                    }
                }
            }

            /**
             * Compile a textNode and return a nodeLinkFn.
             *
             * @param {TextNode} node
             * @param {Object} options
             * @return {Function|null} textNodeLinkFn
             */

            function compileTextNode (node, options) {
                var tokens = textParser.parse(node.data)
                if (!tokens) {
                    return null
                }
                var frag = document.createDocumentFragment()
                var el, token
                for (var i = 0, l = tokens.length; i < l; i++) {
                    token = tokens[i]
                    el = token.tag
                        ? processTextToken(token, options)
                        : document.createTextNode(token.value)
                    frag.appendChild(el)
                }
                return makeTextNodeLinkFn(tokens, frag, options)
            }

            /**
             * Process a single text token.
             *
             * @param {Object} token
             * @param {Object} options
             * @return {Node}
             */

            function processTextToken (token, options) {
                var el
                if (token.oneTime) {
                    el = document.createTextNode(token.value)
                } else {
                    if (token.html) {
                        el = document.createComment('v-html')
                        setTokenType('html')
                    } else if (token.partial) {
                        el = document.createComment('v-partial')
                        setTokenType('partial')
                    } else {
                        // IE will clean up empty textNodes during
                        // frag.cloneNode(true), so we have to give it
                        // something here...
                        el = document.createTextNode(' ')
                        setTokenType('text')
                    }
                }
                function setTokenType (type) {
                    token.type = type
                    token.def = options.directives[type]
                    token.descriptor = dirParser.parse(token.value)[0]
                }
                return el
            }

            /**
             * Build a function that processes a textNode.
             *
             * @param {Array<Object>} tokens
             * @param {DocumentFragment} frag
             */

            function makeTextNodeLinkFn (tokens, frag) {
                return function textNodeLinkFn (vm, el) {
                    var fragClone = frag.cloneNode(true)
                    var childNodes = _.toArray(fragClone.childNodes)
                    var token, value, node
                    for (var i = 0, l = tokens.length; i < l; i++) {
                        token = tokens[i]
                        value = token.value
                        if (token.tag) {
                            node = childNodes[i]
                            if (token.oneTime) {
                                value = vm.$eval(value)
                                if (token.html) {
                                    _.replace(node, templateParser.parse(value, true))
                                } else {
                                    node.data = value
                                }
                            } else {
                                vm._bindDir(token.type, node,
                                    token.descriptor, token.def)
                            }
                        }
                    }
                    _.replace(el, fragClone)
                }
            }

            /**
             * Compile a node list and return a childLinkFn.
             *
             * @param {NodeList} nodeList
             * @param {Object} options
             * @return {Function|undefined}
             */

            function compileNodeList (nodeList, options) {
                var linkFns = []
                var nodeLinkFn, childLinkFn, node
                for (var i = 0, l = nodeList.length; i < l; i++) {
                    node = nodeList[i]
                    nodeLinkFn = compileNode(node, options)
                    childLinkFn =
                        !(nodeLinkFn && nodeLinkFn.terminal) &&
                        node.tagName !== 'SCRIPT' &&
                        node.hasChildNodes()
                            ? compileNodeList(node.childNodes, options)
                            : null
                    linkFns.push(nodeLinkFn, childLinkFn)
                }
                return linkFns.length
                    ? makeChildLinkFn(linkFns)
                    : null
            }

            /**
             * Make a child link function for a node's childNodes.
             *
             * @param {Array<Function>} linkFns
             * @return {Function} childLinkFn
             */

            function makeChildLinkFn (linkFns) {
                return function childLinkFn (vm, nodes, host) {
                    var node, nodeLinkFn, childrenLinkFn
                    for (var i = 0, n = 0, l = linkFns.length; i < l; n++) {
                        node = nodes[n]
                        nodeLinkFn = linkFns[i++]
                        childrenLinkFn = linkFns[i++]
                        // cache childNodes before linking parent, fix #657
                        var childNodes = _.toArray(node.childNodes)
                        if (nodeLinkFn) {
                            nodeLinkFn(vm, node, host)
                        }
                        if (childrenLinkFn) {
                            childrenLinkFn(vm, childNodes, host)
                        }
                    }
                }
            }

            /**
             * Compile param attributes on a root element and return
             * a paramAttributes link function.
             *
             * @param {Element|Object} el
             * @param {Array} attrs
             * @param {Object} options
             * @return {Function} paramsLinkFn
             */

            function compileParamAttributes (el, attrs, options) {
                var params = []
                var isEl = el.nodeType
                var i = attrs.length
                var name, value, param
                while (i--) {
                    name = attrs[i]
                    if (/[A-Z]/.test(name)) {
                        _.warn(
                            'You seem to be using camelCase for a paramAttribute, ' +
                            'but HTML doesn\'t differentiate between upper and ' +
                            'lower case. You should use hyphen-delimited ' +
                            'attribute names. For more info see ' +
                            'http://vuejs.org/api/options.html#paramAttributes'
                        )
                    }
                    value = isEl ? el.getAttribute(name) : el[name]
                    if (value !== null) {
                        param = {
                            name: name,
                            value: value
                        }
                        var tokens = textParser.parse(value)
                        if (tokens) {
                            if (isEl) el.removeAttribute(name)
                            if (tokens.length > 1) {
                                _.warn(
                                    'Invalid param attribute binding: "' +
                                    name + '="' + value + '"' +
                                    '\nDon\'t mix binding tags with plain text ' +
                                    'in param attribute bindings.'
                                )
                                continue
                            } else {
                                param.dynamic = true
                                param.value = tokens[0].value
                            }
                        }
                        params.push(param)
                    }
                }
                return makeParamsLinkFn(params, options)
            }

            /**
             * Build a function that applies param attributes to a vm.
             *
             * @param {Array} params
             * @param {Object} options
             * @return {Function} paramsLinkFn
             */

            var dataAttrRE = /^data-/

            function makeParamsLinkFn (params, options) {
                var def = options.directives['with']
                return function paramsLinkFn (vm, el) {
                    var i = params.length
                    var param, path
                    while (i--) {
                        param = params[i]
                        // params could contain dashes, which will be
                        // interpreted as minus calculations by the parser
                        // so we need to wrap the path here
                        path = _.camelize(param.name.replace(dataAttrRE, ''))
                        if (param.dynamic) {
                            // dynamic param attribtues are bound as v-with.
                            // we can directly duck the descriptor here beacuse
                            // param attributes cannot use expressions or
                            // filters.
                            vm._bindDir('with', el, {
                                arg: path,
                                expression: param.value
                            }, def)
                        } else {
                            // just set once
                            vm.$set(path, param.value)
                        }
                    }
                }
            }

            /**
             * Check an element for terminal directives in fixed order.
             * If it finds one, return a terminal link function.
             *
             * @param {Element} el
             * @param {Object} options
             * @return {Function} terminalLinkFn
             */

            var terminalDirectives = [
                'repeat',
                'if',
                'component'
            ]

            function skip () {}
            skip.terminal = true

            function checkTerminalDirectives (el, options) {
                if (_.attr(el, 'pre') !== null) {
                    return skip
                }
                var value, dirName
                /* jshint boss: true */
                for (var i = 0; i < 3; i++) {
                    dirName = terminalDirectives[i]
                    if (value = _.attr(el, dirName)) {
                        return makeTerminalNodeLinkFn(el, dirName, value, options)
                    }
                }
            }

            /**
             * Build a node link function for a terminal directive.
             * A terminal link function terminates the current
             * compilation recursion and handles compilation of the
             * subtree in the directive.
             *
             * @param {Element} el
             * @param {String} dirName
             * @param {String} value
             * @param {Object} options
             * @return {Function} terminalLinkFn
             */

            function makeTerminalNodeLinkFn (el, dirName, value, options) {
                var descriptor = dirParser.parse(value)[0]
                var def = options.directives[dirName]
                var fn = function terminalNodeLinkFn (vm, el, host) {
                    vm._bindDir(dirName, el, descriptor, def, host)
                }
                fn.terminal = true
                return fn
            }

            /**
             * Collect the directives on an element.
             *
             * @param {Element} el
             * @param {Object} options
             * @return {Array}
             */

            function collectDirectives (el, options) {
                var attrs = _.toArray(el.attributes)
                var i = attrs.length
                var dirs = []
                var attr, attrName, dir, dirName, dirDef, transcluded
                while (i--) {
                    attr = attrs[i]
                    attrName = attr.name
                    transcluded =
                        options._transcludedAttrs &&
                        options._transcludedAttrs[attrName]
                    if (attrName.indexOf(config.prefix) === 0) {
                        dirName = attrName.slice(config.prefix.length)
                        dirDef = options.directives[dirName]
                        _.assertAsset(dirDef, 'directive', dirName)
                        if (dirDef) {
                            dirs.push({
                                name: dirName,
                                descriptors: dirParser.parse(attr.value),
                                def: dirDef,
                                transcluded: transcluded
                            })
                        }
                    } else if (config.interpolate) {
                        dir = collectAttrDirective(el, attrName, attr.value,
                            options)
                        if (dir) {
                            dir.transcluded = transcluded
                            dirs.push(dir)
                        }
                    }
                }
                // sort by priority, LOW to HIGH
                dirs.sort(directiveComparator)
                return dirs
            }

            /**
             * Check an attribute for potential dynamic bindings,
             * and return a directive object.
             *
             * @param {Element} el
             * @param {String} name
             * @param {String} value
             * @param {Object} options
             * @return {Object}
             */

            function collectAttrDirective (el, name, value, options) {
                var tokens = textParser.parse(value)
                if (tokens) {
                    var def = options.directives.attr
                    var i = tokens.length
                    var allOneTime = true
                    while (i--) {
                        var token = tokens[i]
                        if (token.tag && !token.oneTime) {
                            allOneTime = false
                        }
                    }
                    return {
                        def: def,
                        _link: allOneTime
                            ? function (vm, el) {
                            el.setAttribute(name, vm.$interpolate(value))
                        }
                            : function (vm, el) {
                            var value = textParser.tokensToExp(tokens, vm)
                            var desc = dirParser.parse(name + ':' + value)[0]
                            vm._bindDir('attr', el, desc, def)
                        }
                    }
                }
            }

            /**
             * Directive priority sort comparator
             *
             * @param {Object} a
             * @param {Object} b
             */

            function directiveComparator (a, b) {
                a = a.def.priority || 0
                b = b.def.priority || 0
                return a > b ? 1 : -1
            }

            /**
             * Check whether an element is transcluded
             *
             * @param {Element} el
             * @return {Boolean}
             */

            var transcludedFlagAttr = '__vue__transcluded'
            function checkTransclusion (el) {
                if (el.nodeType === 1 && el.hasAttribute(transcludedFlagAttr)) {
                    el.removeAttribute(transcludedFlagAttr)
                    return true
                }
            }

            /***/ },
        /* 17 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)
            var config = __webpack_require__(15)
            var templateParser = __webpack_require__(20)
            var transcludedFlagAttr = '__vue__transcluded'

            /**
             * Process an element or a DocumentFragment based on a
             * instance option object. This allows us to transclude
             * a template node/fragment before the instance is created,
             * so the processed fragment can then be cloned and reused
             * in v-repeat.
             *
             * @param {Element} el
             * @param {Object} options
             * @return {Element|DocumentFragment}
             */

            module.exports = function transclude (el, options) {
                if (options && options._asComponent) {
                    // mutating the options object here assuming the same
                    // object will be used for compile right after this
                    options._transcludedAttrs = extractAttrs(el.attributes)
                    // Mark content nodes and attrs so that the compiler
                    // knows they should be compiled in parent scope.
                    var i = el.childNodes.length
                    while (i--) {
                        var node = el.childNodes[i]
                        if (node.nodeType === 1) {
                            node.setAttribute(transcludedFlagAttr, '')
                        } else if (node.nodeType === 3 && node.data.trim()) {
                            // wrap transcluded textNodes in spans, because
                            // raw textNodes can't be persisted through clones
                            // by attaching attributes.
                            var wrapper = document.createElement('span')
                            wrapper.textContent = node.data
                            wrapper.setAttribute('__vue__wrap', '')
                            wrapper.setAttribute(transcludedFlagAttr, '')
                            el.replaceChild(wrapper, node)
                        }
                    }
                }
                // for template tags, what we want is its content as
                // a documentFragment (for block instances)
                if (el.tagName === 'TEMPLATE') {
                    el = templateParser.parse(el)
                }
                if (options && options.template) {
                    el = transcludeTemplate(el, options)
                }
                if (el instanceof DocumentFragment) {
                    _.prepend(document.createComment('v-start'), el)
                    el.appendChild(document.createComment('v-end'))
                }
                return el
            }

            /**
             * Process the template option.
             * If the replace option is true this will swap the $el.
             *
             * @param {Element} el
             * @param {Object} options
             * @return {Element|DocumentFragment}
             */

            function transcludeTemplate (el, options) {
                var template = options.template
                var frag = templateParser.parse(template, true)
                if (!frag) {
                    _.warn('Invalid template option: ' + template)
                } else {
                    var rawContent = options._content || _.extractContent(el)
                    if (options.replace) {
                        if (frag.childNodes.length > 1) {
                            // this is a block instance which has no root node.
                            // however, the container in the parent template
                            // (which is replaced here) may contain v-with and
                            // paramAttributes that still need to be compiled
                            // for the child. we store all the container
                            // attributes on the options object and pass it down
                            // to the compiler.
                            var containerAttrs = options._containerAttrs = {}
                            var i = el.attributes.length
                            while (i--) {
                                var attr = el.attributes[i]
                                containerAttrs[attr.name] = attr.value
                            }
                            transcludeContent(frag, rawContent)
                            return frag
                        } else {
                            var replacer = frag.firstChild
                            _.copyAttributes(el, replacer)
                            transcludeContent(replacer, rawContent)
                            return replacer
                        }
                    } else {
                        el.appendChild(frag)
                        transcludeContent(el, rawContent)
                        return el
                    }
                }
            }

            /**
             * Resolve <content> insertion points mimicking the behavior
             * of the Shadow DOM spec:
             *
             *   http://w3c.github.io/webcomponents/spec/shadow/#insertion-points
             *
             * @param {Element|DocumentFragment} el
             * @param {Element} raw
             */

            function transcludeContent (el, raw) {
                var outlets = getOutlets(el)
                var i = outlets.length
                if (!i) return
                var outlet, select, selected, j, main

                function isDirectChild (node) {
                    return node.parentNode === raw
                }

                // first pass, collect corresponding content
                // for each outlet.
                while (i--) {
                    outlet = outlets[i]
                    if (raw) {
                        select = outlet.getAttribute('select')
                        if (select) {  // select content
                            selected = raw.querySelectorAll(select)
                            if (selected.length) {
                                // according to Shadow DOM spec, `select` can
                                // only select direct children of the host node.
                                // enforcing this also fixes #786.
                                selected = [].filter.call(selected, isDirectChild)
                            }
                            outlet.content = selected.length
                                ? selected
                                : _.toArray(outlet.childNodes)
                        } else { // default content
                            main = outlet
                        }
                    } else { // fallback content
                        outlet.content = _.toArray(outlet.childNodes)
                    }
                }
                // second pass, actually insert the contents
                for (i = 0, j = outlets.length; i < j; i++) {
                    outlet = outlets[i]
                    if (outlet !== main) {
                        insertContentAt(outlet, outlet.content)
                    }
                }
                // finally insert the main content
                if (main) {
                    insertContentAt(main, _.toArray(raw.childNodes))
                }
            }

            /**
             * Get <content> outlets from the element/list
             *
             * @param {Element|Array} el
             * @return {Array}
             */

            var concat = [].concat
            function getOutlets (el) {
                return _.isArray(el)
                    ? concat.apply([], el.map(getOutlets))
                    : el.querySelectorAll
                    ? _.toArray(el.querySelectorAll('content'))
                    : []
            }

            /**
             * Insert an array of nodes at outlet,
             * then remove the outlet.
             *
             * @param {Element} outlet
             * @param {Array} contents
             */

            function insertContentAt (outlet, contents) {
                // not using util DOM methods here because
                // parentNode can be cached
                var parent = outlet.parentNode
                for (var i = 0, j = contents.length; i < j; i++) {
                    parent.insertBefore(contents[i], outlet)
                }
                parent.removeChild(outlet)
            }

            /**
             * Helper to extract a component container's attribute names
             * into a map, and filtering out `v-with` in the process.
             * The resulting map will be used in compiler/compile to
             * determine whether an attribute is transcluded.
             *
             * @param {NameNodeMap} attrs
             */

            function extractAttrs (attrs) {
                if (!attrs) return null
                var res = {}
                var vwith = config.prefix + 'with'
                var i = attrs.length
                while (i--) {
                    var name = attrs[i].name
                    if (name !== vwith) res[name] = true
                }
                return res
            }

            /***/ },
        /* 18 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)
            var Cache = __webpack_require__(52)
            var pathCache = new Cache(1000)
            var identRE = /^[$_a-zA-Z]+[\w$]*$/

            /**
             * Path-parsing algorithm scooped from Polymer/observe-js
             */

            var pathStateMachine = {
                'beforePath': {
                    'ws': ['beforePath'],
                    'ident': ['inIdent', 'append'],
                    '[': ['beforeElement'],
                    'eof': ['afterPath']
                },

                'inPath': {
                    'ws': ['inPath'],
                    '.': ['beforeIdent'],
                    '[': ['beforeElement'],
                    'eof': ['afterPath']
                },

                'beforeIdent': {
                    'ws': ['beforeIdent'],
                    'ident': ['inIdent', 'append']
                },

                'inIdent': {
                    'ident': ['inIdent', 'append'],
                    '0': ['inIdent', 'append'],
                    'number': ['inIdent', 'append'],
                    'ws': ['inPath', 'push'],
                    '.': ['beforeIdent', 'push'],
                    '[': ['beforeElement', 'push'],
                    'eof': ['afterPath', 'push']
                },

                'beforeElement': {
                    'ws': ['beforeElement'],
                    '0': ['afterZero', 'append'],
                    'number': ['inIndex', 'append'],
                    "'": ['inSingleQuote', 'append', ''],
                    '"': ['inDoubleQuote', 'append', '']
                },

                'afterZero': {
                    'ws': ['afterElement', 'push'],
                    ']': ['inPath', 'push']
                },

                'inIndex': {
                    '0': ['inIndex', 'append'],
                    'number': ['inIndex', 'append'],
                    'ws': ['afterElement'],
                    ']': ['inPath', 'push']
                },

                'inSingleQuote': {
                    "'": ['afterElement'],
                    'eof': 'error',
                    'else': ['inSingleQuote', 'append']
                },

                'inDoubleQuote': {
                    '"': ['afterElement'],
                    'eof': 'error',
                    'else': ['inDoubleQuote', 'append']
                },

                'afterElement': {
                    'ws': ['afterElement'],
                    ']': ['inPath', 'push']
                }
            }

            function noop () {}

            /**
             * Determine the type of a character in a keypath.
             *
             * @param {Char} char
             * @return {String} type
             */

            function getPathCharType (char) {
                if (char === undefined) {
                    return 'eof'
                }

                var code = char.charCodeAt(0)

                switch(code) {
                    case 0x5B: // [
                    case 0x5D: // ]
                    case 0x2E: // .
                    case 0x22: // "
                    case 0x27: // '
                    case 0x30: // 0
                        return char

                    case 0x5F: // _
                    case 0x24: // $
                        return 'ident'

                    case 0x20: // Space
                    case 0x09: // Tab
                    case 0x0A: // Newline
                    case 0x0D: // Return
                    case 0xA0:  // No-break space
                    case 0xFEFF:  // Byte Order Mark
                    case 0x2028:  // Line Separator
                    case 0x2029:  // Paragraph Separator
                        return 'ws'
                }

                // a-z, A-Z
                if ((0x61 <= code && code <= 0x7A) ||
                    (0x41 <= code && code <= 0x5A)) {
                    return 'ident'
                }

                // 1-9
                if (0x31 <= code && code <= 0x39) {
                    return 'number'
                }

                return 'else'
            }

            /**
             * Parse a string path into an array of segments
             * Todo implement cache
             *
             * @param {String} path
             * @return {Array|undefined}
             */

            function parsePath (path) {
                var keys = []
                var index = -1
                var mode = 'beforePath'
                var c, newChar, key, type, transition, action, typeMap

                var actions = {
                    push: function() {
                        if (key === undefined) {
                            return
                        }
                        keys.push(key)
                        key = undefined
                    },
                    append: function() {
                        if (key === undefined) {
                            key = newChar
                        } else {
                            key += newChar
                        }
                    }
                }

                function maybeUnescapeQuote () {
                    var nextChar = path[index + 1]
                    if ((mode === 'inSingleQuote' && nextChar === "'") ||
                        (mode === 'inDoubleQuote' && nextChar === '"')) {
                        index++
                        newChar = nextChar
                        actions.append()
                        return true
                    }
                }

                while (mode) {
                    index++
                    c = path[index]

                    if (c === '\\' && maybeUnescapeQuote()) {
                        continue
                    }

                    type = getPathCharType(c)
                    typeMap = pathStateMachine[mode]
                    transition = typeMap[type] || typeMap['else'] || 'error'

                    if (transition === 'error') {
                        return // parse error
                    }

                    mode = transition[0]
                    action = actions[transition[1]] || noop
                    newChar = transition[2] === undefined
                        ? c
                        : transition[2]
                    action()

                    if (mode === 'afterPath') {
                        return keys
                    }
                }
            }

            /**
             * Format a accessor segment based on its type.
             *
             * @param {String} key
             * @return {Boolean}
             */

            function formatAccessor(key) {
                if (identRE.test(key)) { // identifier
                    return '.' + key
                } else if (+key === key >>> 0) { // bracket index
                    return '[' + key + ']'
                } else { // bracket string
                    return '["' + key.replace(/"/g, '\\"') + '"]'
                }
            }

            /**
             * Compiles a getter function with a fixed path.
             *
             * @param {Array} path
             * @return {Function}
             */

            exports.compileGetter = function (path) {
                var body = 'return o' + path.map(formatAccessor).join('')
                return new Function('o', body)
            }

            /**
             * External parse that check for a cache hit first
             *
             * @param {String} path
             * @return {Array|undefined}
             */

            exports.parse = function (path) {
                var hit = pathCache.get(path)
                if (!hit) {
                    hit = parsePath(path)
                    if (hit) {
                        hit.get = exports.compileGetter(hit)
                        pathCache.put(path, hit)
                    }
                }
                return hit
            }

            /**
             * Get from an object from a path string
             *
             * @param {Object} obj
             * @param {String} path
             */

            exports.get = function (obj, path) {
                path = exports.parse(path)
                if (path) {
                    return path.get(obj)
                }
            }

            /**
             * Set on an object from a path
             *
             * @param {Object} obj
             * @param {String | Array} path
             * @param {*} val
             */

            exports.set = function (obj, path, val) {
                if (typeof path === 'string') {
                    path = exports.parse(path)
                }
                if (!path || !_.isObject(obj)) {
                    return false
                }
                var last, key
                for (var i = 0, l = path.length - 1; i < l; i++) {
                    last = obj
                    key = path[i]
                    obj = obj[key]
                    if (!_.isObject(obj)) {
                        obj = {}
                        last.$add(key, obj)
                    }
                }
                key = path[i]
                if (key in obj) {
                    obj[key] = val
                } else {
                    obj.$add(key, val)
                }
                return true
            }

            /***/ },
        /* 19 */
        /***/ function(module, exports, __webpack_require__) {

            var Cache = __webpack_require__(52)
            var config = __webpack_require__(15)
            var dirParser = __webpack_require__(21)
            var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g
            var cache, tagRE, htmlRE, firstChar, lastChar

            /**
             * Escape a string so it can be used in a RegExp
             * constructor.
             *
             * @param {String} str
             */

            function escapeRegex (str) {
                return str.replace(regexEscapeRE, '\\$&')
            }

            /**
             * Compile the interpolation tag regex.
             *
             * @return {RegExp}
             */

            function compileRegex () {
                config._delimitersChanged = false
                var open = config.delimiters[0]
                var close = config.delimiters[1]
                firstChar = open.charAt(0)
                lastChar = close.charAt(close.length - 1)
                var firstCharRE = escapeRegex(firstChar)
                var lastCharRE = escapeRegex(lastChar)
                var openRE = escapeRegex(open)
                var closeRE = escapeRegex(close)
                tagRE = new RegExp(
                    firstCharRE + '?' + openRE +
                    '(.+?)' +
                    closeRE + lastCharRE + '?',
                    'g'
                )
                htmlRE = new RegExp(
                    '^' + firstCharRE + openRE +
                    '.*' +
                    closeRE + lastCharRE + '$'
                )
                // reset cache
                cache = new Cache(1000)
            }

            /**
             * Parse a template text string into an array of tokens.
             *
             * @param {String} text
             * @return {Array<Object> | null}
             *               - {String} type
             *               - {String} value
             *               - {Boolean} [html]
             *               - {Boolean} [oneTime]
             */

            exports.parse = function (text) {
                if (config._delimitersChanged) {
                    compileRegex()
                }
                var hit = cache.get(text)
                if (hit) {
                    return hit
                }
                if (!tagRE.test(text)) {
                    return null
                }
                var tokens = []
                var lastIndex = tagRE.lastIndex = 0
                var match, index, value, first, oneTime, partial
                /* jshint boss:true */
                while (match = tagRE.exec(text)) {
                    index = match.index
                    // push text token
                    if (index > lastIndex) {
                        tokens.push({
                            value: text.slice(lastIndex, index)
                        })
                    }
                    // tag token
                    first = match[1].charCodeAt(0)
                    oneTime = first === 0x2A // *
                    partial = first === 0x3E // >
                    value = (oneTime || partial)
                        ? match[1].slice(1)
                        : match[1]
                    tokens.push({
                        tag: true,
                        value: value.trim(),
                        html: htmlRE.test(match[0]),
                        oneTime: oneTime,
                        partial: partial
                    })
                    lastIndex = index + match[0].length
                }
                if (lastIndex < text.length) {
                    tokens.push({
                        value: text.slice(lastIndex)
                    })
                }
                cache.put(text, tokens)
                return tokens
            }

            /**
             * Format a list of tokens into an expression.
             * e.g. tokens parsed from 'a {{b}} c' can be serialized
             * into one single expression as '"a " + b + " c"'.
             *
             * @param {Array} tokens
             * @param {Vue} [vm]
             * @return {String}
             */

            exports.tokensToExp = function (tokens, vm) {
                return tokens.length > 1
                    ? tokens.map(function (token) {
                    return formatToken(token, vm)
                }).join('+')
                    : formatToken(tokens[0], vm, true)
            }

            /**
             * Format a single token.
             *
             * @param {Object} token
             * @param {Vue} [vm]
             * @param {Boolean} single
             * @return {String}
             */

            function formatToken (token, vm, single) {
                return token.tag
                    ? vm && token.oneTime
                    ? '"' + vm.$eval(token.value) + '"'
                    : single
                    ? token.value
                    : inlineFilters(token.value)
                    : '"' + token.value + '"'
            }

            /**
             * For an attribute with multiple interpolation tags,
             * e.g. attr="some-{{thing | filter}}", in order to combine
             * the whole thing into a single watchable expression, we
             * have to inline those filters. This function does exactly
             * that. This is a bit hacky but it avoids heavy changes
             * to directive parser and watcher mechanism.
             *
             * @param {String} exp
             * @return {String}
             */

            var filterRE = /[^|]\|[^|]/
            function inlineFilters (exp) {
                if (!filterRE.test(exp)) {
                    return '(' + exp + ')'
                } else {
                    var dir = dirParser.parse(exp)[0]
                    if (!dir.filters) {
                        return '(' + exp + ')'
                    } else {
                        exp = dir.expression
                        for (var i = 0, l = dir.filters.length; i < l; i++) {
                            var filter = dir.filters[i]
                            var args = filter.args
                                ? ',"' + filter.args.join('","') + '"'
                                : ''
                            filter = 'this.$options.filters["' + filter.name + '"]'
                            exp = '(' + filter + '.read||' + filter + ')' +
                            '.apply(this,[' + exp + args + '])'
                        }
                        return exp
                    }
                }
            }

            /***/ },
        /* 20 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)
            var Cache = __webpack_require__(52)
            var templateCache = new Cache(1000)
            var idSelectorCache = new Cache(1000)

            var map = {
                _default : [0, '', ''],
                legend   : [1, '<fieldset>', '</fieldset>'],
                tr       : [2, '<table><tbody>', '</tbody></table>'],
                col      : [
                    2,
                    '<table><tbody></tbody><colgroup>',
                    '</colgroup></table>'
                ]
            }

            map.td =
                map.th = [
                    3,
                    '<table><tbody><tr>',
                    '</tr></tbody></table>'
                ]

            map.option =
                map.optgroup = [
                    1,
                    '<select multiple="multiple">',
                    '</select>'
                ]

            map.thead =
                map.tbody =
                    map.colgroup =
                        map.caption =
                            map.tfoot = [1, '<table>', '</table>']

            map.g =
                map.defs =
                    map.symbol =
                        map.use =
                            map.image =
                                map.text =
                                    map.circle =
                                        map.ellipse =
                                            map.line =
                                                map.path =
                                                    map.polygon =
                                                        map.polyline =
                                                            map.rect = [
                                                                1,
                                                                '<svg ' +
                                                                'xmlns="http://www.w3.org/2000/svg" ' +
                                                                'xmlns:xlink="http://www.w3.org/1999/xlink" ' +
                                                                'xmlns:ev="http://www.w3.org/2001/xml-events"' +
                                                                'version="1.1">',
                                                                '</svg>'
                                                            ]

            var tagRE = /<([\w:]+)/
            var entityRE = /&\w+;/

            /**
             * Convert a string template to a DocumentFragment.
             * Determines correct wrapping by tag types. Wrapping
             * strategy found in jQuery & component/domify.
             *
             * @param {String} templateString
             * @return {DocumentFragment}
             */

            function stringToFragment (templateString) {
                // try a cache hit first
                var hit = templateCache.get(templateString)
                if (hit) {
                    return hit
                }

                var frag = document.createDocumentFragment()
                var tagMatch = templateString.match(tagRE)
                var entityMatch = entityRE.test(templateString)

                if (!tagMatch && !entityMatch) {
                    // text only, return a single text node.
                    frag.appendChild(
                        document.createTextNode(templateString)
                    )
                } else {

                    var tag    = tagMatch && tagMatch[1]
                    var wrap   = map[tag] || map._default
                    var depth  = wrap[0]
                    var prefix = wrap[1]
                    var suffix = wrap[2]
                    var node   = document.createElement('div')

                    node.innerHTML = prefix + templateString.trim() + suffix
                    while (depth--) {
                        node = node.lastChild
                    }

                    var child
                    /* jshint boss:true */
                    while (child = node.firstChild) {
                        frag.appendChild(child)
                    }
                }

                templateCache.put(templateString, frag)
                return frag
            }

            /**
             * Convert a template node to a DocumentFragment.
             *
             * @param {Node} node
             * @return {DocumentFragment}
             */

            function nodeToFragment (node) {
                var tag = node.tagName
                // if its a template tag and the browser supports it,
                // its content is already a document fragment.
                if (
                    tag === 'TEMPLATE' &&
                    node.content instanceof DocumentFragment
                ) {
                    return node.content
                }
                // script template
                if (tag === 'SCRIPT') {
                    return stringToFragment(node.textContent)
                }
                // normal node, clone it to avoid mutating the original
                var clone = exports.clone(node)
                var frag = document.createDocumentFragment()
                var child
                /* jshint boss:true */
                while (child = clone.firstChild) {
                    frag.appendChild(child)
                }
                return frag
            }

            // Test for the presence of the Safari template cloning bug
            // https://bugs.webkit.org/show_bug.cgi?id=137755
            var hasBrokenTemplate = _.inBrowser
                ? (function () {
                var a = document.createElement('div')
                a.innerHTML = '<template>1</template>'
                return !a.cloneNode(true).firstChild.innerHTML
            })()
                : false

            // Test for IE10/11 textarea placeholder clone bug
            var hasTextareaCloneBug = _.inBrowser
                ? (function () {
                var t = document.createElement('textarea')
                t.placeholder = 't'
                return t.cloneNode(true).value === 't'
            })()
                : false

            /**
             * 1. Deal with Safari cloning nested <template> bug by
             *    manually cloning all template instances.
             * 2. Deal with IE10/11 textarea placeholder bug by setting
             *    the correct value after cloning.
             *
             * @param {Element|DocumentFragment} node
             * @return {Element|DocumentFragment}
             */

            exports.clone = function (node) {
                var res = node.cloneNode(true)
                var i, original, cloned
                /* istanbul ignore if */
                if (hasBrokenTemplate) {
                    original = node.querySelectorAll('template')
                    if (original.length) {
                        cloned = res.querySelectorAll('template')
                        i = cloned.length
                        while (i--) {
                            cloned[i].parentNode.replaceChild(
                                original[i].cloneNode(true),
                                cloned[i]
                            )
                        }
                    }
                }
                /* istanbul ignore if */
                if (hasTextareaCloneBug) {
                    if (node.tagName === 'TEXTAREA') {
                        res.value = node.value
                    } else {
                        original = node.querySelectorAll('textarea')
                        if (original.length) {
                            cloned = res.querySelectorAll('textarea')
                            i = cloned.length
                            while (i--) {
                                cloned[i].value = original[i].value
                            }
                        }
                    }
                }
                return res
            }

            /**
             * Process the template option and normalizes it into a
             * a DocumentFragment that can be used as a partial or a
             * instance template.
             *
             * @param {*} template
             *    Possible values include:
             *    - DocumentFragment object
             *    - Node object of type Template
             *    - id selector: '#some-template-id'
             *    - template string: '<div><span>{{msg}}</span></div>'
             * @param {Boolean} clone
             * @param {Boolean} noSelector
             * @return {DocumentFragment|undefined}
             */

            exports.parse = function (template, clone, noSelector) {
                var node, frag

                // if the template is already a document fragment,
                // do nothing
                if (template instanceof DocumentFragment) {
                    return clone
                        ? template.cloneNode(true)
                        : template
                }

                if (typeof template === 'string') {
                    // id selector
                    if (!noSelector && template.charAt(0) === '#') {
                        // id selector can be cached too
                        frag = idSelectorCache.get(template)
                        if (!frag) {
                            node = document.getElementById(template.slice(1))
                            if (node) {
                                frag = nodeToFragment(node)
                                // save selector to cache
                                idSelectorCache.put(template, frag)
                            }
                        }
                    } else {
                        // normal string template
                        frag = stringToFragment(template)
                    }
                } else if (template.nodeType) {
                    // a direct node
                    frag = nodeToFragment(template)
                }

                return frag && clone
                    ? exports.clone(frag)
                    : frag
            }

            /***/ },
        /* 21 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)
            var Cache = __webpack_require__(52)
            var cache = new Cache(1000)
            var argRE = /^[^\{\?]+$|^'[^']*'$|^"[^"]*"$/
            var filterTokenRE = /[^\s'"]+|'[^']+'|"[^"]+"/g

            /**
             * Parser state
             */

            var str
            var c, i, l
            var inSingle
            var inDouble
            var curly
            var square
            var paren
            var begin
            var argIndex
            var dirs
            var dir
            var lastFilterIndex
            var arg

            /**
             * Push a directive object into the result Array
             */

            function pushDir () {
                dir.raw = str.slice(begin, i).trim()
                if (dir.expression === undefined) {
                    dir.expression = str.slice(argIndex, i).trim()
                } else if (lastFilterIndex !== begin) {
                    pushFilter()
                }
                if (i === 0 || dir.expression) {
                    dirs.push(dir)
                }
            }

            /**
             * Push a filter to the current directive object
             */

            function pushFilter () {
                var exp = str.slice(lastFilterIndex, i).trim()
                var filter
                if (exp) {
                    filter = {}
                    var tokens = exp.match(filterTokenRE)
                    filter.name = tokens[0]
                    filter.args = tokens.length > 1 ? tokens.slice(1) : null
                }
                if (filter) {
                    (dir.filters = dir.filters || []).push(filter)
                }
                lastFilterIndex = i + 1
            }

            /**
             * Parse a directive string into an Array of AST-like
             * objects representing directives.
             *
             * Example:
             *
             * "click: a = a + 1 | uppercase" will yield:
             * {
	 *   arg: 'click',
	 *   expression: 'a = a + 1',
	 *   filters: [
	 *     { name: 'uppercase', args: null }
	 *   ]
	 * }
             *
             * @param {String} str
             * @return {Array<Object>}
             */

            exports.parse = function (s) {

                var hit = cache.get(s)
                if (hit) {
                    return hit
                }

                // reset parser state
                str = s
                inSingle = inDouble = false
                curly = square = paren = begin = argIndex = 0
                lastFilterIndex = 0
                dirs = []
                dir = {}
                arg = null

                for (i = 0, l = str.length; i < l; i++) {
                    c = str.charCodeAt(i)
                    if (inSingle) {
                        // check single quote
                        if (c === 0x27) inSingle = !inSingle
                    } else if (inDouble) {
                        // check double quote
                        if (c === 0x22) inDouble = !inDouble
                    } else if (
                        c === 0x2C && // comma
                        !paren && !curly && !square
                    ) {
                        // reached the end of a directive
                        pushDir()
                        // reset & skip the comma
                        dir = {}
                        begin = argIndex = lastFilterIndex = i + 1
                    } else if (
                        c === 0x3A && // colon
                        !dir.expression &&
                        !dir.arg
                    ) {
                        // argument
                        arg = str.slice(begin, i).trim()
                        // test for valid argument here
                        // since we may have caught stuff like first half of
                        // an object literal or a ternary expression.
                        if (argRE.test(arg)) {
                            argIndex = i + 1
                            dir.arg = _.stripQuotes(arg) || arg
                        }
                    } else if (
                        c === 0x7C && // pipe
                        str.charCodeAt(i + 1) !== 0x7C &&
                        str.charCodeAt(i - 1) !== 0x7C
                    ) {
                        if (dir.expression === undefined) {
                            // first filter, end of expression
                            lastFilterIndex = i + 1
                            dir.expression = str.slice(argIndex, i).trim()
                        } else {
                            // already has filter
                            pushFilter()
                        }
                    } else {
                        switch (c) {
                            case 0x22: inDouble = true; break // "
                            case 0x27: inSingle = true; break // '
                            case 0x28: paren++; break         // (
                            case 0x29: paren--; break         // )
                            case 0x5B: square++; break        // [
                            case 0x5D: square--; break        // ]
                            case 0x7B: curly++; break         // {
                            case 0x7D: curly--; break         // }
                        }
                    }
                }

                if (i === 0 || begin !== i) {
                    pushDir()
                }

                cache.put(s, dirs)
                return dirs
            }

            /***/ },
        /* 22 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)
            var Path = __webpack_require__(18)
            var Cache = __webpack_require__(52)
            var expressionCache = new Cache(1000)

            var allowedKeywords =
                'Math,Date,this,true,false,null,undefined,Infinity,NaN,' +
                'isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,' +
                'encodeURIComponent,parseInt,parseFloat'
            var allowedKeywordsRE =
                new RegExp('^(' + allowedKeywords.replace(/,/g, '\\b|') + '\\b)')

            // keywords that don't make sense inside expressions
            var improperKeywords =
                'break,case,class,catch,const,continue,debugger,default,' +
                'delete,do,else,export,extends,finally,for,function,if,' +
                'import,in,instanceof,let,return,super,switch,throw,try,' +
                'var,while,with,yield,enum,await,implements,package,' +
                'proctected,static,interface,private,public'
            var improperKeywordsRE =
                new RegExp('^(' + improperKeywords.replace(/,/g, '\\b|') + '\\b)')

            var wsRE = /\s/g
            var newlineRE = /\n/g
            var saveRE = /[\{,]\s*[\w\$_]+\s*:|('[^']*'|"[^"]*")|new |typeof |void /g
            var restoreRE = /"(\d+)"/g
            var pathTestRE = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\])*$/
            var pathReplaceRE = /[^\w$\.]([A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\])*)/g
            var booleanLiteralRE = /^(true|false)$/

            /**
             * Save / Rewrite / Restore
             *
             * When rewriting paths found in an expression, it is
             * possible for the same letter sequences to be found in
             * strings and Object literal property keys. Therefore we
             * remove and store these parts in a temporary array, and
             * restore them after the path rewrite.
             */

            var saved = []

            /**
             * Save replacer
             *
             * The save regex can match two possible cases:
             * 1. An opening object literal
             * 2. A string
             * If matched as a plain string, we need to escape its
             * newlines, since the string needs to be preserved when
             * generating the function body.
             *
             * @param {String} str
             * @param {String} isString - str if matched as a string
             * @return {String} - placeholder with index
             */

            function save (str, isString) {
                var i = saved.length
                saved[i] = isString
                    ? str.replace(newlineRE, '\\n')
                    : str
                return '"' + i + '"'
            }

            /**
             * Path rewrite replacer
             *
             * @param {String} raw
             * @return {String}
             */

            function rewrite (raw) {
                var c = raw.charAt(0)
                var path = raw.slice(1)
                if (allowedKeywordsRE.test(path)) {
                    return raw
                } else {
                    path = path.indexOf('"') > -1
                        ? path.replace(restoreRE, restore)
                        : path
                    return c + 'scope.' + path
                }
            }

            /**
             * Restore replacer
             *
             * @param {String} str
             * @param {String} i - matched save index
             * @return {String}
             */

            function restore (str, i) {
                return saved[i]
            }

            /**
             * Rewrite an expression, prefixing all path accessors with
             * `scope.` and generate getter/setter functions.
             *
             * @param {String} exp
             * @param {Boolean} needSet
             * @return {Function}
             */

            function compileExpFns (exp, needSet) {
                if (improperKeywordsRE.test(exp)) {
                    _.warn(
                        'Avoid using reserved keywords in expression: '
                        + exp
                    )
                }
                // reset state
                saved.length = 0
                // save strings and object literal keys
                var body = exp
                    .replace(saveRE, save)
                    .replace(wsRE, '')
                // rewrite all paths
                // pad 1 space here becaue the regex matches 1 extra char
                body = (' ' + body)
                    .replace(pathReplaceRE, rewrite)
                    .replace(restoreRE, restore)
                var getter = makeGetter(body)
                if (getter) {
                    return {
                        get: getter,
                        body: body,
                        set: needSet
                            ? makeSetter(body)
                            : null
                    }
                }
            }

            /**
             * Compile getter setters for a simple path.
             *
             * @param {String} exp
             * @return {Function}
             */

            function compilePathFns (exp) {
                var getter, path
                if (exp.indexOf('[') < 0) {
                    // really simple path
                    path = exp.split('.')
                    getter = Path.compileGetter(path)
                } else {
                    // do the real parsing
                    path = Path.parse(exp)
                    getter = path.get
                }
                return {
                    get: getter,
                    // always generate setter for simple paths
                    set: function (obj, val) {
                        Path.set(obj, path, val)
                    }
                }
            }

            /**
             * Build a getter function. Requires eval.
             *
             * We isolate the try/catch so it doesn't affect the
             * optimization of the parse function when it is not called.
             *
             * @param {String} body
             * @return {Function|undefined}
             */

            function makeGetter (body) {
                try {
                    return new Function('scope', 'return ' + body + ';')
                } catch (e) {
                    _.warn(
                        'Invalid expression. ' +
                        'Generated function body: ' + body
                    )
                }
            }

            /**
             * Build a setter function.
             *
             * This is only needed in rare situations like "a[b]" where
             * a settable path requires dynamic evaluation.
             *
             * This setter function may throw error when called if the
             * expression body is not a valid left-hand expression in
             * assignment.
             *
             * @param {String} body
             * @return {Function|undefined}
             */

            function makeSetter (body) {
                try {
                    return new Function('scope', 'value', body + '=value;')
                } catch (e) {
                    _.warn('Invalid setter function body: ' + body)
                }
            }

            /**
             * Check for setter existence on a cache hit.
             *
             * @param {Function} hit
             */

            function checkSetter (hit) {
                if (!hit.set) {
                    hit.set = makeSetter(hit.body)
                }
            }

            /**
             * Parse an expression into re-written getter/setters.
             *
             * @param {String} exp
             * @param {Boolean} needSet
             * @return {Function}
             */

            exports.parse = function (exp, needSet) {
                exp = exp.trim()
                // try cache
                var hit = expressionCache.get(exp)
                if (hit) {
                    if (needSet) {
                        checkSetter(hit)
                    }
                    return hit
                }
                // we do a simple path check to optimize for them.
                // the check fails valid paths with unusal whitespaces,
                // but that's too rare and we don't care.
                // also skip boolean literals and paths that start with
                // global "Math"
                var res =
                    pathTestRE.test(exp) &&
                        // don't treat true/false as paths
                    !booleanLiteralRE.test(exp) &&
                        // Math constants e.g. Math.PI, Math.E etc.
                    exp.slice(0, 5) !== 'Math.'
                        ? compilePathFns(exp)
                        : compileExpFns(exp, needSet)
                expressionCache.put(exp, res)
                return res
            }

            // Export the pathRegex for external use
            exports.pathTestRE = pathTestRE

            /***/ },
        /* 23 */
        /***/ function(module, exports, __webpack_require__) {

            var uid = 0
            var _ = __webpack_require__(11)

            /**
             * A dep is an observable that can have multiple
             * directives subscribing to it.
             *
             * @constructor
             */

            function Dep () {
                this.id = ++uid
                this.subs = []
            }

            var p = Dep.prototype

            /**
             * Add a directive subscriber.
             *
             * @param {Directive} sub
             */

            p.addSub = function (sub) {
                this.subs.push(sub)
            }

            /**
             * Remove a directive subscriber.
             *
             * @param {Directive} sub
             */

            p.removeSub = function (sub) {
                if (this.subs.length) {
                    var i = this.subs.indexOf(sub)
                    if (i > -1) this.subs.splice(i, 1)
                }
            }

            /**
             * Notify all subscribers of a new value.
             */

            p.notify = function () {
                // stablize the subscriber list first
                var subs = _.toArray(this.subs)
                for (var i = 0, l = subs.length; i < l; i++) {
                    subs[i].update()
                }
            }

            module.exports = Dep

            /***/ },
        /* 24 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)
            var config = __webpack_require__(15)
            var Watcher = __webpack_require__(25)
            var textParser = __webpack_require__(19)
            var expParser = __webpack_require__(22)

            /**
             * A directive links a DOM element with a piece of data,
             * which is the result of evaluating an expression.
             * It registers a watcher with the expression and calls
             * the DOM update function when a change is triggered.
             *
             * @param {String} name
             * @param {Node} el
             * @param {Vue} vm
             * @param {Object} descriptor
             *                 - {String} expression
             *                 - {String} [arg]
             *                 - {Array<Object>} [filters]
             * @param {Object} def - directive definition object
             * @param {Vue|undefined} host - transclusion host target
             * @constructor
             */

            function Directive (name, el, vm, descriptor, def, host) {
                // public
                this.name = name
                this.el = el
                this.vm = vm
                // copy descriptor props
                this.raw = descriptor.raw
                this.expression = descriptor.expression
                this.arg = descriptor.arg
                this.filters = _.resolveFilters(vm, descriptor.filters)
                // private
                this._host = host
                this._locked = false
                this._bound = false
                // init
                this._bind(def)
            }

            var p = Directive.prototype

            /**
             * Initialize the directive, mixin definition properties,
             * setup the watcher, call definition bind() and update()
             * if present.
             *
             * @param {Object} def
             */

            p._bind = function (def) {
                if (this.name !== 'cloak' && this.el && this.el.removeAttribute) {
                    this.el.removeAttribute(config.prefix + this.name)
                }
                if (typeof def === 'function') {
                    this.update = def
                } else {
                    _.extend(this, def)
                }
                this._watcherExp = this.expression
                this._checkDynamicLiteral()
                if (this.bind) {
                    this.bind()
                }
                if (this._watcherExp &&
                    (this.update || this.twoWay) &&
                    (!this.isLiteral || this._isDynamicLiteral) &&
                    !this._checkStatement()) {
                    // wrapped updater for context
                    var dir = this
                    var update = this._update = this.update
                        ? function (val, oldVal) {
                        if (!dir._locked) {
                            dir.update(val, oldVal)
                        }
                    }
                        : function () {} // noop if no update is provided
                    // use raw expression as identifier because filters
                    // make them different watchers
                    var watcher = this.vm._watchers[this.raw]
                    // v-repeat always creates a new watcher because it has
                    // a special filter that's bound to its directive
                    // instance.
                    if (!watcher || this.name === 'repeat') {
                        watcher = this.vm._watchers[this.raw] = new Watcher(
                            this.vm,
                            this._watcherExp,
                            update, // callback
                            {
                                filters: this.filters,
                                twoWay: this.twoWay,
                                deep: this.deep
                            }
                        )
                    } else {
                        watcher.addCb(update)
                    }
                    this._watcher = watcher
                    if (this._initValue != null) {
                        watcher.set(this._initValue)
                    } else if (this.update) {
                        this.update(watcher.value)
                    }
                }
                this._bound = true
            }

            /**
             * check if this is a dynamic literal binding.
             *
             * e.g. v-component="{{currentView}}"
             */

            p._checkDynamicLiteral = function () {
                var expression = this.expression
                if (expression && this.isLiteral) {
                    var tokens = textParser.parse(expression)
                    if (tokens) {
                        var exp = textParser.tokensToExp(tokens)
                        this.expression = this.vm.$get(exp)
                        this._watcherExp = exp
                        this._isDynamicLiteral = true
                    }
                }
            }

            /**
             * Check if the directive is a function caller
             * and if the expression is a callable one. If both true,
             * we wrap up the expression and use it as the event
             * handler.
             *
             * e.g. v-on="click: a++"
             *
             * @return {Boolean}
             */

            p._checkStatement = function () {
                var expression = this.expression
                if (
                    expression && this.acceptStatement &&
                    !expParser.pathTestRE.test(expression)
                ) {
                    var fn = expParser.parse(expression).get
                    var vm = this.vm
                    var handler = function () {
                        fn.call(vm, vm)
                    }
                    if (this.filters) {
                        handler = _.applyFilters(
                            handler,
                            this.filters.read,
                            vm
                        )
                    }
                    this.update(handler)
                    return true
                }
            }

            /**
             * Check for an attribute directive param, e.g. lazy
             *
             * @param {String} name
             * @return {String}
             */

            p._checkParam = function (name) {
                var param = this.el.getAttribute(name)
                if (param !== null) {
                    this.el.removeAttribute(name)
                }
                return param
            }

            /**
             * Teardown the watcher and call unbind.
             */

            p._teardown = function () {
                if (this._bound) {
                    if (this.unbind) {
                        this.unbind()
                    }
                    var watcher = this._watcher
                    if (watcher && watcher.active) {
                        watcher.removeCb(this._update)
                        if (!watcher.active) {
                            this.vm._watchers[this.raw] = null
                        }
                    }
                    this._bound = false
                    this.vm = this.el = this._watcher = null
                }
            }

            /**
             * Set the corresponding value with the setter.
             * This should only be used in two-way directives
             * e.g. v-model.
             *
             * @param {*} value
             * @param {Boolean} lock - prevent wrtie triggering update.
             * @public
             */

            p.set = function (value, lock) {
                if (this.twoWay) {
                    if (lock) {
                        this._locked = true
                    }
                    this._watcher.set(value)
                    if (lock) {
                        var self = this
                        _.nextTick(function () {
                            self._locked = false
                        })
                    }
                }
            }

            module.exports = Directive

            /***/ },
        /* 25 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)
            var config = __webpack_require__(15)
            var Observer = __webpack_require__(49)
            var expParser = __webpack_require__(22)
            var batcher = __webpack_require__(53)
            var uid = 0

            /**
             * A watcher parses an expression, collects dependencies,
             * and fires callback when the expression value changes.
             * This is used for both the $watch() api and directives.
             *
             * @param {Vue} vm
             * @param {String} expression
             * @param {Function} cb
             * @param {Object} options
             *                 - {Array} filters
             *                 - {Boolean} twoWay
             *                 - {Boolean} deep
             *                 - {Boolean} user
             * @constructor
             */

            function Watcher (vm, expression, cb, options) {
                this.vm = vm
                vm._watcherList.push(this)
                this.expression = expression
                this.cbs = [cb]
                this.id = ++uid // uid for batching
                this.active = true
                options = options || {}
                this.deep = !!options.deep
                this.user = !!options.user
                this.deps = Object.create(null)
                // setup filters if any.
                // We delegate directive filters here to the watcher
                // because they need to be included in the dependency
                // collection process.
                if (options.filters) {
                    this.readFilters = options.filters.read
                    this.writeFilters = options.filters.write
                }
                // parse expression for getter/setter
                var res = expParser.parse(expression, options.twoWay)
                this.getter = res.get
                this.setter = res.set
                this.value = this.get()
            }

            var p = Watcher.prototype

            /**
             * Add a dependency to this directive.
             *
             * @param {Dep} dep
             */

            p.addDep = function (dep) {
                var id = dep.id
                if (!this.newDeps[id]) {
                    this.newDeps[id] = dep
                    if (!this.deps[id]) {
                        this.deps[id] = dep
                        dep.addSub(this)
                    }
                }
            }

            /**
             * Evaluate the getter, and re-collect dependencies.
             */

            p.get = function () {
                this.beforeGet()
                var vm = this.vm
                var value
                try {
                    value = this.getter.call(vm, vm)
                } catch (e) {
                    if (config.warnExpressionErrors) {
                        _.warn(
                            'Error when evaluating expression "' +
                            this.expression + '":\n   ' + e
                        )
                    }
                }
                // "touch" every property so they are all tracked as
                // dependencies for deep watching
                if (this.deep) {
                    traverse(value)
                }
                value = _.applyFilters(value, this.readFilters, vm)
                this.afterGet()
                return value
            }

            /**
             * Set the corresponding value with the setter.
             *
             * @param {*} value
             */

            p.set = function (value) {
                var vm = this.vm
                value = _.applyFilters(
                    value, this.writeFilters, vm, this.value
                )
                try {
                    this.setter.call(vm, vm, value)
                } catch (e) {
                    if (config.warnExpressionErrors) {
                        _.warn(
                            'Error when evaluating setter "' +
                            this.expression + '":\n   ' + e
                        )
                    }
                }
            }

            /**
             * Prepare for dependency collection.
             */

            p.beforeGet = function () {
                Observer.target = this
                this.newDeps = {}
            }

            /**
             * Clean up for dependency collection.
             */

            p.afterGet = function () {
                Observer.target = null
                for (var id in this.deps) {
                    if (!this.newDeps[id]) {
                        this.deps[id].removeSub(this)
                    }
                }
                this.deps = this.newDeps
            }

            /**
             * Subscriber interface.
             * Will be called when a dependency changes.
             */

            p.update = function () {
                if (!config.async || config.debug) {
                    this.run()
                } else {
                    batcher.push(this)
                }
            }

            /**
             * Batcher job interface.
             * Will be called by the batcher.
             */

            p.run = function () {
                if (this.active) {
                    var value = this.get()
                    if (
                        value !== this.value ||
                        Array.isArray(value) ||
                        this.deep
                    ) {
                        var oldValue = this.value
                        this.value = value
                        var cbs = this.cbs
                        for (var i = 0, l = cbs.length; i < l; i++) {
                            cbs[i](value, oldValue)
                            // if a callback also removed other callbacks,
                            // we need to adjust the loop accordingly.
                            var removed = l - cbs.length
                            if (removed) {
                                i -= removed
                                l -= removed
                            }
                        }
                    }
                }
            }

            /**
             * Add a callback.
             *
             * @param {Function} cb
             */

            p.addCb = function (cb) {
                this.cbs.push(cb)
            }

            /**
             * Remove a callback.
             *
             * @param {Function} cb
             */

            p.removeCb = function (cb) {
                var cbs = this.cbs
                if (cbs.length > 1) {
                    var i = cbs.indexOf(cb)
                    if (i > -1) {
                        cbs.splice(i, 1)
                    }
                } else if (cb === cbs[0]) {
                    this.teardown()
                }
            }

            /**
             * Remove self from all dependencies' subcriber list.
             */

            p.teardown = function () {
                if (this.active) {
                    // remove self from vm's watcher list
                    // we can skip this if the vm if being destroyed
                    // which can improve teardown performance.
                    if (!this.vm._isBeingDestroyed) {
                        var list = this.vm._watcherList
                        var i = list.indexOf(this)
                        if (i > -1) {
                            list.splice(i, 1)
                        }
                    }
                    for (var id in this.deps) {
                        this.deps[id].removeSub(this)
                    }
                    this.active = false
                    this.vm = this.cbs = this.value = null
                }
            }


            /**
             * Recrusively traverse an object to evoke all converted
             * getters, so that every nested property inside the object
             * is collected as a "deep" dependency.
             *
             * @param {Object} obj
             */

            function traverse (obj) {
                var key, val, i
                for (key in obj) {
                    val = obj[key]
                    if (_.isArray(val)) {
                        i = val.length
                        while (i--) traverse(val[i])
                    } else if (_.isObject(val)) {
                        traverse(val)
                    }
                }
            }

            module.exports = Watcher

            /***/ },
        /* 26 */
        /***/ function(module, exports, __webpack_require__) {

            /**
             * Check is a string starts with $ or _
             *
             * @param {String} str
             * @return {Boolean}
             */

            exports.isReserved = function (str) {
                var c = (str + '').charCodeAt(0)
                return c === 0x24 || c === 0x5F
            }

            /**
             * Guard text output, make sure undefined outputs
             * empty string
             *
             * @param {*} value
             * @return {String}
             */

            exports.toString = function (value) {
                return value == null
                    ? ''
                    : value.toString()
            }

            /**
             * Check and convert possible numeric numbers before
             * setting back to data
             *
             * @param {*} value
             * @return {*|Number}
             */

            exports.toNumber = function (value) {
                return (
                isNaN(value) ||
                value === null ||
                typeof value === 'boolean'
                ) ? value
                    : Number(value)
            }

            /**
             * Strip quotes from a string
             *
             * @param {String} str
             * @return {String | false}
             */

            exports.stripQuotes = function (str) {
                var a = str.charCodeAt(0)
                var b = str.charCodeAt(str.length - 1)
                return a === b && (a === 0x22 || a === 0x27)
                    ? str.slice(1, -1)
                    : false
            }

            /**
             * Replace helper
             *
             * @param {String} _ - matched delimiter
             * @param {String} c - matched char
             * @return {String}
             */
            function toUpper (_, c) {
                return c ? c.toUpperCase () : ''
            }

            /**
             * Camelize a hyphen-delmited string.
             *
             * @param {String} str
             * @return {String}
             */

            var camelRE = /-(\w)/g
            exports.camelize = function (str) {
                return str.replace(camelRE, toUpper)
            }

            /**
             * Converts hyphen/underscore/slash delimitered names into
             * camelized classNames.
             *
             * e.g. my-component => MyComponent
             *      some_else    => SomeElse
             *      some/comp    => SomeComp
             *
             * @param {String} str
             * @return {String}
             */

            var classifyRE = /(?:^|[-_\/])(\w)/g
            exports.classify = function (str) {
                return str.replace(classifyRE, toUpper)
            }

            /**
             * Simple bind, faster than native
             *
             * @param {Function} fn
             * @param {Object} ctx
             * @return {Function}
             */

            exports.bind = function (fn, ctx) {
                return function () {
                    return fn.apply(ctx, arguments)
                }
            }

            /**
             * Convert an Array-like object to a real Array.
             *
             * @param {Array-like} list
             * @param {Number} [start] - start index
             * @return {Array}
             */

            exports.toArray = function (list, start) {
                start = start || 0
                var i = list.length - start
                var ret = new Array(i)
                while (i--) {
                    ret[i] = list[i + start]
                }
                return ret
            }

            /**
             * Mix properties into target object.
             *
             * @param {Object} to
             * @param {Object} from
             */

            exports.extend = function (to, from) {
                for (var key in from) {
                    to[key] = from[key]
                }
                return to
            }

            /**
             * Quick object check - this is primarily used to tell
             * Objects from primitive values when we know the value
             * is a JSON-compliant type.
             *
             * @param {*} obj
             * @return {Boolean}
             */

            exports.isObject = function (obj) {
                return obj && typeof obj === 'object'
            }

            /**
             * Strict object type check. Only returns true
             * for plain JavaScript objects.
             *
             * @param {*} obj
             * @return {Boolean}
             */

            var toString = Object.prototype.toString
            exports.isPlainObject = function (obj) {
                return toString.call(obj) === '[object Object]'
            }

            /**
             * Array type check.
             *
             * @param {*} obj
             * @return {Boolean}
             */

            exports.isArray = function (obj) {
                return Array.isArray(obj)
            }

            /**
             * Define a non-enumerable property
             *
             * @param {Object} obj
             * @param {String} key
             * @param {*} val
             * @param {Boolean} [enumerable]
             */

            exports.define = function (obj, key, val, enumerable) {
                Object.defineProperty(obj, key, {
                    value        : val,
                    enumerable   : !!enumerable,
                    writable     : true,
                    configurable : true
                })
            }

            /**
             * Debounce a function so it only gets called after the
             * input stops arriving after the given wait period.
             *
             * @param {Function} func
             * @param {Number} wait
             * @return {Function} - the debounced function
             */

            exports.debounce = function(func, wait) {
                var timeout, args, context, timestamp, result
                var later = function() {
                    var last = Date.now() - timestamp
                    if (last < wait && last >= 0) {
                        timeout = setTimeout(later, wait - last)
                    } else {
                        timeout = null
                        result = func.apply(context, args)
                        if (!timeout) context = args = null
                    }
                }
                return function() {
                    context = this
                    args = arguments
                    timestamp = Date.now()
                    if (!timeout) {
                        timeout = setTimeout(later, wait)
                    }
                    return result
                }
            }

            /***/ },
        /* 27 */
        /***/ function(module, exports, __webpack_require__) {

            /**
             * Can we use __proto__?
             *
             * @type {Boolean}
             */

            exports.hasProto = '__proto__' in {}

            /**
             * Indicates we have a window
             *
             * @type {Boolean}
             */

            var toString = Object.prototype.toString
            var inBrowser = exports.inBrowser =
                typeof window !== 'undefined' &&
                toString.call(window) !== '[object Object]'

            /**
             * Defer a task to execute it asynchronously. Ideally this
             * should be executed as a microtask, so we leverage
             * MutationObserver if it's available, and fallback to
             * setTimeout(0).
             *
             * @param {Function} cb
             * @param {Object} ctx
             */

            exports.nextTick = (function () {
                var callbacks = []
                var pending = false
                var timerFunc
                function handle () {
                    pending = false
                    var copies = callbacks.slice(0)
                    callbacks = []
                    for (var i = 0; i < copies.length; i++) {
                        copies[i]()
                    }
                }
                /* istanbul ignore if */
                if (typeof MutationObserver !== 'undefined') {
                    var counter = 1
                    var observer = new MutationObserver(handle)
                    var textNode = document.createTextNode(counter)
                    observer.observe(textNode, {
                        characterData: true
                    })
                    timerFunc = function () {
                        counter = (counter + 1) % 2
                        textNode.data = counter
                    }
                } else {
                    timerFunc = setTimeout
                }
                return function (cb, ctx) {
                    var func = ctx
                        ? function () { cb.call(ctx) }
                        : cb
                    callbacks.push(func)
                    if (pending) return
                    pending = true
                    timerFunc(handle, 0)
                }
            })()

            /**
             * Detect if we are in IE9...
             *
             * @type {Boolean}
             */

            exports.isIE9 =
                inBrowser &&
                navigator.userAgent.indexOf('MSIE 9.0') > 0

            /**
             * Sniff transition/animation events
             */

            if (inBrowser && !exports.isIE9) {
                var isWebkitTrans =
                    window.ontransitionend === undefined &&
                    window.onwebkittransitionend !== undefined
                var isWebkitAnim =
                    window.onanimationend === undefined &&
                    window.onwebkitanimationend !== undefined
                exports.transitionProp = isWebkitTrans
                    ? 'WebkitTransition'
                    : 'transition'
                exports.transitionEndEvent = isWebkitTrans
                    ? 'webkitTransitionEnd'
                    : 'transitionend'
                exports.animationProp = isWebkitAnim
                    ? 'WebkitAnimation'
                    : 'animation'
                exports.animationEndEvent = isWebkitAnim
                    ? 'webkitAnimationEnd'
                    : 'animationend'
            }

            /***/ },
        /* 28 */
        /***/ function(module, exports, __webpack_require__) {

            var config = __webpack_require__(15)

            /**
             * Check if a node is in the document.
             * Note: document.documentElement.contains should work here
             * but always returns false for comment nodes in phantomjs,
             * making unit tests difficult. This is fixed byy doing the
             * contains() check on the node's parentNode instead of
             * the node itself.
             *
             * @param {Node} node
             * @return {Boolean}
             */

            var doc =
                typeof document !== 'undefined' &&
                document.documentElement

            exports.inDoc = function (node) {
                var parent = node && node.parentNode
                return doc === node ||
                    doc === parent ||
                    !!(parent && parent.nodeType === 1 && (doc.contains(parent)))
            }

            /**
             * Extract an attribute from a node.
             *
             * @param {Node} node
             * @param {String} attr
             */

            exports.attr = function (node, attr) {
                attr = config.prefix + attr
                var val = node.getAttribute(attr)
                if (val !== null) {
                    node.removeAttribute(attr)
                }
                return val
            }

            /**
             * Insert el before target
             *
             * @param {Element} el
             * @param {Element} target
             */

            exports.before = function (el, target) {
                target.parentNode.insertBefore(el, target)
            }

            /**
             * Insert el after target
             *
             * @param {Element} el
             * @param {Element} target
             */

            exports.after = function (el, target) {
                if (target.nextSibling) {
                    exports.before(el, target.nextSibling)
                } else {
                    target.parentNode.appendChild(el)
                }
            }

            /**
             * Remove el from DOM
             *
             * @param {Element} el
             */

            exports.remove = function (el) {
                el.parentNode.removeChild(el)
            }

            /**
             * Prepend el to target
             *
             * @param {Element} el
             * @param {Element} target
             */

            exports.prepend = function (el, target) {
                if (target.firstChild) {
                    exports.before(el, target.firstChild)
                } else {
                    target.appendChild(el)
                }
            }

            /**
             * Replace target with el
             *
             * @param {Element} target
             * @param {Element} el
             */

            exports.replace = function (target, el) {
                var parent = target.parentNode
                if (parent) {
                    parent.replaceChild(el, target)
                }
            }

            /**
             * Copy attributes from one element to another.
             *
             * @param {Element} from
             * @param {Element} to
             */

            exports.copyAttributes = function (from, to) {
                if (from.hasAttributes()) {
                    var attrs = from.attributes
                    for (var i = 0, l = attrs.length; i < l; i++) {
                        var attr = attrs[i]
                        to.setAttribute(attr.name, attr.value)
                    }
                }
            }

            /**
             * Add event listener shorthand.
             *
             * @param {Element} el
             * @param {String} event
             * @param {Function} cb
             */

            exports.on = function (el, event, cb) {
                el.addEventListener(event, cb)
            }

            /**
             * Remove event listener shorthand.
             *
             * @param {Element} el
             * @param {String} event
             * @param {Function} cb
             */

            exports.off = function (el, event, cb) {
                el.removeEventListener(event, cb)
            }

            /**
             * Add class with compatibility for IE & SVG
             *
             * @param {Element} el
             * @param {Strong} cls
             */

            exports.addClass = function (el, cls) {
                if (el.classList) {
                    el.classList.add(cls)
                } else {
                    var cur = ' ' + (el.getAttribute('class') || '') + ' '
                    if (cur.indexOf(' ' + cls + ' ') < 0) {
                        el.setAttribute('class', (cur + cls).trim())
                    }
                }
            }

            /**
             * Remove class with compatibility for IE & SVG
             *
             * @param {Element} el
             * @param {Strong} cls
             */

            exports.removeClass = function (el, cls) {
                if (el.classList) {
                    el.classList.remove(cls)
                } else {
                    var cur = ' ' + (el.getAttribute('class') || '') + ' '
                    var tar = ' ' + cls + ' '
                    while (cur.indexOf(tar) >= 0) {
                        cur = cur.replace(tar, ' ')
                    }
                    el.setAttribute('class', cur.trim())
                }
            }

            /**
             * Extract raw content inside an element into a temporary
             * container div
             *
             * @param {Element} el
             * @param {Boolean} asFragment
             * @return {Element}
             */

            exports.extractContent = function (el, asFragment) {
                var child
                var rawContent
                if (el.hasChildNodes()) {
                    rawContent = asFragment
                        ? document.createDocumentFragment()
                        : document.createElement('div')
                    /* jshint boss:true */
                    while (child = el.firstChild) {
                        rawContent.appendChild(child)
                    }
                }
                return rawContent
            }


            /***/ },
        /* 29 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(30)

            /**
             * Resolve read & write filters for a vm instance. The
             * filters descriptor Array comes from the directive parser.
             *
             * This is extracted into its own utility so it can
             * be used in multiple scenarios.
             *
             * @param {Vue} vm
             * @param {Array<Object>} filters
             * @param {Object} [target]
             * @return {Object}
             */

            exports.resolveFilters = function (vm, filters, target) {
                if (!filters) {
                    return
                }
                var res = target || {}
                // var registry = vm.$options.filters
                filters.forEach(function (f) {
                    var def = vm.$options.filters[f.name]
                    _.assertAsset(def, 'filter', f.name)
                    if (!def) return
                    var args = f.args
                    var reader, writer
                    if (typeof def === 'function') {
                        reader = def
                    } else {
                        reader = def.read
                        writer = def.write
                    }
                    if (reader) {
                        if (!res.read) res.read = []
                        res.read.push(function (value) {
                            return args
                                ? reader.apply(vm, [value].concat(args))
                                : reader.call(vm, value)
                        })
                    }
                    if (writer) {
                        if (!res.write) res.write = []
                        res.write.push(function (value, oldVal) {
                            return args
                                ? writer.apply(vm, [value, oldVal].concat(args))
                                : writer.call(vm, value, oldVal)
                        })
                    }
                })
                return res
            }

            /**
             * Apply filters to a value
             *
             * @param {*} value
             * @param {Array} filters
             * @param {Vue} vm
             * @param {*} oldVal
             * @return {*}
             */

            exports.applyFilters = function (value, filters, vm, oldVal) {
                if (!filters) {
                    return value
                }
                for (var i = 0, l = filters.length; i < l; i++) {
                    value = filters[i].call(vm, value, oldVal)
                }
                return value
            }

            /***/ },
        /* 30 */
        /***/ function(module, exports, __webpack_require__) {

            var config = __webpack_require__(15)

            /**
             * Enable debug utilities. The enableDebug() function and
             * all _.log() & _.warn() calls will be dropped in the
             * minified production build.
             */

            enableDebug()

            function enableDebug () {

                var hasConsole = typeof console !== 'undefined'

                /**
                 * Log a message.
                 *
                 * @param {String} msg
                 */

                exports.log = function (msg) {
                    if (hasConsole && config.debug) {
                        console.log('[Vue info]: ' + msg)
                    }
                }

                /**
                 * We've got a problem here.
                 *
                 * @param {String} msg
                 */

                exports.warn = function (msg) {
                    if (hasConsole && (!config.silent || config.debug)) {
                        console.warn('[Vue warn]: ' + msg)
                        /* istanbul ignore if */
                        if (config.debug) {
                            /* jshint debug: true */
                            debugger
                        }
                    }
                }

                /**
                 * Assert asset exists
                 */

                exports.assertAsset = function (val, type, id) {
                    if (!val) {
                        exports.warn('Failed to resolve ' + type + ': ' + id)
                    }
                }
            }

            /***/ },
        /* 31 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)

            module.exports = {

                bind: function () {
                    this.attr = this.el.nodeType === 3
                        ? 'nodeValue'
                        : 'textContent'
                },

                update: function (value) {
                    this.el[this.attr] = _.toString(value)
                }

            }

            /***/ },
        /* 32 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)
            var templateParser = __webpack_require__(20)

            module.exports = {

                bind: function () {
                    // a comment node means this is a binding for
                    // {{{ inline unescaped html }}}
                    if (this.el.nodeType === 8) {
                        // hold nodes
                        this.nodes = []
                    }
                },

                update: function (value) {
                    value = _.toString(value)
                    if (this.nodes) {
                        this.swap(value)
                    } else {
                        this.el.innerHTML = value
                    }
                },

                swap: function (value) {
                    // remove old nodes
                    var i = this.nodes.length
                    while (i--) {
                        _.remove(this.nodes[i])
                    }
                    // convert new value to a fragment
                    // do not attempt to retrieve from id selector
                    var frag = templateParser.parse(value, true, true)
                    // save a reference to these nodes so we can remove later
                    this.nodes = _.toArray(frag.childNodes)
                    _.before(frag, this.el)
                }

            }

            /***/ },
        /* 33 */
        /***/ function(module, exports, __webpack_require__) {

            // xlink
            var xlinkNS = 'http://www.w3.org/1999/xlink'
            var xlinkRE = /^xlink:/

            module.exports = {

                priority: 850,

                bind: function () {
                    var name = this.arg
                    this.update = xlinkRE.test(name)
                        ? xlinkHandler
                        : defaultHandler
                }

            }

            function defaultHandler (value) {
                if (value || value === 0) {
                    this.el.setAttribute(this.arg, value)
                } else {
                    this.el.removeAttribute(this.arg)
                }
            }

            function xlinkHandler (value) {
                if (value != null) {
                    this.el.setAttributeNS(xlinkNS, this.arg, value)
                } else {
                    this.el.removeAttributeNS(xlinkNS, 'href')
                }
            }

            /***/ },
        /* 34 */
        /***/ function(module, exports, __webpack_require__) {

            var transition = __webpack_require__(50)

            module.exports = function (value) {
                var el = this.el
                transition.apply(el, value ? 1 : -1, function () {
                    el.style.display = value ? '' : 'none'
                }, this.vm)
            }

            /***/ },
        /* 35 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)
            var addClass = _.addClass
            var removeClass = _.removeClass

            module.exports = function (value) {
                if (this.arg) {
                    var method = value ? addClass : removeClass
                    method(this.el, this.arg)
                } else {
                    if (this.lastVal) {
                        removeClass(this.el, this.lastVal)
                    }
                    if (value) {
                        addClass(this.el, value)
                        this.lastVal = value
                    }
                }
            }

            /***/ },
        /* 36 */
        /***/ function(module, exports, __webpack_require__) {

            module.exports = {

                isLiteral: true,

                bind: function () {
                    this.vm.$$[this.expression] = this.el
                },

                unbind: function () {
                    delete this.vm.$$[this.expression]
                }

            }

            /***/ },
        /* 37 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)

            module.exports = {

                isLiteral: true,

                bind: function () {
                    var vm = this.el.__vue__
                    if (!vm) {
                        _.warn(
                            'v-ref should only be used on a component root element.'
                        )
                        return
                    }
                    // If we get here, it means this is a `v-ref` on a
                    // child, because parent scope `v-ref` is stripped in
                    // `v-component` already. So we just record our own ref
                    // here - it will overwrite parent ref in `v-component`,
                    // if any.
                    vm._refID = this.expression
                }

            }

            /***/ },
        /* 38 */
        /***/ function(module, exports, __webpack_require__) {

            var config = __webpack_require__(15)

            module.exports = {

                bind: function () {
                    var el = this.el
                    this.vm.$once('hook:compiled', function () {
                        el.removeAttribute(config.prefix + 'cloak')
                    })
                }

            }

            /***/ },
        /* 39 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)
            var prefixes = ['-webkit-', '-moz-', '-ms-']
            var camelPrefixes = ['Webkit', 'Moz', 'ms']
            var importantRE = /!important;?$/
            var camelRE = /([a-z])([A-Z])/g
            var testEl = null
            var propCache = {}

            module.exports = {

                deep: true,

                update: function (value) {
                    if (this.arg) {
                        this.setProp(this.arg, value)
                    } else {
                        if (typeof value === 'object') {
                            // cache object styles so that only changed props
                            // are actually updated.
                            if (!this.cache) this.cache = {}
                            for (var prop in value) {
                                this.setProp(prop, value[prop])
                                /* jshint eqeqeq: false */
                                if (value[prop] != this.cache[prop]) {
                                    this.cache[prop] = value[prop]
                                    this.setProp(prop, value[prop])
                                }
                            }
                        } else {
                            this.el.style.cssText = value
                        }
                    }
                },

                setProp: function (prop, value) {
                    prop = normalize(prop)
                    if (!prop) return // unsupported prop
                    // cast possible numbers/booleans into strings
                    if (value != null) value += ''
                    if (value) {
                        var isImportant = importantRE.test(value)
                            ? 'important'
                            : ''
                        if (isImportant) {
                            value = value.replace(importantRE, '').trim()
                        }
                        this.el.style.setProperty(prop, value, isImportant)
                    } else {
                        this.el.style.removeProperty(prop)
                    }
                }

            }

            /**
             * Normalize a CSS property name.
             * - cache result
             * - auto prefix
             * - camelCase -> dash-case
             *
             * @param {String} prop
             * @return {String}
             */

            function normalize (prop) {
                if (propCache[prop]) {
                    return propCache[prop]
                }
                var res = prefix(prop)
                propCache[prop] = propCache[res] = res
                return res
            }

            /**
             * Auto detect the appropriate prefix for a CSS property.
             * https://gist.github.com/paulirish/523692
             *
             * @param {String} prop
             * @return {String}
             */

            function prefix (prop) {
                prop = prop.replace(camelRE, '$1-$2').toLowerCase()
                var camel = _.camelize(prop)
                var upper = camel.charAt(0).toUpperCase() + camel.slice(1)
                if (!testEl) {
                    testEl = document.createElement('div')
                }
                if (camel in testEl.style) {
                    return prop
                }
                var i = prefixes.length
                var prefixed
                while (i--) {
                    prefixed = camelPrefixes[i] + upper
                    if (prefixed in testEl.style) {
                        return prefixes[i] + prop
                    }
                }
            }

            /***/ },
        /* 40 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)
            var templateParser = __webpack_require__(20)
            var vIf = __webpack_require__(45)

            module.exports = {

                isLiteral: true,

                // same logic reuse from v-if
                compile: vIf.compile,
                teardown: vIf.teardown,
                getContainedComponents: vIf.getContainedComponents,
                unbind: vIf.unbind,

                bind: function () {
                    var el = this.el
                    this.start = document.createComment('v-partial-start')
                    this.end = document.createComment('v-partial-end')
                    if (el.nodeType !== 8) {
                        el.innerHTML = ''
                    }
                    if (el.tagName === 'TEMPLATE' || el.nodeType === 8) {
                        _.replace(el, this.end)
                    } else {
                        el.appendChild(this.end)
                    }
                    _.before(this.start, this.end)
                    if (!this._isDynamicLiteral) {
                        this.insert(this.expression)
                    }
                },

                update: function (id) {
                    this.teardown()
                    this.insert(id)
                },

                insert: function (id) {
                    var partial = this.vm.$options.partials[id]
                    _.assertAsset(partial, 'partial', id)
                    if (partial) {
                        var filters = this.filters && this.filters.read
                        if (filters) {
                            partial = _.applyFilters(partial, filters, this.vm)
                        }
                        this.compile(templateParser.parse(partial, true))
                    }
                }

            }

            /***/ },
        /* 41 */
        /***/ function(module, exports, __webpack_require__) {

            module.exports = {

                priority: 1000,
                isLiteral: true,

                bind: function () {
                    if (!this._isDynamicLiteral) {
                        this.update(this.expression)
                    }
                },

                update: function (id) {
                    var vm = this.el.__vue__ || this.vm
                    this.el.__v_trans = {
                        id: id,
                        // resolve the custom transition functions now
                        // so the transition module knows this is a
                        // javascript transition without having to check
                        // computed CSS.
                        fns: vm.$options.transitions[id]
                    }
                }

            }

            /***/ },
        /* 42 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)

            module.exports = {

                acceptStatement: true,
                priority: 700,

                bind: function () {
                    // deal with iframes
                    if (
                        this.el.tagName === 'IFRAME' &&
                        this.arg !== 'load'
                    ) {
                        var self = this
                        this.iframeBind = function () {
                            _.on(self.el.contentWindow, self.arg, self.handler)
                        }
                        _.on(this.el, 'load', this.iframeBind)
                    }
                },

                update: function (handler) {
                    if (typeof handler !== 'function') {
                        _.warn(
                            'Directive "v-on:' + this.expression + '" ' +
                            'expects a function value.'
                        )
                        return
                    }
                    this.reset()
                    var vm = this.vm
                    this.handler = function (e) {
                        e.targetVM = vm
                        vm.$event = e
                        var res = handler(e)
                        vm.$event = null
                        return res
                    }
                    if (this.iframeBind) {
                        this.iframeBind()
                    } else {
                        _.on(this.el, this.arg, this.handler)
                    }
                },

                reset: function () {
                    var el = this.iframeBind
                        ? this.el.contentWindow
                        : this.el
                    if (this.handler) {
                        _.off(el, this.arg, this.handler)
                    }
                },

                unbind: function () {
                    this.reset()
                    _.off(this.el, 'load', this.iframeBind)
                }
            }

            /***/ },
        /* 43 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)
            var templateParser = __webpack_require__(20)

            module.exports = {

                isLiteral: true,

                /**
                 * Setup. Two possible usages:
                 *
                 * - static:
                 *   v-component="comp"
                 *
                 * - dynamic:
                 *   v-component="{{currentView}}"
                 */

                bind: function () {
                    if (!this.el.__vue__) {
                        // create a ref anchor
                        this.ref = document.createComment('v-component')
                        _.replace(this.el, this.ref)
                        // check keep-alive options.
                        // If yes, instead of destroying the active vm when
                        // hiding (v-if) or switching (dynamic literal) it,
                        // we simply remove it from the DOM and save it in a
                        // cache object, with its constructor id as the key.
                        this.keepAlive = this._checkParam('keep-alive') != null
                        // check ref
                        this.refID = _.attr(this.el, 'ref')
                        if (this.keepAlive) {
                            this.cache = {}
                        }
                        // check inline-template
                        if (this._checkParam('inline-template') !== null) {
                            // extract inline template as a DocumentFragment
                            this.template = _.extractContent(this.el, true)
                        }
                        // if static, build right now.
                        if (!this._isDynamicLiteral) {
                            this.resolveCtor(this.expression)
                            var child = this.build()
                            child.$before(this.ref)
                            this.setCurrent(child)
                        } else {
                            // check dynamic component params
                            this.readyEvent = this._checkParam('wait-for')
                            this.transMode = this._checkParam('transition-mode')
                        }
                    } else {
                        _.warn(
                            'v-component="' + this.expression + '" cannot be ' +
                            'used on an already mounted instance.'
                        )
                    }
                },

                /**
                 * Resolve the component constructor to use when creating
                 * the child vm.
                 */

                resolveCtor: function (id) {
                    this.ctorId = id
                    this.Ctor = this.vm.$options.components[id]
                    _.assertAsset(this.Ctor, 'component', id)
                },

                /**
                 * Instantiate/insert a new child vm.
                 * If keep alive and has cached instance, insert that
                 * instance; otherwise build a new one and cache it.
                 *
                 * @return {Vue} - the created instance
                 */

                build: function () {
                    if (this.keepAlive) {
                        var cached = this.cache[this.ctorId]
                        if (cached) {
                            return cached
                        }
                    }
                    var vm = this.vm
                    var el = templateParser.clone(this.el)
                    if (this.Ctor) {
                        var child = vm.$addChild({
                            el: el,
                            template: this.template,
                            _asComponent: true,
                            _host: this._host
                        }, this.Ctor)
                        if (this.keepAlive) {
                            this.cache[this.ctorId] = child
                        }
                        return child
                    }
                },

                /**
                 * Teardown the current child, but defers cleanup so
                 * that we can separate the destroy and removal steps.
                 */

                unbuild: function () {
                    var child = this.childVM
                    if (!child || this.keepAlive) {
                        return
                    }
                    // the sole purpose of `deferCleanup` is so that we can
                    // "deactivate" the vm right now and perform DOM removal
                    // later.
                    child.$destroy(false, true)
                },

                /**
                 * Remove current destroyed child and manually do
                 * the cleanup after removal.
                 *
                 * @param {Function} cb
                 */

                remove: function (child, cb) {
                    var keepAlive = this.keepAlive
                    if (child) {
                        child.$remove(function () {
                            if (!keepAlive) child._cleanup()
                            if (cb) cb()
                        })
                    } else if (cb) {
                        cb()
                    }
                },

                /**
                 * Update callback for the dynamic literal scenario,
                 * e.g. v-component="{{view}}"
                 */

                update: function (value) {
                    if (!value) {
                        // just destroy and remove current
                        this.unbuild()
                        this.remove(this.childVM)
                        this.unsetCurrent()
                    } else {
                        this.resolveCtor(value)
                        this.unbuild()
                        var newComponent = this.build()
                        var self = this
                        if (this.readyEvent) {
                            newComponent.$once(this.readyEvent, function () {
                                self.swapTo(newComponent)
                            })
                        } else {
                            this.swapTo(newComponent)
                        }
                    }
                },

                /**
                 * Actually swap the components, depending on the
                 * transition mode. Defaults to simultaneous.
                 *
                 * @param {Vue} target
                 */

                swapTo: function (target) {
                    var self = this
                    var current = this.childVM
                    this.unsetCurrent()
                    this.setCurrent(target)
                    switch (self.transMode) {
                        case 'in-out':
                            target.$before(self.ref, function () {
                                self.remove(current)
                            })
                            break
                        case 'out-in':
                            self.remove(current, function () {
                                target.$before(self.ref)
                            })
                            break
                        default:
                            self.remove(current)
                            target.$before(self.ref)
                    }
                },

                /**
                 * Set childVM and parent ref
                 */

                setCurrent: function (child) {
                    this.childVM = child
                    var refID = child._refID || this.refID
                    if (refID) {
                        this.vm.$[refID] = child
                    }
                },

                /**
                 * Unset childVM and parent ref
                 */

                unsetCurrent: function () {
                    var child = this.childVM
                    this.childVM = null
                    var refID = (child && child._refID) || this.refID
                    if (refID) {
                        this.vm.$[refID] = null
                    }
                },

                /**
                 * Unbind.
                 */

                unbind: function () {
                    this.unbuild()
                    // destroy all keep-alive cached instances
                    if (this.cache) {
                        for (var key in this.cache) {
                            this.cache[key].$destroy()
                        }
                        this.cache = null
                    }
                }

            }

            /***/ },
        /* 44 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)
            var isObject = _.isObject
            var isPlainObject = _.isPlainObject
            var textParser = __webpack_require__(19)
            var expParser = __webpack_require__(22)
            var templateParser = __webpack_require__(20)
            var compile = __webpack_require__(16)
            var transclude = __webpack_require__(17)
            var mergeOptions = __webpack_require__(14)
            var uid = 0

            module.exports = {

                /**
                 * Setup.
                 */

                bind: function () {
                    // uid as a cache identifier
                    this.id = '__v_repeat_' + (++uid)
                    // we need to insert the objToArray converter
                    // as the first read filter, because it has to be invoked
                    // before any user filters. (can't do it in `update`)
                    if (!this.filters) {
                        this.filters = {}
                    }
                    // add the object -> array convert filter
                    var objectConverter = _.bind(objToArray, this)
                    if (!this.filters.read) {
                        this.filters.read = [objectConverter]
                    } else {
                        this.filters.read.unshift(objectConverter)
                    }
                    // setup ref node
                    this.ref = document.createComment('v-repeat')
                    _.replace(this.el, this.ref)
                    // check if this is a block repeat
                    this.template = this.el.tagName === 'TEMPLATE'
                        ? templateParser.parse(this.el, true)
                        : this.el
                    // check other directives that need to be handled
                    // at v-repeat level
                    this.checkIf()
                    this.checkRef()
                    this.checkComponent()
                    // check for trackby param
                    this.idKey =
                        this._checkParam('track-by') ||
                        this._checkParam('trackby') // 0.11.0 compat
                    this.cache = Object.create(null)
                },

                /**
                 * Warn against v-if usage.
                 */

                checkIf: function () {
                    if (_.attr(this.el, 'if') !== null) {
                        _.warn(
                            'Don\'t use v-if with v-repeat. ' +
                            'Use v-show or the "filterBy" filter instead.'
                        )
                    }
                },

                /**
                 * Check if v-ref/ v-el is also present.
                 */

                checkRef: function () {
                    var refID = _.attr(this.el, 'ref')
                    this.refID = refID
                        ? this.vm.$interpolate(refID)
                        : null
                    var elId = _.attr(this.el, 'el')
                    this.elId = elId
                        ? this.vm.$interpolate(elId)
                        : null
                },

                /**
                 * Check the component constructor to use for repeated
                 * instances. If static we resolve it now, otherwise it
                 * needs to be resolved at build time with actual data.
                 */

                checkComponent: function () {
                    var id = _.attr(this.el, 'component')
                    var options = this.vm.$options
                    if (!id) {
                        // default constructor
                        this.Ctor = _.Vue
                        // inline repeats should inherit
                        this.inherit = true
                        // important: transclude with no options, just
                        // to ensure block start and block end
                        this.template = transclude(this.template)
                        this._linkFn = compile(this.template, options)
                    } else {
                        this.asComponent = true
                        // check inline-template
                        if (this._checkParam('inline-template') !== null) {
                            // extract inline template as a DocumentFragment
                            this.inlineTempalte = _.extractContent(this.el, true)
                        }
                        var tokens = textParser.parse(id)
                        if (!tokens) { // static component
                            var Ctor = this.Ctor = options.components[id]
                            _.assertAsset(Ctor, 'component', id)
                            var merged = mergeOptions(Ctor.options, {}, {
                                $parent: this.vm
                            })
                            merged.template = this.inlineTempalte || merged.template
                            merged._asComponent = true
                            merged._parent = this.vm
                            this.template = transclude(this.template, merged)
                            // Important: mark the template as a root node so that
                            // custom element components don't get compiled twice.
                            // fixes #822
                            this.template.__vue__ = true
                            this._linkFn = compile(this.template, merged)
                        } else {
                            // to be resolved later
                            var ctorExp = textParser.tokensToExp(tokens)
                            this.ctorGetter = expParser.parse(ctorExp).get
                        }
                    }
                },

                /**
                 * Update.
                 * This is called whenever the Array mutates.
                 *
                 * @param {Array|Number|String} data
                 */

                update: function (data) {
                    data = data || []
                    var type = typeof data
                    if (type === 'number') {
                        data = range(data)
                    } else if (type === 'string') {
                        data = _.toArray(data)
                    }
                    this.vms = this.diff(data, this.vms)
                    // update v-ref
                    if (this.refID) {
                        this.vm.$[this.refID] = this.vms
                    }
                    if (this.elId) {
                        this.vm.$$[this.elId] = this.vms.map(function (vm) {
                            return vm.$el
                        })
                    }
                },

                /**
                 * Diff, based on new data and old data, determine the
                 * minimum amount of DOM manipulations needed to make the
                 * DOM reflect the new data Array.
                 *
                 * The algorithm diffs the new data Array by storing a
                 * hidden reference to an owner vm instance on previously
                 * seen data. This allows us to achieve O(n) which is
                 * better than a levenshtein distance based algorithm,
                 * which is O(m * n).
                 *
                 * @param {Array} data
                 * @param {Array} oldVms
                 * @return {Array}
                 */

                diff: function (data, oldVms) {
                    var idKey = this.idKey
                    var converted = this.converted
                    var ref = this.ref
                    var alias = this.arg
                    var init = !oldVms
                    var vms = new Array(data.length)
                    var obj, raw, vm, i, l
                    // First pass, go through the new Array and fill up
                    // the new vms array. If a piece of data has a cached
                    // instance for it, we reuse it. Otherwise build a new
                    // instance.
                    for (i = 0, l = data.length; i < l; i++) {
                        obj = data[i]
                        raw = converted ? obj.$value : obj
                        vm = !init && this.getVm(raw)
                        if (vm) { // reusable instance
                            vm._reused = true
                            vm.$index = i // update $index
                            if (converted) {
                                vm.$key = obj.$key // update $key
                            }
                            if (idKey) { // swap track by id data
                                if (alias) {
                                    vm[alias] = raw
                                } else {
                                    vm._setData(raw)
                                }
                            }
                        } else { // new instance
                            vm = this.build(obj, i, true)
                            vm._new = true
                            vm._reused = false
                        }
                        vms[i] = vm
                        // insert if this is first run
                        if (init) {
                            vm.$before(ref)
                        }
                    }
                    // if this is the first run, we're done.
                    if (init) {
                        return vms
                    }
                    // Second pass, go through the old vm instances and
                    // destroy those who are not reused (and remove them
                    // from cache)
                    for (i = 0, l = oldVms.length; i < l; i++) {
                        vm = oldVms[i]
                        if (!vm._reused) {
                            this.uncacheVm(vm)
                            vm.$destroy(true)
                        }
                    }
                    // final pass, move/insert new instances into the
                    // right place. We're going in reverse here because
                    // insertBefore relies on the next sibling to be
                    // resolved.
                    var targetNext, currentNext
                    i = vms.length
                    while (i--) {
                        vm = vms[i]
                        // this is the vm that we should be in front of
                        targetNext = vms[i + 1]
                        if (!targetNext) {
                            // This is the last item. If it's reused then
                            // everything else will eventually be in the right
                            // place, so no need to touch it. Otherwise, insert
                            // it.
                            if (!vm._reused) {
                                vm.$before(ref)
                            }
                        } else {
                            var nextEl = targetNext.$el
                            if (vm._reused) {
                                // this is the vm we are actually in front of
                                currentNext = findNextVm(vm, ref)
                                // we only need to move if we are not in the right
                                // place already.
                                if (currentNext !== targetNext) {
                                    vm.$before(nextEl, null, false)
                                }
                            } else {
                                // new instance, insert to existing next
                                vm.$before(nextEl)
                            }
                        }
                        vm._new = false
                        vm._reused = false
                    }
                    return vms
                },

                /**
                 * Build a new instance and cache it.
                 *
                 * @param {Object} data
                 * @param {Number} index
                 * @param {Boolean} needCache
                 */

                build: function (data, index, needCache) {
                    var meta = { $index: index }
                    if (this.converted) {
                        meta.$key = data.$key
                    }
                    var raw = this.converted ? data.$value : data
                    var alias = this.arg
                    if (alias) {
                        data = {}
                        data[alias] = raw
                    } else if (!isPlainObject(raw)) {
                        // non-object values
                        data = {}
                        meta.$value = raw
                    } else {
                        // default
                        data = raw
                    }
                    // resolve constructor
                    var Ctor = this.Ctor || this.resolveCtor(data, meta)
                    var vm = this.vm.$addChild({
                        el: templateParser.clone(this.template),
                        _asComponent: this.asComponent,
                        _host: this._host,
                        _linkFn: this._linkFn,
                        _meta: meta,
                        data: data,
                        inherit: this.inherit,
                        template: this.inlineTempalte
                    }, Ctor)
                    // flag this instance as a repeat instance
                    // so that we can skip it in vm._digest
                    vm._repeat = true
                    // cache instance
                    if (needCache) {
                        this.cacheVm(raw, vm)
                    }
                    // sync back changes for $value, particularly for
                    // two-way bindings of primitive values
                    var self = this
                    vm.$watch('$value', function (val) {
                        if (self.converted) {
                            self.rawValue[vm.$key] = val
                        } else {
                            self.rawValue.$set(vm.$index, val)
                        }
                    })
                    return vm
                },

                /**
                 * Resolve a contructor to use for an instance.
                 * The tricky part here is that there could be dynamic
                 * components depending on instance data.
                 *
                 * @param {Object} data
                 * @param {Object} meta
                 * @return {Function}
                 */

                resolveCtor: function (data, meta) {
                    // create a temporary context object and copy data
                    // and meta properties onto it.
                    // use _.define to avoid accidentally overwriting scope
                    // properties.
                    var context = Object.create(this.vm)
                    var key
                    for (key in data) {
                        _.define(context, key, data[key])
                    }
                    for (key in meta) {
                        _.define(context, key, meta[key])
                    }
                    var id = this.ctorGetter.call(context, context)
                    var Ctor = this.vm.$options.components[id]
                    _.assertAsset(Ctor, 'component', id)
                    return Ctor
                },

                /**
                 * Unbind, teardown everything
                 */

                unbind: function () {
                    if (this.refID) {
                        this.vm.$[this.refID] = null
                    }
                    if (this.vms) {
                        var i = this.vms.length
                        var vm
                        while (i--) {
                            vm = this.vms[i]
                            this.uncacheVm(vm)
                            vm.$destroy()
                        }
                    }
                },

                /**
                 * Cache a vm instance based on its data.
                 *
                 * If the data is an object, we save the vm's reference on
                 * the data object as a hidden property. Otherwise we
                 * cache them in an object and for each primitive value
                 * there is an array in case there are duplicates.
                 *
                 * @param {Object} data
                 * @param {Vue} vm
                 */

                cacheVm: function (data, vm) {
                    var idKey = this.idKey
                    var cache = this.cache
                    var id
                    if (idKey) {
                        id = data[idKey]
                        if (!cache[id]) {
                            cache[id] = vm
                        } else {
                            _.warn('Duplicate track-by key in v-repeat: ' + id)
                        }
                    } else if (isObject(data)) {
                        id = this.id
                        if (data.hasOwnProperty(id)) {
                            if (data[id] === null) {
                                data[id] = vm
                            } else {
                                _.warn(
                                    'Duplicate objects are not supported in v-repeat ' +
                                    'when using components or transitions.'
                                )
                            }
                        } else {
                            _.define(data, this.id, vm)
                        }
                    } else {
                        if (!cache[data]) {
                            cache[data] = [vm]
                        } else {
                            cache[data].push(vm)
                        }
                    }
                    vm._raw = data
                },

                /**
                 * Try to get a cached instance from a piece of data.
                 *
                 * @param {Object} data
                 * @return {Vue|undefined}
                 */

                getVm: function (data) {
                    if (this.idKey) {
                        return this.cache[data[this.idKey]]
                    } else if (isObject(data)) {
                        return data[this.id]
                    } else {
                        var cached = this.cache[data]
                        if (cached) {
                            var i = 0
                            var vm = cached[i]
                            // since duplicated vm instances might be a reused
                            // one OR a newly created one, we need to return the
                            // first instance that is neither of these.
                            while (vm && (vm._reused || vm._new)) {
                                vm = cached[++i]
                            }
                            return vm
                        }
                    }
                },

                /**
                 * Delete a cached vm instance.
                 *
                 * @param {Vue} vm
                 */

                uncacheVm: function (vm) {
                    var data = vm._raw
                    if (this.idKey) {
                        this.cache[data[this.idKey]] = null
                    } else if (isObject(data)) {
                        data[this.id] = null
                        vm._raw = null
                    } else {
                        this.cache[data].pop()
                    }
                }

            }

            /**
             * Helper to find the next element that is an instance
             * root node. This is necessary because a destroyed vm's
             * element could still be lingering in the DOM before its
             * leaving transition finishes, but its __vue__ reference
             * should have been removed so we can skip them.
             *
             * @param {Vue} vm
             * @param {CommentNode} ref
             * @return {Vue}
             */

            function findNextVm (vm, ref) {
                var el = (vm._blockEnd || vm.$el).nextSibling
                while (!el.__vue__ && el !== ref) {
                    el = el.nextSibling
                }
                return el.__vue__
            }

            /**
             * Attempt to convert non-Array objects to array.
             * This is the default filter installed to every v-repeat
             * directive.
             *
             * It will be called with **the directive** as `this`
             * context so that we can mark the repeat array as converted
             * from an object.
             *
             * @param {*} obj
             * @return {Array}
             * @private
             */

            function objToArray (obj) {
                // regardless of type, store the un-filtered raw value.
                this.rawValue = obj
                if (!isPlainObject(obj)) {
                    return obj
                }
                var keys = Object.keys(obj)
                var i = keys.length
                var res = new Array(i)
                var key
                while (i--) {
                    key = keys[i]
                    res[i] = {
                        $key: key,
                        $value: obj[key]
                    }
                }
                // `this` points to the repeat directive instance
                this.converted = true
                return res
            }

            /**
             * Create a range array from given number.
             *
             * @param {Number} n
             * @return {Array}
             */

            function range (n) {
                var i = -1
                var ret = new Array(n)
                while (++i < n) {
                    ret[i] = i
                }
                return ret
            }

            /***/ },
        /* 45 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)
            var compile = __webpack_require__(16)
            var templateParser = __webpack_require__(20)
            var transition = __webpack_require__(50)

            module.exports = {

                bind: function () {
                    var el = this.el
                    if (!el.__vue__) {
                        this.start = document.createComment('v-if-start')
                        this.end = document.createComment('v-if-end')
                        _.replace(el, this.end)
                        _.before(this.start, this.end)
                        if (el.tagName === 'TEMPLATE') {
                            this.template = templateParser.parse(el, true)
                        } else {
                            this.template = document.createDocumentFragment()
                            this.template.appendChild(templateParser.clone(el))
                        }
                        // compile the nested partial
                        this.linker = compile(
                            this.template,
                            this.vm.$options,
                            true
                        )
                    } else {
                        this.invalid = true
                        _.warn(
                            'v-if="' + this.expression + '" cannot be ' +
                            'used on an already mounted instance.'
                        )
                    }
                },

                update: function (value) {
                    if (this.invalid) return
                    if (value) {
                        // avoid duplicate compiles, since update() can be
                        // called with different truthy values
                        if (!this.unlink) {
                            var frag = templateParser.clone(this.template)
                            this.compile(frag)
                        }
                    } else {
                        this.teardown()
                    }
                },

                // NOTE: this function is shared in v-partial
                compile: function (frag) {
                    var vm = this.vm
                    // the linker is not guaranteed to be present because
                    // this function might get called by v-partial 
                    this.unlink = this.linker
                        ? this.linker(vm, frag)
                        : vm.$compile(frag)
                    transition.blockAppend(frag, this.end, vm)
                    // call attached for all the child components created
                    // during the compilation
                    if (_.inDoc(vm.$el)) {
                        var children = this.getContainedComponents()
                        if (children) children.forEach(callAttach)
                    }
                },

                // NOTE: this function is shared in v-partial
                teardown: function () {
                    if (!this.unlink) return
                    // collect children beforehand
                    var children
                    if (_.inDoc(this.vm.$el)) {
                        children = this.getContainedComponents()
                    }
                    transition.blockRemove(this.start, this.end, this.vm)
                    if (children) children.forEach(callDetach)
                    this.unlink()
                    this.unlink = null
                },

                // NOTE: this function is shared in v-partial
                getContainedComponents: function () {
                    var vm = this.vm
                    var start = this.start.nextSibling
                    var end = this.end
                    var selfCompoents =
                        vm._children.length &&
                        vm._children.filter(contains)
                    var transComponents =
                        vm._transCpnts &&
                        vm._transCpnts.filter(contains)

                    function contains (c) {
                        var cur = start
                        var next
                        while (next !== end) {
                            next = cur.nextSibling
                            if (cur.contains(c.$el)) {
                                return true
                            }
                            cur = next
                        }
                        return false
                    }

                    return selfCompoents
                        ? transComponents
                        ? selfCompoents.concat(transComponents)
                        : selfCompoents
                        : transComponents
                },

                // NOTE: this function is shared in v-partial
                unbind: function () {
                    if (this.unlink) this.unlink()
                }

            }

            function callAttach (child) {
                if (!child._isAttached) {
                    child._callHook('attached')
                }
            }

            function callDetach (child) {
                if (child._isAttached) {
                    child._callHook('detached')
                }
            }

            /***/ },
        /* 46 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)
            var Watcher = __webpack_require__(25)
            var expParser = __webpack_require__(22)
            var literalRE = /^(true|false|\s?('[^']*'|"[^"]")\s?)$/

            module.exports = {

                priority: 900,

                bind: function () {

                    var child = this.vm
                    var parent = child.$parent
                    var childKey = this.arg || '$data'
                    var parentKey = this.expression

                    if (this.el && this.el !== child.$el) {
                        _.warn(
                            'v-with can only be used on instance root elements.'
                        )
                    } else if (!parent) {
                        _.warn(
                            'v-with must be used on an instance with a parent.'
                        )
                    } else if (literalRE.test(parentKey)) {
                        // no need to setup watchers for literal bindings
                        if (!this.arg) {
                            _.warn(
                                'v-with cannot bind literal value as $data: ' +
                                parentKey
                            )
                        } else {
                            var value = expParser.parse(parentKey).get()
                            child.$set(childKey, value)
                        }
                    } else {

                        // simple lock to avoid circular updates.
                        // without this it would stabilize too, but this makes
                        // sure it doesn't cause other watchers to re-evaluate.
                        var locked = false
                        var lock = function () {
                            locked = true
                            _.nextTick(unlock)
                        }
                        var unlock = function () {
                            locked = false
                        }

                        this.parentWatcher = new Watcher(
                            parent,
                            parentKey,
                            function (val) {
                                if (!locked) {
                                    lock()
                                    child.$set(childKey, val)
                                }
                            }
                        )

                        // set the child initial value first, before setting
                        // up the child watcher to avoid triggering it
                        // immediately.
                        child.$set(childKey, this.parentWatcher.value)

                        this.childWatcher = new Watcher(
                            child,
                            childKey,
                            function (val) {
                                if (!locked) {
                                    lock()
                                    parent.$set(parentKey, val)
                                }
                            }
                        )
                    }
                },

                unbind: function () {
                    if (this.parentWatcher) {
                        this.parentWatcher.teardown()
                        this.childWatcher.teardown()
                    }
                }

            }

            /***/ },
        /* 47 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)

            module.exports = {

                acceptStatement: true,

                bind: function () {
                    var child = this.el.__vue__
                    if (!child || this.vm !== child.$parent) {
                        _.warn(
                            '`v-events` should only be used on a child component ' +
                            'from the parent template.'
                        )
                        return
                    }
                },

                update: function (handler, oldHandler) {
                    if (typeof handler !== 'function') {
                        _.warn(
                            'Directive "v-events:' + this.expression + '" ' +
                            'expects a function value.'
                        )
                        return
                    }
                    var child = this.el.__vue__
                    if (oldHandler) {
                        child.$off(this.arg, oldHandler)
                    }
                    child.$on(this.arg, handler)
                }

                // when child is destroyed, all events are turned off,
                // so no need for unbind here.

            }

            /***/ },
        /* 48 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)
            var Path = __webpack_require__(18)

            /**
             * Filter filter for v-repeat
             *
             * @param {String} searchKey
             * @param {String} [delimiter]
             * @param {String} dataKey
             */

            exports.filterBy = function (arr, searchKey, delimiter, dataKey) {
                // allow optional `in` delimiter
                // because why not
                if (delimiter && delimiter !== 'in') {
                    dataKey = delimiter
                }
                // get the search string
                var search =
                    _.stripQuotes(searchKey) ||
                    this.$get(searchKey)
                if (!search) {
                    return arr
                }
                search = ('' + search).toLowerCase()
                // get the optional dataKey
                dataKey =
                    dataKey &&
                    (_.stripQuotes(dataKey) || this.$get(dataKey))
                return arr.filter(function (item) {
                    return dataKey
                        ? contains(Path.get(item, dataKey), search)
                        : contains(item, search)
                })
            }

            /**
             * Filter filter for v-repeat
             *
             * @param {String} sortKey
             * @param {String} reverseKey
             */

            exports.orderBy = function (arr, sortKey, reverseKey) {
                var key =
                    _.stripQuotes(sortKey) ||
                    this.$get(sortKey)
                if (!key) {
                    return arr
                }
                var order = 1
                if (reverseKey) {
                    if (reverseKey === '-1') {
                        order = -1
                    } else if (reverseKey.charCodeAt(0) === 0x21) { // !
                        reverseKey = reverseKey.slice(1)
                        order = this.$get(reverseKey) ? 1 : -1
                    } else {
                        order = this.$get(reverseKey) ? -1 : 1
                    }
                }
                // sort on a copy to avoid mutating original array
                return arr.slice().sort(function (a, b) {
                    a = _.isObject(a) ? Path.get(a, key) : a
                    b = _.isObject(b) ? Path.get(b, key) : b
                    return a === b ? 0 : a > b ? order : -order
                })
            }

            /**
             * String contain helper
             *
             * @param {*} val
             * @param {String} search
             */

            function contains (val, search) {
                if (_.isObject(val)) {
                    for (var key in val) {
                        if (contains(val[key], search)) {
                            return true
                        }
                    }
                } else if (val != null) {
                    return val.toString().toLowerCase().indexOf(search) > -1
                }
            }

            /***/ },
        /* 49 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)
            var config = __webpack_require__(15)
            var Dep = __webpack_require__(23)
            var arrayMethods = __webpack_require__(54)
            var arrayKeys = Object.getOwnPropertyNames(arrayMethods)
            __webpack_require__(55)

            var uid = 0

            /**
             * Type enums
             */

            var ARRAY  = 0
            var OBJECT = 1

            /**
             * Augment an target Object or Array by intercepting
             * the prototype chain using __proto__
             *
             * @param {Object|Array} target
             * @param {Object} proto
             */

            function protoAugment (target, src) {
                target.__proto__ = src
            }

            /**
             * Augment an target Object or Array by defining
             * hidden properties.
             *
             * @param {Object|Array} target
             * @param {Object} proto
             */

            function copyAugment (target, src, keys) {
                var i = keys.length
                var key
                while (i--) {
                    key = keys[i]
                    _.define(target, key, src[key])
                }
            }

            /**
             * Observer class that are attached to each observed
             * object. Once attached, the observer converts target
             * object's property keys into getter/setters that
             * collect dependencies and dispatches updates.
             *
             * @param {Array|Object} value
             * @param {Number} type
             * @constructor
             */

            function Observer (value, type) {
                this.id = ++uid
                this.value = value
                this.active = true
                this.deps = []
                _.define(value, '__ob__', this)
                if (type === ARRAY) {
                    var augment = config.proto && _.hasProto
                        ? protoAugment
                        : copyAugment
                    augment(value, arrayMethods, arrayKeys)
                    this.observeArray(value)
                } else if (type === OBJECT) {
                    this.walk(value)
                }
            }

            Observer.target = null

            var p = Observer.prototype

            /**
             * Attempt to create an observer instance for a value,
             * returns the new observer if successfully observed,
             * or the existing observer if the value already has one.
             *
             * @param {*} value
             * @return {Observer|undefined}
             * @static
             */

            Observer.create = function (value) {
                if (
                    value &&
                    value.hasOwnProperty('__ob__') &&
                    value.__ob__ instanceof Observer
                ) {
                    return value.__ob__
                } else if (_.isArray(value)) {
                    return new Observer(value, ARRAY)
                } else if (
                    _.isPlainObject(value) &&
                    !value._isVue // avoid Vue instance
                ) {
                    return new Observer(value, OBJECT)
                }
            }

            /**
             * Walk through each property and convert them into
             * getter/setters. This method should only be called when
             * value type is Object. Properties prefixed with `$` or `_`
             * and accessor properties are ignored.
             *
             * @param {Object} obj
             */

            p.walk = function (obj) {
                var keys = Object.keys(obj)
                var i = keys.length
                var key, prefix
                while (i--) {
                    key = keys[i]
                    prefix = key.charCodeAt(0)
                    if (prefix !== 0x24 && prefix !== 0x5F) { // skip $ or _
                        this.convert(key, obj[key])
                    }
                }
            }

            /**
             * Try to carete an observer for a child value,
             * and if value is array, link dep to the array.
             *
             * @param {*} val
             * @return {Dep|undefined}
             */

            p.observe = function (val) {
                return Observer.create(val)
            }

            /**
             * Observe a list of Array items.
             *
             * @param {Array} items
             */

            p.observeArray = function (items) {
                var i = items.length
                while (i--) {
                    this.observe(items[i])
                }
            }

            /**
             * Convert a property into getter/setter so we can emit
             * the events when the property is accessed/changed.
             *
             * @param {String} key
             * @param {*} val
             */

            p.convert = function (key, val) {
                var ob = this
                var childOb = ob.observe(val)
                var dep = new Dep()
                if (childOb) {
                    childOb.deps.push(dep)
                }
                Object.defineProperty(ob.value, key, {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        // Observer.target is a watcher whose getter is
                        // currently being evaluated.
                        if (ob.active && Observer.target) {
                            Observer.target.addDep(dep)
                        }
                        return val
                    },
                    set: function (newVal) {
                        if (newVal === val) return
                        // remove dep from old value
                        var oldChildOb = val && val.__ob__
                        if (oldChildOb) {
                            var oldDeps = oldChildOb.deps
                            oldDeps.splice(oldDeps.indexOf(dep), 1)
                        }
                        val = newVal
                        // add dep to new value
                        var newChildOb = ob.observe(newVal)
                        if (newChildOb) {
                            newChildOb.deps.push(dep)
                        }
                        dep.notify()
                    }
                })
            }

            /**
             * Notify change on all self deps on an observer.
             * This is called when a mutable value mutates. e.g.
             * when an Array's mutating methods are called, or an
             * Object's $add/$delete are called.
             */

            p.notify = function () {
                var deps = this.deps
                for (var i = 0, l = deps.length; i < l; i++) {
                    deps[i].notify()
                }
            }

            /**
             * Add an owner vm, so that when $add/$delete mutations
             * happen we can notify owner vms to proxy the keys and
             * digest the watchers. This is only called when the object
             * is observed as an instance's root $data.
             *
             * @param {Vue} vm
             */

            p.addVm = function (vm) {
                (this.vms = this.vms || []).push(vm)
            }

            /**
             * Remove an owner vm. This is called when the object is
             * swapped out as an instance's $data object.
             *
             * @param {Vue} vm
             */

            p.removeVm = function (vm) {
                this.vms.splice(this.vms.indexOf(vm), 1)
            }

            module.exports = Observer


            /***/ },
        /* 50 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)
            var applyCSSTransition = __webpack_require__(56)
            var applyJSTransition = __webpack_require__(57)
            var doc = typeof document === 'undefined' ? null : document

            /**
             * Append with transition.
             *
             * @oaram {Element} el
             * @param {Element} target
             * @param {Vue} vm
             * @param {Function} [cb]
             */

            exports.append = function (el, target, vm, cb) {
                apply(el, 1, function () {
                    target.appendChild(el)
                }, vm, cb)
            }

            /**
             * InsertBefore with transition.
             *
             * @oaram {Element} el
             * @param {Element} target
             * @param {Vue} vm
             * @param {Function} [cb]
             */

            exports.before = function (el, target, vm, cb) {
                apply(el, 1, function () {
                    _.before(el, target)
                }, vm, cb)
            }

            /**
             * Remove with transition.
             *
             * @oaram {Element} el
             * @param {Vue} vm
             * @param {Function} [cb]
             */

            exports.remove = function (el, vm, cb) {
                apply(el, -1, function () {
                    _.remove(el)
                }, vm, cb)
            }

            /**
             * Remove by appending to another parent with transition.
             * This is only used in block operations.
             *
             * @oaram {Element} el
             * @param {Element} target
             * @param {Vue} vm
             * @param {Function} [cb]
             */

            exports.removeThenAppend = function (el, target, vm, cb) {
                apply(el, -1, function () {
                    target.appendChild(el)
                }, vm, cb)
            }

            /**
             * Append the childNodes of a fragment to target.
             *
             * @param {DocumentFragment} block
             * @param {Node} target
             * @param {Vue} vm
             */

            exports.blockAppend = function (block, target, vm) {
                var nodes = _.toArray(block.childNodes)
                for (var i = 0, l = nodes.length; i < l; i++) {
                    exports.before(nodes[i], target, vm)
                }
            }

            /**
             * Remove a block of nodes between two edge nodes.
             *
             * @param {Node} start
             * @param {Node} end
             * @param {Vue} vm
             */

            exports.blockRemove = function (start, end, vm) {
                var node = start.nextSibling
                var next
                while (node !== end) {
                    next = node.nextSibling
                    exports.remove(node, vm)
                    node = next
                }
            }

            /**
             * Apply transitions with an operation callback.
             *
             * @oaram {Element} el
             * @param {Number} direction
             *                  1: enter
             *                 -1: leave
             * @param {Function} op - the actual DOM operation
             * @param {Vue} vm
             * @param {Function} [cb]
             */

            var apply = exports.apply = function (el, direction, op, vm, cb) {
                var transData = el.__v_trans
                if (
                    !transData ||
                    !vm._isCompiled ||
                        // if the vm is being manipulated by a parent directive
                        // during the parent's compilation phase, skip the
                        // animation.
                    (vm.$parent && !vm.$parent._isCompiled)
                ) {
                    op()
                    if (cb) cb()
                    return
                }
                // determine the transition type on the element
                var jsTransition = transData.fns
                if (jsTransition) {
                    // js
                    applyJSTransition(
                        el,
                        direction,
                        op,
                        transData,
                        jsTransition,
                        vm,
                        cb
                    )
                } else if (
                    _.transitionEndEvent &&
                        // skip CSS transitions if page is not visible -
                        // this solves the issue of transitionend events not
                        // firing until the page is visible again.
                        // pageVisibility API is supported in IE10+, same as
                        // CSS transitions.
                    !(doc && doc.hidden)
                ) {
                    // css
                    applyCSSTransition(
                        el,
                        direction,
                        op,
                        transData,
                        cb
                    )
                } else {
                    // not applicable
                    op()
                    if (cb) cb()
                }
            }

            /***/ },
        /* 51 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)

            var handlers = {
                _default: __webpack_require__(58),
                radio: __webpack_require__(59),
                select: __webpack_require__(60),
                checkbox: __webpack_require__(61)
            }

            module.exports = {

                priority: 800,
                twoWay: true,
                handlers: handlers,

                /**
                 * Possible elements:
                 *   <select>
                 *   <textarea>
                 *   <input type="*">
                 *     - text
                 *     - checkbox
                 *     - radio
                 *     - number
                 *     - TODO: more types may be supplied as a plugin
                 */

                bind: function () {
                    // friendly warning...
                    var filters = this.filters
                    if (filters && filters.read && !filters.write) {
                        _.warn(
                            'It seems you are using a read-only filter with ' +
                            'v-model. You might want to use a two-way filter ' +
                            'to ensure correct behavior.'
                        )
                    }
                    var el = this.el
                    var tag = el.tagName
                    var handler
                    if (tag === 'INPUT') {
                        handler = handlers[el.type] || handlers._default
                    } else if (tag === 'SELECT') {
                        handler = handlers.select
                    } else if (tag === 'TEXTAREA') {
                        handler = handlers._default
                    } else {
                        _.warn("v-model doesn't support element type: " + tag)
                        return
                    }
                    handler.bind.call(this)
                    this.update = handler.update
                    this.unbind = handler.unbind
                }

            }

            /***/ },
        /* 52 */
        /***/ function(module, exports, __webpack_require__) {

            /**
             * A doubly linked list-based Least Recently Used (LRU)
             * cache. Will keep most recently used items while
             * discarding least recently used items when its limit is
             * reached. This is a bare-bone version of
             * Rasmus Andersson's js-lru:
             *
             *   https://github.com/rsms/js-lru
             *
             * @param {Number} limit
             * @constructor
             */

            function Cache (limit) {
                this.size = 0
                this.limit = limit
                this.head = this.tail = undefined
                this._keymap = {}
            }

            var p = Cache.prototype

            /**
             * Put <value> into the cache associated with <key>.
             * Returns the entry which was removed to make room for
             * the new entry. Otherwise undefined is returned.
             * (i.e. if there was enough room already).
             *
             * @param {String} key
             * @param {*} value
             * @return {Entry|undefined}
             */

            p.put = function (key, value) {
                var entry = {
                    key:key,
                    value:value
                }
                this._keymap[key] = entry
                if (this.tail) {
                    this.tail.newer = entry
                    entry.older = this.tail
                } else {
                    this.head = entry
                }
                this.tail = entry
                if (this.size === this.limit) {
                    return this.shift()
                } else {
                    this.size++
                }
            }

            /**
             * Purge the least recently used (oldest) entry from the
             * cache. Returns the removed entry or undefined if the
             * cache was empty.
             */

            p.shift = function () {
                var entry = this.head
                if (entry) {
                    this.head = this.head.newer
                    this.head.older = undefined
                    entry.newer = entry.older = undefined
                    this._keymap[entry.key] = undefined
                }
                return entry
            }

            /**
             * Get and register recent use of <key>. Returns the value
             * associated with <key> or undefined if not in cache.
             *
             * @param {String} key
             * @param {Boolean} returnEntry
             * @return {Entry|*}
             */

            p.get = function (key, returnEntry) {
                var entry = this._keymap[key]
                if (entry === undefined) return
                if (entry === this.tail) {
                    return returnEntry
                        ? entry
                        : entry.value
                }
                // HEAD--------------TAIL
                //   <.older   .newer>
                //  <--- add direction --
                //   A  B  C  <D>  E
                if (entry.newer) {
                    if (entry === this.head) {
                        this.head = entry.newer
                    }
                    entry.newer.older = entry.older // C <-- E.
                }
                if (entry.older) {
                    entry.older.newer = entry.newer // C. --> E
                }
                entry.newer = undefined // D --x
                entry.older = this.tail // D. --> E
                if (this.tail) {
                    this.tail.newer = entry // E. <-- D
                }
                this.tail = entry
                return returnEntry
                    ? entry
                    : entry.value
            }

            module.exports = Cache

            /***/ },
        /* 53 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)
            var MAX_UPDATE_COUNT = 10

            // we have two separate queues: one for directive updates
            // and one for user watcher registered via $watch().
            // we want to guarantee directive updates to be called
            // before user watchers so that when user watchers are
            // triggered, the DOM would have already been in updated
            // state.
            var queue = []
            var userQueue = []
            var has = {}
            var waiting = false
            var flushing = false

            /**
             * Reset the batcher's state.
             */

            function reset () {
                queue = []
                userQueue = []
                has = {}
                waiting = false
                flushing = false
            }

            /**
             * Flush both queues and run the jobs.
             */

            function flush () {
                flushing = true
                run(queue)
                run(userQueue)
                reset()
            }

            /**
             * Run the jobs in a single queue.
             *
             * @param {Array} queue
             */

            function run (queue) {
                // do not cache length because more jobs might be pushed
                // as we run existing jobs
                for (var i = 0; i < queue.length; i++) {
                    queue[i].run()
                }
            }

            /**
             * Push a job into the job queue.
             * Jobs with duplicate IDs will be skipped unless it's
             * pushed when the queue is being flushed.
             *
             * @param {Object} job
             *   properties:
             *   - {String|Number} id
             *   - {Function}      run
             */

            exports.push = function (job) {
                var id = job.id
                if (!id || !has[id] || flushing) {
                    if (!has[id]) {
                        has[id] = 1
                    } else {
                        has[id]++
                        // detect possible infinite update loops
                        if (has[id] > MAX_UPDATE_COUNT) {
                            _.warn(
                                'You may have an infinite update loop for the ' +
                                'watcher with expression: "' + job.expression + '".'
                            )
                            return
                        }
                    }
                    // A user watcher callback could trigger another
                    // directive update during the flushing; at that time
                    // the directive queue would already have been run, so
                    // we call that update immediately as it is pushed.
                    if (flushing && !job.user) {
                        job.run()
                        return
                    }
                    ;(job.user ? userQueue : queue).push(job)
                    if (!waiting) {
                        waiting = true
                        _.nextTick(flush)
                    }
                }
            }

            /***/ },
        /* 54 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)
            var arrayProto = Array.prototype
            var arrayMethods = Object.create(arrayProto)

            /**
             * Intercept mutating methods and emit events
             */

                ;[
                'push',
                'pop',
                'shift',
                'unshift',
                'splice',
                'sort',
                'reverse'
            ]
                .forEach(function (method) {
                    // cache original method
                    var original = arrayProto[method]
                    _.define(arrayMethods, method, function mutator () {
                        // avoid leaking arguments:
                        // http://jsperf.com/closure-with-arguments
                        var i = arguments.length
                        var args = new Array(i)
                        while (i--) {
                            args[i] = arguments[i]
                        }
                        var result = original.apply(this, args)
                        var ob = this.__ob__
                        var inserted
                        switch (method) {
                            case 'push':
                                inserted = args
                                break
                            case 'unshift':
                                inserted = args
                                break
                            case 'splice':
                                inserted = args.slice(2)
                                break
                        }
                        if (inserted) ob.observeArray(inserted)
                        // notify change
                        ob.notify()
                        return result
                    })
                })

            /**
             * Swap the element at the given index with a new value
             * and emits corresponding event.
             *
             * @param {Number} index
             * @param {*} val
             * @return {*} - replaced element
             */

            _.define(
                arrayProto,
                '$set',
                function $set (index, val) {
                    if (index >= this.length) {
                        this.length = index + 1
                    }
                    return this.splice(index, 1, val)[0]
                }
            )

            /**
             * Convenience method to remove the element at given index.
             *
             * @param {Number} index
             * @param {*} val
             */

            _.define(
                arrayProto,
                '$remove',
                function $remove (index) {
                    if (typeof index !== 'number') {
                        index = this.indexOf(index)
                    }
                    if (index > -1) {
                        return this.splice(index, 1)[0]
                    }
                }
            )

            module.exports = arrayMethods

            /***/ },
        /* 55 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)
            var objProto = Object.prototype

            /**
             * Add a new property to an observed object
             * and emits corresponding event
             *
             * @param {String} key
             * @param {*} val
             * @public
             */

            _.define(
                objProto,
                '$add',
                function $add (key, val) {
                    if (this.hasOwnProperty(key)) return
                    var ob = this.__ob__
                    if (!ob || _.isReserved(key)) {
                        this[key] = val
                        return
                    }
                    ob.convert(key, val)
                    if (ob.vms) {
                        var i = ob.vms.length
                        while (i--) {
                            var vm = ob.vms[i]
                            vm._proxy(key)
                            vm._digest()
                        }
                    } else {
                        ob.notify()
                    }
                }
            )

            /**
             * Set a property on an observed object, calling add to
             * ensure the property is observed.
             *
             * @param {String} key
             * @param {*} val
             * @public
             */

            _.define(
                objProto,
                '$set',
                function $set (key, val) {
                    this.$add(key, val)
                    this[key] = val
                }
            )

            /**
             * Deletes a property from an observed object
             * and emits corresponding event
             *
             * @param {String} key
             * @public
             */

            _.define(
                objProto,
                '$delete',
                function $delete (key) {
                    if (!this.hasOwnProperty(key)) return
                    delete this[key]
                    var ob = this.__ob__
                    if (!ob || _.isReserved(key)) {
                        return
                    }
                    if (ob.vms) {
                        var i = ob.vms.length
                        while (i--) {
                            var vm = ob.vms[i]
                            vm._unproxy(key)
                            vm._digest()
                        }
                    } else {
                        ob.notify()
                    }
                }
            )

            /***/ },
        /* 56 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)
            var addClass = _.addClass
            var removeClass = _.removeClass
            var transDurationProp = _.transitionProp + 'Duration'
            var animDurationProp = _.animationProp + 'Duration'

            var queue = []
            var queued = false

            /**
             * Push a job into the transition queue, which is to be
             * executed on next frame.
             *
             * @param {Element} el    - target element
             * @param {Number} dir    - 1: enter, -1: leave
             * @param {Function} op   - the actual dom operation
             * @param {String} cls    - the className to remove when the
             *                          transition is done.
             * @param {Function} [cb] - user supplied callback.
             */

            function push (el, dir, op, cls, cb) {
                queue.push({
                    el  : el,
                    dir : dir,
                    cb  : cb,
                    cls : cls,
                    op  : op
                })
                if (!queued) {
                    queued = true
                    _.nextTick(flush)
                }
            }

            /**
             * Flush the queue, and do one forced reflow before
             * triggering transitions.
             */

            function flush () {
                /* jshint unused: false */
                var f = document.documentElement.offsetHeight
                queue.forEach(run)
                queue = []
                queued = false
            }

            /**
             * Run a transition job.
             *
             * @param {Object} job
             */

            function run (job) {

                var el = job.el
                var data = el.__v_trans
                var cls = job.cls
                var cb = job.cb
                var op = job.op
                var transitionType = getTransitionType(el, data, cls)

                if (job.dir > 0) { // ENTER
                    if (transitionType === 1) {
                        // trigger transition by removing enter class
                        removeClass(el, cls)
                        // only need to listen for transitionend if there's
                        // a user callback
                        if (cb) setupTransitionCb(_.transitionEndEvent)
                    } else if (transitionType === 2) {
                        // animations are triggered when class is added
                        // so we just listen for animationend to remove it.
                        setupTransitionCb(_.animationEndEvent, function () {
                            removeClass(el, cls)
                        })
                    } else {
                        // no transition applicable
                        removeClass(el, cls)
                        if (cb) cb()
                    }
                } else { // LEAVE
                    if (transitionType) {
                        // leave transitions/animations are both triggered
                        // by adding the class, just remove it on end event.
                        var event = transitionType === 1
                            ? _.transitionEndEvent
                            : _.animationEndEvent
                        setupTransitionCb(event, function () {
                            op()
                            removeClass(el, cls)
                        })
                    } else {
                        op()
                        removeClass(el, cls)
                        if (cb) cb()
                    }
                }

                /**
                 * Set up a transition end callback, store the callback
                 * on the element's __v_trans data object, so we can
                 * clean it up if another transition is triggered before
                 * the callback is fired.
                 *
                 * @param {String} event
                 * @param {Function} [cleanupFn]
                 */

                function setupTransitionCb (event, cleanupFn) {
                    data.event = event
                    var onEnd = data.callback = function transitionCb (e) {
                        if (e.target === el) {
                            _.off(el, event, onEnd)
                            data.event = data.callback = null
                            if (cleanupFn) cleanupFn()
                            if (cb) cb()
                        }
                    }
                    _.on(el, event, onEnd)
                }
            }

            /**
             * Get an element's transition type based on the
             * calculated styles
             *
             * @param {Element} el
             * @param {Object} data
             * @param {String} className
             * @return {Number}
             *         1 - transition
             *         2 - animation
             */

            function getTransitionType (el, data, className) {
                var type = data.cache && data.cache[className]
                if (type) return type
                var inlineStyles = el.style
                var computedStyles = window.getComputedStyle(el)
                var transDuration =
                    inlineStyles[transDurationProp] ||
                    computedStyles[transDurationProp]
                if (transDuration && transDuration !== '0s') {
                    type = 1
                } else {
                    var animDuration =
                        inlineStyles[animDurationProp] ||
                        computedStyles[animDurationProp]
                    if (animDuration && animDuration !== '0s') {
                        type = 2
                    }
                }
                if (type) {
                    if (!data.cache) data.cache = {}
                    data.cache[className] = type
                }
                return type
            }

            /**
             * Apply CSS transition to an element.
             *
             * @param {Element} el
             * @param {Number} direction - 1: enter, -1: leave
             * @param {Function} op - the actual DOM operation
             * @param {Object} data - target element's transition data
             */

            module.exports = function (el, direction, op, data, cb) {
                var prefix = data.id || 'v'
                var enterClass = prefix + '-enter'
                var leaveClass = prefix + '-leave'
                // clean up potential previous unfinished transition
                if (data.callback) {
                    _.off(el, data.event, data.callback)
                    removeClass(el, enterClass)
                    removeClass(el, leaveClass)
                    data.event = data.callback = null
                }
                if (direction > 0) { // enter
                    addClass(el, enterClass)
                    op()
                    push(el, direction, null, enterClass, cb)
                } else { // leave
                    addClass(el, leaveClass)
                    push(el, direction, op, leaveClass, cb)
                }
            }

            /***/ },
        /* 57 */
        /***/ function(module, exports, __webpack_require__) {

            /**
             * Apply JavaScript enter/leave functions.
             *
             * @param {Element} el
             * @param {Number} direction - 1: enter, -1: leave
             * @param {Function} op - the actual DOM operation
             * @param {Object} data - target element's transition data
             * @param {Object} def - transition definition object
             * @param {Vue} vm - the owner vm of the element
             * @param {Function} [cb]
             */

            module.exports = function (el, direction, op, data, def, vm, cb) {
                // if the element is the root of an instance,
                // use that instance as the transition function context
                vm = el.__vue__ || vm
                if (data.cancel) {
                    data.cancel()
                    data.cancel = null
                }
                if (direction > 0) { // enter
                    if (def.beforeEnter) {
                        def.beforeEnter.call(vm, el)
                    }
                    op()
                    if (def.enter) {
                        data.cancel = def.enter.call(vm, el, function () {
                            data.cancel = null
                            if (cb) cb()
                        })
                    } else if (cb) {
                        cb()
                    }
                } else { // leave
                    if (def.leave) {
                        data.cancel = def.leave.call(vm, el, function () {
                            data.cancel = null
                            op()
                            if (cb) cb()
                        })
                    } else {
                        op()
                        if (cb) cb()
                    }
                }
            }

            /***/ },
        /* 58 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)

            module.exports = {

                bind: function () {
                    var self = this
                    var el = this.el

                    // check params
                    // - lazy: update model on "change" instead of "input"
                    var lazy = this._checkParam('lazy') != null
                    // - number: cast value into number when updating model.
                    var number = this._checkParam('number') != null
                    // - debounce: debounce the input listener
                    var debounce = parseInt(this._checkParam('debounce'), 10)

                    // handle composition events.
                    // http://blog.evanyou.me/2014/01/03/composition-event/
                    var cpLocked = false
                    this.cpLock = function () {
                        cpLocked = true
                    }
                    this.cpUnlock = function () {
                        cpLocked = false
                        // in IE11 the "compositionend" event fires AFTER
                        // the "input" event, so the input handler is blocked
                        // at the end... have to call it here.
                        set()
                    }
                    _.on(el,'compositionstart', this.cpLock)
                    _.on(el,'compositionend', this.cpUnlock)

                    // shared setter
                    function set () {
                        self.set(
                            number ? _.toNumber(el.value) : el.value,
                            true
                        )
                    }

                    // if the directive has filters, we need to
                    // record cursor position and restore it after updating
                    // the input with the filtered value.
                    // also force update for type="range" inputs to enable
                    // "lock in range" (see #506)
                    var hasReadFilter = this.filters && this.filters.read
                    this.listener = hasReadFilter || el.type === 'range'
                        ? function textInputListener () {
                        if (cpLocked) return
                        var charsOffset
                        // some HTML5 input types throw error here
                        try {
                            // record how many chars from the end of input
                            // the cursor was at
                            charsOffset = el.value.length - el.selectionStart
                        } catch (e) {}
                        // Fix IE10/11 infinite update cycle
                        // https://github.com/yyx990803/vue/issues/592
                        /* istanbul ignore if */
                        if (charsOffset < 0) {
                            return
                        }
                        set()
                        _.nextTick(function () {
                            // force a value update, because in
                            // certain cases the write filters output the
                            // same result for different input values, and
                            // the Observer set events won't be triggered.
                            var newVal = self._watcher.value
                            self.update(newVal)
                            if (charsOffset != null) {
                                var cursorPos =
                                    _.toString(newVal).length - charsOffset
                                el.setSelectionRange(cursorPos, cursorPos)
                            }
                        })
                    }
                        : function textInputListener () {
                        if (cpLocked) return
                        set()
                    }

                    if (debounce) {
                        this.listener = _.debounce(this.listener, debounce)
                    }
                    this.event = lazy ? 'change' : 'input'
                    // Support jQuery events, since jQuery.trigger() doesn't
                    // trigger native events in some cases and some plugins
                    // rely on $.trigger()
                    // 
                    // We want to make sure if a listener is attached using
                    // jQuery, it is also removed with jQuery, that's why
                    // we do the check for each directive instance and
                    // store that check result on itself. This also allows
                    // easier test coverage control by unsetting the global
                    // jQuery variable in tests.
                    this.hasjQuery = typeof jQuery === 'function'
                    if (this.hasjQuery) {
                        jQuery(el).on(this.event, this.listener)
                    } else {
                        _.on(el, this.event, this.listener)
                    }

                    // IE9 doesn't fire input event on backspace/del/cut
                    if (!lazy && _.isIE9) {
                        this.onCut = function () {
                            _.nextTick(self.listener)
                        }
                        this.onDel = function (e) {
                            if (e.keyCode === 46 || e.keyCode === 8) {
                                self.listener()
                            }
                        }
                        _.on(el, 'cut', this.onCut)
                        _.on(el, 'keyup', this.onDel)
                    }

                    // set initial value if present
                    if (
                        el.hasAttribute('value') ||
                        (el.tagName === 'TEXTAREA' && el.value.trim())
                    ) {
                        this._initValue = number
                            ? _.toNumber(el.value)
                            : el.value
                    }
                },

                update: function (value) {
                    this.el.value = _.toString(value)
                },

                unbind: function () {
                    var el = this.el
                    if (this.hasjQuery) {
                        jQuery(el).off(this.event, this.listener)
                    } else {
                        _.off(el, this.event, this.listener)
                    }
                    _.off(el,'compositionstart', this.cpLock)
                    _.off(el,'compositionend', this.cpUnlock)
                    if (this.onCut) {
                        _.off(el,'cut', this.onCut)
                        _.off(el,'keyup', this.onDel)
                    }
                }

            }

            /***/ },
        /* 59 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)

            module.exports = {

                bind: function () {
                    var self = this
                    var el = this.el
                    this.listener = function () {
                        self.set(el.value, true)
                    }
                    _.on(el, 'change', this.listener)
                    if (el.checked) {
                        this._initValue = el.value
                    }
                },

                update: function (value) {
                    /* jshint eqeqeq: false */
                    this.el.checked = value == this.el.value
                },

                unbind: function () {
                    _.off(this.el, 'change', this.listener)
                }

            }

            /***/ },
        /* 60 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)
            var Watcher = __webpack_require__(25)
            var dirParser = __webpack_require__(21)

            module.exports = {

                bind: function () {
                    var self = this
                    var el = this.el
                    // check options param
                    var optionsParam = this._checkParam('options')
                    if (optionsParam) {
                        initOptions.call(this, optionsParam)
                    }
                    this.number = this._checkParam('number') != null
                    this.multiple = el.hasAttribute('multiple')
                    this.listener = function () {
                        var value = self.multiple
                            ? getMultiValue(el)
                            : el.value
                        value = self.number
                            ? _.isArray(value)
                            ? value.map(_.toNumber)
                            : _.toNumber(value)
                            : value
                        self.set(value, true)
                    }
                    _.on(el, 'change', this.listener)
                    checkInitialValue.call(this)
                },

                update: function (value) {
                    /* jshint eqeqeq: false */
                    var el = this.el
                    el.selectedIndex = -1
                    var multi = this.multiple && _.isArray(value)
                    var options = el.options
                    var i = options.length
                    var option
                    while (i--) {
                        option = options[i]
                        option.selected = multi
                            ? indexOf(value, option.value) > -1
                            : value == option.value
                    }
                },

                unbind: function () {
                    _.off(this.el, 'change', this.listener)
                    if (this.optionWatcher) {
                        this.optionWatcher.teardown()
                    }
                }

            }

            /**
             * Initialize the option list from the param.
             *
             * @param {String} expression
             */

            function initOptions (expression) {
                var self = this
                var descriptor = dirParser.parse(expression)[0]
                function optionUpdateWatcher (value) {
                    if (_.isArray(value)) {
                        self.el.innerHTML = ''
                        buildOptions(self.el, value)
                        if (self._watcher) {
                            self.update(self._watcher.value)
                        }
                    } else {
                        _.warn('Invalid options value for v-model: ' + value)
                    }
                }
                this.optionWatcher = new Watcher(
                    this.vm,
                    descriptor.expression,
                    optionUpdateWatcher,
                    {
                        deep: true,
                        filters: _.resolveFilters(this.vm, descriptor.filters)
                    }
                )
                // update with initial value
                optionUpdateWatcher(this.optionWatcher.value)
            }

            /**
             * Build up option elements. IE9 doesn't create options
             * when setting innerHTML on <select> elements, so we have
             * to use DOM API here.
             *
             * @param {Element} parent - a <select> or an <optgroup>
             * @param {Array} options
             */

            function buildOptions (parent, options) {
                var op, el
                for (var i = 0, l = options.length; i < l; i++) {
                    op = options[i]
                    if (!op.options) {
                        el = document.createElement('option')
                        if (typeof op === 'string') {
                            el.text = el.value = op
                        } else {
                            el.text = op.text
                            el.value = op.value
                        }
                    } else {
                        el = document.createElement('optgroup')
                        el.label = op.label
                        buildOptions(el, op.options)
                    }
                    parent.appendChild(el)
                }
            }

            /**
             * Check the initial value for selected options.
             */

            function checkInitialValue () {
                var initValue
                var options = this.el.options
                for (var i = 0, l = options.length; i < l; i++) {
                    if (options[i].hasAttribute('selected')) {
                        if (this.multiple) {
                            (initValue || (initValue = []))
                                .push(options[i].value)
                        } else {
                            initValue = options[i].value
                        }
                    }
                }
                if (typeof initValue !== 'undefined') {
                    this._initValue = this.number
                        ? _.toNumber(initValue)
                        : initValue
                }
            }

            /**
             * Helper to extract a value array for select[multiple]
             *
             * @param {SelectElement} el
             * @return {Array}
             */

            function getMultiValue (el) {
                return Array.prototype.filter
                    .call(el.options, filterSelected)
                    .map(getOptionValue)
            }

            function filterSelected (op) {
                return op.selected
            }

            function getOptionValue (op) {
                return op.value || op.text
            }

            /**
             * Native Array.indexOf uses strict equal, but in this
             * case we need to match string/numbers with soft equal.
             *
             * @param {Array} arr
             * @param {*} val
             */

            function indexOf (arr, val) {
                /* jshint eqeqeq: false */
                var i = arr.length
                while (i--) {
                    if (arr[i] == val) return i
                }
                return -1
            }

            /***/ },
        /* 61 */
        /***/ function(module, exports, __webpack_require__) {

            var _ = __webpack_require__(11)

            module.exports = {

                bind: function () {
                    var self = this
                    var el = this.el
                    this.listener = function () {
                        self.set(el.checked, true)
                    }
                    _.on(el, 'change', this.listener)
                    if (el.checked) {
                        this._initValue = el.checked
                    }
                },

                update: function (value) {
                    this.el.checked = !!value
                },

                unbind: function () {
                    _.off(this.el, 'change', this.listener)
                }

            }

            /***/ }
        /******/ ])
});
;
/******/ (function(modules) { // webpackBootstrap
    /******/ 	// The module cache
    /******/ 	var installedModules = {};

    /******/ 	// The require function
    /******/ 	function __webpack_require__(moduleId) {

        /******/ 		// Check if module is in cache
        /******/ 		if(installedModules[moduleId])
        /******/ 			return installedModules[moduleId].exports;

        /******/ 		// Create a new module (and put it into the cache)
        /******/ 		var module = installedModules[moduleId] = {
            /******/ 			exports: {},
            /******/ 			id: moduleId,
            /******/ 			loaded: false
            /******/ 		};

        /******/ 		// Execute the module function
        /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

        /******/ 		// Flag the module as loaded
        /******/ 		module.loaded = true;

        /******/ 		// Return the exports of the module
        /******/ 		return module.exports;
        /******/ 	}


    /******/ 	// expose the modules object (__webpack_modules__)
    /******/ 	__webpack_require__.m = modules;

    /******/ 	// expose the module cache
    /******/ 	__webpack_require__.c = installedModules;

    /******/ 	// __webpack_public_path__
    /******/ 	__webpack_require__.p = "";

    /******/ 	// Load entry module and return exports
    /******/ 	return __webpack_require__(0);
    /******/ })
    /************************************************************************/
    /******/ ([
    /* 0 */
    /***/ function(module, exports, __webpack_require__) {

        /**
         * Install plugin.
         */

        function install (Vue) {
            Vue.url = __webpack_require__(1)(Vue);
            Vue.http = __webpack_require__(3)(Vue);
            Vue.resource = __webpack_require__(4)(Vue);
        }

        if (window.Vue) {
            Vue.use(install);
        }

        module.exports = install;


        /***/ },
    /* 1 */
    /***/ function(module, exports, __webpack_require__) {

        module.exports = function (Vue) {

            var _ = __webpack_require__(2)(Vue);

            /**
             * Url provides URL templating.
             *
             * @param {String} url
             * @param {Object} params
             */

            function Url (url, params) {

                var urlParams = {}, queryParams = {}, options = url, query;

                if (!_.isPlainObject(options)) {
                    options = {url: url, params: params};
                }

                options = _.extend({}, Url.options, _.options('url', this, options));

                url = options.url.replace(/:([a-z]\w*)/gi, function (match, name) {

                    if (options.params[name]) {
                        urlParams[name] = true;
                        return encodeUriSegment(options.params[name]);
                    }

                    return '';
                });

                if (!url.match(/^(https?:)?\//) && options.root) {
                    url = options.root + '/' + url;
                }

                url = url.replace(/([^:])[\/]{2,}/g, '$1/');
                url = url.replace(/(\w+)\/+$/, '$1');

                _.each(options.params, function (value, key) {
                    if (!urlParams[key]) {
                        queryParams[key] = value;
                    }
                });

                query = Url.params(queryParams);

                if (query) {
                    url += (url.indexOf('?') == -1 ? '?' : '&') + query;
                }

                return url;
            }

            /**
             * Url options.
             */

            Url.options = {
                url: '',
                root: '',
                params: {}
            };

            /**
             * Encodes a Url parameter string.
             *
             * @param {Object} obj
             */

            Url.params = function (obj) {

                var params = [];

                params.add = function (key, value) {

                    if (_.isFunction (value)) {
                        value = value();
                    }

                    if (value === null) {
                        value = '';
                    }

                    this.push(encodeUriSegment(key) + '=' + encodeUriSegment(value));
                };

                serialize(params, obj);

                return params.join('&');
            };

            /**
             * Parse a URL and return its components.
             *
             * @param {String} url
             */

            Url.parse = function (url) {

                var pattern = new RegExp("^(?:([^:/?#]+):)?(?://([^/?#]*))?([^?#]*)(?:\\?([^#]*))?(?:#(.*))?"),
                    matches = url.match(pattern);

                return {
                    url: url,
                    scheme: matches[1] || '',
                    host: matches[2] || '',
                    path: matches[3] || '',
                    query: matches[4] || '',
                    fragment: matches[5] || ''
                };
            };

            function serialize (params, obj, scope) {

                var array = _.isArray(obj), plain = _.isPlainObject(obj), hash;

                _.each(obj, function (value, key) {

                    hash = _.isObject(value) || _.isArray(value);

                    if (scope) {
                        key = scope + '[' + (plain || hash ? key : '') + ']';
                    }

                    if (!scope && array) {
                        params.add(value.name, value.value);
                    } else if (hash) {
                        serialize(params, value, key);
                    } else {
                        params.add(key, value);
                    }
                });
            }

            function encodeUriSegment (value) {

                return encodeUriQuery(value, true).
                    replace(/%26/gi, '&').
                    replace(/%3D/gi, '=').
                    replace(/%2B/gi, '+');
            }

            function encodeUriQuery (value, spaces) {

                return encodeURIComponent(value).
                    replace(/%40/gi, '@').
                    replace(/%3A/gi, ':').
                    replace(/%24/g, '$').
                    replace(/%2C/gi, ',').
                    replace(/%20/g, (spaces ? '%20' : '+'));
            }

            Object.defineProperty(Vue.prototype, '$url', {

                get: function () {
                    return _.extend(Url.bind(this), Url);
                }

            });

            return Url;
        };


        /***/ },
    /* 2 */
    /***/ function(module, exports, __webpack_require__) {

        /**
         * Utility functions.
         */

        module.exports = function (Vue) {

            var _ = Vue.util.extend({}, Vue.util);

            _.options = function (key, obj, options) {

                var opts = obj.$options || {};

                return _.extend({},
                    opts[key],
                    options
                );
            };

            _.each = function (obj, iterator) {

                var i, key;

                if (typeof obj.length == 'number') {
                    for (i = 0; i < obj.length; i++) {
                        iterator.call(obj[i], obj[i], i);
                    }
                } else if (_.isObject(obj)) {
                    for (key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            iterator.call(obj[key], obj[key], key);
                        }
                    }
                }

                return obj;
            };

            _.extend = function (target) {

                var array = [], args = array.slice.call(arguments, 1), deep;

                if (typeof target == 'boolean') {
                    deep = target;
                    target = args.shift();
                }

                args.forEach(function (arg) {
                    extend(target, arg, deep);
                });

                return target;
            };

            function extend (target, source, deep) {
                for (var key in source) {
                    if (deep && (_.isPlainObject(source[key]) || _.isArray(source[key]))) {
                        if (_.isPlainObject(source[key]) && !_.isPlainObject(target[key])) {
                            target[key] = {};
                        }
                        if (_.isArray(source[key]) && !_.isArray(target[key])) {
                            target[key] = [];
                        }
                        extend(target[key], source[key], deep);
                    } else if (source[key] !== undefined) {
                        target[key] = source[key];
                    }
                }
            }

            _.isFunction = function (obj) {
                return obj && typeof obj === 'function';
            };

            /**
             * Promise polyfill (https://gist.github.com/briancavalier/814313)
             */

            _.Promise = window.Promise;

            if (!_.Promise) {

                _.Promise = function (executor) {
                    executor(this.resolve.bind(this), this.reject.bind(this));
                    this._thens = [];
                };

                _.Promise.prototype = {

                    then: function (onResolve, onReject, onProgress) {
                        this._thens.push({resolve: onResolve, reject: onReject, progress: onProgress});
                    },

                    'catch': function (onReject) {
                        this._thens.push({reject: onReject});
                    },

                    resolve: function (value) {
                        this._complete('resolve', value);
                    },

                    reject: function (reason) {
                        this._complete('reject', reason);
                    },

                    progress: function (status) {

                        var i = 0, aThen;

                        while (aThen = this._thens[i++]) {
                            aThen.progress && aThen.progress(status);
                        }
                    },

                    _complete: function (which, arg) {

                        this.then = which === 'resolve' ?
                            function (resolve, reject) { resolve && resolve(arg); } :
                            function (resolve, reject) { reject && reject(arg); };

                        this.resolve = this.reject = this.progress =
                            function () { throw new Error('Promise already completed.'); };

                        var aThen, i = 0;

                        while (aThen = this._thens[i++]) {
                            aThen[which] && aThen[which](arg);
                        }

                        delete this._thens;
                    }
                };
            }

            return _;
        };


        /***/ },
    /* 3 */
    /***/ function(module, exports, __webpack_require__) {

        module.exports = function (Vue) {

            var _ = __webpack_require__(2)(Vue);
            var jsonType = { 'Content-Type': 'application/json;charset=utf-8' };

            /**
             * Http provides a service for sending XMLHttpRequests.
             */

            function Http (url, options) {

                var self = this, headers, promise;

                options = options || {};

                if (_.isPlainObject(url)) {
                    options = url;
                    url = '';
                }

                headers = _.extend({},
                    Http.headers.common,
                    Http.headers[options.method.toLowerCase()]
                );

                options = _.extend(true, {url: url, headers: headers},
                    Http.options, _.options('http', this, options)
                );

                if (_.isObject(options.data) && /FormData/i.test(options.data.toString())) {
                    delete options.headers['Content-Type'];
                }

                promise = new _.Promise((options.method.toLowerCase() == 'jsonp' ? jsonp : xhr).bind(this, (this.$url || Vue.url), options));

                _.extend(promise, {

                    success: function (onSuccess) {

                        this.then(function (request) {
                            onSuccess.apply(self, parseReq(request));
                        }, function () {});

                        return this;
                    },

                    error: function (onError) {

                        this.catch(function (request) {
                            onError.apply(self, parseReq(request));
                        });

                        return this;
                    },

                    always: function (onAlways) {

                        var cb = function (request) {
                            onAlways.apply(self, parseReq(request));
                        };

                        this.then(cb, cb);

                        return this;
                    }

                });

                if (options.success) {
                    promise.success(options.success);
                }

                if (options.error) {
                    promise.error(options.error);
                }

                return promise;
            }

            function xhr(url, options, resolve, reject) {

                var request = new XMLHttpRequest();

                if (_.isFunction(options.beforeSend)) {
                    options.beforeSend(request, options);
                }

                if (options.emulateHTTP && /^(PUT|PATCH|DELETE)$/i.test(options.method)) {
                    options.headers['X-HTTP-Method-Override'] = options.method;
                    options.method = 'POST';
                }

                if (options.emulateJSON && _.isPlainObject(options.data)) {
                    options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                    options.data = Vue.url.params(options.data);
                }

                if (_.isPlainObject(options.data)) {
                    options.data = JSON.stringify(options.data);
                }

                request.open(options.method, url(options), true);

                _.each(options.headers, function (value, header) {
                    request.setRequestHeader(header, value);
                });

                request.onreadystatechange = function () {

                    if (this.readyState === 4) {

                        if (this.status >= 200 && this.status < 300) {
                            resolve(this);
                        } else {
                            reject(this);
                        }
                    }
                };

                request.send(options.data);
            }

            function jsonp(url, options, resolve, reject) {

                var callback = '_jsonp' + Math.random().toString(36).substr(2), script, result;

                _.extend(options.params, options.data);
                options.params[options.jsonp] = callback;

                if (_.isFunction(options.beforeSend)) {
                    options.beforeSend({}, options);
                }

                script = document.createElement('script');
                script.src = url(options.url, options.params);
                script.type = 'text/javascript';
                script.async = true;

                window[callback] = function (data) {
                    result = data;
                };

                var handler = function (event) {

                    delete window[callback];
                    document.body.removeChild(script);

                    if (event.type === 'load' && !result) {
                        event.type = 'error';
                    }

                    var text = result ? result : event.type, status = event.type === 'error' ? 404 : 200;

                    (status === 200 ? resolve : reject)({ responseText: text, status: status });
                };

                script.onload = handler;
                script.onerror = handler;

                document.body.appendChild(script);
            }

            function parseReq(request) {

                var result;

                try {
                    result = JSON.parse(request.responseText);
                } catch (e) {
                    result = request.responseText;
                }

                return [result, request.status, request];
            }

            Http.options = {
                method: 'GET',
                params: {},
                data: '',
                jsonp: 'callback',
                beforeSend: null,
                emulateHTTP: false,
                emulateJSON: false,
            };

            Http.headers = {
                put: jsonType,
                post: jsonType,
                patch: jsonType,
                delete: jsonType,
                common: { 'Accept': 'application/json, text/plain, */*' }
            };

            ['get', 'put', 'post', 'patch', 'delete', 'jsonp'].forEach(function (method) {

                Http[method] = function (url, data, success, options) {

                    if (_.isFunction(data)) {
                        options = success;
                        success = data;
                        data = undefined;
                    }

                    return this(url, _.extend({method: method, data: data, success: success}, options));
                };
            });

            Object.defineProperty(Vue.prototype, '$http', {

                get: function () {
                    return _.extend(Http.bind(this), Http);
                }

            });

            return Http;
        };


        /***/ },
    /* 4 */
    /***/ function(module, exports, __webpack_require__) {

        module.exports = function (Vue) {

            var _ = __webpack_require__(2)(Vue);

            /**
             * Resource provides interaction support with RESTful services.
             */

            function Resource (url, params, actions) {

                var self = this, resource = {};

                actions = _.extend({},
                    Resource.actions,
                    actions
                );

                _.each(actions, function (action, name) {

                    action = _.extend(true, {url: url, params: params || {}}, action);

                    resource[name] = function () {
                        return (self.$http || Vue.http)(opts(action, arguments));
                    };
                });

                return resource;
            }

            function opts (action, args) {

                var options = _.extend({}, action), params = {}, data, success, error;

                switch (args.length) {

                    case 4:

                        error = args[3];
                        success = args[2];

                    case 3:
                    case 2:

                        if (_.isFunction (args[1])) {

                            if (_.isFunction (args[0])) {

                                success = args[0];
                                error = args[1];

                                break;
                            }

                            success = args[1];
                            error = args[2];

                        } else {

                            params = args[0];
                            data = args[1];
                            success = args[2];

                            break;
                        }

                    case 1:

                        if (_.isFunction (args[0])) {
                            success = args[0];
                        } else if (/^(POST|PUT|PATCH)$/i.test(options.method)) {
                            data = args[0];
                        } else {
                            params = args[0];
                        }

                        break;

                    case 0:

                        break;

                    default:

                        throw 'Expected up to 4 arguments [params, data, success, error], got ' + args.length + ' arguments';
                }

                options.url = action.url;
                options.data = data;
                options.params = _.extend({}, action.params, params);

                if (success) {
                    options.success = success;
                }

                if (error) {
                    options.error = error;
                }

                return options;
            }

            Resource.actions = {

                get: {method: 'GET'},
                save: {method: 'POST'},
                query: {method: 'GET'},
                remove: {method: 'DELETE'},
                delete: {method: 'DELETE'}

            };

            Object.defineProperty(Vue.prototype, '$resource', {

                get: function () {
                    return Resource.bind(this);
                }

            });

            return Resource;
        };


        /***/ }
    /******/ ]);
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.io=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){

module.exports = _dereq_('./lib/');

},{"./lib/":2}],2:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var url = _dereq_('./url');
var parser = _dereq_('socket.io-parser');
var Manager = _dereq_('./manager');
var debug = _dereq_('debug')('socket.io-client');

/**
 * Module exports.
 */

module.exports = exports = lookup;

/**
 * Managers cache.
 */

var cache = exports.managers = {};

/**
 * Looks up an existing `Manager` for multiplexing.
 * If the user summons:
 *
 *   `io('http://localhost/a');`
 *   `io('http://localhost/b');`
 *
 * We reuse the existing instance based on same scheme/port/host,
 * and we initialize sockets for each namespace.
 *
 * @api public
 */

function lookup(uri, opts) {
  if (typeof uri == 'object') {
    opts = uri;
    uri = undefined;
  }

  opts = opts || {};

  var parsed = url(uri);
  var source = parsed.source;
  var id = parsed.id;
  var io;

  if (opts.forceNew || opts['force new connection'] || false === opts.multiplex) {
    debug('ignoring socket cache for %s', source);
    io = Manager(source, opts);
  } else {
    if (!cache[id]) {
      debug('new io instance for %s', source);
      cache[id] = Manager(source, opts);
    }
    io = cache[id];
  }

  return io.socket(parsed.path);
}

/**
 * Protocol version.
 *
 * @api public
 */

exports.protocol = parser.protocol;

/**
 * `connect`.
 *
 * @param {String} uri
 * @api public
 */

exports.connect = lookup;

/**
 * Expose constructors for standalone build.
 *
 * @api public
 */

exports.Manager = _dereq_('./manager');
exports.Socket = _dereq_('./socket');

},{"./manager":3,"./socket":5,"./url":6,"debug":10,"socket.io-parser":46}],3:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var url = _dereq_('./url');
var eio = _dereq_('engine.io-client');
var Socket = _dereq_('./socket');
var Emitter = _dereq_('component-emitter');
var parser = _dereq_('socket.io-parser');
var on = _dereq_('./on');
var bind = _dereq_('component-bind');
var object = _dereq_('object-component');
var debug = _dereq_('debug')('socket.io-client:manager');
var indexOf = _dereq_('indexof');
var Backoff = _dereq_('backo2');

/**
 * Module exports
 */

module.exports = Manager;

/**
 * `Manager` constructor.
 *
 * @param {String} engine instance or engine uri/opts
 * @param {Object} options
 * @api public
 */

function Manager(uri, opts){
  if (!(this instanceof Manager)) return new Manager(uri, opts);
  if (uri && ('object' == typeof uri)) {
    opts = uri;
    uri = undefined;
  }
  opts = opts || {};

  opts.path = opts.path || '/socket.io';
  this.nsps = {};
  this.subs = [];
  this.opts = opts;
  this.reconnection(opts.reconnection !== false);
  this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
  this.reconnectionDelay(opts.reconnectionDelay || 1000);
  this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
  this.randomizationFactor(opts.randomizationFactor || 0.5);
  this.backoff = new Backoff({
    min: this.reconnectionDelay(),
    max: this.reconnectionDelayMax(),
    jitter: this.randomizationFactor()
  });
  this.timeout(null == opts.timeout ? 20000 : opts.timeout);
  this.readyState = 'closed';
  this.uri = uri;
  this.connected = [];
  this.encoding = false;
  this.packetBuffer = [];
  this.encoder = new parser.Encoder();
  this.decoder = new parser.Decoder();
  this.autoConnect = opts.autoConnect !== false;
  if (this.autoConnect) this.open();
}

/**
 * Propagate given event to sockets and emit on `this`
 *
 * @api private
 */

Manager.prototype.emitAll = function() {
  this.emit.apply(this, arguments);
  for (var nsp in this.nsps) {
    this.nsps[nsp].emit.apply(this.nsps[nsp], arguments);
  }
};

/**
 * Update `socket.id` of all sockets
 *
 * @api private
 */

Manager.prototype.updateSocketIds = function(){
  for (var nsp in this.nsps) {
    this.nsps[nsp].id = this.engine.id;
  }
};

/**
 * Mix in `Emitter`.
 */

Emitter(Manager.prototype);

/**
 * Sets the `reconnection` config.
 *
 * @param {Boolean} true/false if it should automatically reconnect
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnection = function(v){
  if (!arguments.length) return this._reconnection;
  this._reconnection = !!v;
  return this;
};

/**
 * Sets the reconnection attempts config.
 *
 * @param {Number} max reconnection attempts before giving up
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionAttempts = function(v){
  if (!arguments.length) return this._reconnectionAttempts;
  this._reconnectionAttempts = v;
  return this;
};

/**
 * Sets the delay between reconnections.
 *
 * @param {Number} delay
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionDelay = function(v){
  if (!arguments.length) return this._reconnectionDelay;
  this._reconnectionDelay = v;
  this.backoff && this.backoff.setMin(v);
  return this;
};

Manager.prototype.randomizationFactor = function(v){
  if (!arguments.length) return this._randomizationFactor;
  this._randomizationFactor = v;
  this.backoff && this.backoff.setJitter(v);
  return this;
};

/**
 * Sets the maximum delay between reconnections.
 *
 * @param {Number} delay
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionDelayMax = function(v){
  if (!arguments.length) return this._reconnectionDelayMax;
  this._reconnectionDelayMax = v;
  this.backoff && this.backoff.setMax(v);
  return this;
};

/**
 * Sets the connection timeout. `false` to disable
 *
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.timeout = function(v){
  if (!arguments.length) return this._timeout;
  this._timeout = v;
  return this;
};

/**
 * Starts trying to reconnect if reconnection is enabled and we have not
 * started reconnecting yet
 *
 * @api private
 */

Manager.prototype.maybeReconnectOnOpen = function() {
  // Only try to reconnect if it's the first time we're connecting
  if (!this.reconnecting && this._reconnection && this.backoff.attempts === 0) {
    // keeps reconnection from firing twice for the same reconnection loop
    this.reconnect();
  }
};


/**
 * Sets the current transport `socket`.
 *
 * @param {Function} optional, callback
 * @return {Manager} self
 * @api public
 */

Manager.prototype.open =
Manager.prototype.connect = function(fn){
  debug('readyState %s', this.readyState);
  if (~this.readyState.indexOf('open')) return this;

  debug('opening %s', this.uri);
  this.engine = eio(this.uri, this.opts);
  var socket = this.engine;
  var self = this;
  this.readyState = 'opening';
  this.skipReconnect = false;

  // emit `open`
  var openSub = on(socket, 'open', function() {
    self.onopen();
    fn && fn();
  });

  // emit `connect_error`
  var errorSub = on(socket, 'error', function(data){
    debug('connect_error');
    self.cleanup();
    self.readyState = 'closed';
    self.emitAll('connect_error', data);
    if (fn) {
      var err = new Error('Connection error');
      err.data = data;
      fn(err);
    } else {
      // Only do this if there is no fn to handle the error
      self.maybeReconnectOnOpen();
    }
  });

  // emit `connect_timeout`
  if (false !== this._timeout) {
    var timeout = this._timeout;
    debug('connect attempt will timeout after %d', timeout);

    // set timer
    var timer = setTimeout(function(){
      debug('connect attempt timed out after %d', timeout);
      openSub.destroy();
      socket.close();
      socket.emit('error', 'timeout');
      self.emitAll('connect_timeout', timeout);
    }, timeout);

    this.subs.push({
      destroy: function(){
        clearTimeout(timer);
      }
    });
  }

  this.subs.push(openSub);
  this.subs.push(errorSub);

  return this;
};

/**
 * Called upon transport open.
 *
 * @api private
 */

Manager.prototype.onopen = function(){
  debug('open');

  // clear old subs
  this.cleanup();

  // mark as open
  this.readyState = 'open';
  this.emit('open');

  // add new subs
  var socket = this.engine;
  this.subs.push(on(socket, 'data', bind(this, 'ondata')));
  this.subs.push(on(this.decoder, 'decoded', bind(this, 'ondecoded')));
  this.subs.push(on(socket, 'error', bind(this, 'onerror')));
  this.subs.push(on(socket, 'close', bind(this, 'onclose')));
};

/**
 * Called with data.
 *
 * @api private
 */

Manager.prototype.ondata = function(data){
  this.decoder.add(data);
};

/**
 * Called when parser fully decodes a packet.
 *
 * @api private
 */

Manager.prototype.ondecoded = function(packet) {
  this.emit('packet', packet);
};

/**
 * Called upon socket error.
 *
 * @api private
 */

Manager.prototype.onerror = function(err){
  debug('error', err);
  this.emitAll('error', err);
};

/**
 * Creates a new socket for the given `nsp`.
 *
 * @return {Socket}
 * @api public
 */

Manager.prototype.socket = function(nsp){
  var socket = this.nsps[nsp];
  if (!socket) {
    socket = new Socket(this, nsp);
    this.nsps[nsp] = socket;
    var self = this;
    socket.on('connect', function(){
      socket.id = self.engine.id;
      if (!~indexOf(self.connected, socket)) {
        self.connected.push(socket);
      }
    });
  }
  return socket;
};

/**
 * Called upon a socket close.
 *
 * @param {Socket} socket
 */

Manager.prototype.destroy = function(socket){
  var index = indexOf(this.connected, socket);
  if (~index) this.connected.splice(index, 1);
  if (this.connected.length) return;

  this.close();
};

/**
 * Writes a packet.
 *
 * @param {Object} packet
 * @api private
 */

Manager.prototype.packet = function(packet){
  debug('writing packet %j', packet);
  var self = this;

  if (!self.encoding) {
    // encode, then write to engine with result
    self.encoding = true;
    this.encoder.encode(packet, function(encodedPackets) {
      for (var i = 0; i < encodedPackets.length; i++) {
        self.engine.write(encodedPackets[i]);
      }
      self.encoding = false;
      self.processPacketQueue();
    });
  } else { // add packet to the queue
    self.packetBuffer.push(packet);
  }
};

/**
 * If packet buffer is non-empty, begins encoding the
 * next packet in line.
 *
 * @api private
 */

Manager.prototype.processPacketQueue = function() {
  if (this.packetBuffer.length > 0 && !this.encoding) {
    var pack = this.packetBuffer.shift();
    this.packet(pack);
  }
};

/**
 * Clean up transport subscriptions and packet buffer.
 *
 * @api private
 */

Manager.prototype.cleanup = function(){
  var sub;
  while (sub = this.subs.shift()) sub.destroy();

  this.packetBuffer = [];
  this.encoding = false;

  this.decoder.destroy();
};

/**
 * Close the current socket.
 *
 * @api private
 */

Manager.prototype.close =
Manager.prototype.disconnect = function(){
  this.skipReconnect = true;
  this.backoff.reset();
  this.readyState = 'closed';
  this.engine && this.engine.close();
};

/**
 * Called upon engine close.
 *
 * @api private
 */

Manager.prototype.onclose = function(reason){
  debug('close');
  this.cleanup();
  this.backoff.reset();
  this.readyState = 'closed';
  this.emit('close', reason);
  if (this._reconnection && !this.skipReconnect) {
    this.reconnect();
  }
};

/**
 * Attempt a reconnection.
 *
 * @api private
 */

Manager.prototype.reconnect = function(){
  if (this.reconnecting || this.skipReconnect) return this;

  var self = this;

  if (this.backoff.attempts >= this._reconnectionAttempts) {
    debug('reconnect failed');
    this.backoff.reset();
    this.emitAll('reconnect_failed');
    this.reconnecting = false;
  } else {
    var delay = this.backoff.duration();
    debug('will wait %dms before reconnect attempt', delay);

    this.reconnecting = true;
    var timer = setTimeout(function(){
      if (self.skipReconnect) return;

      debug('attempting reconnect');
      self.emitAll('reconnect_attempt', self.backoff.attempts);
      self.emitAll('reconnecting', self.backoff.attempts);

      // check again for the case socket closed in above events
      if (self.skipReconnect) return;

      self.open(function(err){
        if (err) {
          debug('reconnect attempt error');
          self.reconnecting = false;
          self.reconnect();
          self.emitAll('reconnect_error', err.data);
        } else {
          debug('reconnect success');
          self.onreconnect();
        }
      });
    }, delay);

    this.subs.push({
      destroy: function(){
        clearTimeout(timer);
      }
    });
  }
};

/**
 * Called upon successful reconnect.
 *
 * @api private
 */

Manager.prototype.onreconnect = function(){
  var attempt = this.backoff.attempts;
  this.reconnecting = false;
  this.backoff.reset();
  this.updateSocketIds();
  this.emitAll('reconnect', attempt);
};

},{"./on":4,"./socket":5,"./url":6,"backo2":7,"component-bind":8,"component-emitter":9,"debug":10,"engine.io-client":11,"indexof":42,"object-component":43,"socket.io-parser":46}],4:[function(_dereq_,module,exports){

/**
 * Module exports.
 */

module.exports = on;

/**
 * Helper for subscriptions.
 *
 * @param {Object|EventEmitter} obj with `Emitter` mixin or `EventEmitter`
 * @param {String} event name
 * @param {Function} callback
 * @api public
 */

function on(obj, ev, fn) {
  obj.on(ev, fn);
  return {
    destroy: function(){
      obj.removeListener(ev, fn);
    }
  };
}

},{}],5:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var parser = _dereq_('socket.io-parser');
var Emitter = _dereq_('component-emitter');
var toArray = _dereq_('to-array');
var on = _dereq_('./on');
var bind = _dereq_('component-bind');
var debug = _dereq_('debug')('socket.io-client:socket');
var hasBin = _dereq_('has-binary');

/**
 * Module exports.
 */

module.exports = exports = Socket;

/**
 * Internal events (blacklisted).
 * These events can't be emitted by the user.
 *
 * @api private
 */

var events = {
  connect: 1,
  connect_error: 1,
  connect_timeout: 1,
  disconnect: 1,
  error: 1,
  reconnect: 1,
  reconnect_attempt: 1,
  reconnect_failed: 1,
  reconnect_error: 1,
  reconnecting: 1
};

/**
 * Shortcut to `Emitter#emit`.
 */

var emit = Emitter.prototype.emit;

/**
 * `Socket` constructor.
 *
 * @api public
 */

function Socket(io, nsp){
  this.io = io;
  this.nsp = nsp;
  this.json = this; // compat
  this.ids = 0;
  this.acks = {};
  if (this.io.autoConnect) this.open();
  this.receiveBuffer = [];
  this.sendBuffer = [];
  this.connected = false;
  this.disconnected = true;
}

/**
 * Mix in `Emitter`.
 */

Emitter(Socket.prototype);

/**
 * Subscribe to open, close and packet events
 *
 * @api private
 */

Socket.prototype.subEvents = function() {
  if (this.subs) return;

  var io = this.io;
  this.subs = [
    on(io, 'open', bind(this, 'onopen')),
    on(io, 'packet', bind(this, 'onpacket')),
    on(io, 'close', bind(this, 'onclose'))
  ];
};

/**
 * "Opens" the socket.
 *
 * @api public
 */

Socket.prototype.open =
Socket.prototype.connect = function(){
  if (this.connected) return this;

  this.subEvents();
  this.io.open(); // ensure open
  if ('open' == this.io.readyState) this.onopen();
  return this;
};

/**
 * Sends a `message` event.
 *
 * @return {Socket} self
 * @api public
 */

Socket.prototype.send = function(){
  var args = toArray(arguments);
  args.unshift('message');
  this.emit.apply(this, args);
  return this;
};

/**
 * Override `emit`.
 * If the event is in `events`, it's emitted normally.
 *
 * @param {String} event name
 * @return {Socket} self
 * @api public
 */

Socket.prototype.emit = function(ev){
  if (events.hasOwnProperty(ev)) {
    emit.apply(this, arguments);
    return this;
  }

  var args = toArray(arguments);
  var parserType = parser.EVENT; // default
  if (hasBin(args)) { parserType = parser.BINARY_EVENT; } // binary
  var packet = { type: parserType, data: args };

  // event ack callback
  if ('function' == typeof args[args.length - 1]) {
    debug('emitting packet with ack id %d', this.ids);
    this.acks[this.ids] = args.pop();
    packet.id = this.ids++;
  }

  if (this.connected) {
    this.packet(packet);
  } else {
    this.sendBuffer.push(packet);
  }

  return this;
};

/**
 * Sends a packet.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.packet = function(packet){
  packet.nsp = this.nsp;
  this.io.packet(packet);
};

/**
 * Called upon engine `open`.
 *
 * @api private
 */

Socket.prototype.onopen = function(){
  debug('transport is open - connecting');

  // write connect packet if necessary
  if ('/' != this.nsp) {
    this.packet({ type: parser.CONNECT });
  }
};

/**
 * Called upon engine `close`.
 *
 * @param {String} reason
 * @api private
 */

Socket.prototype.onclose = function(reason){
  debug('close (%s)', reason);
  this.connected = false;
  this.disconnected = true;
  delete this.id;
  this.emit('disconnect', reason);
};

/**
 * Called with socket packet.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onpacket = function(packet){
  if (packet.nsp != this.nsp) return;

  switch (packet.type) {
    case parser.CONNECT:
      this.onconnect();
      break;

    case parser.EVENT:
      this.onevent(packet);
      break;

    case parser.BINARY_EVENT:
      this.onevent(packet);
      break;

    case parser.ACK:
      this.onack(packet);
      break;

    case parser.BINARY_ACK:
      this.onack(packet);
      break;

    case parser.DISCONNECT:
      this.ondisconnect();
      break;

    case parser.ERROR:
      this.emit('error', packet.data);
      break;
  }
};

/**
 * Called upon a server event.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onevent = function(packet){
  var args = packet.data || [];
  debug('emitting event %j', args);

  if (null != packet.id) {
    debug('attaching ack callback to event');
    args.push(this.ack(packet.id));
  }

  if (this.connected) {
    emit.apply(this, args);
  } else {
    this.receiveBuffer.push(args);
  }
};

/**
 * Produces an ack callback to emit with an event.
 *
 * @api private
 */

Socket.prototype.ack = function(id){
  var self = this;
  var sent = false;
  return function(){
    // prevent double callbacks
    if (sent) return;
    sent = true;
    var args = toArray(arguments);
    debug('sending ack %j', args);

    var type = hasBin(args) ? parser.BINARY_ACK : parser.ACK;
    self.packet({
      type: type,
      id: id,
      data: args
    });
  };
};

/**
 * Called upon a server acknowlegement.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onack = function(packet){
  debug('calling ack %s with %j', packet.id, packet.data);
  var fn = this.acks[packet.id];
  fn.apply(this, packet.data);
  delete this.acks[packet.id];
};

/**
 * Called upon server connect.
 *
 * @api private
 */

Socket.prototype.onconnect = function(){
  this.connected = true;
  this.disconnected = false;
  this.emit('connect');
  this.emitBuffered();
};

/**
 * Emit buffered events (received and emitted).
 *
 * @api private
 */

Socket.prototype.emitBuffered = function(){
  var i;
  for (i = 0; i < this.receiveBuffer.length; i++) {
    emit.apply(this, this.receiveBuffer[i]);
  }
  this.receiveBuffer = [];

  for (i = 0; i < this.sendBuffer.length; i++) {
    this.packet(this.sendBuffer[i]);
  }
  this.sendBuffer = [];
};

/**
 * Called upon server disconnect.
 *
 * @api private
 */

Socket.prototype.ondisconnect = function(){
  debug('server disconnect (%s)', this.nsp);
  this.destroy();
  this.onclose('io server disconnect');
};

/**
 * Called upon forced client/server side disconnections,
 * this method ensures the manager stops tracking us and
 * that reconnections don't get triggered for this.
 *
 * @api private.
 */

Socket.prototype.destroy = function(){
  if (this.subs) {
    // clean subscriptions to avoid reconnections
    for (var i = 0; i < this.subs.length; i++) {
      this.subs[i].destroy();
    }
    this.subs = null;
  }

  this.io.destroy(this);
};

/**
 * Disconnects the socket manually.
 *
 * @return {Socket} self
 * @api public
 */

Socket.prototype.close =
Socket.prototype.disconnect = function(){
  if (this.connected) {
    debug('performing disconnect (%s)', this.nsp);
    this.packet({ type: parser.DISCONNECT });
  }

  // remove socket from pool
  this.destroy();

  if (this.connected) {
    // fire events
    this.onclose('io client disconnect');
  }
  return this;
};

},{"./on":4,"component-bind":8,"component-emitter":9,"debug":10,"has-binary":38,"socket.io-parser":46,"to-array":50}],6:[function(_dereq_,module,exports){
(function (global){

/**
 * Module dependencies.
 */

var parseuri = _dereq_('parseuri');
var debug = _dereq_('debug')('socket.io-client:url');

/**
 * Module exports.
 */

module.exports = url;

/**
 * URL parser.
 *
 * @param {String} url
 * @param {Object} An object meant to mimic window.location.
 *                 Defaults to window.location.
 * @api public
 */

function url(uri, loc){
  var obj = uri;

  // default to window.location
  var loc = loc || global.location;
  if (null == uri) uri = loc.protocol + '//' + loc.host;

  // relative path support
  if ('string' == typeof uri) {
    if ('/' == uri.charAt(0)) {
      if ('/' == uri.charAt(1)) {
        uri = loc.protocol + uri;
      } else {
        uri = loc.hostname + uri;
      }
    }

    if (!/^(https?|wss?):\/\//.test(uri)) {
      debug('protocol-less url %s', uri);
      if ('undefined' != typeof loc) {
        uri = loc.protocol + '//' + uri;
      } else {
        uri = 'https://' + uri;
      }
    }

    // parse
    debug('parse %s', uri);
    obj = parseuri(uri);
  }

  // make sure we treat `localhost:80` and `localhost` equally
  if (!obj.port) {
    if (/^(http|ws)$/.test(obj.protocol)) {
      obj.port = '80';
    }
    else if (/^(http|ws)s$/.test(obj.protocol)) {
      obj.port = '443';
    }
  }

  obj.path = obj.path || '/';

  // define unique id
  obj.id = obj.protocol + '://' + obj.host + ':' + obj.port;
  // define href
  obj.href = obj.protocol + '://' + obj.host + (loc && loc.port == obj.port ? '' : (':' + obj.port));

  return obj;
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"debug":10,"parseuri":44}],7:[function(_dereq_,module,exports){

/**
 * Expose `Backoff`.
 */

module.exports = Backoff;

/**
 * Initialize backoff timer with `opts`.
 *
 * - `min` initial timeout in milliseconds [100]
 * - `max` max timeout [10000]
 * - `jitter` [0]
 * - `factor` [2]
 *
 * @param {Object} opts
 * @api public
 */

function Backoff(opts) {
  opts = opts || {};
  this.ms = opts.min || 100;
  this.max = opts.max || 10000;
  this.factor = opts.factor || 2;
  this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
  this.attempts = 0;
}

/**
 * Return the backoff duration.
 *
 * @return {Number}
 * @api public
 */

Backoff.prototype.duration = function(){
  var ms = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var rand =  Math.random();
    var deviation = Math.floor(rand * this.jitter * ms);
    ms = (Math.floor(rand * 10) & 1) == 0  ? ms - deviation : ms + deviation;
  }
  return Math.min(ms, this.max) | 0;
};

/**
 * Reset the number of attempts.
 *
 * @api public
 */

Backoff.prototype.reset = function(){
  this.attempts = 0;
};

/**
 * Set the minimum duration
 *
 * @api public
 */

Backoff.prototype.setMin = function(min){
  this.ms = min;
};

/**
 * Set the maximum duration
 *
 * @api public
 */

Backoff.prototype.setMax = function(max){
  this.max = max;
};

/**
 * Set the jitter
 *
 * @api public
 */

Backoff.prototype.setJitter = function(jitter){
  this.jitter = jitter;
};


},{}],8:[function(_dereq_,module,exports){
/**
 * Slice reference.
 */

var slice = [].slice;

/**
 * Bind `obj` to `fn`.
 *
 * @param {Object} obj
 * @param {Function|String} fn or string
 * @return {Function}
 * @api public
 */

module.exports = function(obj, fn){
  if ('string' == typeof fn) fn = obj[fn];
  if ('function' != typeof fn) throw new Error('bind() requires a function');
  var args = slice.call(arguments, 2);
  return function(){
    return fn.apply(obj, args.concat(slice.call(arguments)));
  }
};

},{}],9:[function(_dereq_,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],10:[function(_dereq_,module,exports){

/**
 * Expose `debug()` as the module.
 */

module.exports = debug;

/**
 * Create a debugger with the given `name`.
 *
 * @param {String} name
 * @return {Type}
 * @api public
 */

function debug(name) {
  if (!debug.enabled(name)) return function(){};

  return function(fmt){
    fmt = coerce(fmt);

    var curr = new Date;
    var ms = curr - (debug[name] || curr);
    debug[name] = curr;

    fmt = name
      + ' '
      + fmt
      + ' +' + debug.humanize(ms);

    // This hackery is required for IE8
    // where `console.log` doesn't have 'apply'
    window.console
      && console.log
      && Function.prototype.apply.call(console.log, console, arguments);
  }
}

/**
 * The currently active debug mode names.
 */

debug.names = [];
debug.skips = [];

/**
 * Enables a debug mode by name. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} name
 * @api public
 */

debug.enable = function(name) {
  try {
    localStorage.debug = name;
  } catch(e){}

  var split = (name || '').split(/[\s,]+/)
    , len = split.length;

  for (var i = 0; i < len; i++) {
    name = split[i].replace('*', '.*?');
    if (name[0] === '-') {
      debug.skips.push(new RegExp('^' + name.substr(1) + '$'));
    }
    else {
      debug.names.push(new RegExp('^' + name + '$'));
    }
  }
};

/**
 * Disable debug output.
 *
 * @api public
 */

debug.disable = function(){
  debug.enable('');
};

/**
 * Humanize the given `ms`.
 *
 * @param {Number} m
 * @return {String}
 * @api private
 */

debug.humanize = function(ms) {
  var sec = 1000
    , min = 60 * 1000
    , hour = 60 * min;

  if (ms >= hour) return (ms / hour).toFixed(1) + 'h';
  if (ms >= min) return (ms / min).toFixed(1) + 'm';
  if (ms >= sec) return (ms / sec | 0) + 's';
  return ms + 'ms';
};

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

debug.enabled = function(name) {
  for (var i = 0, len = debug.skips.length; i < len; i++) {
    if (debug.skips[i].test(name)) {
      return false;
    }
  }
  for (var i = 0, len = debug.names.length; i < len; i++) {
    if (debug.names[i].test(name)) {
      return true;
    }
  }
  return false;
};

/**
 * Coerce `val`.
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

// persist

try {
  if (window.localStorage) debug.enable(localStorage.debug);
} catch(e){}

},{}],11:[function(_dereq_,module,exports){

module.exports =  _dereq_('./lib/');

},{"./lib/":12}],12:[function(_dereq_,module,exports){

module.exports = _dereq_('./socket');

/**
 * Exports parser
 *
 * @api public
 *
 */
module.exports.parser = _dereq_('engine.io-parser');

},{"./socket":13,"engine.io-parser":25}],13:[function(_dereq_,module,exports){
(function (global){
/**
 * Module dependencies.
 */

var transports = _dereq_('./transports');
var Emitter = _dereq_('component-emitter');
var debug = _dereq_('debug')('engine.io-client:socket');
var index = _dereq_('indexof');
var parser = _dereq_('engine.io-parser');
var parseuri = _dereq_('parseuri');
var parsejson = _dereq_('parsejson');
var parseqs = _dereq_('parseqs');

/**
 * Module exports.
 */

module.exports = Socket;

/**
 * Noop function.
 *
 * @api private
 */

function noop(){}

/**
 * Socket constructor.
 *
 * @param {String|Object} uri or options
 * @param {Object} options
 * @api public
 */

function Socket(uri, opts){
  if (!(this instanceof Socket)) return new Socket(uri, opts);

  opts = opts || {};

  if (uri && 'object' == typeof uri) {
    opts = uri;
    uri = null;
  }

  if (uri) {
    uri = parseuri(uri);
    opts.host = uri.host;
    opts.secure = uri.protocol == 'https' || uri.protocol == 'wss';
    opts.port = uri.port;
    if (uri.query) opts.query = uri.query;
  }

  this.secure = null != opts.secure ? opts.secure :
    (global.location && 'https:' == location.protocol);

  if (opts.host) {
    var pieces = opts.host.split(':');
    opts.hostname = pieces.shift();
    if (pieces.length) {
      opts.port = pieces.pop();
    } else if (!opts.port) {
      // if no port is specified manually, use the protocol default
      opts.port = this.secure ? '443' : '80';
    }
  }

  this.agent = opts.agent || false;
  this.hostname = opts.hostname ||
    (global.location ? location.hostname : 'localhost');
  this.port = opts.port || (global.location && location.port ?
       location.port :
       (this.secure ? 443 : 80));
  this.query = opts.query || {};
  if ('string' == typeof this.query) this.query = parseqs.decode(this.query);
  this.upgrade = false !== opts.upgrade;
  this.path = (opts.path || '/engine.io').replace(/\/$/, '') + '/';
  this.forceJSONP = !!opts.forceJSONP;
  this.jsonp = false !== opts.jsonp;
  this.forceBase64 = !!opts.forceBase64;
  this.enablesXDR = !!opts.enablesXDR;
  this.timestampParam = opts.timestampParam || 't';
  this.timestampRequests = opts.timestampRequests;
  this.transports = opts.transports || ['polling', 'websocket'];
  this.readyState = '';
  this.writeBuffer = [];
  this.callbackBuffer = [];
  this.policyPort = opts.policyPort || 843;
  this.rememberUpgrade = opts.rememberUpgrade || false;
  this.binaryType = null;
  this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades;

  // SSL options for Node.js client
  this.pfx = opts.pfx || null;
  this.key = opts.key || null;
  this.passphrase = opts.passphrase || null;
  this.cert = opts.cert || null;
  this.ca = opts.ca || null;
  this.ciphers = opts.ciphers || null;
  this.rejectUnauthorized = opts.rejectUnauthorized || null;

  this.open();
}

Socket.priorWebsocketSuccess = false;

/**
 * Mix in `Emitter`.
 */

Emitter(Socket.prototype);

/**
 * Protocol version.
 *
 * @api public
 */

Socket.protocol = parser.protocol; // this is an int

/**
 * Expose deps for legacy compatibility
 * and standalone browser access.
 */

Socket.Socket = Socket;
Socket.Transport = _dereq_('./transport');
Socket.transports = _dereq_('./transports');
Socket.parser = _dereq_('engine.io-parser');

/**
 * Creates transport of the given type.
 *
 * @param {String} transport name
 * @return {Transport}
 * @api private
 */

Socket.prototype.createTransport = function (name) {
  debug('creating transport "%s"', name);
  var query = clone(this.query);

  // append engine.io protocol identifier
  query.EIO = parser.protocol;

  // transport name
  query.transport = name;

  // session id if we already have one
  if (this.id) query.sid = this.id;

  var transport = new transports[name]({
    agent: this.agent,
    hostname: this.hostname,
    port: this.port,
    secure: this.secure,
    path: this.path,
    query: query,
    forceJSONP: this.forceJSONP,
    jsonp: this.jsonp,
    forceBase64: this.forceBase64,
    enablesXDR: this.enablesXDR,
    timestampRequests: this.timestampRequests,
    timestampParam: this.timestampParam,
    policyPort: this.policyPort,
    socket: this,
    pfx: this.pfx,
    key: this.key,
    passphrase: this.passphrase,
    cert: this.cert,
    ca: this.ca,
    ciphers: this.ciphers,
    rejectUnauthorized: this.rejectUnauthorized
  });

  return transport;
};

function clone (obj) {
  var o = {};
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      o[i] = obj[i];
    }
  }
  return o;
}

/**
 * Initializes transport to use and starts probe.
 *
 * @api private
 */
Socket.prototype.open = function () {
  var transport;
  if (this.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf('websocket') != -1) {
    transport = 'websocket';
  } else if (0 == this.transports.length) {
    // Emit error on next tick so it can be listened to
    var self = this;
    setTimeout(function() {
      self.emit('error', 'No transports available');
    }, 0);
    return;
  } else {
    transport = this.transports[0];
  }
  this.readyState = 'opening';

  // Retry with the next transport if the transport is disabled (jsonp: false)
  var transport;
  try {
    transport = this.createTransport(transport);
  } catch (e) {
    this.transports.shift();
    this.open();
    return;
  }

  transport.open();
  this.setTransport(transport);
};

/**
 * Sets the current transport. Disables the existing one (if any).
 *
 * @api private
 */

Socket.prototype.setTransport = function(transport){
  debug('setting transport %s', transport.name);
  var self = this;

  if (this.transport) {
    debug('clearing existing transport %s', this.transport.name);
    this.transport.removeAllListeners();
  }

  // set up transport
  this.transport = transport;

  // set up transport listeners
  transport
  .on('drain', function(){
    self.onDrain();
  })
  .on('packet', function(packet){
    self.onPacket(packet);
  })
  .on('error', function(e){
    self.onError(e);
  })
  .on('close', function(){
    self.onClose('transport close');
  });
};

/**
 * Probes a transport.
 *
 * @param {String} transport name
 * @api private
 */

Socket.prototype.probe = function (name) {
  debug('probing transport "%s"', name);
  var transport = this.createTransport(name, { probe: 1 })
    , failed = false
    , self = this;

  Socket.priorWebsocketSuccess = false;

  function onTransportOpen(){
    if (self.onlyBinaryUpgrades) {
      var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;
      failed = failed || upgradeLosesBinary;
    }
    if (failed) return;

    debug('probe transport "%s" opened', name);
    transport.send([{ type: 'ping', data: 'probe' }]);
    transport.once('packet', function (msg) {
      if (failed) return;
      if ('pong' == msg.type && 'probe' == msg.data) {
        debug('probe transport "%s" pong', name);
        self.upgrading = true;
        self.emit('upgrading', transport);
        if (!transport) return;
        Socket.priorWebsocketSuccess = 'websocket' == transport.name;

        debug('pausing current transport "%s"', self.transport.name);
        self.transport.pause(function () {
          if (failed) return;
          if ('closed' == self.readyState) return;
          debug('changing transport and sending upgrade packet');

          cleanup();

          self.setTransport(transport);
          transport.send([{ type: 'upgrade' }]);
          self.emit('upgrade', transport);
          transport = null;
          self.upgrading = false;
          self.flush();
        });
      } else {
        debug('probe transport "%s" failed', name);
        var err = new Error('probe error');
        err.transport = transport.name;
        self.emit('upgradeError', err);
      }
    });
  }

  function freezeTransport() {
    if (failed) return;

    // Any callback called by transport should be ignored since now
    failed = true;

    cleanup();

    transport.close();
    transport = null;
  }

  //Handle any error that happens while probing
  function onerror(err) {
    var error = new Error('probe error: ' + err);
    error.transport = transport.name;

    freezeTransport();

    debug('probe transport "%s" failed because of error: %s', name, err);

    self.emit('upgradeError', error);
  }

  function onTransportClose(){
    onerror("transport closed");
  }

  //When the socket is closed while we're probing
  function onclose(){
    onerror("socket closed");
  }

  //When the socket is upgraded while we're probing
  function onupgrade(to){
    if (transport && to.name != transport.name) {
      debug('"%s" works - aborting "%s"', to.name, transport.name);
      freezeTransport();
    }
  }

  //Remove all listeners on the transport and on self
  function cleanup(){
    transport.removeListener('open', onTransportOpen);
    transport.removeListener('error', onerror);
    transport.removeListener('close', onTransportClose);
    self.removeListener('close', onclose);
    self.removeListener('upgrading', onupgrade);
  }

  transport.once('open', onTransportOpen);
  transport.once('error', onerror);
  transport.once('close', onTransportClose);

  this.once('close', onclose);
  this.once('upgrading', onupgrade);

  transport.open();

};

/**
 * Called when connection is deemed open.
 *
 * @api public
 */

Socket.prototype.onOpen = function () {
  debug('socket open');
  this.readyState = 'open';
  Socket.priorWebsocketSuccess = 'websocket' == this.transport.name;
  this.emit('open');
  this.flush();

  // we check for `readyState` in case an `open`
  // listener already closed the socket
  if ('open' == this.readyState && this.upgrade && this.transport.pause) {
    debug('starting upgrade probes');
    for (var i = 0, l = this.upgrades.length; i < l; i++) {
      this.probe(this.upgrades[i]);
    }
  }
};

/**
 * Handles a packet.
 *
 * @api private
 */

Socket.prototype.onPacket = function (packet) {
  if ('opening' == this.readyState || 'open' == this.readyState) {
    debug('socket receive: type "%s", data "%s"', packet.type, packet.data);

    this.emit('packet', packet);

    // Socket is live - any packet counts
    this.emit('heartbeat');

    switch (packet.type) {
      case 'open':
        this.onHandshake(parsejson(packet.data));
        break;

      case 'pong':
        this.setPing();
        break;

      case 'error':
        var err = new Error('server error');
        err.code = packet.data;
        this.emit('error', err);
        break;

      case 'message':
        this.emit('data', packet.data);
        this.emit('message', packet.data);
        break;
    }
  } else {
    debug('packet received with socket readyState "%s"', this.readyState);
  }
};

/**
 * Called upon handshake completion.
 *
 * @param {Object} handshake obj
 * @api private
 */

Socket.prototype.onHandshake = function (data) {
  this.emit('handshake', data);
  this.id = data.sid;
  this.transport.query.sid = data.sid;
  this.upgrades = this.filterUpgrades(data.upgrades);
  this.pingInterval = data.pingInterval;
  this.pingTimeout = data.pingTimeout;
  this.onOpen();
  // In case open handler closes socket
  if  ('closed' == this.readyState) return;
  this.setPing();

  // Prolong liveness of socket on heartbeat
  this.removeListener('heartbeat', this.onHeartbeat);
  this.on('heartbeat', this.onHeartbeat);
};

/**
 * Resets ping timeout.
 *
 * @api private
 */

Socket.prototype.onHeartbeat = function (timeout) {
  clearTimeout(this.pingTimeoutTimer);
  var self = this;
  self.pingTimeoutTimer = setTimeout(function () {
    if ('closed' == self.readyState) return;
    self.onClose('ping timeout');
  }, timeout || (self.pingInterval + self.pingTimeout));
};

/**
 * Pings server every `this.pingInterval` and expects response
 * within `this.pingTimeout` or closes connection.
 *
 * @api private
 */

Socket.prototype.setPing = function () {
  var self = this;
  clearTimeout(self.pingIntervalTimer);
  self.pingIntervalTimer = setTimeout(function () {
    debug('writing ping packet - expecting pong within %sms', self.pingTimeout);
    self.ping();
    self.onHeartbeat(self.pingTimeout);
  }, self.pingInterval);
};

/**
* Sends a ping packet.
*
* @api public
*/

Socket.prototype.ping = function () {
  this.sendPacket('ping');
};

/**
 * Called on `drain` event
 *
 * @api private
 */

Socket.prototype.onDrain = function() {
  for (var i = 0; i < this.prevBufferLen; i++) {
    if (this.callbackBuffer[i]) {
      this.callbackBuffer[i]();
    }
  }

  this.writeBuffer.splice(0, this.prevBufferLen);
  this.callbackBuffer.splice(0, this.prevBufferLen);

  // setting prevBufferLen = 0 is very important
  // for example, when upgrading, upgrade packet is sent over,
  // and a nonzero prevBufferLen could cause problems on `drain`
  this.prevBufferLen = 0;

  if (this.writeBuffer.length == 0) {
    this.emit('drain');
  } else {
    this.flush();
  }
};

/**
 * Flush write buffers.
 *
 * @api private
 */

Socket.prototype.flush = function () {
  if ('closed' != this.readyState && this.transport.writable &&
    !this.upgrading && this.writeBuffer.length) {
    debug('flushing %d packets in socket', this.writeBuffer.length);
    this.transport.send(this.writeBuffer);
    // keep track of current length of writeBuffer
    // splice writeBuffer and callbackBuffer on `drain`
    this.prevBufferLen = this.writeBuffer.length;
    this.emit('flush');
  }
};

/**
 * Sends a message.
 *
 * @param {String} message.
 * @param {Function} callback function.
 * @return {Socket} for chaining.
 * @api public
 */

Socket.prototype.write =
Socket.prototype.send = function (msg, fn) {
  this.sendPacket('message', msg, fn);
  return this;
};

/**
 * Sends a packet.
 *
 * @param {String} packet type.
 * @param {String} data.
 * @param {Function} callback function.
 * @api private
 */

Socket.prototype.sendPacket = function (type, data, fn) {
  if ('closing' == this.readyState || 'closed' == this.readyState) {
    return;
  }

  var packet = { type: type, data: data };
  this.emit('packetCreate', packet);
  this.writeBuffer.push(packet);
  this.callbackBuffer.push(fn);
  this.flush();
};

/**
 * Closes the connection.
 *
 * @api private
 */

Socket.prototype.close = function () {
  if ('opening' == this.readyState || 'open' == this.readyState) {
    this.readyState = 'closing';

    var self = this;

    function close() {
      self.onClose('forced close');
      debug('socket closing - telling transport to close');
      self.transport.close();
    }

    function cleanupAndClose() {
      self.removeListener('upgrade', cleanupAndClose);
      self.removeListener('upgradeError', cleanupAndClose);
      close();
    }

    function waitForUpgrade() {
      // wait for upgrade to finish since we can't send packets while pausing a transport
      self.once('upgrade', cleanupAndClose);
      self.once('upgradeError', cleanupAndClose);
    }

    if (this.writeBuffer.length) {
      this.once('drain', function() {
        if (this.upgrading) {
          waitForUpgrade();
        } else {
          close();
        }
      });
    } else if (this.upgrading) {
      waitForUpgrade();
    } else {
      close();
    }
  }

  return this;
};

/**
 * Called upon transport error
 *
 * @api private
 */

Socket.prototype.onError = function (err) {
  debug('socket error %j', err);
  Socket.priorWebsocketSuccess = false;
  this.emit('error', err);
  this.onClose('transport error', err);
};

/**
 * Called upon transport close.
 *
 * @api private
 */

Socket.prototype.onClose = function (reason, desc) {
  if ('opening' == this.readyState || 'open' == this.readyState || 'closing' == this.readyState) {
    debug('socket close with reason: "%s"', reason);
    var self = this;

    // clear timers
    clearTimeout(this.pingIntervalTimer);
    clearTimeout(this.pingTimeoutTimer);

    // clean buffers in next tick, so developers can still
    // grab the buffers on `close` event
    setTimeout(function() {
      self.writeBuffer = [];
      self.callbackBuffer = [];
      self.prevBufferLen = 0;
    }, 0);

    // stop event from firing again for transport
    this.transport.removeAllListeners('close');

    // ensure transport won't stay open
    this.transport.close();

    // ignore further transport communication
    this.transport.removeAllListeners();

    // set ready state
    this.readyState = 'closed';

    // clear session id
    this.id = null;

    // emit close event
    this.emit('close', reason, desc);
  }
};

/**
 * Filters upgrades, returning only those matching client transports.
 *
 * @param {Array} server upgrades
 * @api private
 *
 */

Socket.prototype.filterUpgrades = function (upgrades) {
  var filteredUpgrades = [];
  for (var i = 0, j = upgrades.length; i<j; i++) {
    if (~index(this.transports, upgrades[i])) filteredUpgrades.push(upgrades[i]);
  }
  return filteredUpgrades;
};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./transport":14,"./transports":15,"component-emitter":9,"debug":22,"engine.io-parser":25,"indexof":42,"parsejson":34,"parseqs":35,"parseuri":36}],14:[function(_dereq_,module,exports){
/**
 * Module dependencies.
 */

var parser = _dereq_('engine.io-parser');
var Emitter = _dereq_('component-emitter');

/**
 * Module exports.
 */

module.exports = Transport;

/**
 * Transport abstract constructor.
 *
 * @param {Object} options.
 * @api private
 */

function Transport (opts) {
  this.path = opts.path;
  this.hostname = opts.hostname;
  this.port = opts.port;
  this.secure = opts.secure;
  this.query = opts.query;
  this.timestampParam = opts.timestampParam;
  this.timestampRequests = opts.timestampRequests;
  this.readyState = '';
  this.agent = opts.agent || false;
  this.socket = opts.socket;
  this.enablesXDR = opts.enablesXDR;

  // SSL options for Node.js client
  this.pfx = opts.pfx;
  this.key = opts.key;
  this.passphrase = opts.passphrase;
  this.cert = opts.cert;
  this.ca = opts.ca;
  this.ciphers = opts.ciphers;
  this.rejectUnauthorized = opts.rejectUnauthorized;
}

/**
 * Mix in `Emitter`.
 */

Emitter(Transport.prototype);

/**
 * A counter used to prevent collisions in the timestamps used
 * for cache busting.
 */

Transport.timestamps = 0;

/**
 * Emits an error.
 *
 * @param {String} str
 * @return {Transport} for chaining
 * @api public
 */

Transport.prototype.onError = function (msg, desc) {
  var err = new Error(msg);
  err.type = 'TransportError';
  err.description = desc;
  this.emit('error', err);
  return this;
};

/**
 * Opens the transport.
 *
 * @api public
 */

Transport.prototype.open = function () {
  if ('closed' == this.readyState || '' == this.readyState) {
    this.readyState = 'opening';
    this.doOpen();
  }

  return this;
};

/**
 * Closes the transport.
 *
 * @api private
 */

Transport.prototype.close = function () {
  if ('opening' == this.readyState || 'open' == this.readyState) {
    this.doClose();
    this.onClose();
  }

  return this;
};

/**
 * Sends multiple packets.
 *
 * @param {Array} packets
 * @api private
 */

Transport.prototype.send = function(packets){
  if ('open' == this.readyState) {
    this.write(packets);
  } else {
    throw new Error('Transport not open');
  }
};

/**
 * Called upon open
 *
 * @api private
 */

Transport.prototype.onOpen = function () {
  this.readyState = 'open';
  this.writable = true;
  this.emit('open');
};

/**
 * Called with data.
 *
 * @param {String} data
 * @api private
 */

Transport.prototype.onData = function(data){
  var packet = parser.decodePacket(data, this.socket.binaryType);
  this.onPacket(packet);
};

/**
 * Called with a decoded packet.
 */

Transport.prototype.onPacket = function (packet) {
  this.emit('packet', packet);
};

/**
 * Called upon close.
 *
 * @api private
 */

Transport.prototype.onClose = function () {
  this.readyState = 'closed';
  this.emit('close');
};

},{"component-emitter":9,"engine.io-parser":25}],15:[function(_dereq_,module,exports){
(function (global){
/**
 * Module dependencies
 */

var XMLHttpRequest = _dereq_('xmlhttprequest');
var XHR = _dereq_('./polling-xhr');
var JSONP = _dereq_('./polling-jsonp');
var websocket = _dereq_('./websocket');

/**
 * Export transports.
 */

exports.polling = polling;
exports.websocket = websocket;

/**
 * Polling transport polymorphic constructor.
 * Decides on xhr vs jsonp based on feature detection.
 *
 * @api private
 */

function polling(opts){
  var xhr;
  var xd = false;
  var xs = false;
  var jsonp = false !== opts.jsonp;

  if (global.location) {
    var isSSL = 'https:' == location.protocol;
    var port = location.port;

    // some user agents have empty `location.port`
    if (!port) {
      port = isSSL ? 443 : 80;
    }

    xd = opts.hostname != location.hostname || port != opts.port;
    xs = opts.secure != isSSL;
  }

  opts.xdomain = xd;
  opts.xscheme = xs;
  xhr = new XMLHttpRequest(opts);

  if ('open' in xhr && !opts.forceJSONP) {
    return new XHR(opts);
  } else {
    if (!jsonp) throw new Error('JSONP disabled');
    return new JSONP(opts);
  }
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./polling-jsonp":16,"./polling-xhr":17,"./websocket":19,"xmlhttprequest":20}],16:[function(_dereq_,module,exports){
(function (global){

/**
 * Module requirements.
 */

var Polling = _dereq_('./polling');
var inherit = _dereq_('component-inherit');

/**
 * Module exports.
 */

module.exports = JSONPPolling;

/**
 * Cached regular expressions.
 */

var rNewline = /\n/g;
var rEscapedNewline = /\\n/g;

/**
 * Global JSONP callbacks.
 */

var callbacks;

/**
 * Callbacks count.
 */

var index = 0;

/**
 * Noop.
 */

function empty () { }

/**
 * JSONP Polling constructor.
 *
 * @param {Object} opts.
 * @api public
 */

function JSONPPolling (opts) {
  Polling.call(this, opts);

  this.query = this.query || {};

  // define global callbacks array if not present
  // we do this here (lazily) to avoid unneeded global pollution
  if (!callbacks) {
    // we need to consider multiple engines in the same page
    if (!global.___eio) global.___eio = [];
    callbacks = global.___eio;
  }

  // callback identifier
  this.index = callbacks.length;

  // add callback to jsonp global
  var self = this;
  callbacks.push(function (msg) {
    self.onData(msg);
  });

  // append to query string
  this.query.j = this.index;

  // prevent spurious errors from being emitted when the window is unloaded
  if (global.document && global.addEventListener) {
    global.addEventListener('beforeunload', function () {
      if (self.script) self.script.onerror = empty;
    }, false);
  }
}

/**
 * Inherits from Polling.
 */

inherit(JSONPPolling, Polling);

/*
 * JSONP only supports binary as base64 encoded strings
 */

JSONPPolling.prototype.supportsBinary = false;

/**
 * Closes the socket.
 *
 * @api private
 */

JSONPPolling.prototype.doClose = function () {
  if (this.script) {
    this.script.parentNode.removeChild(this.script);
    this.script = null;
  }

  if (this.form) {
    this.form.parentNode.removeChild(this.form);
    this.form = null;
    this.iframe = null;
  }

  Polling.prototype.doClose.call(this);
};

/**
 * Starts a poll cycle.
 *
 * @api private
 */

JSONPPolling.prototype.doPoll = function () {
  var self = this;
  var script = document.createElement('script');

  if (this.script) {
    this.script.parentNode.removeChild(this.script);
    this.script = null;
  }

  script.async = true;
  script.src = this.uri();
  script.onerror = function(e){
    self.onError('jsonp poll error',e);
  };

  var insertAt = document.getElementsByTagName('script')[0];
  insertAt.parentNode.insertBefore(script, insertAt);
  this.script = script;

  var isUAgecko = 'undefined' != typeof navigator && /gecko/i.test(navigator.userAgent);
  
  if (isUAgecko) {
    setTimeout(function () {
      var iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      document.body.removeChild(iframe);
    }, 100);
  }
};

/**
 * Writes with a hidden iframe.
 *
 * @param {String} data to send
 * @param {Function} called upon flush.
 * @api private
 */

JSONPPolling.prototype.doWrite = function (data, fn) {
  var self = this;

  if (!this.form) {
    var form = document.createElement('form');
    var area = document.createElement('textarea');
    var id = this.iframeId = 'eio_iframe_' + this.index;
    var iframe;

    form.className = 'socketio';
    form.style.position = 'absolute';
    form.style.top = '-1000px';
    form.style.left = '-1000px';
    form.target = id;
    form.method = 'POST';
    form.setAttribute('accept-charset', 'utf-8');
    area.name = 'd';
    form.appendChild(area);
    document.body.appendChild(form);

    this.form = form;
    this.area = area;
  }

  this.form.action = this.uri();

  function complete () {
    initIframe();
    fn();
  }

  function initIframe () {
    if (self.iframe) {
      try {
        self.form.removeChild(self.iframe);
      } catch (e) {
        self.onError('jsonp polling iframe removal error', e);
      }
    }

    try {
      // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
      var html = '<iframe src="javascript:0" name="'+ self.iframeId +'">';
      iframe = document.createElement(html);
    } catch (e) {
      iframe = document.createElement('iframe');
      iframe.name = self.iframeId;
      iframe.src = 'javascript:0';
    }

    iframe.id = self.iframeId;

    self.form.appendChild(iframe);
    self.iframe = iframe;
  }

  initIframe();

  // escape \n to prevent it from being converted into \r\n by some UAs
  // double escaping is required for escaped new lines because unescaping of new lines can be done safely on server-side
  data = data.replace(rEscapedNewline, '\\\n');
  this.area.value = data.replace(rNewline, '\\n');

  try {
    this.form.submit();
  } catch(e) {}

  if (this.iframe.attachEvent) {
    this.iframe.onreadystatechange = function(){
      if (self.iframe.readyState == 'complete') {
        complete();
      }
    };
  } else {
    this.iframe.onload = complete;
  }
};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./polling":18,"component-inherit":21}],17:[function(_dereq_,module,exports){
(function (global){
/**
 * Module requirements.
 */

var XMLHttpRequest = _dereq_('xmlhttprequest');
var Polling = _dereq_('./polling');
var Emitter = _dereq_('component-emitter');
var inherit = _dereq_('component-inherit');
var debug = _dereq_('debug')('engine.io-client:polling-xhr');

/**
 * Module exports.
 */

module.exports = XHR;
module.exports.Request = Request;

/**
 * Empty function
 */

function empty(){}

/**
 * XHR Polling constructor.
 *
 * @param {Object} opts
 * @api public
 */

function XHR(opts){
  Polling.call(this, opts);

  if (global.location) {
    var isSSL = 'https:' == location.protocol;
    var port = location.port;

    // some user agents have empty `location.port`
    if (!port) {
      port = isSSL ? 443 : 80;
    }

    this.xd = opts.hostname != global.location.hostname ||
      port != opts.port;
    this.xs = opts.secure != isSSL;
  }
}

/**
 * Inherits from Polling.
 */

inherit(XHR, Polling);

/**
 * XHR supports binary
 */

XHR.prototype.supportsBinary = true;

/**
 * Creates a request.
 *
 * @param {String} method
 * @api private
 */

XHR.prototype.request = function(opts){
  opts = opts || {};
  opts.uri = this.uri();
  opts.xd = this.xd;
  opts.xs = this.xs;
  opts.agent = this.agent || false;
  opts.supportsBinary = this.supportsBinary;
  opts.enablesXDR = this.enablesXDR;

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;

  return new Request(opts);
};

/**
 * Sends data.
 *
 * @param {String} data to send.
 * @param {Function} called upon flush.
 * @api private
 */

XHR.prototype.doWrite = function(data, fn){
  var isBinary = typeof data !== 'string' && data !== undefined;
  var req = this.request({ method: 'POST', data: data, isBinary: isBinary });
  var self = this;
  req.on('success', fn);
  req.on('error', function(err){
    self.onError('xhr post error', err);
  });
  this.sendXhr = req;
};

/**
 * Starts a poll cycle.
 *
 * @api private
 */

XHR.prototype.doPoll = function(){
  debug('xhr poll');
  var req = this.request();
  var self = this;
  req.on('data', function(data){
    self.onData(data);
  });
  req.on('error', function(err){
    self.onError('xhr poll error', err);
  });
  this.pollXhr = req;
};

/**
 * Request constructor
 *
 * @param {Object} options
 * @api public
 */

function Request(opts){
  this.method = opts.method || 'GET';
  this.uri = opts.uri;
  this.xd = !!opts.xd;
  this.xs = !!opts.xs;
  this.async = false !== opts.async;
  this.data = undefined != opts.data ? opts.data : null;
  this.agent = opts.agent;
  this.isBinary = opts.isBinary;
  this.supportsBinary = opts.supportsBinary;
  this.enablesXDR = opts.enablesXDR;

  // SSL options for Node.js client
  this.pfx = opts.pfx;
  this.key = opts.key;
  this.passphrase = opts.passphrase;
  this.cert = opts.cert;
  this.ca = opts.ca;
  this.ciphers = opts.ciphers;
  this.rejectUnauthorized = opts.rejectUnauthorized;

  this.create();
}

/**
 * Mix in `Emitter`.
 */

Emitter(Request.prototype);

/**
 * Creates the XHR object and sends the request.
 *
 * @api private
 */

Request.prototype.create = function(){
  var opts = { agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR };

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;

  var xhr = this.xhr = new XMLHttpRequest(opts);
  var self = this;

  try {
    debug('xhr open %s: %s', this.method, this.uri);
    xhr.open(this.method, this.uri, this.async);
    if (this.supportsBinary) {
      // This has to be done after open because Firefox is stupid
      // http://stackoverflow.com/questions/13216903/get-binary-data-with-xmlhttprequest-in-a-firefox-extension
      xhr.responseType = 'arraybuffer';
    }

    if ('POST' == this.method) {
      try {
        if (this.isBinary) {
          xhr.setRequestHeader('Content-type', 'application/octet-stream');
        } else {
          xhr.setRequestHeader('Content-type', 'text/plain;charset=UTF-8');
        }
      } catch (e) {}
    }

    // ie6 check
    if ('withCredentials' in xhr) {
      xhr.withCredentials = true;
    }

    if (this.hasXDR()) {
      xhr.onload = function(){
        self.onLoad();
      };
      xhr.onerror = function(){
        self.onError(xhr.responseText);
      };
    } else {
      xhr.onreadystatechange = function(){
        if (4 != xhr.readyState) return;
        if (200 == xhr.status || 1223 == xhr.status) {
          self.onLoad();
        } else {
          // make sure the `error` event handler that's user-set
          // does not throw in the same tick and gets caught here
          setTimeout(function(){
            self.onError(xhr.status);
          }, 0);
        }
      };
    }

    debug('xhr data %s', this.data);
    xhr.send(this.data);
  } catch (e) {
    // Need to defer since .create() is called directly fhrom the constructor
    // and thus the 'error' event can only be only bound *after* this exception
    // occurs.  Therefore, also, we cannot throw here at all.
    setTimeout(function() {
      self.onError(e);
    }, 0);
    return;
  }

  if (global.document) {
    this.index = Request.requestsCount++;
    Request.requests[this.index] = this;
  }
};

/**
 * Called upon successful response.
 *
 * @api private
 */

Request.prototype.onSuccess = function(){
  this.emit('success');
  this.cleanup();
};

/**
 * Called if we have data.
 *
 * @api private
 */

Request.prototype.onData = function(data){
  this.emit('data', data);
  this.onSuccess();
};

/**
 * Called upon error.
 *
 * @api private
 */

Request.prototype.onError = function(err){
  this.emit('error', err);
  this.cleanup(true);
};

/**
 * Cleans up house.
 *
 * @api private
 */

Request.prototype.cleanup = function(fromError){
  if ('undefined' == typeof this.xhr || null === this.xhr) {
    return;
  }
  // xmlhttprequest
  if (this.hasXDR()) {
    this.xhr.onload = this.xhr.onerror = empty;
  } else {
    this.xhr.onreadystatechange = empty;
  }

  if (fromError) {
    try {
      this.xhr.abort();
    } catch(e) {}
  }

  if (global.document) {
    delete Request.requests[this.index];
  }

  this.xhr = null;
};

/**
 * Called upon load.
 *
 * @api private
 */

Request.prototype.onLoad = function(){
  var data;
  try {
    var contentType;
    try {
      contentType = this.xhr.getResponseHeader('Content-Type').split(';')[0];
    } catch (e) {}
    if (contentType === 'application/octet-stream') {
      data = this.xhr.response;
    } else {
      if (!this.supportsBinary) {
        data = this.xhr.responseText;
      } else {
        data = 'ok';
      }
    }
  } catch (e) {
    this.onError(e);
  }
  if (null != data) {
    this.onData(data);
  }
};

/**
 * Check if it has XDomainRequest.
 *
 * @api private
 */

Request.prototype.hasXDR = function(){
  return 'undefined' !== typeof global.XDomainRequest && !this.xs && this.enablesXDR;
};

/**
 * Aborts the request.
 *
 * @api public
 */

Request.prototype.abort = function(){
  this.cleanup();
};

/**
 * Aborts pending requests when unloading the window. This is needed to prevent
 * memory leaks (e.g. when using IE) and to ensure that no spurious error is
 * emitted.
 */

if (global.document) {
  Request.requestsCount = 0;
  Request.requests = {};
  if (global.attachEvent) {
    global.attachEvent('onunload', unloadHandler);
  } else if (global.addEventListener) {
    global.addEventListener('beforeunload', unloadHandler, false);
  }
}

function unloadHandler() {
  for (var i in Request.requests) {
    if (Request.requests.hasOwnProperty(i)) {
      Request.requests[i].abort();
    }
  }
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./polling":18,"component-emitter":9,"component-inherit":21,"debug":22,"xmlhttprequest":20}],18:[function(_dereq_,module,exports){
/**
 * Module dependencies.
 */

var Transport = _dereq_('../transport');
var parseqs = _dereq_('parseqs');
var parser = _dereq_('engine.io-parser');
var inherit = _dereq_('component-inherit');
var debug = _dereq_('debug')('engine.io-client:polling');

/**
 * Module exports.
 */

module.exports = Polling;

/**
 * Is XHR2 supported?
 */

var hasXHR2 = (function() {
  var XMLHttpRequest = _dereq_('xmlhttprequest');
  var xhr = new XMLHttpRequest({ xdomain: false });
  return null != xhr.responseType;
})();

/**
 * Polling interface.
 *
 * @param {Object} opts
 * @api private
 */

function Polling(opts){
  var forceBase64 = (opts && opts.forceBase64);
  if (!hasXHR2 || forceBase64) {
    this.supportsBinary = false;
  }
  Transport.call(this, opts);
}

/**
 * Inherits from Transport.
 */

inherit(Polling, Transport);

/**
 * Transport name.
 */

Polling.prototype.name = 'polling';

/**
 * Opens the socket (triggers polling). We write a PING message to determine
 * when the transport is open.
 *
 * @api private
 */

Polling.prototype.doOpen = function(){
  this.poll();
};

/**
 * Pauses polling.
 *
 * @param {Function} callback upon buffers are flushed and transport is paused
 * @api private
 */

Polling.prototype.pause = function(onPause){
  var pending = 0;
  var self = this;

  this.readyState = 'pausing';

  function pause(){
    debug('paused');
    self.readyState = 'paused';
    onPause();
  }

  if (this.polling || !this.writable) {
    var total = 0;

    if (this.polling) {
      debug('we are currently polling - waiting to pause');
      total++;
      this.once('pollComplete', function(){
        debug('pre-pause polling complete');
        --total || pause();
      });
    }

    if (!this.writable) {
      debug('we are currently writing - waiting to pause');
      total++;
      this.once('drain', function(){
        debug('pre-pause writing complete');
        --total || pause();
      });
    }
  } else {
    pause();
  }
};

/**
 * Starts polling cycle.
 *
 * @api public
 */

Polling.prototype.poll = function(){
  debug('polling');
  this.polling = true;
  this.doPoll();
  this.emit('poll');
};

/**
 * Overloads onData to detect payloads.
 *
 * @api private
 */

Polling.prototype.onData = function(data){
  var self = this;
  debug('polling got data %s', data);
  var callback = function(packet, index, total) {
    // if its the first message we consider the transport open
    if ('opening' == self.readyState) {
      self.onOpen();
    }

    // if its a close packet, we close the ongoing requests
    if ('close' == packet.type) {
      self.onClose();
      return false;
    }

    // otherwise bypass onData and handle the message
    self.onPacket(packet);
  };

  // decode payload
  parser.decodePayload(data, this.socket.binaryType, callback);

  // if an event did not trigger closing
  if ('closed' != this.readyState) {
    // if we got data we're not polling
    this.polling = false;
    this.emit('pollComplete');

    if ('open' == this.readyState) {
      this.poll();
    } else {
      debug('ignoring poll - transport state "%s"', this.readyState);
    }
  }
};

/**
 * For polling, send a close packet.
 *
 * @api private
 */

Polling.prototype.doClose = function(){
  var self = this;

  function close(){
    debug('writing close packet');
    self.write([{ type: 'close' }]);
  }

  if ('open' == this.readyState) {
    debug('transport open - closing');
    close();
  } else {
    // in case we're trying to close while
    // handshaking is in progress (GH-164)
    debug('transport not open - deferring close');
    this.once('open', close);
  }
};

/**
 * Writes a packets payload.
 *
 * @param {Array} data packets
 * @param {Function} drain callback
 * @api private
 */

Polling.prototype.write = function(packets){
  var self = this;
  this.writable = false;
  var callbackfn = function() {
    self.writable = true;
    self.emit('drain');
  };

  var self = this;
  parser.encodePayload(packets, this.supportsBinary, function(data) {
    self.doWrite(data, callbackfn);
  });
};

/**
 * Generates uri for connection.
 *
 * @api private
 */

Polling.prototype.uri = function(){
  var query = this.query || {};
  var schema = this.secure ? 'https' : 'http';
  var port = '';

  // cache busting is forced
  if (false !== this.timestampRequests) {
    query[this.timestampParam] = +new Date + '-' + Transport.timestamps++;
  }

  if (!this.supportsBinary && !query.sid) {
    query.b64 = 1;
  }

  query = parseqs.encode(query);

  // avoid port if default for schema
  if (this.port && (('https' == schema && this.port != 443) ||
     ('http' == schema && this.port != 80))) {
    port = ':' + this.port;
  }

  // prepend ? to query
  if (query.length) {
    query = '?' + query;
  }

  return schema + '://' + this.hostname + port + this.path + query;
};

},{"../transport":14,"component-inherit":21,"debug":22,"engine.io-parser":25,"parseqs":35,"xmlhttprequest":20}],19:[function(_dereq_,module,exports){
/**
 * Module dependencies.
 */

var Transport = _dereq_('../transport');
var parser = _dereq_('engine.io-parser');
var parseqs = _dereq_('parseqs');
var inherit = _dereq_('component-inherit');
var debug = _dereq_('debug')('engine.io-client:websocket');

/**
 * `ws` exposes a WebSocket-compatible interface in
 * Node, or the `WebSocket` or `MozWebSocket` globals
 * in the browser.
 */

var WebSocket = _dereq_('ws');

/**
 * Module exports.
 */

module.exports = WS;

/**
 * WebSocket transport constructor.
 *
 * @api {Object} connection options
 * @api public
 */

function WS(opts){
  var forceBase64 = (opts && opts.forceBase64);
  if (forceBase64) {
    this.supportsBinary = false;
  }
  Transport.call(this, opts);
}

/**
 * Inherits from Transport.
 */

inherit(WS, Transport);

/**
 * Transport name.
 *
 * @api public
 */

WS.prototype.name = 'websocket';

/*
 * WebSockets support binary
 */

WS.prototype.supportsBinary = true;

/**
 * Opens socket.
 *
 * @api private
 */

WS.prototype.doOpen = function(){
  if (!this.check()) {
    // let probe timeout
    return;
  }

  var self = this;
  var uri = this.uri();
  var protocols = void(0);
  var opts = { agent: this.agent };

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;

  this.ws = new WebSocket(uri, protocols, opts);

  if (this.ws.binaryType === undefined) {
    this.supportsBinary = false;
  }

  this.ws.binaryType = 'arraybuffer';
  this.addEventListeners();
};

/**
 * Adds event listeners to the socket
 *
 * @api private
 */

WS.prototype.addEventListeners = function(){
  var self = this;

  this.ws.onopen = function(){
    self.onOpen();
  };
  this.ws.onclose = function(){
    self.onClose();
  };
  this.ws.onmessage = function(ev){
    self.onData(ev.data);
  };
  this.ws.onerror = function(e){
    self.onError('websocket error', e);
  };
};

/**
 * Override `onData` to use a timer on iOS.
 * See: https://gist.github.com/mloughran/2052006
 *
 * @api private
 */

if ('undefined' != typeof navigator
  && /iPad|iPhone|iPod/i.test(navigator.userAgent)) {
  WS.prototype.onData = function(data){
    var self = this;
    setTimeout(function(){
      Transport.prototype.onData.call(self, data);
    }, 0);
  };
}

/**
 * Writes data to socket.
 *
 * @param {Array} array of packets.
 * @api private
 */

WS.prototype.write = function(packets){
  var self = this;
  this.writable = false;
  // encodePacket efficient as it uses WS framing
  // no need for encodePayload
  for (var i = 0, l = packets.length; i < l; i++) {
    parser.encodePacket(packets[i], this.supportsBinary, function(data) {
      //Sometimes the websocket has already been closed but the browser didn't
      //have a chance of informing us about it yet, in that case send will
      //throw an error
      try {
        self.ws.send(data);
      } catch (e){
        debug('websocket closed before onclose event');
      }
    });
  }

  function ondrain() {
    self.writable = true;
    self.emit('drain');
  }
  // fake drain
  // defer to next tick to allow Socket to clear writeBuffer
  setTimeout(ondrain, 0);
};

/**
 * Called upon close
 *
 * @api private
 */

WS.prototype.onClose = function(){
  Transport.prototype.onClose.call(this);
};

/**
 * Closes socket.
 *
 * @api private
 */

WS.prototype.doClose = function(){
  if (typeof this.ws !== 'undefined') {
    this.ws.close();
  }
};

/**
 * Generates uri for connection.
 *
 * @api private
 */

WS.prototype.uri = function(){
  var query = this.query || {};
  var schema = this.secure ? 'wss' : 'ws';
  var port = '';

  // avoid port if default for schema
  if (this.port && (('wss' == schema && this.port != 443)
    || ('ws' == schema && this.port != 80))) {
    port = ':' + this.port;
  }

  // append timestamp to URI
  if (this.timestampRequests) {
    query[this.timestampParam] = +new Date;
  }

  // communicate binary support capabilities
  if (!this.supportsBinary) {
    query.b64 = 1;
  }

  query = parseqs.encode(query);

  // prepend ? to query
  if (query.length) {
    query = '?' + query;
  }

  return schema + '://' + this.hostname + port + this.path + query;
};

/**
 * Feature detection for WebSocket.
 *
 * @return {Boolean} whether this transport is available.
 * @api public
 */

WS.prototype.check = function(){
  return !!WebSocket && !('__initialize' in WebSocket && this.name === WS.prototype.name);
};

},{"../transport":14,"component-inherit":21,"debug":22,"engine.io-parser":25,"parseqs":35,"ws":37}],20:[function(_dereq_,module,exports){
// browser shim for xmlhttprequest module
var hasCORS = _dereq_('has-cors');

module.exports = function(opts) {
  var xdomain = opts.xdomain;

  // scheme must be same when usign XDomainRequest
  // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
  var xscheme = opts.xscheme;

  // XDomainRequest has a flow of not sending cookie, therefore it should be disabled as a default.
  // https://github.com/Automattic/engine.io-client/pull/217
  var enablesXDR = opts.enablesXDR;

  // XMLHttpRequest can be disabled on IE
  try {
    if ('undefined' != typeof XMLHttpRequest && (!xdomain || hasCORS)) {
      return new XMLHttpRequest();
    }
  } catch (e) { }

  // Use XDomainRequest for IE8 if enablesXDR is true
  // because loading bar keeps flashing when using jsonp-polling
  // https://github.com/yujiosaka/socke.io-ie8-loading-example
  try {
    if ('undefined' != typeof XDomainRequest && !xscheme && enablesXDR) {
      return new XDomainRequest();
    }
  } catch (e) { }

  if (!xdomain) {
    try {
      return new ActiveXObject('Microsoft.XMLHTTP');
    } catch(e) { }
  }
}

},{"has-cors":40}],21:[function(_dereq_,module,exports){

module.exports = function(a, b){
  var fn = function(){};
  fn.prototype = b.prototype;
  a.prototype = new fn;
  a.prototype.constructor = a;
};
},{}],22:[function(_dereq_,module,exports){

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = _dereq_('./debug');
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // is webkit? http://stackoverflow.com/a/16459606/376773
  return ('WebkitAppearance' in document.documentElement.style) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (window.console && (console.firebug || (console.exception && console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  return JSON.stringify(v);
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs() {
  var args = arguments;
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return args;

  var c = 'color: ' + this.color;
  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-z%]/g, function(match) {
    if ('%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
  return args;
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // This hackery is required for IE8,
  // where the `console.log` function doesn't have 'apply'
  return 'object' == typeof console
    && 'function' == typeof console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      localStorage.removeItem('debug');
    } else {
      localStorage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = localStorage.debug;
  } catch(e) {}
  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

},{"./debug":23}],23:[function(_dereq_,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = _dereq_('ms');

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lowercased letter, i.e. "n".
 */

exports.formatters = {};

/**
 * Previously assigned color.
 */

var prevColor = 0;

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 *
 * @return {Number}
 * @api private
 */

function selectColor() {
  return exports.colors[prevColor++ % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function debug(namespace) {

  // define the `disabled` version
  function disabled() {
  }
  disabled.enabled = false;

  // define the `enabled` version
  function enabled() {

    var self = enabled;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // add the `color` if not set
    if (null == self.useColors) self.useColors = exports.useColors();
    if (null == self.color && self.useColors) self.color = selectColor();

    var args = Array.prototype.slice.call(arguments);

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %o
      args = ['%o'].concat(args);
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    if ('function' === typeof exports.formatArgs) {
      args = exports.formatArgs.apply(self, args);
    }
    var logFn = enabled.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }
  enabled.enabled = true;

  var fn = exports.enabled(namespace) ? enabled : disabled;

  fn.namespace = namespace;

  return fn;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  var split = (namespaces || '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

},{"ms":24}],24:[function(_dereq_,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} options
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options){
  options = options || {};
  if ('string' == typeof val) return parse(val);
  return options.long
    ? long(val)
    : short(val);
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  var match = /^((?:\d+)?\.?\d+) *(ms|seconds?|s|minutes?|m|hours?|h|days?|d|years?|y)?$/i.exec(str);
  if (!match) return;
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 's':
      return n * s;
    case 'ms':
      return n;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function short(ms) {
  if (ms >= d) return Math.round(ms / d) + 'd';
  if (ms >= h) return Math.round(ms / h) + 'h';
  if (ms >= m) return Math.round(ms / m) + 'm';
  if (ms >= s) return Math.round(ms / s) + 's';
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function long(ms) {
  return plural(ms, d, 'day')
    || plural(ms, h, 'hour')
    || plural(ms, m, 'minute')
    || plural(ms, s, 'second')
    || ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) return;
  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
  return Math.ceil(ms / n) + ' ' + name + 's';
}

},{}],25:[function(_dereq_,module,exports){
(function (global){
/**
 * Module dependencies.
 */

var keys = _dereq_('./keys');
var hasBinary = _dereq_('has-binary');
var sliceBuffer = _dereq_('arraybuffer.slice');
var base64encoder = _dereq_('base64-arraybuffer');
var after = _dereq_('after');
var utf8 = _dereq_('utf8');

/**
 * Check if we are running an android browser. That requires us to use
 * ArrayBuffer with polling transports...
 *
 * http://ghinda.net/jpeg-blob-ajax-android/
 */

var isAndroid = navigator.userAgent.match(/Android/i);

/**
 * Check if we are running in PhantomJS.
 * Uploading a Blob with PhantomJS does not work correctly, as reported here:
 * https://github.com/ariya/phantomjs/issues/11395
 * @type boolean
 */
var isPhantomJS = /PhantomJS/i.test(navigator.userAgent);

/**
 * When true, avoids using Blobs to encode payloads.
 * @type boolean
 */
var dontSendBlobs = isAndroid || isPhantomJS;

/**
 * Current protocol version.
 */

exports.protocol = 3;

/**
 * Packet types.
 */

var packets = exports.packets = {
    open:     0    // non-ws
  , close:    1    // non-ws
  , ping:     2
  , pong:     3
  , message:  4
  , upgrade:  5
  , noop:     6
};

var packetslist = keys(packets);

/**
 * Premade error packet.
 */

var err = { type: 'error', data: 'parser error' };

/**
 * Create a blob api even for blob builder when vendor prefixes exist
 */

var Blob = _dereq_('blob');

/**
 * Encodes a packet.
 *
 *     <packet type id> [ <data> ]
 *
 * Example:
 *
 *     5hello world
 *     3
 *     4
 *
 * Binary is encoded in an identical principle
 *
 * @api private
 */

exports.encodePacket = function (packet, supportsBinary, utf8encode, callback) {
  if ('function' == typeof supportsBinary) {
    callback = supportsBinary;
    supportsBinary = false;
  }

  if ('function' == typeof utf8encode) {
    callback = utf8encode;
    utf8encode = null;
  }

  var data = (packet.data === undefined)
    ? undefined
    : packet.data.buffer || packet.data;

  if (global.ArrayBuffer && data instanceof ArrayBuffer) {
    return encodeArrayBuffer(packet, supportsBinary, callback);
  } else if (Blob && data instanceof global.Blob) {
    return encodeBlob(packet, supportsBinary, callback);
  }

  // might be an object with { base64: true, data: dataAsBase64String }
  if (data && data.base64) {
    return encodeBase64Object(packet, callback);
  }

  // Sending data as a utf-8 string
  var encoded = packets[packet.type];

  // data fragment is optional
  if (undefined !== packet.data) {
    encoded += utf8encode ? utf8.encode(String(packet.data)) : String(packet.data);
  }

  return callback('' + encoded);

};

function encodeBase64Object(packet, callback) {
  // packet data is an object { base64: true, data: dataAsBase64String }
  var message = 'b' + exports.packets[packet.type] + packet.data.data;
  return callback(message);
}

/**
 * Encode packet helpers for binary types
 */

function encodeArrayBuffer(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  var data = packet.data;
  var contentArray = new Uint8Array(data);
  var resultBuffer = new Uint8Array(1 + data.byteLength);

  resultBuffer[0] = packets[packet.type];
  for (var i = 0; i < contentArray.length; i++) {
    resultBuffer[i+1] = contentArray[i];
  }

  return callback(resultBuffer.buffer);
}

function encodeBlobAsArrayBuffer(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  var fr = new FileReader();
  fr.onload = function() {
    packet.data = fr.result;
    exports.encodePacket(packet, supportsBinary, true, callback);
  };
  return fr.readAsArrayBuffer(packet.data);
}

function encodeBlob(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  if (dontSendBlobs) {
    return encodeBlobAsArrayBuffer(packet, supportsBinary, callback);
  }

  var length = new Uint8Array(1);
  length[0] = packets[packet.type];
  var blob = new Blob([length.buffer, packet.data]);

  return callback(blob);
}

/**
 * Encodes a packet with binary data in a base64 string
 *
 * @param {Object} packet, has `type` and `data`
 * @return {String} base64 encoded message
 */

exports.encodeBase64Packet = function(packet, callback) {
  var message = 'b' + exports.packets[packet.type];
  if (Blob && packet.data instanceof Blob) {
    var fr = new FileReader();
    fr.onload = function() {
      var b64 = fr.result.split(',')[1];
      callback(message + b64);
    };
    return fr.readAsDataURL(packet.data);
  }

  var b64data;
  try {
    b64data = String.fromCharCode.apply(null, new Uint8Array(packet.data));
  } catch (e) {
    // iPhone Safari doesn't let you apply with typed arrays
    var typed = new Uint8Array(packet.data);
    var basic = new Array(typed.length);
    for (var i = 0; i < typed.length; i++) {
      basic[i] = typed[i];
    }
    b64data = String.fromCharCode.apply(null, basic);
  }
  message += global.btoa(b64data);
  return callback(message);
};

/**
 * Decodes a packet. Changes format to Blob if requested.
 *
 * @return {Object} with `type` and `data` (if any)
 * @api private
 */

exports.decodePacket = function (data, binaryType, utf8decode) {
  // String data
  if (typeof data == 'string' || data === undefined) {
    if (data.charAt(0) == 'b') {
      return exports.decodeBase64Packet(data.substr(1), binaryType);
    }

    if (utf8decode) {
      try {
        data = utf8.decode(data);
      } catch (e) {
        return err;
      }
    }
    var type = data.charAt(0);

    if (Number(type) != type || !packetslist[type]) {
      return err;
    }

    if (data.length > 1) {
      return { type: packetslist[type], data: data.substring(1) };
    } else {
      return { type: packetslist[type] };
    }
  }

  var asArray = new Uint8Array(data);
  var type = asArray[0];
  var rest = sliceBuffer(data, 1);
  if (Blob && binaryType === 'blob') {
    rest = new Blob([rest]);
  }
  return { type: packetslist[type], data: rest };
};

/**
 * Decodes a packet encoded in a base64 string
 *
 * @param {String} base64 encoded message
 * @return {Object} with `type` and `data` (if any)
 */

exports.decodeBase64Packet = function(msg, binaryType) {
  var type = packetslist[msg.charAt(0)];
  if (!global.ArrayBuffer) {
    return { type: type, data: { base64: true, data: msg.substr(1) } };
  }

  var data = base64encoder.decode(msg.substr(1));

  if (binaryType === 'blob' && Blob) {
    data = new Blob([data]);
  }

  return { type: type, data: data };
};

/**
 * Encodes multiple messages (payload).
 *
 *     <length>:data
 *
 * Example:
 *
 *     11:hello world2:hi
 *
 * If any contents are binary, they will be encoded as base64 strings. Base64
 * encoded strings are marked with a b before the length specifier
 *
 * @param {Array} packets
 * @api private
 */

exports.encodePayload = function (packets, supportsBinary, callback) {
  if (typeof supportsBinary == 'function') {
    callback = supportsBinary;
    supportsBinary = null;
  }

  var isBinary = hasBinary(packets);

  if (supportsBinary && isBinary) {
    if (Blob && !dontSendBlobs) {
      return exports.encodePayloadAsBlob(packets, callback);
    }

    return exports.encodePayloadAsArrayBuffer(packets, callback);
  }

  if (!packets.length) {
    return callback('0:');
  }

  function setLengthHeader(message) {
    return message.length + ':' + message;
  }

  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, !isBinary ? false : supportsBinary, true, function(message) {
      doneCallback(null, setLengthHeader(message));
    });
  }

  map(packets, encodeOne, function(err, results) {
    return callback(results.join(''));
  });
};

/**
 * Async array map using after
 */

function map(ary, each, done) {
  var result = new Array(ary.length);
  var next = after(ary.length, done);

  var eachWithIndex = function(i, el, cb) {
    each(el, function(error, msg) {
      result[i] = msg;
      cb(error, result);
    });
  };

  for (var i = 0; i < ary.length; i++) {
    eachWithIndex(i, ary[i], next);
  }
}

/*
 * Decodes data when a payload is maybe expected. Possible binary contents are
 * decoded from their base64 representation
 *
 * @param {String} data, callback method
 * @api public
 */

exports.decodePayload = function (data, binaryType, callback) {
  if (typeof data != 'string') {
    return exports.decodePayloadAsBinary(data, binaryType, callback);
  }

  if (typeof binaryType === 'function') {
    callback = binaryType;
    binaryType = null;
  }

  var packet;
  if (data == '') {
    // parser error - ignoring payload
    return callback(err, 0, 1);
  }

  var length = ''
    , n, msg;

  for (var i = 0, l = data.length; i < l; i++) {
    var chr = data.charAt(i);

    if (':' != chr) {
      length += chr;
    } else {
      if ('' == length || (length != (n = Number(length)))) {
        // parser error - ignoring payload
        return callback(err, 0, 1);
      }

      msg = data.substr(i + 1, n);

      if (length != msg.length) {
        // parser error - ignoring payload
        return callback(err, 0, 1);
      }

      if (msg.length) {
        packet = exports.decodePacket(msg, binaryType, true);

        if (err.type == packet.type && err.data == packet.data) {
          // parser error in individual packet - ignoring payload
          return callback(err, 0, 1);
        }

        var ret = callback(packet, i + n, l);
        if (false === ret) return;
      }

      // advance cursor
      i += n;
      length = '';
    }
  }

  if (length != '') {
    // parser error - ignoring payload
    return callback(err, 0, 1);
  }

};

/**
 * Encodes multiple messages (payload) as binary.
 *
 * <1 = binary, 0 = string><number from 0-9><number from 0-9>[...]<number
 * 255><data>
 *
 * Example:
 * 1 3 255 1 2 3, if the binary contents are interpreted as 8 bit integers
 *
 * @param {Array} packets
 * @return {ArrayBuffer} encoded payload
 * @api private
 */

exports.encodePayloadAsArrayBuffer = function(packets, callback) {
  if (!packets.length) {
    return callback(new ArrayBuffer(0));
  }

  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, true, true, function(data) {
      return doneCallback(null, data);
    });
  }

  map(packets, encodeOne, function(err, encodedPackets) {
    var totalLength = encodedPackets.reduce(function(acc, p) {
      var len;
      if (typeof p === 'string'){
        len = p.length;
      } else {
        len = p.byteLength;
      }
      return acc + len.toString().length + len + 2; // string/binary identifier + separator = 2
    }, 0);

    var resultArray = new Uint8Array(totalLength);

    var bufferIndex = 0;
    encodedPackets.forEach(function(p) {
      var isString = typeof p === 'string';
      var ab = p;
      if (isString) {
        var view = new Uint8Array(p.length);
        for (var i = 0; i < p.length; i++) {
          view[i] = p.charCodeAt(i);
        }
        ab = view.buffer;
      }

      if (isString) { // not true binary
        resultArray[bufferIndex++] = 0;
      } else { // true binary
        resultArray[bufferIndex++] = 1;
      }

      var lenStr = ab.byteLength.toString();
      for (var i = 0; i < lenStr.length; i++) {
        resultArray[bufferIndex++] = parseInt(lenStr[i]);
      }
      resultArray[bufferIndex++] = 255;

      var view = new Uint8Array(ab);
      for (var i = 0; i < view.length; i++) {
        resultArray[bufferIndex++] = view[i];
      }
    });

    return callback(resultArray.buffer);
  });
};

/**
 * Encode as Blob
 */

exports.encodePayloadAsBlob = function(packets, callback) {
  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, true, true, function(encoded) {
      var binaryIdentifier = new Uint8Array(1);
      binaryIdentifier[0] = 1;
      if (typeof encoded === 'string') {
        var view = new Uint8Array(encoded.length);
        for (var i = 0; i < encoded.length; i++) {
          view[i] = encoded.charCodeAt(i);
        }
        encoded = view.buffer;
        binaryIdentifier[0] = 0;
      }

      var len = (encoded instanceof ArrayBuffer)
        ? encoded.byteLength
        : encoded.size;

      var lenStr = len.toString();
      var lengthAry = new Uint8Array(lenStr.length + 1);
      for (var i = 0; i < lenStr.length; i++) {
        lengthAry[i] = parseInt(lenStr[i]);
      }
      lengthAry[lenStr.length] = 255;

      if (Blob) {
        var blob = new Blob([binaryIdentifier.buffer, lengthAry.buffer, encoded]);
        doneCallback(null, blob);
      }
    });
  }

  map(packets, encodeOne, function(err, results) {
    return callback(new Blob(results));
  });
};

/*
 * Decodes data when a payload is maybe expected. Strings are decoded by
 * interpreting each byte as a key code for entries marked to start with 0. See
 * description of encodePayloadAsBinary
 *
 * @param {ArrayBuffer} data, callback method
 * @api public
 */

exports.decodePayloadAsBinary = function (data, binaryType, callback) {
  if (typeof binaryType === 'function') {
    callback = binaryType;
    binaryType = null;
  }

  var bufferTail = data;
  var buffers = [];

  var numberTooLong = false;
  while (bufferTail.byteLength > 0) {
    var tailArray = new Uint8Array(bufferTail);
    var isString = tailArray[0] === 0;
    var msgLength = '';

    for (var i = 1; ; i++) {
      if (tailArray[i] == 255) break;

      if (msgLength.length > 310) {
        numberTooLong = true;
        break;
      }

      msgLength += tailArray[i];
    }

    if(numberTooLong) return callback(err, 0, 1);

    bufferTail = sliceBuffer(bufferTail, 2 + msgLength.length);
    msgLength = parseInt(msgLength);

    var msg = sliceBuffer(bufferTail, 0, msgLength);
    if (isString) {
      try {
        msg = String.fromCharCode.apply(null, new Uint8Array(msg));
      } catch (e) {
        // iPhone Safari doesn't let you apply to typed arrays
        var typed = new Uint8Array(msg);
        msg = '';
        for (var i = 0; i < typed.length; i++) {
          msg += String.fromCharCode(typed[i]);
        }
      }
    }

    buffers.push(msg);
    bufferTail = sliceBuffer(bufferTail, msgLength);
  }

  var total = buffers.length;
  buffers.forEach(function(buffer, i) {
    callback(exports.decodePacket(buffer, binaryType, true), i, total);
  });
};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./keys":26,"after":27,"arraybuffer.slice":28,"base64-arraybuffer":29,"blob":30,"has-binary":31,"utf8":33}],26:[function(_dereq_,module,exports){

/**
 * Gets the keys for an object.
 *
 * @return {Array} keys
 * @api private
 */

module.exports = Object.keys || function keys (obj){
  var arr = [];
  var has = Object.prototype.hasOwnProperty;

  for (var i in obj) {
    if (has.call(obj, i)) {
      arr.push(i);
    }
  }
  return arr;
};

},{}],27:[function(_dereq_,module,exports){
module.exports = after

function after(count, callback, err_cb) {
    var bail = false
    err_cb = err_cb || noop
    proxy.count = count

    return (count === 0) ? callback() : proxy

    function proxy(err, result) {
        if (proxy.count <= 0) {
            throw new Error('after called too many times')
        }
        --proxy.count

        // after first error, rest are passed to err_cb
        if (err) {
            bail = true
            callback(err)
            // future error callbacks will go to error handler
            callback = err_cb
        } else if (proxy.count === 0 && !bail) {
            callback(null, result)
        }
    }
}

function noop() {}

},{}],28:[function(_dereq_,module,exports){
/**
 * An abstraction for slicing an arraybuffer even when
 * ArrayBuffer.prototype.slice is not supported
 *
 * @api public
 */

module.exports = function(arraybuffer, start, end) {
  var bytes = arraybuffer.byteLength;
  start = start || 0;
  end = end || bytes;

  if (arraybuffer.slice) { return arraybuffer.slice(start, end); }

  if (start < 0) { start += bytes; }
  if (end < 0) { end += bytes; }
  if (end > bytes) { end = bytes; }

  if (start >= bytes || start >= end || bytes === 0) {
    return new ArrayBuffer(0);
  }

  var abv = new Uint8Array(arraybuffer);
  var result = new Uint8Array(end - start);
  for (var i = start, ii = 0; i < end; i++, ii++) {
    result[ii] = abv[i];
  }
  return result.buffer;
};

},{}],29:[function(_dereq_,module,exports){
/*
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */
(function(chars){
  "use strict";

  exports.encode = function(arraybuffer) {
    var bytes = new Uint8Array(arraybuffer),
    i, len = bytes.length, base64 = "";

    for (i = 0; i < len; i+=3) {
      base64 += chars[bytes[i] >> 2];
      base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
      base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
      base64 += chars[bytes[i + 2] & 63];
    }

    if ((len % 3) === 2) {
      base64 = base64.substring(0, base64.length - 1) + "=";
    } else if (len % 3 === 1) {
      base64 = base64.substring(0, base64.length - 2) + "==";
    }

    return base64;
  };

  exports.decode =  function(base64) {
    var bufferLength = base64.length * 0.75,
    len = base64.length, i, p = 0,
    encoded1, encoded2, encoded3, encoded4;

    if (base64[base64.length - 1] === "=") {
      bufferLength--;
      if (base64[base64.length - 2] === "=") {
        bufferLength--;
      }
    }

    var arraybuffer = new ArrayBuffer(bufferLength),
    bytes = new Uint8Array(arraybuffer);

    for (i = 0; i < len; i+=4) {
      encoded1 = chars.indexOf(base64[i]);
      encoded2 = chars.indexOf(base64[i+1]);
      encoded3 = chars.indexOf(base64[i+2]);
      encoded4 = chars.indexOf(base64[i+3]);

      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }

    return arraybuffer;
  };
})("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");

},{}],30:[function(_dereq_,module,exports){
(function (global){
/**
 * Create a blob builder even when vendor prefixes exist
 */

var BlobBuilder = global.BlobBuilder
  || global.WebKitBlobBuilder
  || global.MSBlobBuilder
  || global.MozBlobBuilder;

/**
 * Check if Blob constructor is supported
 */

var blobSupported = (function() {
  try {
    var b = new Blob(['hi']);
    return b.size == 2;
  } catch(e) {
    return false;
  }
})();

/**
 * Check if BlobBuilder is supported
 */

var blobBuilderSupported = BlobBuilder
  && BlobBuilder.prototype.append
  && BlobBuilder.prototype.getBlob;

function BlobBuilderConstructor(ary, options) {
  options = options || {};

  var bb = new BlobBuilder();
  for (var i = 0; i < ary.length; i++) {
    bb.append(ary[i]);
  }
  return (options.type) ? bb.getBlob(options.type) : bb.getBlob();
};

module.exports = (function() {
  if (blobSupported) {
    return global.Blob;
  } else if (blobBuilderSupported) {
    return BlobBuilderConstructor;
  } else {
    return undefined;
  }
})();

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],31:[function(_dereq_,module,exports){
(function (global){

/*
 * Module requirements.
 */

var isArray = _dereq_('isarray');

/**
 * Module exports.
 */

module.exports = hasBinary;

/**
 * Checks for binary data.
 *
 * Right now only Buffer and ArrayBuffer are supported..
 *
 * @param {Object} anything
 * @api public
 */

function hasBinary(data) {

  function _hasBinary(obj) {
    if (!obj) return false;

    if ( (global.Buffer && global.Buffer.isBuffer(obj)) ||
         (global.ArrayBuffer && obj instanceof ArrayBuffer) ||
         (global.Blob && obj instanceof Blob) ||
         (global.File && obj instanceof File)
        ) {
      return true;
    }

    if (isArray(obj)) {
      for (var i = 0; i < obj.length; i++) {
          if (_hasBinary(obj[i])) {
              return true;
          }
      }
    } else if (obj && 'object' == typeof obj) {
      if (obj.toJSON) {
        obj = obj.toJSON();
      }

      for (var key in obj) {
        if (obj.hasOwnProperty(key) && _hasBinary(obj[key])) {
          return true;
        }
      }
    }

    return false;
  }

  return _hasBinary(data);
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"isarray":32}],32:[function(_dereq_,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],33:[function(_dereq_,module,exports){
(function (global){
/*! http://mths.be/utf8js v2.0.0 by @mathias */
;(function(root) {

	// Detect free variables `exports`
	var freeExports = typeof exports == 'object' && exports;

	// Detect free variable `module`
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;

	// Detect free variable `global`, from Node.js or Browserified code,
	// and use it as `root`
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	var stringFromCharCode = String.fromCharCode;

	// Taken from http://mths.be/punycode
	function ucs2decode(string) {
		var output = [];
		var counter = 0;
		var length = string.length;
		var value;
		var extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	// Taken from http://mths.be/punycode
	function ucs2encode(array) {
		var length = array.length;
		var index = -1;
		var value;
		var output = '';
		while (++index < length) {
			value = array[index];
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
		}
		return output;
	}

	/*--------------------------------------------------------------------------*/

	function createByte(codePoint, shift) {
		return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
	}

	function encodeCodePoint(codePoint) {
		if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
			return stringFromCharCode(codePoint);
		}
		var symbol = '';
		if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
			symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
		}
		else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
			symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
			symbol += createByte(codePoint, 6);
		}
		else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
			symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
			symbol += createByte(codePoint, 12);
			symbol += createByte(codePoint, 6);
		}
		symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
		return symbol;
	}

	function utf8encode(string) {
		var codePoints = ucs2decode(string);

		// console.log(JSON.stringify(codePoints.map(function(x) {
		// 	return 'U+' + x.toString(16).toUpperCase();
		// })));

		var length = codePoints.length;
		var index = -1;
		var codePoint;
		var byteString = '';
		while (++index < length) {
			codePoint = codePoints[index];
			byteString += encodeCodePoint(codePoint);
		}
		return byteString;
	}

	/*--------------------------------------------------------------------------*/

	function readContinuationByte() {
		if (byteIndex >= byteCount) {
			throw Error('Invalid byte index');
		}

		var continuationByte = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		if ((continuationByte & 0xC0) == 0x80) {
			return continuationByte & 0x3F;
		}

		// If we end up here, it’s not a continuation byte
		throw Error('Invalid continuation byte');
	}

	function decodeSymbol() {
		var byte1;
		var byte2;
		var byte3;
		var byte4;
		var codePoint;

		if (byteIndex > byteCount) {
			throw Error('Invalid byte index');
		}

		if (byteIndex == byteCount) {
			return false;
		}

		// Read first byte
		byte1 = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		// 1-byte sequence (no continuation bytes)
		if ((byte1 & 0x80) == 0) {
			return byte1;
		}

		// 2-byte sequence
		if ((byte1 & 0xE0) == 0xC0) {
			var byte2 = readContinuationByte();
			codePoint = ((byte1 & 0x1F) << 6) | byte2;
			if (codePoint >= 0x80) {
				return codePoint;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 3-byte sequence (may include unpaired surrogates)
		if ((byte1 & 0xF0) == 0xE0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
			if (codePoint >= 0x0800) {
				return codePoint;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 4-byte sequence
		if ((byte1 & 0xF8) == 0xF0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			byte4 = readContinuationByte();
			codePoint = ((byte1 & 0x0F) << 0x12) | (byte2 << 0x0C) |
				(byte3 << 0x06) | byte4;
			if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
				return codePoint;
			}
		}

		throw Error('Invalid UTF-8 detected');
	}

	var byteArray;
	var byteCount;
	var byteIndex;
	function utf8decode(byteString) {
		byteArray = ucs2decode(byteString);
		byteCount = byteArray.length;
		byteIndex = 0;
		var codePoints = [];
		var tmp;
		while ((tmp = decodeSymbol()) !== false) {
			codePoints.push(tmp);
		}
		return ucs2encode(codePoints);
	}

	/*--------------------------------------------------------------------------*/

	var utf8 = {
		'version': '2.0.0',
		'encode': utf8encode,
		'decode': utf8decode
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define(function() {
			return utf8;
		});
	}	else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = utf8;
		} else { // in Narwhal or RingoJS v0.7.0-
			var object = {};
			var hasOwnProperty = object.hasOwnProperty;
			for (var key in utf8) {
				hasOwnProperty.call(utf8, key) && (freeExports[key] = utf8[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.utf8 = utf8;
	}

}(this));

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],34:[function(_dereq_,module,exports){
(function (global){
/**
 * JSON parse.
 *
 * @see Based on jQuery#parseJSON (MIT) and JSON2
 * @api private
 */

var rvalidchars = /^[\],:{}\s]*$/;
var rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
var rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
var rtrimLeft = /^\s+/;
var rtrimRight = /\s+$/;

module.exports = function parsejson(data) {
  if ('string' != typeof data || !data) {
    return null;
  }

  data = data.replace(rtrimLeft, '').replace(rtrimRight, '');

  // Attempt to parse using the native JSON parser first
  if (global.JSON && JSON.parse) {
    return JSON.parse(data);
  }

  if (rvalidchars.test(data.replace(rvalidescape, '@')
      .replace(rvalidtokens, ']')
      .replace(rvalidbraces, ''))) {
    return (new Function('return ' + data))();
  }
};
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],35:[function(_dereq_,module,exports){
/**
 * Compiles a querystring
 * Returns string representation of the object
 *
 * @param {Object}
 * @api private
 */

exports.encode = function (obj) {
  var str = '';

  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (str.length) str += '&';
      str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
    }
  }

  return str;
};

/**
 * Parses a simple querystring into an object
 *
 * @param {String} qs
 * @api private
 */

exports.decode = function(qs){
  var qry = {};
  var pairs = qs.split('&');
  for (var i = 0, l = pairs.length; i < l; i++) {
    var pair = pairs[i].split('=');
    qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return qry;
};

},{}],36:[function(_dereq_,module,exports){
/**
 * Parses an URI
 *
 * @author Steven Levithan <stevenlevithan.com> (MIT license)
 * @api private
 */

var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

var parts = [
    'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
];

module.exports = function parseuri(str) {
    var src = str,
        b = str.indexOf('['),
        e = str.indexOf(']');

    if (b != -1 && e != -1) {
        str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
    }

    var m = re.exec(str || ''),
        uri = {},
        i = 14;

    while (i--) {
        uri[parts[i]] = m[i] || '';
    }

    if (b != -1 && e != -1) {
        uri.source = src;
        uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
        uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
        uri.ipv6uri = true;
    }

    return uri;
};

},{}],37:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var global = (function() { return this; })();

/**
 * WebSocket constructor.
 */

var WebSocket = global.WebSocket || global.MozWebSocket;

/**
 * Module exports.
 */

module.exports = WebSocket ? ws : null;

/**
 * WebSocket constructor.
 *
 * The third `opts` options object gets ignored in web browsers, since it's
 * non-standard, and throws a TypeError if passed to the constructor.
 * See: https://github.com/einaros/ws/issues/227
 *
 * @param {String} uri
 * @param {Array} protocols (optional)
 * @param {Object) opts (optional)
 * @api public
 */

function ws(uri, protocols, opts) {
  var instance;
  if (protocols) {
    instance = new WebSocket(uri, protocols);
  } else {
    instance = new WebSocket(uri);
  }
  return instance;
}

if (WebSocket) ws.prototype = WebSocket.prototype;

},{}],38:[function(_dereq_,module,exports){
(function (global){

/*
 * Module requirements.
 */

var isArray = _dereq_('isarray');

/**
 * Module exports.
 */

module.exports = hasBinary;

/**
 * Checks for binary data.
 *
 * Right now only Buffer and ArrayBuffer are supported..
 *
 * @param {Object} anything
 * @api public
 */

function hasBinary(data) {

  function _hasBinary(obj) {
    if (!obj) return false;

    if ( (global.Buffer && global.Buffer.isBuffer(obj)) ||
         (global.ArrayBuffer && obj instanceof ArrayBuffer) ||
         (global.Blob && obj instanceof Blob) ||
         (global.File && obj instanceof File)
        ) {
      return true;
    }

    if (isArray(obj)) {
      for (var i = 0; i < obj.length; i++) {
          if (_hasBinary(obj[i])) {
              return true;
          }
      }
    } else if (obj && 'object' == typeof obj) {
      if (obj.toJSON) {
        obj = obj.toJSON();
      }

      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) && _hasBinary(obj[key])) {
          return true;
        }
      }
    }

    return false;
  }

  return _hasBinary(data);
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"isarray":39}],39:[function(_dereq_,module,exports){
module.exports=_dereq_(32)
},{}],40:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var global = _dereq_('global');

/**
 * Module exports.
 *
 * Logic borrowed from Modernizr:
 *
 *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
 */

try {
  module.exports = 'XMLHttpRequest' in global &&
    'withCredentials' in new global.XMLHttpRequest();
} catch (err) {
  // if XMLHttp support is disabled in IE then it will throw
  // when trying to create
  module.exports = false;
}

},{"global":41}],41:[function(_dereq_,module,exports){

/**
 * Returns `this`. Execute this without a "context" (i.e. without it being
 * attached to an object of the left-hand side), and `this` points to the
 * "global" scope of the current JS execution.
 */

module.exports = (function () { return this; })();

},{}],42:[function(_dereq_,module,exports){

var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
},{}],43:[function(_dereq_,module,exports){

/**
 * HOP ref.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Return own keys in `obj`.
 *
 * @param {Object} obj
 * @return {Array}
 * @api public
 */

exports.keys = Object.keys || function(obj){
  var keys = [];
  for (var key in obj) {
    if (has.call(obj, key)) {
      keys.push(key);
    }
  }
  return keys;
};

/**
 * Return own values in `obj`.
 *
 * @param {Object} obj
 * @return {Array}
 * @api public
 */

exports.values = function(obj){
  var vals = [];
  for (var key in obj) {
    if (has.call(obj, key)) {
      vals.push(obj[key]);
    }
  }
  return vals;
};

/**
 * Merge `b` into `a`.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api public
 */

exports.merge = function(a, b){
  for (var key in b) {
    if (has.call(b, key)) {
      a[key] = b[key];
    }
  }
  return a;
};

/**
 * Return length of `obj`.
 *
 * @param {Object} obj
 * @return {Number}
 * @api public
 */

exports.length = function(obj){
  return exports.keys(obj).length;
};

/**
 * Check if `obj` is empty.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api public
 */

exports.isEmpty = function(obj){
  return 0 == exports.length(obj);
};
},{}],44:[function(_dereq_,module,exports){
/**
 * Parses an URI
 *
 * @author Steven Levithan <stevenlevithan.com> (MIT license)
 * @api private
 */

var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

var parts = [
    'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host'
  , 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
];

module.exports = function parseuri(str) {
  var m = re.exec(str || '')
    , uri = {}
    , i = 14;

  while (i--) {
    uri[parts[i]] = m[i] || '';
  }

  return uri;
};

},{}],45:[function(_dereq_,module,exports){
(function (global){
/*global Blob,File*/

/**
 * Module requirements
 */

var isArray = _dereq_('isarray');
var isBuf = _dereq_('./is-buffer');

/**
 * Replaces every Buffer | ArrayBuffer in packet with a numbered placeholder.
 * Anything with blobs or files should be fed through removeBlobs before coming
 * here.
 *
 * @param {Object} packet - socket.io event packet
 * @return {Object} with deconstructed packet and list of buffers
 * @api public
 */

exports.deconstructPacket = function(packet){
  var buffers = [];
  var packetData = packet.data;

  function _deconstructPacket(data) {
    if (!data) return data;

    if (isBuf(data)) {
      var placeholder = { _placeholder: true, num: buffers.length };
      buffers.push(data);
      return placeholder;
    } else if (isArray(data)) {
      var newData = new Array(data.length);
      for (var i = 0; i < data.length; i++) {
        newData[i] = _deconstructPacket(data[i]);
      }
      return newData;
    } else if ('object' == typeof data && !(data instanceof Date)) {
      var newData = {};
      for (var key in data) {
        newData[key] = _deconstructPacket(data[key]);
      }
      return newData;
    }
    return data;
  }

  var pack = packet;
  pack.data = _deconstructPacket(packetData);
  pack.attachments = buffers.length; // number of binary 'attachments'
  return {packet: pack, buffers: buffers};
};

/**
 * Reconstructs a binary packet from its placeholder packet and buffers
 *
 * @param {Object} packet - event packet with placeholders
 * @param {Array} buffers - binary buffers to put in placeholder positions
 * @return {Object} reconstructed packet
 * @api public
 */

exports.reconstructPacket = function(packet, buffers) {
  var curPlaceHolder = 0;

  function _reconstructPacket(data) {
    if (data && data._placeholder) {
      var buf = buffers[data.num]; // appropriate buffer (should be natural order anyway)
      return buf;
    } else if (isArray(data)) {
      for (var i = 0; i < data.length; i++) {
        data[i] = _reconstructPacket(data[i]);
      }
      return data;
    } else if (data && 'object' == typeof data) {
      for (var key in data) {
        data[key] = _reconstructPacket(data[key]);
      }
      return data;
    }
    return data;
  }

  packet.data = _reconstructPacket(packet.data);
  packet.attachments = undefined; // no longer useful
  return packet;
};

/**
 * Asynchronously removes Blobs or Files from data via
 * FileReader's readAsArrayBuffer method. Used before encoding
 * data as msgpack. Calls callback with the blobless data.
 *
 * @param {Object} data
 * @param {Function} callback
 * @api private
 */

exports.removeBlobs = function(data, callback) {
  function _removeBlobs(obj, curKey, containingObject) {
    if (!obj) return obj;

    // convert any blob
    if ((global.Blob && obj instanceof Blob) ||
        (global.File && obj instanceof File)) {
      pendingBlobs++;

      // async filereader
      var fileReader = new FileReader();
      fileReader.onload = function() { // this.result == arraybuffer
        if (containingObject) {
          containingObject[curKey] = this.result;
        }
        else {
          bloblessData = this.result;
        }

        // if nothing pending its callback time
        if(! --pendingBlobs) {
          callback(bloblessData);
        }
      };

      fileReader.readAsArrayBuffer(obj); // blob -> arraybuffer
    } else if (isArray(obj)) { // handle array
      for (var i = 0; i < obj.length; i++) {
        _removeBlobs(obj[i], i, obj);
      }
    } else if (obj && 'object' == typeof obj && !isBuf(obj)) { // and object
      for (var key in obj) {
        _removeBlobs(obj[key], key, obj);
      }
    }
  }

  var pendingBlobs = 0;
  var bloblessData = data;
  _removeBlobs(bloblessData);
  if (!pendingBlobs) {
    callback(bloblessData);
  }
};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./is-buffer":47,"isarray":48}],46:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var debug = _dereq_('debug')('socket.io-parser');
var json = _dereq_('json3');
var isArray = _dereq_('isarray');
var Emitter = _dereq_('component-emitter');
var binary = _dereq_('./binary');
var isBuf = _dereq_('./is-buffer');

/**
 * Protocol version.
 *
 * @api public
 */

exports.protocol = 4;

/**
 * Packet types.
 *
 * @api public
 */

exports.types = [
  'CONNECT',
  'DISCONNECT',
  'EVENT',
  'BINARY_EVENT',
  'ACK',
  'BINARY_ACK',
  'ERROR'
];

/**
 * Packet type `connect`.
 *
 * @api public
 */

exports.CONNECT = 0;

/**
 * Packet type `disconnect`.
 *
 * @api public
 */

exports.DISCONNECT = 1;

/**
 * Packet type `event`.
 *
 * @api public
 */

exports.EVENT = 2;

/**
 * Packet type `ack`.
 *
 * @api public
 */

exports.ACK = 3;

/**
 * Packet type `error`.
 *
 * @api public
 */

exports.ERROR = 4;

/**
 * Packet type 'binary event'
 *
 * @api public
 */

exports.BINARY_EVENT = 5;

/**
 * Packet type `binary ack`. For acks with binary arguments.
 *
 * @api public
 */

exports.BINARY_ACK = 6;

/**
 * Encoder constructor.
 *
 * @api public
 */

exports.Encoder = Encoder;

/**
 * Decoder constructor.
 *
 * @api public
 */

exports.Decoder = Decoder;

/**
 * A socket.io Encoder instance
 *
 * @api public
 */

function Encoder() {}

/**
 * Encode a packet as a single string if non-binary, or as a
 * buffer sequence, depending on packet type.
 *
 * @param {Object} obj - packet object
 * @param {Function} callback - function to handle encodings (likely engine.write)
 * @return Calls callback with Array of encodings
 * @api public
 */

Encoder.prototype.encode = function(obj, callback){
  debug('encoding packet %j', obj);

  if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
    encodeAsBinary(obj, callback);
  }
  else {
    var encoding = encodeAsString(obj);
    callback([encoding]);
  }
};

/**
 * Encode packet as string.
 *
 * @param {Object} packet
 * @return {String} encoded
 * @api private
 */

function encodeAsString(obj) {
  var str = '';
  var nsp = false;

  // first is type
  str += obj.type;

  // attachments if we have them
  if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
    str += obj.attachments;
    str += '-';
  }

  // if we have a namespace other than `/`
  // we append it followed by a comma `,`
  if (obj.nsp && '/' != obj.nsp) {
    nsp = true;
    str += obj.nsp;
  }

  // immediately followed by the id
  if (null != obj.id) {
    if (nsp) {
      str += ',';
      nsp = false;
    }
    str += obj.id;
  }

  // json data
  if (null != obj.data) {
    if (nsp) str += ',';
    str += json.stringify(obj.data);
  }

  debug('encoded %j as %s', obj, str);
  return str;
}

/**
 * Encode packet as 'buffer sequence' by removing blobs, and
 * deconstructing packet into object with placeholders and
 * a list of buffers.
 *
 * @param {Object} packet
 * @return {Buffer} encoded
 * @api private
 */

function encodeAsBinary(obj, callback) {

  function writeEncoding(bloblessData) {
    var deconstruction = binary.deconstructPacket(bloblessData);
    var pack = encodeAsString(deconstruction.packet);
    var buffers = deconstruction.buffers;

    buffers.unshift(pack); // add packet info to beginning of data list
    callback(buffers); // write all the buffers
  }

  binary.removeBlobs(obj, writeEncoding);
}

/**
 * A socket.io Decoder instance
 *
 * @return {Object} decoder
 * @api public
 */

function Decoder() {
  this.reconstructor = null;
}

/**
 * Mix in `Emitter` with Decoder.
 */

Emitter(Decoder.prototype);

/**
 * Decodes an ecoded packet string into packet JSON.
 *
 * @param {String} obj - encoded packet
 * @return {Object} packet
 * @api public
 */

Decoder.prototype.add = function(obj) {
  var packet;
  if ('string' == typeof obj) {
    packet = decodeString(obj);
    if (exports.BINARY_EVENT == packet.type || exports.BINARY_ACK == packet.type) { // binary packet's json
      this.reconstructor = new BinaryReconstructor(packet);

      // no attachments, labeled binary but no binary data to follow
      if (this.reconstructor.reconPack.attachments === 0) {
        this.emit('decoded', packet);
      }
    } else { // non-binary full packet
      this.emit('decoded', packet);
    }
  }
  else if (isBuf(obj) || obj.base64) { // raw binary data
    if (!this.reconstructor) {
      throw new Error('got binary data when not reconstructing a packet');
    } else {
      packet = this.reconstructor.takeBinaryData(obj);
      if (packet) { // received final buffer
        this.reconstructor = null;
        this.emit('decoded', packet);
      }
    }
  }
  else {
    throw new Error('Unknown type: ' + obj);
  }
};

/**
 * Decode a packet String (JSON data)
 *
 * @param {String} str
 * @return {Object} packet
 * @api private
 */

function decodeString(str) {
  var p = {};
  var i = 0;

  // look up type
  p.type = Number(str.charAt(0));
  if (null == exports.types[p.type]) return error();

  // look up attachments if type binary
  if (exports.BINARY_EVENT == p.type || exports.BINARY_ACK == p.type) {
    var buf = '';
    while (str.charAt(++i) != '-') {
      buf += str.charAt(i);
      if (i == str.length) break;
    }
    if (buf != Number(buf) || str.charAt(i) != '-') {
      throw new Error('Illegal attachments');
    }
    p.attachments = Number(buf);
  }

  // look up namespace (if any)
  if ('/' == str.charAt(i + 1)) {
    p.nsp = '';
    while (++i) {
      var c = str.charAt(i);
      if (',' == c) break;
      p.nsp += c;
      if (i == str.length) break;
    }
  } else {
    p.nsp = '/';
  }

  // look up id
  var next = str.charAt(i + 1);
  if ('' !== next && Number(next) == next) {
    p.id = '';
    while (++i) {
      var c = str.charAt(i);
      if (null == c || Number(c) != c) {
        --i;
        break;
      }
      p.id += str.charAt(i);
      if (i == str.length) break;
    }
    p.id = Number(p.id);
  }

  // look up json data
  if (str.charAt(++i)) {
    try {
      p.data = json.parse(str.substr(i));
    } catch(e){
      return error();
    }
  }

  debug('decoded %s as %j', str, p);
  return p;
}

/**
 * Deallocates a parser's resources
 *
 * @api public
 */

Decoder.prototype.destroy = function() {
  if (this.reconstructor) {
    this.reconstructor.finishedReconstruction();
  }
};

/**
 * A manager of a binary event's 'buffer sequence'. Should
 * be constructed whenever a packet of type BINARY_EVENT is
 * decoded.
 *
 * @param {Object} packet
 * @return {BinaryReconstructor} initialized reconstructor
 * @api private
 */

function BinaryReconstructor(packet) {
  this.reconPack = packet;
  this.buffers = [];
}

/**
 * Method to be called when binary data received from connection
 * after a BINARY_EVENT packet.
 *
 * @param {Buffer | ArrayBuffer} binData - the raw binary data received
 * @return {null | Object} returns null if more binary data is expected or
 *   a reconstructed packet object if all buffers have been received.
 * @api private
 */

BinaryReconstructor.prototype.takeBinaryData = function(binData) {
  this.buffers.push(binData);
  if (this.buffers.length == this.reconPack.attachments) { // done with buffer list
    var packet = binary.reconstructPacket(this.reconPack, this.buffers);
    this.finishedReconstruction();
    return packet;
  }
  return null;
};

/**
 * Cleans up binary packet reconstruction variables.
 *
 * @api private
 */

BinaryReconstructor.prototype.finishedReconstruction = function() {
  this.reconPack = null;
  this.buffers = [];
};

function error(data){
  return {
    type: exports.ERROR,
    data: 'parser error'
  };
}

},{"./binary":45,"./is-buffer":47,"component-emitter":9,"debug":10,"isarray":48,"json3":49}],47:[function(_dereq_,module,exports){
(function (global){

module.exports = isBuf;

/**
 * Returns true if obj is a buffer or an arraybuffer.
 *
 * @api private
 */

function isBuf(obj) {
  return (global.Buffer && global.Buffer.isBuffer(obj)) ||
         (global.ArrayBuffer && obj instanceof ArrayBuffer);
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],48:[function(_dereq_,module,exports){
module.exports=_dereq_(32)
},{}],49:[function(_dereq_,module,exports){
/*! JSON v3.2.6 | http://bestiejs.github.io/json3 | Copyright 2012-2013, Kit Cambridge | http://kit.mit-license.org */
;(function (window) {
  // Convenience aliases.
  var getClass = {}.toString, isProperty, forEach, undef;

  // Detect the `define` function exposed by asynchronous module loaders. The
  // strict `define` check is necessary for compatibility with `r.js`.
  var isLoader = typeof define === "function" && define.amd;

  // Detect native implementations.
  var nativeJSON = typeof JSON == "object" && JSON;

  // Set up the JSON 3 namespace, preferring the CommonJS `exports` object if
  // available.
  var JSON3 = typeof exports == "object" && exports && !exports.nodeType && exports;

  if (JSON3 && nativeJSON) {
    // Explicitly delegate to the native `stringify` and `parse`
    // implementations in CommonJS environments.
    JSON3.stringify = nativeJSON.stringify;
    JSON3.parse = nativeJSON.parse;
  } else {
    // Export for web browsers, JavaScript engines, and asynchronous module
    // loaders, using the global `JSON` object if available.
    JSON3 = window.JSON = nativeJSON || {};
  }

  // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
  var isExtended = new Date(-3509827334573292);
  try {
    // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
    // results for certain dates in Opera >= 10.53.
    isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
      // Safari < 2.0.2 stores the internal millisecond time value correctly,
      // but clips the values returned by the date methods to the range of
      // signed 32-bit integers ([-2 ** 31, 2 ** 31 - 1]).
      isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
  } catch (exception) {}

  // Internal: Determines whether the native `JSON.stringify` and `parse`
  // implementations are spec-compliant. Based on work by Ken Snyder.
  function has(name) {
    if (has[name] !== undef) {
      // Return cached feature test result.
      return has[name];
    }

    var isSupported;
    if (name == "bug-string-char-index") {
      // IE <= 7 doesn't support accessing string characters using square
      // bracket notation. IE 8 only supports this for primitives.
      isSupported = "a"[0] != "a";
    } else if (name == "json") {
      // Indicates whether both `JSON.stringify` and `JSON.parse` are
      // supported.
      isSupported = has("json-stringify") && has("json-parse");
    } else {
      var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
      // Test `JSON.stringify`.
      if (name == "json-stringify") {
        var stringify = JSON3.stringify, stringifySupported = typeof stringify == "function" && isExtended;
        if (stringifySupported) {
          // A test function object with a custom `toJSON` method.
          (value = function () {
            return 1;
          }).toJSON = value;
          try {
            stringifySupported =
              // Firefox 3.1b1 and b2 serialize string, number, and boolean
              // primitives as object literals.
              stringify(0) === "0" &&
              // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
              // literals.
              stringify(new Number()) === "0" &&
              stringify(new String()) == '""' &&
              // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
              // does not define a canonical JSON representation (this applies to
              // objects with `toJSON` properties as well, *unless* they are nested
              // within an object or array).
              stringify(getClass) === undef &&
              // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
              // FF 3.1b3 pass this test.
              stringify(undef) === undef &&
              // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
              // respectively, if the value is omitted entirely.
              stringify() === undef &&
              // FF 3.1b1, 2 throw an error if the given value is not a number,
              // string, array, object, Boolean, or `null` literal. This applies to
              // objects with custom `toJSON` methods as well, unless they are nested
              // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
              // methods entirely.
              stringify(value) === "1" &&
              stringify([value]) == "[1]" &&
              // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
              // `"[null]"`.
              stringify([undef]) == "[null]" &&
              // YUI 3.0.0b1 fails to serialize `null` literals.
              stringify(null) == "null" &&
              // FF 3.1b1, 2 halts serialization if an array contains a function:
              // `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
              // elides non-JSON values from objects and arrays, unless they
              // define custom `toJSON` methods.
              stringify([undef, getClass, null]) == "[null,null,null]" &&
              // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
              // where character escape codes are expected (e.g., `\b` => `\u0008`).
              stringify({ "a": [value, true, false, null, "\x00\b\n\f\r\t"] }) == serialized &&
              // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
              stringify(null, value) === "1" &&
              stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" &&
              // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
              // serialize extended years.
              stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
              // The milliseconds are optional in ES 5, but required in 5.1.
              stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
              // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
              // four-digit years instead of six-digit years. Credits: @Yaffle.
              stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
              // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
              // values less than 1000. Credits: @Yaffle.
              stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
          } catch (exception) {
            stringifySupported = false;
          }
        }
        isSupported = stringifySupported;
      }
      // Test `JSON.parse`.
      if (name == "json-parse") {
        var parse = JSON3.parse;
        if (typeof parse == "function") {
          try {
            // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
            // Conforming implementations should also coerce the initial argument to
            // a string prior to parsing.
            if (parse("0") === 0 && !parse(false)) {
              // Simple parsing test.
              value = parse(serialized);
              var parseSupported = value["a"].length == 5 && value["a"][0] === 1;
              if (parseSupported) {
                try {
                  // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
                  parseSupported = !parse('"\t"');
                } catch (exception) {}
                if (parseSupported) {
                  try {
                    // FF 4.0 and 4.0.1 allow leading `+` signs and leading
                    // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
                    // certain octal literals.
                    parseSupported = parse("01") !== 1;
                  } catch (exception) {}
                }
                if (parseSupported) {
                  try {
                    // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
                    // points. These environments, along with FF 3.1b1 and 2,
                    // also allow trailing commas in JSON objects and arrays.
                    parseSupported = parse("1.") !== 1;
                  } catch (exception) {}
                }
              }
            }
          } catch (exception) {
            parseSupported = false;
          }
        }
        isSupported = parseSupported;
      }
    }
    return has[name] = !!isSupported;
  }

  if (!has("json")) {
    // Common `[[Class]]` name aliases.
    var functionClass = "[object Function]";
    var dateClass = "[object Date]";
    var numberClass = "[object Number]";
    var stringClass = "[object String]";
    var arrayClass = "[object Array]";
    var booleanClass = "[object Boolean]";

    // Detect incomplete support for accessing string characters by index.
    var charIndexBuggy = has("bug-string-char-index");

    // Define additional utility methods if the `Date` methods are buggy.
    if (!isExtended) {
      var floor = Math.floor;
      // A mapping between the months of the year and the number of days between
      // January 1st and the first of the respective month.
      var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
      // Internal: Calculates the number of days between the Unix epoch and the
      // first day of the given month.
      var getDay = function (year, month) {
        return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
      };
    }

    // Internal: Determines if a property is a direct property of the given
    // object. Delegates to the native `Object#hasOwnProperty` method.
    if (!(isProperty = {}.hasOwnProperty)) {
      isProperty = function (property) {
        var members = {}, constructor;
        if ((members.__proto__ = null, members.__proto__ = {
          // The *proto* property cannot be set multiple times in recent
          // versions of Firefox and SeaMonkey.
          "toString": 1
        }, members).toString != getClass) {
          // Safari <= 2.0.3 doesn't implement `Object#hasOwnProperty`, but
          // supports the mutable *proto* property.
          isProperty = function (property) {
            // Capture and break the object's prototype chain (see section 8.6.2
            // of the ES 5.1 spec). The parenthesized expression prevents an
            // unsafe transformation by the Closure Compiler.
            var original = this.__proto__, result = property in (this.__proto__ = null, this);
            // Restore the original prototype chain.
            this.__proto__ = original;
            return result;
          };
        } else {
          // Capture a reference to the top-level `Object` constructor.
          constructor = members.constructor;
          // Use the `constructor` property to simulate `Object#hasOwnProperty` in
          // other environments.
          isProperty = function (property) {
            var parent = (this.constructor || constructor).prototype;
            return property in this && !(property in parent && this[property] === parent[property]);
          };
        }
        members = null;
        return isProperty.call(this, property);
      };
    }

    // Internal: A set of primitive types used by `isHostType`.
    var PrimitiveTypes = {
      'boolean': 1,
      'number': 1,
      'string': 1,
      'undefined': 1
    };

    // Internal: Determines if the given object `property` value is a
    // non-primitive.
    var isHostType = function (object, property) {
      var type = typeof object[property];
      return type == 'object' ? !!object[property] : !PrimitiveTypes[type];
    };

    // Internal: Normalizes the `for...in` iteration algorithm across
    // environments. Each enumerated key is yielded to a `callback` function.
    forEach = function (object, callback) {
      var size = 0, Properties, members, property;

      // Tests for bugs in the current environment's `for...in` algorithm. The
      // `valueOf` property inherits the non-enumerable flag from
      // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
      (Properties = function () {
        this.valueOf = 0;
      }).prototype.valueOf = 0;

      // Iterate over a new instance of the `Properties` class.
      members = new Properties();
      for (property in members) {
        // Ignore all properties inherited from `Object.prototype`.
        if (isProperty.call(members, property)) {
          size++;
        }
      }
      Properties = members = null;

      // Normalize the iteration algorithm.
      if (!size) {
        // A list of non-enumerable properties inherited from `Object.prototype`.
        members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
        // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
        // properties.
        forEach = function (object, callback) {
          var isFunction = getClass.call(object) == functionClass, property, length;
          var hasProperty = !isFunction && typeof object.constructor != 'function' && isHostType(object, 'hasOwnProperty') ? object.hasOwnProperty : isProperty;
          for (property in object) {
            // Gecko <= 1.0 enumerates the `prototype` property of functions under
            // certain conditions; IE does not.
            if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
              callback(property);
            }
          }
          // Manually invoke the callback for each non-enumerable property.
          for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property));
        };
      } else if (size == 2) {
        // Safari <= 2.0.4 enumerates shadowed properties twice.
        forEach = function (object, callback) {
          // Create a set of iterated properties.
          var members = {}, isFunction = getClass.call(object) == functionClass, property;
          for (property in object) {
            // Store each property name to prevent double enumeration. The
            // `prototype` property of functions is not enumerated due to cross-
            // environment inconsistencies.
            if (!(isFunction && property == "prototype") && !isProperty.call(members, property) && (members[property] = 1) && isProperty.call(object, property)) {
              callback(property);
            }
          }
        };
      } else {
        // No bugs detected; use the standard `for...in` algorithm.
        forEach = function (object, callback) {
          var isFunction = getClass.call(object) == functionClass, property, isConstructor;
          for (property in object) {
            if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
              callback(property);
            }
          }
          // Manually invoke the callback for the `constructor` property due to
          // cross-environment inconsistencies.
          if (isConstructor || isProperty.call(object, (property = "constructor"))) {
            callback(property);
          }
        };
      }
      return forEach(object, callback);
    };

    // Public: Serializes a JavaScript `value` as a JSON string. The optional
    // `filter` argument may specify either a function that alters how object and
    // array members are serialized, or an array of strings and numbers that
    // indicates which properties should be serialized. The optional `width`
    // argument may be either a string or number that specifies the indentation
    // level of the output.
    if (!has("json-stringify")) {
      // Internal: A map of control characters and their escaped equivalents.
      var Escapes = {
        92: "\\\\",
        34: '\\"',
        8: "\\b",
        12: "\\f",
        10: "\\n",
        13: "\\r",
        9: "\\t"
      };

      // Internal: Converts `value` into a zero-padded string such that its
      // length is at least equal to `width`. The `width` must be <= 6.
      var leadingZeroes = "000000";
      var toPaddedString = function (width, value) {
        // The `|| 0` expression is necessary to work around a bug in
        // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
        return (leadingZeroes + (value || 0)).slice(-width);
      };

      // Internal: Double-quotes a string `value`, replacing all ASCII control
      // characters (characters with code unit values between 0 and 31) with
      // their escaped equivalents. This is an implementation of the
      // `Quote(value)` operation defined in ES 5.1 section 15.12.3.
      var unicodePrefix = "\\u00";
      var quote = function (value) {
        var result = '"', index = 0, length = value.length, isLarge = length > 10 && charIndexBuggy, symbols;
        if (isLarge) {
          symbols = value.split("");
        }
        for (; index < length; index++) {
          var charCode = value.charCodeAt(index);
          // If the character is a control character, append its Unicode or
          // shorthand escape sequence; otherwise, append the character as-is.
          switch (charCode) {
            case 8: case 9: case 10: case 12: case 13: case 34: case 92:
              result += Escapes[charCode];
              break;
            default:
              if (charCode < 32) {
                result += unicodePrefix + toPaddedString(2, charCode.toString(16));
                break;
              }
              result += isLarge ? symbols[index] : charIndexBuggy ? value.charAt(index) : value[index];
          }
        }
        return result + '"';
      };

      // Internal: Recursively serializes an object. Implements the
      // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
      var serialize = function (property, object, callback, properties, whitespace, indentation, stack) {
        var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
        try {
          // Necessary for host object support.
          value = object[property];
        } catch (exception) {}
        if (typeof value == "object" && value) {
          className = getClass.call(value);
          if (className == dateClass && !isProperty.call(value, "toJSON")) {
            if (value > -1 / 0 && value < 1 / 0) {
              // Dates are serialized according to the `Date#toJSON` method
              // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
              // for the ISO 8601 date time string format.
              if (getDay) {
                // Manually compute the year, month, date, hours, minutes,
                // seconds, and milliseconds if the `getUTC*` methods are
                // buggy. Adapted from @Yaffle's `date-shim` project.
                date = floor(value / 864e5);
                for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
                for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
                date = 1 + date - getDay(year, month);
                // The `time` value specifies the time within the day (see ES
                // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
                // to compute `A modulo B`, as the `%` operator does not
                // correspond to the `modulo` operation for negative numbers.
                time = (value % 864e5 + 864e5) % 864e5;
                // The hours, minutes, seconds, and milliseconds are obtained by
                // decomposing the time within the day. See section 15.9.1.10.
                hours = floor(time / 36e5) % 24;
                minutes = floor(time / 6e4) % 60;
                seconds = floor(time / 1e3) % 60;
                milliseconds = time % 1e3;
              } else {
                year = value.getUTCFullYear();
                month = value.getUTCMonth();
                date = value.getUTCDate();
                hours = value.getUTCHours();
                minutes = value.getUTCMinutes();
                seconds = value.getUTCSeconds();
                milliseconds = value.getUTCMilliseconds();
              }
              // Serialize extended years correctly.
              value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) +
                "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
                // Months, dates, hours, minutes, and seconds should have two
                // digits; milliseconds should have three.
                "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
                // Milliseconds are optional in ES 5.0, but required in 5.1.
                "." + toPaddedString(3, milliseconds) + "Z";
            } else {
              value = null;
            }
          } else if (typeof value.toJSON == "function" && ((className != numberClass && className != stringClass && className != arrayClass) || isProperty.call(value, "toJSON"))) {
            // Prototype <= 1.6.1 adds non-standard `toJSON` methods to the
            // `Number`, `String`, `Date`, and `Array` prototypes. JSON 3
            // ignores all `toJSON` methods on these objects unless they are
            // defined directly on an instance.
            value = value.toJSON(property);
          }
        }
        if (callback) {
          // If a replacement function was provided, call it to obtain the value
          // for serialization.
          value = callback.call(object, property, value);
        }
        if (value === null) {
          return "null";
        }
        className = getClass.call(value);
        if (className == booleanClass) {
          // Booleans are represented literally.
          return "" + value;
        } else if (className == numberClass) {
          // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
          // `"null"`.
          return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
        } else if (className == stringClass) {
          // Strings are double-quoted and escaped.
          return quote("" + value);
        }
        // Recursively serialize objects and arrays.
        if (typeof value == "object") {
          // Check for cyclic structures. This is a linear search; performance
          // is inversely proportional to the number of unique nested objects.
          for (length = stack.length; length--;) {
            if (stack[length] === value) {
              // Cyclic structures cannot be serialized by `JSON.stringify`.
              throw TypeError();
            }
          }
          // Add the object to the stack of traversed objects.
          stack.push(value);
          results = [];
          // Save the current indentation level and indent one additional level.
          prefix = indentation;
          indentation += whitespace;
          if (className == arrayClass) {
            // Recursively serialize array elements.
            for (index = 0, length = value.length; index < length; index++) {
              element = serialize(index, value, callback, properties, whitespace, indentation, stack);
              results.push(element === undef ? "null" : element);
            }
            result = results.length ? (whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : ("[" + results.join(",") + "]")) : "[]";
          } else {
            // Recursively serialize object members. Members are selected from
            // either a user-specified list of property names, or the object
            // itself.
            forEach(properties || value, function (property) {
              var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
              if (element !== undef) {
                // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
                // is not the empty string, let `member` {quote(property) + ":"}
                // be the concatenation of `member` and the `space` character."
                // The "`space` character" refers to the literal space
                // character, not the `space` {width} argument provided to
                // `JSON.stringify`.
                results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
              }
            });
            result = results.length ? (whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : ("{" + results.join(",") + "}")) : "{}";
          }
          // Remove the object from the traversed object stack.
          stack.pop();
          return result;
        }
      };

      // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
      JSON3.stringify = function (source, filter, width) {
        var whitespace, callback, properties, className;
        if (typeof filter == "function" || typeof filter == "object" && filter) {
          if ((className = getClass.call(filter)) == functionClass) {
            callback = filter;
          } else if (className == arrayClass) {
            // Convert the property names array into a makeshift set.
            properties = {};
            for (var index = 0, length = filter.length, value; index < length; value = filter[index++], ((className = getClass.call(value)), className == stringClass || className == numberClass) && (properties[value] = 1));
          }
        }
        if (width) {
          if ((className = getClass.call(width)) == numberClass) {
            // Convert the `width` to an integer and create a string containing
            // `width` number of space characters.
            if ((width -= width % 1) > 0) {
              for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ");
            }
          } else if (className == stringClass) {
            whitespace = width.length <= 10 ? width : width.slice(0, 10);
          }
        }
        // Opera <= 7.54u2 discards the values associated with empty string keys
        // (`""`) only if they are used directly within an object member list
        // (e.g., `!("" in { "": 1})`).
        return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
      };
    }

    // Public: Parses a JSON source string.
    if (!has("json-parse")) {
      var fromCharCode = String.fromCharCode;

      // Internal: A map of escaped control characters and their unescaped
      // equivalents.
      var Unescapes = {
        92: "\\",
        34: '"',
        47: "/",
        98: "\b",
        116: "\t",
        110: "\n",
        102: "\f",
        114: "\r"
      };

      // Internal: Stores the parser state.
      var Index, Source;

      // Internal: Resets the parser state and throws a `SyntaxError`.
      var abort = function() {
        Index = Source = null;
        throw SyntaxError();
      };

      // Internal: Returns the next token, or `"$"` if the parser has reached
      // the end of the source string. A token may be a string, number, `null`
      // literal, or Boolean literal.
      var lex = function () {
        var source = Source, length = source.length, value, begin, position, isSigned, charCode;
        while (Index < length) {
          charCode = source.charCodeAt(Index);
          switch (charCode) {
            case 9: case 10: case 13: case 32:
              // Skip whitespace tokens, including tabs, carriage returns, line
              // feeds, and space characters.
              Index++;
              break;
            case 123: case 125: case 91: case 93: case 58: case 44:
              // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
              // the current position.
              value = charIndexBuggy ? source.charAt(Index) : source[Index];
              Index++;
              return value;
            case 34:
              // `"` delimits a JSON string; advance to the next character and
              // begin parsing the string. String tokens are prefixed with the
              // sentinel `@` character to distinguish them from punctuators and
              // end-of-string tokens.
              for (value = "@", Index++; Index < length;) {
                charCode = source.charCodeAt(Index);
                if (charCode < 32) {
                  // Unescaped ASCII control characters (those with a code unit
                  // less than the space character) are not permitted.
                  abort();
                } else if (charCode == 92) {
                  // A reverse solidus (`\`) marks the beginning of an escaped
                  // control character (including `"`, `\`, and `/`) or Unicode
                  // escape sequence.
                  charCode = source.charCodeAt(++Index);
                  switch (charCode) {
                    case 92: case 34: case 47: case 98: case 116: case 110: case 102: case 114:
                      // Revive escaped control characters.
                      value += Unescapes[charCode];
                      Index++;
                      break;
                    case 117:
                      // `\u` marks the beginning of a Unicode escape sequence.
                      // Advance to the first character and validate the
                      // four-digit code point.
                      begin = ++Index;
                      for (position = Index + 4; Index < position; Index++) {
                        charCode = source.charCodeAt(Index);
                        // A valid sequence comprises four hexdigits (case-
                        // insensitive) that form a single hexadecimal value.
                        if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
                          // Invalid Unicode escape sequence.
                          abort();
                        }
                      }
                      // Revive the escaped character.
                      value += fromCharCode("0x" + source.slice(begin, Index));
                      break;
                    default:
                      // Invalid escape sequence.
                      abort();
                  }
                } else {
                  if (charCode == 34) {
                    // An unescaped double-quote character marks the end of the
                    // string.
                    break;
                  }
                  charCode = source.charCodeAt(Index);
                  begin = Index;
                  // Optimize for the common case where a string is valid.
                  while (charCode >= 32 && charCode != 92 && charCode != 34) {
                    charCode = source.charCodeAt(++Index);
                  }
                  // Append the string as-is.
                  value += source.slice(begin, Index);
                }
              }
              if (source.charCodeAt(Index) == 34) {
                // Advance to the next character and return the revived string.
                Index++;
                return value;
              }
              // Unterminated string.
              abort();
            default:
              // Parse numbers and literals.
              begin = Index;
              // Advance past the negative sign, if one is specified.
              if (charCode == 45) {
                isSigned = true;
                charCode = source.charCodeAt(++Index);
              }
              // Parse an integer or floating-point value.
              if (charCode >= 48 && charCode <= 57) {
                // Leading zeroes are interpreted as octal literals.
                if (charCode == 48 && ((charCode = source.charCodeAt(Index + 1)), charCode >= 48 && charCode <= 57)) {
                  // Illegal octal literal.
                  abort();
                }
                isSigned = false;
                // Parse the integer component.
                for (; Index < length && ((charCode = source.charCodeAt(Index)), charCode >= 48 && charCode <= 57); Index++);
                // Floats cannot contain a leading decimal point; however, this
                // case is already accounted for by the parser.
                if (source.charCodeAt(Index) == 46) {
                  position = ++Index;
                  // Parse the decimal component.
                  for (; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                  if (position == Index) {
                    // Illegal trailing decimal.
                    abort();
                  }
                  Index = position;
                }
                // Parse exponents. The `e` denoting the exponent is
                // case-insensitive.
                charCode = source.charCodeAt(Index);
                if (charCode == 101 || charCode == 69) {
                  charCode = source.charCodeAt(++Index);
                  // Skip past the sign following the exponent, if one is
                  // specified.
                  if (charCode == 43 || charCode == 45) {
                    Index++;
                  }
                  // Parse the exponential component.
                  for (position = Index; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                  if (position == Index) {
                    // Illegal empty exponent.
                    abort();
                  }
                  Index = position;
                }
                // Coerce the parsed value to a JavaScript number.
                return +source.slice(begin, Index);
              }
              // A negative sign may only precede numbers.
              if (isSigned) {
                abort();
              }
              // `true`, `false`, and `null` literals.
              if (source.slice(Index, Index + 4) == "true") {
                Index += 4;
                return true;
              } else if (source.slice(Index, Index + 5) == "false") {
                Index += 5;
                return false;
              } else if (source.slice(Index, Index + 4) == "null") {
                Index += 4;
                return null;
              }
              // Unrecognized token.
              abort();
          }
        }
        // Return the sentinel `$` character if the parser has reached the end
        // of the source string.
        return "$";
      };

      // Internal: Parses a JSON `value` token.
      var get = function (value) {
        var results, hasMembers;
        if (value == "$") {
          // Unexpected end of input.
          abort();
        }
        if (typeof value == "string") {
          if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
            // Remove the sentinel `@` character.
            return value.slice(1);
          }
          // Parse object and array literals.
          if (value == "[") {
            // Parses a JSON array, returning a new JavaScript array.
            results = [];
            for (;; hasMembers || (hasMembers = true)) {
              value = lex();
              // A closing square bracket marks the end of the array literal.
              if (value == "]") {
                break;
              }
              // If the array literal contains elements, the current token
              // should be a comma separating the previous element from the
              // next.
              if (hasMembers) {
                if (value == ",") {
                  value = lex();
                  if (value == "]") {
                    // Unexpected trailing `,` in array literal.
                    abort();
                  }
                } else {
                  // A `,` must separate each array element.
                  abort();
                }
              }
              // Elisions and leading commas are not permitted.
              if (value == ",") {
                abort();
              }
              results.push(get(value));
            }
            return results;
          } else if (value == "{") {
            // Parses a JSON object, returning a new JavaScript object.
            results = {};
            for (;; hasMembers || (hasMembers = true)) {
              value = lex();
              // A closing curly brace marks the end of the object literal.
              if (value == "}") {
                break;
              }
              // If the object literal contains members, the current token
              // should be a comma separator.
              if (hasMembers) {
                if (value == ",") {
                  value = lex();
                  if (value == "}") {
                    // Unexpected trailing `,` in object literal.
                    abort();
                  }
                } else {
                  // A `,` must separate each object member.
                  abort();
                }
              }
              // Leading commas are not permitted, object property names must be
              // double-quoted strings, and a `:` must separate each property
              // name and value.
              if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
                abort();
              }
              results[value.slice(1)] = get(lex());
            }
            return results;
          }
          // Unexpected token encountered.
          abort();
        }
        return value;
      };

      // Internal: Updates a traversed object member.
      var update = function(source, property, callback) {
        var element = walk(source, property, callback);
        if (element === undef) {
          delete source[property];
        } else {
          source[property] = element;
        }
      };

      // Internal: Recursively traverses a parsed JSON object, invoking the
      // `callback` function for each value. This is an implementation of the
      // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
      var walk = function (source, property, callback) {
        var value = source[property], length;
        if (typeof value == "object" && value) {
          // `forEach` can't be used to traverse an array in Opera <= 8.54
          // because its `Object#hasOwnProperty` implementation returns `false`
          // for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
          if (getClass.call(value) == arrayClass) {
            for (length = value.length; length--;) {
              update(value, length, callback);
            }
          } else {
            forEach(value, function (property) {
              update(value, property, callback);
            });
          }
        }
        return callback.call(source, property, value);
      };

      // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
      JSON3.parse = function (source, callback) {
        var result, value;
        Index = 0;
        Source = "" + source;
        result = get(lex());
        // If a JSON string contains multiple tokens, it is invalid.
        if (lex() != "$") {
          abort();
        }
        // Reset the parser state.
        Index = Source = null;
        return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
      };
    }
  }

  // Export for asynchronous module loaders.
  if (isLoader) {
    define(function () {
      return JSON3;
    });
  }
}(this));

},{}],50:[function(_dereq_,module,exports){
module.exports = toArray

function toArray(list, index) {
    var array = []

    index = index || 0

    for (var i = index || 0; i < list.length; i++) {
        array[i - index] = list[i]
    }

    return array
}

},{}]},{},[1])
(1)
});

Vue.http.headers.common['X-CSRF-TOKEN'] = document.querySelector('#token').getAttribute('value');

new Vue({
    el: '#guestbook',

    data: {
        newMessage: {
            name: '',
            email: '',
            message: ''
        },

        submitted: false
    },

    computed: {
        errors: function() {
            for ( var key in this.newMessage) {
                if ( ! this.newMessage[key]) return true;
            }

            return false;
        }
    },

    ready: function() {
        this.fetchMessages();
    },

    methods: {
        fetchMessages: function() {
            this.$http.get('api/messages', function(messages) {
                this.$set('messages', messages);
            })
        },

        onSubmitForm: function(e) {
            e.preventDefault();

            var message = this.newMessage;

            this.messages.push(message);

            this.newMessage = { name: '', email: '', message: '' };

            this.submitted = true;

            this.$http.post('api/messages', message);
        }
    }
});
//# sourceMappingURL=all.js.map