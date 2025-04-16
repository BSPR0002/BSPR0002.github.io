import DynamicIndexedDatabase from "./module/DynamicIndexedDatabase.mjs";
const database = await DynamicIndexedDatabase.open("applets data");
function initialStore(name, configure) { return database.initialStore(name, configure) }
export default initialStore;
export { initialStore }