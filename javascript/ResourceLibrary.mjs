import { parseAndGetNodes as ArrayHTML } from "/javascript/module/ArrayHTML.mjs";
import { search, abortMission as abortEngine } from "/javascript/ResourceEngine.mjs";
import { buildMediaTags, buildContentTags } from "/javascript/ResourceInformation.mjs";
import { showDetail } from "/javascript/ResourceDetail.mjs";
class Field {
	boxFrame = document.getElementById("page_box_resource");
	showBox = document.getElementById("resource_show_box");
	showArea = document.getElementById("resource_show_area");
	searchInput = document.getElementById("resource_search_input");
	searchButton = document.getElementById("resource_search_button");
	searchState = document.getElementById("resource_search_state");
	totalPage = document.getElementById("resource_pagination_total");
	selectPage = document.getElementById("resource_pagination_select");
	previousPage = document.getElementById("resource_pagination_previous");
	nextPage = document.getElementById("resource_pagination_next");
	showData = [];
	currentPage = 0;
	searchSuspended = false;
	searchTimeoutId = null;
	searching = false;
	show(data) {
		const container = document.createDocumentFragment();
		for (let item of data) {
			let card = ArrayHTML([["div", [
				["div", null, item.icon ? { class: "resource_card_icon", style: `background-image:url("${item.icon}")` } : { class: "resource_card_icon none" }],
				["span", item.display, { class: "resource_card_name" }],
				["div", buildMediaTags(item.media, "resource_card_tag"), { class: "resource_card_media" }],
				["div", buildContentTags(item.content, "resource_card_tag"), { class: "resource_card_content" }],
				["button", "详细信息", { class: "resource_card_detail" }, "cardDetail"]
			], { class: "resource_card" }]]);
			card.nodes.cardDetail.addEventListener("click", function () { showDetail(item) });
			container.appendChild(card.documentFragment);
		}
		this.showArea.innerHTML = "";
		this.showArea.appendChild(container);
	}
	buildInterface() {
		const pages = Math.ceil(this.showData.length / 10);
		if (pages) {
			this.showArea.className = "";
			this.changePage(1);
		} else {
			this.showArea.className = "empty";
			this.showArea.innerHTML = "";
		}
		this.totalPage.innerText = pages;
		this.showBox.className = pages > 1 ? "multiPage" : "";
	}
	async searchAction() {
		this.searching = true;
		this.searchState.className = "searching";
		this.showData = await search(this.searchInput.value);
		this.buildInterface();
		this.searchState.className = "";
		this.searching = false;
		this.searchSuspended = false;
	}
	searchAuto() {
		if (this.searching) return;
		if (this.searchSuspended) {
			clearTimeout(this.searchTimeoutId);
			this.searchTimeoutId = setTimeout(this.searchAction.bind(this), 1000);
			return
		}
		this.searchSuspended = true;
		this.searchState.className = "waiting";
		this.searchTimeoutId = setTimeout(this.searchAction.bind(this), 1000);
	}
	searchManual() {
		if (this.searching) return;
		clearTimeout(this.searchTimeoutId);
		this.searchAction();
	}
	changePage(page) {
		const { showData, selectPage } = this;
		page = parseInt(page);
		if (isNaN(page) || page < 1 || page > showData.length) {
			selectPage.value = this.currentPage;
			return
		}
		selectPage.value = this.currentPage = page;
		this.show(showData.slice((page - 1) * 10, page * 10));
	}
	toNextPage() { this.changePage(this.currentPage + 1) }
	toPreviousPage() { this.changePage(this.currentPage - 1) }
	respond() { this.changePage(this.selectPage.value) }
}
function mount() {
	const field = new Field, { boxFrame, searchInput, selectPage, searchManual, respond, toPreviousPage, toNextPage } = field;
	searchInput.addEventListener("input", field.searchAuto.bind(field));
	searchInput.addEventListener("keypress", function (event) { if (event.key == "Enter") field.searchManual() });
	field.searchButton.addEventListener("click", searchManual.bind(field));
	selectPage.addEventListener("keypress", function (event) { if (event.key == "Enter") field.respond() });
	selectPage.addEventListener("blur", respond.bind(field));
	field.previousPage.addEventListener("click", toPreviousPage.bind(field));
	field.nextPage.addEventListener("click", toNextPage.bind(field));
	const nodeWatcher = new MutationObserver(function () {
		if (document.body.contains(boxFrame)) return;
		abortEngine();
		nodeWatcher.disconnect();
	});
	nodeWatcher.observe(boxFrame.parentNode, { "childList": true });
	field.searchAction();
}
export { mount }