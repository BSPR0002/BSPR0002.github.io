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
				"detail":[["p","detail 测试"]]
			},
			"Torrent":"EFE"
		}
	}
];

function testfunc() {
	NotificationCreater({"title":"测试姬","message":"你好！","image":"/Images/resource_icon/ID00000001.png","icon":"/favicon.png","id":"Blue Sky Information Factory","renotify":true,"keep":true});
}

tt=NotificationCreater({"title":"测试姬","message":"你好！","icon":"/favicon.png","id":"Blue Sky Information Factory","renotify":true,"keep":true});