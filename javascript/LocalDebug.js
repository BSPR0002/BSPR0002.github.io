//本地模拟支持
if (window.location.origin!="file://") throw new Error("Not in local environment!");

//XMLHttpRequest 模拟
var XHR_Local={ //JSON 预设库
	"/json/News.json":[
		{
			"ID":"Example",
			"name":"示例",
			"title":"标题",
			"preview":{
				"message":"简短预览内容",
				"image":"预览小图片"
			},
			"board":["HtmlArray","详细内容"],
			"force":false
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

XMLHttpRequestEventTarget=class extends EventTarget {
	constructor(check){
		if (check!=XMLHttpRequestEventTarget.check) throw new TypeError("Illegal constructor");
		super();
		var VM={
			"onabort":null,
			"onerror":null,
			"onload":null,
			"onloadend":null,
			"onloadstart":null,
			"onprogress":null,
			"ontimeout":null
		};
		for (let item in VM) {
			Object.defineProperty(this,item,{
				"get":function(){return VM[item]},
				"set":function(value){if (typeof value=="function"||value===null) VM[item]=value},
				"configurable":true,
				"enumerable":true
			});
			let EventName="";
			for (let i=2,length=item.length;i<length;i++) EventName+=item[i];
			this.addEventListener(EventName,function(event){if (this[item]) this[item](event)})
		}
	};
	static check=Symbol("XMLHttpRequestEventTarget");
};

XMLHttpRequestUpload=class extends XMLHttpRequestEventTarget {
	constructor(check){
		if (check!=XMLHttpRequestUpload.check) throw new TypeError("Illegal constructor");
		super(XMLHttpRequestEventTarget.check);
	};
	static check=Symbol("XMLHttpRequestUpload");
};

XMLHttpRequest=class extends XMLHttpRequestEventTarget {
	constructor(){
		super(XMLHttpRequestEventTarget.check);
		var self=this;
		var VM={
			"value":{
				"onreadystatechange":null,
				"readyState":0,
				"response":"",
				"responseText":"",
				"responseType":"",
				"responseURL":"",
				"responseXML":null,
				"status":0,
				"statusText":"",
				"timeout":0,
				"withCredentials":false,
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
		for (let item of ["readyState","response","responseText","responseURL","responseXML","status","statusText"]) {
			Object.defineProperty(this,item,{
				"get":function(){return VM.value[item]},
				"set":function(){console.warn("只读")},
				"configurable":true,
				"enumerable":true
			});
		};
		Object.defineProperties(this,{
			"responseType":{
				"get":function(){return VM.value.responseType},
				"set":function(value){
					if (VM.async==false&&value!=="") throw new DOMException("Failed to set the 'responseType' property on 'XMLHttpRequest': The response type cannot be changed for synchronous requests made from a document.");
					if (["","arraybuffer","blob","document","json","text"].indexOf(value)==-1) {
						console.warn("The provided value '"+value+"' is not a valid enum value of type XMLHttpRequestResponseType.")
					} else VM.value.responseType=value;
					return value;
				},
				"configurable":true,
				"enumerable":true
			},
			"timeout":{
				"get":function(){return VM.value.timeout},
				"set":function(value){
					if (VM.async==false&&value!==0) throw new DOMException("Failed to set the 'timeout' property on 'XMLHttpRequest': Timeouts cannot be set for synchronous requests made from a document.");
					if (typeof value=="number") {VM.value.timeout=value} else console.warn("输入值不为数字！");
					return value;
				},
				"configurable":true,
				"enumerable":true
			},
			"withCredentials":{
				"get":function(){return VM.value.withCredentials},
				"set":function(value){VM.value.withCredentials=value?true:false},
				"configurable":true,
				"enumerable":true
			},
			"onreadystatechange":{
				"get":function(){return VM.value.onreadystatechange},
				"set":function(value){if (typeof value=="function"||value===null) VM.value.onreadystatechange=value},
				"configurable":true,
				"enumerable":true
			}
		});
		this.addEventListener("readystatechange",function(event){if (this.onreadystatechange) this.onreadystatechange(event)})
		Object.defineProperty(VM.port,"readyState",{
			"get":function(){return VM.value.readyState},
			"set":function(value) {
				VM.value.readyState=value;
				self.dispatchEvent(new Event("readystatechange",{"currentTarget":self,"srcElement":self,"target":self}));
			},
			"configurable":true,
			"enumerable":true
		});
		this.open=function(method,url,async=true,username=null,password=null) {
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
			VM.stop=true;
			VM.abort=false;
			VM.timeout=false;
			VM.RequestHeader={
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
			VM.async=async;
			VM.method=method.toLowerCase();
			VM.url=url;
			VM.OPENED=true;
			VM.value.response="";
			VM.value.responseText="";
			VM.value.responseType="";
			VM.value.responseURL="";
			VM.value.responseXML=null,
			VM.value.status=0;
			VM.value.statusText="";
			VM.port.readyState=1;
		};
		this.send=function(body) {
			if (!(this instanceof XMLHttpRequest)) throw new TypeError("Illegal invocation");
			if (VM.OPENED!=true) throw new DOMException("Failed to execute 'send' on 'XMLHttpRequest': The object's state must be OPENED.");
			var inerror=XMLHttpRequest.NetworkError;
			VM.OPENED=false;
			VM.stop=false;
			if (this.timeout>0) {
				setTimeout(function(){
					VM.port.readyState=4;
					VM.timeout=true;
					if (typeof VM.stop_request=="function") VM.stop_request();
				},this.timeout)
			};
			if (VM.async) {
				(async function() {
					if (!VM.stop) await (async function(){self.dispatchEvent(new ProgressEvent("loadstart",{"currentTarget":self,"srcElement":self,"target":self,"loaded":0,"total":0}))})();
					if (VM.method=="post") {
						if (!VM.stop) await (async function(){self.upload.dispatchEvent(new ProgressEvent("loadstart",{"currentTarget":self,"srcElement":self,"target":self,"loaded":0,"total":1}))})();
						if (!VM.stop&&!inerror) await (async function(){self.upload.dispatchEvent(new ProgressEvent("progress",{"currentTarget":self,"srcElement":self,"target":self,"loaded":0,"total":1}))})
						if (!(VM.stop||VM.abort||VM.timeout||inerror)) console.log("发送数据",body);
						if (!VM.stop&&!inerror) await (async function(){self.upload.dispatchEvent(new ProgressEvent("load",{"currentTarget":self,"srcElement":self,"target":self,"loaded":1,"total":1}))})();
						if (!VM.stop) {
							switch (true) {
								case inerror:
									self.upload.dispatchEvent(new ProgressEvent("error",{"currentTarget":self,"srcElement":self,"target":self,"loaded":0,"total":1}));
									break;
								case VM.timeout:
									self.upload.dispatchEvent(new ProgressEvent("timeout",{"currentTarget":self,"srcElement":self,"target":self,"loaded":0,"total":1}));
									break;
								case VM.abort:
									self.upload.dispatchEvent(new ProgressEvent("abort",{"currentTarget":self,"srcElement":self,"target":self,"loaded":0,"total":1}));
								default:
							}
						};
						if (!VM.stop) await (async function(){self.upload.dispatchEvent(new ProgressEvent("loadend",{"currentTarget":self,"srcElement":self,"target":self,"loaded":1,"total":1}))})();
					};
					if (!(VM.stop||VM.abort||VM.timeout||inerror)) VM.port.readyState=2;
					if (!(VM.stop||VM.abort||VM.timeout||inerror)) VM.port.readyState=3;
					if (!VM.stop&&!inerror) await (async function(){self.dispatchEvent(new ProgressEvent("progress",{"currentTarget":self,"srcElement":self,"target":self,"loaded":0,"total":1}))})();
					if (!VM.stop&&!inerror) VM.progressID=setInterval(function(){if (!(VM.stop||VM.abort||VM.timeout||inerror)) self.dispatchEvent(new ProgressEvent("progress",{"currentTarget":self,"srcElement":self,"target":self,"loaded":0,"total":1}))},50);
					if (!(VM.stop||VM.abort||VM.timeout||inerror)) {
						VM.value.responseURL=VM.url;
						if (typeof XHR_Local[VM.url]=="undefined") {
							var temp=await XHR_request(VM);
						} else {
							var temp=[true,XHR_Local[VM.url]];
						};
						if (temp[0]) {
							VM.value.status=200;
							VM.value.statusText="OK";
							VM.value.responseText=temp[1];
							switch (self.responseType.toLowerCase()) {
								case "json":
									VM.value.response=JSON.parse(VM.value.responseText);
									break;
								/*
								case "document":
									VM.value.response=JSON.parse(VM.value.responseText);
									break;
								*/
								default:
									VM.value.response=VM.value.responseText;
							};
						} else {
							VM.value.status=404;
							VM.value.statusText="Not Found";
						};
					};
					clearInterval(VM.progressID);
					if (!(VM.stop||VM.abort||VM.timeout)) VM.port.readyState=4;
					if (!VM.stop&&!inerror) await (async function(){self.dispatchEvent(new ProgressEvent("load",{"currentTarget":self,"srcElement":self,"target":self,"loaded":1,"total":1}))})();
					if (!VM.stop) {
						switch (true) {
							case inerror:
								console.error(VM.method.toUpperCase(),VM.url,"net::ERR_VM_NETWORK_ERROR");
								self.dispatchEvent(new ProgressEvent("error",{"currentTarget":self,"srcElement":self,"target":self,"loaded":0,"total":1}));
								break;
							case VM.timeout:
								self.dispatchEvent(new ProgressEvent("timeout",{"currentTarget":self,"srcElement":self,"target":self,"loaded":0,"total":1}));
								break;
							case VM.abort:
								self.dispatchEvent(new ProgressEvent("abort",{"currentTarget":self,"srcElement":self,"target":self,"loaded":0,"total":1}));
							default:
						}
					};
					if (!VM.stop) await (async function(){self.dispatchEvent(new ProgressEvent("loadend",{"currentTarget":self,"srcElement":self,"target":self,"loaded":1,"total":1}))})();
					VM.stop=true;
				})();
			} else {
				if (!VM.stop) this.dispatchEvent(new ProgressEvent("loadstart",{"currentTarget":this,"srcElement":this,"target":this,"loaded":0,"total":0}));
				if (VM.method=="post") {
					if (!VM.stop) this.upload.dispatchEvent(new ProgressEvent("loadstart",{"currentTarget":this,"srcElement":this,"target":this,"loaded":0,"total":1}));
					if (!VM.stop&&!inerror) this.upload.dispatchEvent(new ProgressEvent("progress",{"currentTarget":this,"srcElement":this,"target":this,"loaded":0,"total":1}));
					if (!VM.stop&&!inerror) console.log("发送数据",body);
					if (!VM.stop&&!inerror) this.upload.dispatchEvent(new ProgressEvent("load",{"currentTarget":this,"srcElement":this,"target":this,"loaded":1,"total":1}));
					if (!VM.stop&&inerror) this.upload.dispatchEvent(new ProgressEvent("error",{"currentTarget":this,"srcElement":this,"target":this,"loaded":0,"total":1}));
					if (!VM.stop) this.upload.dispatchEvent(new ProgressEvent("loadend",{"currentTarget":this,"srcElement":this,"target":this,"loaded":1,"total":1}));
				};
				if (!VM.stop&&!inerror) VM.port.readyState=2;
				if (!VM.stop&&!inerror) VM.port.readyState=3;
				if (!VM.stop&&!inerror) this.dispatchEvent(new ProgressEvent("progress",{"currentTarget":this,"srcElement":this,"target":this,"loaded":0,"total":1}));
				if (!VM.stop&&!inerror) {
					if (typeof XHR_Local[VM.url]=="undefined") {
						console.warn("未在预设库中找到请求的资源，在同步模式下禁止实时配置，请求失败。");
						VM.value.status=404;
						VM.value.statusText="Not Found";
						VM.value.responseURL=VM.url;
					} else {
						VM.value.status=200;
						VM.value.statusText="OK";
						VM.value.responseURL=VM.url;
						VM.value.responseText=XHR_Local[VM.url];
						VM.value.response=VM.value.responseText;
					};
				};
				if (!VM.stop) VM.port.readyState=4;
				if (!VM.stop&&!inerror) this.dispatchEvent(new ProgressEvent("load",{"currentTarget":this,"srcElement":this,"target":this,"loaded":1,"total":1}));
				if (!VM.stop&&inerror){
					console.error(VM.method.toUpperCase(),VM.url,"net::ERR_VM_NETWORK_ERROR");
					this.dispatchEvent(new ProgressEvent("error",{"currentTarget":this,"srcElement":this,"target":this,"loaded":0,"total":1}));
				};
				if (!VM.stop) this.dispatchEvent(new ProgressEvent("loadend",{"currentTarget":this,"srcElement":this,"target":this,"loaded":1,"total":1}));
				VM.stop=true;
			};
		};
		this.abort=function() {
			if (!(this instanceof XMLHttpRequest)) throw new TypeError("Illegal invocation");
			if (this.readyState<2) return console.warn("此 XmlHttpRequest 尚未开始传输！");
			if (this.readyState==4) return console.warn("此 XmlHttpRequest 已经结束！");
			VM.port.readyState=4;
			VM.abort=true;
			if (typeof VM.stop_request=="function") VM.stop_request();
		};
		this.setRequestHeader=function(name,value) {
			if (!(this instanceof XMLHttpRequest)) throw new TypeError("Illegal invocation");
			if (VM.OPENED!=true) throw new DOMException("Failed to execute 'setRequestHeader' on 'XMLHttpRequest': The object's state must be OPENED.");
			VM.value.RequestHeader[name]=value;
		};
		this.getResponseHeader=function(name){
			if (!(this instanceof XMLHttpRequest)) throw new TypeError("Illegal invocation");
		};
		this.getAllResponseHeaders=function(){
			if (!(this instanceof XMLHttpRequest)) throw new TypeError("Illegal invocation");
		};
		this.overrideMimeType=function(mime){
			if (!(this instanceof XMLHttpRequest)) throw new TypeError("Illegal invocation");
			if (typeof mime=="undefined") throw new TypeError("Failed to execute 'overrideMimeType' on 'XMLHttpRequest': 1 argument required, but only 0 present.");
			this.VM.MimeType=mime;
			this.VM.value.RequestHeader.accept=mime;
		};
	};
	DONE=4;
	HEADERS_RECEIVED=2;
	LOADING=3;
	OPENED=1;
	UNSENT=0;
	upload=new XMLHttpRequestUpload(XMLHttpRequestUpload.check);
	static NetworkError=false;
}

//Notification 模拟
Notification=class extends EventTarget{
	constructor(title,options) {
		if (typeof title=="undefined") throw new TypeError("Failed to construct 'Notification': 1 argument required, but only 0 present.");
		super();
		var self=this;
		var model={"title":title,"body":"","image":"","icon":"","tag":"","data":"","timestamp":(new Date).getTime(),"dir":"auto","badge":"","lang":"","vibrate":[],"renotify":false,"silent":false,"sound":"","sticky":false,"requireInteraction":false,"noscreen":false};
		Object.assign(model,options);
		var VM={
			"onclick":null,
			"onclose":null,
			"onerror":null,
			"onshow":null,
			"autoClose":{"auto":false,"timeoutID":null},
			"CLOSED":false
		};
		for (let item of ["onclick","onclose","onerror","onshow"]) {
			Object.defineProperty(this,item,{
				"get":function(){return VM[item]},
				"set":function(value){if (typeof value=="function"||value===null) VM[item]=value},
				"configurable":true,
				"enumerable":true
			});
			let EventName="";
			for (let i=2,length=item.length;i<length;i++) EventName+=item[i];
			this.addEventListener(EventName,function(event){if (this[item]) this[item](event)})
		};
		this.actions=[];
		this.badge=model.badge;
		this.body=model.body;
		this.data=model.data;
		this.dir=model.dir;
		this.icon=model.icon;
		this.image=model.image;
		this.lang=model.lang;
		this.renotify=model.renotify;
		this.requireInteraction=model.requireInteraction;
		this.silent=model.silent;
		this.tag=model.tag;
		this.timestamp=model.timestamp;
		this.title=model.title;
		this.vibrate=model.vibrate;
		this.close=function(){
			if (!(this instanceof Notification)) throw new TypeError("Illegal invocation");
			if (VM.CLOSED!=true) {
				VM.CLOSED=true;
				clearTimeout(VM.autoClose.timeoutID);
				console.log("通知关闭",this);
				this.dispatchEvent(new Event("close",{"currentTarget":this,"srcElement":this,"target":this}));
			} else console.warn("此通知已经被关闭！");
		};
		new Promise(function(done){
			setTimeout(function(){
				if (Notification.permission=="granted") {
					Notification.VM[Notification.VM_count]={
						"close":function(){self.close()},
						"click":function() {
							if (VM.CLOSED!=true) {
								console.log("点击通知",self);
								if (VM.autoClose.auto) {
									clearTimeout(VM.autoClose.timeoutID);
									VM.autoClose.timeoutID=setTimeout(function(){self.close()},25000);
								};
								self.dispatchEvent(new Event("click",{"currentTarget":this,"srcElement":this,"target":this}));
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
						VM.autoClose.timeoutID=setTimeout(function(){self.close()},25000);
						VM.autoClose.auto=true;
					};
					self.dispatchEvent(new Event("show",{"currentTarget":this,"srcElement":this,"target":this}));
				} else console.warn("未获得通知权限",Notification.permission);
				done();
			},50);
		});
	};
	static maxActions=2;
	static VM=[];
	static VM_count=0;
	static GRANTED=false;
};
Notification.changePermission=(function() {
	if (Notification.GRANTED) {var permission="granted"} else {var permission="default"};
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
Notification.requestPermission=function() {
	if (Notification.permission=="default") {
		if (Notification.requestPermission.trys<3) {
			Notification.requestPermission.trys++;
			return new Promise(function(resolve,reject){
				Notification.requestPermission.set=function(permission) {
					delete Notification.requestPermission.set;
					Notification.changePermission(permission);
					resolve(Notification.permission);
				};
				console.log("您的脚本正在请求通知权限，请指定响应结果。\n通道：Notification.requestPermission.set()\n参数：0:禁止，1:允许，2:忽略");
			});
		} else {
			Notification.changePermission(0);
			console.warn("Notifications permission has been blocked as the user has dismissed the permission prompt several times. This can be reset in Page Info which can be accessed by clicking the lock icon next to the URL. See https://www.chromestatus.com/features/6443143280984064 for more information.");
			return Promise.resolve(Notification.permission);
		};
	};
	return Promise.resolve(Notification.permission);
};
Notification.requestPermission.trys=0;

//cookie 模拟
(function() {
	var Local=[
		//["cookie name","cookie value",-1(expires)]
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