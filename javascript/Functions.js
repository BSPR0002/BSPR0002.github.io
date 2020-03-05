var sheet="home_page";

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

function ChangePage(page) {
	if (page!=sheet) {
		Load("/html/"+page+".html",document.getElementById("page_box"));
		sheet=page;
	}
}

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
	"display":function(content,title,boardSize) {
		var size=Object.assign({},boardSize);
		var board=document.getElementById("window_board");
		var board_title=document.getElementById("window_board_title");
		var board_content=document.getElementById("window_board_content");
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
				board_content.appendChild(content);
		};
		board.removeAttribute("style");
		if (typeof size.width!="undefined") board.style.width=size.width;
		if (typeof size.height!="undefined") board.style.width=size.height;
		window_board.show();
	}
}

