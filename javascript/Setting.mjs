
import MiniWindow from "./module/MiniWindow.mjs";
import Setting from "./module/setting/Setting.mjs";
import initialStore from "./SiteDatabase.mjs";
import { upgrade, storeName } from "./module/setting/SettingStorage.mjs";
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
					if (!miniWindow) return;
					if (!await miniWindow.confirm("你确定要重置推送记录？\n重置推送记录会重新推送所有信息。")) return;
					localStorage.removeItem("BSIF.WS.News");
					miniWindow.alert("已重置推送记录！");
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
var miniWindow = null;
function clearWindow() { miniWindow = null }
function createWindow(content) {
	if (miniWindow) throw new Error("Setting UI is now shown.");
	(miniWindow = new MiniWindow(content, "网站设置", { size: { width: "25rem", height: "100%" } })).addEventListener("close", clearWindow);
}
async function showBoard() { createWindow(await instance.home()) }
async function direct(path) { createWindow(await instance.direct(path)) }
export { tree, storageConfig, storage, showBoard, direct }