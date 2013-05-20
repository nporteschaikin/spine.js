(function(window, undefined){
	
	// http://www.lyricsfreak.com/b/big+star/im+in+love+with+a+girl_20017622.html
	
	var objects = {};
	
	var isReady;
	
	Spine = function(name){
		if (!objects[name]) objects[name] = new Spine.fn.__construct(name);
		return objects[name];
	},
	
	Spine.j = this.jQuery;
	
	Spine.fn = Spine.prototype = {
		
		__construct: function(name){
			this._name = name;
			return this;
		},
		
		init: function () {
			this.runInit();
			this.runConstruct();
			this.install();
			return this;
		},
		
		install: function() {
			if (this._intervals)
				for (x in this._intervals) this.start(x);
			
			if (this._timers)
				for (x in this._timers) this.run(x);
			
			return this;
		},
		
		setAttribute: function(name, value) {
			if (!name || !value) return false;
			this._attributes || (this._attributes = {});
			this._attributes[name] = value;
			return this;
		},
		
		getAttribute: function(name) {
			return this._attributes[name];
		},
		
		setSelector: function(name, selector) {
			if (!name || !selector) return false;
			this._selectors || (this._selectors = {});
			this._selectors[name] = selector;
			return this;
		},
		
		getSelector: function(selector) {
			return this._selectors[selector];
		},
		
		setMethod: function(name, method) {
			if (typeof method != 'function') return false;
			this._methods || (this._methods = {});
			this._methods[name] = method;
			return this;
		},
		
		runMethod: function(name) {
			if (!this._methods || typeof this._methods[name] !== 'function') return;
			this._methods[name].apply(this, Array.prototype.slice.call(arguments, 1));
		},
		
		setInit: function(method) {
			if (typeof method != 'function') return false;
			this._init = method;
			return this;
		},
		
		runInit: function() {
			if (typeof this._init === 'function') return this._init();
			return false;
		},
		
		setConstruct: function(method) {
			if (typeof method != 'function') return false;
			this._construct = method;
			return this;
		},
		
		runConstruct: function() {
			if (typeof this._construct === 'function') return this._construct();
			return false;
		},
		
		on: function(event, method) {
			if (typeof method != 'function') return false;
			this._events || (this._events = {});
			this._events[name] = {method: method, status: true};
			return this;
		},
		
		off: function(event) {
			if (this._events && this._events[name]) {
				this._events[name].status = false;
			}
			return this;
		},
		
		trigger: function(event) {
			if (this._events && this._events[name] && this._events[name].status) 
				this._events[name].method.apply(this, Array.prototype.slice.call(arguments, 1));
		},
		
		every: function(time, name, method) {
			this._intervals || (this._intervals = {});
			this._intervals[name] = {time: time, method: method};
			return this;
		},
		
		start: function(name) {
			if (!this._intervals || !this._intervals[name]) return false;
			if (this._intervals[name].interval) clearInterval(this._intervals[name].interval);
			this._intervals[name].interval = setInterval(this._intervals[name].method, this._intervals[name].time);
		},
		
		stop: function(name) {
			if (!this._intervals || !this._intervals[name]) return false;
			clearInterval(this._intervals[name].interval);
		},
		
		once: function(name, method, time) {
			this._timers || (this._timers = {});
			this._timers[name] = {time: time, method: method};
			return this;
		},
		
		run: function(name) {
			if (!this._timers || !this._timers[name]) return false;
			if (this._intervals[name].timer) clearTimeout(this._intervals[name].timer);
			this._timers[name].timer = setTimeout(this._timers[name].method, this._timers[name].time);
		}
		
	}
	
	Spine.fn.__construct.prototype = Spine.fn;
	
	var elements = {};
	
	Spine.e = function(selector){
		if (!elements[selector]) elements[selector] = new Spine.e.fn.__construct(selector);
		return elements[selector];
	}
	
	Spine.$ = function(selector){
		if (!elements[selector]) elements[selector] = new Spine.e.fn.__construct(selector);
		return elements[selector].get();
	}
	
	Spine.e.fn = Spine.prototype = {
		
		constructor: Spine,
		
		__construct: function(selector) {
			this._selector = selector;
			return this;
		},
		
		get: function() {
			this._element || (this._element = Spine.j(selector(this._selector)));
			return this._element;
		},
		
		on: function(event, method) {
			this._element || this.get();
			this._events || (this._events = {});
			if (typeof method != 'function' && this._events[name]) {
				this._events[name].status = true;
			} else {
				this._events[name] = {method: method, status: true};
			}
			this._element.on(event, this._events[name].method);
			return this;
		},
		
		off: function(event) {
			this._element || this.get();
			if (this._events && this._events[name]) {
				this._events[name].status = false;
				this._element.off(event);
			}
			return this;
		},
		
		trigger: function(event) {
			this._element || this.get();
			if (this._events && this._events[name] && this._events[name].status)
				this._element.trigger(event);
		},
		
		bindEvents: function() {
			if (!this._events) return false;
			this.wipeEvents();
			for (x in this._events) this.on(x, this._events[x].method);
			return this;
		},
		
		wipeEvents: function() {
			if (!this._events) return false;
			for (x in this._events) this.off(x);
			return this;
		},
		
		html: function(html) {
			this._element || this.get();
			return Spine.html(this, html);
		},
		
		remove: function() {
			this._element || this.get();
			return Spine.remove(this);
		},
		
		clean: function () {
			if (this._element) this._element = false;
			return this;
		}
		
	}
	
	function selector(selector) {
		
		var array = [];
		if (typeof selector === 'string') {
			selectors = selector.split('/');
			for (x in selectors) {
				selectors[x] = selectors[x].split(':');
				array.push(Spine(selectors[x][0]).getSelector(selectors[x][1]));
			}
			return array.join(' ');
		}
		
		return false;
		
	}
	
	Spine.e.fn.__construct.prototype = Spine.e.fn;
	
	Spine.ready = Spine.prototype = function(method) {
		
		if ( !document.body ) {
			return setTimeout(Spine.ready);
		}
		
		isReady = true;
		if (method) return method.call();
		return true;
		
	}
	
	Spine.load = Spine.prototype = function(object) {
		
		if (object instanceof Spine.fn.__construct) {
			Spine.ready(objects[object].init);
		} else if (!object) {
			Spine.ready(Spine.init);
		} else {
			return false;
		}
		
		return true;
		
	}
	
	Spine.init = Spine.prototype = function(object) {
		for (x in objects) objects[x].init();
		return true;
	}
	
	Spine.install = Spine.prototype = function(object) {
		
		if (object) {
			objects[object].runConstruct();
			objects[object].install();
		} else {
			for (x in objects) {
				objects[x].runConstruct();
				objects[x].install();
			}
		}
		
		for (x in elements) {
			elements[x].clean();
			elements[x].bindEvents();
		} 
		
		return true;
		
	}
	
	Spine.html = Spine.prototype = function(object, html, method) {
		
		if (object instanceof Spine.e.fn.__construct) {
			object.get().html(html);
		} else if (object instanceof Spine.j) {
			object.html(html);
		} else {
			return false;
		}
		
		if (method) method.call(object);
		Spine.install();
		return true;
		
	}
	
	Spine.remove = Spine.prototype = function(object) {
		
		if (object instanceof Spine.e.fn.__construct) {
			object.get().remove();
		} else if (object instanceof Spine.j) {
			object.remove();
		} else {
			return false;
		}
		
		if (method) method.call(object);
		return true;
		
	}
	
	window.Spine = window._ = Spine;
	
})(window);