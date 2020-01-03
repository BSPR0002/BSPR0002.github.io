function testfunc2(){
	$("#targetdiv").load("/html/test_page.html");
}

function PullLibrary(library) {
	$.getJSON("/json/"+library+".json",function(resp) {
		LibraryData=resp;
	})
}