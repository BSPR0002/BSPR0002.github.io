import MiniWindow from "./MiniWindow.mjs";
import { parse as parseAH, parseAndGetNodes } from "./ArrayHTML.mjs";
import { LocalStorageObject } from "./LocalStorageObject.mjs";
const style = parseAndGetNodes([["style", "#bs-requestPermission_title{font-size:1.2rem}#bs-requestPermission_frame{display:grid;gap:0.5rem}#bs-requestPermission_hint{font-weight:bold}", null, "style"]]).nodes.style;
const permissions = {
	notification: {
		localName: "通知",
		descriptions: "授予通知权限代表允许此网站通过弹出通知的方式告知你某些消息。"
	},
	camera: {
		localName: "摄像头",
		descriptions: "授予摄像头权限代表允许此网站使用你的摄像头拍照或者录像。"
	}
}
const count = new LocalStorageObject("BSIF.WebPermissions.count").object;
async function alertRequest(permissionName, reason) {
	var requestCount = count[permissionName];
	if (!requestCount||Date.now() > requestCount.expireTime) {
		count[permissionName]={ chance: 3, expireTime: Date.now() + 86399999 };
		requestCount=count[permissionName];
	}
	if (!requestCount.chance) return false;
	--requestCount.chance;
	const documentFragment = parseAH([
		style,
		["div", [
			["h1", `此网站请求${permissions[permissionName].localName}权限`, { id: "bs-requestPermission_title" }],
			["span", permissions[permissionName].descriptions, { id: "bs-requestPermission_hint" }],
			["p", [
				"此网站需要这项权限用于：", ["br"],
				reason ?? "未知用途"
			], { id: "bs-requestPermission_descriptions" }],
			"你想要授权吗？",
		], { id: "bs-requestPermission_frame" }]
	]);
	const result = await MiniWindow.confirm(documentFragment, "请求权限");
	if (!result) requestCount.chance = 0;
	return result;
}
async function requestNotificationPermission(reason) {
	switch (Notification.permission) {
		case "denied":
			return false;
		case "granted":
			return true;
		case "default":
			if (await alertRequest("notification", reason)) {
				let miniWindow = new MiniWindow("请在弹出的对话框中完成授权。", "请求权限", { size: { width: "0%" } }),
					result = await Notification.requestPermission() == "granted";
				miniWindow.close();
				return result;
			} else return false;
	}
}
function requestPermission(permissionName, reason) {
	switch (permissionName) {
		case "notification":
			return requestNotificationPermission(reason);
		case "camera":
		default:
			throw new Error(`Failed to execute 'requestPermission': No such permission that named '${permissionName}'.`)
	}
}
export { requestPermission }