import { CacheJSON } from "/javascript/module/CacheJSON.mjs";
import { parse, parseAndGetNodes, EVENT_LISTENERS } from "/javascript/module/ArrayHTML.mjs";
import MiniWindow from "/javascript/module/MiniWindow.mjs";
import initialStore from "/javascript/SiteDatabase.mjs";
import { promiseGet } from "/javascript/module/AJAX.mjs";
const favStore = await initialStore("FavoriteApplets", function (upgrader) { upgrader.createObjectStore("FavoriteApplets") }), json = new CacheJSON("/json/applets.json", true);
const { frame, listFrame, searchButtonState, searchButton, searchInput, backTop, list, partFav, listFav, listAll, detailStyle } = parseAndGetNodes([
	["div", [
		["style", [
			"#applets-frame{display:grid;width:100%;height:100%;grid-template-rows:1.75rem 1fr;gap:0.5rem;overflow:hidden}",
			"#applets-search{box-sizing:border-box;width:100%;position:relative;overflow:hidden;display:grid;grid-template-columns:auto 1fr 1.75rem;gap:0.25rem}",
			"#applets-search>*{height:100%}",
			"#applets-search-button{position:relative;overflow:hidden;font-size:0.875rem;padding:0 0.25rem!important;border:0}",
			"#applets-search-button>*{vertical-align:middle}",
			"#applets-search-state{display:inline-block;width:1.25rem;height:1.25rem;position:relative}",
			"#applets-search-state:before{content:\"\";display:block;background-color:var(--mini-window-interactive-text-color);width:0.5625rem;height:0.125rem;border-radius:0 0.0625rem 0.0625rem 0;transform:rotateZ(45deg);position:absolute;right:0.0625rem;bottom:0;transform-origin:right center}",
			"#applets-search-state:after{content:\"\";display:block;width:1rem;height:1rem;position:absolute;background-color:transparent;box-sizing:border-box;border:solid 0.125rem var(--mini-window-interactive-text-color);border-radius:50%}",
			"#applets-search-text{margin-left:0.125rem}",
			"#applets-search-button:active>#applets-search-state:before{background-color:var(--mini-window-interactive-active-text-color)}",
			"#applets-search-button:active>#applets-search-state:after,#applets-top:active>div{border-color:var(--mini-window-interactive-active-text-color)}",
			"#applets-search-state.waiting:after{background-color:#FF0}",
			"#applets-search-state.searching:after{background-color:#0F0}",
			"#applets-search-input{border:solid 0.0625rem;border-radius:0.25rem;padding:0.25rem}",
			"#applets-search-input:focus{outline-color:var(--focus-color)}",
			"#applets-list-frame{overflow:hidden auto}",
			"#applets-top{position:relative;transition:opacity 0.2s linear}",
			"#applets-top:disabled{pointer-events:none}",
			"#applets-top>div{position:absolute;border:solid 0.0625rem #000;left:0.8125rem;top:0.375rem;border-radius:0.0625rem}",
			"#applets-list{display:grid;gap:0.5rem;grid-auto-rows:auto}",
			".applets-list-part-title,#applets-list::before{background-color:var(--background-color);box-sizing:border-box;padding:0.5rem;border-radius:0.5rem;margin-bottom:0.5rem}",
			"#applets-list-fav,.applets-list-part-list{display:grid}",
			".search>#applets-list-fav,.empty>.applets-list-part,.loading>.applets-list-part,.search .applets-list-part-title{display:none!important}",
			".applets-item{display:grid;gap:0.25rem;border-radius:0.5rem!important;padding:0.5rem!important;border:0}",
			".applets-item-name{white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis}",
			".applets-item-start{background-color:#FFFFFF!important;padding:0.25rem!important;border:0;color:#000}",
			".applets-item-start:hover{background-color:#0F0!important}",
			".applets-item-start:active{background-color:var(--active-color)!important}",
			".applets-item-start::before{content:\"\";display:inline-block;height:1em;width:0.85em;background-color:#000;vertical-align:middle;clip-path:polygon(0 0, 100% 50%, 0 100%)}",
			".applets-item-start:active::after{color:var(--mini-window-interactive-text-color)}",
			".applets-item-icon{border-radius:0.25rem;width:100%;height:100%;background-position:center;background-repeat:no-repeat;background-size:contain;background-color:#FFFFFF}",
			".applets-item-icon.none{display:grid;place-content:center}",
			".applets-item-icon.none::before{content:\"?\";font-weight:bold;color:#000;font-size:4rem}",
			"#applets-list.empty,#applets-list.loading{place-content:start center}",
			"#applets-list.empty::before{content:\"没有找到任何应用\"}",
			"#applets-list.loading::before{content:\"正在加载……\"}"
		]],
		["style", [
			".applets-list-part-list{gap:0.5rem;grid-template-columns:repeat(auto-fill,6rem);justify-content:space-between}",
			".applets-item{grid-template-rows:5rem 1.5rem;place-items:center}",
			"#applets-list-fav .applets-item{grid-template-rows:5rem 1.5rem auto}",
			".applets-item-start::after{content:\"启动\";margin-left:0.125rem;vertical-align:middle}"
		], { media: "all and (min-width:32.001rem)" }],
		["style", [
			"#applets-search-text{display:none}",
			".applets-list-part-list{gap:0.5rem}",
			".applets-item{font-size:0.9375rem;height:2.1875rem;grid-template-columns:1.6875rem 1fr;place-items:center start;padding:0.25rem!important}",
			"#applets-list-fav .applets-item{grid-template-columns:1.6875rem 1fr 1.6875rem}",
			".applets-item-start{width:100%;height:100%;padding:0!important}",
			".applets-item-icon.none::before{font-size:1rem}"
		], { media: "all and (max-width:32rem)" }],
		["div", [
			["button", [
				["div", null, { id: "applets-search-state" }, "searchButtonState"],
				["span", "搜索", { id: "applets-search-text" }]
			], { id: "applets-search-button", class: "mini-window-button", title: "搜索" }, "searchButton"],
			["input", null, { id: "applets-search-input", type: "search", placeholder: "请输入搜索关键字" }, "searchInput"],
			["button", [
				["div", null, { style: { width: "0.75rem", top: "0.25rem", left: "0.4375rem" } }],
				["div", null, { style: { height: "1rem" } }],
				["div", null, { style: { width: "0.5rem", transform: "rotateZ(45deg)", transformOrigin: "0.0625rem" } }],
				["div", null, { style: { width: "0.5rem", transform: "rotateZ(135deg)", transformOrigin: "0.0625rem" } }]
			], { id: "applets-top", class: "mini-window-button", title: "返回顶部", disabled: "" }, "backTop"]
		], { id: "applets-search" }],
		["div", [
			["div", [
				["div", [
					["div", "已标记应用", { class: "applets-list-part-title" }],
					["div", null, { class: "applets-list-part-list" }, "listFav"]
				], { id: "applets-list-fav", class: "applets-list-part" }, "partFav"],
				["div", [
					["div", "全部应用", { class: "applets-list-part-title" }],
					["div", null, { class: "applets-list-part-list" }, "listAll"]
				], { id: "applets-list-all", class: "applets-list-part" }]
			], { id: "applets-list", class: "loading" }, "list"],
		], { id: "applets-list-frame" }, "listFrame"]
	], { id: "applets-frame" }, "frame"],
	["style", [
		"#applets-detail-frame{display:grid;gap:0.5rem}",
		"#applets-detail-interface{display:grid;width:100%;grid-template-rows:6rem auto auto;grid-template-columns:1fr 1fr;grid-template-areas:\"icon icon\"\"name name\"\"fav start\";gap:0.5rem;border-radius:0.5rem;box-sizing:border-box;padding:0.5rem;place-items:center;background-color:var(--background-color);color:#000}",
		"#applets-detail-icon{grid-area:icon;width:6rem;height:6rem;border-radius:0.5rem;background-position:center;background-repeat:no-repeat;background-size:contain;background-color:#FFFFFF}",
		"#applets-detail-icon.none{display:grid;place-content:center}",
		"#applets-detail-icon.none::before{content:\"?\";font-weight:bold;font-size:4rem}",
		"#applets-detail-fav,#applets-detail-start{padding:0.375rem!important;max-width:6rem;box-sizing:border-box;width:100%;display:grid;grid-template-columns:auto 1fr;place-items:center;background-color:#FFFFFF!important;border-radius:0.375rem!important}",
		"#applets-detail-name{grid-area:name;white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis}",
		"#applets-detail-fav:hover{background-color:var(--hover-color)!important}",
		"#applets-detail-fav:active{background-color:var(--active-color)!important}",
		"#applets-detail-fav::after{content:\"标记\"}",
		"#applets-detail-fav:has(:checked)::after{content:\"已标记\"}",
		"#applets-detail-start{grid-area:start;font-size:0.9375rem;border:0}",
		"#applets-detail-start:hover{background-color:#0F0!important}",
		"#applets-detail-start:active{background-color:var(--active-color)!important}",
		"#applets-detail-start::before{content:\"\";display:inline-block;height:1em;width:0.85em;background-color:#000;vertical-align:middle;clip-path:polygon(0 0, 100% 50%, 0 100%)}",
		"#applets-detail-start::after{content:\"启动\";margin-left:0.125rem;vertical-align:middle}",
		"#applets-detail-start:active::after{color:var(--mini-window-interactive-text-color)}",
		"#applets-detail-info{display:grid;gap:0.25rem;min-height:3rem}",
		"#applets-detail-info.error::before{content:\"无法获取应用信息\";place-self:center}",
		"#applets-detail-info.load{background-color:var(--background-color);box-sizing:border-box;padding:0.5rem;border-radius:0.5rem;}",
	], null, "detailStyle"]
]).nodes;
listFrame.addEventListener("scroll", function () { backTop.disabled = !listFrame.scrollTop }, { passive: true });
backTop.addEventListener("click", function () { listFrame.scrollTo({ top: 0, behavior: "smooth" }) });
var searchSuspended = false,
	searchTimeoutId = null,
	searching = false,
	favorite;
async function updateFavList() {
	const fav = await (favorite = favStore.getAllKeys());
	partFav.style.display = fav.length ? null : "none";
	if (!json.loaded) await json.fetch();
	const data = json.data.filter(item => fav.includes(item.id));
	listFav.innerHTML = "";
	listFav.appendChild(buildList(data, true));
}
updateFavList();
async function search(keyword) {
	if (!json.loaded) await json.fetch();
	const data = json.data;
	if (!data) return [];
	keyword = keyword.trim();
	if (!keyword) return data;
	var matchers = keyword.replaceAll(/[\\[^.?+*()|${]/g, "\\$&").split(" ").filter((element, index, array) => element && array.indexOf(element) == index);
	if (matchers.length > 1) matchers.unshift(keyword);
	matchers = matchers.map(value => RegExp(value.trim(), "i"));
	const result = [];
	for (let matcher of matchers) {
		const collection = [];
		for (let i = data.length - 1; i > -1; --i) if (matcher.test(data[i].name)) collection.unshift(data.splice(i, 1)[0]);
		result.push(...collection);
	}
	return result
}
function buildItem(data) {
	const { directory, iconName, name, id } = data;
	return ["button", [
		["div", null, iconName ? { style: `background-image:url("${directory + iconName}")`, class: "applets-item-icon" } : { class: "applets-item-icon none" }],
		["span", name, { class: "applets-item-name" }]
	], { class: "applets-item mini-window-button", title: name, [EVENT_LISTENERS]: [["click", () => { showDetail(directory, iconName, name, id) }]] }]
}
function buildFavItem(data) {
	const temp = buildItem(data);
	temp[1][2] = ["button", null, {
		class: "applets-item-start", title: "启动此应用", [EVENT_LISTENERS]: [
			["click", event => {
				event.stopPropagation();
				window.open(data.directory + "index.html", "-blank");
			}]
		]
	}];
	return temp;
}
function buildList(data, fav) { return parse(data.map(fav ? buildFavItem : buildItem)) }
async function buildInterface(home, search) {
	if (home) {
		if (!json.loaded) await json.fetch();
		let data = json.data;
		if (!data.length) {
			list.className = "empty";
			return;
		}
		list.className = "";
		listAll.appendChild(buildList(data, false));
	} else {
		const data = await search;
		list.className = "search";
		if (data.length) {
			listAll.appendChild(buildList(data, false));
			list.className = "";
		} else { list.className = "empty" }
	}
}
async function searchAction() {
	searching = true;
	searchButtonState.className = "searching";
	list.className = "loading";
	listAll.innerHTML = "";
	const keyword = searchInput.value;
	await keyword ? buildInterface(false, search(keyword)) : buildInterface(true);
	searchButtonState.className = "";
	searching = false;
	searchSuspended = false;
}
function searchAuto() {
	if (searching) return;
	if (searchSuspended) {
		clearTimeout(searchTimeoutId);
		searchTimeoutId = setTimeout(searchAction, 1000);
		return
	}
	searchSuspended = true;
	searchButtonState.className = "waiting";
	searchTimeoutId = setTimeout(searchAction, 1000);
}
function searchManual() {
	if (searching) return;
	clearTimeout(searchTimeoutId);
	searchAction();
}
function favChange(id, state) {
	if (state) { favStore.update(Date.now(), id) } else favStore.delete(id);
	updateFavList();
}
async function showDetail(directory, iconName, name, id) {
	const { frame, fav, info } = parseAndGetNodes([["div", [
		detailStyle.cloneNode(true),
		["div", [
			["div", null, iconName ? { id: "applets-detail-icon", style: `background-image:url("${directory + iconName}")` } : { id: "applets-detail-icon", class: "none" }],
			["span", name, { id: "applets-detail-name", title: name }],
			["label", [
				["input", null, { type: "checkbox", [EVENT_LISTENERS]: [["change", function () { favChange(id, this.checked) }]] }, "fav"]
			], { id: "applets-detail-fav", title: "标记此应用以使其在主菜单中置顶" }],
			["button", null, { id: "applets-detail-start", title: "启动此应用", [EVENT_LISTENERS]: [["click", () => { window.open(directory + "index.html", "_blank") }]] }]
		], { id: "applets-detail-interface" }],
		["div", null, { id: "applets-detail-info", class: "bs-loading" }, "info"]
	], { id: "applets-detail-frame" }, "frame"]]).nodes;
	fav.checked = (await favorite).includes(id);
	miniWindow.after(frame, "应用信息", { size: { width: "20rem" } }).onclose = showBoard;
	miniWindow.close();
	try {
		const data = await promiseGet(directory + "info.json", "json", true);
		info.appendChild(parse([
			["span", ["版本：", data.version ?? "不明"]],
			["span", ["开发：", data.developer ?? "不明"]],
			["span", ["更新日期：", parseDate(data.release)]]
		]));
		info.className = "load";
		if ("description" in data) frame.appendChild(parse(data.description))
	} catch (_ignore) { info.className = "error" }
}
function parseDate(timestamp) { return typeof timestamp == "number" ? new Date(timestamp).toLocaleDateString() : "不明" }
searchInput.addEventListener("input", searchAuto);
searchInput.addEventListener("keypress", function (event) { if (event.key == "Enter") searchManual() });
searchButton.addEventListener("click", searchManual);
buildInterface(true);
var miniWindow = null;
function showBoard() { (miniWindow = new MiniWindow(frame, "应用列表", { size: { height: "100%", width: "100%" } })).onclosed = clearWindow }
function clearWindow() { miniWindow = null }
queueMicrotask(async function () {
	if (!json.loaded) await json.fetch();
	const temp = json.data.map(item => item.id);
	for (let item of (await favorite).filter(item => !temp.includes(item))) favStore.delete(item);
})
export { showBoard }