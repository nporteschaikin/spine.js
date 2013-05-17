/*!
 *
 * spine.js
 * my desperate attempt to organize and clean up jQuery
 *
 * (C) 2013 Noah Portes Chaikin
 * Released under the do-whatever-you-want-with-this license
 *
 * Version 1.0
 * created_at => 2013-05-16
 * updated_at => 2013-05-17 
 *
 */

(function(window, undefined){

var 

	// The naming structure for objects
	// Feel free to change these.
	parents = {
		s: 'selectors',
		a: 'attributes',
		construct: '__construct',
		bind: '__bind',
		init: 'init'
	};
	
	// Intervals set with _.setInt
	intervals = [],
	
	// Timeouts set with  _.setTime
	timeouts = [],
	
	// All elements called with
	// spine.js are cached
	elements = [],
	
	// Objects with construct methods
	constructs = [],
	
	// Objects with bind methods
	binds = [],
	
	// Events set with on();
	events = [],
	
	// The jQuery.data attribute used for 
	// storing event data.
	eventAttr = 'ev',
	
	
	Spine = function (selector, init) {
		if ( init ) return new Spine.fn.execute(selector, true).init();
		return new Spine.fn.execute(selector);
	};

	Spine.fn = Spine.prototype = {
		
		execute: function (selector) {
			
			this.selector = selector;
			
			// Handle simple selectors
			if ( typeof selector === 'string' ) {
				// Handle simple object calls (ex: _('object'))
				if ( selector.split(':').length == 1 && eval(this.selector) ) this.object = true;
			// Handle window, document
			} else if ( selector == window || selector == document ) {
				this.element = $(selector);
			// Handle jQuery objects
			} else if ( typeof selector === 'object' ) {
				this.element = selector;
			}
			
			return this;
			
		},
		
		// grab element by selector
		e: function () {
			if ( !this.element ) {
				// Cache elements by selector
				if ( !elements[this.selector] ) elements[this.selector] = $(__v(this.selector, parents.s).join(' '));
				// Grab element to use from cache
				this.element = elements[this.selector];
			}
			return this.element;
		},
		
		// grab attribute
		a: function (value) {
			if ( !this.attribute ) this.attribute = __last(__v(this.selector, parents.a));
			// if value is present, set value
			if ( value != undefined ) this.set(value);
			return this.attribute;
		},
		
		// grab css selector
		s: function() {
			if ( !this.cssSelector ) this.cssSelector = __v(this.selector, parents.s).join(' ');
			return this.cssSelector;
		},
		
		// grab css class (by selector)
		c: function () {
			if ( !this.cssClass ) this.cssClass = __v(this.selector, parents.s).join(' ').substring(1);
			return this.cssClass;
		},

		// grab css ID (by selector)
		i: function () {
			if ( !this.cssId ) this.cssId = __v(this.selector, parents.s).join(' ').substring(1);
			return this.cssId;
		},
		
		// this is really just a helper function
		// for returning css data attributes (i.e. [data-attr])
		d: function (value) {
			if ( !this.attribute ) this.attribute = this.a();
			// return with value if value set
			if ( value != undefined ) return '[data-' + this.attribute + '="' + value + '"]';
			return '[data-' + this.attribute + ']';
		},
		
		// set an attribute
		set: function (value) {
			if ( !this.attribute ) this.attribute = __v(this.selector, parents.a);
			if ( this.attribute ) __set(__k(this.selector, parents.a), value);
		},
		
		// set and cache an event handler for easy cleanup
		on: function (e, callback) {
			if ( e && typeof callback === 'function' && this.e() ) {
				this.e().on(__eventName(this.e(), e), 
					function (eventData) {
						callback.call($(this), eventData);
					}
				)
			}
		},
		
		// unset event handler
		off: function (e) {
			var ev = this.e().data(eventAttr) || [];
			if ( e && ev[e] ) {
				for ( x in ev[e] ) {
					this.e().off(ev[e][i]);
				}
			} else {
				for ( x in ev ) {
					for ( y in ev[x] ) {
						this.e().off(ev[x][y]);
					}
				}
			}
		},
		
		// initialize an object
		// you don't need to run your construct
		// or binds in your object.init() method,
		// as this method will run all of the above.
		init: function () {
			
			if ( this.object ) {
				init(this.selector);
				construct(this.selector);
				bind(this.selector);
				return this;
			}
			
			return false;
			
		}
	
	};
	
	// load an object based on an event
	// e: event
	// el: object to bind event to (selector, jQ object, window/document)
	Spine.load = Spine.fn.load = function ( selector, el, e ) {
		if ( el == document || el == window ) {
			$(el).on(e, function () { Spine(selector, true) });
		} else if ( typeof el == 'object' ) {
			el.on(e, function () { Spine(selector, true) });
		} else if ( typeof el == 'string' ) {
			Spine(selector).on(e, function () { Spine(selector, true) });
		}
		
	}
	
	// insert HTML inside an element
	// selector can be Spine selector
	// or jQ object
	// runs Spine.install on completion
	// and has callback argument (with el
	// set as this.
	Spine.insert = Spine.fn.insert = function ( selector, url, callback ) {
		
		var el;
		
		if ( typeof selector == 'string' ) {
			el = Spine(selector).e();
		} else if ( typeof selector == 'object' ) {
			el = $(selector);
		}
		
		$.get ( url, 
			function (r) {
				el.html(r);
				Spine.install();
				if ( typeof callback == 'function' ) callback.call( el );
			}
		)
		
	}
	
	
	// remove an element by selector
	// (either Spine selector or jQ object)
	// has callback argument with el
	// set as this.
	Spine.remove = Spine.fn.remove = function ( selector, callback ) {
		
		if ( typeof selector == 'string' ) {
			el = Spine(selector).e();
		} else if ( typeof selector == 'object' ) {
			el = $(selector);
		}
		
		el.remove();
		if ( typeof callback == 'function' ) callback.call(el);
		
	}
	
	// set an interval in Spine cache
	// that can be easily wiped
	Spine.setInt = Spine.fn.setInt = function (name, fn, num) {
		
		if ( !intervals[name] ) {
			intervals[name] = setInterval(fn, num);
			return true;
		}
		
		return false;
		
	};
	
	// delete a Spine-cached interval
	Spine.delInt = Spine.fn.delInt = function (name) {
		
		if ( intervals[name] ) {
			clearInterval(intervals[name]);
			return true;
		}
		
		return false;
		
	};
	
	// set a timeout in Spine cache
	// that can be easily wiped
	Spine.setTime = Spine.fn.setTime = function (name, fn, num) {
		
		timeouts[name] = setTimeout(fn, num);
		return true;
		
	};
	
	// delete a Spine-cached timeout
	Spine.delTime = Spine.fn.delTime = function (name) {
		
		if ( timeouts[name] ) {
			clearTimeout(timeouts[name]);
			return true;
		}
		
		return false;
		
	};
	
	// wipes elements, intervals, and timeouts
	// cache.  very useful for managing XHR-heavy
	// sites (like sites with the Turbolinks gem
	// or with XHR-based overlays, etc)
	Spine.clear = Spine.fn.clear = function () {
		
		elements = [];
		
		for ( var n in intervals )
			clearInterval ( intervals[n] )
		
		for ( var n in timeouts )
			clearTimeout ( timeouts[n] )
		
	};
	
	// reinstalls binds and re-constructs
	// cached objects
	Spine.install = Spine.fn.install = function () {
		
		Spine.sweepEvents();
		elements = [];
		
		for (x in binds) {
			bind(x);
		}
		
		for (x in constructs) {
			construct(x);
		}
		
	};
	
	// wipes all Spine events from 
	// all elements in the DOM
	Spine.sweepEvents = Spine.fn.down = function () {

		for (x in events) {
			$('*').off(events[x]);
		}
		
	}
	
	// a helper for creating unique strings
	// useful when creating timeouts and intervals
	Spine.unique = Spine.fn.unique = function(name) {
		return name + Math.ceil(Math.random()*1000);
	}
	
	// executes object inits
	function init (selector) {
		
		if ( eval(selector)[parents.init] ) {
			eval(selector)[parents.init].call();
			return true;
		}
		return false;
	};
	
	// executes object constructs
	function construct (selector) {
		if ( eval(selector)[parents.construct] ) {
			constructs[selector] = true;
			eval(selector)[parents.construct].call();
			return true;
		}
		return false;
	};
	
	// executes object binds
	function bind (selector) {
		if ( eval(selector)[parents.bind] ) {
			binds[selector] = true;
			eval(selector)[parents.bind].call();
			return true;
		}
		return false;
	};
	
	// return value of selector
	function __v (selector, parent) {
		
		if ( typeof selector === 'string' ) {
			
			var value = [],
			selectors = selector.split('/');

			for ( x in selectors ) {
				selectors[x] = selectors[x].split(':');
				value.push(eval(selectors[x][0])[parent][selectors[x][1]]);
			}
			
			return value;
			
		}
		
		return false;
		
	};
	
	// return selector's actual "object path"
	function __k (selector, parent) {
		
		if ( typeof selector === 'string' ) {
			var selectors = selector.split('/');
			selector = selectors[0].split(':');
			return selector[0] + '.' + parent + '.' + selector[1];
		}
		
		return false;
		
	}
	
	// set selector's actual "object path" 
	// to new value
	function __set (key, value) {
		
		if ( typeof key == 'string' ) {
			eval(key + ' = ' + value);
			return true;
		}
		
		return false;
		
	}
	
	// returns an event name and adds
	// event to Spine cache
	function __eventName (el, e) {
		
		var unique = e + '.' + Math.ceil(Math.random()*1000),
		ev = el.data(eventAttr) || [];
		
		if (!ev[e]) ev[e] = [];
		
		ev[e].push(unique);
		el.data(eventAttr, ev);
		
		events.push(unique);
		return unique;
		
	}
	
	// just re-naming pop() (gets
	// last value in array)
	function __last (array) {
		return array.pop();
	}
	
	
	// e => _(selector).e();
	e = function (selector) {
		return new Spine.fn.execute(selector).e();
	};
	
	// a => _(selector).a();
	a = function (selector, value) {
		return new Spine.fn.execute(selector).a(value);
	};
	
	// s => _(selector).s();
	s = function (selector) {
		return new Spine.fn.execute(selector).s();
	};
	
	// c => _(selector).c();
	c = function (selector) {
		return new Spine.fn.execute(selector).c();
	};
	
	// i => _(selector).i();
	i = function (selector) {
		return new Spine.fn.execute(selector).i();
	};
	
	// d => _(selector).d(value);
	d = function (selector, value) {
		return new Spine.fn.execute(selector).d(value);
	};
	
	// on => _(selector).on(e, callback);
	on = function (selector, e, callback) {
		return new Spine.fn.execute(selector).on(e, callback);
	};
	
	// on => _(selector).off(e, callback);
	off = function (selector, e, callback) {
		return new Spine.fn.execute(selector).off(e, callback);
	};
	
	// add Spine to global object
	Spine.fn.execute.prototype = Spine.fn;
	window.Spine = window._ = Spine;

})(window);