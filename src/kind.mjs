

import { merge } from "./utils.mjs";

import { isArray, isFunction, isNull } from "./typecheck.mjs";

/**
 * Creates a JavaScript constructor function with a prototype defined by _inProps_.
 *
 * _kind_ makes it easy to build a constructor-with-prototype (like a class) that 
 * has advanced features like prototype-chaining (inheritance).
 *
 * A plug-in system is included for extending the abilities of the kind generator, and 
 * constructors are allowed to perform custom operations when subclassed.
 *
 * Special Property Names
 * ----------------------
 *
 * Generally the properties defined in inProps are copied directly to the generated 
 * prototype, but certain property names trigger special processing.
	
	Examples of special properties are:
	
	* _name_: the _name_ property defines the name of the created constructor in the global namespace 
	(intermediate objects are created automatically). _name_ is not copied directly to the prototype,
	but is instead stored as _kindName_.

			// Creates a function MyNamespace.MyKind with a prototype.
			// MyNamespace.MyKind.prototype.kindName is set to "MyNamespace.MyKind".
			// MyNamespace.MyKind.prototype.plainProperty is set to "foo".
			kind({
				name: "MyNamespace.MyKind"
				plainProperty: "foo"
			});
			// Make an instance of the new kind
			var myk = new MyNamespace.MyKind();

	* _kind_: the name of or reference to a kind to derive from, like a super-class. The new constructor's prototype is 
	chained to the prototype specified by _kind_, and the _base_ property in the new prototype is set to reference the
	_kind_ constructor.

			// Create a function MyKind with a prototype, derived from enyo.Object.
			// MyKind.prototype.kindName is set to "MyKind".
			// MyKind.prototype.base is set to Object.
			kind({
				name: "MyKind",
				kind: Object
			});

	* _constructor_: a function to call when a new instance is created. Actually stored on the prototype as __constructor_.

			// Create a function MyKind with a prototype, derived from Object.
			// _constructor_ is called when an instance is created. 
			kind({
				name: "MyKind",
				kind: Object,
				constructor: function() {
					this.instanceArray = [];
					// call the constructor inherited from Object
					this.inherited(arguments);
				}
			});

	* _statics_: properties from any _statics_ object are copied onto the constructor directly, instead of the prototype.

			// Create a kind with a static method.
			kind({
				name: "MyKind",
				statics: {
					info: function() {
						return "MyKind is a kind with statics.";
					}
				}
			});
			// invoke the static info() method of MyKind
			console.log(MyKind.info());

	Certain kinds in the framework define their own special properties. 
	For example, see the _published_ property supported by <a href="#Object">Object</a>.

	inherited
	---------

	The _inherited_ feature allows you to easily call the super-kind method for any method 
	that has been overridden.

		kind({
			name: "MyKind",
			doWork: function() {
				this.work++;
			}
		});

		kind({
			name: "MyDerivedKind",
			kind: "MyKind",
			doWork: function() {
				if (this.shouldDoWork) {
					this.inherited(arguments);
				}
			}
		});

	The first argument to _inherited_ is required to be the literal _arguments_, which is a
    special JavaScript variable that contains information about the executing function.
*/
var kind = function (props) {
	var name = props.name || '';
	delete props.name;
	// extract 'kind' property
	var hasKind = ('kind' in props);
	var baseKind = props.kind;
	delete props.kind;
	
	var base = isFunction( baseKind ) ? basekind : isNull( baseKind ) ? null : undefined;
	var isa = base && base.prototype || null;
	
	// if we have an explicit kind property with value undefined, we probably
	// tried to reference a kind that is not yet in scope
	if (hasKind && baseKind === undefined || base === undefined) {
		var problem = kindName === undefined ? 'undefined kind' : 'unknown kind (' + kindName + ')';
		throw 'enyo.kind: Attempt to subclass an ' + problem + '. Check dependencies for [' + (name || '<unnamed>') + '].';
	}
	
	// make a boilerplate constructor
	var ctor = makeCtor();
	// semi-reserved word 'constructor' causes problems with Prototype and IE, so we rename it here
	if (props.hasOwnProperty('constructor')) {
		props._constructor = props.constructor;
		delete props.constructor;
	}
	
	if(isa) {
		var Instance = function () {};
		Instance.prototype = isa;
		ctor.prototype = new Instance();
	}
	else {
		ctor.prototype = {};
	}

	// there are special cases where a base class has a property
	// that may need to be concatenated with a subclasses implementation
	// as opposed to completely overwriting it...
	concatHandler(ctor, props);

	// put in our props
	merge(ctor.prototype, props);

	// alias class name as 'kind' in the prototype
	// but we actually only need to set this if a new name was used,
	// not if it is inheriting from a kind anonymously
	if (name) {
		ctor.prototype.kindName = name;
	}
	// this is for anonymous constructors
	else {
		ctor.prototype.kindName = base && base.prototype? base.prototype.kindName: '';
	}
	// cache superclass constructor
	ctor.prototype.base = base;
	// reference our real constructor
	ctor.prototype.ctor = ctor;
	// support pluggable 'features'
	//utils.forEach(kind.features, function(fn){ fn(ctor, props); });
	
	//if (name) kindCtors[name] = ctor;
	
	return ctor;
};

const makeCtor = function () {
	var xewaConstructor = function () {
		if (!(this instanceof xewaConstructor)) {
			throw 'kind: constructor called directly, not using "new"';
		}

		// two-pass instantiation
		var result;
		if (this._constructor) {
			// pure construction
			result = this._constructor.apply(this, arguments);
		}
		// defer initialization until entire constructor chain has finished
		if (this.constructed) {
			// post-constructor initialization
			this.constructed.apply(this, arguments);
		}

		if (result) {
			return result;
		}
	};
	return xewaConstructor;
};

const concatHandler = function (ctor, props, instance) {
	var proto = ctor.prototype || ctor
		, base = proto.ctor;

	while (base) {
		if (base.concat) {
			base.concat(ctor, props, instance);
		}
		base = base.prototype.base;
	}
};

/**
* @private
*/
var concatenated = [];

const Inherited = function (fn) {
	this.fn = fn;
};

/**
* When defining a method that overrides an existing method in a [kind]{@glossary kind}, you
* can wrap the definition in this function and it will decorate it appropriately for inheritance
* to work.
*
* The older `this.inherited(arguments)` method still works, but this version results in much
* faster code and is the only one supported for kind [mixins]{@glossary mixin}.
*
* @param {Function} fn - A [function]{@glossary Function} that takes a single
*   argument (usually named `sup`) and returns a function where
*   `sup.apply(this, arguments)` is used as a mechanism to make the
*   super-call.
* @public
*/
kind.inherit = function (fn) {
	return new Inherited(fn);
};

/**
* @private
*/
const isInherited = function (fn) {
	return fn && (fn instanceof Inherited);
};

/**
 * Allows for extension of the current [kind]{@glossary kind} without
 * creating a new kind. This method is available on all
 * [constructors]{@glossary constructor}, although calling it on a
 * [deferred]{@glossary deferred} constructor will force it to be
 * resolved at that time. This method does not re-run the
 * {@link module:enyo/kind.features} against the constructor or instance.
 *
 * @name module:enyo/kind.extend
 * @method
 * @param {Object|Object[]} props A [hash]{@glossary Object} or [array]{@glossary Array}
 *	of [hashes]{@glossary Object}. Properties will override
 *	[prototype]{@glossary Object.prototype} properties. If a
 *	method that is being added already exists, the new method will
 *	supersede the existing one. The method may call
 *	`this.inherited()` or be wrapped with `kind.inherit()` to call
 *	the original method (this chains multiple methods tied to a
 *	single [kind]{@glossary kind}).
 * @param {Object} [target] - The instance to be extended. If this is not specified, then the
 *	[constructor]{@glossary constructor} of the
 *	[object]{@glossary Object} this method is being called on will
 *	be extended.
 * @returns {Object} The constructor of the class, or specific
 *	instance, that has been extended.
 * @public
 */
const extend = function (props, target) {
	var ctor = this
		, exts = isArray(props) ? props : [props]
		, proto, fn;

	fn = function (key, value) {
		return !(isFunction(value) || isInherited(value)) && concatenated.indexOf(key) === -1;
	};

	proto = target || ctor.prototype;
	for (var i=0, ext; (ext=exts[i]); ++i) {
		kind.concatHandler(proto, ext, true);
		kind.extendMethods(proto, ext, true);
		utils.mixin(proto, ext, {filter: fn});
	}

	return target || ctor;
}

export { kind as default };
