import { parseAndGetNodes as ArrayHTML } from "/javascript/module/ArrayHTML.mjs";
import { search, abortMission as abortEngine } from "/javascript/ResourceEngine.mjs";
import { buildMediaTags, buildContentTags } from "/javascript/ResourceInformation.mjs";
import { showDetail } from "/javascript/ResourceDetail.mjs";
class Field {
	boxFrame = document.getElementById("page-box-resource");
	showBox = document.getElementById("resource-show-box");
	showArea = document.getElementById("resource-show-area");
	searchInput = document.getElementById("resource-search-input");
	searchButton = document.getElementById("resource-search-button");
	searchState = document.getElementById("resource-search-state");
	totalPage = document.getElementById("resource-pagination-total");
	selectPage = document.getElementById("resource-pagination-select");
	previousPage = document.getElementById("resource-pagination-previous");
	nextPage = document.getElementById("resource-pagination-next");
	showData = [];
	currentPage = 0;
	searchSuspended = false;
	searchTimeoutId = null;
	searching = false;
	show(data) {
		const container = document.createDocumentFragment();
		for (let item of data) {
			let card = ArrayHTML([["div", [
				["div", null, item.icon ? { class: "resource-card-icon", style: `background-image:url("${item.icon}")` } : { class: "resource-card-icon none" }],
				["span", item.display, { class: "resource-card-name" }],
				["div", buildMediaTags(item.media, "resource-card-tag"), { class: "resource-card-media" }],
				["div", buildContentTags(item.content, "resource-card-tag"), { class: "resource-card-content" }],
				["button", "详细信息", { class: "resource-card-detail" }, "cardDetail"]
			], { class: "resource-card" }]]);
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