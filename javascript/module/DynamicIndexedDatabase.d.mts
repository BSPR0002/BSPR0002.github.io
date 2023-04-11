import IndexedDatabase from "./IndexedDatabase.mjs";
declare class DynamicIndexedDatabase {
	constructor(db: IndexedDatabase);
	static open(name: string): Promise<DynamicIndexedDatabase>;
	initialStore(name: string, configure: Parameters<typeof IndexedDatabase.open>[2]): Promise<ReturnType<typeof IndexedDatabase.prototype.getObjectStore>>;
}
export default DynamicIndexedDatabase;
export { DynamicIndexedDatabase };