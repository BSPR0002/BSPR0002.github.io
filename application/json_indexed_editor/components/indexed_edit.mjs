import { Indexor } from "../indexor.mjs";
import { parse as parseAH, parseAndGetNodes } from "/javascript/module/ArrayHTML.mjs";
import { createTab } from "../ui.mjs";
import database from "../data.mjs";
import MiniWindow from "/javascript/module/MiniWindow.mjs";
const { stringify, parse } = JSON,
	indexorStorage = database.getObjectStore("indexors"),
	{ indexorFrame, index, indexorAdd, managementFrame } = parseAndGetNodes([
		["input", null, { id: "indexed_edit_index_set", type: "number", value: 0, min: 0, step: 1, max: 4294967295, title: "索引编号" }, "index"],
		["div", null, { id: "indexed_edit_indexor_frame" }, "indexorFrame"],
		["button", "+", { id: "indexed_edit_indexor_add", class: "default-color", title: "增加一个索引器" }, "indexorAdd"],
		["div", [

		], { id: "indexed_edit_management" }, "managementFrame"]
	]).nodes;
//索引器部分
var indexors, variables = null;
class IndexorItem {
	#indexor = new Indexor;
	#title = "";
	#titleElement;
	get title() { return this.#title }
	set title(value) {
		if (typeof value != "string") throw new TypeError("invalid type");
		this.#titleElement.value = this.#title = value;
	}
	#userChangedTitle() { this.#title = this.#titleElement.value }
	#pathElement;
	get path() { return this.#indexor.path }
	set path(value) {
		this.#pathElement.value = this.#indexor.path = value;
		this.#updateNode();
	}
	#node = null;
	get route() { return this.#indexor.route }
	#userChangedPath() {
		this.#indexor.path = this.#pathElement.value
		this.#updateNode();
	}
	#updateNode() {
		const path = this.#pathElement,
			content = this.#contentElement;
		content.value = "";
		content.className = "indexor_content";
		var node;
		try {
			node = this.#node = this.#indexor.getNode(variables);
		} catch (e) {
			this.#node = null;
			content.disabled = true;
			content.placeholder = "索引路径错误";
			path.className = "indexor_path invalid";
			return;
		}
		if (!node) {
			path.className = "indexor_path";
			content.disabled = true;
			content.placeholder = "索引路径无效";
			return;
		}
		const type = node.type;
		switch (type) {
			case "string":
			case "number":
			case "boolean":
				path.className = "indexor_path " + type;
				content.disabled = false;
				content.placeholder = "请输入内容";
				content.value = stringify(node.value);
				return;
			case "null":
			case "undefined":
				content.disabled = true;
				content.placeholder = type;
				break;
			default:
				content.disabled = true;
				content.placeholder = "无法编辑的类型";
		}
		path.className = "indexor_path";
	}
	#contentElement;
	#content;
	get content() { return this.#content }
	set content(value) {
		if (typeof value != "string") throw new TypeError("invalid type");
		setContent(this.#node, this.#contentElement.value = this.#content = value.trim())
	}
	#userChangedContent() {
		const contentElement = this.#contentElement;
		contentElement.className = setContent(this.#node, this.#content = contentElement.value.trim()) ? "indexor_content" : "indexor_content invalid";
	}
	#element;
	get element() { return this.#element }
	constructor(title = "", path = "") {
		const nodes = parseAndGetNodes([["div", [
			["input", null, { class: "indexor_title", spellcheck: "false", placeholder: "索引器标题" }, "title"],
			["button", null, { class: "indexor_remove", title: "移除索引器" }, "remove"],
			["span", "索引路径：", { class: "indexor_path_d" }],
			["input", null, { class: "indexor_path", spellcheck: "false", placeholder: "索引编号变量：i" }, "path"],
			["input", null, { class: "indexor_content", spellcheck: "false", placeholder: "请输入内容" }, "content"]
		], { class: "indexor" }, "element"]]).nodes;
		nodes.remove.addEventListener("click", removeIndexor.bind(null, this));
		this.#element = nodes.element;
		const titleElement = this.#titleElement = nodes.title,
			pathElement = this.#pathElement = nodes.path;
		titleElement.addEventListener("input", this.#userChangedTitle.bind(this));
		pathElement.addEventListener("input", this.#userChangedPath.bind(this));
		titleElement.value = title;
		pathElement.value = this.#indexor.path = path;
		(this.#contentElement = nodes.content).addEventListener("input", this.#userChangedContent.bind(this));
	}
	update() { this.#updateNode() }
	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: this.name,
			configurable: true
		})
	}
}

function newIndexor() {
	const indexor = new IndexorItem;
	indexor.update();
	indexors.push(indexor);
	indexorFrame.appendChild(indexor.element);
}
async function removeIndexor(instance) {
	const i = indexors.indexOf(instance);
	if (i != -1 && await MiniWindow.confirm("确定要移除这个索引器吗？")) {
		indexors.splice(i, 1);
		instance.element.remove();
	}
}
async function removeAllIndexor() {
	if (indexors.length) {
		if (await MiniWindow.confirm("确定要移除全部索引器吗？")) {
			indexorFrame.innerHTML = "";
			indexors = [];
		}
	}
}
function updateAllIndexor() { for (const item of indexors) item.update() }
function setContent(node, content) {
	if (!node) return false;
	var parseContent;
	try { parseContent = parse(content) } catch (e) { return false }
	const type = typeof parseContent;
	if (type == node.type) {
		node.value = parseContent;
		node.content.innerText = content;
		return true;
	}
	return false;
}





const identifierRegexp = /^[A-Za-z_$][\w$]*$/;

function indexorDataMapper(item) { return ["div", [["span", ["名称：", item.title]], ["br"], ["span", ["路径：", item.path]]]] }
function buildIndexorData(message, data) {
	return parseAH([["div", [
		["span", message],
		["div", data.length ? data.map(indexorDataMapper) : "空", { class: "indexor_data" }]
	], { class: "indexor_data_frame" }]])
}


async function userLoadSet() {
	//TODO
}

function loadSet({ indexors: indexorsSet, variables: variablesSet }) {
	indexorFrame.innerHTML = "";
	variables = variablesSet;
	indexors = [];
	for (const index in variables) {
		//TODO
	}
	if (indexorsSet.length) {
		const fragment = new DocumentFragment;
		for (const { title, path } of indexorsSet) {
			const item = new IndexorItem(title, path);
			indexors.push(item);
			fragment.appendChild(item.element);
		}
		indexorFrame.appendChild(fragment);
	} else {
		const item = new IndexorItem;
		indexors.push(item);
		indexorFrame.appendChild(item.element);
	}
	updateAllIndexor();
}








indexorAdd.addEventListener("click", newIndexor);

loadSet(await indexorStorage.get("") ?? { variables: {}, indexors: [] });

createTab("indexed_edit", "索引式编辑", [
	["div", [
		"索引变量",
		index
	], { id: "indexed_edit_variables" }],
	["div", [
		"索引器",
		indexorAdd
	], { id: "indexed_edit_indexor" }],
	indexorFrame,
	managementFrame
], false);

export { createTab, updateAllIndexor };