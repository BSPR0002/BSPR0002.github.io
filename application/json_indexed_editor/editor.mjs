import { endWork } from "./main.mjs";
import database from "./data.mjs";
import { parse as parseAH, parseAndGetNodes } from "/javascript/module/ArrayHTML.mjs";
import { save } from "/javascript/module/FileIO.mjs";
import MiniWindow from "/javascript/module/MiniWindow.mjs";
const { stringify, parse } = JSON, ROOT = Symbol("ROOT"),
	indexorStorage = database.getObjectStore("indexors");
//预览部分
class TreeNode {
	key;
	type;
	parent;
	node;
	content;
	#top;
	get top() { return this.#top }
	set top(value) { this.node.style.gridRowStart = (this.#top = value) + 1 }
	constructor(key, type, parent, node, content, top) {
		this.key = key
		this.type = type;
		this.parent = parent;
		this.node = node;
		this.content = content;
		this.top = top;
	}
	get value() { return this.parent.value[this.key] }
	set value(value) { this.parent.value[this.key] = value }
}
class TreeRootNode extends TreeNode {
	#shadow = Object.freeze({
		get [ROOT]() { return data },
		set [ROOT](value) { data = value }
	})
	get value() { return this.#shadow }
	set value(_value) { /* Root node */ }
	get top() { return 0 }
	set top(_value) { /* Root node */ }
	constructor() { super(null, ROOT, null, preview, preview, 0) }
	update(child) {
		if (child instanceof TreeCollectionNode) {
			const viewTop = preview.scrollTop;
			child.render(viewTop / 22, (viewTop + preview.clientHeight) / 22, 0.36363636363636365);
		}
	}
}
class TreeCollectionNode extends TreeNode {
	constructor(value, type, parent, node, content, top) {
		super(null, type, parent, node, content, top);
		this.#value = value;
	}
	#value;
	get(key) { return this.children[key] }
	get value() { return this.#value }
	set value(_value) { throw new Error("Illegal operation") }
	children = [];
	#toggleHeight;
	get toggleHeight() { return this.#toggleHeight }
	set toggleHeight(value) {
		this.content.style.gridTemplateRows = `repeat(${this.#toggleHeight = value},1.375rem)`;
		const node = this.node;
		node.style.gridRowEnd = "span " + (node.open ? this.#toggleHeight + 1 : 1)
	}
	setHeight(span) { this.node.style.gridRowEnd = "span " + span }
	reRender = false;
	lastViewTopChild = null;
	lastViewBottomChild = null;
	toggle(event) {
		const deltaHeight = this.toggleHeight;
		if (!deltaHeight) return;
		const open = event.target.open
		this.parent.update(this, open, deltaHeight);
		this.setHeight(open ? deltaHeight + 1 : 1);
	}
	render(viewTop, viewBottom, offsetTop) {
		const content = this.content;
		if (this.reRender) {
			if (this.node.open) { reRender(this, viewTop, viewBottom, offsetTop + 1) } else {
				content.innerHTML = "";
				this.lastViewTopChild = this.lastViewBottomChild = null;
				this.reRender = false;
			}
		} else if (this.node.open) newRender(this, viewTop, viewBottom, offsetTop + 1);
	}
	update(child, state, deltaHeight) {
		const children = this.children, length = children.length;
		if (state) {
			this.toggleHeight += deltaHeight;
			for (let i = children.indexOf(child) + 1; i < length; ++i) children[i].top += deltaHeight;
		} else {
			this.toggleHeight -= deltaHeight;
			for (let i = children.indexOf(child) + 1; i < length; ++i) children[i].top -= deltaHeight;
		}
		this.parent.update(this, state, deltaHeight);
	}
}
class TreeObjectNode extends TreeCollectionNode {
	entries = {};
	get(key) { return this.entries[key] }
	constructor(value, parent, node, content, top) { super(value, "object", parent, node, content, top) }
}
function calcRealativeView(viewTop, viewBottom, offsetTop, height) {
	const innerTop = viewTop - offsetTop;
	return {
		top: innerTop > 0 ? innerTop : 0,
		bottom: viewBottom < offsetTop + height ? viewBottom - offsetTop : height
	}
}
function newRender(node, viewTop, viewBottom, offsetTop) {
	const children = node.children, length = children.length;
	if (!length) return;
	const content = node.content, { top, bottom } = calcRealativeView(viewTop, viewBottom, offsetTop, node.toggleHeight);
	var index = 0, lastViewTopChild = null;
	while (index < length) {
		const child = children[index++],
			isObject = child instanceof TreeCollectionNode,
			{ top: edge, node: childNode } = child;
		if (top >= edge + (isObject && childNode.open ? child.toggleHeight + 1 : 1)) continue;
		if (edge >= bottom) return;
		lastViewTopChild = child;
		content.appendChild(childNode);
		if (child instanceof TreeCollectionNode) child.render(viewTop, viewBottom, offsetTop + child.top);
		break;
	}
	var lastViewBottomChild = lastViewTopChild;
	while (index < length) {
		const child = children[index++];
		if (child.top >= bottom) break;
		lastViewBottomChild = child;
		content.appendChild(child.node);
		if (child instanceof TreeCollectionNode) child.render(viewTop, viewBottom, offsetTop + child.top);
	}
	node.lastViewTopChild = lastViewTopChild;
	node.lastViewBottomChild = lastViewBottomChild;
	node.reRender = true;
}
function reRender(node, viewTop, viewBottom, offsetTop) {
	const { lastViewTopChild, lastViewBottomChild, children, content } = node,
		{ top, bottom } = calcRealativeView(viewTop, viewBottom, offsetTop, node.toggleHeight);
	if (viewBottom <= offsetTop) {
		content.innerHTML = "";
		node.lastViewTopChild = node.lastViewBottomChild = null;
		node.reRender = false;
		return;
	}
	const bottomHeight = lastViewBottomChild instanceof TreeCollectionNode && lastViewBottomChild.node.open ? lastViewBottomChild.toggleHeight + 1 : 1,
		line1 = lastViewTopChild.top,
		line2 = lastViewBottomChild.top + bottomHeight;
	if (bottom <= line1 || top >= line2) {
		content.innerHTML = "";
		newRender(node, viewTop, viewBottom);
		return;
	}
	const length = children.length;
	var topIndex = children.indexOf(lastViewTopChild),
		bottomIndex = children.indexOf(lastViewBottomChild);
	if (top < line1) {
		let topChild;
		for (let index = topIndex - 1; index > -1; --index) {
			const child = children[index], node = child.node;
			if (top >= child.top + (child instanceof TreeCollectionNode && node.open ? child.toggleHeight + 1 : 1)) {
				topIndex = index;
				break;
			}
			topChild = child;
			content.appendChild(node);
		}
		node.lastViewTopChild = topChild;
	} else for (let index = topIndex; index < length; ++index) {
		const child = children[index], childNode = child.node;
		if (child.top + (child instanceof TreeCollectionNode && childNode.open ? child.toggleHeight + 1 : 1) > top) {
			topIndex = index;
			node.lastViewTopChild = child;
			break;
		}
		childNode.remove();
	}
	if (bottom > line2) {
		let bottomChild;
		for (++bottomIndex; bottomIndex < length; ++bottomIndex) {
			const child = children[bottomIndex];
			if (child.top >= bottom) break;
			bottomChild = child;
			content.appendChild(child.node);
		}
		node.lastViewBottomChild = bottomChild;
	} else {
		while (bottomIndex > -1) {
			const child = children[bottomIndex];
			if (child.top < bottom) {
				node.lastViewBottomChild = child;
				break;
			}
			child.node.remove();
			--bottomIndex;
		}
		++bottomIndex;
	}
	for (let index = topIndex; index < bottomIndex; ++index) {
		const child = children[index];
		if (child instanceof TreeCollectionNode) child.render(viewTop, viewBottom, offsetTop + child.top);
	}
}
var tree, fileHandle, data, changed = false, pending = false;
const fileName = document.getElementById("file_name"),
	preview = document.getElementById("preview"),
	indexorFrame = document.getElementById("indexor_frame"),
	menu = document.getElementById("menu"),
	index = document.getElementById("editor_index_set"),
	root = new TreeRootNode;
preview.addEventListener("scroll", function () { root.update(tree) }, { passive: true });
function openFile(JSONData, file) {
	tree = buildItem(ROOT, document.createTextNode(""), data = JSONData, root, 0);
	fileName.innerText = (fileHandle = file).name;
	preview.appendChild(tree.node);
	Indexor.updateAll();
}
const reqiredPermission = { mode: "readwrite" };
async function saveFile() {
	if (pending || !(fileHandle && changed)) return;
	pending = true;
	if (await fileHandle.queryPermission(reqiredPermission) != "granted") {
		const alertWin = new MiniWindow("您尚未许可本应用写入文件，请在提示框中授权。", "请求授权", { noManualClose: true }),
			notGranted = await fileHandle.requestPermission(reqiredPermission) != "granted";
		alertWin.close();
		if (notGranted) {
			new MiniWindow("未能保存文件，因为未能获得写入权限。", "保存失败");
			return pending = false;
		}
	}
	try {
		const operator = await fileHandle.createWritable();
		await operator.write(stringify(data));
		await operator.close();
		pending = changed = false;
		return true;
	} catch (e) {
		new MiniWindow("发生了错误：\n" + e.message, "保存失败", { size: { width: "min-content" } });
		return pending = false;
	}
}
const saveAsParam = {
	types: [{ accept: { "application/json": [".json"] } }],
	get suggestedName() { return fileHandle.name }
}
async function saveAs() { save(stringify(data), saveAsParam) }
async function closeFile() {
	if (pending) return;
	if (changed && await MiniWindow.confirm("文件已修改，在关闭文件前要先保存吗？", "文件未保存") && !await saveFile()) return;
	data = tree = fileHandle = undefined;
	changed = false;
	preview.innerHTML = fileName.innerHTML = "";
	Indexor.updateAll();
	endWork();
}
function buildItem(key, keyTitle, data, parent, top) {
	const type = typeof data;
	return type == "object" ? (
		data ?
			buildObject(keyTitle, Array.isArray(data), data, parent, top) :
			buildNative(key, keyTitle, "null", data, parent, top)
	) : buildNative(key, keyTitle, type, data, parent, top);
}
function buildNative(key, keyTitle, type, value, parent, top) {
	const { node, content } = parseAndGetNodes([
		["div", [
			keyTitle,
			["span", stringify(value), { class: "preview_value " + type }, "content"]
		], undefined, "node"]
	]).nodes;
	return new TreeNode(key, type, parent, node, content, top);
}
function buildObject(keyTitle, isArray, value, parent, top) {
	const { node, content } = parseAndGetNodes([
		["details", [
			["summary", [
				keyTitle,
				isArray ?
					["span", value.length, { class: "preview_type Array" }] :
					["span", Object.keys(value).length, { class: "preview_type Object" }]
			]],
			["div", null, { class: "preview_children" }, "content"]
		], { class: "preview_value object" }, "node"]
	]).nodes;
	var self;
	if (isArray) {
		self = new TreeCollectionNode(value, "array", parent, node, content, top);
		buildSubArray(value, self)
	} else {
		self = new TreeObjectNode(value, parent, node, content, top);
		buildSubObject(value, self)
	}
	node.addEventListener("toggle", self.toggle.bind(self));
	return self;
}
function buildSubObject(value, parent) {
	const { children: sub, entries } = parent, keys = Object.keys(value), length = parent.toggleHeight = keys.length;
	for (let i = 0; i < length; ++i) {
		const key = keys[i];
		sub.push(entries[key] = buildItem(key, parseAH([["span", stringify(key), { class: "preview_key" }]]), value[key], parent, i));
	};
}
function buildSubArray(value, parent) {
	const sub = parent.children, length = parent.toggleHeight = value.length;
	for (let i = 0; i < length; ++i) sub.push(buildItem(i, parseAH([["span", i, { class: "preview_key" }]]), value[i], parent, i));
}
//索引器部分
function indexorMapper(item) { return { title: item.title, path: item.path } }
function addIndexor() { Indexor.newInstance() }
class Indexor {
	static #index = 0;
	static get index() { return this.#index }
	static set index(value) {
		value = Number(value);
		if (!(Number.isInteger(value) && value > -1)) return;
		index.value = this.#index = value;
		this.updateAll()
	}
	static #pool = [];
	static #updateMapper(indexor) { indexor.#update() }
	static updateAll() { Indexor.#pool.forEach(Indexor.#updateMapper) }
	static newInstance(title = "", path = "") {
		const instance = new Indexor;
		instance.title = title;
		instance.path = path;
		Indexor.#pool.push(instance);
		indexorFrame.appendChild(instance.#element);
	}
	static #removeAll() {
		this.#pool = [];
		indexorFrame.innerHTML = "";
	}
	static async removeAll() {
		if (pending || !Indexor.#pool.length) return;
		pending = true;
		if (await MiniWindow.confirm("确定要移除全部索引器吗？")) Indexor.#removeAll();
		pending = false;
	}
	static async loadSet() {
		if (pending) return;
		pending = true;
		const last = await indexorStorage.get("current");
		if (last) {
			if (await MiniWindow.confirm(buildIndexorData("当前的索引器方案将会丢失。\n确定要加载如下方案吗？", last))) {
				Indexor.#removeAll();
				loadIndexor(last);
			}
		} else new MiniWindow("没有已保存的索引器方案。");
		pending = false;
	}
	static export() { return Indexor.#pool.map(indexorMapper) }
	static {
		document.getElementById("editor_indexor_add").addEventListener("click", addIndexor)
		index.addEventListener("change", function () {
			Indexor.#index = Number(this.value);
			Indexor.#pool.forEach(Indexor.#updateMapper);
		});
	}
	#titleElement;
	#pathElement;
	#contentElement;
	#element;
	#title = "";
	#route = [];
	#path = "";
	#content;
	get path() { return this.#path }
	set path(value) {
		if (typeof value != "string") throw new TypeError("invalid type");
		this.#updateRoute(this.#pathElement.value = this.#path = value);
	}
	get route() { return this.#route }
	get title() { return this.#title }
	set title(value) {
		if (typeof value != "string") throw new TypeError("invalid type");
		this.#titleElement.value = this.#title = value;
	}
	get content() { return this.#content }
	set content(value) {
		if (typeof value != "string") throw new TypeError("invalid type");
		setContent(this.#node, this.#contentElement.value = this.#content = value.trim())
	}
	constructor() {
		const nodes = parseAndGetNodes([["div", [
			["input", null, { class: "indexor_title", spellcheck: "false", placeholder: "索引器标题" }, "title"],
			["button", null, { class: "indexor_remove", title: "移除索引器" }, "remove"],
			["span", ["索引路径："], { class: "indexor_path_d" }],
			["input", null, { class: "indexor_path", spellcheck: "false", placeholder: "索引编号变量：i" }, "path"],
			["input", null, { class: "indexor_content", spellcheck: "false", placeholder: "请输入内容" }, "content"]
		], { class: "indexor" }, "element"]]).nodes;
		nodes.remove.addEventListener("click", this.remove.bind(this));
		this.#element = nodes.element;
		(this.#titleElement = nodes.title).addEventListener("input", this.#titleChange.bind(this));
		(this.#pathElement = nodes.path).addEventListener("input", this.#pathChange.bind(this));
		(this.#contentElement = nodes.content).addEventListener("input", this.#contentChange.bind(this));
	}
	#titleChange() { this.#title = this.#titleElement.value }
	#pathChange() {
		this.#updateRoute(this.#path = this.#pathElement.value);
		this.#update();
	}
	#contentChange() {
		const contentElement = this.#contentElement;
		contentElement.className = setContent(this.#node, this.#content = contentElement.value.trim()) ? "indexor_content" : "indexor_content invalid";
	}
	#updateRoute(pathString) {
		try { this.#route = calcRoute(pathString) } catch (e) { this.#route = null }
		this.#update();
	}
	#node;
	#update() {
		const node = this.#node = getNode(this.#route),
			path = this.#pathElement,
			content = this.#contentElement;
		content.value = "";
		content.className = "indexor_content";
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
	#remove() {
		this.#element.remove();
		const pool = Indexor.#pool;
		pool.splice(pool.indexOf(this), 1);
	}
	async remove() { if (await MiniWindow.confirm("确定要移除这个索引器吗？")) this.#remove() }
}
function calcRoute(pathString) {
	const route = [], length = pathString.length,
		context = { index: 0, length, pathString, route };
	while (context.index < length) {
		switch (pathString[context.index]) {
			case "[":
				++context.index;
				findE(context);
				break;
			case ".":
				++context.index;
				findK(context);
				break;
			default:
				throw new Error("Not invalid expression");
		}
	}
	return route;
}
class Expression extends String { };
function findE(context) {
	const { pathString, index: startIndex } = context;
	var length = context.length, inner = null;
	for (let index = startIndex; index < length; ++index) {
		switch (pathString[index]) {
			case "\\":
				++index;
				break;
			case "]":
				inner = pathString.substring(startIndex, index);
				length = index + 1;
			default:
		}
	}
	try {
		if (inner) {
			if (inner == "i") {
				context.route.push(new Expression("i"));
				context.index = length;
				return;
			}
			const temp = parse(inner), type = typeof temp;
			if (type == "string" || type == "number") {
				context.route.push(temp);
				context.index = length;
				return
			}
		}
	} catch (e) { }
	throw new Error("Not invalid expression");
}
const regexp = /^[A-Za-z_]\w*/;
function findK(context) {
	const found = context.pathString.substring(context.index).match(regexp);
	if (found) {
		const result = found[0];
		context.route.push(result);
		context.index += result.length;
	} else throw new Error("Not invalid expression");
}
function getNode(route) {
	if (!route) return
	var target = tree;
	for (let key of route) if (target instanceof TreeCollectionNode) {
		if (key instanceof Expression) {
			if (key.valueOf() == "i") { target = target.get(Indexor.index) } else return;
		} else target = target.get(key);
	} else return;
	return target;
}
function setContent(node, content) {
	if (!node) return false;
	var parseContent;
	try { parseContent = parse(content) } catch (e) { return false }
	const type = typeof parseContent;
	if (type == node.type) {
		node.value = parseContent;
		changed = true;
		node.content.innerText = content;
		return true;
	}
	return false;
}
function indexorDataMapper(item) { return ["div", [["span", ["名称：", item.title]], ["br"], ["span", ["路径：", item.path]]]] }
function buildIndexorData(message, data) {
	return parseAH([["div", [
		["span", message],
		["div", data.length ? data.map(indexorDataMapper) : "空", { class: "indexor_data" }]
	], { class: "indexor_data_frame" }]])
}
function loadIndexorMapper(item) { Indexor.newInstance(item.title, item.path) }
function loadIndexor(data) { data.map(loadIndexorMapper) }
{
	const last = await indexorStorage.get("current");
	if (last?.length) { loadIndexor(last) } else Indexor.newInstance();
}
//菜单部分
function buildMenu(array) { menu.appendChild(parseAH(array.map(menuMapper1))) }
function focusMenu() { if (menu.contains(document.activeElement)) this.focus() }
function clickOption(event) {
	const target = event.srcElement;
	if (target != this) target.blur();
}
function menuMapper1(item, tabindex) {
	const element = parseAndGetNodes([["div", [
		item.title,
		["div", item.options.map(menuMapper2), { class: "menu_expand" }]
	], { class: "menu_item", tabindex }, "element"]]).nodes.element;
	element.addEventListener("mouseenter", focusMenu);
	element.addEventListener("click", clickOption);
	return element;
}
function menuMapper2(item) {
	const element = parseAndGetNodes([["button", item.title, { class: "menu_option" }, "option"]]).nodes.option;
	element.addEventListener("click", item.action);
	return element;
}
buildMenu([
	{
		title: "文件",
		options: [
			{
				title: "保存文件（Ctrl + S）",
				action: saveFile
			},
			{
				title: "另存为",
				action: saveAs
			},
			{
				title: "关闭文件",
				action: closeFile
			}
		]
	},
	{
		title: "索引器",
		options: [
			{
				title: "新增索引器",
				action: addIndexor
			},
			{
				title: "移除全部索引器",
				action: Indexor.removeAll
			},
			{
				title: "保存当前索引器方案",
				async action() {
					if (pending) return;
					pending = true;
					const last = await indexorStorage.get("current");
					if (!last || await MiniWindow.confirm(buildIndexorData("之前已保存了如下方案，要覆盖吗？", last))) indexorStorage.update(Indexor.export(), "current");
					pending = false;
				}
			},
			{
				title: "加载已保存的索引器方案",
				action: Indexor.loadSet
			},
			{
				title: "删除已保存的索引器方案",
				async action() {
					if (pending) return;
					pending = true;
					const last = await indexorStorage.get("current");
					if (last) {
						if (await MiniWindow.confirm(buildIndexorData("确定要删除如下已保存方案吗？", last))) indexorStorage.delete("current");
					} else new MiniWindow("没有已保存的索引器方案。");
					pending = false;
				}
			}
		]
	}
]);
//其他
document.body.addEventListener("keydown", function (event) {
	if (!(fileHandle && event.ctrlKey)) return;
	switch (event.key) {
		case "s":
			saveFile();
			break;
		case "ArrowUp":
			--Indexor.index;
			break;
		case "ArrowDown":
			++Indexor.index;
			break;
		default:
			return;
	}
	event.preventDefault();
});
window.addEventListener("beforeunload", function (event) {
	if (!changed) return;
	event.preventDefault();
	event.returnValue = "文件尚未保存，确认要离开窗口吗？";
})
export { openFile }