function AJAX(options) {
	var model={"method":"get","url":null,"async":true,"username":undefined,"password":undefined,"type":"","timeout":0,"send":null,"cache":true,"success":null,"fail":null,"error":null};
	Object.assign(model,options);
	var XHR=new XMLHttpRequest();
	XHR.open(model.method,model.url,model.async,model.username,model.password);
	if (model.async!==false) {
		XHR.responseType=model.type;
		XHR.timeout=model.timeout;
	};
	if (model.cache===false) XHR.setRequestHeader("If-Modified-Since","0");
	XHR.onload=function() {
		if ((this.status>=200&&this.status<300)||this.status==304) {
			if (typeof model.success=="function") model.success(this.response);
		} else if (typeof model.fail=="function") model.fail(this.status);
	};
	XHR.onerror=model.error;
	XHR.send(model.send);
	return XHR;
}

function getJSON(url,callback,AllowCache) {
	var AJAXModel={"url":url,"type":"json"};
	if (typeof callback=="function") AJAXModel.success=callback;
	if (AllowCache===false) AJAXModel.cache=false;
	return AJAX(AJAXModel);
}

function getXML(url,callback,AllowCache) {
	var AJAXModel={"url":url,"type":"document"};
	if (typeof callback=="function") AJAXModel.success=callback;
	if (AllowCache===false) AJAXModel.cache=false;
	return AJAX(AJAXModel);
}

function Load(url,TargetElement,AllowCache,fully) {
	var AJAXModel={"url":url};
	if (AllowCache===false) AJAXModel.cache=false;
	if (fully===true) {
		var FullLoadInterface={"readyState":0,"children":null};
		AJAXModel.success=function(response){
			FullLoadInterface.readyState=3;
			var Operator=document.createRange().createContextualFragment(response);
			var requests={"list":[]};
			FullLoadInterface.children=requests.list;
			var count=-1;
			Object.defineProperty(requests,"number",{
				"get":function(){return count},
				"set":function(value){
					count=value;
					if (value==0) {
						FullLoadInterface.abort=function(){};
						FullLoadInterface.readyState=4;
						EmptyElement(TargetElement);
						TargetElement.appendChild(Operator);
					};
				},
				"configrable":true,
				"enumerable":true,
			});
			for (let item of Operator.querySelectorAll("script")) {
				if (item.src!="") {
					requests.list.push(AJAX({
						"url":item.src,
						"cache":AllowCache,
						"success":function(response){
							/*
							var temp=document.createElement("script");
							temp.appendChild(document.createTextNode(response));
							if (item.hasAttributes()==true) {
								for (let attribute of item.attributes) {
									if (attribute.name=="src") continue;
									temp.setAttribute(attribute.name,attribute.value)
								}
							};
							item.parentNode.replaceChild(temp,item);
							*/
							requests.number--
						},
						"fail":function(){
							console.warn("The resource \""+item.src+"\" of FullLoad \""+url+"\" request failed.");
							requests.number--
						}
					}))
				}
			};
			for (let item of Operator.querySelectorAll("link")) {
				if (item.getAttribute("rel")=="stylesheet") {
					requests.list.push(AJAX({
						"url":item.getAttribute("href"),
						"cache":AllowCache,
						"success":function(response){
							var temp=document.createElement("style");
							temp.appendChild(document.createTextNode(response));
							if (item.hasAttributes()==true) {
								for (let attribute of item.attributes) {
									if (attribute.name=="href"||attribute.name=="rel") continue;
									temp.setAttribute(attribute.name,attribute.value)
								}
							};
							item.parentNode.replaceChild(temp,item);
							requests.number--
						},
						"fail":function(){
							console.warn("The resource \""+item.getAttribute("href")+"\" of FullLoad \""+url+"\" request failed.");
							requests.number--
						}
					}))
				}
			};
			requests.number=requests.list.length;
			FullLoadInterface.abort=function(){
				count=-1;
				FullLoadInterface.readyState=4;
				for (let item of requests.list) {
					item.abort();
				};
				FullLoadInterface.abort=function(){};
			};
		};
		FullLoadInterface.AJAX=AJAX(AJAXModel);
		FullLoadInterface.abort=function(){FullLoadInterface.AJAX.abort()};
		return FullLoadInterface;
	};
	AJAXModel.success=function(response) {
		var Operator=document.createRange().createContextualFragment(response);
		EmptyElement(TargetElement);
		TargetElement.appendChild(Operator);
	};
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
			Notification.requestPermission().then(callback);
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

function DetectUA() {
	var UA={"Desktop":false,"Mobile":false};
	var Detective=navigator.userAgent;
	if (Detective.match(/Windows/i)||Detective.match(/Macintosh/i)||Detective.match(/Linux/i)) UA.Desktop=true;
	if (Detective.match(/Mobile/i)||Detective.match(/Android/i)||Detective.match(/iPhone/i)||Detective.match(/iPad/i)||Detective.match(/iPod/i)) UA.Mobile=true;
	return UA;
}

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

var ArrayHtml={
	"decode":function(ArrayHtml,unit) {
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
		Operator(ArrayHtml,HtmlDoc);
		return HtmlDoc;
	},
	"encode":function(Node,IncludeOuter) {
		var ArrayHtml=[];
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
						child[1]=[];
						Transporter(Node,child[1]);
					};
					try {
						if (Node.hasAttributes()==true) {
							child[2]={};
							for (let attribute of Node.attributes) {
								child[2][attribute.name]=attribute.value;
							};
						};
					} catch(error) {console.warn("HAEncoder 汇报异常：未能获取到节点的属性！\n异常节点：",Node)}
					outer.push(child);
			}
		};
		try {
			Node=Node.cloneNode(true);
			if (IncludeOuter===true) {Operator(Node,ArrayHtml)} else {Transporter(Node,ArrayHtml)};
		} catch(error) {
			console.error("HAEncoder 编码失败：输入的不是节点或节点不可编码！");
			ArrayHtml=false;
		};
		return ArrayHtml;
	}
};

var Cookies={
	"get":function(cookieName) {
		return Cookies.toObject()[cookieName];
	},
	"set":function(name,value,expiresDate,path,domain) {
		if (expiresDate instanceof Date) {expiresDate=";expires="+expiresDate.toUTCString()+";"} else expiresDate="";
		if (typeof path=="string") {path=";Path="+path} else path="";
		if (typeof domain=="string") {domain=";domain="+domain} else domain="";
		document.cookie=name+"="+value+expiresDate+path+domain;
	},
	"delete":function(cookieName,cookiePath,cookieDomain) {
		var expires=new Date(0);
		Cookies.set(cookieName,"",expires,cookiePath,cookieDomain);
	},
	"empty":function() {
		for (var cookie in Cookies.toObject()) {Cookies.delete(cookie)};
	},
	"toObject":function() {
		var Fodder_Box={};
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
	"save":function(file,saveName){
		var obj_URL=URL.createObjectURL(file);
		var address=document.createElement("a");
		address.href=obj_URL;
		if (typeof saveName=="undefined") {
			address.download="";
		} else address.download=saveName;
		address.dispatchEvent(new MouseEvent("click",{"button":0}));
		URL.revokeObjectURL(obj_URL);
	}
};

var Base64={
	"encode":function(data) {
		if (!(typeof data=="object"&&data instanceof ArrayBuffer)) throw new TypeError("Base64 encoder accepts only ArrayBuffer objects.");
		var table=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","+","/"];
		var operator=new Uint8Array(data);
		var result="",padding="",bits="";
		for (let byte=0,bytes=operator.length;byte<bytes;byte++) {
			let temp=operator[byte].toString(2);
			for (null;temp.length<8;temp="0"+temp);
			bits+=temp;
		};
		for (let remain=(3-operator.length%3)%3;remain!=0;remain--) {
			bits+="00";
			padding+="=";
		};
		for (let byte=0,bytes=bits.length/6;byte<bytes;byte++) {
			result+=table[Number("0b"+bits.substring(byte*6,(byte+1)*6))]
		};
		return result+padding;
	},
	"decode":function(Base64String) {
		if (typeof Base64String!="string") throw new TypeError("Base64 decoder accepts only strings.");
		var length=Base64String.length;
		if (length%4!=0) throw new SyntaxError("Invalid string, string length is not a multiple of 4.");
		var table={"A":"000000","B":"000001","C":"000010","D":"000011","E":"000100","F":"000101","G":"000110","H":"000111","I":"001000","J":"001001","K":"001010","L":"001011","M":"001100","N":"001101","O":"001110","P":"001111","Q":"010000","R":"010001","S":"010010","T":"010011","U":"010100","V":"010101","W":"010110","X":"010111","Y":"011000","Z":"011001","a":"011010","b":"011011","c":"011100","d":"011101","e":"011110","f":"011111","g":"100000","h":"100001","i":"100010","j":"100011","k":"100100","l":"100101","m":"100110","n":"100111","o":"101000","p":"101001","q":"101010","r":"101011","s":"101100","t":"101101","u":"101110","v":"101111","w":"110000","x":"110001","y":"110010","z":"110011","0":"110100","1":"110101","2":"110110","3":"110111","4":"111000","5":"111001","6":"111010","7":"111011","8":"111100","9":"111101","+":"111110","/":"111111"};
		var padding=0;
		for (let i=1;i<4;i++) {
			if (Base64String[length-i]!="=") break;
			if (i>2) throw new SyntaxError("Invalid string with more than 2 complements(=).");
			padding++;
		};
		length-=padding;
		var bits="";
		for (let i=0;i<length;i++) {
			if (typeof table[Base64String[i]]=="undefined") throw new SyntaxError("Invalid string with invalid character \""+Base64String[i]+"\" at ["+i+"].");
			bits+=table[Base64String[i]];
		};
		var bytes=(bits.length-padding*2)/8;
		var operator=new Uint8Array(bytes);
		for (let byte=0;byte<bytes;byte++) {
			operator[byte]=Number("0b"+bits.substring(byte*8,(byte+1)*8))
		};
		return operator.buffer
	}
};