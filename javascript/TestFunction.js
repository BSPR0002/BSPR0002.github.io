var LibraryData=[
	{
		"ID":1,
		"name":"Nekopara",
		"display":"ネコぱら",
		"icon":"/Images/resource_icon/ID00000001.png",
		"type":"allinone",
		"AllInOne":["PC版游戏","手机版游戏","Steam R18 DLC","解包","动画","周边"],
		"resource":{
			"BDND":null,
			"Torrent":null
		}
	}
];
CurrentLibrary="resource";

function testfunc(){
	OverView("resource");
}

function PullLibrary(library) {
	$.getJSON("/json/"+library+".json",function(resp) {
		LibraryData=resp;
	})
}
