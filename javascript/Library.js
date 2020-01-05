var LibraryData=null;
var ShowData=null;
var TotalPage=null;
var CurrentPage=null;

function PullLibrary(callback) {
	$.getJSON("/json/resource.json",function(resp) {
		LibraryData=resp;
		callback();
	})
}

function OverView() {
	if (LibraryData==null) {
		PullLibrary(OverView);
	} else {
		ShowData=LibraryData;
		Show();
	};
}

function Show() {
	$("#show_box").empty();
	$.each(ShowData,function(i,obj) {
		var Card=document.createElement("div");
		Card.className="card";
		Card.id="CardID"+obj.ID;
		var CardIcon=document.createElement("img");
		CardIcon.className="card_icon";
		CardIcon.src=obj.icon;
		Card.appendChild(CardIcon);
		var CardName=document.createElement("p");
		CardName.className="card_name";
		CardName.appendChild(document.createTextNode(obj.display));
		Card.appendChild(CardName);
		var CardType=document.createElement("p");
		CardType.className="card_type";
		switch (obj.type) {
			case "allinone":
			var allinone="合集（";
			$.each(obj.AllInOne,function(i,val) {
				if (allinone!="合集（") allinone=allinone+"、";
				allinone=allinone+val;
			})
			var Node=allinone+"）";
			break;
		}
		CardType.appendChild(document.createTextNode(Node));
		Card.appendChild(CardType);
		var CardLink=document.createElement("div");
		CardLink.className="card_link";
		if (obj.resource.BDND!=null) {
			var CardLinkBDND=document.createElement("a");
			CardLinkBDND.href="javascript:void(0)";
			CardLinkBDND.className="card_link_button card_link_button_BDND";
			CardLinkBDND.BoardTheme="card_board card_board_BDND";
			CardLinkBDND.BoardTitleIcon="card_board_title_icon card_board_title_icon_BDND";
			CardLinkBDND.BoardTitle="百度网盘";
			var CardLinkBDNDBoardContent=document.createElement("div");
			CardLinkBDNDBoardContent.className="card_board_content";
			var CardLinkBDNDBoardContentNode=document.createElement("p");
			CardLinkBDNDBoardContentNode.appendChild(document.createTextNode("链接："));
			var CardLinkBDNDBoardContentNodeA=document.createElement("a");
			CardLinkBDNDBoardContentNodeA.href=obj.resource.BDND.link;
			CardLinkBDNDBoardContentNodeA.appendChild(document.createTextNode(obj.resource.BDND.link));
			CardLinkBDNDBoardContentNode.appendChild(CardLinkBDNDBoardContentNodeA);
			CardLinkBDNDBoardContent.appendChild(CardLinkBDNDBoardContentNode);
			//CardLinkBDNDBoardContent.appendChild(document.createElement("br"));
			var CardLinkBDNDBoardContentNode=document.createElement("p");
			CardLinkBDNDBoardContentNode.appendChild(document.createTextNode("提取码："+obj.resource.BDND.password));
			CardLinkBDNDBoardContent.appendChild(CardLinkBDNDBoardContentNode);
			CardLinkBDND.BoardContent=CardLinkBDNDBoardContent;
			CardLinkBDND.addEventListener("click",function() {ShowCardBoard(this)});
			var CardLinkBDNDIcon=document.createElement("div");
			CardLinkBDNDIcon.className="card_link_button_icon card_link_button_icon_BDND";
			CardLinkBDND.appendChild(CardLinkBDNDIcon);
			var CardLinkBDNDText=document.createElement("p");
			CardLinkBDNDText.className="card_link_button_text";
			CardLinkBDNDText.appendChild(document.createTextNode("百度网盘"));
			CardLinkBDND.appendChild(CardLinkBDNDText);
			CardLink.appendChild(CardLinkBDND);
		}
		if (obj.resource.Torrent!=null) {
			var CardLinkTorrent=document.createElement("a");
			CardLinkTorrent.href=obj.resource.Torrent;
			CardLinkTorrent.className="card_link_button card_link_button_Torrent";
			var CardLinkTorrentIcon=document.createElement("div");
			CardLinkTorrentIcon.className="card_link_button_icon card_link_button_icon_Torrent";
			CardLinkTorrent.appendChild(CardLinkTorrentIcon);
			var CardLinkTorrentText=document.createElement("p");
			CardLinkTorrentText.className="card_link_button_text";
			CardLinkTorrentText.appendChild(document.createTextNode("磁力链接"));
			CardLinkTorrent.appendChild(CardLinkTorrentText);
			CardLink.appendChild(CardLinkTorrent);
		}
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
		var CardBoardClose=document.createElement("a");
		CardBoardClose.className="card_board_close";
		CardBoardClose.href="javascript:void(0)";
		CardBoardClose.addEventListener("click",function() {CloseCardBoard(this)});
		CardBoardFrame.appendChild(CardBoardClose);
		CardBoard.appendChild(CardBoardFrame);
		Card.appendChild(CardBoard);
		document.getElementById("show_box").appendChild(Card);
	});
}

function Beginning() {
	if (document.getElementById("show_box")) {
		OverView();
	} else setTimeout("Beginning()",100);
}

Beginning();

function ShowCardBoard(Node) {
	var Board=Node.parentNode.parentNode.getElementsByClassName("card_board")[0];
	var BoardTitleIcon=Board.getElementsByClassName("card_board_title_icon")[0];
	var BoardTitleText=Board.getElementsByClassName("card_board_title_text")[0];
	var BoardContent=Board.getElementsByClassName("card_board_content")[0];
	Board.style.transition="all 0 ease-in-out";
	BoardTheme="card_board";
	BoardTitleIcon.className="card_board_title_icon";
	$(BoardTitleText).empty();
	$(BoardContent).empty();
	Board.className=Node.BoardTheme;
	BoardTitleIcon.className=Node.BoardTitleIcon;
	BoardTitleText.appendChild(document.createTextNode(Node.BoardTitle));
	BoardContent.parentNode.replaceChild(Node.BoardContent.cloneNode(true),BoardContent);
	Board.style.transition="all 0.4s ease-in-out";
	Board.style.width="362px";
}

function CloseCardBoard(Node) {
	Node.parentNode.parentNode.style.width=0;
}