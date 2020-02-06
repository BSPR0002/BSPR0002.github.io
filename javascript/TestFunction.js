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

var Cookies={
	"get":function(cookieName) {
		var name=cookieName+"=";
		var ca=document.cookie.split(";");
		for (var i=0;i<ca.length;i++) {
			var c=ca[i];
			while (c.charAt(0)=="") {
				c=c.substring(1);
			}
			if (c.indexOf(name)==0) {
				return c.substring(name.length,c.length);
			}
		}
		return "";
	},
	"set":function(cookieName,cookieValue,expiresDate,cookiePath,cookieDomain) {
		if (typeof expiresDate!="undefined") expiresDate="expires="+expiresDate.toUTCString()+";";
		if (typeof cookiePath=="undefined") cookiePath="/";
		if (typeof cookieDomain!="undefined") cookieDomain=";domain="+cookieDomain;
		document.cookie=cookieName+"="+cookieValue+";"+expiresDate+"path="+cookiePath+cookieDomain;
	},
	"clear":function(cookieName) {
		var expires=new Date();
		expires.setTime(0);
		document.cookie=cookieName+"=;expires="+expires.toUTCString()+";path=/";
	},
	"toObject":function() {
		if (document.cookie!="") {
			var Cookies_Box=document.cookie.split("; ");
			var Fodder_Box=new Object;
			for (var length in Cookies_Box) {
				var cookie=Cookies_Box[length];
				pulverizer=cookie.split("=");
				for (var timer=0;timer<pulverizer.length;timer++) {
					switch (timer) {
						case 0:
						Fodder_Box[pulverizer[0]]="";
						break;
						case 1:
						Fodder_Box[pulverizer[0]]=pulverizer[1];
						break;
						default:
						Fodder_Box[pulverizer[0]]+=("="+pulverizer[timer]);
					};
				};
			};
			return Fodder_Box;
		} else return {};
	},
	"keepAlive":function(cookieName,cookiePath,cookieDomain) {
		var expiresDate=new Date();
		expiresDate.setFullYear(expiresDate.getFullYear()+1);
		this.set(cookieName,Cookies.get(cookieName),expiresDate,cookiePath,cookieDomain);
	}
}