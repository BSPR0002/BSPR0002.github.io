import database from "./data.mjs";
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
	save = true;
	resizeObserver.observe(previewFrame);
	rootStyle.cursor = null;
}
document.getElementById("preview_resize").addEventListener("pointerdown", /* resizeStart */() => {
	resizeObserver.disconnect();
	window.addEventListener("pointermove", resize);
	window.addEventListener("pointerup", resizeEnd);
	rootStyle.cursor = "ew-resize";
});
document.getElementById("preview_switch").addEventListener("click", function () {
	previewFrame.className = (previewSwitchState = !previewSwitchState) ? "on" : "off";
	this.blur();
})
