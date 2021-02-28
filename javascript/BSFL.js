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

function AJAX(options) {
	var model={"method":"get","url":null,"async":true,"username":undefined,"password":undefined,"type":"","timeout":0,"send":null,"cache":true,"success":null,"fail":null,"done":null,"error":null};
	Object.assign(model,options);
	var xhr=new XMLHttpRequest();
	xhr.open(model.method,model.url,model.async,model.username,model.password);
	if (model.async!==false) {
		xhr.responseType=model.type;
		xhr.timeout=model.timeout;
	};
	if (model.cache===false) xhr.setRequestHeader("If-Modified-Since","0");
	xhr.onload=function() {
		if ((this.status>=200&&this.status<300)||this.status==304) {
			if (typeof model.success=="function") model.success(this.response);
		} else if (typeof model.fail=="function") model.fail(this.status,this.response);
		if (typeof model.done=="function") model.done(this.status,this.response)
	};
	xhr.onerror=model.error;
	xhr.send(model.send);
	return xhr;
}

function getJSON(url,callback,allowCache=true,fail=null) {
	var AJAXModel={url,type:"json",fail,error:fail};
	if (typeof callback=="function") AJAXModel.success=callback;
	if (allowCache===false) AJAXModel.cache=false;
	return AJAX(AJAXModel);
}

function getXML(url,callback,allowCache=true,fail=null) {
	var AJAXModel={url,type:"document",fail,error:fail};
	if (typeof callback=="function") AJAXModel.success=callback;
	if (allowCache===false) AJAXModel.cache=false;
	return AJAX(AJAXModel);
}

function load(url,targetElement,allowCache=true,preloadResource=true,fail=null) {
	var AJAXModel={url,fail,error:fail};
	if (allowCache===false) AJAXModel.cache=false;
	if (preloadResource) {
		let loadInterface=new EventTarget,readyState=0,done=false;
		let changeReadyState=function changeReadyState(value){
			readyState=value;
			loadInterface.dispatchEvent(new Event("readystatechange"))
		}
		Object.defineProperty(loadInterface,"readyState",{
			get:function(){return readyState},
			configurable:false,
			enumerable:true
		})
		AJAXModel.success=async function(response){
			var operator=document.createRange().createContextualFragment(response);
			var requests=[],controllers=[];
			function preloadResource(tagName,rule,getURL,process) {
				for (let item of operator.querySelectorAll(tagName)) {
					if (rule(item)) {
						requests.push(new Promise(function(resolve){
							var temp=AJAX({
								url:getURL(item),
								cache:allowCache,
								success:response=>process(response,item),
								fail:function(){console.warn(`The resource "${getURL(item)}" of Load "${url}" request failed.`)},
								done:resolve,
								error:function(){
									console.warn(`The resource "${getURL(item)}" of Load "${url}" request failed.`);
									resolve()
								}
							});
							temp.addEventListener("abort",resolve);
							controllers.push(temp)
						}))
					}
				}
			}
			preloadResource("link",x=>x.getAttribute("rel")=="stylesheet",x=>x.getAttribute("href"),function(response,item){
				var temp=document.createElement("style");
				temp.appendChild(document.createTextNode(response));
				if (item.hasAttributes()) {
					for (let attribute of item.attributes) {
						switch (attribute.name) {
							case "href":
							case "rel":
								continue;
							default:
								temp.setAttribute(attribute.name,attribute.value)
						}
					}
				};
				item.parentNode.replaceChild(temp,item)
			})
			preloadResource("script",x=>x.getAttribute("src"),x=>x.src,function(response,item){
				if (item.type=="module") return;
				var temp=document.createElement("script");
				temp.appendChild(document.createTextNode(response));
				if (item.hasAttributes()) {
					for (let attribute of item.attributes) {
						if (attribute.name=="src") continue;
						temp.setAttribute(attribute.name,attribute.value)
					}
				};
				item.parentNode.replaceChild(temp,item)
			})
			abort=function(){for (let item of controllers) item.abort()};
			changeReadyState(3);
			await Promise.all(requests);
			if (done) return;
			done=true;
			changeReadyState(4);
			targetElement.innerHTML="";
			targetElement.appendChild(operator);
			loadInterface.dispatchEvent(new Event("load"));
		};
		let loadRequest=AJAX(AJAXModel),abort=loadRequest.abort.bind(loadRequest);
		loadInterface.abort=function abort() {
			if (done) return;
			done=true;
			abort();
			changeReadyState(0)
		}
		return loadInterface;
	};
	AJAXModel.success=function(response) {
		var operator=document.createRange().createContextualFragment(response);
		targetElement.innerHTML="";
		targetElement.appendChild(operator);
	};
	return AJAX(AJAXModel);
}

function emptyElement(targetElement) {
	var operator=document.createRange();
	operator.selectNodeContents(targetElement);
	operator.deleteContents();
}

function NotificationCreater(options) {
	var model={"title":"","message":"","image":"","icon":"","id":"","data":"","dir":"auto","badge":"","language":"","vibrate":[],"renotify":false,"silent":false,"sound":"","noscreen":false,"sticky":false,"keep":false,"show":null,"click":null,"close":null,"error":null};
	Object.assign(model,options);
	var notificationInterface=new Notification(model.title,{"body":model.message,"image":model.image,"icon":model.icon,"tag":model.id,"data":model.data,"dir":model.dir,"badge":model.badge,"lang":model.language,"vibrate":model.vibrate,"renotify":model.renotify,"silent":model.silent,"sound":model.sound,"noscreen":model.noscreen,"sticky":model.sticky,"requireInteraction":model.keep});
	notificationInterface.onshow=model.show;
	notificationInterface.onclick=model.click;
	notificationInterface.onclose=model.close;
	notificationInterface.onerror=model.error;
	return notificationInterface;
}

function detectUA() {
	var UA={"desktop":false,"mobile":false};
	var detective=navigator.userAgent;
	for (let item of [/Windows/i,/Macintosh/i,/Linux/i]) if (item.test(detective)) {UA.desktop=true;break};
	for (let item of [/Mobile/i,/Android/i,/iPhone/i,/iPad/i,/iPod/i]) if (item.test(detective)) {UA.mobile=true;break};
	return UA;
}

var Cookies={
	[Symbol.toStringTag]:"Cookies",
	"get":function(cookieName){return Cookies.toObject()[cookieName]},
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
	"empty":function(){for (var cookie in Cookies.toObject()) Cookies.delete(cookie)},
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

var ArrayHTML={
	[Symbol.toStringTag]:"ArrayHTML",
	decode:function decode(ArrayHTML,activeNode=false) {
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
					}
				}
			} else {
				throw new Error("AHDecoder 解析失败：接收到非数组的数据！","\n接收内容：",data);
			}
		}
		Operator(ArrayHTML,DocumentFragment);
		return activeNode?{DocumentFragment,getNodes}:DocumentFragment;
	},
	encode:function encode(Node,IncludeOuter=false) {
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
					}
					try {
						if (Node.hasAttributes()==true) {
							child[2]={};
							for (let attribute of Node.attributes) {
								child[2][attribute.name]=attribute.value;
							};
						}
					} catch(error) {console.warn("HAEncoder 汇报异常：未能获取到节点的属性！\n异常节点：",Node)}
					outer.push(child);
			}
		}
		try {
			Node=Node.cloneNode(true);
			if (IncludeOuter==true) {Operator(Node,ArrayHtml)} else Transporter(Node,ArrayHtml);
		} catch(error) {
			console.error("HAEncoder 编码失败：输入的不是节点或节点不可编码！");
			ArrayHtml=false;
		}
		return ArrayHtml;
	}
}

var FileIO={
	[Symbol.toStringTag]:"FileIO",
	read:function(File,readType){
		if (arguments.length<2) throw new TypeError("Failed to execute 'read': 2 arguments required, but only "+arguments.length+" present.");
		if (!(File instanceof Blob)) throw new TypeError("Failed to execute 'read': Argument 'File' is not a binary object.");
		if (["ArrayBuffer","DataURL","Text"].indexOf(readType)==-1) throw new Error("Failed to execute 'read': The value of argument 'readtype' is not one of \"ArrayBuffer\", \"DataURL\", \"Text\".");
		return new Promise(function(resolve){
			var Operator=new FileReader;
			Operator.onload=function(){resolve(this.result)};
			Operator["readAs"+readType](File);
		});
	},
	save:function(file,saveName){
		var obj_URL=URL.createObjectURL(file);
		var address=document.createElement("a");
		address.href=obj_URL;
		address.download=typeof saveName=="string"?saveName:"";
		address.dispatchEvent(new MouseEvent("click",{"button":0}));
		URL.revokeObjectURL(obj_URL);
	},
	get:function() {
		return new Promise(function(resolve){
			var input=document.createElement("input");
			input.type="file";
			input.onchange=function(){resolve(this.files[0])};
			input.dispatchEvent(new MouseEvent("click",{"button":0}));
		});
	}
};

var Base64={ 
	[Symbol.toStringTag]:"Base64",
	encode:function encode(data) {
		if (!(data instanceof ArrayBuffer)) throw new TypeError("Base64 encoder accepts only ArrayBuffer objects.");
		var table=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","+","/"];
		var operator=new Uint8Array(data);
		var result="",length=operator.length,remain=length%3,byte=0;
		{
			let end=length-remain;
			while (byte<end) {
				let bits="";
				for (let i=0;i<3;++i,++byte) {
					let temp=operator[byte].toString(2)
					while (temp.length<8) temp="0"+temp;
					bits+=temp;
				}
				for (let i=0;i<24;result+=table[Number("0b"+bits.substring(i,i+=6))]);
			}
		}
		if (remain) {
			let bits="",padding="";
			while (byte<length) {
				let temp=operator[byte].toString(2);
				while (temp.length<8) temp="0"+temp;
				bits+=temp;
				++byte
			}
			do {
				bits+="00";
				padding+="=";
				++remain
			} while (remain<3);
			for (let i=0,l=bits.length;i<l;result+=table[Number("0b"+bits.substring(i,i+=6))]);
			result+=padding
		}
		return result
	},
	decode:function decode(Base64String) {
		if (typeof Base64String!="string") throw new TypeError("Base64 decoder accepts only strings.");
		var length=Base64String.length;
		if (length%4) throw new Error("Invalid string, string length is not a multiple of 4.");
		var table={"A":"000000","B":"000001","C":"000010","D":"000011","E":"000100","F":"000101","G":"000110","H":"000111","I":"001000","J":"001001","K":"001010","L":"001011","M":"001100","N":"001101","O":"001110","P":"001111","Q":"010000","R":"010001","S":"010010","T":"010011","U":"010100","V":"010101","W":"010110","X":"010111","Y":"011000","Z":"011001","a":"011010","b":"011011","c":"011100","d":"011101","e":"011110","f":"011111","g":"100000","h":"100001","i":"100010","j":"100011","k":"100100","l":"100101","m":"100110","n":"100111","o":"101000","p":"101001","q":"101010","r":"101011","s":"101100","t":"101101","u":"101110","v":"101111","w":"110000","x":"110001","y":"110010","z":"110011","0":"110100","1":"110101","2":"110110","3":"110111","4":"111000","5":"111001","6":"111010","7":"111011","8":"111100","9":"111101","+":"111110","/":"111111"};
		var padding=0;
		for (let i=1;i<4;++i) {
			if (Base64String[length-i]!="=") break;
			if (i>2) throw new Error("Invalid string with more than 2 complements(=).");
			++padding;
		}
		var i=0,end=padding?length-4:length,byte=0;
		var operator=new Uint8Array(length*0.75-padding);
		while (i<end) {
			let temp="";
			for (let bits=0;bits<4;++i,++bits) {
				let data=table[Base64String[i]];
				if (!data) throw new Error(`Invalid string with invalid character \"${data}\" at [${i}].`);
				temp+=data
			}
			for (let bit=0;bit<24;operator[byte++]=Number("0b"+temp.substring(bit,bit+=8)));
		}
		if (padding) {
			end+=4-padding;
			let temp="",byteEnd=byte+(3-padding)%3,bit=0;
			do {
				let data=table[Base64String[i]];
				if (!data) throw new Error(`Invalid string with invalid character \"${data}\" at [${i}].`);
				temp+=data;
				++i
			} while (i<end);
			do {operator[byte++]=Number("0b"+temp.substring(bit,bit+=8))} while (byte<byteEnd);
		}
		return operator.buffer
	}
};
