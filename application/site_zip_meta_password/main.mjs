import "/javascript/module/user_select_none_fix.mjs";
import "/javascript/module/verbatim_user_copy.mjs";
import "./page/read_data/page.mjs";
import "./page/append_data/page.mjs";

const tabs = Array.from(document.getElementsByClassName("tab")),
	pages = Array.from(document.getElementsByClassName("page"));

var currentTab = 0;

function changeTab(i) {
	if (i == currentTab) return;
	tabs[currentTab].className = "tab";
	pages[currentTab].className = "page";
	tabs[i].className = "tab current";
	pages[i].className = "page current";
	currentTab = i;
}

for (let i = 0, l = tabs.length; i < l; ++i)
	tabs[i].addEventListener("click", function () { changeTab(i) });

document.getElementById("main").className = "";