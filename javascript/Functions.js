//if (detectUA().mobile) window.location.href="/Mobile/";
window.onerror=function(message,source,line,col,error){import("/javascript/MiniWindow-module.js").then(mw=>mw.create(`文件：${source}\n行号：${line}\n列号：${col}\n错误信息：${error}`,"发生错误"))};
{
	let sheetList=["home_page","resource_library","information","about_us"];
	let currentSheet=null;
	let lastLoad={"readyState":4};
	function changeSheet(sheet) {
		movePointer(sheet*200-110);
		if (sheet!=currentSheet) {
			if (lastLoad.readyState!=4) lastLoad.abort();
			lastLoad=load("/html/"+sheetList[sheet-1]+".html",document.getElementById("page_box"),true,true);
			currentSheet=sheet;
		}
	}
}