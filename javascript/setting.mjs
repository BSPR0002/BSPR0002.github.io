import OverlayWindow from "/component/overlay_window/OverlayWindow.mjs";
import Setting from "/component/setting/Setting.mjs";
import initialStore from "./site_database.mjs";
import { upgrade, storeName } from "/component/setting/SettingStorage.mjs";
const tree = [
	{
		type: "collection",
		name: "push_service",
		title: "推送",
		sub: [
			{ type: "storage", title: "允许我们向您推送通知", path: "pushNews", data: "switch" },
			{
				type: "action",
				title: "重置推送记录",
				async action() {
					if (!overlayWindow) return;
					if (!await overlayWindow.confirm("你确定要重置推送记录？\n重置推送记录会重新推送所有信息。")) return;
					localStorage.removeItem("BSIF.WS.News");
					overlayWindow.alert("已重置推送记录！");
				}
			}
		]
	},
	{ type: "info", name: "about", title: "关于此网站", source: "/page/about.html" },
	{
		type: "action",
		title: "转到测试页面",
		action() { location.href = "/page/test.html" }
	}
], storageConfig = {
	"pushNews": { type: "boolean", default: true }
}, instance = await Setting.open(await initialStore(storeName, upgrade), { tree, storage: storageConfig }), storage = instance.storage;
var overlayWindow = null;
function clearWindow() { overlayWindow = null }
function createWindow(content) {
	if (overlayWindow) throw new Error("Setting UI is now shown.");
	(overlayWindow = new OverlayWindow(content, "网站设置", { size: { width: "25rem", height: "100%" } })).addEventListener("close", clearWindow);
}
async function showBoard() { createWindow(await instance.home()) }
async function direct(path) { createWindow(await instance.direct(path)) }
export { tree, storageConfig, storage, showBoard, direct }