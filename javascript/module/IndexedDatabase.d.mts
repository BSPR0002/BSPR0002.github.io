type IndexedDatabaseTransactionOptions = {
	oncomplete?: () => void,
	onabort?: () => void,
	onerror?: (error: Error) => void,
	durability?: IDBTransactionDurability;
};
declare class IndexedDatabase {
	readonly name: string;
	readonly objectStoreNames: DOMStringList;
	readonly version: number;
	constructor(db: IDBDatabase);
	static open(name: string, version?: number, onUpgradeNeeded?: (upgrader: IndexedDatabaseUpgrader) => void, onBlocked?: () => void): Promise<IndexedDatabase>;
	startTransaction(readonly = true, options?: IndexedDatabaseTransactionOptions): void;
	abortTransaction(): void;
	commitTransaction(): void;
	readonly transactionState: IDBTransactionMode | null;
	add(objectStoreName: string, content: any, key?: IDBValidKey): Promise<IDBValidKey>;
	delete(objectStoreName: string, query: IDBValidKey | IDBKeyRange): Promise<void>;
	clear(objectStoreName: string): Promise<void>;
	update(objectStoreName: string, content: any, key?: IDBValidKey): Promise<IDBValidKey>;
	get(objectStoreName: string, key: IDBValidKey | IDBKeyRange): Promise<any>;
	getAll(objectStoreName: string, query?: IDBValidKey | IDBKeyRange, count?: number): Promise<any[]>;
	getAllKeys(objectStoreName: string, query?: IDBValidKey | IDBKeyRange, count?: number): Promise<IDBValidKey[]>;
	getByIndex(objectStoreName: string, indexName: string, key: IDBValidKey | IDBKeyRange): Promise<any>;
	getAllByIndex(objectStoreName: string, indexName: string, query: IDBValidKey | IDBKeyRange, count?: number): Promise<any[]>;
	getObjectStore(objectStoreName: string): IndexedDatabaseObjectStore;
	getObjectStoreDetail(objectStoreName: string): ObjectStoreDetail;
	close(): void;
	restart(version?: number, onUpgradeNeeded?: (upgrader: IndexedDatabaseUpgrader) => void, onBlocked?: () => void): Promise<void>;
}
declare class IndexedDatabaseUpgrader extends IndexedDatabase {
	constructor(db: IDBDatabase, oldVersion: number, newVersion: number);
	readonly oldVersion: number;
	readonly newVersion: number;
	createObjectStore(name: string, option?: IDBObjectStoreParameters): ObjectStoreUpgrader;
	deleteObjectStore(name: string): void;
}
declare class ObjectStoreDetail {
	constructor(objectStore: IDBObjectStore);
	readonly name: string;
	readonly keyPath: string | string[];
	readonly indexNames: DOMStringList;
	getIndexDetail(indexName: string): IndexDetail;
}
declare class ObjectStoreUpgrader extends ObjectStoreDetail {
	constructor(objectStore: IDBObjectStore);
	createIndex(name: string, keyPath: string | Iterable<string>, options?: IDBIndexParameters): IndexDetail;
	deleteIndex(name: string): void;
}
declare class IndexDetail {
	constructor(objectStore: IDBIndex);
	readonly name: string;
	readonly unique: boolean;
	readonly keyPath: string | string[];
	readonly multiEntry: boolean;
}

declare class IndexedDatabaseObjectStore {
	readonly indexedDatabase: IndexedDatabase;
	readonly name: string;
	constructor(db: IndexedDatabase, name: string);
	add(content: any, key?: IDBValidKey): Promise<IDBValidKey>;
	delete(query: IDBValidKey | IDBKeyRange): Promise<void>;
	clear(): Promise<void>;
	update(content: any, key?: IDBValidKey): Promise<IDBValidKey>;
	get(key: IDBValidKey | IDBKeyRange): Promise<any>;
	getAll(query?: IDBValidKey | IDBKeyRange, count?: number): Promise<any[]>;
	getAllKeys(query?: IDBValidKey | IDBKeyRange, count?: number): Promise<IDBValidKey[]>;
	getByIndex(indexName: string, key: IDBValidKey | IDBKeyRange): Promise<any>;
	getAllByIndex(indexName: string, query: IDBValidKey | IDBKeyRange, count?: number): Promise<any[]>;
	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: this.name,
			writable: false,
			configurable: true,
			enumerable: false
		});
	}
}
export default IndexedDatabase;
export { IndexedDatabase, IndexedDatabaseObjectStore };