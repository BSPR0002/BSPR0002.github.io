function AJAX(options) {
	var model={"method":"get","url":null,"async":true,"username":undefined,"password":undefined,"type":"","timeout":0,"send":null,"cache":true,"success":function(){},"fail":function(){},"error":function(){}};
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
	XHR.onerror=model.error;
	XHR.send(model.send);
	return XHR;
}

function getJSON(url,callback,AllowCache) {
	var AJAXModel={"url":url,"type":"json","success":function(response) {
		callback(response);
	}};
	if (AllowCache==false) AJAXModel.cache=false;
	return AJAX(AJAXModel);
}

function getXML(url,callback,AllowCache) {
	var AJAXModel={"url":url,"type":"document","success":function(response) {
		callback(response);
	}};
	if (AllowCache==false) AJAXModel.cache=false;
	return AJAX(AJAXModel);
}

function Load(url,TargetElement,AllowCache) {
	var AJAXModel={"url":url,"success":function(response) {
		var Operator=document.createRange().createContextualFragment(response);
		EmptyElement(TargetElement);
		TargetElement.appendChild(Operator);
	}};
	if (AllowCache==false) AJAXModel.cache=false;
	return AJAX(AJAXModel);
}

function EmptyElement(TargetElement) {
	var Operator=document.createRange();
	Operator.selectNodeContents(TargetElement);
	Operator.deleteContents();
}

function getNotificationPermission(callback){
	if (!Notification) return 0;
	switch (Notification.permission) {
		case "default":
			Notification.requestPermission(callback);
			return 2;
		case "granted":
			return 1;
		default:
			return 0;
	}
}

function NotificationCreater(options) {
	switch (getNotificationPermission()) {
		case 2:
			return 2;
		case 1:
			var model={"title":"","message":"","image":"","icon":"","id":"","data":"","timestamp":undefined,"dir":"auto","badge":"","language":"","vibrate":[],"renotify":false,"silent":false,"sound":"","noscreen":false,"sticky":false,"keep":false,"show":null,"click":null,"close":null,"error":null};
			Object.assign(model,options);
			var NotificationInterface=new Notification(model.title,{"body":model.message,"image":model.image,"icon":model.icon,"tag":model.id,"data":model.data,"timestamp":model.timestamp,"dir":model.dir,"badge":model.badge,"lang":model.language,"vibrate":model.vibrate,"renotify":model.renotify,"silent":model.silent,"sound":model.sound,"noscreen":model.noscreen,"sticky":model.sticky,"requireInteraction":model.keep});
			NotificationInterface.onshow=model.show;
			NotificationInterface.onclick=model.click;
			NotificationInterface.onclose=model.close;
			NotificationInterface.onerror=model.error;
			return NotificationInterface;
		default:
			return false;
	}
}

function HADecoder(HtmlArray,unit) {
	if (typeof unit=="undefined") unit="未知";
	var HtmlDoc=document.createDocumentFragment();
	function Operator(data,outer) {
		if (Array.isArray(data)) {
			for (var item of data) {
				if (typeof item=="string"||typeof item=="number"||Array.isArray(item)) {
					switch (typeof item) {
						case "string":
						case "number":
							outer.appendChild(document.createTextNode(item));
							break;
						case "object":
							try {
								if (item[0]=="#comment") {outer.appendChild(document.createComment(item[1]))} else {
									let element=document.createElement(item[0]);
									if (typeof item[1]=="string"||typeof item[1]=="number"||Array.isArray(item[1])) {
										switch (typeof item[1]) {
											case "string":
											case "number":
												element.appendChild(document.createTextNode(item[1]));
												break;
											case "object":
												Operator(item[1],element);
										};
									};
									for (let attribute in item[2]) {
										try {
											element.setAttribute(attribute,item[2][attribute])
										} catch (errorMessage) {
											console.warn("HADecoder 汇报有数据错误：为节点添加属性时出错！\n出错单位：",unit,"\n出错信息："+errorMessage+"\n出错位置：",item,"\n出错值："+attribute+"="+item[2][attribute])
										};
									};
									outer.appendChild(element);
								}
							} catch(error) {
								console.warn("HADecoder 汇报有数据错误：发现无效的节点！\n出错单位：",unit,"\n节点树：",data,"\n出错位置：",item,"\n该节点已被废弃。");
							};
					};
				} else {console.warn("HADecoder 汇报有数据错误：子节点树内有无法识别的节点！\n出错单位：",unit,"\n节点树：",data,"\n出错位置：",item)};
			};
		} else {
			console.error("HADecoder 解析失败：接收到非数组的数据！\n出错单位：",unit,"\n接收内容：",data);
			HtmlDoc=false;
		};
	};
	Operator(HtmlArray,HtmlDoc);
	return HtmlDoc;
}

function HAEncoder(Node,IncludeOuter) {
	try {
		Node=Node.cloneNode(true);
		var HtmlArray=new Array;
		function Transporter(Node,outer) {
			if (Node.nodeName=="#text") {
				outer.push(Node.textContent);
			} else {
				for (let child of Node.childNodes) {Operator(child,outer)};
			};
		};
		function Operator(Node,outer) {
			switch (Node.nodeName) {
				case "#text":
					outer.push(Node.textContent);
					break;
				case "#comment":
					outer.push(["#comment",Node.textContent]);
					break;
				default:
					let child=[Node.nodeName];
					if (Node.hasChildNodes()==true) {
						child[1]=new Array;
						Transporter(Node,child[1]);
					};
					try {
						if (Node.hasAttributes()==true) {
							child[2]=new Object;
							for (let attribute of Node.attributes) {
								child[2][attribute.name]=attribute.value;
							};
						};
					} catch(error) {console.warn("HAEncoder 汇报异常：未能获取到节点的属性！\n异常节点：",Node)}
					outer.push(child);
			}
		};
		if (IncludeOuter===true) {Operator(Node,HtmlArray)} else {Transporter(Node,HtmlArray)};
	} catch(error) {
		console.error("HAEncoder 编码失败：输入的不是节点或节点不可编码！");
		HtmlArray=false;
	}
	return HtmlArray;
}

function DetectUA() {
	var UA={"Desktop":false,"Mobile":false};
	var Detective=navigator.userAgent;
	if (Detective.match(/Windows/i)||Detective.match(/Macintosh/i)||Detective.match(/Linux/i)) UA.Desktop=true;
	if (Detective.match(/Mobile/i)||Detective.match(/Android/i)||Detective.match(/iPhone/i)||Detective.match(/iPad/i)||Detective.match(/iPod/i)) UA.Mobile=true;
	return UA;
}

var Cookies={
	"get":function(cookieName) {
		return Cookies.toObject()[cookieName];
	},
	"set":function(name,value,expiresDate,path,domain) {
		if (expiresDate) {expiresDate=";expires="+expiresDate.toUTCString()+";"} else expiresDate="";
		if (typeof path=="string") {path=";Path="+path} else path="";
		if (typeof domain=="string") {domain=";domain="+domain} else domain="";
		document.cookie=name+"="+value+expiresDate+path+domain;
	},
	"delete":function(cookieName,cookiePath,cookieDomain) {
		var expires=new Date;
		expires.setTime(0);
		Cookies.set(cookieName,"",expires,cookiePath,cookieDomain);
	},
	"empty":function() {
		var box=Cookies.toObject();
		for (var cookie in box) {Cookies.delete(cookie)};
	},
	"toObject":function() {
		var Fodder_Box=new Object;
		if (document.cookie!="") {
			var Cookies_Box=document.cookie.split("; ");
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
		};
		return Fodder_Box;
	},
	"keepAlive":function(cookieName,cookiePath,cookieDomain) {
		var expiresDate=new Date();
		expiresDate.setFullYear(expiresDate.getFullYear()+1);
		Cookies.set(cookieName,Cookies.get(cookieName),expiresDate,cookiePath,cookieDomain);
	}
};

var FileAPI={
	"read":function(target,type,callback) {
		var Operator=new FileReader;
		if (typeof callback=="function") Operator.onload=function(){callback(this.result)};
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
		return Operator;
	},
	"save":function(object,saveName){
		var obj_URL=URL.createObjectURL(object);
		var address=document.createElement("a");
		address.href=obj_URL;
		if (typeof saveName=="undefined") {
			address.download="";
		} else address.download=saveName;
		var VM_Click=new MouseEvent("click",{"button":0});
		address.dispatchEvent(VM_Click);
		URL.revokeObjectURL(obj_URL);
	}
};

class MultiThread {
	constructor(codeString,listener,onerror,name) {
		var codeFile=URL.createObjectURL(new Blob([codeString],{"type":"application/javascript;charset=utf-8"}));
		this.core=new Worker(codeFile,{"name":name});
		if (typeof listener=="function") this.core.onmessage=function(event){listener(event.data)};
		if (typeof onerror=="function") this.core.onerror=onerror;
		URL.revokeObjectURL(codeFile);
	}
	send(data) {this.core.postMessage(data)}
	transfer(ArrayBuffer) {this.core.postMessage(ArrayBuffer,[ArrayBuffer])}
	changeListener(listener) {if (typeof listener=="function") this.core.onmessage=function(event){listener(event.data)}}
	shut(){this.core.terminate()}
}