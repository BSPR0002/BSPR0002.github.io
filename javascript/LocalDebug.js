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
		for (let i=0,l=this.#VM.length-1;i<l;i++) if (this.#VM[i]) return this.#VM[i].select();
		return "没有正在等待响应的请求。"
	};
	constructor(async){this.#async=Boolean(async)}
	#stopRequest(){
		this.#available=false;
		if (!this.#VMHooked) return;
		XMLHttpRequestResponser.#VM[this.#VMID]=null;
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
				this.#available=false;
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
			"Content-Length":new Blob([this.#response.body]).size,
			"Content-Type":"*/*;charset=utf-8,",
			"Date":(new Date).toUTCString()
		};
		this.#response.body=body
	}
	#process(){
		var url=this.#receivedHeaders[":path"];
		if (typeof XMLHttpRequestResponser.#prepare[url]!="undefined") {
			this.#setResponse(200,XMLHttpRequestResponser.#prepare[url])
		} else {
			if (!this.#async) {
				this.#setResponse(404,"404 Not Found");
				console.warn("未在预设库中找到请求的资源，在同步模式下禁止实时配置，请求失败。")
			} else {
				var self=this;
				return new Promise(function(resolve,reject){
					self.#VMHooked=true;
					var ID=self.#VMID=XMLHttpRequestResponser.#VM.length;
					XMLHttpRequestResponser.#VM.push({
						"url":url,
						"select":function(){
							var VM=document.createElement("input");
							VM.type="file";
							VM.addEventListener("change",function(){
								var file=this.files[0];
								self.#stopRequest();
								var reader=new FileReader;
								reader.onload=function(){
									self.#setResponse(200,this.result);
									resolve(self.#responseHeaders())
								};
								reader.readAsText(file);
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
	constructor(check){
		if (check!="LocalDebug") throw new TypeError("Illegal constructor");
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
	set onabort(value){if (typeof value=="function"||value===null) this.#onabort=value}
	set onerror(value){if (typeof value=="function"||value===null) this.#onerror=value}
	set onload(value){if (typeof value=="function"||value===null) this.#onabort=value}
	set onloadend(value){if (typeof value=="function"||value===null) this.#onload=value}
	set onloadstart(value){if (typeof value=="function"||value===null) this.#onloadstart=value}
	set onprogress(value){if (typeof value=="function"||value===null) this.#onprogress=value}
	set ontimeout(value){if (typeof value=="function"||value===null) this.#ontimeout=value}
	get [Symbol.toStringTag](){return "XMLHttpRequestEventTarget"}
}

XMLHttpRequestUpload=class XMLHttpRequestUpload extends XMLHttpRequestEventTarget {
	constructor(check){
		if (check!="LocalDebug") throw new TypeError("Illegal constructor");
		super(check);
	}
	get [Symbol.toStringTag](){return "XMLHttpRequestUpload"}
}

XMLHttpRequest=class XMLHttpRequest extends XMLHttpRequestEventTarget {
	constructor(){
		super("LocalDebug");
		this.addEventListener("readystatechange",function(event){if (this.onreadystatechange) this.onreadystatechange(event)});
	}
	static get UNSENT(){return 0}
	static get OPENED(){return 1}
	static get HEADERS_RECEIVED(){return 2}
	static get LOADING(){return 3}
	static get DONE(){return 4}
	#statusList={"100":"Continue","101":"Switching Protocols","102":"Processing","200":"OK","201":"Created","202":"Accepted","203":"Non-Authoritative Information","204":"No Content","205":"Reset Content","206":"Partial Content","207":"Multi-Status","300":"Multiple Choices","301":"Moved Permanently","302":"Move Temporarily","303":"See Other","304":"Not Modified","305":"Use Proxy","306":"Switch Proxy","307":"Temporary Redirect","400":"Bad Request","401":"Unauthorized","402":"Payment Required","403":"Forbidden","404":"Not Found","405":"Method Not Allowed","406":"Not Acceptable","407":"Proxy Authentication Required","408":"Request Timeout","409":"Conflict","410":"Gone","411":"Length Required","412":"Precondition Failed","413":"Request Entity Too Large","414":"Request-URI Too Long","415":"Unsupported Media Type","416":"Requested Range Not Satisfiable","417":"Expectation Failed","418":"I'm a teapot","421":"Misdirected Request","422":"Unprocessable Entity","423":"Locked","424":"Failed Dependency","425":"Too Early","426":"Upgrade Required","449":"Retry With","451":"Unavailable For Legal Reasons","500":"Internal Server Error","501":"Not Implemented","502":"Bad Gateway","503":"Service Unavailable","504":"Gateway Timeout","505":"HTTP Version Not Supported","506":"Variant Also Negotiates","507":"Insufficient Storage","509":"Bandwidth Limit Exceeded","510":"Not Extended","600":"Unparseable Response Headers"};
	get UNSENT(){return 0}
	get OPENED(){return 1}
	get HEADERS_RECEIVED(){return 2}
	get LOADING(){return 3}
	get DONE(){return 4}
	#onreadystatechange=null;
	get onreadystatechange(){return this.#onreadystatechange}
	set onreadystatechange(value){if (typeof value=="function"||value===null) this.#onreadystatechange=value}
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
	set withCredentials(value){this.#withCredentials=value?true:false}
	#RequestHeaders={};
	#ResponseHeaders={};
	#mimeType="";
	#progressID=-1;
	static NetworkError=false;
	#Exception={"stop":true,"abort":false,"timeout":false,"error":false};
	get #inNetworkError(){return Boolean(XMLHttpRequest.NetworkError)}
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
		if (!this.#isStoped()) this.dispatchEvent(new ProgressEvent("loadstart",{"currentTarget":this,"srcElement":this,"target":this,"loaded":0,"total":0}));
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
					this.#statusText=this.#statusList[this.#status]?this.#statusList[this.#status]:"";
					if (!this.#isStoped()) this.#changeReadyState(2);
					let downloadTotal=Number(response[2]["Content-Length"]);
					if (!this.#isStoped()) this.#changeReadyState(3);
					if (!this.#isStoped()) this.dispatchEvent(new ProgressEvent("progress",{"currentTarget":this,"srcElement":this,"target":this,"loaded":0,"total":downloadTotal}));
					response=await responser.post(["post body"]);
					if (!this.#isStoped()) this.dispatchEvent(new ProgressEvent("progress",{"currentTarget":this,"srcElement":this,"target":this,"loaded":downloadTotal,"total":downloadTotal}));
					this.#responseText=response[2];
					if (this.#status==200) {
						switch (this.#responseType) {
							case "json":
								try {this.#response=JSON.parse(this.#responseText)} catch(error) {console.error(error)}
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
					this.#responseText=response[2];
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
			this.#asyncRequest(this.#responser,body)
		} else {
			this.#syncRequest(this.#responser,body)
		}
	}
	abort() {
		if (!(this instanceof XMLHttpRequest)) throw new TypeError("Illegal invocation");
		if (this.#readyState<2) return console.warn("此 XmlHttpRequest 尚未开始传输！");
		if (this.#readyState==4) return console.warn("此 XmlHttpRequest 已经结束！");
		this.#changeReadyState(4);
		this.#Exception.abort=true;
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
		if (arguments.length<1) throw new TypeError("Failed to execute 'overrideMimeType' on 'XMLHttpRequest': 1 argument required, but only "+arguments.length+" present.");
		console.warn("Function 'overrideMimeType' still building.")
	}
}

//Notification 模拟
Notification=class Notification extends EventTarget{
	constructor(title,options) {
		if (typeof title=="undefined") throw new TypeError("Failed to construct 'Notification': 1 argument required, but only 0 present.");
		super();
		var self=this;
		var model={"title":title,"body":"","image":"","icon":"","tag":"","data":"","timestamp":Date.now(),"dir":"auto","badge":"","lang":"","vibrate":[],"renotify":false,"silent":false,"sound":"","sticky":false,"requireInteraction":false,"noscreen":false};
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
	static GRANTED=true;
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