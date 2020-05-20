//本地模拟支持
if (window.location.origin!="file://") throw new Error("Not in local environment!");

//XMLHttpRequest 模拟
var XHR_Local={ //JSON 预设库
	"/json/resource.json":[
			{
			"ID":1,
			"display":"ネコぱら",
			"name":["Nekopara","猫娘乐园","巧克力与香子兰"],
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
				}
			}
		},
		{
			"ID":2,
			"display":"サノバウィッチ",
			"name":["魔女的夜宴","魔女夜宴","SabbatOfTheWitch","SaNoBaWicChi"],
			"icon":"/Images/resource_icon/ID00000002.png",
			"type":"PC game",
			"resource":{
				"BDND":{
					"link":"https://pan.baidu.com/s/133cnugefJqWhqg9TqMJz-g",
					"password":"2z48",
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
		},
		{
			"ID":3,
			"display":"LOVESICK PUPPIES -僕らは恋するために生まれてきた-",
			"name":[],
			"icon":"/Images/resource_icon/ID00000003.png",
			"type":"game",
			"resource":{
				"BDND":{
					"link":"https://pan.baidu.com/s/17xe4XMleMHVcpRlFN4tYmg",
					"password":"0tuk",
					"detail":{
						"content":[
							"解包与手机版将在5月12日后更新。"
						]
					}
				}
			}
		}
	]
};
for (let i in XHR_Local) {
	if (typeof XHR_Local[i]=="object") XHR_Local[i]=JSON.stringify(XHR_Local[i])
};

var XHR_request=function(XHR_VM) {
	var url=XHR_VM.url;
	var ID=XHR_request.VM_count++;
	console.log("新的待指定 xhr 请求：",url,"\n交互编号：",ID,"\n快速通道：XHR_request.VM["+ID+"].select()");
	return new Promise(function(resolve,reject){
		XHR_request.VM[ID]={
			"url":url,
			"select":function(){
				var VM=document.createElement("input");
				VM.type="file";
				VM.addEventListener("change",function(){
					var file=this.files[0];
					XHR_request.VM[ID]=void 0;
					var reader=new FileReader;
					reader.onload=function(){resolve([true,this.result])};
					reader.readAsText(file);
				});
				VM.dispatchEvent(new MouseEvent("click",{"button":0}));
				return url;
			},
			"fail":function(){
				XHR_request.VM[ID]=void 0;
				resolve([false])
			}
		};
		XHR_VM.stop_request=XHR_request.VM[ID].fail;
	});
};
XHR_request.VM=[];
XHR_request.VM_count=0;
XHR_request.responseLast=function(){
	var i=XHR_request.VM_count-1;
	if (i==-1) return "无请求";
	if (XHR_request.VM[i]) {
		return XHR_request.VM[i].select();
	} else {
		return "上个 XHR 已失效，请手动查找。";
	};
};

XMLHttpRequest=class {
	constructor(){
		this.VM={
			"value":{
				"readyState":0,
				"response":"",
				"responseText":"",
				"responseType":"",
				"responseURL":"",
				"responseXML":null,
				"status":0,
				"statusText":"",
				"timeout":0,
				"RequestHeader":{}
			},
			"port":{},
			"async":true,
			"OPENED":false,
			"stop":true,
			"abort":false,
			"timeout":false,
			"progressID":null,
			"stop_request":null
		};
		var self=this;
		Object.defineProperty(this.VM.port,"readyState",{
			"get":function(){return this.VM.value.readyState},
			"set":function(value) {
				self.VM.value.readyState=value;
				if (typeof self.onreadystatechange=="function") try {self.onreadystatechange(new Event("readystatechange",{"currentTarget":self,"srcElement":self,"target":self}))} catch(error) {console.error(error)};
			}
		});
		this.onabort=null;
		this.onerror=null;
		this.onload=null;
		this.onloadend=null;
		this.onloadstart=null;
		this.onprogress=null;
		this.onreadystatechange=null;
		this.ontimeout=null;
		class XMLHttpRequestUpload {
			constructor() {
				this.onabort=null;
				this.onerror=null;
				this.onload=null;
				this.onloadend=null;
				this.onloadstart=null;
				this.onprogress=null;
				this.ontimeout=null;
			}
		};
		this.upload=new XMLHttpRequestUpload;
		this.withCredentials=false;
		Object.defineProperties(this,{
			"readyState":{
				"get":function(){return this.VM.value.readyState},
				"set":function(){console.warn("只读")},
				"enumerable":true
			},
			"response":{
				"get":function(){return this.VM.value.response},
				"set":function(){console.warn("只读")},
				"enumerable":true
			},
			"responseText":{
				"get":function(){return this.VM.value.responseText},
				"set":function(){console.warn("只读")},
				"enumerable":true
			},
			"responseType":{
				"get":function(){return this.VM.value.responseType},
				"set":function(value){
					if (self.VM.async==false&&value!=="") throw new DOMException("Failed to set the 'responseType' property on 'XMLHttpRequest': The response type cannot be changed for synchronous requests made from a document.");
					self.VM.value.responseType=value;
					return value;
				},
				"enumerable":true
			},
			"responseURL":{
				"get":function(){return this.VM.value.responseURL},
				"set":function(){console.warn("只读")},
				"enumerable":true
			},
			"responseXML":{
				"get":function(){return this.VM.value.responseXML},
				"set":function(){console.warn("只读")},
				"enumerable":true
			},
			"status":{
				"get":function(){return this.VM.value.status},
				"set":function(){console.warn("只读")},
				"enumerable":true
			},
			"statusText":{
				"get":function(){return this.VM.value.statusText},
				"set":function(){console.warn("只读")},
				"enumerable":true
			},
			"timeout":{
				"get":function(){return this.VM.value.timeout},
				"set":function(value){
					if (self.VM.async==false&&value!==0) throw new DOMException("Failed to set the 'timeout' property on 'XMLHttpRequest': Timeouts cannot be set for synchronous requests made from a document.");
					if (typeof value=="number") {
						self.VM.value.timeout=value;
						return value;
					} else {console.warn("输入值不为数字！")};
				},
				"enumerable":true
			}
		});
	}
	open(method,url,async=true,username=null,password=null) {
		if (!(this instanceof XMLHttpRequest)) throw new TypeError("Illegal invocation");
		if (typeof method=="undefined") throw new TypeError("Failed to execute 'open' on 'XMLHttpRequest': 2 arguments required, but only 0 present.");
		if (typeof url=="undefined") throw new TypeError("Failed to execute 'open' on 'XMLHttpRequest': 2 arguments required, but only 1 present.");
		switch (async) {
			case false:
				if (this.responseType!=="") throw new DOMException("Failed to execute 'open' on 'XMLHttpRequest': Synchronous requests from a document must not set a response type.");
				if (this.timeout!==0) throw new DOMException("Failed to execute 'open' on 'XMLHttpRequest': Synchronous requests must not set a timeout.");
				console.warn("[Deprecation] Synchronous XMLHttpRequest on the main thread is deprecated because of its detrimental effects to the end user's experience. For more help, check https://xhr.spec.whatwg.org/.");
				break;
			default:
				console.warn("参数错误：async");
				async=true;
			case true:
		}
		this.VM.stop=true;
		this.VM.abort=false;
		this.VM.timeout=false;
		this.VM.RequestHeader={
			":authority":location.host,
			":method":method.toUpperCase(),
			":path":url,
			":scheme":location.protocol,
			"accept":"*/*",
			"accept-encoding":"gzip, deflate, br",
			"accept-language":"zh-CN,zh;q=0.9,en;q=0.8,ja;q=0.7",
			"dnt":"1",
			"referer":location.href,
			"sec-fetch-mode":"cors",
			"sec-fetch-site":"same-origin",
			"user-agent":navigator.userAgent,
			"username":username,
			"password":password
		};
		this.VM.async=async;
		this.VM.method=method.toLowerCase();
		this.VM.url=url;
		this.VM.OPENED=true;
		this.VM.value.response="";
		this.VM.value.responseText="";
		this.VM.value.responseType="";
		this.VM.value.responseURL="";
		this.VM.value.responseXML=null,
		this.VM.value.status=0;
		this.VM.value.statusText="";
		this.VM.port.readyState=1;
	}
	send(body) {
		if (!(this instanceof XMLHttpRequest)) throw new TypeError("Illegal invocation");
		if (this.VM.OPENED!=true) throw new DOMException("Failed to execute 'send' on 'XMLHttpRequest': The object's state must be OPENED.");
		var inerror=XMLHttpRequest.NetworkError;
		var self=this;
		this.VM.OPENED=false;
		this.VM.stop=false;
		if (this.timeout>0) {
			setTimeout(function(){
				this.VM.port.readyState=4;
				this.VM.timeout=true;
				if (typeof this.VM.stop_request=="function") this.VM.stop_request();
			},this.timeout)
		};
		if (this.VM.async) {
			(async function() {
				if (!self.VM.stop&&typeof self.onloadstart=="function") await (async function(){
					try {self.onloadstart(new ProgressEvent("loadstart",{"currentTarget":self,"srcElement":self,"target":self,"loaded":0,"total":0}))} catch(error) {console.error(error)};
				})();
				if (self.VM.method=="post") {
					if (!self.VM.stop&&typeof self.upload.onloadstart=="function") await (async function(){
						try {self.upload.onloadstart(new ProgressEvent("loadstart",{"currentTarget":self,"srcElement":self,"target":self,"loaded":0,"total":1}))} catch(error) {console.error(error)};
					})();
					if (!self.VM.stop&&!inerror&&typeof self.upload.onprogress=="function") await (async function(){
						try {self.upload.onprogress(new ProgressEvent("progress",{"currentTarget":self,"srcElement":self,"target":self,"loaded":0,"total":1}))} catch(error) {console.error(error)};
					})
					if (!(self.VM.stop||self.VM.abort||self.VM.timeout||inerror)) console.log("发送数据",body);
					if (!self.VM.stop&&!inerror&&typeof self.upload.onload=="function") await (async function(){
						try {self.upload.onload(new ProgressEvent("load",{"currentTarget":self,"srcElement":self,"target":self,"loaded":1,"total":1}))} catch(error) {console.error(error)};
					})();
					if (!self.VM.stop) {
						switch (true) {
							case inerror:
								if (typeof self.upload.onerror=="function") try {self.upload.onerror(new ProgressEvent("error",{"currentTarget":self,"srcElement":self,"target":self,"loaded":0,"total":1}))} catch(error) {console.error(error)};
								break;
							case self.VM.timeout:
								if (typeof self.upload.ontimeout=="function") try {self.upload.ontimeout(new ProgressEvent("timeout",{"currentTarget":self,"srcElement":self,"target":self,"loaded":0,"total":1}))} catch(error) {console.error(error)};
								break;
							case self.VM.abort:
								if (typeof self.upload.onabort=="function") try {self.upload.onabort(new ProgressEvent("abort",{"currentTarget":self,"srcElement":self,"target":self,"loaded":0,"total":1}))} catch(error) {console.error(error)};
							default:
						}
					};
					if (!self.VM.stop&&typeof self.upload.onloadend=="function") await (async function(){
						try {self.upload.onloadend(new ProgressEvent("loadend",{"currentTarget":self,"srcElement":self,"target":self,"loaded":1,"total":1}))} catch(error) {console.error(error)};
					})();
				};
				if (!(self.VM.stop||self.VM.abort||self.VM.timeout||inerror)) self.VM.port.readyState=2;
				if (!(self.VM.stop||self.VM.abort||self.VM.timeout||inerror)) self.VM.port.readyState=3;
				if (!self.VM.stop&&!inerror&&typeof self.onprogress=="function") await (async function(){
					try {self.onprogress(new ProgressEvent("progress",{"currentTarget":self,"srcElement":self,"target":self,"loaded":0,"total":1}))} catch(error) {console.error(error)};
				})();
				if (!self.VM.stop&&!inerror&&typeof self.onprogress=="function") self.VM.progressID=setInterval(function(){
					if (!(self.VM.stop||self.VM.abort||self.VM.timeout||inerror)) try {self.onprogress(new ProgressEvent("progress",{"currentTarget":self,"srcElement":self,"target":self,"loaded":0,"total":1}))} catch(error) {console.error(error)};
				},50);
				if (!(self.VM.stop||self.VM.abort||self.VM.timeout||inerror)) {
					self.VM.value.responseURL=self.VM.url;
					if (typeof XHR_Local[self.VM.url]=="undefined") {
						var temp=await XHR_request(self.VM);
					} else {
						var temp=[true,XHR_Local[self.VM.url]];
					};
					if (temp[0]) {
						self.VM.value.status=200;
						self.VM.value.statusText="OK";
						self.VM.value.responseText=temp[1];
						switch (self.responseType.toLowerCase()) {
							case "json":
								self.VM.value.response=JSON.parse(self.VM.value.responseText);
								break;
							/*
							case "document":
								self.VM.value.response=JSON.parse(self.VM.value.responseText);
								break;
							*/
							default:
								self.VM.value.response=self.VM.value.responseText;
						};
					} else {
						self.VM.value.status=404;
						self.VM.value.statusText="Not Found";
					};
				};
				clearInterval(self.VM.progressID);
				if (!(self.VM.stop||self.VM.abort||self.VM.timeout)) self.VM.port.readyState=4;
				if (!self.VM.stop&&!inerror&&typeof self.onload=="function") await (async function(){
					try {self.onload(new ProgressEvent("load",{"currentTarget":self,"srcElement":self,"target":self,"loaded":1,"total":1}))} catch(error) {console.error(error)};
				})();
				if (!self.VM.stop) {
					switch (true) {
						case inerror:
							console.error(self.VM.method.toUpperCase(),self.VM.url,"net::ERR_VM_NETWORK_ERROR");
							if (typeof self.onerror=="function") try {self.onerror(new ProgressEvent("error",{"currentTarget":self,"srcElement":self,"target":self,"loaded":0,"total":1}))} catch(error) {console.error(error)};
							break;
						case self.VM.timeout:
							if (typeof self.ontimeout=="function") try {self.ontimeout(new ProgressEvent("timeout",{"currentTarget":self,"srcElement":self,"target":self,"loaded":0,"total":1}))} catch(error) {console.error(error)};
							break;
						case self.VM.abort:
							if (typeof self.onabort=="function") try {self.onabort(new ProgressEvent("abort",{"currentTarget":self,"srcElement":self,"target":self,"loaded":0,"total":1}))} catch(error) {console.error(error)};
						default:
					}
				};
				if (!self.VM.stop&&typeof self.onloadend=="function") await (async function(){
					try {self.onloadend(new ProgressEvent("loadend",{"currentTarget":self,"srcElement":self,"target":self,"loaded":1,"total":1}))} catch(error) {console.error(error)};
				})();
				self.VM.stop=true;
			})();
		} else {
			if (!this.VM.stop&&typeof this.onloadstart=="function") {
				try {this.onloadstart(new ProgressEvent("loadstart",{"currentTarget":this,"srcElement":this,"target":this,"loaded":0,"total":0}))} catch(error) {console.error(error)};
			};
			if (this.VM.method=="post") {
				if (!this.VM.stop&&typeof this.upload.onloadstart=="function") {
					try {this.upload.onloadstart(new ProgressEvent("loadstart",{"currentTarget":this,"srcElement":this,"target":this,"loaded":0,"total":1}))} catch(error) {console.error(error)};
				};
				if (!this.VM.stop&&!inerror&&typeof this.upload.onprogress=="function") {
					try {this.upload.onprogress(new ProgressEvent("progress",{"currentTarget":this,"srcElement":this,"target":this,"loaded":0,"total":1}))} catch(error) {console.error(error)};
				};
				if (!this.VM.stop&&!inerror) console.log("发送数据",body);
				if (!this.VM.stop&&!inerror&&typeof this.upload.onload=="function") {
					try {this.upload.onload(new ProgressEvent("load",{"currentTarget":this,"srcElement":this,"target":this,"loaded":1,"total":1}))} catch(error) {console.error(error)};
				};
				if (!this.VM.stop&&inerror){
					if (typeof this.upload.onerror=="function") try {this.upload.onerror(new ProgressEvent("error",{"currentTarget":this,"srcElement":this,"target":this,"loaded":0,"total":1}))} catch(error) {console.error(error)};
				};
				if (!this.VM.stop&&typeof this.upload.onloadend=="function") {
					try {this.upload.onloadend(new ProgressEvent("loadend",{"currentTarget":this,"srcElement":this,"target":this,"loaded":1,"total":1}))} catch(error) {console.error(error)};
				};
			};
			if (!this.VM.stop&&!inerror) this.VM.port.readyState=2;
			if (!this.VM.stop&&!inerror) this.VM.port.readyState=3;
			if (!this.VM.stop&&!inerror&&typeof this.onprogress=="function") {
				try {this.onprogress(new ProgressEvent("progress",{"currentTarget":this,"srcElement":this,"target":this,"loaded":0,"total":1}))} catch(error) {console.error(error)};
			};
			if (!this.VM.stop&&!inerror) {
				if (typeof XHR_Local[this.VM.url]=="undefined") {
					console.warn("未在预设库中找到请求的资源，在同步模式下禁止实时配置，请求失败。");
					this.VM.value.status=404;
					this.VM.value.statusText="Not Found";
					this.VM.value.responseURL=this.VM.url;
				} else {
					this.VM.value.status=200;
					this.VM.value.statusText="OK";
					this.VM.value.responseURL=this.VM.url;
					this.VM.value.responseText=XHR_Local[this.VM.url];
					switch (this.responseType.toLowerCase()) {
						case "json":
							this.VM.value.response=JSON.parse(this.VM.value.responseText);
							break;
						/*
						case "document":
							this.VM.value.response=JSON.parse(this.VM.value.responseText);
							break;
						*/
						default:
							this.VM.value.response=this.VM.value.responseText;
					};
				};
			};
			if (!this.VM.stop) this.VM.port.readyState=4;
			if (!this.VM.stop&&!inerror&&typeof this.onload=="function") {
				try {this.onload(new ProgressEvent("load",{"currentTarget":this,"srcElement":this,"target":this,"loaded":1,"total":1}))} catch(error) {console.error(error)};
			};
			if (!this.VM.stop&&inerror){
				console.error(this.VM.method.toUpperCase(),this.VM.url,"net::ERR_VM_NETWORK_ERROR");
				if (typeof this.onerror=="function") try {this.onerror(new ProgressEvent("error",{"currentTarget":this,"srcElement":this,"target":this,"loaded":0,"total":1}))} catch(error) {console.error(error)};
			};
			if (!this.VM.stop&&typeof this.onloadend=="function") {
				try {this.onloadend(new ProgressEvent("loadend",{"currentTarget":this,"srcElement":this,"target":this,"loaded":1,"total":1}))} catch(error) {console.error(error)};
			};
			this.VM.stop=true;
		};
	}
	abort() {
		if (!(this instanceof XMLHttpRequest)) throw new TypeError("Illegal invocation");
		if (this.readyState<2) return console.warn("此 XmlHttpRequest 尚未开始传输！");
		if (this.readyState==4) return console.warn("此 XmlHttpRequest 已经结束！");
		this.VM.port.readyState=4;
		this.VM.abort=true;
		if (typeof this.VM.stop_request=="function") this.VM.stop_request();
	}
	setRequestHeader(name,value) {
		if (!(this instanceof XMLHttpRequest)) throw new TypeError("Illegal invocation");
		if (this.VM.OPENED!=true) throw new DOMException("Failed to execute 'setRequestHeader' on 'XMLHttpRequest': The object's state must be OPENED.");
		this.VM.value.RequestHeader[name]=value;
	}
	getResponseHeader(name){
		if (!(this instanceof XMLHttpRequest)) throw new TypeError("Illegal invocation");
	}
	getAllResponseHeaders(){
		if (!(this instanceof XMLHttpRequest)) throw new TypeError("Illegal invocation");
	}
	overrideMimeType(mime){
		if (!(this instanceof XMLHttpRequest)) throw new TypeError("Illegal invocation");
		if (typeof mime=="undefined") throw new TypeError("Failed to execute 'overrideMimeType' on 'XMLHttpRequest': 1 argument required, but only 0 present.");
		this.VM.MimeType=mime;
		this.VM.value.RequestHeader.accept=mime;
	}
};
XMLHttpRequest.NetworkError=false;

//Notification 模拟
Notification=class {
	constructor(title,options) {
		if (typeof title=="undefined") throw new TypeError("Failed to construct 'Notification': 1 argument required, but only 0 present.");
		var model={"title":title,"body":"","image":"","icon":"","tag":"","data":"","timestamp":(new Date).getTime(),"dir":"auto","badge":"","lang":"","vibrate":[],"renotify":false,"silent":false,"sound":"","sticky":false,"requireInteraction":false,"noscreen":false};
		Object.assign(model,options);
		this.actions=[];
		this.badge=model.badge;
		this.body=model.body;
		this.data=model.data;
		this.dir=model.dir;
		this.icon=model.icon;
		this.image=model.image;
		this.lang=model.lang;
		this.onclick=null;
		this.onclose=null;
		this.onerror=null;
		this.onshow=null;
		this.renotify=model.renotify;
		this.requireInteraction=model.requireInteraction;
		this.silent=model.silent;
		this.tag=model.tag;
		this.timestamp=model.timestamp;
		this.title=model.title;
		this.vibrate=model.vibrate;
		this.VM={
			"autoClose":{"auto":false,"timeoutID":null},
			"CLOSED":false
		};
		var self=this;
		new Promise(function(done){
			setTimeout(function(){
				if (Notification.permission=="granted") {
					Notification.VM[Notification.VM_count]={
						"close":function(){self.close},
						"click":function() {
							if (self.VM.CLOSED!==true) {
								console.log("点击通知",self);
								if (self.VM.autoClose.auto) {
									clearTimeout(self.VM.autoClose.timeoutID);
									self.VM.autoClose.timeoutID=setTimeout(function(){self.close()},25000);
								};
								if (typeof self.onclick=="function") try {self.onclick()} catch(error) {console.error(error)};
							} else console.warn("此通知已经被关闭！");
						}
					};
					console.log("Notification Interface:",Notification.VM_count++);
					var preview={"icon":"","body":"","image":""};
					if (model.icon!=="") preview.icon="\"\\nicon:\",model.icon,";
					if (model.body!=="") preview.body=",\"\\nbody:\",model.body";
					if (model.image!=="") preview.image=",\"\\nicon:\",model.image";
					eval("console.log(\"Notification Content:\","+preview.icon+"\"\\ntitle:\",model.title"+preview.body+preview.image+")");
					if (model.requireInteraction!==true) {
						self.VM.autoClose.timeoutID=setTimeout(function(){self.close()},25000);
						self.VM.autoClose.auto=true;
					};
					if (typeof self.onshow=="function") try {self.onshow()} catch(error) {console.error(error)};
				} else console.warn("未获得通知权限",Notification.permission);
				done();
			},50)
		});
	}
	close(){
		if (!(this instanceof Notification)) throw new TypeError("Illegal invocation");
		if (this.VM.CLOSED!==true) {
			this.VM.CLOSED=true;
			clearTimeout(this.VM.autoClose.timeoutID);
			console.log("通知关闭",this);
			if (typeof this.onclose=="function") try {this.onclose()} catch(error) {console.error(error)};
		} else console.warn("此通知已经被关闭！");
	}
};
Notification.changePermission=(function(){
	if (window_board) {var permission="default"} else {var permission="granted"};
	Object.defineProperty(Notification,"permission",{
		"get":function(){return permission},
		"set":function(){return false},
		"enumerable":true
	});
	return function(n){
		switch (n) {
			case 0:
				permission="denied";
				break;
			case 1:
				permission="granted";
				break;
			default:
				permission="default";
		}
	}
})();
Notification.requestPermission=function(){
	if (Notification.permission=="default") {
		return new Promise(function(resolve,reject){
			var doc=HtmlArray.decoder([
				"您的脚本正在请求通知权限，请指定响应结果。",["br"],
				["br"],
				["button","允许",{
					"id":"Npb1",
					"style":"border:solid 1px #000000;border-radius:5px;transition:background-color 0.2s;margin-right:10px;float:left",
					"onmouseover":"javascript:this.style.backgroundColor='#FFFFFF'",
					"onmouseout":"javascript:this.style.backgroundColor=null"
				}],
				["button","禁止",{
					"id":"Npb2",
					"style":"border:solid 1px #000000;border-radius:5px;transition:background-color 0.2s;margin-right:10px;float:left",
					"onmouseover":"javascript:this.style.backgroundColor='#FFFFFF'",
					"onmouseout":"javascript:this.style.backgroundColor=null"
				}],
				["button","忽略",{
					"id":"Npb3",
					"style":"border:solid 1px #000000;border-radius:5px;transition:background-color 0.2s;float:left",
					"onmouseover":"javascript:this.style.backgroundColor='#FFFFFF'",
					"onmouseout":"javascript:this.style.backgroundColor=null"
				}]
			],"Notification Local");
			doc.getElementById("Npb1").addEventListener("click",function(){
				Notification.changePermission(1);
				window_board.hide();
				resolve(Notification.permission);
			});
			doc.getElementById("Npb2").addEventListener("click",function(){
				Notification.changePermission(0);
				window_board.hide();
				resolve(Notification.permission);
			});
			doc.getElementById("Npb3").addEventListener("click",function(){
				Notification.changePermission(2);
				window_board.hide();
				resolve(Notification.permission);
			});
			window_board.display(doc,"请求通知权限",true);
		});
	};
	return Promise.resolve(Notification.permission);
};
Notification.maxActions=2;
Notification.VM=[];
Notification.VM_count=0;

//cookie 模拟
(function() {
	var Local=[
		["News_log_ID_SabbatOfTheWitch","{\"have_read\":2583978669458}",-1]
	];
	function Manager() {
		for (let i=Local.length-1;i>-1;i--) {
			if (Local[i][2]!=-1) {if (!((new Date).getTime()<Local[i][2])) Local.splice(i,1)}
		}
	};
	Object.defineProperty(document,"cookie",{
		"get":function(){
			Manager();
			var result=""
			if (Local.length!=0) {
				result=Local[0][0]+"="+Local[0][1];
				for (let i=1,length=Local.length;i<length;i++) {
					result+="; "+Local[i][0]+"="+Local[i][1];
				}
			};
			return result;
		},
		"set":function(value){
			var temp=value.split(";");
			var maxAge=false;
			var expires=false;
			var data=temp[0].trim().split("=");
			if (data.length<2) {
				console.warn("cookie 字符串无效",value);
				return value;
			};
			var name=data[0];
			for (let i=Local.length-1;i>-1;i--) {
				if (Local[i][0]==name) Local.splice(i,1)
			};
			var cookie_value="";
			for (let i=1;i<data.length;i++) {
				switch (i) {
					case 1:
						var cookie_value=data[1];
						break;
					default:
						cookie_value+="="+data[i];
				};
			};
			for (let i=1;i<temp.length;i++) {
				let temp2=temp[i].split("=");
				switch (temp2[0]) {
					case "max-age":
						maxAge=temp2[1];
						break;
					case "expires":
						expires=temp2[1];
					default:
						break;
				}
			}
			if (expires) {
				try {
					if (typeof JSON.parse(expires)=="number") var temp3=false;
				} catch(no) {var temp3=true};
				if (temp3) {
					expires=new Date(expires).getTime();
					if (!(expires>-1)) expires=-1;
				} else expires=-1;
			} else expires=-1;
			if (maxAge) {
				try {
					if (typeof JSON.parse(maxAge)=="number") var temp3=true;
				} catch(no) {var temp3=false};
				if (temp3) {
					maxAge=new Date((new Date).getTime()+maxAge*1000).getTime();
					if (!(maxAge>-1)) maxAge=-1;
				} else maxAge=-1;
			} else maxAge=-1;
			if (maxAge>expires) expires=maxAge;
			Local.push([name,cookie_value,expires])
			Manager();
			return value;
		},
		"enumerable":true
	});
})();

//简易版load
Load=function(url,TargetElement,AllowCache) {
	var AJAXModel={"url":url};
	if (AllowCache===false) AJAXModel.cache=false;
	AJAXModel.success=function(response) {
		var Operator=document.createRange().createContextualFragment(response);
		EmptyElement(TargetElement);
		TargetElement.appendChild(Operator);
	};
	return AJAX(AJAXModel);
};