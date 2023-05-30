import { load } from "/javascript/module/AJAX.mjs";
import { Enum } from "/javascript/module/Enum.mjs";
const TAB_LIST = new Enum(["home", "services", "resource"]),
	navigation = document.getElementById("navigation"),
	NAVIGATIONS = navigation.getElementsByClassName("navigation"),
	PAGE_BOX = document.getElementById("page_box"),
	title = document.getElementById("tab_title"),
	naviSwitch = document.getElementById("navigation_switch");
var currentTab = NAVIGATIONS[0], naviState = false, lastLoad;
function currentSuccess() {
	currentTab.className = "navigation current";
	naviSwitch.classList.remove("loading");
}
function currentFail() {
	currentTab.className = "navigation current failed";
	naviSwitch.classList.replace("loading", "failed");
	lastLoad = undefined;
}
function changeTab(tab) {
	if (!TAB_LIST.hasIndex(tab)) throw new Error("指定的页面不在页面列表中！");
	const newTab = NAVIGATIONS[tab];
	if (newTab == currentTab) {
		if (lastLoad) return;
	} else {
		lastLoad?.abort();
		currentTab.className = "navigation";
	}
	newTab.className = "navigation current loading";
	naviSwitch.classList.remove("failed");
	naviSwitch.classList.add("loading");
	lastLoad = load(`/page/${TAB_LIST.valueOf(tab)}.html`, PAGE_BOX, true, true, currentSuccess, currentFail);
	title.innerText = newTab.innerText;
	currentTab = newTab;
}
for (let i = 0, l = NAVIGATIONS.length; i < l; ++i) NAVIGATIONS[i].addEventListener("click", function () { changeTab(i); switchNavigation(false) }, { passive: true });
function respondHash() {
	const index = TAB_LIST.indexOf(location.hash.substring(1));
	changeTab(index == -1 ? 0 : index);
}
respondHash();
function switchNavigation(state = undefined) {
	naviState = typeof state == "boolean" ? state : !naviState;
	naviSwitch.title = `${naviState ? "收起" : "展开"}导航`;
	naviSwitch.classList[naviState ? "add" : "remove"]("on");
	navigation.classList[naviState ? "add" : "remove"]("open");
}
naviSwitch.addEventListener("click", switchNavigation, { passive: true });
window.addEventListener("hashchange", respondHash, { passive: true });
export { TAB_LIST as tabList, changeTab };
//加载后任务
window.addEventListener("load", async function () { (await import("/javascript/News.mjs")).notice() }, { once: true, passive: true });