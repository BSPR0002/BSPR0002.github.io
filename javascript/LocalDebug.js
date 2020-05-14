//if (window.location.origin=="file://") { //本地模拟函数

//XHR模拟
var XHR_Local={
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
}

function XHR_request(url) {
	return new Promise(function(resolve,reject){
		if (window_board) {
			var doc=HtmlArray.decoder([
				"您的脚本正在通过 XmlHttpRequest 请求网络资源。",["br"],
				"请求的资源：",["br"],
				url,["br"],
				"XmlHttpRequest 本地模拟功能在脚本的预设库中找不到此资源，请您选择一个文件作为此资源的响应，或指定此次请求失败。",["br"],
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
					resolve([true,text]);
				});
			});
			doc.querySelector("button").addEventListener("click",function(){
				window_board.hide();
				resolve([false]);
			});
			window_board.display(doc,"请求文件",true)
		} else resolve([false]);
	});
};

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
}

class XMLHttpRequest {
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
		};
		var self=this;
		Object.defineProperty(this.VM.port,"readyState",{
			"get":function(){return this.VM.value.readyState},
			"set":function(value) {
				self.VM.value.readyState=value;
				if (typeof self.onreadystatechange=="function") try {self.onreadystatechange(new Event("readystatechange",{"currentTarget":self,"srcElement":self,"target":self}))} catch(error) {console.error(error)};
			},
		});
		this.onabort=null;
		this.onerror=null;
		this.onload=null;
		this.onloadend=null;
		this.onloadstart=null;
		this.onprogress=null;
		this.onreadystatechange=null;
		this.ontimeout=null;
		this.upload=new XMLHttpRequestUpload;
		this.withCredentials=false;
		Object.defineProperties(this,{
			"readyState":{
				"get":function(){return this.VM.value.readyState},
				"set":function(){console.warn("只读")}
			},
			"response":{
				"get":function(){return this.VM.value.response},
				"set":function(){console.warn("只读")}
			},
			"responseText":{
				"get":function(){return this.VM.value.responseText},
				"set":function(){console.warn("只读")}
			},
			"responseType":{
				"get":function(){return this.VM.value.responseType},
				"set":function(value){
					if (self.VM.async==false&&value!=="") throw new DOMException("Failed to set the 'responseType' property on 'XMLHttpRequest': The response type cannot be changed for synchronous requests made from a document.");
					self.VM.value.responseType=value;
				}
			},
			"responseURL":{
				"get":function(){return this.VM.value.responseURL},
				"set":function(){console.warn("只读")}
			},
			"responseXML":{
				"get":function(){return this.VM.value.responseXML},
				"set":function(){console.warn("只读")}
			},
			"status":{
				"get":function(){return this.VM.value.status},
				"set":function(){console.warn("只读")}
			},
			"statusText":{
				"get":function(){return this.VM.value.statusText},
				"set":function(){console.warn("只读")}
			},
			"timeout":{
				"get":function(){return this.VM.value.timeout},
				"set":function(value){
					if (self.VM.async==false&&value!==0) throw new DOMException("Failed to set the 'timeout' property on 'XMLHttpRequest': Timeouts cannot be set for synchronous requests made from a document.");
					if (typeof value=="number") {self.VM.value.timeout=value} else {console.warn("输入值不为数字！")};
				}
			}
		});
	}
	open(method,url,async=true,username=null,password=null) {
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
		if (this.VM.OPENED!=true) throw new DOMException("Failed to execute 'send' on 'XMLHttpRequest': The object's state must be OPENED.");
		var inerror=XMLHttpRequest.NetworkError;
		var self=this;
		this.VM.OPENED=false;
		this.VM.stop=false;
		if (this.timeout>0) {
			setTimeout(function(){
				this.VM.port.readyState=4;
				this.VM.timeout=true;
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
						var temp=await XHR_request(self.VM.url);
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
				setInterval(self.VM.progressID);
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
		if (this.readyState<2) return console.warn("此 XmlHttpRequest 尚未开始传输！");
		if (this.readyState==4) return console.warn("此 XmlHttpRequest 已经结束！");
		this.VM.port.readyState=4;
		this.VM.abort=true;
	}
	setRequestHeader(name,value) {
		if (this.VM.OPENED!=true) throw new DOMException("Failed to execute 'setRequestHeader' on 'XMLHttpRequest': The object's state must be OPENED.");
		this.VM.value.RequestHeader[name]=value;
	}
	getResponseHeader(name){}
	getAllResponseHeaders(){}
	overrideMimeType(mime){
		if (typeof mime=="undefined") throw new TypeError("Failed to execute 'overrideMimeType' on 'XMLHttpRequest': 1 argument required, but only 0 present.");
		this.VM.MimeType=mime;
		this.VM.value.RequestHeader.accept=mime;
	}
}
XMLHttpRequest.NetworkError=false;

//Cookies模拟
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

//通知模拟
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
//};