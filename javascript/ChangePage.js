function ChangePage(page) {
	$("#PageBox").load(page);
}

//加载主页

$(document).ready(function() {
	$("#PageBox").load("/html/home_page.html");
});