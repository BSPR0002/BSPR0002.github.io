import { IndexedDatabase, IndexedDatabaseObjectStore } from "../IndexedDatabase.mjs";
function upgrade(dbUpgrader) { dbUpgrader.createObjectStore(storeName) }
const types = ["array", "object", "number", "string", "bigint", "boolean", "any"];
function typeCheck(type, value) {
	const id = types.indexOf(type);
	if (id == -1) throw new Error(`Invalid type '${type}'.`);
	if (value === undefined) return;
	switch (id) {
		case 0:
			if (Array.isArray(value)) return;
			break;
		case 1:
			if (value instanceof Object) return;
			break;
		case 2:
		case 3:
		case 4:
		case 5:
			if (typeof value == type) return;
			break;
		case 6: return
	}
	throw new Error("Value doesn't match given type.");
}
class SettingStorage {
	#store;
	#tree;
	constructor(store, tree) {
		if (!(store instanceof IndexedDatabaseObjectStore)) throw new TypeError;
		this.#store = store;
		this.#tree = tree;
	}
	async get(path) {
		if (!arguments.length) throw new TypeError("Failed to execute 'get' on 'SettingStorage': 1 argument required, but only 0 present.");
		if (typeof path != "string") throw new TypeError("Failed to execute 'get' on 'SettingStorage': Argument 'path' is not a string.");
		const data = this.#tree[path];
		if (!(data instanceof Object)) throw new Error(`Failed to execute 'get' on 'SettingStorage': Invalid data for path '${path}' in tree.`);
		const result = (await this.#store.get(path)) ?? data.default;
		typeCheck(data.type, result);
		return result;
	}
	async set(path, value) {
		if (arguments.length < 2) throw new TypeError(`Failed to execute 'set' on 'SettingStorage': 2 arguments required, but only ${arguments.length} present.`);
		if (typeof path != "string") throw new TypeError("Failed to execute 'set' on 'SettingStorage': Argument 'path' is not a string.");
		const data = this.#tree[path];
		if (!(data instanceof Object)) throw new Error(`Failed to execute 'set' on 'SettingStorage': Invalid data for path '${path}' in tree.`);
		typeCheck(data.type, value);
		return await this.#store.update(value, path);
	}
	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: this.name,
			configurable: true
		});
	}
}
async function getStorage(source, tree) {
	if (arguments.length < 2) throw new TypeError(`Failed to execute 'getStorage': 2 arguments required, but only ${arguments.length} present.`);
	if (!(typeof source == "string" || source instanceof IndexedDatabaseObjectStore)) throw new TypeError("Failed to execute 'getStorage': Argument 'source' is not a string or not type of IndexedDatabaseObjectStore.");
	if (!(tree instanceof Object)) throw new TypeError("Failed to execute 'getStorage': Argument 'tree' is not an object.");
	return new SettingStorage(typeof source == "string" ? (await IndexedDatabase.open(source, 1, upgrade)).getObjectStore(storeName) : source, tree);
}
const storeName = "BSIF.Setting";
export default getStorage;
export { getStorage, upgrade, storeName }
