import { decode, decodeAndGetNodes } from "./module/ArrayHTML.mjs";
import { CacheJSON } from "./module/CacheJSON.mjs";
import MiniWindow from "./module/MiniWindow.mjs"
const json = new CacheJSON("/json/projects.json", true);
async function showBoard() {
	const { nodes: { frame }, documentFragment } = decodeAndGetNodes([
		["style", [
			"#projects_frame{height:100%;display:grid;gap:0.5rem}",
			"#projects_frame.empty::after{place-self:center;content:\"目前没有项目\"}",
			".projects_item{padding:0.5rem;border-radius:0.5rem;box-sizing:border-box;border:var(--softEdge) 0.0625rem solid}",
			".projects_item>*{border-radius:0.25rem}",
			".projects_item summary{border:none;background-color:var(--interfaceColor);color:var(--interfaceContentColor)"
		]],
		["div", null, { id: "projects_frame", class: "bs-loading" }, "frame"]
	]);
	new MiniWindow(documentFragment, "工程项目", { size: { width: "20rem" } });
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
			], { class: "projects_item" }])
		}
		frame.appendChild(decode(temp));
	} else frame.className = "empty";
}
export { showBoard }