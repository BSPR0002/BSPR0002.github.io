{
	Math.root=function root(x,y) {
		var evenPowerRoot=y>0&&y%2==0,negative=x<0&&!evenPowerRoot,solution=(negative?-x:x)**(1/y);
		return solution&&negative&&solution!=Infinity?-solution:solution;
	}
	Math.rootM=function rootM(x,y) {
		var result=[],evenPowerRoot=y>0&&y%2==0,negative=x<0&&!evenPowerRoot,solution=(negative?-x:x)**(1/y);
		result[0]=solution&&negative&&solution!=Infinity?-solution:solution;
		if (evenPowerRoot&&solution) result[1]=-solution;
		return result;
	}
}

function AJAX(options) {
	var model={"method":"get","url":null,"async":true,"username":undefined,"password":undefined,"type":"","timeout":0,"send":null,"cache":true,"success":null,"fail":null,"done":null,"error":null};
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
		} else if (typeof model.fail=="function") model.fail(this.status,this.response);
		if (typeof model.done=="function") model.done(this.status,this.response)
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

function Load(url,TargetElement,AllowCache,fully,onerror) {
	var AJAXModel={"url":url,"onerror":onerror};
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
							item.parentNode.replaceChild(temp,item)
						},
						"fail":function(){console.warn("The resource \""+item.getAttribute("href")+"\" of FullLoad \""+url+"\" request failed.")},
						"done":function(){--requests.number},
						"error":function(){
							--requests.number;
							console.warn("The resource \""+item.getAttribute("href")+"\" of FullLoad \""+url+"\" request failed.")
						}
					}))
				}
			};
			for (let item of Operator.querySelectorAll("script")) {
				if (item.getAttribute("src")) {
					requests.list.push(AJAX({
						"url":item.src,
						"cache":AllowCache,
						"success":function(response){
							if (item.type=="module") return;
							var temp=document.createElement("script");
							temp.appendChild(document.createTextNode(response));
							if (item.hasAttributes()==true) {
								for (let attribute of item.attributes) {
									if (attribute.name=="src") continue;
									temp.setAttribute(attribute.name,attribute.value)
								}
							};
							item.parentNode.replaceChild(temp,item)
						},
						"fail":function(){console.warn("The resource \""+item.src+"\" request for FullLoad \""+url+"\" failed.")},
						"done":function(){--requests.number},
						"error":function(){
							--requests.number;
							console.warn("The resource \""+item.src+"\" request for FullLoad \""+url+"\" failed due to a network error.")
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
			var model={"title":"","message":"","image":"","icon":"","id":"","data":"","dir":"auto","badge":"","language":"","vibrate":[],"renotify":false,"silent":false,"sound":"","noscreen":false,"sticky":false,"keep":false,"show":null,"click":null,"close":null,"error":null};
			Object.assign(model,options);
			var NotificationInterface=new Notification(model.title,{"body":model.message,"image":model.image,"icon":model.icon,"tag":model.id,"data":model.data,"dir":model.dir,"badge":model.badge,"lang":model.language,"vibrate":model.vibrate,"renotify":model.renotify,"silent":model.silent,"sound":model.sound,"noscreen":model.noscreen,"sticky":model.sticky,"requireInteraction":model.keep});
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

class ArrayHTML {
	static decode(ArrayHTML,activeNode=false) {
		activeNode=Boolean(activeNode);
		var getNodes={};
		var DocumentFragment=document.createDocumentFragment();
		function Operator(data,outer) {
			if (Array.isArray(data)) {
				for (var item of data) {
					switch (typeof item) {
						case "string":
						case "number":
							outer.appendChild(document.createTextNode(item));
							break;
						case "object":
							if (item instanceof Node) {
								outer.appendChild(item);
								break;
							}
							let node=null;
							try {
								switch (item[0]) {
									case "#comment":
										node=document.createComment(item[1]);
										break;
									case "#text":
										node=document.createTextNode(item[1]);
										break;
									default:
										node=document.createElement(item[0]);
										switch (typeof item[1]) {
											case "string":
											case "number":
												node.appendChild(document.createTextNode(item[1]));
												break;
											case "object":
												if (item[1]==null) break;
												if (item[1] instanceof Node) {
													node.appendChild(item[i]);
													break;
												}
												Operator(item[1],node);
											default:
										};
										for (let attribute in item[2]) {
											try {
												node.setAttribute(attribute,item[2][attribute])
											} catch (errorMessage) {
												console.warn("AHDecoder 汇报有数据错误：为节点添加属性时出错！","\n出错信息："+errorMessage+"\n出错位置：",item,"\n出错值："+attribute+"=\""+item[2][attribute]+"\"")
											};
										}
								}
								outer.appendChild(node);
								if (item[3]&&activeNode) getNodes[item[3]]=node;
							} catch(error) {
								console.warn("AHDecoder 汇报有数据错误：发现无效的节点名！","\n节点树：",data,"\n出错位置：",item,"\n该节点已被废弃。");
							};
							break;
						default:
							console.warn("AHDecoder 汇报有数据错误：节点树内有无法识别的节点！","\n节点树：",data,"\n出错位置：",item)
					};
				};
			} else {
				throw new Error("AHDecoder 解析失败：接收到非数组的数据！","\n接收内容：",data);
			};
		};
		Operator(ArrayHTML,DocumentFragment);
		return activeNode?{DocumentFragment,getNodes}:DocumentFragment;
	}
	static encode(Node,IncludeOuter=false) {
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
			if (IncludeOuter==true) {Operator(Node,ArrayHtml)} else Transporter(Node,ArrayHtml);
		} catch(error) {
			console.error("HAEncoder 编码失败：输入的不是节点或节点不可编码！");
			ArrayHtml=false;
		};
		return ArrayHtml;
	}
	constructor(Node,IncludeOuter=false){return this.constructor.encode(...arguments)}
}

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
		for (let byte=0,bytes=operator.length;byte<bytes;++byte) {
			let temp=operator[byte].toString(2);
			for (null;temp.length<8;temp="0"+temp);
			bits+=temp;
		};
		for (let remain=(3-operator.length%3)%3;remain!=0;--remain) {
			bits+="00";
			padding+="=";
		};
		for (let byte=0,bytes=bits.length/6;byte<bytes;++byte) {
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
		for (let i=1;i<4;++i) {
			if (Base64String[length-i]!="=") break;
			if (i>2) throw new SyntaxError("Invalid string with more than 2 complements(=).");
			++padding;
		};
		length-=padding;
		var bits="";
		for (let i=0;i<length;++i) {
			if (typeof table[Base64String[i]]=="undefined") throw new SyntaxError("Invalid string with invalid character \""+Base64String[i]+"\" at ["+i+"].");
			bits+=table[Base64String[i]];
		};
		var bytes=(bits.length-padding*2)/8;
		var operator=new Uint8Array(bytes);
		for (let byte=0;byte<bytes;++byte) {
			operator[byte]=Number("0b"+bits.substring(byte*8,(byte+1)*8))
		};
		return operator.buffer
	}
};

class AudioPlayer {
	constructor() {
		var audioContext=new AudioContext;
		var analyser=audioContext.createAnalyser();
		var gainNode=audioContext.createGain();
		analyser.connect(audioContext.destination);
		gainNode.connect(audioContext.destination);
		this.audioContext=audioContext;
		this.analyser=analyser;
		this.gainNode=gainNode;
		gainNode.gain.value=0;
		Object.defineProperty(this,"volume",{
			"get":function(){return Math.round((gainNode.gain.value+1)*1000)/10},
			"set":function(value){gainNode.gain.value=value/100-1},
			"enumerable":true
		});
	}
	get [Symbol.toStringTag](){return "AudioPlayer"}
	linkAudio(AudioNode) {
		if (!(AudioNode instanceof AudioScheduledSourceNode)) throw new Error("输入的参数不是音频源节点！")
		AudioNode.connect(this.analyser);
		AudioNode.connect(this.gainNode);
		var controller={
			"audioNode":AudioNode,
			"start":function(){AudioNode.start()},
			"stop":function(){AudioNode.stop()}
		};
		Object.defineProperty(controller,Symbol.toStringTag,{
			"value":"AudioPlayerController",
			"writeable":false,
			"enumerable":false
		});
		Object.defineProperty(controller,"onended",{
			"get":function(){return AudioNode.onended},
			"set":function(value){AudioNode.onended=value},
			"enumerable":true
		});
		Object.defineProperty(controller,"detune",{
			"get":function(){return AudioNode.detune.value},
			"set":function(value){AudioNode.detune.value=value},
			"enumerable":true
		});
		return controller
	}
	linkBuffer(AudioBuffer) {
		var audioNode=this.audioContext.createBufferSource();
		audioNode.buffer=AudioBuffer;
		var controller=this.linkAudio(audioNode)
		for (let item of ["loop","loopStart","loopEnd"]) {
			Object.defineProperty(controller,item,{
				"get":function(){return audioNode[item]},
				"set":function(value){audioNode[item]=value},
				"enumerable":true
			});
		};
		Object.defineProperty(controller,"speed",{
			"get":function(){return Math.round(audioNode.playbackRate.value*100)/100},
			"set":function(value){audioNode.playbackRate.value=value},
			"enumerable":true
		});
		controller.pause=function(){audioNode.playbackRate.value=0};
		controller.resume=function(){audioNode.playbackRate.value=1};
		return controller
	}
	play(AudioBuffer,loop=false,loopStart=0,loopEnd=0) {
		var audio=this.linkBuffer(AudioBuffer);
		if (loop===true) {
			audio.loop=true;
			audio.loopStart=typeof loopStart=="number"?loopStart:0;
			audio.loopEnd=typeof loopEnd=="number"?loopEnd:0;
			if (audio.loopStart!=0&&audio.loopEnd<=audio.loopStart) console.warn("设置的循环结束点不晚于循环开始点，音频循环可能会不符合预期效果。");
		};
		audio.start();
		return audio
	}
	async playFile(file,loop=false,loopStart=0,loopEnd=0) {
		if (!(file instanceof Blob)) throw new Error("Failed to execute 'playFile' on AudioPlayer: Argument 'file' is not a binary object.");
		var buffer=await this.audioContext.decodeAudioData(await file.arrayBuffer());
		return this.play(buffer,loop,loopStart,loopEnd)
	}
	pause(){this.audioContext.suspend()}
	resume(){this.audioContext.resume()}
	close(){this.audioContext.close()}
}

