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
					"detail":{
						"content":["资源内的压缩包如果有密码，全部为“NKPR”。"]
					}
				},
				"Torrent":"https://www.kisssub.org/search.php?keyword=NEKOPARA"
			}
		},
		{
			"ID":2,
			"name":["魔女的夜宴","魔女夜宴","SabbatOfTheWitch","SaNoBaWiCchi"],
			"display":"サノバウィッチ",
			"icon":"/Images/resource_icon/ID00000002.png",
			"type":"PC Game",
			"resource":{
				"BDND":{
					"link":"https://pan.baidu.com/s/10H9kqaOEi53WE-xXoew0eg",
					"password":"l3xf",
					"detail":{
						"tips":"请点击“详细信息”查看密码等说明。",
						"content":[
							"压缩包的密码写在压缩包文件名末尾的中括号内。",["br"],
							"暂不提供解包、CD等资源。"
						]
					}
				},
				"Torrent":"magnet:?xt=urn:btih:7RYT3XTCUKF3YBR3C5KUM7UOF2BPLSND&dn=[150227] [ゆずソフト] サノバウィッチ ‐SABBAT OF THE WITCH‐ + Drama CD + Character Songs + Bonus + Manual + Update 1.1"
			}
		}
	]
};

function testfunc() {
	if (DetectUA().Mobile==true) {alert("您的UA为移动设备")} else {alert("您的UA为电脑")}
	NotificationCreater({"title":"检测UA","message":navigator.userAgent,"icon":"/favicon.png","keep":true});
}

if (window.location.origin=="file://") { //本地模拟函数
var AJAX=function(options) {
	function success(data) {
		switch (options.type) {
			case "json":
				try {
					data=JSON.parse(data);
				} catch(e) {fail(-11)}
		};
		options.success(data);
	};
	function fail(state){
		switch (state){
			case 404:
				console.warn("404 Not found");
				break;
			case -11:
				console.warn("Received data cannot be resolved to JSON!");
				break;
			default:
				console.warn("Unknown XmlHttpRequest error!");
		};
		try {options.fail()} catch(error) {console.warn("No fail function or fail function error!")}
	};
	console.log("AJAX:",options);
	if (typeof AJAX_Local[options.url]!="undefined") {
		options.success(AJAX_Local[options.url])
	} else {
		var doc=HtmlArray.decoder([
			"您的脚本正在通过 XmlHttpRequest 请求网络资源。",["br"],
			"请求的资源：",["br"],
			options.url,["br"],
			"AJAX 本地模拟功能在脚本的预置库中找不到此资源，请您选择一个文件作为此资源的响应，或指定此次请求失败。",["br"],
			["input",null,{"type":"file"}],["br"],
			["button","指定此次请求失败",{
				"style":"border:solid 1px #000000;border-radius:5px;transition:background-color 0.2s",
				"onmouseover":"javascript:this.style.backgroundColor='#FFFFFF'",
				"onmouseout":"javascript:this.style.backgroundColor=null"
			}]
		],"AJAX Local");
		doc.querySelector("input").addEventListener("change",function(){
			window_board.hide();
			FileAPI.read(this.files[0],4,function(text){
				success(text);
			});
		});
		doc.querySelector("button").addEventListener("click",function(){
			window_board.hide();
			fail(404);
		});
		if (window_board) {window_board.display(doc,"请求文件",true)} else {fail(404)};
	};
	return {0:"Local Debug","readyState":4};
};

var Cookies={
	"get":function(name) {
		console.log("get cookie:",name,Cookies.Local[name]);
		return Cookies.Local[name];
	},
	"set":function(name,value) {
		console.log("set cookie:",name+"="+value);
		Cookies.Local[name]=value;
		console.log("Present cookie:",Cookies.Local);
	},
	"delete":function(name) {
		console.log("delete cookie:",name);
		delete Cookies.Local[name];
		console.log("Present cookie:",Cookies.Local);
	},
	"empty":function() {Cookies.Local={}},
	"Local":{
		"News_log_ID_SabbatOfTheWitch":"{\"have_read\":2583978669458}"
	}
};

var Notification={
	"requestPermission":function() {
		return {
			"info":"Local Debug",
			"then":function(callback){callback;}
		}
	},
	"permission":"granted"
};

var NotificationCreater=function(options) {
	console.log("Notification",options);
	var preview={"icon":"","body":"","image":""};
	if (options.icon) preview.icon="\"\\nicon:\",options.icon,";
	if (options.message) preview.body=",\"\\nbody:\",options.message";
	if (options.image) preview.image=",\"\\nicon:\",options.image";
	var VM={
		"close":function() {
			delete VM.click;
			console.log("Notification closed");
			VM.onclose();
			delete VM.close;
		},
		"onshow":options.show,
		"onclick":options.click,
		"onclose":options.close,
		"onerror":options.error
	};
	eval("console.info(\"Notification Content:\","+preview.icon+"\"\\ntitle:\",options.title"+preview.body+preview.image+")");
	if (options.keep!=true) {
		VM.VM_interface=setTimeout(VM.close,25000);
		VM.click=function() {
			clearTimeout(VM.VM_interface);
			VM.VM_interface=setTimeout(VM.close,25000);
			console.info("NotificationVM Interface:","click");
			VM.onclick();
		}
	} else VM.click=function() {
		console.info("NotificationVM Interface:","click");
		VM.onclick();
	}
	if (typeof VM.onshow!="undefined") {try {VM.onshow()} catch(none) {console.log("Notification onshow error!")}};
	var VM_ID="NotificationVM"+Math.floor(Math.random()*10);
	window[VM_ID]=VM;
	console.info("Notification Interface:",VM_ID);
	return VM;
};
};