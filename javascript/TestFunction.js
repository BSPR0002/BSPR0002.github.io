var LibraryData=[
	{
		"ID":1,
		"name":"Nekopara",
		"display":"ネコぱら",
		"icon":"/Images/resource_icon/ID00000001.png",
		"type":"allinone",
		"AllInOne":["PC版游戏","手机版游戏","Steam R18 DLC","解包","动画","周边"],
		"resource":{
			"BDND":{
				"link":"https://pan.baidu.com/s/1kId1GKYVgqD66AMtRrcTwA",
				"password":"e1s7",
				"detail":""
			},
			"Torrent":"EFE"
		}
	}
];

function testfunc() {
	var targetE=document.getElementsByClassName("exp");
	console.log(targetE);
	targetE.info=22;
	console.log(targetE.info);
}

function HADecoder(HtmlArray) {
	var HtmlDoc=document.createDocumentFragment();
	var Operator=function(data,size,over) {
		for (var i=0;i<size;i++) {
			switch (data[i].constructor) {
				case String:
					over.appendChild(document.createTextNode(data[i]));
					break;
				case Array:
					let element=document.createElement(data[i][0]);
					switch (data[i][1].constructor) {
						case String:
							element.appendChild(document.createTextNode(data[i][1]));
							break;
						case Array:
							Operator(data[i][1],data[i][1].length,element);
					};
					for (let attribute in data[i][2]) {
						element.setAttribute(attribute,data[i][2][attribute])
					};
					over.appendChild(element)
			};
		}
	};
	Operator(HtmlArray,HtmlArray.length,HtmlDoc);
	return HtmlDoc
}

tt=NotificationCreater({"title":"测试姬","message":"你好！","icon":"/favicon.png","id":"Blue Sky Information Factory","renotify":true,"keep":true});