import database from "./data.mjs";
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
	window.addEventListener("pointermove", resize);
	window.addEventListener("pointerup", resizeEnd);
	window.addEventListener("blur", resizeEnd);
	rootStyle.cursor = "ew-resize";
});
document.getElementById("preview_switch").addEventListener("click", function () {
	previewFrame.className = (previewSwitchState = !previewSwitchState) ? "on" : "off";
	this.blur();
})
// 选项卡控制
const tabsElement = document.getElementById("editor_tabs"),
	tabsOverlayTrack = document.getElementById("editor_tabs_scroll_bar").style,
	tabsOverlaySlide = document.getElementById("editor_tabs_scroll_bar_slide").style;
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
tabsElement.addEventListener("scroll", tabsScroll);
tabsElement.addEventListener("wheel", (event) => {
	const y = event.deltaY;
	if (y) {
		event.preventDefault();
		this.scrollBy({ left: y, behavior: "smooth" });
	}
});
tabsElement.addEventListener("dragover", (event) => { event.preventDefault() })