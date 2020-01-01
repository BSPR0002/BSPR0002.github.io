function testfunc(library,page) {
	$.getJSON("/json/"+library+".json",function(data) {
		console.log(data.ID00000001.ID);
	})
}