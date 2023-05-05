class LocalStorageObject {
	static #checkInstance(instance) { if (!(instance instanceof this)) throw new TypeError("Illegal invocation") }
	#onempty = null;
	get onempty() { return this.#onempty }
	set onempty(value) { this.#onempty = typeof value == "function" ? value : null }
	#onbroken = null;
	get onbroken() { return this.#onbroken }
	set onbroken(value) { this.#onbroken = typeof value == "function" ? value : null }
	#realtimeUpdate = false;
	get realtimeUpdate() { return this.#realtimeUpdate }
	set realtimeUpdate(value) { this.#realtimeUpdate = Boolean(value) }
	#storageName;
	#object;
	get object() {
		if (this.#realtimeUpdate) this.update();
		return new Proxy(this.#object, new Handler(this, []));
	}
	save() {
		LocalStorageObject.#checkInstance(this);
		if (this.#savePending) return;
		this.#savePending = true;
		queueMicrotask(this.#doSave.bind(this));
	}
	#savePending = false;
	#doSave() {
		localStorage.setItem(this.#storageName, JSON.stringify(this.#object));
		this.#savePending = false;
	}
	isMatch(path, object) {
		LocalStorageObject.#checkInstance(this);
		if (arguments.length < 2) throw new TypeError(`Failed to execute 'isMatch' on 'LocalStorageObject': 2 arguments required, but only ${arguments.length} present.`);
		if (!Array.isArray(path)) throw new TypeError("Failed to execute 'isMatch' on 'LocalStorageObject': Argument 'path' is not an array.");
		if (!(object instanceof Object)) throw new TypeError("Failed to execute 'isMatch' on 'LocalStorageObject': Argument 'object' is not an object.");
		var value = this.#object;
		try { for (let key of path) value = value[key] } catch (ignore) { return false }
		return value == object;
	}
	constructor(key, options = null) {
		if (arguments.length < 1) throw new TypeError("Failed to construct 'LocalStorageObject': 1 argument required, but only 0 present.");
		if (typeof key != "string") throw new TypeError("Failed to construct 'LocalStorageObject': Argument 'key' must be a string.");
		if (options !== null) {
			if (typeof options != "object") throw new TypeError("Failed to construct 'LocalStorageObject': Argument 'options' must be an object.");
			if ("onempty" in options) {
				let temp = options.onempty;
				if (typeof temp == "function") {
					this.#onempty = temp;
				} else throw new TypeError("Failed to construct 'LocalStorageObject': options.onempty must be a function.");
			}
			if ("onbroken" in options) {
				let temp = options.onbroken;
				if (typeof temp == "function") {
					this.#onbroken = temp;
				} else throw new TypeError("Failed to construct 'LocalStorageObject': options.onbroken must be a function.");
			}
		}
		const source = localStorage.getItem(key);
		var object;
		if (source === null) {
			const callback = this.#onempty;
			if (callback) {
				object = callback();
				if (!(object instanceof Object)) throw new TypeError("Failed to construct 'LocalStorageObject': options.onempty return a non-object value.");
			} else object = {};
			this.save();
		} else {
			try { if (!((object = JSON.parse(source)) instanceof Object)) throw new TypeError } catch (ignore) {
				const callback = this.#onbroken;
				if (callback) {
					object = callback(source);
					if (!(object instanceof Object)) throw new TypeError("Failed to construct 'LocalStorageObject': options.onbroken return a non-object value.");
				} else object = {};
				this.save();
				console.warn(`Cannot parse localStorage item named '${key}', reset with:`, object);
			}
		}
		this.#object = object;
		this.#storageName = key;
	}
	#updataPending = false;
	update() {
		LocalStorageObject.#checkInstance(this);
		if (this.#updataPending) return;
		this.#updataPending = true;
		var object;
		const key = this.#storageName
		const source = localStorage.getItem(key);
		try { if (!((object = JSON.parse(source)) instanceof Object)) throw new TypeError } catch (ignore) {
			const callback = this.#onbroken;
			if (callback) {
				object = callback(source);
				if (!(object instanceof Object)) throw new TypeError("'onbroken' callback return a non-object value.");
			} else object = {};
			this.save();
			console.warn(`Cannot parse localStorage item named '${key}', reset with:`, object);
		}
		this.#object = object;
		queueMicrotask(this.#clearUpdate.bind(this));
	}
	#clearUpdate() { this.#updataPending = false }
	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: this.name,
			configurable: true
		});
	}
	static objectLink(proxyObject, propertyName, object) {
		proxyObject[propertyName]=object;
		return proxyObject[propertyName]
	}
}
class Handler {
	constructor(storageController, path) {
		if (arguments.length < 2) throw new TypeError(`Failed to construct 'LocalStorageObject': 2 arguments required, but only ${arguments.length} present.`);
		if (!(storageController instanceof LocalStorageObject)) throw new TypeError("Failed to construct 'Handler': Argument 'storageController' is not type of 'LocalStorageObject'.");
		if (!Array.isArray(path)) throw new TypeError("Failed to construct 'Handler': Argument 'path' is not an array.");
		this.#storageController = storageController;
		this.#path = path;
	}
	#path;
	#storageController;
	get(target, property) {
		const value = target[property];
		if (value instanceof Object) {
			const path = Array.from(this.#path);
			path.push(property);
			return new Proxy(value, new Handler(this.#storageController, path))
		}
		return value;
	}
	set(target, property, value) {
		switch (typeof value) {
			case "function":
			case "bigint":
			case "symbol":
			case "undefined":
				console.warn("LocalStorage cannot store value:", value);
			default:
		}
		target[property] = value;
		this.#save(target);
		return true;
	}
	deleteProperty(target, property) {
		const result = delete target[property];
		if (result) this.#save(target);
		return result;
	}
	#save(object) { if (this.#storageController.isMatch(this.#path, object)) { this.#storageController.save() } else console.warn(object, "is not in the tree of", this.#storageController, ", cannot be save.") }
}

export default LocalStorageObject;
export { LocalStorageObject }