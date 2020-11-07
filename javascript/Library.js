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
			var board=this.parentNode.parentNode.getElementsByClassName("card_board")[0];
			var boardTitle=board.getElementsByClassName("card_board_title_text")[0];
			var boardContent=board.getElementsByClassName("card_board_content")[0];
			boardTitle.innerHTML="";
			boardTitle.removeAttribute("title");
			boardContent.innerHTML="";
			board.className="card_board";
			var data=this.boardData;
			if (typeof data.theme=="string") board.className+=data.theme;
			if (typeof data.title=="string") {
				boardTitle.appendChild(document.createTextNode(data.title));
				boardTitle.title=data.title;
			};
			boardContent.appendChild(data.content.cloneNode(true));
			board.style.left="130px";
		},
		"close":function(){this.parentNode.parentNode.style.left="100%"},
		"detail":function() {
			var container=document.createRange();
			container.selectNodeContents(this.parentNode.getElementsByClassName("card_board_content")[0]);
			window_board.display(container.cloneContents(),"详细信息");
		}
	};
	let show=function(ShowData) {
		var showBox=document.createDocumentFragment();
		for (let obj of ShowData) {
			let cardIconAttr={"class":"card_icon body_color"};
			if (typeof obj.icon=="string") {
				cardIconAttr.style="background-image:url(\""+obj.icon+"\")";
			} else cardIconAttr.class+=" card_icon_none";
			let cardName=obj.display;
			let cardType="？？？";
			switch (obj.type) {
				case "allinone":
					let allinone="合集（";
					for (let item of obj.AllInOne) {
						if (allinone!="合集（") allinone=allinone+"、";
						allinone=allinone+item;
					};
					cardType=allinone+"）";
					break;
				case "PC game":
					cardType="PC 游戏";
					break;
				case "game":
					cardType="游戏";
				default:
			};
			let template=[["DIV",[["DIV",null,cardIconAttr],["SPAN",cardName,{"class":"card_name","title":cardName}],["SPAN",cardType,{"class":"card_type","title":cardType}],["DIV",null,{"class":"card_link"},"cardLinks"],["DIV",[["DIV",[["DIV",[["DIV",null,{"class":"card_board_title_icon"}],["SPAN",null,{"class":"card_board_title_text"}]],{"class":"card_board_title"}],["DIV",null,{"class":"card_board_content"}],["BUTTON","详细信息",{"class":"card_board_detail"},"cardBoardDetail"],["BUTTON",null,{"class":"card_board_close"},"closeCardBoard"]],{"class":"card_board_frame"}]],{"class":"card_board"}]],{"class":"card","id":"CardID"+obj.ID}]];
			let card=ArrayHTML.decode(template,true);
			let cardLinks=card.getNodes.cardLinks;
			card.getNodes.closeCardBoard.addEventListener("click",Cardboard.close);
			card.getNodes.cardBoardDetail.addEventListener("click",Cardboard.detail);
			if (obj.resource.BDND) {
				let BDNDLink=obj.resource.BDND.link;
				let cardLinkBDNDTemplate=[["BUTTON",[["DIV",null,{"class":"card_link_button_icon"}],["SPAN",["百度网盘"],{"class":"card_link_button_text"}]],{"class":"card_link_button card_link_button_BDND"},"button"]];
				let cardLinkBDND=ArrayHTML.decode(cardLinkBDNDTemplate,true);
				let boardContentTemplate=[["span",["链接：",["a",BDNDLink,{"href":BDNDLink,"target":"_blank"}],["br"]]]];
				if (typeof obj.resource.BDND.password=="string") boardContentTemplate.push(["span","提取码："+obj.resource.BDND.password],["br"]);
				if (obj.resource.BDND.detail) {
					if (typeof obj.resource.BDND.detail.tips=="string") {
						let cardBoardDetailTips=["span",[obj.resource.BDND.detail.tips,["br"]],{"class":"CardBoardDetailTips"}];
						boardContentTemplate.push(cardBoardDetailTips);
					};
					if (Array.isArray(obj.resource.BDND.detail.content)) boardContentTemplate=boardContentTemplate.concat(obj.resource.BDND.detail.content);
				};
				boardContent=ArrayHTML.decode(boardContentTemplate);
				let cardLinkBDNDBoard={
					"theme":" card_board_BDND",
					"title":"百度网盘",
					"content":boardContent
				};
				let button=cardLinkBDND.getNodes.button;
				button.boardData=cardLinkBDNDBoard;
				button.addEventListener("click",Cardboard.show);
				cardLinks.appendChild(cardLinkBDND.DocumentFragment);
			};
			if (typeof obj.resource.Torrent!="undefined"&&obj.resource.Torrent!=null) {
				let cardLinkTorrentTemplate=[["BUTTON",[["DIV",null,{"class":"card_link_button_icon"}],["SPAN",["磁力链接"],{"class":"card_link_button_text"}]],{"class":"card_link_button card_link_button_Torrent"},"button"]];
				let cardLinkTorrent=ArrayHTML.decode(cardLinkTorrentTemplate,true);
				cardLinkTorrent.getNodes.button.addEventListener("click",function(){window.location.href=obj.resource.Torrent});
				cardLinks.appendChild(cardLinkTorrent.DocumentFragment);
			};
			showBox.appendChild(card.DocumentFragment);
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
				if (break_word.length>1) {
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
					for (let i=Data.length-1;i>-1;--i) {
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
		searchInput.addEventListener("keypress",function(event){if (event.keyCode==13) Search.manual()});
		searchButton.addEventListener("click",Search.manual);
		{
			let respond=function(){changePage(pageSelect.value)};
			pageSelect.addEventListener("keypress",function(event){if (event.keyCode==13) respond()});
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
