console.log("Worker started.\nVersion: Alpha 0.1");
import { getJSON } from "/javascript/module/AJAX.mjs";
import PromiseAdapter from "/javascript/module/PromiseAdapter.mjs";
import DynamicIndexedDatabase from "/javascript/module/DynamicIndexedDatabase.mjs";
const db = DynamicIndexedDatabase.open("web site").then(db=>db.initialStore("service worker", function(db){
	db.createObjectStore("service worker")
}));
async function cache() {
	let { promise: data, resolve, reject } = new PromiseAdapter;
	getJSON("resource.json", resolve, false, reject);
	data = await data;

}

self.addEventListener("install", cache);