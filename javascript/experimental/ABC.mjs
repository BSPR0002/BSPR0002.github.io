function unimplemented() { throw new TypeError("Unimplemented.") }
/** @type {PropertyDescriptor} */
const unimplementedProperty = {
	get: unimplemented,
	set: unimplemented,
	configurable: true
};

function decorate(prototype, methods, props) {
	if (methods)
		for (const name of methods)
			prototype[name] = unimplemented;
	if (props) {
		const p = {};
		for (const name of props)
			p[name] = unimplementedProperty;
		// @ts-ignore
		Object.defineProperties(prototype, p);
	}
}

function create(methods, props, extend, name) {
	if (extend && typeof extend != "function") throw new TypeError("Argument 'extend' is not a function.");
	const self = extend ?
		class AbstractClass extends extend {
			constructor() {
				if (new.target === self) throw new TypeError("Cannot construct instances of abstract class.");
				super();
			}
		} :
		class AbstractClass {
			constructor() {
				if (new.target === self) throw new TypeError("Cannot construct instances of abstract class.");
			}
		};
	if (typeof name == "string")
		Object.defineProperty(self, "name", { value: name, configurable: true });
	decorate(self.prototype, methods, props);
	return self;
}

export { create, decorate };