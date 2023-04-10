import { open, read, readableTypes } from "/javascript/module/FileIO.mjs";
import { MiniWindow } from "/javascript/module/MiniWindow.mjs";
import { openFile } from "./editor.mjs";
const body = document.body;
var working = false, pending = false;
document.getElementById("select_file").addEventListener("click", async function () { try { loadFile(await open({ types: [{ accept: { "application/json": [".json"] } }] })) } catch (e) { } });
async function loadFile(fileHandle) {
	if (pending || working) return;
	pending = true;
	const waitWin = new MiniWindow("正在加载，请稍等……", "请稍等", { noManualClose: true });
	try {
		const data = JSON.parse(await read(await fileHandle.getFile(), readableTypes.TEXT));
		fileHandle.requestPermission({ mode: "readwrite" });
		startWork(data, fileHandle);
	} catch (error) {
		new MiniWindow("无法解读该文件，请选择正确的 JSON 文件。", "错误！");
	}
	pending = false;
	waitWin.close();
}
function preventDefault(event) { event.preventDefault() }
document.addEventListener("dragover", preventDefault);
document.addEventListener("drop", preventDefault);
body.className = "open";
launchQueue.setConsumer(function (launchParams) {
	const file = launchParams.files[0];
	if (file) loadFile(file);
});
function startWork(data, fileHandle) {
	if (working) {
		new MiniWindow("此实例已经打开了文件，请启动一个新实例。");
		return;
	}
	working = true;
	openFile(data, fileHandle);
	body.className = "work";
}
function endWork() {
	working = false;
	body.className = "open";
}
export { endWork }