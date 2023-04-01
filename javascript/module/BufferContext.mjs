import { TypedArray } from "./BinaryOperate.mjs";
class BufferContext {
	#current;
	get current(){return this.#current}
	set current(value) {
		if (typeof value!="number") throw new TypeError("Value is not a number.");
		if (value<0||!Number.isInteger(value)) throw new TypeError("Value must be unsign integer.");
		if (value>this.#length) throw new Error("Out of range.");
		this.#current=value;
	}
	#data
	get data(){return this.#data}
	set data(value){this.#data=value}
	#length
	get length(){return this.#length}
	#array
	get array(){return this.#array}
	get hasNext(){return this.#current!=this.#length}
	constructor(array,current=0,data=undefined) {
		if (arguments.length<1) throw new TypeError("Failed to construct 'BufferContext': 1 argument required, but only 0 present.");
		if (!(array instanceof TypedArray)) throw new TypeError("Failed to construct 'BufferContext': Argument 'array' is not a TypedArray.");
		if (arguments.length>1) {
			if (typeof current!="number") throw new TypeError("Failed to construct 'BufferContext': Argument 'current' is not a number.");
			if (current<0||!Number.isInteger(current)) throw new TypeError("Failed to construct 'BufferContext': Argument 'current' must be unsign integer.");
			if (current>array.length) throw new Error("Failed to construct 'BufferContext': Argument 'current' must not greater than array's length.");
		}
		this.#current=current;
		this.#length=(this.#array = array).length;
		this.#data=data;
	}
	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: this.name,
			writable: false,
			configurable: true,
			enumerable: false
		});
	}
}
export default BufferContext;
export {BufferContext}