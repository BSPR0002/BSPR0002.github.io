var LibraryData=null;
var TotalPage=null;
var CurrentPage=null;

function PullLibrary(callback) {
	getJSON("/json/resource.json",function(resp) {
		LibraryData=resp;
		callback();
	})
}

function ShowLibrary(ShowData) {
	var ShowBox=document.createDocumentFragment();
	for (let obj of ShowData) {
		var Card=document.createElement("div");
		Card.className="card";
		Card.id="CardID"+obj.ID;
		var CardIcon=document.createElement("div");
		CardIcon.className="card_icon body_color";
		if (typeof obj.icon=="string") {
			CardIcon.style.backgroundImage="url("+obj.icon+")";
		} else CardIcon.className+=" card_icon_none";
		Card.appendChild(CardIcon);
		var CardName=document.createElement("p");
		CardName.className="card_name";
		CardName.appendChild(document.createTextNode(obj.display));
		CardName.title=obj.display;
		Card.appendChild(CardName);
		var CardType=document.createElement("p");
		CardType.className="card_type";
		switch (obj.type) {
			case "allinone":
				var allinone="合集（";
				for (let item of obj.AllInOne) {
					if (allinone!="合集（") allinone=allinone+"、";
					allinone=allinone+item;
				};
				var Node=allinone+"）";
				break;
		};
		CardType.appendChild(document.createTextNode(Node));
		CardType.title=Node;
		Card.appendChild(CardType);
		var CardLink=document.createElement("div");
		CardLink.className="card_link";
		if (typeof obj.resource.BDND=="object"&&obj.resource.BDND!=null) {
			var CardLinkBDND=document.createElement("button");
			CardLinkBDND.href="javascript:void(0)";
			CardLinkBDND.className="card_link_button card_link_button_BDND";
			var CardLinkBDNDBoardContent=document.createDocumentFragment();
			var CardLinkBDNDBoardContentNode=document.createElement("p");
			CardLinkBDNDBoardContentNode.appendChild(document.createTextNode("链接："));
			var CardLinkBDNDBoardContentNodeA=document.createElement("a");
			CardLinkBDNDBoardContentNodeA.href=obj.resource.BDND.link;
			CardLinkBDNDBoardContentNodeA.target="_blank";
			CardLinkBDNDBoardContentNodeA.appendChild(document.createTextNode(obj.resource.BDND.link));
			CardLinkBDNDBoardContentNode.appendChild(CardLinkBDNDBoardContentNodeA);
			CardLinkBDNDBoardContent.appendChild(CardLinkBDNDBoardContentNode);
			CardLinkBDNDBoardContent.appendChild(document.createElement("br"));
			if (typeof obj.resource.BDND.password=="string") {
				var CardLinkBDNDBoardContentNode=document.createElement("p");
				CardLinkBDNDBoardContentNode.appendChild(document.createTextNode("提取码："+obj.resource.BDND.password));
				CardLinkBDNDBoardContent.appendChild(CardLinkBDNDBoardContentNode);
				CardLinkBDNDBoardContent.appendChild(document.createElement("br"));
			};
			if (typeof obj.resource.BDND.detail!="undefined"&&obj.resource.BDND.detail!=null) {
				CardLinkBDNDBoardContent.appendChild(HADecoder(obj.resource.BDND.detail,"ID"+obj.ID));
			};
			CardLinkBDND.Board={
				"Theme":" card_board_BDND",
				"Title":"百度网盘",
				"Content":CardLinkBDNDBoardContent
			};
			CardLinkBDND.addEventListener("click",function() {ShowCardBoard(this)});
			var CardLinkBDNDIcon=document.createElement("div");
			CardLinkBDNDIcon.className="card_link_button_icon";
			CardLinkBDND.appendChild(CardLinkBDNDIcon);
			var CardLinkBDNDText=document.createElement("p");
			CardLinkBDNDText.className="card_link_button_text";
			CardLinkBDNDText.appendChild(document.createTextNode("百度网盘"));
			CardLinkBDND.appendChild(CardLinkBDNDText);
			CardLink.appendChild(CardLinkBDND);
		};
		if (typeof obj.resource.Torrent!="undefined"&&obj.resource.Torrent!=null) {
			var CardLinkTorrent=document.createElement("button");
			CardLinkTorrent.addEventListener("click",function(){window.location.href=obj.resource.Torrent});
			CardLinkTorrent.className="card_link_button card_link_button_Torrent";
			var CardLinkTorrentIcon=document.createElement("div");
			CardLinkTorrentIcon.className="card_link_button_icon";
			CardLinkTorrent.appendChild(CardLinkTorrentIcon);
			var CardLinkTorrentText=document.createElement("p");
			CardLinkTorrentText.className="card_link_button_text";
			CardLinkTorrentText.appendChild(document.createTextNode("磁力链接"));
			CardLinkTorrent.appendChild(CardLinkTorrentText);
			CardLink.appendChild(CardLinkTorrent);
		};
		Card.appendChild(CardLink);
		var CardBoard=document.createElement("div");
		CardBoard.className="card_board";
		var CardBoardFrame=document.createElement("div");
		CardBoardFrame.className="card_board_frame";
		var CardBoardTitle=document.createElement("div");
		CardBoardTitle.className="card_board_title";
		var CardBoardTitleIcon=document.createElement("div");
		CardBoardTitleIcon.className="card_board_title_icon";
		CardBoardTitle.appendChild(CardBoardTitleIcon);
		var CardBoardTitleText=document.createElement("p");
		CardBoardTitleText.className="card_board_title_text";
		CardBoardTitle.appendChild(CardBoardTitleText);
		CardBoardFrame.appendChild(CardBoardTitle);
		var CardBoardContent=document.createElement("div");
		CardBoardContent.className="card_board_content";
		CardBoardFrame.appendChild(CardBoardContent);
		var CardBoardShowDetail=document.createElement("button");
		CardBoardShowDetail.className="card_board_detail";
		CardBoardShowDetail.appendChild(document.createTextNode("详细信息"));
		CardBoardShowDetail.addEventListener("click",function() {CardBoardDetail(this)});
		CardBoardFrame.appendChild(CardBoardShowDetail);
		var CardBoardClose=document.createElement("button");
		CardBoardClose.className="card_board_close";
		CardBoardClose.href="javascript:void(0)";
		CardBoardClose.addEventListener("click",function() {CloseCardBoard(this)});
		CardBoardFrame.appendChild(CardBoardClose);
		CardBoard.appendChild(CardBoardFrame);
		Card.appendChild(CardBoard);
		ShowBox.appendChild(Card);
	};
	EmptyElement(document.getElementById("show_box"));
	document.getElementById("show_box").appendChild(ShowBox);
}

function OverView() {
	if (LibraryData==null) {
		PullLibrary(OverView);
	} else ShowLibrary(LibraryData);
}

function ShowCardBoard(Node) {
	var Board=Node.parentNode.parentNode.getElementsByClassName("card_board")[0];
	var BoardTitle=Board.getElementsByClassName("card_board_title_text")[0];
	var BoardContent=Board.getElementsByClassName("card_board_content")[0];
	EmptyElement(BoardTitle);
	BoardTitle.removeAttribute("title");
	EmptyElement(BoardContent);
	Board.className="card_board";
	if (typeof Node.Board.Theme=="string") Board.className+=Node.Board.Theme;
	if (typeof Node.Board.Title=="string") {
		BoardTitle.appendChild(document.createTextNode(Node.Board.Title));
		BoardTitle.title=Node.Board.Title;
	};
	BoardContent.appendChild(Node.Board.Content.cloneNode(true));
	Board.style.left="130px";
}

function CloseCardBoard(Node) {
	Node.parentNode.parentNode.style.left="100%";
}

function CardBoardDetail(Node) {
	var Container=document.createRange();
	Container.selectNodeContents(Node.parentNode.getElementsByClassName("card_board_content")[0]);
	window_board.display(Container.cloneContents(),"详细信息");
}

var SearchLibrary={
	"engine":function() {
		if (LibraryData==null) {
			PullLibrary(SearchLibrary.engine);
			return false;
		};
		SearchLibrary.wait=false;
		var input=document.getElementById("library_search_bar_input").value;
		if (input!="") {
			var Data=LibraryData.slice();
			keyword=input.trim();
			var match_word=new Array;
			match_word.push(RegExp(keyword,"i"));
			var break_word=keyword.split(" ");
			if (break_word.length!=1) {
				let duplicate_removal=new Array;
				for (let word of break_word) {
					if (duplicate_removal.indexOf(word)==-1&&word!="") {
						duplicate_removal.push(word);
						match_word.push(RegExp(word,"i"));
					};
				};
			};
			var result=new Array;
			for (let word of match_word) {
				for (let i=Data.length-1;i>-1;i--) {
					let name_match=false;
					for (let name of Data[i].name) {
						if (name.match(word)) {
							name_match=true;
							break;
						};
					};
					if (name_match||Data[i].display.match(word)) result=Data.splice(i,1).concat(result);
				};
			};
		} else result=LibraryData;
		ShowLibrary(result);
	},
	"wait":false,
	"auto":function() {
		if (SearchLibrary.wait!=true) {
			SearchLibrary.wait=true;
			SearchLibrary.timeoutID=setTimeout(SearchLibrary.engine,1000);
		};
	},
	"manual":function() {
		clearTimeout(SearchLibrary.timeoutID);
		SearchLibrary.engine();
	},
	"timeoutID":null
};

(function() { //Beginning
	var Initial_view=function(self) {
		if (document.getElementById("show_box")) {
			OverView();
		} else setTimeout(function(){self(self)},100);
	};
	var Search_Initialize=function(self) {
		if (document.getElementById("library_search_bar")) {
			document.getElementById("library_search_bar_input").addEventListener("input",SearchLibrary.auto);
			document.getElementById("library_search_bar_input").addEventListener("keypress",function() {if (event.keyCode==13) SearchLibrary.manual()});
			document.getElementById("library_search_bar_search").addEventListener("click",SearchLibrary.manual);
		} else setTimeout(function(){self(self)},100);
	};
	Initial_view(Initial_view);
	Search_Initialize(Search_Initialize);
})();