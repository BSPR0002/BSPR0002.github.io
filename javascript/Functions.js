//if (DetectUA().Mobile) window.location.href="/Mobile/";

function WakeHoverPointer() {
	document.getElementById("nav_hover_pointer").style.height="10px";
}

function MoveHoverPointer(pst) {
	document.getElementById("nav_hover_pointer").style.left=pst+"px";
}

function HideHoverPointer() {
	document.getElementById("nav_hover_pointer").style.height="0";
}

function MovePointer(pst) {
	document.getElementById("nav_pointer").style.left=pst+"px";
}

var ChangePage=(function(){
	var SheetList=["home_page","resource_library","projects","about_us"];
	var currentSheet=null;
	var lastLoad={"readyState":4};
	return function(sheet){
		MovePointer(sheet*200-110);
		if (sheet!=currentSheet) {
			if (lastLoad.readyState!=4) lastLoad.abort();
			lastLoad=Load("/html/"+SheetList[sheet-1]+".html",document.getElementById("page_box"),true,true);
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
	"display":function(content,title,NoManualClose,boardSize={}) {
		if (typeof boardSize!="object") {
			console.warn("无法接收参数 boardSize ！\n",boardSize);
			boardSize={};
		};
		var board=document.getElementById("window_board");
		var board_title=document.getElementById("window_board_title");
		var board_close=document.getElementById("window_board_close");
		var board_content=document.getElementById("window_board_content");
		board.style.width=boardSize.width?boardSize.width:null;
		board.style.height=boardSize.height?boardSize.height:null;
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
		window_board.show();
	}
};