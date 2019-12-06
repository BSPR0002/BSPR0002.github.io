var sheet="home_page"

document.addEventListener("DOMContentLoaded",function() {
	$("#PageBox").load("/html/home_page.html");
});

function ChangePage(page) {
	if (page!=sheet) {
		$("#PageBox").load("/html/"+page+".html");
		sheet=page;
	}
}