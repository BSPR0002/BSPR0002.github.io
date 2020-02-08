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
	NotificationCreater({"title":"测试姬","message":"你好！","image":"/Images/resource_icon/ID00000001.png","icon":"/favicon.png","id":"Blue Sky Information Factory","renotify":true,"keep":true});
}

function HADecoder(HtmlArray) {
	var HtmlDoc=document.createDocumentFragment();
	var Operator=function(data,size,over) {
		for (var i=0;i<size;i++) {
			if (typeof data[i]=="string"||typeof data[i]=="object") {
				switch (data[i].constructor) {
					case String:
						over.appendChild(document.createTextNode(data[i]));
						break;
					case Array:
						let element=document.createElement(data[i][0]);
						if (typeof data[i][1]=="string"||typeof data[i][1]=="object") {
							switch (data[i][1].constructor) {
								case String:
									element.appendChild(document.createTextNode(data[i][1]));
									break;
								case Array:
									Operator(data[i][1],data[i][1].length,element);
							};
						};
						for (let attribute in data[i][2]) {
							element.setAttribute(attribute,data[i][2][attribute])
						};
						over.appendChild(element)
				}
			}
		}
	};
	Operator(HtmlArray,HtmlArray.length,HtmlDoc);
	return HtmlDoc
}

tt=NotificationCreater({"title":"测试姬","message":"你好！","icon":"/favicon.png","id":"Blue Sky Information Factory","renotify":true,"keep":true});