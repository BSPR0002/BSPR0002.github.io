function moveTab(sheet) {
	document.getElementById("top_sheet_tab").style.left=(sheet-1)*4+"rem";
}

var ChangeSheet=(function(){
	var sheetList=["resource_library","information"];
	var currentSheet=null;
	var lastLoad={"readyState":4};
	return function(sheet){
		moveTab(sheet);
		if (sheet!=currentSheet) {
			if (lastLoad.readyState!=4) lastLoad.abort();
			lastLoad=load("/Mobile/html/"+sheetList[sheet-1]+".html",document.getElementById("page"),true,true);
			currentSheet=sheet;
		}
	};
})();
