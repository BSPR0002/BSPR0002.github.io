const key = Symbol("privateConstructor"),
	encapsulateRequest = Function.prototype.bind.bind(function encapsulateRequest(request, resolve, reject) {
		request.addEventListener("success", function (event) { resolve(event.target.result) });
		request.addEventListener("error", function (event) { reject(event.target.error) });
	}, null);
class IndexedDatabase {
	static #checkInstance(instance) { if (!(instance instanceof this)) throw new TypeError("Illegal invocation") }
	#db;
	get name() { return this.#db.name }
	get objectStoreNames() { return this.#db.objectStoreNames }
	get version() { return this.#db.version }
	constructor(privateInvoke, db) {
		if (privateInvoke != key) throw new TypeError("Illegal invacation");
		this.#db = db;
	}
	static #pool = new WeakMap;
	static open(name, version = undefined, onUpgradeNeeded = undefined, onBlocked = undefined) {
		if (arguments.length < 1) throw new TypeError("Failed to execute 'open': 1 argument required, but only 0 present.");
		if (typeof name != "string") throw new TypeError("Failed to execute 'open': Argument 'name' is not a string.");
		if (arguments.length > 1) {
			if (!(Number.isInteger(version) && version > 0)) throw new TypeError("Failed to execute 'open': Argument 'version' must be integer and greater than 0.");
			if (arguments.length > 2) {
				if (typeof onUpgradeNeeded != "function") throw new TypeError("Failed to execute 'open': Argument 'onUpgradeNeeded' is not a function.");
				if (arguments.length > 3 && typeof onBlocked != "function") throw new TypeError("Failed to execute 'open': Argument 'onBlocked' is not a function.");
			}
		}
		const request = indexedDB.open(name, version);
		if (onBlocked) request.addEventListener("blocked", onBlocked);
		if (onUpgradeNeeded) request.addEventListener("upgradeneeded", function (event) { onUpgradeNeeded(new IndexedDatabaseUpgrader(key, event.target.result, event.oldVersion, event.newVersion)) });
		return new Promise((resolve, reject) => {
			request.addEventListener("success", function (event) {
				const db = event.target.result, pool = IndexedDatabase.#pool, cache = pool.get(db);
				if (cache) { resolve(cache) } else {
					const instance = new IndexedDatabase(key, db);
					pool.set(db, instance);
					resolve(instance);
				}
			});
			request.addEventListener("error", function (event) { reject(event.target.error) });
		});
	}
	#transaction = null;
	#startTransaction(objectStoreNames, writeRequire, durability) {
		if (this.#transaction) throw new Error("Failed to execute 'startTransaction' on 'IndexedDatabase': The database is running a transaction already.")
		return this.#db.transaction(objectStoreNames, writeRequire ? "readwrite" : "readonly", { durability });
	}
	#getTransaction(objectStoreName, writeRequire) {
		if (!this.#db.objectStoreNames.contains(objectStoreName)) throw new Error(`Failed to execute 'getTransaction' on 'IndexedDatabase': The database does not exist object store named '${objectStoreName}'.`);
		const transaction = this.#transaction;
		if (transaction) {
			if (writeRequire && transaction.mode == "readonly") throw new Error("Failed to execute 'getTransaction' on 'IndexedDatabase': The database is running a readonly transaction but require write.");
			return { transaction, commit: false };
		}
		return { transaction: this.#startTransaction(objectStoreName, writeRequire), commit: true }
	}
	startTransaction(writeRequire = false, options = undefined) {
		IndexedDatabase.#checkInstance(this);
		var oncomplete, onabort, onerror, durability;
		if (arguments.length) {
			if (typeof writeRequire != "boolean") throw new TypeError("Failed to execute 'startTransaction' on 'IndexedDatabase': Argument 'writeRequire' is not a boolean.");
			if (arguments.length > 1) {
				if (options instanceof Object) {
					if ("durability" in options && typeof (durability = options.durability) != "string") throw new TypeError("Failed to execute 'startTransaction' on 'IndexedDatabase': options.durability is not a string.");
					let temp;
					if (typeof (temp = options.oncomplete) == "function") oncomplete = temp;
					if (typeof (temp = options.onabort) == "function") onabort = temp;
					if (typeof (temp = options.onerror) == "function") onerror = temp;
				} else throw new TypeError("Failed to execute 'startTransaction' on 'IndexedDatabase': Argument 'options' is not an object.");
			}
		}
		const transaction = this.#transaction = this.#startTransaction(this.#db.objectStoreNames, writeRequire, durability);
		transaction.addEventListener("complete", () => {
			this.#transaction = null;
			if (oncomplete) oncomplete();
		});
		transaction.addEventListener("abort", () => {
			this.#transaction = null;
			if (onabort) onabort();
		});
		transaction.addEventListener("error", event => {
			this.#transaction = null;
			if (onerror) { onerror(event) } else console.error(event.target.error);
		});
	}
	abortTransaction() {
		IndexedDatabase.#checkInstance(this);
		if (!this.#transaction) throw new Error("Failed to execute 'abortTransaction' on 'IndexedDatabase': The database is not running a transaction.");
		this.#transaction.abort();
	}
	commitTransaction() {
		IndexedDatabase.#checkInstance(this);
		if (!this.#transaction) throw new Error("Failed to execute 'commitTransaction' on 'IndexedDatabase': The database is not running a transaction.");
		this.#transaction.commit();
	}
	get transactionState() { return this.#transaction?.mode ?? null }
	async add(objectStoreName, content, key = undefined) {
		IndexedDatabase.#checkInstance(this);
		if (arguments.length < 2) throw new TypeError(`Failed to execute 'add' on 'IndexedDatabase': 2 argument required, but only ${arguments.length} present.`);
		if (typeof objectStoreName != "string") throw new TypeError("Failed to execute 'add' on 'IndexedDatabase': Argument 'objectStoreName' is not a string.");
		await this.#restarting;
		const { transaction, commit } = this.#getTransaction(objectStoreName, true),
			promise = new Promise(encapsulateRequest(transaction.objectStore(objectStoreName).add(content, key)));
		if (commit) transaction.commit();
		return promise;
	}
	async delete(objectStoreName, query) {
		IndexedDatabase.#checkInstance(this);
		if (arguments.length < 2) throw new TypeError(`Failed to execute 'delete' on 'IndexedDatabase': 2 arguments required, but only ${arguments.length} present.`);
		if (typeof objectStoreName != "string") throw new TypeError("Failed to execute 'delete' on 'IndexedDatabase': Argument 'objectStoreName' is not a string.");
		await this.#restarting;
		const { transaction, commit } = this.#getTransaction(objectStoreName, true),
			promise = new Promise(encapsulateRequest(transaction.objectStore(objectStoreName).delete(query)));
		if (commit) transaction.commit();
		return promise;
	}
	async clear(objectStoreName) {
		IndexedDatabase.#checkInstance(this);
		if (arguments.length < 1) throw new TypeError("Failed to execute 'clear' on 'IndexedDatabase': 1 argument required, but only 0 present.");
		if (typeof objectStoreName != "string") throw new TypeError("Failed to execute 'clear' on 'IndexedDatabase': Argument 'objectStoreName' is not a string.");
		await this.#restarting;
		const { transaction, commit } = this.#getTransaction(objectStoreName, true),
			promise = new Promise(encapsulateRequest(transaction.objectStore(objectStoreName).clear()));
		if (commit) transaction.commit();
		return promise;
	}
	async update(objectStoreName, content, key = undefined) {
		IndexedDatabase.#checkInstance(this);
		if (arguments.length < 2) throw new TypeError(`Failed to execute 'update' on 'IndexedDatabase': 2 arguments required, but only ${arguments.length} present.`);
		if (typeof objectStoreName != "string") throw new TypeError("Failed to execute 'update' on 'IndexedDatabase': Argument 'objectStoreName' is not a string.");
		await this.#restarting;
		const { transaction, commit } = this.#getTransaction(objectStoreName, true),
			promise = new Promise(encapsulateRequest(transaction.objectStore(objectStoreName).put(content, key)));
		if (commit) transaction.commit();
		return promise;
	}
	async get(objectStoreName, key) {
		IndexedDatabase.#checkInstance(this);
		if (arguments.length < 2) throw new TypeError(`Failed to execute 'get' on 'IndexedDatabase': 2 arguments required, but only ${arguments.length} present.`);
		if (typeof objectStoreName != "string") throw new TypeError("Failed to execute 'get' on 'IndexedDatabase': Argument 'objectStoreName' is not a string.");
		await this.#restarting;
		const { transaction, commit } = this.#getTransaction(objectStoreName),
			promise = new Promise(encapsulateRequest(transaction.objectStore(objectStoreName).get(key)));
		if (commit) transaction.commit();
		return promise;
	}
	async getAll(objectStoreName, query = undefined, count = undefined) {
		IndexedDatabase.#checkInstance(this);
		if (arguments.length < 1) throw new TypeError("Failed to execute 'getAll' on 'IndexedDatabase': 1 argument required, but only 0 present.");
		if (typeof objectStoreName != "string") throw new TypeError("Failed to execute 'getAll' on 'IndexedDatabase': Argument 'objectStoreName' is not a string.");
		if (count !== undefined && !(Number.isInteger(count) && count > 0)) throw new TypeError("Failed to execute 'getAll' on 'IndexedDatabase': Argument 'count' must be integer and greater than 0.");
		await this.#restarting;
		const { transaction, commit } = this.#getTransaction(objectStoreName),
			promise = new Promise(encapsulateRequest(transaction.objectStore(objectStoreName).getAll(query, count)));
		if (commit) transaction.commit();
		return promise;
	}
	async getAllKeys(objectStoreName, query = undefined, count = undefined) {
		IndexedDatabase.#checkInstance(this);
		if (arguments.length < 1) throw new TypeError("Failed to execute 'getAllKeys' on 'IndexedDatabase': 1 argument required, but only 0 present.");
		if (typeof objectStoreName != "string") throw new TypeError("Failed to execute 'getAllKeys' on 'IndexedDatabase': Argument 'objectStoreName' is not a string.");
		if (count !== undefined && !(Number.isInteger(count) && count > 0)) throw new TypeError("Failed to execute 'getAllKeys' on 'IndexedDatabase': Argument 'count' must be integer and greater than 0.");
		await this.#restarting;
		const { transaction, commit } = this.#getTransaction(objectStoreName),
			promise = new Promise(encapsulateRequest(transaction.objectStore(objectStoreName).getAllKeys(query, count)));
		if (commit) transaction.commit();
		return promise;
	}
	async getByIndex(objectStoreName, indexName, key) {
		IndexedDatabase.#checkInstance(this);
		if (arguments.length < 3) throw new TypeError(`Failed to execute 'getByIndex' on 'IndexedDatabase': 3 arguments required, but only ${arguments.length} present.`);
		if (typeof objectStoreName != "string") throw new TypeError("Failed to execute 'getByIndex' on 'IndexedDatabase': Argument 'objectStoreName' is not a string.");
		if (typeof indexName != "string") throw new TypeError("Failed to execute 'getByIndex' on 'IndexedDatabase': Argument 'indexName' is not a string.");
		await this.#restarting;
		const { transaction, commit } = this.#getTransaction(objectStoreName),
			objectStore = transaction.objectStore(objectStoreName);
		if (!objectStore.indexNames.contains(indexName)) throw new Error(`Failed to execute 'getByIndex' on 'IndexedDatabase': The database does not exist index named '${indexName}' on object store '${objectStoreName}'.`);
		const promise = new Promise(encapsulateRequest(objectStore.index(indexName).get(key)));
		if (commit) transaction.commit();
		return promise;
	}
	async getAllByIndex(objectStoreName, indexName, query, count = undefined) {
		IndexedDatabase.#checkInstance(this);
		if (arguments.length < 3) throw new TypeError(`Failed to execute 'getAllByIndex' on 'IndexedDatabase': 3 arguments required, but only ${arguments.length} present.`);
		if (typeof objectStoreName != "string") throw new TypeError("Failed to execute 'getAllByIndex' on 'IndexedDatabase': Argument 'objectStoreName' is not a string.");
		if (typeof indexName != "string") throw new TypeError("Failed to execute 'getAllByIndex' on 'IndexedDatabase': Argument 'indexName' is not a string.");
		if (count !== undefined && !(Number.isInteger(count) && count > 0)) throw new TypeError("Failed to execute 'getAllByIndex' on 'IndexedDatabase': Argument 'count' must be integer and greater than 0.");
		await this.#restarting;
		const { transaction, commit } = this.#getTransaction(objectStoreName),
			objectStore = transaction.objectStore(objectStoreName);
		if (!objectStore.indexNames.contains(indexName)) throw new Error(`Failed to execute 'getAllByIndex' on 'IndexedDatabase': The database does not exist index named '${indexName}' on object store '${objectStoreName}'.`);
		const promise = new Promise(encapsulateRequest(objectStore.index(indexName).getAll(query, count)));
		if (commit) transaction.commit();
		return promise;
	}
	getObjectStore(objectStoreName) {
		IndexedDatabase.#checkInstance(this);
		if (arguments.length < 1) throw new TypeError("Failed to execute 'getObjectStore' on 'IndexedDatabase': 1 argument required, but only 0 present.");
		if (typeof objectStoreName != "string") throw new TypeError("Failed to execute 'getObjectStore' on 'IndexedDatabase': Argument 'objectStoreName' is not a string.");
		return new IndexedDatabaseObjectStore(key, this, objectStoreName);
	}
	getObjectStoreDetail(objectStoreName) {
		IndexedDatabase.#checkInstance(this);
		if (arguments.length < 1) throw new TypeError("Failed to execute 'getObjectStoreDetail' on 'IndexedDatabase': 1 argument required, but only 0 present.");
		if (typeof objectStoreName != "string") throw new TypeError("Failed to execute 'getObjectStoreDetail' on 'IndexedDatabase': Argument 'objectStoreName' is not a string.");
		const { transaction, commit } = this.#getTransaction(objectStoreName), temp = transaction.objectStore(objectStoreName);
		if (commit) transaction.commit();
		return new ObjectStoreDetail(temp);
	}
	close() {
		IndexedDatabase.#checkInstance(this);
		this.#db.close();
	}
	#restarting;
	restart(version = undefined, onUpgradeNeeded = undefined, onBlocked = undefined) {
		if (arguments.length > 0) {
			if (!(Number.isInteger(version) && version > 0)) throw new TypeError("Failed to execute 'restart' on 'IndexedDatabase': Argument 'version' must be integer and greater than 0.");
			if (arguments.length > 1) {
				if (typeof onUpgradeNeeded != "function") throw new TypeError("Failed to execute 'restart' on 'IndexedDatabase': Argument 'onUpgradeNeeded' is not a function.");
				if (arguments.length > 2 && typeof onBlocked != "function") throw new TypeError("Failed to execute 'restart' on 'IndexedDatabase': Argument 'onBlocked' is not a function.");
			}
		}
		if (this.#restarting) throw new Error("Failed to execute 'restart' on 'IndexedDatabase': Database has been restarting now.");
		this.#db.close();
		const request = indexedDB.open(this.#db.name, version);
		if (onBlocked) request.addEventListener("blocked", onBlocked);
		if (onUpgradeNeeded) request.addEventListener("upgradeneeded", function (event) { onUpgradeNeeded(new IndexedDatabaseUpgrader(key, event.target.result, event.oldVersion, event.newVersion)) });
		return this.#restarting = new Promise((resolve, reject) => {
			request.addEventListener("success", event => {
				IndexedDatabase.#pool.set(this.#db = event.target.result, this);
				this.#restarting = undefined;
				resolve();
			});
			request.addEventListener("error", event => {
				this.#restarting = undefined;
				reject(event.target.error);
			});
		});
	}
	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: this.name,
			configurable: true
		});
	}
}

class IndexedDatabaseUpgrader {
	static #checkInstance(instance) { if (!(instance instanceof this)) throw new TypeError("Illegal invocation") }
	#db;
	#oldVersion;
	get oldVersion() { return this.#oldVersion }
	#newVersion;
	get newVersion() { return this.#newVersion }
	constructor(privateInvoke, db, oldVersion, newVersion) {
		if (privateInvoke != key) throw new TypeError("Illegal invacation");
		this.#db = db;
		this.#oldVersion = oldVersion;
		this.#newVersion = newVersion;
	}
	createObjectStore(name, option = null) {
		IndexedDatabaseUpgrader.#checkInstance(this);
		if (arguments.length < 1) throw new TypeError("Failed to execute 'createObjectStore' on 'IndexedDatabaseUpgrader': 1 argument required, but only 0 present.");
		return new ObjectStoreUpgrader(key, this.#db.createObjectStore(name, option));
	}
	deleteObjectStore(name) {
		IndexedDatabaseUpgrader.#checkInstance(this);
		if (arguments.length < 1) throw new TypeError("Failed to execute 'deleteObjectStore' on 'IndexedDatabaseUpgrader': 1 argument required, but only 0 present.");
		this.#db.deleteObjectStore(name);
	}
	async add(objectStoreName, content, key = undefined) {
		IndexedDatabaseUpgrader.#checkInstance(this);
		if (arguments.length < 2) throw new TypeError(`Failed to execute 'add' on 'IndexedDatabaseUpgrader': 2 argument required, but only ${arguments.length} present.`);
		if (typeof objectStoreName != "string") throw new TypeError("Failed to execute 'add' on 'IndexedDatabaseUpgrader': Argument 'objectStoreName' is not a string.");
		return new Promise(encapsulateRequest(transaction.objectStore(objectStoreName).add(content, key)));
	}
	async delete(objectStoreName, query) {
		IndexedDatabaseUpgrader.#checkInstance(this);
		if (arguments.length < 2) throw new TypeError(`Failed to execute 'delete' on 'IndexedDatabaseUpgrader': 2 arguments required, but only ${arguments.length} present.`);
		if (typeof objectStoreName != "string") throw new TypeError("Failed to execute 'delete' on 'IndexedDatabaseUpgrader': Argument 'objectStoreName' is not a string.");
		return new Promise(encapsulateRequest(transaction.objectStore(objectStoreName).delete(query)));
	}
	async clear(objectStoreName) {
		IndexedDatabaseUpgrader.#checkInstance(this);
		if (arguments.length < 1) throw new TypeError("Failed to execute 'clear' on 'IndexedDatabaseUpgrader': 1 argument required, but only 0 present.");
		if (typeof objectStoreName != "string") throw new TypeError("Failed to execute 'clear' on 'IndexedDatabaseUpgrader': Argument 'objectStoreName' is not a string.");
		return new Promise(encapsulateRequest(transaction.objectStore(objectStoreName).clear()));
	}
	async update(objectStoreName, content, key = undefined) {
		IndexedDatabaseUpgrader.#checkInstance(this);
		if (arguments.length < 2) throw new TypeError(`Failed to execute 'update' on 'IndexedDatabaseUpgrader': 2 arguments required, but only ${arguments.length} present.`);
		if (typeof objectStoreName != "string") throw new TypeError("Failed to execute 'update' on 'IndexedDatabaseUpgrader': Argument 'objectStoreName' is not a string.");
		return new Promise(encapsulateRequest(transaction.objectStore(objectStoreName).put(content, key)));
	}
	async get(objectStoreName, key) {
		IndexedDatabaseUpgrader.#checkInstance(this);
		if (arguments.length < 2) throw new TypeError(`Failed to execute 'get' on 'IndexedDatabaseUpgrader': 2 arguments required, but only ${arguments.length} present.`);
		if (typeof objectStoreName != "string") throw new TypeError("Failed to execute 'get' on 'IndexedDatabaseUpgrader': Argument 'objectStoreName' is not a string.");
		return new Promise(encapsulateRequest(transaction.objectStore(objectStoreName).get(key)));
	}
	async getAll(objectStoreName, query = undefined, count = undefined) {
		IndexedDatabaseUpgrader.#checkInstance(this);
		if (arguments.length < 1) throw new TypeError("Failed to execute 'getAll' on 'IndexedDatabaseUpgrader': 1 argument required, but only 0 present.");
		if (typeof objectStoreName != "string") throw new TypeError("Failed to execute 'getAll' on 'IndexedDatabaseUpgrader': Argument 'objectStoreName' is not a string.");
		if (count !== undefined && !(Number.isInteger(count) && count > 0)) throw new TypeError("Failed to execute 'getAll' on 'IndexedDatabaseUpgrader': Argument 'count' must be integer and greater than 0.");
		return new Promise(encapsulateRequest(transaction.objectStore(objectStoreName).getAll(query, count)));
	}
	async getAllKeys(objectStoreName, query = undefined, count = undefined) {
		IndexedDatabaseUpgrader.#checkInstance(this);
		if (arguments.length < 1) throw new TypeError("Failed to execute 'getAllKeys' on 'IndexedDatabaseUpgrader': 1 argument required, but only 0 present.");
		if (typeof objectStoreName != "string") throw new TypeError("Failed to execute 'getAllKeys' on 'IndexedDatabaseUpgrader': Argument 'objectStoreName' is not a string.");
		if (count !== undefined && !(Number.isInteger(count) && count > 0)) throw new TypeError("Failed to execute 'getAllKeys' on 'IndexedDatabaseUpgrader': Argument 'count' must be integer and greater than 0.");
		return new Promise(encapsulateRequest(transaction.objectStore(objectStoreName).getAllKeys(query, count)));
	}
	async getByIndex(objectStoreName, indexName, key) {
		IndexedDatabaseUpgrader.#checkInstance(this);
		if (arguments.length < 3) throw new TypeError(`Failed to execute 'getByIndex' on 'IndexedDatabaseUpgrader': 3 arguments required, but only ${arguments.length} present.`);
		if (typeof objectStoreName != "string") throw new TypeError("Failed to execute 'getByIndex' on 'IndexedDatabaseUpgrader': Argument 'objectStoreName' is not a string.");
		if (typeof indexName != "string") throw new TypeError("Failed to execute 'getByIndex' on 'IndexedDatabaseUpgrader': Argument 'indexName' is not a string.");
		const objectStore = transaction.objectStore(objectStoreName);
		if (!objectStore.indexNames.contains(indexName)) throw new Error(`Failed to execute 'getByIndex' on 'IndexedDatabaseUpgrader': The database does not exist index named '${indexName}' on object store '${objectStoreName}'.`);
		return new Promise(encapsulateRequest(objectStore.index(indexName).get(key)));
	}
	async getAllByIndex(objectStoreName, indexName, query, count = undefined) {
		IndexedDatabaseUpgrader.#checkInstance(this);
		if (arguments.length < 3) throw new TypeError(`Failed to execute 'getAllByIndex' on 'IndexedDatabaseUpgrader': 3 arguments required, but only ${arguments.length} present.`);
		if (typeof objectStoreName != "string") throw new TypeError("Failed to execute 'getAllByIndex' on 'IndexedDatabaseUpgrader': Argument 'objectStoreName' is not a string.");
		if (typeof indexName != "string") throw new TypeError("Failed to execute 'getAllByIndex' on 'IndexedDatabaseUpgrader': Argument 'indexName' is not a string.");
		if (count !== undefined && !(Number.isInteger(count) && count > 0)) throw new TypeError("Failed to execute 'getAllByIndex' on 'IndexedDatabaseUpgrader': Argument 'count' must be integer and greater than 0.");
		const objectStore = transaction.objectStore(objectStoreName);
		if (!objectStore.indexNames.contains(indexName)) throw new Error(`Failed to execute 'getAllByIndex' on 'IndexedDatabaseUpgrader': The database does not exist index named '${indexName}' on object store '${objectStoreName}'.`);
		return new Promise(encapsulateRequest(objectStore.index(indexName).getAll(query, count)));
	}
	getObjectStore(objectStoreName) {
		IndexedDatabaseUpgrader.#checkInstance(this);
		if (arguments.length < 1) throw new TypeError("Failed to execute 'getObjectStore' on 'IndexedDatabaseUpgrader': 1 argument required, but only 0 present.");
		if (typeof objectStoreName != "string") throw new TypeError("Failed to execute 'getObjectStore' on 'IndexedDatabaseUpgrader': Argument 'objectStoreName' is not a string.");
		return new IndexedDatabaseObjectStore(key, this, objectStoreName);
	}
	getObjectStoreDetail(objectStoreName) {
		IndexedDatabaseUpgrader.#checkInstance(this);
		if (arguments.length < 1) throw new TypeError("Failed to execute 'getObjectStoreDetail' on 'IndexedDatabaseUpgrader': 1 argument required, but only 0 present.");
		if (typeof objectStoreName != "string") throw new TypeError("Failed to execute 'getObjectStoreDetail' on 'IndexedDatabaseUpgrader': Argument 'objectStoreName' is not a string.");
		return new ObjectStoreDetail(temp);
	}
	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: this.name,
			configurable: true
		});
	}
}

class ObjectStoreDetail {
	static #checkInstance(instance) { if (!(instance instanceof this)) throw new TypeError("Illegal invocation") }
	#objectStore;
	constructor(objectStore) {
		if (arguments.length < 1) throw new TypeError("Failed to construct 'ObjectStoreDetail': 1 argument required, but only 0 present.");
		if (!(objectStore instanceof IDBObjectStore)) throw new TypeError("Failed to construct 'ObjectStoreDetail': Argument 'objectStore' is not type of IDBObjectStore.");
		this.#objectStore = objectStore;
	}
	get name() { return this.#objectStore.name }
	get keyPath() { return this.#objectStore.keyPath }
	get indexNames() { return this.#objectStore.indexNames }
	getIndexDetail(indexName) {
		ObjectStoreDetail.#checkInstance(this);
		if (arguments.length < 1) throw new TypeError("Failed to execute 'getIndexDetail' on 'ObjectStoreDetail': 1 argument required, but only 0 present.");
		if (typeof indexName != "string") throw new TypeError("Failed to execute 'getIndexDetail' on 'ObjectStoreDetail': Argument 'indexName' is not a string.");
		if (!this.#objectStore.indexNames.contains(indexName)) throw new Error(`Failed to execute 'getIndexDetail' on 'ObjectStoreDetail': The object store does not exist index named '${indexName}'.`);
		return new IndexDetail(this.#objectStore.index(indexName));
	}
	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: this.name,
			configurable: true
		});
	}
}

class ObjectStoreUpgrader extends ObjectStoreDetail {
	static #checkInstance(instance) { if (!(instance instanceof this)) throw new TypeError("Illegal invocation") }
	#objectStore;
	constructor(privateInvoke, objectStore) {
		if (privateInvoke != key) throw new TypeError("Illegal invacation");
		super(objectStore);
		this.#objectStore = objectStore;
	}
	createIndex(name, keyPath, options = undefined) {
		ObjectStoreUpgrader.#checkInstance(this);
		if (arguments.length < 2) throw new TypeError(`Failed to execute 'createIndex' on 'ObjectStoreUpgrader': 2 arguments required, but only ${arguments.length} present.`);
		if (typeof name != "string") throw new TypeError("Failed to execute 'createIndex' on 'ObjectStoreUpgrader': Argument 'name' is not a string.");
		if (arguments.length > 2 && !(options instanceof Object)) throw new TypeError("Failed to execute 'createIndex' on 'ObjectStoreUpgrader': Argument 'options' is not an object.");
		return new IndexDetail(this.#objectStore.createIndex(name, keyPath, options));
	}
	deleteIndex(name) {
		ObjectStoreUpgrader.#checkInstance(this);
		if (arguments.length < 1) throw new TypeError("Failed to execute 'deleteIndex' on 'ObjectStoreUpgrader': 1 argument required, but only 0 present.");
		if (typeof name != "string") throw new TypeError("Failed to execute 'deleteIndex' on 'ObjectStoreUpgrader': Argument 'name' is not a string.");
		this.#objectStore.deleteIndex(name);
	}
	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: this.name,
			configurable: true
		});
	}
}

class IndexDetail {
	#index;
	constructor(index) {
		if (arguments.length < 1) throw new TypeError("Failed to construct 'IndexDetail': 1 argument required, but only 0 present.");
		if (!(index instanceof IDBIndex)) throw new TypeError("Failed to construct 'IndexDetail': Argument 'index' is not type of IDBIndex.");
		this.#index = index;
	}
	get name() { return this.#index.name }
	get unique() { return this.#index.unique }
	get keyPath() { return this.#index.keyPath }
	get multiEntry() { return this.#index.multiEntry }
	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: this.name,
			configurable: true
		});
	}
}

class IndexedDatabaseObjectStore {
	static #checkInstance(instance) { if (!(instance instanceof this)) throw new TypeError("Illegal invocation") }
	#db;
	#name;
	get indexedDatabase() { return this.#db }
	get name() { return this.#name }
	constructor(privateInvoke, db, name) {
		if (privateInvoke != key) throw new TypeError("Illegal invacation");
		this.#db = db;
		this.#name = name;
	}
	add(content, key) {
		IndexedDatabaseObjectStore.#checkInstance(this);
		if (arguments.length < 1) throw new TypeError("Failed to execute 'add' on 'IndexedDatabaseObjectStore': 1 argument required, but only 0 present.");
		return this.#db.add(this.#name, content, key);
	}
	delete(query) {
		IndexedDatabaseObjectStore.#checkInstance(this);
		if (arguments.length < 1) throw new TypeError("Failed to execute 'delete' on 'IndexedDatabaseObjectStore': 1 argument required, but only 0 present.");
		return this.#db.delete(this.#name, query);
	}
	clear() {
		IndexedDatabaseObjectStore.#checkInstance(this);
		return this.#db.clear(this.#name);
	}
	update(content, key) {
		IndexedDatabaseObjectStore.#checkInstance(this);
		if (arguments.length < 1) throw new TypeError("Failed to execute 'update' on 'IndexedDatabaseObjectStore': 1 argument required, but only 0 present.");
		return this.#db.update(this.#name, content, key);
	}
	get(key) {
		IndexedDatabaseObjectStore.#checkInstance(this);
		if (arguments.length < 1) throw new TypeError("Failed to execute 'get' on 'IndexedDatabaseObjectStore': 1 argument required, but only 0 present.");
		return this.#db.get(this.#name, key);
	}
	getAll(query, count) {
		IndexedDatabaseObjectStore.#checkInstance(this);
		return this.#db.getAll(this.#name, query, count);
	}
	getAllKeys(query, count) {
		IndexedDatabaseObjectStore.#checkInstance(this);
		return this.#db.getAllKeys(this.#name, query, count);
	}
	getByIndex(indexName, key) {
		IndexedDatabaseObjectStore.#checkInstance(this);
		if (arguments.length < 2) throw new TypeError(`Failed to execute 'getByIndex' on 'IndexedDatabaseObjectStore': 2 arguments required, but only ${arguments.length} present.`);
		return this.#db.getByIndex(this.#name, indexName, key);
	}
	getAllByIndex(indexName, query, count) {
		IndexedDatabaseObjectStore.#checkInstance(this);
		if (arguments.length < 2) throw new TypeError(`Failed to execute 'getAllByIndex' on 'IndexedDatabaseObjectStore': 2 arguments required, but only ${arguments.length} present.`);
		return this.#db.getAllByIndex(this.#name, indexName, query, count);
	}
	getDetail() {
		IndexedDatabaseObjectStore.#checkInstance(this);
		return this.#db.getObjectStoreDetail(this.#name);
	}
	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: this.name,
			configurable: true
		});
	}
}

export default IndexedDatabase;
export { IndexedDatabase, IndexedDatabaseObjectStore };