import { getJSON } from "/javascript/module/AJAX.mjs";
import { decode, decodeAndGetNodes } from "/javascript/module/ArrayHTML.mjs";
import MiniWindow from "/javascript/module/MiniWindow.mjs";
import { buildNameList, buildMediaTags, buildContentTags } from "/javascript/ResourceInformation.mjs";
const detailStyle = document.createElement("STYLE");
detailStyle.textContent = [
	"#resource_detail{display:grid;grid-template-rows:auto 1fr;gap:0.5rem}",
	"#resource_detail_information{display:grid;gap:0.25rem 1rem;color:#000000}",
	"#resource_detail_information_icon{max-height:8rem;border-radius:1rem}",
	"#resource_detail_information_name{font-size:1.5rem;font-weight:bold;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
	".resource_detail_information_item{display:grid;font-size:0.875rem}",
	".resource_detail_information_item_name{color:#004080}",
	".resource_detail_information_tag_list{align-self:center;height:1.125rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:0.75rem;}",
	".resource_detail_tag{box-sizing:border-box;display:inline-block;height:100%;margin-inline-end:0.25rem;border-radius:0.125rem;padding:0.125rem;background-color:#C0E0F0;overflow:hidden}",
	"@media all and (min-width:48rem){",
	"#resource_detail_information{height:8rem;grid-template-columns:8rem 1fr;grid-template-rows:1fr repeat(4,1.25rem);grid-template-areas:\"icon display\"\"icon media\"\"icon content\"\"icon author\"\"icon production\"}",
	"#resource_detail_information_icon{grid-area:icon}",
	".resource_detail_information_item{grid-template-columns:auto 1fr;gap:0.5rem}",
	"}",
	"@media all and (max-width:47.999rem){",
	"#resource_detail_information{grid-template-rows:8rem repeat(5,1fr);place-items:center}",
	".resource_detail_information_item{align-self:start;width:100%;place-items:center}",
	".resource_detail_tag{margin-inline:0.125rem}",
	"}",
	"#resource_detail_content.bs-loading{min-height:4rem}",
	"#resource_detail_content>details{margin-bottom:0.5rem}",
	"#resource_detail_content>details:last-of-type{margin-bottom:0}",
	"#resource_detail_content summary{border:none;background-color:#0080FF;color:#FFFFFF}",
	"#resource_detail_content summary>H2{display:inline;font-weight:normal;font-size:inherit}",
	".resource_detail_content_release>div{margin-bottom:1rem}",
	".resource_detail_content_release>div:last-of-type{margin-bottom:0}",
	".resource_detail_content_release_type{font-size:inherit}",
	".resource_detail_content_release_icon{display:inline-block;margin-inline-end:0.25rem;width:1.125rem;height:1.125rem;background-size:100%;vertical-align:sub}",
	".resource_detail_content_release_icon.bdnd{background-image:url(/images/third_party/icon/BaiduNetdisk.png)}",
	".resource_detail_content_release_icon.magnet{background-image:url(/images/third_party/icon/Magnet.svg)}"
].join("");
function buildResourceBaiduNetDisk(data, container) {
	const link = "https://pan.baidu.com/s/" + data.code, temp = [
		["H3", [["DIV", null, { class: "resource_detail_content_release_icon bdnd" }], "百度网盘"], { class: "resource_detail_content_release_type" }], ["HR"],
		"链接：", ["A", link, { href: link + "?pwd=" + data.password, target: "_blank" }]
	];
	if ("note" in data) temp.push(["BR"], "说明：", ["BR"], ...data.note);
	container.push(["DIV", temp]);
}
function buildResourceMagnet(data, container) {
	const link = "magnet:?xt=urn:btih:" + data.hash, temp = [
		["H3", [["DIV", null, { class: "resource_detail_content_release_icon magnet" }], "磁力链接"], { class: "resource_detail_content_release_type" }], ["HR"],
		"链接：", ["A", link, { href: link }]
	];
	if ("note" in data) temp.push(["BR"], "说明：", ["BR"], ...data.note);
	container.push(["DIV", temp]);
}
function buildRelease(data) {
	const temp = [];
	if ("bdnd" in data) buildResourceBaiduNetDisk(data.bdnd, temp);
	if ("magnet" in data) buildResourceMagnet(data.magnet, temp);
	return buildDetailsPart("资源", temp, true, "resource_detail_content_release");
}
function buildDetailsPart(title, data, opened = false, className = null) {
	data.unshift(["SUMMARY", [["H2", title]]]);
	const arrayHTML = ["DETAILS", data, { class: "bs-content" }], attributes = arrayHTML[2];
	if (className) attributes.class += " " + className;
	if (opened) attributes.open = "";
	return arrayHTML;
}
function displayDetails(data, showArea) {
	const arrayHTML = [];
	if ("introduction" in data) arrayHTML.push(buildDetailsPart("简介", data.introduction));
	if ("release" in data) arrayHTML.push(buildRelease(data.release));
	showArea.className = "";
	showArea.appendChild(decode(arrayHTML));
}
function showDetail(data) {
	const { documentFragment, nodes } = decodeAndGetNodes([
		detailStyle.cloneNode(true),
		["DIV", [
			["DIV", [
				["IMG", null, { id: "resource_detail_information_icon", src: data.icon, alt: "资源印象图" }],
				["H1", data.display, { id: "resource_detail_information_name" }],
				["DIV", [
					["SPAN", "媒体类型", { class: "resource_detail_information_item_name" }],
					"media" in data ? ["DIV", buildMediaTags(data.media, "resource_detail_tag"), { class: "resource_detail_information_tag_list" }] : "未知"
				], { class: "resource_detail_information_item" }],
				["DIV", [
					["SPAN", "内容类型", { class: "resource_detail_information_item_name" }],
					"content" in data ? ["DIV", buildContentTags(data.content, "resource_detail_tag"), { class: "resource_detail_information_tag_list" }] : "未知"
				], { class: "resource_detail_information_item" }],
				["DIV", [
					["SPAN", "主创作者", { class: "resource_detail_information_item_name" }],
					"artists" in data ? ["DIV", buildNameList(data.artists, "resource_detail_tag"), { class: "resource_detail_information_tag_list" }] : "未知"
				], { class: "resource_detail_information_item" }],
				["DIV", [
					["SPAN", "制作公司", { class: "resource_detail_information_item_name" }],
					"producer" in data ? ["DIV", buildNameList([data.producer], "resource_detail_tag"), { class: "resource_detail_information_tag_list" }] : "未知"
				], { class: "resource_detail_information_item" }]
			], { id: "resource_detail_information" }],
			["DIV", [], { id: "resource_detail_content", class: "bs-loading" }, "showArea"]
		], { id: "resource_detail" }]
	]), miniWindow = new MiniWindow(documentFragment, data.display, { size: { width: "62rem", height: "100%" } });
	const xhr = getJSON(
		`/json/resource/${data.id}.json`,
		function (response) { displayDetails(response, nodes.showArea) },
		false
	);
	miniWindow.onclosed = xhr.abort.bind(xhr);
}
export { showDetail }