import IndexedDatabase from "./IndexedDatabase.mjs";
declare class IndexedDatabaseUpgrader extends IndexedDatabase {
	constructor(db: IDBDatabase, oldVersion: number, newVersion: number);
	readonly oldVersion: number;
	readonly newVersion: number;
	createObjectStore(name: string, option?: IDBObjectStoreParameters): ObjectStoreUpgrader;
	deleteObjectStore(name: string): void;
}
declare class DynamicIndexedDatabase {
	constructor(db: IndexedDatabase);
	static open(name: string): Promise<DynamicIndexedDatabase>;
	initialStore(name: string, configure: (upgrader: IndexedDatabaseUpgrader) => void): Promise<IndexedDatabase>;
}
export default DynamicIndexedDatabase;
export { DynamicIndexedDatabase };