if (detectUA().Mobile) window.location.href="/Mobile/";

{
	let sheetList=["home_page","resource_library","information","about_us"];
	let currentSheet=null;
	let lastLoad={"readyState":4};
	function changeSheet(sheet) {
		movePointer(sheet*200-110);
		if (sheet!=currentSheet) {
			if (lastLoad.readyState!=4) lastLoad.abort();
			lastLoad=Load("/html/"+sheetList[sheet-1]+".html",document.getElementById("page_box"),true,true);
			currentSheet=sheet;
		}
	}
}
