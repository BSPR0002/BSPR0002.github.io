class Variable {
	#value;
	get value() { return this.#value }
	set value(v) {
		const o = this.#value, f = this.#filter;
		this.#value = f ? v = f(v) : v;
		for (const item of this.#listeners) try { item(v, o, this) } catch (e) { console.error(e) }
	}
	#listeners = [];
	addChangeListener(listener) {
		if (typeof listener != "function") throw new TypeError("Arguments 'listener' is not a function.");
		if (this.#listeners.includes(listener)) return;
		this.#listeners.push(listener);
	}
	removeChangeListener(listener) {
		if (typeof listener != "function") throw new TypeError("Arguments 'listener' is not a function.");
		const index = this.#listeners.indexOf(listener);
		if (index != -1) this.#listeners.splice(index, 1);
	}
	#filter;
	constructor(value, filter, disableSilentSetter = false) {
		if (filter !== null && filter !== undefined) {
			if (typeof filter != "function") throw new TypeError("Arguments 'checker' is not a function.");
			this.#filter = filter;
			try {
				this.#value = filter(value, this);
			} catch (e) {
				console.warn("Variable constructor received a value that was rejected by the filter.");
				console.error(e);
			}
		} else this.#value = value;
		this.#silentSetterDisabled = Boolean(disableSilentSetter);
	}
	#silentSetterDisabled;
	setValueSilently(value) {
		if (this.#silentSetterDisabled) throw new Error("Cannot set value silently on this Variable.");
		const f = this.#filter;
		this.#value = f ? f(value) : value;
	}
}

export default Variable;