import { get } from "/javascript/module/AJAX.mjs";
import { parse, parseAndGetNodes } from "/javascript/module/ArrayHTML.mjs";
import MiniWindow from "/javascript/module/MiniWindow.mjs";
import { buildNameList, buildMediaTags, buildContentTags } from "/javascript/ResourceInformation.mjs";
const detailStyle = document.createElement("style");
detailStyle.textContent = [
	"#resource-detail{display:grid;grid-template-rows:auto 1fr;gap:0.5rem}",
	"#resource-detail-information{display:grid;gap:0.25rem 1rem;color:#000000}",
	"#resource-detail-information-icon{max-height:8rem;border-radius:1rem}",
	"#resource-detail-information-name{font-size:1.5rem;font-weight:bold;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
	".resource-detail-information-item{display:grid;font-size:0.875rem}",
	".resource-detail-information-item-name{color:#004080}",
	".resource-detail-information-tag-list{align-self:center;height:1.125rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:0.75rem;}",
	".resource-detail-tag{box-sizing:border-box;display:inline-block;height:100%;margin-inline-end:0.25rem;border-radius:0.125rem;padding:0.125rem;background-color:#C0E0F0;overflow:hidden}",
	"@media all and (min-width:48rem){",
	"#resource-detail-information{height:8rem;grid-template-columns:8rem 1fr;grid-template-rows:1fr repeat(4,1.25rem);grid-template-areas:\"icon display\"\"icon media\"\"icon content\"\"icon author\"\"icon production\"}",
	"#resource-detail-information-icon{grid-area:icon}",
	".resource-detail-information-item{grid-template-columns:auto 1fr;gap:0.5rem}",
	"}",
	"@media all and not (min-width:48rem){",
	"#resource-detail-information{grid-template-rows:8rem repeat(5,1fr);place-items:center}",
	".resource-detail-information-item{align-self:start;width:100%;place-items:center}",
	".resource-detail-tag{margin-inline:0.125rem}",
	"}",
	"#resource-detail-content.bs-loading{min-height:4rem}",
	"#resource-detail-content>details{margin-bottom:0.5rem}",
	"#resource-detail-content>details:last-of-type{margin-bottom:0}",
	"#resource-detail-content summary{border:none;background-color:#0080FF;color:#FFFFFF}",
	"#resource-detail-content summary>H2{display:inline;font-weight:normal;font-size:inherit}",
	".resource-detail-content-release>div{margin-bottom:1rem}",
	".resource-detail-content-release>div:last-of-type{margin-bottom:0}",
	".resource-detail-content-release-type{font-size:inherit}",
	".resource-detail-content-release-icon{display:inline-block;margin-inline-end:0.25rem;width:1.125rem;height:1.125rem;background-size:100%;vertical-align:sub}",
	".resource-detail-content-release-icon.bdnd{background-image:url(/images/third-party/icon/BaiduNetdisk.png)}",
	".resource-detail-content-release-icon.magnet{background-image:url(/images/third-party/icon/Magnet.svg)}"
].join("");
function buildResourceBaiduNetDisk(data, container) {
	const link = "https://pan.baidu.com/s/" + data.code, temp = [
		["h3", [["div", null, { class: "resource-detail-content-release-icon bdnd" }], "百度网盘"], { class: "resource-detail-content-release-type" }], ["HR"],
		"链接：", ["a", link, { href: link + "?pwd=" + data.password, target: "-blank" }]
	];
	if ("note" in data) temp.push(["br"], "说明：", ["br"], ...data.note);
	container.push(["div", temp]);
}
function buildResourceMagnet(data, container) {
	const link = "magnet:?xt=urn:btih:" + data.hash, temp = [
		["h3", [["div", null, { class: "resource-detail-content-release-icon magnet" }], "磁力链接"], { class: "resource-detail-content-release-type" }], ["HR"],
		"链接：", ["a", link, { href: link }]
	];
	if ("note" in data) temp.push(["br"], "说明：", ["br"], ...data.note);
	container.push(["div", temp]);
}
function buildRelease(data) {
	const temp = [];
	if ("bdnd" in data) buildResourceBaiduNetDisk(data.bdnd, temp);
	if ("magnet" in data) buildResourceMagnet(data.magnet, temp);
	return buildDetailsPart("资源", temp, true, "resource-detail-content-release");
}
function buildDetailsPart(title, data, opened = false, className = null) {
	data.unshift(["summary", [["h2", title]]]);
	const arrayHTML = ["details", data, { class: "bs-content" }], attributes = arrayHTML[2];
	if (className) attributes.class += " " + className;
	if (opened) attributes.open = "";
	return arrayHTML;
}
function displayDetails(data, showArea) {
	const arrayHTML = [];
	if ("introduction" in data) arrayHTML.push(buildDetailsPart("简介", data.introduction));
	if ("release" in data) arrayHTML.push(buildRelease(data.release));
	showArea.className = "";
	showArea.appendChild(parse(arrayHTML));
}
function showDetail(data) {
	const { documentFragment, nodes } = parseAndGetNodes([
		detailStyle.cloneNode(true),
		["div", [
			["div", [
				["img", null, { id: "resource-detail-information-icon", src: data.icon, alt: "资源印象图" }],
				["h1", data.display, { id: "resource-detail-information-name" }],
				["div", [
					["span", "媒体类型", { class: "resource-detail-information-item-name" }],
					"media" in data ? ["div", buildMediaTags(data.media, "resource-detail-tag"), { class: "resource-detail-information-tag-list" }] : "未知"
				], { class: "resource-detail-information-item" }],
				["div", [
					["span", "内容类型", { class: "resource-detail-information-item-name" }],
					"content" in data ? ["div", buildContentTags(data.content, "resource-detail-tag"), { class: "resource-detail-information-tag-list" }] : "未知"
				], { class: "resource-detail-information-item" }],
				["div", [
					["span", "主创作者", { class: "resource-detail-information-item-name" }],
					"artists" in data ? ["div", buildNameList(data.artists, "resource-detail-tag"), { class: "resource-detail-information-tag-list" }] : "未知"
				], { class: "resource-detail-information-item" }],
				["div", [
					["span", "制作公司", { class: "resource-detail-information-item-name" }],
					"producer" in data ? ["div", buildNameList([data.producer], "resource-detail-tag"), { class: "resource-detail-information-tag-list" }] : "未知"
				], { class: "resource-detail-information-item" }]
			], { id: "resource-detail-information" }],
			["div", [], { id: "resource-detail-content", class: "bs-loading" }, "showArea"]
		], { id: "resource-detail" }]
	]), miniWindow = new MiniWindow(documentFragment, data.display, { size: { width: "62rem", height: "100%" } });
	const xhr = get(
		`/json/resource/${data.id}.json`,
		function (response) { displayDetails(response, nodes.showArea) },
		"json",
		false
	);
	miniWindow.onclosed = xhr.abort.bind(xhr);
}
export { showDetail }