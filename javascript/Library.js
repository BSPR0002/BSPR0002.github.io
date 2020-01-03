var LibraryData=null;
var CurrentLibrary=null;
var ShowData=null;
var TotalPage=null;
var CurrentPage=null;

function PullLibrary(library,callback) {
	$.getJSON("/json/"+library+".json",function(resp) {
		LibraryData=resp;
		CurrentLibrary=library;
		callback(library);
	})
}

function OverView(library) {
	if (LibraryData==null||CurrentLibrary!=library) {
		PullLibrary(library,OverView);
	} else {
		ShowData=LibraryData;
		Show();
	};
}

function Show() {
	$.each(ShowData,function(i,obj) {
		var Card=document.createElement("div");
		Card.className="card";
		var CardIcon=document.createElement("img");
		CardIcon.className="card_icon";
		CardIcon.src=obj.icon;
		Card.appendChild(CardIcon);
		var CardName=document.createElement("p");
		CardName.className="card_name";
		var Node=document.createTextNode(obj.display);
		CardName.appendChild(Node);
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
			allinone=allinone+"）";
			var Node=document.createTextNode(allinone);
			break;
		}
		CardType.appendChild(Node);
		Card.appendChild(CardType);
		document.getElementById("show_box").appendChild(Card);
	});
}

function Beginning() {
	if (document.getElementById("show_box")) {
		window.clearInterval(BeginID);
		OverView(document.getElementById("show_box").className);
	}
}

var BeginID=window.setInterval("Beginning()",100);