function AJAX(options) {
	var model={"method":"get","url":null,"async":true,"username":undefined,"password":undefined,"type":"","timeout":0,"send":null,"cache":true,"success":null,"fail":null};
	Object.assign(model,options);
	var XHR=new XMLHttpRequest();
	XHR.open(model.method,model.url,model.async,model.username,model.password);
	XHR.responseType=model.type;
	XHR.timeout=model.timeout;
	if (model.cache==false) XHR.setRequestHeader("If-Modified-Since","0");
	XHR.onload=function() {
		if ((XHR.status>=200&&XHR.status<300)||XHR.status==304) {
			model.success(XHR.response);
		} else model.fail(XHR.status);
	};
	XHR.send(model.send)
}

function getJSON(url,callback,AllowCache){
	var AJAXModel={"url":url,"type":"json","success":function(response) {
		callback(response);
	}};
	if (AllowCache==false) AJAXModel.cache=false;
	AJAX(AJAXModel);
}

function getXML(url,callback,AllowCache) {
	var AJAXModel={"url":url,"type":"document","success":function(response) {
		callback(response);
	}};
	if (AllowCache==false) AJAXModel.cache=false;
	AJAX(AJAXModel);
}

function EmptyElement(TargetElement) {
	var Operator=document.createRange();
	Operator.selectNodeContents(TargetElement);
	Operator.deleteContents();
}

function Load(url,TargetElement,AllowCache) {
	var AJAXModel={"url":url,"success":function(response) {
		var Operator=document.createRange().createContextualFragment(response);
		EmptyElement(TargetElement);
		TargetElement.appendChild(Operator);
	}};
	if (AllowCache==false) AJAXModel.cache=false;
	AJAX(AJAXModel);
}

function Each(obj,action) {
	for (var key in obj){action(key,obj[key])};
}

function requestNotificationPermission(){
	switch (Notification.permission) {
		case "default":
			Notification.requestPermission();
			break;
		case "denied":
			return "User reject notification!";
			break;
		case "granted":
			return "User authorized!";
	}
}

function NotificationCreater(options) {
	switch (Notification.permission) {
		case "default":
			Notification.requestPermission(function(){NotificationCreater(options)});
			return "Permission has not been requested!Please wait, if the user is authorized, the notification will be displayed later.";
			break;
		case "denied":
			return "User reject notification!";
			break;
		case "granted":
			var model={"title":"","message":"","image":"","icon":"","id":"","data":"","timestamp":undefined,"dir":"auto","badge":"","language":"","vibrate":[],"renotify":false,"silent":false,"sound":"","noscreen":false,"sticky":false,"keep":false,"show":null,"click":null,"close":null,"error":null};
			Object.assign(model,options);
			var NotificationInterface=new Notification(model.title,{"body":model.message,"image":model.image,"icon":model.icon,"tag":model.id,"data":model.data,"timestamp":model.timestamp,"dir":model.dir,"badge":model.badge,"lang":model.language,"vibrate":model.vibrate,"renotify":model.renotify,"silent":model.silent,"sound":model.sound,"noscreen":model.noscreen,"sticky":model.sticky,"requireInteraction":model.keep});
			NotificationInterface.onshow=model.show;
			NotificationInterface.onclick=model.click;
			NotificationInterface.onclose=model.close;
			NotificationInterface.onerror=model.error;
			return NotificationInterface;
	}
}

function HADecoder(HtmlArray,unit) {
	var HtmlDoc=document.createDocumentFragment();
	var Operator=function(data,over) {
		try {
			if (Array.isArray(data)==false) throw "检测到非数组的节点树！";
			for (var item of data) {
				if (typeof item=="string"||Array.isArray(item)) {
					switch (typeof item) {
						case "string":
							over.appendChild(document.createTextNode(item));
							break;
						case "object":
							let element=document.createElement(item[0]);
							if (typeof item[1]=="string"||Array.isArray(item[1])) {
								switch (typeof item[1]) {
									case "string":
										element.appendChild(document.createTextNode(item[1]));
										break;
									case "object":
										Operator(item[1],element);
								};
							}
							for (let attribute in item[2]) {
								element.setAttribute(attribute,item[2][attribute])
							};
							over.appendChild(element)
					}
				}
			}
		} catch(err) {console.error("HADecoder 汇报有数据错误："+err+"\n出错单位："+unit)}
	};
	Operator(HtmlArray,HtmlDoc);
	return HtmlDoc
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
	"get2":function(cookieName) {
		Cookies.toObject()[cookieName]
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
			for (var cookie in Cookies_Box) {
				var pulverizer=Cookies_Box[cookie].split("=");
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
		Cookies.set(cookieName,Cookies.get(cookieName),expiresDate,cookiePath,cookieDomain);
	}
};