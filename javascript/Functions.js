//if (detectUA().mobile) window.location.href="/Mobile/";
window.onerror=function(message,source,line,col,error){import("/javascript/MiniWindow.mjs").then(mw=>mw.create(`文件：${source}\n行号：${line}\n列号：${col}\n错误信息：${error}`,"发生错误"))};
{
	let sheetList=["home_page","resource_library","information"];
	let currentSheet=null;
	let lastLoad={"readyState":4};
	function changeSheet(sheet) {
		movePointer(sheet);
		if (sheet!=currentSheet) {
			if (lastLoad.readyState!=4) lastLoad.abort();
			lastLoad=load("/html/"+sheetList[sheet]+".html",document.getElementById("page_box"),true,true);
			currentSheet=sheet;
		}
	}
}