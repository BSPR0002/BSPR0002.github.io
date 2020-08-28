{
	let libraryBox=null;
	let searchInput=null;
	let searchButton=null;
	let searchIcon=null;
	let pagesDisplay=null;
	let pageSelect=null;
	let nextPage=null;
	let previousPage=null;
	let showArea=null;
	let libraryData=null;
	let showData=null;
	let totalPage=null;
	let currentPage=null;
	let pulling={
		"state":false,
		"operator":null,
		"xhr":null
	};
	let pullData=function(callback) {
		if (pulling.state) {pulling.operator.then(callback)} else {
			pulling.state=true;
			let operator=new Promise(function(resolve,reject){
				pulling.xhr=AJAX({
					"url":"/json/resource.json",
					"type":"json","cache":false,
					"success":function(data){resolve(data)},
					"fail":function(){reject(false)},
					"done":function(){
						pulling.state=false;
						pulling.xhr=pulling.operator=null
					}
				})
			});
			operator.then(callback);
			pulling.operator=operator;
		}
		return pulling.operator
	};
	let spliceData=function(data) {
		if (!(data instanceof Array)) throw new Error("Library exception: Cannot splice data, argument 'data' is not an Array.");
		var temp=data.concat();
		var fragments=[];
		do {fragments.push(temp.splice(0,10))} while (temp.length);
		return fragments
	};
	let Cardboard={
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
	let show=function(ShowData) {
		var showBox=document.createDocumentFragment();
		for (let obj of ShowData) {
			let Card=document.createElement("div");
			Card.className="card";
			Card.id="CardID"+obj.ID;
			let CardIcon=document.createElement("div");
			CardIcon.className="card_icon body_color";
			if (typeof obj.icon=="string") {
				CardIcon.style.backgroundImage="url("+obj.icon+")";
			} else CardIcon.className+=" card_icon_none";
			Card.appendChild(CardIcon);
			let CardName=document.createElement("p");
			CardName.className="card_name";
			CardName.appendChild(document.createTextNode(obj.display));
			CardName.title=obj.display;
			Card.appendChild(CardName);
			let CardType=document.createElement("p");
			CardType.className="card_type";
			let typeText="？？？";
			switch (obj.type) {
				case "allinone":
					let allinone="合集（";
					for (let item of obj.AllInOne) {
						if (allinone!="合集（") allinone=allinone+"、";
						allinone=allinone+item;
					};
					typeText=allinone+"）";
					break;
				case "PC game":
					typeText="PC 游戏";
					break;
				case "game":
					typeText="游戏";
				default:
			};
			CardType.appendChild(document.createTextNode(typeText));
			CardType.title=typeText;
			Card.appendChild(CardType);
			let CardLink=document.createElement("div");
			CardLink.className="card_link";
			if (obj.resource.BDND) {
				let CardLinkBDND=document.createElement("button");
				CardLinkBDND.className="card_link_button card_link_button_BDND";
				let CardLinkBDNDBoardContent=document.createDocumentFragment();
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
					if (Array.isArray(obj.resource.BDND.detail.content)) CardLinkBDNDBoardContentNode.appendChild(ArrayHtml.decode(obj.resource.BDND.detail.content,"ID"+obj.ID));
					CardLinkBDNDBoardContent.appendChild(CardLinkBDNDBoardContentNode);
				};
				CardLinkBDND.Board={
					"Theme":" card_board_BDND",
					"Title":"百度网盘",
					"Content":CardLinkBDNDBoardContent
				};
				CardLinkBDND.addEventListener("click",Cardboard.show);
				let CardLinkBDNDIcon=document.createElement("div");
				CardLinkBDNDIcon.className="card_link_button_icon";
				CardLinkBDND.appendChild(CardLinkBDNDIcon);
				let CardLinkBDNDText=document.createElement("p");
				CardLinkBDNDText.className="card_link_button_text";
				CardLinkBDNDText.appendChild(document.createTextNode("百度网盘"));
				CardLinkBDND.appendChild(CardLinkBDNDText);
				CardLink.appendChild(CardLinkBDND);
			};
			if (typeof obj.resource.Torrent!="undefined"&&obj.resource.Torrent!=null) {
				let CardLinkTorrent=document.createElement("button");
				CardLinkTorrent.addEventListener("click",function(){window.location.href=obj.resource.Torrent});
				CardLinkTorrent.className="card_link_button card_link_button_Torrent";
				let CardLinkTorrentIcon=document.createElement("div");
				CardLinkTorrentIcon.className="card_link_button_icon";
				CardLinkTorrent.appendChild(CardLinkTorrentIcon);
				let CardLinkTorrentText=document.createElement("p");
				CardLinkTorrentText.className="card_link_button_text";
				CardLinkTorrentText.appendChild(document.createTextNode("磁力链接"));
				CardLinkTorrent.appendChild(CardLinkTorrentText);
				CardLink.appendChild(CardLinkTorrent);
			};
			Card.appendChild(CardLink);
			let CardBoard=document.createElement("div");
			CardBoard.className="card_board";
			let CardBoardFrame=document.createElement("div");
			CardBoardFrame.className="card_board_frame";
			let CardBoardTitle=document.createElement("div");
			CardBoardTitle.className="card_board_title";
			let CardBoardTitleIcon=document.createElement("div");
			CardBoardTitleIcon.className="card_board_title_icon";
			CardBoardTitle.appendChild(CardBoardTitleIcon);
			let CardBoardTitleText=document.createElement("p");
			CardBoardTitleText.className="card_board_title_text";
			CardBoardTitle.appendChild(CardBoardTitleText);
			CardBoardFrame.appendChild(CardBoardTitle);
			let CardBoardContent=document.createElement("div");
			CardBoardContent.className="card_board_content";
			CardBoardFrame.appendChild(CardBoardContent);
			let CardBoardShowDetail=document.createElement("button");
			CardBoardShowDetail.className="card_board_detail";
			CardBoardShowDetail.appendChild(document.createTextNode("详细信息"));
			CardBoardShowDetail.addEventListener("click",Cardboard.detail);
			CardBoardFrame.appendChild(CardBoardShowDetail);
			let CardBoardClose=document.createElement("button");
			CardBoardClose.className="card_board_close";
			CardBoardClose.addEventListener("click",Cardboard.close);
			CardBoardFrame.appendChild(CardBoardClose);
			CardBoard.appendChild(CardBoardFrame);
			Card.appendChild(CardBoard);
			showBox.appendChild(Card);
		};
		showArea.innerHTML="";
		showArea.appendChild(showBox);
	}
	let loading={
		state:false,
		callback:null
	};
	let load=function(callback=null) {
		loading.callback=callback;
		if (loading.state) return;
		loading.state=true;
		pullData(function(data){
			let callback=loading.callback;
			loading.state=false;
			loading.callback=null;
			if (!data) return;
			libraryData=data;
			if (typeof callback=="function") return callback(data);
			setShowData(spliceData(data));
			changePage(1)
		})
	};
	let setShowData=function(data) {
		libraryBox.className=(pagesDisplay.innerText=totalPage=data.length)>1?"pagination":"no-pagination";
		pageSelect.max=totalPage;
		showData=data;
	};
	let changePage=function(page) {
		page=parseInt(page);
		if (isNaN(page)||page<1||page>totalPage) {
			pageSelect.value=currentPage;
			return
		}
		pageSelect.value=currentPage=page;
		show(showData[page-1])
	};
	let toNextPage=function(){changePage(currentPage+1)};
	let toPreviousPage=function(){changePage(currentPage-1)};
	let Search=(function(){
		var wait=false;
		var timeoutID=null;
		function engine() {
			if (libraryData==null) {
				searchIcon.className="loading";
				load(engine);
				return;
			};
			wait=false;
			var input=searchInput.value;
			var ShowState=searchIcon;
			if (input!="") {
				ShowState.className="searching";
				ShowState.clientTop;
				var Data=libraryData.slice();
				keyword=input.trim();
				var match_word=[];
				match_word.push(RegExp(keyword,"i"));
				var break_word=keyword.split(" ");
				if (break_word.length!=1) {
					let duplicate_removal=[];
					for (let word of break_word) {
						if (duplicate_removal.indexOf(word)==-1&&word!="") {
							duplicate_removal.push(word);
							match_word.push(RegExp(word,"i"));
						};
					};
				};
				var result=[];
				for (let word of match_word) {
					let resultc=[];
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
			setShowData(spliceData(result));
			changePage(1)
		};
		return {
			"auto":function() {
				if (wait!=true) {
					wait=true;
					searchIcon.className="waiting";
					timeoutID=setTimeout(engine,1000);
				};
			},
			"manual":function() {
				clearTimeout(timeoutID);
				engine();
			}
		}
	})();
	{
		libraryBox=document.getElementById("library_box_frame");
		searchInput=document.getElementById("library_search_bar_input");
		searchButton=document.getElementById("library_search_bar_search");
		searchIcon=document.getElementById("library_search_bar_magnifier");
		pagesDisplay=document.getElementById("library_pagination_total");
		pageSelect=document.getElementById("library_pagination_input");
		nextPage=document.getElementById("library_pagination_next");
		previousPage=document.getElementById("library_pagination_previous");
		showArea=document.getElementById("library_show_box");
		searchInput.addEventListener("input",Search.auto);
		searchInput.addEventListener("keypress",function(){if (event.keyCode==13) Search.manual()});
		searchButton.addEventListener("click",Search.manual);
		{
			let respond=function(){changePage(pageSelect.value)};
			pageSelect.addEventListener("keypress",function(){if (event.keyCode==13) respond()});
			pageSelect.addEventListener("blur",respond);
		}
		previousPage.addEventListener("click",toPreviousPage);
		nextPage.addEventListener("click",toNextPage);
	}
	let nodeWatcher=new MutationObserver(function(){
		if (!document.body.contains(libraryBox)) {
			if (pulling.xhr) pulling.xhr.abort();
			nodeWatcher.disconnect()
		}
	});
	nodeWatcher.observe(libraryBox.parentNode,{"childList":true});
	load()
}
