var TotalPage=null;
var CurrentPage=null;

var ResourceLibrary=(function(){
	var libraryData=null;
	var pullState={
		"state":false,
		"callback":null
	};
	var Cardboard={
		"show":function() {
			var Board=this.parentNode.parentNode.getElementsByClassName("card_board")[0];
			var BoardTitle=Board.getElementsByClassName("card_board_title_text")[0];
			var BoardContent=Board.getElementsByClassName("card_board_content")[0];
			EmptyElement(BoardTitle);
			BoardTitle.removeAttribute("title");
			EmptyElement(BoardContent);
			Board.className="card_board";
			if (typeof this.Board.Theme=="string") Board.className+=this.Board.Theme;
			if (typeof this.Board.Title=="string") {
				BoardTitle.appendChild(document.createTextNode(this.Board.Title));
				BoardTitle.title=this.Board.Title;
			};
			BoardContent.appendChild(this.Board.Content.cloneNode(true));
			Board.style.left="130px";
		},
		"close":function(){this.parentNode.parentNode.style.left="100%"},
		"detail":function CardBoardDetail() {
			var Container=document.createRange();
			Container.selectNodeContents(this.parentNode.getElementsByClassName("card_board_content")[0]);
			window_board.display(Container.cloneContents(),"详细信息");
		}
	};
	function pullData(callback) {
		pullState.callback=callback;
		if (pullState.state) return false;
		pullState.state=true;
		getJSON("/json/resource.json",function(response) {
			libraryData=response;
			pullState.callback();
			pullState.state=false;
		})
	};
	function show(ShowData) {
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
				case "PC Game":
					var Node="PC 游戏";
					break;
			};
			CardType.appendChild(document.createTextNode(Node));
			CardType.title=Node;
			Card.appendChild(CardType);
			var CardLink=document.createElement("div");
			CardLink.className="card_link";
			if (obj.resource.BDND) {
				var CardLinkBDND=document.createElement("button");
				CardLinkBDND.className="card_link_button card_link_button_BDND";
				var CardLinkBDNDBoardContent=document.createDocumentFragment();
				let CardLinkBDNDBoardContentNode=document.createElement("p");
				CardLinkBDNDBoardContentNode.appendChild(document.createTextNode("链接："));
				let CardLinkBDNDBoardContentNodeA=document.createElement("a");
				CardLinkBDNDBoardContentNodeA.href=obj.resource.BDND.link;
				CardLinkBDNDBoardContentNodeA.target="_blank";
				CardLinkBDNDBoardContentNodeA.appendChild(document.createTextNode(obj.resource.BDND.link));
				CardLinkBDNDBoardContentNode.appendChild(CardLinkBDNDBoardContentNodeA);
				CardLinkBDNDBoardContent.appendChild(CardLinkBDNDBoardContentNode);
				CardLinkBDNDBoardContent.appendChild(document.createElement("br"));
				if (typeof obj.resource.BDND.password=="string") {
					let CardLinkBDNDBoardContentNode=document.createElement("p");
					CardLinkBDNDBoardContentNode.appendChild(document.createTextNode("提取码："+obj.resource.BDND.password));
					CardLinkBDNDBoardContent.appendChild(CardLinkBDNDBoardContentNode);
					CardLinkBDNDBoardContent.appendChild(document.createElement("br"));
				};
				if (obj.resource.BDND.detail) {
					let CardLinkBDNDBoardContentNode=document.createDocumentFragment();
					if (typeof obj.resource.BDND.detail.tips=="string") {
						let CardBoardDetailTips=document.createElement("p");
						CardBoardDetailTips.appendChild(document.createTextNode(obj.resource.BDND.detail.tips));
						CardBoardDetailTips.appendChild(document.createElement("br"));
						CardBoardDetailTips.className="CardBoardDetailTips";
						CardLinkBDNDBoardContentNode.appendChild(CardBoardDetailTips);
					};
					if (Array.isArray(obj.resource.BDND.detail.content)) CardLinkBDNDBoardContentNode.appendChild(HtmlArray.decoder(obj.resource.BDND.detail.content,"ID"+obj.ID));
					CardLinkBDNDBoardContent.appendChild(CardLinkBDNDBoardContentNode);
				};
				CardLinkBDND.Board={
					"Theme":" card_board_BDND",
					"Title":"百度网盘",
					"Content":CardLinkBDNDBoardContent
				};
				CardLinkBDND.addEventListener("click",Cardboard.show);
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
			CardBoardShowDetail.addEventListener("click",Cardboard.detail);
			CardBoardFrame.appendChild(CardBoardShowDetail);
			var CardBoardClose=document.createElement("button");
			CardBoardClose.className="card_board_close";
			CardBoardClose.addEventListener("click",Cardboard.close);
			CardBoardFrame.appendChild(CardBoardClose);
			CardBoard.appendChild(CardBoardFrame);
			Card.appendChild(CardBoard);
			ShowBox.appendChild(Card);
		};
		EmptyElement(document.getElementById("show_box"));
		document.getElementById("show_box").appendChild(ShowBox);
	};
	function overview() {
		if (libraryData==null) {
			pullData(overview);
		} else show(libraryData);
	};
	var Search=(function(){
		var wait=false;
		var timeoutID=null;
		function engine() {
			if (libraryData==null) {
				document.getElementById("library_search_bar_magnifier").className="pulling";
				pullData(engine);
				return false;
			};
			wait=false;
			var input=document.getElementById("library_search_bar_input").value;
			var ShowState=document.getElementById("library_search_bar_magnifier");
			if (input!="") {
				ShowState.className="searching";
				ShowState.clientTop;
				var Data=libraryData.slice();
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
					let resultc=new Array;
					for (let i=Data.length-1;i>-1;i--) {
						let name_match=false;
						for (let name of Data[i].name) {
							if (name.match(word)) {
								name_match=true;
								break;
							};
						};
						if (name_match||Data[i].display.match(word)) resultc=Data.splice(i,1).concat(resultc);
					};
					result=result.concat(resultc);
				};
			} else result=libraryData;
			ShowState.className="";
			show(result);
		};
		return {
			"auto":function() {
				if (wait!=true) {
					wait=true;
					document.getElementById("library_search_bar_magnifier").className="waiting";
					timeoutID=setTimeout(engine,1000);
				};
			},
			"manual":function() {
				clearTimeout(timeoutID);
				engine();
			}
		}
	})();
	return {
		"overview":overview,
		"show":show,
		"pull":pullData,
		"Search":Search,
	}
})();

(function() {//Beginning
	function Initial_view(self) {
		if (document.getElementById("show_box")) {
			ResourceLibrary.overview();
		} else setTimeout(function(){self(self)},100);
	};
	function Search_Initialize(self) {
		if (document.getElementById("library_search_bar")) {
			document.getElementById("library_search_bar_input").addEventListener("input",ResourceLibrary.Search.auto);
			document.getElementById("library_search_bar_input").addEventListener("keypress",function(){if (event.keyCode==13) ResourceLibrary.Search.manual()});
			document.getElementById("library_search_bar_search").addEventListener("click",ResourceLibrary.Search.manual);
		} else setTimeout(function(){self(self)},100);
	};
	Initial_view(Initial_view);
	Search_Initialize(Search_Initialize);
})();