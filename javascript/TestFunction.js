var AJAX_Local={
	"/json/resource.json":[
		{
			"ID":1,
			"name":["Nekopara"],
			"display":"ネコぱら",
			"icon":"/Images/resource_icon/ID00000001.png",
			"type":"allinone",
			"AllInOne":["PC版游戏","手机版游戏","Steam R18 DLC","解包","动画","周边"],
			"resource":{
				"BDND":{
					"link":"https://pan.baidu.com/s/1kId1GKYVgqD66AMtRrcTwA",
					"password":"e1s7",
					"detail":["资源内的压缩包如果有密码，全部为“NKPR”。"]
				},
				"Torrent":"https://www.kisssub.org/search.php?keyword=NEKOPARA"
			}
		}
	],
	"/json/News.json":[
		{
			"ID":"test1",
			"name":"魔女的夜宴",
			"title":"怀旧库存",
			"preview":{
				"image":"/Images/News/SabbatOfTheWitch_preview.jpg",
				"message":"资源库将于3月20日收录游戏《サノバウィッチ》（魔女的夜宴）。"
			},
			"content":[
				"怀旧款，《魔女的夜宴》将于3月20日收录到资源库中。",["BR"],
				"来重温下老游戏吧！即使从未听闻也值得一玩喔！",["BR"],
				["IMG",[],{"src":"/Images/News/SabbatOfTheWitch.jpg"}]
			]
		}
	]
};

var Cookies_Local={"News":"{}"};

function testfunc() {
	if (DetectUA().Mobile==true) {alert("您的UA为移动设备")} else {alert("您的UA为电脑")}
	NotificationCreater({"title":"检测UA","message":navigator.userAgent,"icon":"/favicon.png","keep":true});
}

function AJAX(option) { //本地调试模拟AJAX
	console.log("AJAX:",option);
	option.success(AJAX_Local[option.url])
}

var Cookies={
	"get":function(name) {
		console.log("get cookie:",name,Cookies_Local[name]);
		return Cookies_Local[name];
	},
	"set":function(name,value) {
		console.log("set cookie:",name+"="+value);
		Cookies_Local[name]=value;
	}
}

var FileAPI={
	"read":function(target,type) {
		var Operator=new FileReader;
		switch (type) {
			case 1:
				Operator.readAsArrayBuffer(target);
			break;
			case 2:
				Operator.readAsBinaryString(target);
			break;
			case 3:
				Operator.readAsDataURL(target);
			break;
			default:
				Operator.readAsText(target);
		}
		return Operator.result;
	},
	"write":function(){console.warn("still building")}
}

