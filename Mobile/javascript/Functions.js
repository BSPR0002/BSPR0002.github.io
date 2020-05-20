function MoveTab(sheet) {
	document.getElementById("top_sheet_tab").style.left=(sheet-1)*4+"rem";
}

var ChangeSheet=(function(){
	var SheetList=["resource_library","information"];
	var currentSheet=null;
	var lastLoad={"readyState":4};
	return function(sheet){
		MoveTab(sheet);
		if (sheet!=currentSheet) {
			if (lastLoad.readyState!=4) lastLoad.abort();
			lastLoad=Load("/Mobile/html/"+SheetList[sheet-1]+".html",document.getElementById("page"),true,true);
			currentSheet=sheet;
		}
	};
})();

var window_board={
	"show":function() {
		var board=document.getElementById("window_board_layer");
		board.style.display="flex";
		board.clientTop;
		board.style.opacity="1";
	},
	"hide":function() {
		var board=document.getElementById("window_board_layer");
		board.addEventListener("transitionend",function(){
			board.style.display="none";
		},{"once":true});
		board.style.opacity="0";
	},
	"display":function(content,title,NoManualClose,boardSize) {
		var size={};
		try {Object.assign(size,boardSize)} catch(error) {console.warn("无法接收参数 boardSize ！\n",boardSize)};
		var board=document.getElementById("window_board");
		var board_title=document.getElementById("window_board_title");
		var board_close=document.getElementById("window_board_close");
		var board_content=document.getElementById("window_board_content");
		if (NoManualClose===true) {board_close.style.display="none"} else {board_close.style.display="block"};
		if (typeof title=="string") {
			board_title.innerText=title;
		} else {
			board_title.innerText="提示";
		};
		EmptyElement(board_content);
		switch (typeof content) {
			case "string":
				board_content.innerText=content;
				break;
			case "object":
				if (content instanceof Node) {
					board_content.appendChild(content);
					break;
				};
			default:
				throw new TypeError("传入的内容不为字符串或 HTML 节点。");
		};
		board.removeAttribute("style");
		if (typeof size.width!="undefined") board.style.width=size.width;
		if (typeof size.height!="undefined") board.style.width=size.height;
		window_board.show();
	}
}