import { load } from "/javascript/module/AJAX.mjs";
import { Enum } from "/javascript/module/Enum.mjs";
const TAB_LIST = new Enum(["home", "services", "resource"]),
	navigation = document.getElementById("navigation"),
	NAVIGATIONS = navigation.getElementsByClassName("navigation"),
	PAGE_BOX = document.getElementById("page_box"),
	title = document.getElementById("tab_title"),
	naviSwitch = document.getElementById("navigation_switch");
var lastLoad = { readyState: 4 }, currentTab = null, naviState = false;
function changeTab(tab) {
	if (!TAB_LIST.hasIndex(tab)) throw new Error("指定的页面不在页面列表中！");
	if (tab == currentTab) return;
	if (lastLoad.readyState != 4) lastLoad.abort();
	NAVIGATIONS[currentTab]?.classList.remove("current");
	lastLoad = load(`/page/${TAB_LIST.valueOf(tab)}.html`, PAGE_BOX, true, true);
	NAVIGATIONS[tab].classList.add("current");
	title.innerText = NAVIGATIONS[tab].innerText;
	switchNavigation(false);
	currentTab = tab;
}
for (let i = 0, l = NAVIGATIONS.length; i < l; ++i) NAVIGATIONS[i].addEventListener("click", function () { changeTab(i) }, { passive: true });
function respondHash() {
	const index = TAB_LIST.indexOf(location.hash.substring(1));
	changeTab(index == -1 ? 0 : index);
}
respondHash();
function switchNavigation(state = null) {
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