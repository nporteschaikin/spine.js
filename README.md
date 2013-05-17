## A "framework for a framework."  Why?

JavaScript usage, particularly JavaScript written using the uber-popular jQuery framework, often manifests into an unruly 
clusterfuck of objects and methods that (unsurprisingly) aren't clean or semantical and (surprisingly) are not as dynamic 
as they should be. 

## Let's just call this a "pattern for a framework"

I love jQuery.  But, recently, I've found myself waking up before sunrise, sweating as if I'd run miles through the desert
and shaking as if I was trying out for a dance role in a Beyonce music video.  Why?  Because I'm obsessed with writing
code that reads like a contemporary American novel.

## Enough! How do you use it

```javascript
// Separate your functions into objects, like "layout", "grid", "overlay", etc.
var overlay = {

	// Then, create parent objects for selectors and attributes
	selectors: {
		parent: "#overlay",
		child: ".frame",
		link: "a.overlay"
	},
	
	attributes: {
		speed: 150
	}
	
	// If needed, create an initializer method.  Call it "init"
	init: function () {
		// random code you need to run on load
	},
	
	// Do you need anything to "construct" on load?  Is this, say,
	// an object for constructing a jQuery plugin?  Put it in 
	// a construct method.  Call it "__construct."
	__construct: function () {
		
		// STOP! Here, I'll show you how easy it is to call elements
		// in your object literals.  Assume I have an object called
		// "grid" with an element selector named "selector" that I need
		// to init my fantastic (nporteschaikin/)selector.js plugin on:
		e('grid:selector').select();
		
		// ^^ easy, no?  These elements are cached for performance sake,
		// too!  Awesome!
		
	},
	
	// Code in "__construct" will run on load and when HTML is added to the
	// DOM using the $$.insert function (see below!)
	
	// Does this object have any pertinent event handlers you need to set?
	// Throw that in a __bind method; it works just like __construct!
	__bind: function () {
		
		// STOP! 	Use spine's on() method to create events that are cached
		// for easy wiping and can be called with spine selectors.
		
		on('overlay:link', 'click', function(){
			
			// STOP! I'm going to call an attribute now with the a() method.
			e('overlay:parent').fadeIn(a('overlay:speed'));
			
		})
		
	}
}
```

This isn't done.
