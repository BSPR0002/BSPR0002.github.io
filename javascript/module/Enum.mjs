class Enum {
	#size;
	#array;
	constructor(array, custom = undefined) {
		if (!Array.isArray(array)) throw new TypeError("Failed to construct 'Enum': Constructor requires an array for argument.");
		this.#size = (this.#array = Object.freeze(Array.from(array))).length;
		if (arguments.length > 1) {
			if (!(custom instanceof Object)) throw new TypeError("Failed to construct 'Enum': Argument 'custom' is not an object.");
			if (typeof custom.hasIndex == "function") this.#customHasIndex = custom.hasIndex;
			if (typeof custom.hasValue == "function") this.#customHasValue = custom.hasValue;
			if (typeof custom.valueOf == "function") this.#customValueOf = custom.valueOf;
			if (typeof custom.indexOf == "function") this.#customIndexOf = custom.indexOf;
			if (typeof custom.size == "function") this.#customSize = custom.size;
		}
	}
	hasIndex(index) { return Number.isInteger(index) && index > -1 && index < this.#size }
	#customHasIndex
	customHasIndex(index) { if (this.#customHasIndex) return this.#customHasIndex(this.#array, index) }
	hasValue(value) { return this.#array.indexOf(value) != -1 }
	#customHasValue
	customHasValue(value) { if (this.#customHasValue) return this.#customHasValue(this.#array, value) }
	valueOf(index) { return this.#array[index] }
	#customValueOf
	customValueOf(index) { if (this.#customValueOf) return this.#customValueOf(this.#array, index) }
	indexOf(value) { return this.#array.indexOf(value) }
	#customIndexOf
	customIndexOf(value) { if (this.#customIndexOf) return this.#customIndexOf(this.#array, value) }
	get size() { return this.#size }
	#customSize
	customSize() { if (this.#customSize) return this.#customSize(this.#array) }
	keys() { return this.#array.keys() }
	entries() { return this.#array.entries() }
	values() { return this.#array.values() }
	forEach(callback, thisArg) { this.#array.forEach(callback, thisArg) }
	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: this.name,
			writable: false,
			configurable: true,
			enumerable: false
		});
		Object.defineProperties(this.prototype, Symbol.iterator, {
			value: this.prototype.entries,
			writable: true,
			configurable: true,
			enumerable: false
		});
	}
}
const regexp = /^[A-Za-z_]\w*$/;
function simpleEnum(array, uppercase = true) {
	if (!Array.isArray(array)) throw new TypeError("Failed to execute 'simpleEnum': Argument 'array' is not an array.");
	const result = [];
	for (let i = 0, l = array.length; i < l; ++i) {
		const value = array[i];
		if (value === undefined || value === null) continue;
		if (typeof value != "string" || !value.match(regexp)) throw new TypeError(`Failed to execute 'simpleEnum': Invalid element at [${i}].`);
		if (result.includes(value)) throw new TypeError(`Failed to execute 'simpleEnum': Duplicate element at [${i}].`);
		result[i] = value;
		result[uppercase ? value.toUpperCase() : value] = i;
	}
	return Object.freeze(result);
}
export { Enum, simpleEnum }
export default Enum;