import { parse, parseAndGetNodes } from "./module/array_HTML.mjs";
import { CacheJSON } from "./module/CacheJSON.mjs";
import OverlayWindow from "/component/overlay_window/OverlayWindow.mjs";
const json = new CacheJSON("/json/projects.json", true);
async function showBoard() {
	const { nodes: { frame }, documentFragment } = parseAndGetNodes([
		["style", [
			"#projects-frame{height:100%;display:grid;gap:0.5rem}",
			"#projects-frame.empty::after{place-self:center;content:\"目前没有项目\"}",
			".projects-item{padding:0.5rem;border-radius:0.5rem;box-sizing:border-box;border:var(--soft-edge) 0.0625rem solid}",
			".projects-item>*{border-radius:0.25rem}",
			".projects-item summary{border:none;background-color:var(--interface-color);color:var(--interface-content-color)"
		]],
		["div", null, { id: "projects-frame", class: "bs-loading" }, "frame"]
	]);
	new OverlayWindow(documentFragment, "工程项目", { size: { width: "20rem" } });
	if (!json.loaded) await json.fetch();
	const data = json.data;
	if (data.length) {
		frame.className = "";
		const temp = [];
		for (let item of data) {
			temp.push(["div", [
				["img", null, { src: item.image }],
				["details", [
					["summary", item.title],
					item.content
				], { class: "bs-content" }]
			], { class: "projects-item" }])
		}
		frame.appendChild(parse(temp));
	} else frame.className = "empty";
}
export { showBoard }