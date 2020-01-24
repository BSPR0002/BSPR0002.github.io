var sheet="home_page";

document.addEventListener("DOMContentLoaded",function() {
	Load("/html/home_page.html",document.getElementById("page_box"));
});

function ChangePage(page) {
	if (page!=sheet) {
		Load("/html/"+page+".html",document.getElementById("page_box"));
		sheet=page;
	}
}