import IndexedDatabase from "/javascript/module/IndexedDatabase.mjs";
const database = await IndexedDatabase.open("org.BSIF.JSONIndexedEditor", 1, upgrader => {
	upgrader.createObjectStore("UI");
	upgrader.createObjectStore("indexors");
});
export default database;