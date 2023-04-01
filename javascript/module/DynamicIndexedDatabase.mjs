import IndexedDatabase from "./IndexedDatabase.mjs";
class DynamicIndexedDatabase {
	static #checkInstance(instance) { if (!(instance instanceof this)) throw new TypeError("Illegal invocation") }
	#db;
	constructor(db) {
		if (!(db instanceof IndexedDatabase)) throw new TypeError("Failed to construct 'DynamicIndexedDatabase': Argument 'db' is not type of IndexedDatabase.");
		this.#db = db;
	}
	static async open(name) {
		if (arguments.length < 1) throw new TypeError("Failed to execute 'open': 1 argument required, but only 0 present.");
		if (typeof name != "string") throw new TypeError("Failed to execute 'open': Argument 'name' is not a string.");
		const pool=this.#pool;
		if (pool.has(name)) return pool.get(name);
		const temp=new DynamicIndexedDatabase(await IndexedDatabase.open(name));
		pool.set(name,temp);
		return temp;
	}
	#queue = [];
	initialStore(name, configure) {
		DynamicIndexedDatabase.#checkInstance(this);
		if (typeof name!="string") throw new TypeError("Failed to execute 'initialStore' on 'DynamicIndexedDatabase': Argument 'name' is not a string.");
		if (typeof configure!="function") throw new TypeError("Failed to execute 'initialStore' on 'DynamicIndexedDatabase': Argument 'configure' is not a function.");
		const queue = this.#queue, temp = this.#process(queue[queue.length - 1], name, configure);
		queue.push(temp);
		return temp;
	}
	async #process(after, name, configure) {
		await after;
		const database = this.#db;
		if (!database.objectStoreNames.contains(name)) await database.restart(Date.now(), configure);
		this.#queue.shift();
		return database;
	}
	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: this.name,
			writable: false,
			configurable: true,
			enumerable: false
		});
	}
	static #pool=new Map;
}
export default DynamicIndexedDatabase;
export {DynamicIndexedDatabase};