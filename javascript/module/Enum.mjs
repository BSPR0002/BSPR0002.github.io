const regexp = /^[A-Za-z_]\w*$/;
class Enum {
	#keysMap;
	constructor(array, useSymbol = false) {
		if (arguments.length < 1) throw new TypeError("Failed to construct 'Enum': 1 arguments required, but only 0 present.");
		if (!Array.isArray(array)) throw new TypeError("Failed to construct 'Enum': Argument 'array' is not an array.");
		const keysMap = this.#keysMap = Object.create(null)
		for (let i = 0, l = array.length; i < l; ++i) {
			const key = array[i];
			if (!(typeof key == "string" && key.match(regexp))) throw new TypeError(`Failed to construct 'Enum': Invalid element at [${i}].`);
			if (key in this) throw new Error(`Failed to construct 'Enum': Duplicate element at [${i}].`);
			const value = useSymbol ? Symbol(key) : i;
			keysMap[this[key] = value] = key;
		}
		Object.freeze(this);
	}
	static keyOf(instance, value) {
		if (arguments.length < 2) throw new TypeError(`Failed to execute 'keyOf': 2 arguments required, but only ${arguments.length} present.`);
		if (!(instance instanceof Enum)) throw new TypeError("Failed to execute 'keyOf': Argument 'instance' is not an enum.");
		const type = typeof value;
		if (!(type == "number" || type == "symbol")) throw new TypeError("Failed to execute 'keyOf': Argument 'value' is not a number or symbol.");
		return instance.#keysMap[value];
	}
	static isValueOf(instance, value) {
		if (arguments.length < 2) throw new TypeError(`Failed to execute 'isValueOf': 2 arguments required, but only ${arguments.length} present.`);
		if (!(instance instanceof Enum)) throw new TypeError("Failed to execute 'isValueOf': Argument 'instance' is not an enum.");
		const type = typeof value;
		if (!(type == "number" || type == "symbol")) throw new TypeError("Failed to execute 'isValueOf': Argument 'value' is not a number or symbol.");
		return value in instance.#keysMap;
	}
	static {
		this.prototype[Symbol.toStringTag] = "Enum";
		Object.freeze(Object.setPrototypeOf(this.prototype, null));
	}
}
export { Enum };
export default Enum;