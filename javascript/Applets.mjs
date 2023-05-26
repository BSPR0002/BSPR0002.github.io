import { CacheJSON } from "/javascript/module/CacheJSON.mjs";
import { parse, parseAndGetNodes } from "/javascript/module/ArrayHTML.mjs";
import MiniWindow from "/javascript/module/MiniWindow.mjs";
import initialStore from "/javascript/SiteDatabase.mjs";
import { getJSON } from "/javascript/module/AJAX.mjs";
const favStore = await initialStore("FavoriteApplets", function (upgrader) { upgrader.createObjectStore("FavoriteApplets") }), json = new CacheJSON("/json/applets.json", true);
const { frame, listFrame, searchButtonState, searchButton, searchInput, backTop, list, partFav, listFav, listAll, detailStyle } = parseAndGetNodes([
	["div", [
		["style", [
			"#applets_frame{display:grid;width:100%;height:100%;grid-template-rows:1.75rem 1fr;gap:0.5rem;overflow:hidden}",
			"#applets_search{box-sizing:border-box;width:100%;position:relative;overflow:hidden;display:grid;grid-template-columns:auto 1fr 1.75rem;gap:0.25rem}",
			"#applets_search>*{height:100%}",
			"#applets_search_button{position:relative;overflow:hidden;font-size:0.875rem;padding:0 0.25rem!important}",
			"#applets_search_button>*{vertical-align:middle}",
			"#applets_search_state{display:inline-block;width:1.25rem;height:1.25rem;position:relative}",
			"#applets_search_state:before{content:\"\";display:block;background-color:var(--MiniWindow_buttonTextColor);width:0.5625rem;height:0.125rem;border-radius:0 0.0625rem 0.0625rem 0;transform:rotateZ(45deg);position:absolute;right:0.0625rem;bottom:0;transform-origin:right center}",
			"#applets_search_state:after{content:\"\";display:block;width:1rem;height:1rem;position:absolute;background-color:transparent;box-sizing:border-box;border:solid 0.125rem var(--MiniWindow_buttonTextColor);border-radius:50%}",
			"#applets_search_text{margin-left:0.125rem}",
			"#applets_search_button:active>#applets_search_state:before{background-color:var(--MiniWindow_buttonActiveTextColor)}",
			"#applets_search_button:active>#applets_search_state:after,#applets_top:active>div{border-color:var(--MiniWindow_buttonActiveTextColor)}",
			"#applets_search_state.waiting:after{background-color:#FFFF00}",
			"#applets_search_state.searching:after{background-color:#00FF00}",
			"#applets_search_input{border:solid 0.0625rem;border-radius:0.25rem;padding:0.25rem}",
			"#applets_search_input:focus{outline-color:var(--focusColor)}",
			"#applets_list_frame{overflow:hidden auto}",
			"#applets_top{position:relative;transition:opacity 0.2s linear}",
			"#applets_top:disabled{pointer-events:none}",
			"#applets_top>div{position:absolute;border:solid 0.0625rem #000000;left:0.8125rem;top:0.375rem;border-radius:0.0625rem}",
			"#applets_list{display:grid;gap:0.5rem;grid-auto-rows:auto}",
			".applets_list_part_title,#applets_list::before{background-color:var(--backgroundColor);box-sizing:border-box;padding:0.5rem;border-radius:0.5rem;margin-bottom:0.5rem}",
			"#applets_list_fav,.applets_list_part_list{display:grid}",
			".search>#applets_list_fav,.empty>.applets_list_part,.loading>.applets_list_part,.search .applets_list_part_title{display:none!important}",
			".applets_item{display:grid;gap:0.25rem;border-radius:0.5rem!important;padding:0.5rem!important}",
			".applets_item_name{white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis}",
			".applets_item_start{background-color:#FFFFFF!important;padding:0.25rem!important}",
			".applets_item_start:hover{background-color:#00FF00!important}",
			".applets_item_start:active{background-color:var(--activeColor)!important}",
			".applets_item_start::before{content:\"\";display:inline-block;height:1em;width:0.85em;background-color:#000000;vertical-align:middle;clip-path:polygon(0 0, 100% 50%, 0 100%)}",
			".applets_item_start:active::after{color:var(--MiniWindow_buttonTextColor)}",
			".applets_item_icon{border-radius:0.25rem;width:100%;height:100%;background-position:center;background-repeat:no-repeat;background-size:contain;background-color:#FFFFFF}",
			".applets_item_icon.none{display:grid;place-content:center}",
			".applets_item_icon.none::before{content:\"?\";font-weight:bold;color:#000000;font-size:4rem}",
			"#applets_list.empty,#applets_list.loading{place-content:start center}",
			"#applets_list.empty::before{content:\"没有找到任何应用\"}",
			"#applets_list.loading::before{content:\"正在加载……\"}"
		]],
		["style", [
			".applets_list_part_list{gap:0.5rem;grid-template-columns:repeat(auto-fill,6rem);justify-content:space-between}",
			".applets_item{grid-template-rows:5rem 1.5rem;place-items:center}",
			"#applets_list_fav .applets_item{grid-template-rows:5rem 1.5rem auto}",
			".applets_item_start::after{content:\"启动\";margin-left:0.125rem;vertical-align:middle}"
		], { media: "all and (min-width:32.001rem)" }],
		["style", [
			"#applets_search_text{display:none}",
			".applets_list_part_list{gap:0.5rem}",
			".applets_item{font-size:0.9375rem;height:2.1875rem;grid-template-columns:1.6875rem 1fr;place-items:center start;padding:0.25rem!important}",
			"#applets_list_fav .applets_item{grid-template-columns:1.6875rem 1fr 1.6875rem}",
			".applets_item_start{width:100%;height:100%;padding:0!important}",
			".applets_item_icon.none::before{font-size:1rem}"
		], { media: "all and (max-width:32rem)" }],
		["div", [
			["button", [
				["div", null, { id: "applets_search_state" }, "searchButtonState"],
				["span", "搜索", { id: "applets_search_text" }]
			], { id: "applets_search_button", title: "搜索" }, "searchButton"],
			["input", null, { id: "applets_search_input", type: "search", placeholder: "请输入搜索关键字" }, "searchInput"],
			["button", [
				["div", null, { style: { width: "0.75rem", top: "0.25rem", left: "0.4375rem" } }],
				["div", null, { style: { height: "1rem" } }],
				["div", null, { style: { width: "0.5rem", transform: "rotateZ(45deg)", transformOrigin: "0.0625rem" } }],
				["div", null, { style: { width: "0.5rem", transform: "rotateZ(135deg)", transformOrigin: "0.0625rem" } }]
			], { id: "applets_top", title: "返回顶部", disabled: "" }, "backTop"]
		], { id: "applets_search" }],
		["div", [
			["div", [
				["div", [
					["div", "已标记应用", { class: "applets_list_part_title" }],
					["div", null, { class: "applets_list_part_list" }, "listFav"]
				], { id: "applets_list_fav", class: "applets_list_part" }, "partFav"],
				["div", [
					["div", "全部应用", { class: "applets_list_part_title" }],
					["div", null, { class: "applets_list_part_list" }, "listAll"]
				], { id: "applets_list_all", class: "applets_list_part" }]
			], { id: "applets_list", class: "loading" }, "list"],
		], { id: "applets_list_frame" }, "listFrame"]
	], { id: "applets_frame" }, "frame"],
	["style", [
		"#applets_detail_frame{display:grid;gap:0.5rem}",
		"#applets_detail_interface{display:grid;width:100%;grid-template-rows:6rem auto auto;grid-template-columns:1fr 1fr;grid-template-areas:\"icon icon\"\"name name\"\"fav start\";gap:0.5rem;border-radius:0.5rem;box-sizing:border-box;padding:0.5rem;place-items:center;background-color:var(--backgroundColor);color:#000000}",
		"#applets_detail_icon{grid-area:icon;width:6rem;height:6rem;border-radius:0.5rem;background-position:center;background-repeat:no-repeat;background-size:contain;background-color:#FFFFFF}",
		"#applets_detail_icon.none{display:grid;place-content:center}",
		"#applets_detail_icon.none::before{content:\"?\";font-weight:bold;font-size:4rem}",
		"#applets_detail_fav,#applets_detail_start{padding:0.375rem!important;max-width:6rem;box-sizing:border-box;width:100%;display:grid;grid-template-columns:auto 1fr;place-items:center;background-color:#FFFFFF!important;border-radius:0.375rem!important}",
		"#applets_detail_name{grid-area:name;white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis}",
		"#applets_detail_fav:hover{background-color:var(--hoverColor)!important}",
		"#applets_detail_fav:active{background-color:var(--activeColor)!important}",
		"#applets_detail_fav::after{content:\"标记\"}",
		"#applets_detail_fav:has(:checked)::after{content:\"已标记\"}",
		"#applets_detail_start{grid-area:start;font-size:0.9375rem}",
		"#applets_detail_start:hover{background-color:#00FF00!important}",
		"#applets_detail_start:active{background-color:var(--activeColor)!important}",
		"#applets_detail_start::before{content:\"\";display:inline-block;height:1em;width:0.85em;background-color:#000000;vertical-align:middle;clip-path:polygon(0 0, 100% 50%, 0 100%)}",
		"#applets_detail_start::after{content:\"启动\";margin-left:0.125rem;vertical-align:middle}",
		"#applets_detail_start:active::after{color:var(--MiniWindow_buttonTextColor)}",
		"#applets_detail_info{display:grid;gap:0.25rem;min-height:3rem}",
		"#applets_detail_info.error::before{content:\"无法获取应用信息\";place-self:center}",
		"#applets_detail_info.load{background-color:var(--backgroundColor);box-sizing:border-box;padding:0.5rem;border-radius:0.5rem;}",
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
	const { item } = parseAndGetNodes([["button", [
		["div", null, iconName ? { style: `background-image:url("${directory + iconName}")`, class: "applets_item_icon" } : { class: "applets_item_icon none" }],
		["span", name, { class: "applets_item_name" }]
	], { class: "applets_item", title: name }, "item"]]).nodes;
	item.addEventListener("click", function () { showDetail(directory, iconName, name, id) });
	return item;
}
function buildFavItem(data) {
	const temp = buildItem(data);
	const { start } = parseAndGetNodes([["button", null, { class: "applets_item_start", title: "启动此应用" }, "start"]]).nodes;
	start.addEventListener("click", function (event) {
		event.stopPropagation();
		window.open(data.directory + "index.html", "_blank");
	});
	temp.appendChild(start);
	return temp;
}
function buildList(data, fav) {
	const df = document.createDocumentFragment(), builder = fav ? buildFavItem : buildItem;
	for (let item of data) df.appendChild(builder(item));
	return df;
}
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
	const { frame, fav, start, info } = parseAndGetNodes([["div", [
		detailStyle.cloneNode(true),
		["div", [
			["div", null, iconName ? { id: "applets_detail_icon", style: `background-image:url("${directory + iconName}")` } : { id: "applets_detail_icon", class: "none" }],
			["span", name, { id: "applets_detail_name", title: name }],
			["label", [
				["input", null, { type: "checkbox" }, "fav"]
			], { id: "applets_detail_fav", title: "标记此应用以使其在主菜单中置顶" }],
			["button", null, { id: "applets_detail_start", title: "启动此应用" }, "start"]
		], { id: "applets_detail_interface" }],
		["div", null, { id: "applets_detail_info", class: "bs-loading" }, "info"]
	], { id: "applets_detail_frame" }, "frame"]]).nodes;
	fav.checked = (await favorite).includes(id);
	fav.addEventListener("change", function () { favChange(id, this.checked) });
	start.addEventListener("click", function () { window.open(directory + "index.html", "_blank") });
	miniWindow.after(frame, "应用信息", { size: { width: "20rem" } }).onclose = showBoard;
	miniWindow.close();
	try {
		const data = await new Promise(function (resolve, reject) { getJSON(directory + "info.json", resolve, true, reject) });
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