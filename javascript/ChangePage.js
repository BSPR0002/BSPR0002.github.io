var sheet="home_page";

document.addEventListener("DOMContentLoaded",function() {
	$("#PageBox").load("/html/resource_library.html");
});

function ChangePage(page) {
	if (page!=sheet) {
		$("#PageBox").load("/html/"+page+".html");
		sheet=page;
	}
}