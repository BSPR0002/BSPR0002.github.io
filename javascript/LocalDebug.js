//require ES2020
//本地模拟支持
if (window.location.origin!="file://") throw new Error("Not in local environment!");

//XMLHttpRequest 模拟
XMLHttpRequestResponser=class XMLHttpRequestResponser {
	get [Symbol.toStringTag](){return "XMLHttpRequestResponser"}
	static #VM=[];
	static get VM(){return this.#VM}
	static #prepare={};
	static get prepare(){return this.#prepare}
	static responseLast(){
		var i=this.#VM.length-1;
		if (i==-1) return "无请求";
		if (this.#VM[i]) return this.#VM[i].select();
		return "上个 XHR 已失效，请手动查找。"
	};
	static responseNext(){
		for (let i=0,l=this.#VM.length;i<l;i++) if (this.#VM[i]) return this.#VM[i].select();
		return "没有正在等待响应的请求。"
	};
	static cleanVM(){
		for (let i=this.#VM.length-1;i>-1;i--) if (this.#VM[i]==null) this.#VM.splice(i,1);
		return "清理已完成。"
	}
	constructor(async){this.#async=Boolean(async)}
	#stopRequest(){
		this.#available=false;
		this.#unhook();
	}
	#unhook(){
		if (!this.#VMHooked) return;
		this.constructor.#VM[this.#VMID]=null;
		this.#VMHooked=false;
	}
	get stopRequest(){return this.#stopRequest}
	#VMHooked=false;
	#VMID=-1;
	#async=null;
	#available=true;
	#headersReceived=false;
	#receivedHeaders=null;
	#requestMethod="";
	#requestBody=null;
	#response={"headers":null,"status":null,"body":null};
	post(data){
		if (!this.#available) return [0];
		switch (data[0]) {
			default:
				this.#stopRequest()
				return [0];
			case "request headers":
				return this.#receiveHeaders(data[1]);
			case "post body":
				return this.#responseBody()
		}
	}
	#receiveHeaders(headers){
		if (this.#headersReceived) {
			this.#available=false;
			return [0]
		}
		this.#headersReceived=true;
		this.#receivedHeaders=headers;
		if (typeof headers=="object"&&headers!=null) {
			switch (headers[":method"]) {
				default:
					this.#setResponse(501,"501 Not Implemented");
					return this.#responseHeaders();
				case "GET":
				//case "POST":
					this.#requestMethod=headers[":method"];
			}
			if (typeof headers[":path"]!="undefined") return this.#processHeaders();
		}	else {
			this.#setResponse(400,"400 Bad Request");
			return this.#responseHeaders()
		}
	}
	#processHeaders(){
		//if (this.#requestMethod=="POST") return [1,"post body"];
		return this.#process();
	}
	#setResponse(status,body){
		this.#response.headers={
			":status":status,
			"Content-Length":body.size,
			"Content-Type":"*/*;charset=utf-8,",
			"Date":(new Date).toUTCString()
		};
		this.#response.body=body
	}
	#process(){
		var url=this.#receivedHeaders[":path"];
		if (typeof this.constructor.#prepare[url]!="undefined") {
			this.#setResponse(200,new Blob([this.constructor.#prepare[url]]),this.constructor.#prepare[url])
		} else {
			if (!this.#async) {
				this.#setResponse(404,"404 Not Found");
				console.warn("未在预设库中找到请求的资源，在同步模式下禁止实时配置，请求失败。")
			} else {
				var self=this;
				return new Promise(function(resolve,reject){
					self.#VMHooked=true;
					var ID=self.#VMID=self.constructor.#VM.length;
					self.constructor.#VM.push({
						"url":url,
						"select":function(){
							var VM=document.createElement("input");
							VM.type="file";
							VM.addEventListener("change",function(){
								self.#unhook();
								self.#setResponse(200,this.files[0]);
								resolve(self.#responseHeaders())
							},{"once":true});
							VM.dispatchEvent(new MouseEvent("click",{"button":0}));
							return url;
						},
						"fail":function(){
							self.#stopRequest()
							self.#setResponse(404,"404 Not Found");
							resolve(self.#responseHeaders())
						}
					});
					console.log("新的待指定 xhr 请求：",url,"\n交互编号：",ID,"\n快速通道：XMLHttpRequestResponser.VM["+ID+"].select()");
				})
			}
		}
		return this.#responseHeaders()
	}
	#responseHeaders(){return [1,"response headers",this.#response.headers]}
	#responseBody(){
		this.#available=false;
		return [2,"response body",this.#response.body]
	}
}
//XMLHttpRequest 模拟
var XHR_Local={ //JSON 预设库
	
};
for (let i in XHR_Local) if (XHR_Local[i]??typeof XHR_Local[i]=="object") XMLHttpRequestResponser.prepare[i]=JSON.stringify(XHR_Local[i]);

XMLHttpRequestEventTarget=class XMLHttpRequestEventTarget extends EventTarget {
	constructor(){
		if (arguments[0]!="LocalDebug") throw new TypeError("Illegal constructor");
		super();
		for (let eventName of ["abort","error","load","loadend","loadstart","progress","timeout"]) this.addEventListener(eventName,function(event){if (this["on"+eventName]) this["on"+eventName](event)});
	}
	#onabort=null;
	#onerror=null;
	#onload=null;
	#onloadend=null;
	#onloadstart=null;
	#onprogress=null;
	#ontimeout=null;
	get onabort(){return this.#onabort}
	get onerror(){return this.#onerror}
	get onload(){return this.#onload}
	get onloadend(){return this.#onloadend}
	get onloadstart(){return this.#onloadstart}
	get onprogress(){return this.#onprogress}
	get ontimeout(){return this.#ontimeout}
	set onabort(value){
		if (typeof value=="function"||value===null) this.#onabort=value;
		return value
	}
	set onerror(value){
		if (typeof value=="function"||value===null) this.#onerror=value;
		return value
	}
	set onload(value){
		if (typeof value=="function"||value===null) this.#onloadend=value;
		return value
	}
	set onloadend(value){
		if (typeof value=="function"||value===null) this.#onloadend=value;
		return value
	}
	set onloadstart(value){
		if (typeof value=="function"||value===null) this.#onloadstart=value;
		return value
	}
	set onprogress(value){
		if (typeof value=="function"||value===null) this.#onprogress=value;
		return value
	}
	set ontimeout(value){
		if (typeof value=="function"||value===null) this.#ontimeout=value;
		return value
	}
	get [Symbol.toStringTag](){return "XMLHttpRequestEventTarget"}
}

XMLHttpRequestUpload=class XMLHttpRequestUpload extends XMLHttpRequestEventTarget {
	constructor(){
		if (arguments[0]!="LocalDebug") throw new TypeError("Illegal constructor");
		super(arguments[0]);
	}
	get [Symbol.toStringTag](){return "XMLHttpRequestUpload"}
}

XMLHttpRequest=class XMLHttpRequest extends XMLHttpRequestEventTarget {
	constructor(){
		super("LocalDebug");
		this.addEventListener("readystatechange",function(event){if (this.onreadystatechange) this.onreadystatechange(event)});
	}
	static #UNSENT=0;
	static #OPENED=1;
	static #HEADERS_RECEIVED=2;
	static #LOADING=3;
	static #DONE=4;
	static get UNSENT(){return this.#UNSENT}
	static get OPENED(){return this.#OPENED}
	static get HEADERS_RECEIVED(){return this.#HEADERS_RECEIVED}
	static get LOADING(){return this.#LOADING}
	static get DONE(){return this.#DONE}
	static #statusList={"100":"Continue","101":"Switching Protocols","102":"Processing","200":"OK","201":"Created","202":"Accepted","203":"Non-Authoritative Information","204":"No Content","205":"Reset Content","206":"Partial Content","207":"Multi-Status","300":"Multiple Choices","301":"Moved Permanently","302":"Move Temporarily","303":"See Other","304":"Not Modified","305":"Use Proxy","306":"Switch Proxy","307":"Temporary Redirect","400":"Bad Request","401":"Unauthorized","402":"Payment Required","403":"Forbidden","404":"Not Found","405":"Method Not Allowed","406":"Not Acceptable","407":"Proxy Authentication Required","408":"Request Timeout","409":"Conflict","410":"Gone","411":"Length Required","412":"Precondition Failed","413":"Request Entity Too Large","414":"Request-URI Too Long","415":"Unsupported Media Type","416":"Requested Range Not Satisfiable","417":"Expectation Failed","418":"I'm a teapot","421":"Misdirected Request","422":"Unprocessable Entity","423":"Locked","424":"Failed Dependency","425":"Too Early","426":"Upgrade Required","449":"Retry With","451":"Unavailable For Legal Reasons","500":"Internal Server Error","501":"Not Implemented","502":"Bad Gateway","503":"Service Unavailable","504":"Gateway Timeout","505":"HTTP Version Not Supported","506":"Variant Also Negotiates","507":"Insufficient Storage","509":"Bandwidth Limit Exceeded","510":"Not Extended","600":"Unparseable Response Headers"};
	get UNSENT(){return this.constructor.#UNSENT}
	get OPENED(){return this.constructor.#OPENED}
	get HEADERS_RECEIVED(){return this.constructor.#HEADERS_RECEIVED}
	get LOADING(){return this.constructor.#LOADING}
	get DONE(){return this.constructor.#DONE}
	#onreadystatechange=null;
	get onreadystatechange(){return this.#onreadystatechange}
	set onreadystatechange(value){
		if (typeof value=="function"||value===null) this.#onreadystatechange=value;
		return value
	}
	#async=true;
	#readyState=0;
	#changeReadyState(value){
		var temp=this.#readyState;
		this.#readyState=value;
		if (temp!=value) this.dispatchEvent(new Event("readystatechange",{"currentTarget":this,"srcElement":this,"target":this}));
	}
	get readyState(){return this.#readyState}
	#response="";
	#responseText="";
	#responseURL="";
	#responseXML=null;
	#status=0;
	#statusText="";
	get response(){return this.#response}
	get responseText(){return this.#responseText}
	get responseURL(){return this.#responseURL}
	get responseXML(){return this.#responseXML}
	get status(){return this.#status}
	get statusText(){return this.#statusText}
	#responseType="";
	get responseType(){return this.#responseType}
	set responseType(value){
		if (this.#async==false&&value!=="") throw new DOMException("Failed to set the 'responseType' property on 'XMLHttpRequest': The response type cannot be changed for synchronous requests made from a document.");
		if (["","arraybuffer","blob","document","json","text"].indexOf(value)==-1) {
			console.warn("The provided value '"+value+"' is not a valid enum value of type XMLHttpRequestResponseType.")
		} else this.#responseType=value;
		return value;
	}
	#timeout=0;
	get timeout(){return this.#timeout}
	set timeout(value){
		if (this.#async==false) throw new DOMException("Failed to set the 'timeout' property on 'XMLHttpRequest': Timeouts cannot be set for synchronous requests made from a document.");
		if (isNaN(value)) {this.#timeout=0} else this.#timeout=Number(value);
		return value;
	}
	#timeoutID=-1;
	#withCredentials=false;
	get withCredentials(){return this.#withCredentials}
	set withCredentials(value){
		this.#withCredentials=value?true:false;
		return value;
	}
	#RequestHeaders={};
	#ResponseHeaders={};
	#mimeType="";
	#progressID=-1;
	static NetworkError=false;
	#Exception={"stop":true,"abort":false,"timeout":false,"error":false};
	get #inNetworkError(){return Boolean(this.constructor.NetworkError)}
	#isStoped(networkError=true,stop=true,exception=true) {
		networkError=networkError?this.#inNetworkError:false;
		stop=stop?this.#Exception.stop:false;
		exception=exception?this.#Exception.abort||this.#Exception.timeout||this.#Exception.error:false;
		return networkError||stop||exception
	}
	#upload=new XMLHttpRequestUpload("LocalDebug");
	get upload(){return this.#upload}
	#responser=null;
	get [Symbol.toStringTag](){return "XMLHttpRequest"}
	open(method,url,async=true,username=null,password=null) {
		if (!(this instanceof XMLHttpRequest)) throw new TypeError("Illegal invocation");
		if (arguments.length<2) throw new TypeError("Failed to execute 'open' on 'XMLHttpRequest': 2 arguments required, but only "+arguments.length+" present.");
		method=String(method);
		{
			let hasTypeError=false,hasDOMException=false,validCharacterCodes=[33,35,36,37,38,39,42,43,45,46,48,49,50,51,52,53,54,55,56,57,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,124,126];
			for (let l=method.length,i=0;i<l;i++) {
				let temp=method.charCodeAt(i);
				if (temp>255) throw new TypeError("Failed to execute 'open' on 'XMLHttpRequest': Value is not a valid ByteString.");
				if (!hasDOMException&&validCharacterCodes.indexOf(temp)==-1) hasDOMException=true;
			}
			if (hasDOMException||method.length==0) throw new DOMException("Failed to execute 'open' on 'XMLHttpRequest': '"+method+"' is not a valid HTTP method.");
		}
		if (!(async)) {
			if (this.#responseType!=="") throw new DOMException("Failed to execute 'open' on 'XMLHttpRequest': Synchronous requests from a document must not set a response type.");
			if (this.#timeout!==0) throw new DOMException("Failed to execute 'open' on 'XMLHttpRequest': Synchronous requests must not set a timeout.");
			console.warn("[Deprecation] Synchronous XMLHttpRequest on the main thread is deprecated because of its detrimental effects to the end user's experience. For more help, check https://xhr.spec.whatwg.org/.");
		}
		this.#responser?.stopRequest();
		this.#Exception.stop=true;
		this.#Exception.abort=false;
		this.#Exception.timeout=false;
		this.#Exception.error=false;
		this.#RequestHeaders={
			":authority":location.host,
			":method":method.toUpperCase(),
			":path":url.trim(),
			":scheme":location.protocol,
			"accept":"*/*",
			"accept-language":"zh-CN,zh;q=0.9,en;q=0.8,ja;q=0.7",
			"referer":location.href,
			"sec-fetch-mode":"cors",
			"user-agent":navigator.userAgent
		};
		if (username) this.#RequestHeaders[":username"]=username;
		if (password) this.#RequestHeaders[":password"]=password;
		this.#ResponseHeaders={};
		this.#async=async;
		this.#response="";
		this.#responseText="";
		this.#responseType="";
		this.#responseURL="";
		this.#responseXML=null,
		this.#status=0;
		this.#statusText="";
		this.#changeReadyState(1);
	}
	async #asyncRequest(responser,body){
		var responser=this.#responser;
		if (!this.#isStoped(0,1,1)) this.dispatchEvent(new ProgressEvent("loadstart",{"currentTarget":this,"srcElement":this,"target":this,"loaded":0,"total":0}));
		await new Promise(function(resolve){setTimeout(resolve,0)});
		if (!this.#isStoped()) {
			var response=await responser.post(["request headers",this.#RequestHeaders]);
			switch (response[1]) {
				case "post body":
					let upload=this.upload;
					let uploadTotal=new Blob([body]).size;
					if (!this.#isStoped()) upload.dispatchEvent(new ProgressEvent("loadstart",{"currentTarget":upload,"srcElement":upload,"target":upload,"loaded":0,"total":uploadTotal}));
					if (!this.#isStoped()) upload.dispatchEvent(new ProgressEvent("progress",{"currentTarget":upload,"srcElement":upload,"target":upload,"loaded":0,"total":uploadTotal}));
					if (!this.#isStoped()) response=await responser.post(["request body",body]);
					if (!this.#isStoped()) upload.dispatchEvent(new ProgressEvent("load",{"currentTarget":upload,"srcElement":upload,"target":upload,"loaded":uploadTotal,"total":uploadTotal}));
					if (!this.#isStoped(1,1,0)) {
						switch (true) {
							case this.#Exception.error:
								upload.dispatchEvent(new ProgressEvent("error",{"currentTarget":upload,"srcElement":upload,"target":upload,"loaded":0,"total":uploadTotal}));
								break;
							case this.#Exception.timeout:
								upload.dispatchEvent(new ProgressEvent("timeout",{"currentTarget":upload,"srcElement":upload,"target":upload,"loaded":0,"total":uploadTotal}));
								break;
							case this.#Exception.abort:
								upload.dispatchEvent(new ProgressEvent("abort",{"currentTarget":upload,"srcElement":upload,"target":upload,"loaded":0,"total":uploadTotal}));
							default:
						}
					};
					if (!this.#isStoped()) upload.dispatchEvent(new ProgressEvent("loadend",{"currentTarget":upload,"srcElement":upload,"target":upload,"loaded":uploadTotal,"total":uploadTotal}));
				case "response headers":
					this.#status=response[2][":status"];
					this.#statusText=this.constructor.#statusList[this.#status]??"";
					if (!this.#isStoped()) this.#changeReadyState(2);
					let downloadTotal=Number(response[2]["Content-Length"]);
					if (!this.#isStoped()) this.#changeReadyState(3);
					if (!this.#isStoped()) this.dispatchEvent(new ProgressEvent("progress",{"currentTarget":this,"srcElement":this,"target":this,"loaded":0,"total":downloadTotal}));
					if (!this.#isStoped()) response=await responser.post(["post body"]);
					this.#responser=null;
					if (!this.#isStoped()) this.dispatchEvent(new ProgressEvent("progress",{"currentTarget":this,"srcElement":this,"target":this,"loaded":downloadTotal,"total":downloadTotal}));
					this.#responseText=await new Promise(function(resolve){
						var Operator=new FileReader;
						Operator.readAsText(response[2]);
						Operator.onload=function(){resolve(this.result)};
					});
					if (this.#status==200) {
						switch (this.#responseType) {
							case "json":
								try {this.#response=JSON.parse(this.#responseText)} catch(error) {console.error(error)}
								break;
							case "blob":
								this.#response=new Blob([response[2]]);
								break;
							/*
							case "document":
								this.#responseXML=null;
								this.#response=this.#responseXML;
								break;
							*/
							default:
								this.#response=this.#responseText;
						}
					} else this.#response=this.#responseText;
					if (!this.#isStoped()) this.#changeReadyState(4);
					if (!this.#isStoped()) this.dispatchEvent(new ProgressEvent("load",{"currentTarget":this,"srcElement":this,"target":this,"loaded":downloadTotal,"total":downloadTotal}));
					if (!this.#isStoped(1,1,0)) {
						switch (true) {
							case this.#Exception.error:
								responser.stopRequest();
								this.dispatchEvent(new ProgressEvent("error",{"currentTarget":this,"srcElement":this,"target":this,"loaded":0,"total":downloadTotal}));
								break;
							case this.#Exception.timeout:
								responser.stopRequest();
								this.dispatchEvent(new ProgressEvent("timeout",{"currentTarget":this,"srcElement":this,"target":this,"loaded":0,"total":downloadTotal}));
								break;
							case this.#Exception.abort:
								responser.stopRequest();
								this.dispatchEvent(new ProgressEvent("abort",{"currentTarget":this,"srcElement":this,"target":this,"loaded":0,"total":downloadTotal}));
							default:
						}
					};
					if (this.#inNetworkError) console.error(this.#RequestHeaders[":method"],this.#RequestHeaders[":path"],"net::ERR_VM_NETWORK_ERROR");
					if (!this.#isStoped()) this.dispatchEvent(new ProgressEvent("loadend",{"currentTarget":this,"srcElement":this,"target":this,"loaded":downloadTotal,"total":downloadTotal}));
					this.#Exception.stop=true;
			}
		}
	}
	#syncRequest(responser,body){
		var responser=this.#responser;
		if (!this.#isStoped()) this.dispatchEvent(new ProgressEvent("loadstart",{"currentTarget":this,"srcElement":this,"target":this,"loaded":0,"total":0}));
		if (!this.#isStoped()) {
			var response=responser.post(["request headers",this.#RequestHeaders]);
			switch (response[1]) {
				case "post body":
					if (!this.#isStoped()) response=responser.post(["request body",body]);
				case "response headers":
					this.#status=response[2][":status"];
					this.#statusText=this.#statusList[this.#status]?this.#statusList[this.#status]:"";
					let downloadTotal=Number(response[2]["Content-Length"]);
					response=responser.post(["post body"]);
					this.#responser=null;
					this.#responseText=response[3];
					this.#response=this.#responseText;
					if (!this.#isStoped()) this.#changeReadyState(4);
					if (!this.#isStoped()) this.dispatchEvent(new ProgressEvent("load",{"currentTarget":this,"srcElement":this,"target":this,"loaded":downloadTotal,"total":downloadTotal}));
					if (!this.#isStoped(1,1,0)) {
						switch (true) {
							case this.#Exception.error:
								responser.stopRequest();
								this.dispatchEvent(new ProgressEvent("error",{"currentTarget":this,"srcElement":this,"target":this,"loaded":0,"total":downloadTotal}));
								break;
							case this.#Exception.timeout:
								responser.stopRequest();
								this.dispatchEvent(new ProgressEvent("timeout",{"currentTarget":this,"srcElement":this,"target":this,"loaded":0,"total":downloadTotal}));
								break;
							case this.#Exception.abort:
								responser.stopRequest();
								this.dispatchEvent(new ProgressEvent("abort",{"currentTarget":this,"srcElement":this,"target":this,"loaded":0,"total":downloadTotal}));
							default:
						}
					};
					if (this.#inNetworkError) console.error(this.#RequestHeaders[":method"],this.#RequestHeaders[":path"],"net::ERR_VM_NETWORK_ERROR");
					if (!this.#isStoped()) this.dispatchEvent(new ProgressEvent("loadend",{"currentTarget":this,"srcElement":this,"target":this,"loaded":downloadTotal,"total":downloadTotal}));
					this.#Exception.stop=true;
			}
		}
	}
	send(body=null) {
		if (!(this instanceof XMLHttpRequest)) throw new TypeError("Illegal invocation");
		if (body??true) body="";
		switch (typeof body) {
			case "object":
				break;
			case "number":
			case "bigint":
			case "boolean":
				body=String(body);
				break;
			default:
		}
		if (this.#readyState!=1) throw new DOMException("Failed to execute 'send' on 'XMLHttpRequest': The object's state must be OPENED.");
		if (this.#inNetworkError) {
			console.error(this.#RequestHeaders[":method"],this.#RequestHeaders[":path"],"net::ERR_VM_NETWORK_ERROR");
			throw new DOMException("Failed to execute 'send' on 'XMLHttpRequest': Failed to load '"+this.#RequestHeaders[":path"]+"'.");
		}
		this.#Exception.stop=false;
		if (document.cookie!="") this.#RequestHeaders.Cookie=document.cookie;
		this.dispatchEvent(new ProgressEvent("loadstart",{"currentTarget":this,"srcElement":this,"target":this,"loaded":0,"total":0}));
		if (this.#timeout>0) {
			this.#timeoutID=setTimeout(function(){
				this.#changeReadyState(4);
				this.#Exception.timeout=true;
			},this.#timeout)
		}
		this.#responser=new XMLHttpRequestResponser(this.#async);
		if (this.#async) {
			this.#asyncRequest(body)
		} else {
			this.#syncRequest(body)
		}
	}
	abort() {
		if (!(this instanceof XMLHttpRequest)) throw new TypeError("Illegal invocation");
		if (!this.#responser) return console.warn("此 XmlHttpRequest 尚未开始传输！");
		if (this.#readyState==4) return console.warn("此 XmlHttpRequest 已经结束！");
		this.#changeReadyState(4);
		this.#Exception.abort=true;
		this.#responser.post(0)
	}
	setRequestHeader(name,value) {
		if (!(this instanceof XMLHttpRequest)) throw new TypeError("Illegal invocation");
		if (this.#readyState!=1) throw new DOMException("Failed to execute 'setRequestHeader' on 'XMLHttpRequest': The object's state must be OPENED.");
		console.warn("Function 'setRequestHeader' still building.");
	}
	getResponseHeader(name){
		if (!(this instanceof XMLHttpRequest)) throw new TypeError("Illegal invocation");
		console.warn("Function 'getResponseHeader' still building.");
		return "";
	}
	getAllResponseHeaders(){
		if (!(this instanceof XMLHttpRequest)) throw new TypeError("Illegal invocation");
		console.warn("Function 'getAllResponseHeaders' still building.");
		return "";
	}
	overrideMimeType(mime){
		if (!(this instanceof XMLHttpRequest)) throw new TypeError("Illegal invocation");
		if (arguments.length<1) throw new TypeError("Failed to execute 'overrideMimeType' on 'XMLHttpRequest': 1 argument required, but only 0 present.");
		console.warn("Function 'overrideMimeType' still building.")
	}
}

//Notification 模拟（桌面版）
Notification=class Notification extends EventTarget{
	get [Symbol.toStringTag](){return "Notification"}
	static get #Interface(){
		var Interface=document.getElementById(":NotificationInterface");
		if (!Interface) {
			Interface=document.createElement("div");
			Interface.id=":NotificationInterface";
			Interface.style="position:fixed;bottom:0;right:0;width:360px;margin:16px;display:grid;grid-gap:16px;grid-template-rows:repeat(auto,auto)";
			document.body.appendChild(Interface);
		}
		return Interface
	}
	static maxActions=2;
	static #VM={};
	static #VM_show=[];
	static #VM_wait=[];
	static #VM_count=0;
	static #GRANTED=false;
	static get GRANTED(){return this.#GRANTED}
	static set GRANTED(value){
		this.#GRANTED=Boolean(value);
		return value
	}
	static #Permission=(function (){
		var permission=localStorage.getItem(":NotificationVMPermission");
		switch (permission) {
			default:
				return "default";
			case "granted":
			case "denied":
				return permission;
		}
	})();
	static get #permission(){return this.#GRANTED?"granted":this.#Permission}
	static get permission(){return this.#permission}
	static #looked=false;
	static #requestPermissionTrys=(function (){
		var times=parseInt(localStorage.getItem(":NotificationVMRequestPermissionTrys"));
		return isNaN(times)||times<0?0:times
	})();
	static #resetPermission(){
		if (this.#permission=="default"||this.#looked) return "未进行操作。";
		this.#Permission="default";
		localStorage.removeItem(":NotificationVMPermission");
		localStorage.removeItem(":NotificationVMRequestPermissionTrys");
		this.#looked=true;
		return "通知权限状态已重置，请刷新页面应用设置。"
	}
	static get resetPermission(){return this.#resetPermission}
	static #requestingPermission=false;
	static #requestProcessor=null;
	static requestPermission(deprecatedCallback=null){
		if (this.#permission=="default") {
			var self=this;
			var processor=this.requestingPermission?this.#requestProcessor:this.#requestProcessor=new Promise(function(resolve){
				if (self.#looked) {
					console.warn("【Notification 模拟】\n通知权限状态已被锁定，出现此情况一般是由于通知权限被重置，请刷新页面后重试。");
					return resolve(self.#permission);
				}
				if (self.#requestPermissionTrys>2) {
					localStorage.setItem(":NotificationVMPermission",self.#Permission="denied");
					console.warn("【Notification 模拟】\n您的通知权限请求提示已多次被关闭，用户代理自动拒绝了您的请求。\n如果您是在模拟用户行为时触发了此效果，您或许需要在请求权限前进行说明并引导用户授权。如果用户执意关闭，那么此时您不应该再打扰用户。\n你可以通过执行“Notification.resetPermission()”来重置模拟授权状态，重置后可刷新页面重新模拟授权过程。");
					return resolve(self.#permission)
				}
				self.requestingPermission=true;
				localStorage.setItem(":NotificationVMRequestPermissionTrys",++self.#requestPermissionTrys);
				function closeInterface(){
					Protection.style.display="block";
					self.clientTop;
					localStorage.setItem(":NotificationVMPermission",self.#Permission);
					self.requestingPermission=false;
					resolve(self.#permission);
					Interface.addEventListener("transitionend",function(){this.parentNode?.removeChild(this)},{"once":true});
					Interface.style.opacity=0;
				}
				var identifier=Symbol("NotificationRequestPermissionInterface");
				var Interface=document.createElement("div");
				Interface.id=":NotificationRequestPermissionInterface";
				Interface.style="position:fixed;margin:8px;width:320px;height:128px;box-sizing:border-box;display:none;grid-template-rows:auto 20px 32px;grid-gap:10px;padding:16px;box-shadow:0px 0px 8px #000000;border-radius:4px;background-color:#FFFFFF;color:#000000;opacity:0;transition:opacity 0.3s ease-in-out;z-index:2147483647";
				Interface[identifier]=true;
				var Title=document.createElement("div");
				var TitleDomain=document.createElement("span");
				TitleDomain.innerText=location?.hostname==""?"此网站":location.hostname;
				Title.appendChild(TitleDomain);
				var TitleWant=document.createElement("span");
				TitleWant.innerText=" 想要";
				TitleWant.style=TitleDomain.style="display:inline;color:#000000;font-size:14px;font-weight:bold";
				Title.appendChild(TitleWant);
				Interface.appendChild(Title);
				var Permission=document.createElement("div");
				Permission.style="display:grid;grid-template-columns:20px 1fr;grid-gap:8px;place-items:center start;font-size:12px";
				var PermissionIcon=document.createElement("canvas");
				PermissionIcon.height=PermissionIcon.width=20;
				PermissionIcon.style.display="inline-block";
				var canvas=PermissionIcon.getContext("2d");
				canvas.strokeStyle="#000000";
				canvas.lineWidth=1;
				canvas.moveTo(0,16);
				canvas.lineTo(20,16);
				canvas.stroke();
				canvas.beginPath();
				canvas.moveTo(3,16);
				canvas.arc(10,8,7,-Math.PI,0);
				canvas.lineTo(17,16);
				canvas.stroke();
				canvas.beginPath();
				canvas.moveTo(12,16);
				canvas.arc(10,17,2,0,Math.PI);
				canvas.lineTo(8,17);
				canvas.stroke();
				Permission.appendChild(PermissionIcon);
				var PermissionName=document.createElement("span");
				PermissionName.innerText="显示通知";
				PermissionName.style="display:inline";
				Permission.appendChild(PermissionName);
				Interface.appendChild(Permission);
				var Buttons=document.createElement("div");
				Buttons.style="height:100%;display:grid;grid-template-columns:64px 64px;grid-gap:8px;place-self:end";
				var Grant=document.createElement("button")
				Grant.innerText="允许";
				Grant.addEventListener("click",function(){
					self.#Permission="granted";
					closeInterface()
				},{"once":true});
				Buttons.appendChild(Grant);
				var Deny=document.createElement("button")
				Deny.innerText="拒绝";
				Deny.addEventListener("click",function(){
					self.#Permission="denied";
					closeInterface()
				},{"once":true});
				Deny.style=Grant.style="height:100%;width:64px;border-radius:2px;border:solid 2px #7F7F7F;background-color:#EFEFEF;transition:background-color 0.5s ease-in-out;font-size:12px;font-weight:bold;color:#000000";
				function ColorLight(){this.style.backgroundColor="#EFEFEF"}
				function ColorDark(){this.style.backgroundColor="#D8D8D8"}
				function ColorTransparent(){this.style.backgroundColor="transparent"}
				Grant.addEventListener("mouseleave",ColorLight);
				Deny.addEventListener("mouseleave",ColorLight);
				Grant.addEventListener("mouseover",ColorDark);
				Deny.addEventListener("mouseover",ColorDark);
				Buttons.appendChild(Deny);
				Interface.appendChild(Buttons);
				var Close=document.createElement("button");
				Close.style="position:absolute;right:4px;top:4px;width:20px;height:20px;display:block;padding:0;border:none;background-color:transparent;transition:background-color 0.5s ease-in-out;overflow:hidden";
				var CloseIcon=document.createElement("canvas");
				CloseIcon.height=CloseIcon.width=20;
				CloseIcon.style="position:absolute;display:inline-block;top:0;left:0";
				canvas=CloseIcon.getContext("2d");
				canvas.strokeStyle="#000000";
				canvas.lineWidth=1;
				canvas.moveTo(5.5,5.5);
				canvas.lineTo(14.5,14.5);
				canvas.stroke();
				canvas.beginPath();
				canvas.moveTo(14.5,5.5);
				canvas.lineTo(5.5,14.5);
				canvas.stroke();
				Close.appendChild(CloseIcon);
				Close.addEventListener("click",closeInterface,{"once":true});
				Close.addEventListener("mouseleave",ColorTransparent);
				Close.addEventListener("mouseover",ColorDark);
				Interface.appendChild(Close);
				var Protection=document.createElement("div");
				Protection.style="position:absolute;display:block;margin:0;width:100%;height:100%;opacity:0";
				Interface.appendChild(Protection);
				var temp=document.getElementById(":NotificationRequestPermissionInterface");
				temp?.parentNode.removeChild(temp);
				document.body.appendChild(Interface);
				Interface.style.display="grid";
				Interface.clientTop;
				Interface.addEventListener("transitionend",function(){Protection.style.display="none"},{"once":true});
				Interface.style.opacity=1;
			});
			processor.then(deprecatedCallback);
			return processor
		}
		if (this.#permission=="denied") console.warn("【Notification 模拟】\n您的通知权限已被设置为“拒绝”。\n你可以通过执行“Notification.resetPermission()”来重置模拟授权状态，重置后可刷新页面重新模拟授权过程。");
		var result=Promise.resolve(this.#permission);
		result.then(deprecatedCallback);
		return result
	}
	static #reject() {
		if (!confirm("您正在进行的操作即将收回此网站的通知权限，您确定吗？\n收回权限将会清空页面上的所有通知，并重置此网站的通知权限。")) return;
		this.#resetPermission();
		for (let item of this.#VM_wait) item(false);
		var Interface=this.#Interface;
		Interface?.parentNode.removeChild(Interface);
		for (let item of this.#VM_show) item.#close();
	}
	#action=[];
	#badge="";
	#body="";
	#data=null;
	#dir="auto";
	#icon="";
	#image="";
	#lang="";
	#renotify=false;
	#requireInteraction=false;
	#silent=false;
	#tag="";
	#timestamp=Date.now();
	#title="";
	#vibrate=[];
	get action(){return this.#action}
	get badge(){return this.#badge}
	get body(){return this.#body}
	get data(){return this.#data}
	get dir(){return this.#dir}
	get icon(){return this.#icon}
	get image(){return this.#image}
	get lang(){return this.#lang}
	get renotify(){return this.#renotify}
	get requireInteraction(){return this.#requireInteraction}
	get silent(){return this.#silent}
	get tag(){return this.#tag}
	get timestamp(){return this.#timestamp}
	get title(){return this.#title}
	get vibrate(){return this.#vibrate}
	#onclick=null;
	#onclose=null;
	#onerror=null;
	#onshow=null;
	get onclick(){return this.#onclick}
	get onclose(){return this.#onclose}
	get onerror(){return this.#onerror}
	get onshow(){return this.#onshow}
	set onclick(value){
		if (typeof value=="function"||value===null) this.#onclick=value;
		return value
	}
	set onclose(value){
		if (typeof value=="function"||value===null) this.#onclose=value;
		return value
	}
	set onerror(value){
		if (typeof value=="function"||value===null) this.#onerror=value;
		return value
	}
	set onshow(value){
		if (typeof value=="function"||value===null) this.#onshow=value;
		return value
	}
	#closed=false;
	#hooked=false;
	#element=null;
	#updateSince=-1;
	#timing=-1;
	constructor(title,options) {
		if (arguments.length<1) throw new TypeError("Failed to construct 'Notification': 1 argument required, but only 0 present.");
		super();
		for (let eventName of ["click","close","error","show"]) this.addEventListener(eventName,function(event){if (this["on"+eventName]) this["on"+eventName](event)});
		this.#title=String(title);
		var setting={};
		if (typeof (options??false)=="object") {
			for (let item in options) {
				switch (item) {
					case "dir":
						let dir=String(options[item]);
						if (["auto","ltr","rtl"].indexOf(dir)==-1) throw new TypeError("Failed to construct 'Notification': The provided value '"+dir+"' is not a valid enum value of type NotificationDirection.");
					case "badge":
					case "body":
					case "icon":
					case "image":
					case "lang":
					case "sound":
					case "tag":
						setting[item]=String(options[item]);
						break;
					case "renotify":
						if (options[item]&&!("tag" in options)) throw new TypeError("Failed to construct 'Notification': Notifications which set the renotify flag must specify a non-empty tag.");
					case "noscreen":
					case "requireInteraction":
					case "silent":
					case "sticky":
						setting[item]=Boolean(options[item]);
						break;
					case "vibrate":
						let vibrate=options[item];
						if (vibrate instanceof Array) {
							for (let item in vibrate) {
								let data=Number(vibrate[item]);
								vibrate[item]=(isNaN(data))?0:data;
							}
							setting[item]=vibrate
						} else {
							let data=Number(vibrate);
							if (isNaN(data)) data=0;
							setting[item]=[data]
						}
						break;
					case "actions":
						let actions=options[item];
						if (typeof (actions??false)!="object") throw new TypeError("Failed to construct 'Notification': The provided value cannot be converted to a sequence.");
						if (typeof (actions[Symbol.iterator]??false)!="function") throw new TypeError("Failed to construct 'Notification': The object must have a callable @@iterator property.");
						for (let item of actions) throw new TypeError("Failed to construct 'Notification': Actions are only supported for persistent notifications shown using ServiceWorkerRegistration.showNotification().");
					case "data":
						setting[item]=options[item];
					default:
						break;
				}
			}
		}
		if ("badge" in setting) this.#badge=setting.badge;
		if ("body" in setting) this.#body=setting.body;
		if ("data" in setting) this.#data=setting.data;
		if ("dir" in setting) this.#dir=setting.dir;
		if ("icon" in setting) this.#icon=setting.icon;
		if ("image" in setting) this.#image=setting.image;
		if ("lang" in setting) this.#lang=setting.lang;
		if ("renotify" in setting) this.#renotify=setting.renotify;
		if ("requireInteraction" in setting) this.#requireInteraction=setting.requireInteraction;
		if ("silent" in setting) this.#silent=setting.silent;
		if ("tag" in setting) this.#tag=setting.tag;
		if ("vibrate" in setting) this.#vibrate=setting.vibrate;
		if (this.constructor.#permission!="granted") return console.log("【Notification 模拟】\n未获得通知权限，通知绘制过程已被跳过，通知显示失败。");
		var self=this;
		new Promise(async function(resolve,reject){
			function request(url){
				return new Promise(function(resolve){
					var XHR=new XMLHttpRequest;
					XHR.open("get",url);
					XHR.responseType="blob";
					XHR.onload=function(){
						if ((this.status>=200&&this.status<300)||this.status==304) {
							resolve(URL.createObjectURL(this.response));
						} else resolve(false);
					}
					XHR.onerror=function(){resolve(false)};
					XHR.send();
				})
			}
			if (self.#icon!="") {
				let data=await request(self.#icon);
				var icon=data?data:false;
			}
			if (self.#image!="") {
				let data=await request(self.#image);
				var image=data?data:false;
			}
			var frame=document.createElement("div");
			frame.style="display:grid;grid-template-rows:20px 1fr;padding:8px;background-color:#FFFFFF;max-height:384px;box-shadow:0px 0px 8px #000000;transition-duration:0.5s;transition-property:opacity,transform";
			var topBar=document.createElement("div");
			topBar.style="display:grid;grid-template-columns:30px 1fr 64px 20px 20px;grid-gap:8px";
			var tTitle=document.createElement("span");
			tTitle.style.fontSize="15px";
			tTitle.innerText="通知";
			topBar.appendChild(tTitle);
			var tDomain=document.createElement("span");
			tDomain.style="font-size:12px;align-self:center;white-space:nowrap;text-overflow:ellipsis;overflow:hidden";
			tDomain.innerText=location?.hostname==""?"此网站":location.hostname;
			topBar.appendChild(tDomain);
			var tDuration=document.createElement("span");
			tDuration.style="font-size:12px;place-self:center end;overflow:hidden";
			tDuration.innerText="刚才";
			topBar.appendChild(tDuration);
			var tReject=document.createElement("button");
			tReject.style="position:relative;width:20px;height:20px;display:block;padding:0;border:none;background-color:transparent;transition:background-color 0.5s ease-in-out;overflow:hidden";
			{
				let RejectIcon=document.createElement("canvas");
				RejectIcon.height=RejectIcon.width=20;
				RejectIcon.style="position:absolute;display:inline-block;top:0;left:0";
				let canvas=RejectIcon.getContext("2d");
				canvas.strokeStyle="#000000";
				canvas.lineWidth=1;
				canvas.moveTo(14.5,10);
				canvas.arc(10,10,4.5,0,2*Math.PI);
				canvas.stroke();
				canvas.beginPath();
				canvas.moveTo(6.8,6.8);
				canvas.lineTo(13.2,13.2);
				canvas.stroke();
				tReject.appendChild(RejectIcon);
			}
			tReject.addEventListener("click",function(){self.constructor.#reject()});
			tReject.addEventListener("mouseleave",function(){this.style.backgroundColor="transparent"});
			tReject.addEventListener("mouseover",function(){this.style.backgroundColor="#D8D8D8"});
			topBar.appendChild(tReject);
			var tClose=document.createElement("button");
			tClose.style="position:relative;width:20px;height:20px;display:block;padding:0;border:none;background-color:transparent;transition:background-color 0.5s ease-in-out;overflow:hidden";
			{
				let CloseIcon=document.createElement("canvas");
				CloseIcon.height=CloseIcon.width=20;
				CloseIcon.style="position:absolute;display:inline-block;top:0;left:0";
				let canvas=CloseIcon.getContext("2d");
				canvas.strokeStyle="#000000";
				canvas.lineWidth=1;
				canvas.moveTo(5.5,5.5);
				canvas.lineTo(14.5,14.5);
				canvas.stroke();
				canvas.beginPath();
				canvas.moveTo(14.5,5.5);
				canvas.lineTo(5.5,14.5);
				canvas.stroke();
				tClose.appendChild(CloseIcon);
			}
			tClose.addEventListener("click",self.#close.bind(self),{"once":true});
			tClose.addEventListener("mouseleave",function(){this.style.backgroundColor="transparent"});
			tClose.addEventListener("mouseover",function(){this.style.backgroundColor="#D8D8D8"});
			topBar.appendChild(tClose);
			frame.appendChild(topBar);
			var content=document.createElement("div");
			content.style="position:relative;padding:8px;display:grid;grid-gap:8px;color:#000000;overflow:hidden";
			content.style.gridTemplateAreas="\""+(icon?"icon ":"")+"message\""+(image?"\""+(icon?"image ":"")+"image\"":"");
			content.style.gridTemplateColumns=icon?"auto 1fr":null;
			content.style.gridTemplateRows="auto"+(image?" 1fr":"");
			if (icon) {
				let temp=document.createElement("img");
				temp.src=icon;
				temp.style="max-width:60px;max-height:60px;grid-area:icon;place-self:center";
				content.appendChild(temp);
			}
			var message=document.createElement("div");
			var mTitle=document.createElement("p");
			mTitle.innerText=self.#title;
			mTitle.style="display:-webkit-box;margin:0;-webkit-box-orient:vertical;-webkit-line-clamp:1;font-weight:bold;font-size:15px;width:100%;word-break:break-all;text-overflow:ellipsis;overflow:hidden";
			message.appendChild(mTitle);
			if (self.#body) {
				let mBody=document.createElement("p");
				mBody.innerText=self.#body;
				mBody.style="display:-webkit-box;margin:0;-webkit-box-orient:vertical;-webkit-line-clamp:2;font-size:15px;width:100%;word-break:break-all;text-overflow:ellipsis;overflow:hidden";
				message.appendChild(mBody);
			}
			content.appendChild(message);
			if (image) {
				let temp=document.createElement("img");
				temp.src=image;
				temp.style="max-width:100%;max-height:284px;grid-area:image;place-self:center";
				content.appendChild(temp);
			}
			content.addEventListener("click",function(){
				if (!self.#requireInteraction) {
					clearTimeout(self.#timing);
					self.#timing=setTimeout(self.#close.bind(self),50000);
				}
				self.dispatchEvent(new Event("click",{"currentTarget":self,"srcElement":self,"target":self}));
			})
			frame.appendChild(content);
			self.#element=frame;
			//if (!(await self.constructor.#manager(self.#tag))) self.#close();
			if (self.#closed) return resolve();
			self.constructor.#VM_show.push(self);
			self.dispatchEvent(new Event("show",{"currentTarget":self,"srcElement":self,"target":self}));
			{
				let showed=false;
				if (self.#tag) {
					let mate=self.constructor.#VM[self.#tag];
					if (mate) {
						mate.#element.parentNode?.replaceChild(frame,mate.#element);
						//if (this.#renotify) notice();
						showed=true;
						mate.#close();
					} 
					self.constructor.#VM[self.#tag]=self;
					self.#hooked=true;
				}
				if (!showed) {
					frame.style.transform="translateX(400px)";
					self.constructor.#Interface.prepend(frame);
					frame.clientTop;
					frame.style.transform=null;
				}
			}
			if (!self.#requireInteraction) self.#timing=setTimeout(self.#close.bind(self),25000);
			{
				let duration=0;
				self.#updateSince=setInterval(function(){
					duration++
					tDuration.innerText=duration<60?duration+" 分钟前":duration<1440?Math.floor(duration/60)+" 小时前":duration<11520?Math.floor(duration/1440)+" 天前":"猴年马月";
				},60000);
			}
			resolve();
		});
	}
	#close(){
		if (this.#closed) return;
		this.#closed=true;
		clearTimeout(this.#timing);
		clearInterval(this.#updateSince);
		this.dispatchEvent(new Event("close",{"currentTarget":this,"srcElement":this,"target":this}));
		var dad=this.constructor;
		if (this.#hooked) delete dad.#VM[this.#tag];
		dad.#VM_show.splice(dad.#VM_show.indexOf(this));
		this.#element.addEventListener("transitionend",function(){this.parentNode?.removeChild(this)},{"once":true});
		this.#element.style.opacity=0;
	}
	get close(){return this.#close}
};

//cookie 模拟
(function() {
	var Local=[
		//["cookie name","cookie value",-1(expires)]
	];
	function Manager() {
		for (let i=Local.length-1;i>-1;i--) {
			if (Local[i][2]!=-1) {if (!(Date.now()<Local[i][2])) Local.splice(i,1)}
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
				} catch(none) {var temp3=true};
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
					maxAge=new Date(Date.now()+maxAge*1000).getTime();
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