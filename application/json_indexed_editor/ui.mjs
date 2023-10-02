import database from "./data.mjs";
import { parseAndGetNodes } from "/javascript/module/ArrayHTML.mjs";
// 预览窗格宽度控制
const ceil = Math.ceil,
	uiData = database.getObjectStore("UI"),
	previewFrame = document.getElementById("preview_frame"),
	previewFrameStyle = previewFrame.style,
	rootStyle = document.firstElementChild.style;
let previewFrameWidth, save = false, previewSwitchState = true;
previewFrameStyle.width = (await uiData.get("previewFrameWidth") ?? 256) + "px";
const resizeObserver = new ResizeObserver(([{ borderBoxSize: [{ inlineSize }] }]) => {
	previewFrameWidth = ceil(inlineSize);
	if (!save) return;
	save = false;
	uiData.update(previewFrameWidth, "previewFrameWidth");
});
resizeObserver.observe(previewFrame);
function resize({ movementX }) { previewFrameStyle.width = (previewFrameWidth += movementX) + "px" };
function resizeEnd() {
	window.removeEventListener("pointermove", resize);
	window.removeEventListener("pointerup", resizeEnd);
	window.removeEventListener("blur", resizeEnd);
	save = true;
	resizeObserver.observe(previewFrame);
	rootStyle.cursor = null;
}
document.getElementById("preview_resize").addEventListener("pointerdown", /* resizeStart */() => {
	resizeObserver.disconnect();
	window.addEventListener("pointermove", resize, { passive: true });
	window.addEventListener("pointerup", resizeEnd, { passive: true });
	window.addEventListener("blur", resizeEnd, { passive: true });
	rootStyle.cursor = "ew-resize";
});
document.getElementById("preview_switch").addEventListener("click", function () {
	previewFrame.className = (previewSwitchState = !previewSwitchState) ? "on" : "off";
	this.blur();
})
// 选项卡控制
const tabsElement = document.getElementById("editor_tabs"),
	tabsOverlayTrack = document.getElementById("editor_tabs_scroll_bar").style,
	tabsOverlaySlide = document.getElementById("editor_tabs_scroll_bar_slide").style,
	pageFrame = document.getElementById("editor_page"),
	relation = Symbol("relation");
let tabsWidth, tabsContentWidth, tabsSlideWidth, tabsSlideMotionSpace, tabsMotionSpace;
function tabsChange() {
	if (tabsContentWidth > tabsWidth) {
		tabsOverlayTrack.display = null;
		tabsOverlaySlide.width = (tabsSlideWidth = ceil(tabsWidth / tabsContentWidth * tabsWidth)) / 16 + "rem";
		tabsSlideMotionSpace = tabsWidth - tabsSlideWidth;
		tabsMotionSpace = tabsContentWidth - tabsWidth;
		tabsScroll();
	} else tabsOverlayTrack.display = "none";
}
function tabsScroll() { tabsOverlaySlide.left = tabsElement.scrollLeft / tabsMotionSpace * tabsSlideMotionSpace / 16 + "rem" }
new ResizeObserver(([{ borderBoxSize: [{ inlineSize }] }]) => {
	tabsWidth = inlineSize;
	tabsContentWidth = tabsElement.scrollWidth;
	tabsChange();
}).observe(tabsElement);
new MutationObserver(([{ addedNodes, removedNodes }]) => {
	if (addedNodes.length || removedNodes.length) {
		tabsContentWidth = tabsElement.scrollWidth;
		tabsChange();
	}
}).observe(tabsElement, { childList: true });
tabsElement.addEventListener("scroll", tabsScroll, { passive: true });
tabsElement.addEventListener("wheel", (event) => {
	const y = event.deltaY;
	if (y) {
		event.preventDefault();
		tabsElement.scrollBy({ left: y, behavior: "smooth" });
	}
});
function userChangeTab() {
	const tabItem = this[relation];
	currentTab.tab.classList.remove("current");
	currentTab = tabItem;
	tabItem.tab.classList.add("current");
	pageFrame.innerHTML = "";
	pageFrame.appendChild(tabItem.page);
}
function changeTap(tab) {
	currentTab.tab.classList.remove("current");
	currentTab = tab;
	const tabElement = tab.tab;
	tabElement.classList.add("current");
	pageFrame.innerHTML = "";
	pageFrame.appendChild(tabItem.page);
	tabElement.scrollIntoViewIfNeeded();
}
function closeTab() {
	const tabItem = this[relation], index = tabItems.indexOf(tabItem);
	tabItems.splice(index, 1);
	const length = tabItems.length;
	changeTap(tabItems[index < length ? index : length - 1]);
}
class TabItem {
	constructor(id, title, content) {
		const { tab, page, close } = parseAndGetNodes([
			["button", [
				["span", title],
				["button", null, { class: "editor_tab_close" }, "close"]
			], { class: "editor_tab" }, "tab"],
			["div", content, { id: "editor_page_" + id }, "page"]
		]).nodes;
		this.id = id;
		this.tab = tab;
		this.page = page;
		Object.freeze(this);
		Object.defineProperty(tab, relation, { value: this });
		Object.defineProperty(page, relation, { value: this });
		tab.addEventListener("click", userChangeTab, { passive: true });
		close.addEventListener("click", closeTab, { passive: true });
		tabItems.push(this);
		tabsElement.append(tab);
	}
}
let currentTab = Object.freeze(Object.setPrototypeOf({
	id: "indexed_edit",
	tab: document.querySelector(".editor_tab"),
	page: document.getElementById("editor_page_indexed_edit")
}, TabItem));
currentTab.tab.addEventListener("click", userChangeTab, { passive: true });
const tabItems = [currentTab];
tabsElement.addEventListener("dragover", (event) => { event.preventDefault() });
tabsElement.addEventListener("dragstart", (event) => {
	console.log(event)
});

export { TabItem, changeTap }