import {ArrayHTML} from "/javascript/BSFL.mjs";
function preventBubble(event){event.stopPropagation()}
var node=ArrayHTML.decode([["DIV",[
	["STYLE",[
		"#MiniWindowContent>img{max-width:100%;height:auto}",
		"#MiniWindowTop>button{background-color:rgba(0,0,0,0.2)}",
		"#MiniWindowTop>button:hover{background-color:rgba(0,128,255,0.5)}",
		"#MiniWindowTop>button:active{background-color:rgb(0,128,255)}",
		"#MiniWindowClose::before,#MiniWindowClose::after{content:\"\";position:absolute;top:0;bottom:0;left:0;right:0;width:2px;height:16px;margin:auto;background-color:#000000;border-radius:1px;transform:rotate(45deg)}",
		"#MiniWindowClose::before{transform:rotate(-45deg)}",
		"#MiniWindowContentFrame.blocked::after{content:\"\";display:block;position:absolute;left:0;right:0;top:0;bottom:0;opacity:0}"
	]],
	["DIV",[
		["DIV",[
			["P",null,{},"title"],
			["BUTTON","0",{id:"MiniWindowQueue",title:"正在排队的弹窗数量\n点击清除所有弹窗",style:"position:relative;box-sizing:border-box;height:inherit;border:2px solid #000000;border-radius:4px;padding:2px;font-size:12px;overflow:hidden"},"queue"],
			["BUTTON",null,{id:"MiniWindowClose",title:"关闭",style:"position:relative;height:inherit;border:none;border-radius:4px;overflow:hidden"},"close"]
		],{id:"MiniWindowTop",style:"overflow:hidden;display:grid;height:20px;grid-template-columns:1fr 2em 20px;grid-gap:2px"}],
		["HR",null,{style:"width:100%;border:solid 1px;border-radius:1px;background-color:black"}],
		["DIV",[
			["DIV",null,{id:"MiniWindowContent",class:"BSIF-default",style:"position:relative;word-wrap:break-word;word-break:normal;max-width:100%;max-height:100%;overflow:auto"},"content"]
		],{id:"MiniWindowContentFrame",style:"position:relative;width:100%;height:100%;overflow:hidden"},"contentFrame"]
	],{id:"MiniWindow",style:"box-sizing:border-box;min-width:256px;min-height:128px;max-width:80%;max-height:80%;overflow:hidden;margin:auto;background-color:#FFFFFF;border-radius:10px;padding:10px;display:grid;grid-template-rows:20px auto 1fr;font-size:15px;transition:opacity 0.5s ease-in-out"},"window"]
],{id:"MiniWindowLayer",style:"position:fixed;top:0;bottom:0;left:0;right:0;z-index:1073741823;background-color:rgba(0,0,0,0.7);opacity:0;display:none;transition:opacity 0.5s ease-in-out"},"layer"]],true);
var layer=node.getNodes.layer,windowBody=node.getNodes.window,windowTitle=node.getNodes.title,windowQueue=node.getNodes.queue,windowClose=node.getNodes.close,windowContent=node.getNodes.content,contentFrame=node.getNodes.contentFrame;
var privateField=Symbol("private"),queue=[],pending=false,current=null;
class MiniWindow extends EventTarget {
	constructor() {
		super();
		var privateVar=this[privateField]={},back=arguments[0];
		if (!(back instanceof Object)&&!(privateField in back)) throw new Error("Illegal constructor");
		for (let item of ["showstart","show","closestart","close"]) {
			let name="on"+item;
			privateVar[name]=null;
			this.addEventListener(item,function(event){if (typeof this[privateField][name]=="function") this[privateField][name]()});
		}
		privateVar.id=Symbol("instanceId");
		privateVar.pending=true;
		privateVar.lock=null;
		privateVar.blocked=false;
		privateVar.closed=false;
		privateVar.shuting=false;
		privateVar.progress=new Promise(function(resolve,reject){back.resolve=resolve,back.reject=reject})
	}
	get onshowstart(){return this[privateField].onshowstart}
	set onshowstart(value){
		if (typeof value=="function"||value===null) this[privateField].onshowstart=value;
		return value
	}
	get onshow(){return this[privateField].onshow}
	set onshow(value){
		if (typeof value=="function"||value===null) this[privateField].onshow=value;
		return value
	}
	get onclosestart(){return this[privateField].onclosestart}
	set onclosestart(value){
		if (typeof value=="function"||value===null) this[privateField].onclosestart=value;
		return value
	}
	get onclose(){return this[privateField].onclose}
	set onclose(value){
		if (typeof value=="function"||value===null) this[privateField].onclose=value;
		return value
	}
	blockSwitch(){return blockContentSwitch(this)}
	close(){closeByScript(this)}
	get closed(){return this[privateField].closed}
	get blocked(){return this[privateField].blocked}
	get progress(){return this[privateField].progress}
}
function queueUp(data) {
	var controllers={[privateField]:true},temp={interface:new MiniWindow(controllers),data,controllers};
	queue.push(temp);
	updateQueueNumber();
	if (!pending) operator();
	return temp.interface
}
async function show() {
	var target=layer,end=false,lock=null;
	while (!end) {
		let item=queue.splice(0,1)[0],data=item.data,itemInterface=item.interface;
		updateQueueNumber();
		setContent(data.content,data.title,data.config,data.noManualClose);
		let close=new Promise(function(resolve){current={id:itemInterface[privateField].id,close:resolve}});
		itemInterface[privateField].pending=false;
		if (lock) lock();
		itemInterface.dispatchEvent(new Event("showstart"));
		await fadeIn(target);
		itemInterface.dispatchEvent(new Event("show"));
		await close;
		current=null;
		itemInterface[privateField].closed=true;
		itemInterface.dispatchEvent(new Event("closestart"));
		item.controllers.resolve();
		if (queue.length) {
			let target=queue[0].interface[privateField];
			target.pending=false;
			target.lock=new Promise(resolve=>lock=resolve);
		} else end=true;
		target=end?layer:windowBody;
		await fadeOut(target)
		itemInterface.dispatchEvent(new Event("close"));
		windowContent.innerHTML="";
	}
}
async function operator() {
	if (!queue.length) return;
	pending=true;
	layer.style.display="flex";
	layer.clientTop;
	while (queue.length) await show();
	layer.style.display="none";
	layer.clientTop;
	pending=false;
}
function setContent(content,title,config,noManualClose) {
	for (let item of [["window",windowBody],["content",windowContent]]) {
		let data=config[item[0]];
		let target=item[1];
		target.style.width=typeof data.width=="string"?data.width:null;
		target.style.height=typeof data.height=="string"?data.height:null;
	}
	windowClose.style.display=noManualClose?"none":"block";
	windowTitle.innerText=title?title:"提示";
	windowContent.innerHTML="";
	switch (typeof content) {
		case "string":
			windowContent.innerText=content;
			break;
		case "object":
			windowContent.appendChild(content);
			break;
	}
	contentFrame.className="";
}
function closeByScript(instance){
	if (!(instance instanceof MiniWindow)) throw new Error("Illegal invoke");
	var privateVar=instance[privateField];
	if (privateVar.closed||privateVar.shuting) return;
	privateVar.closed=true;
	if (privateVar.pending) {
		for (let i=0,l=queue.length;i<l;++i) {
			if (queue[i].interface!=instance) continue;
			let temp=queue.splice(i,1)[0];
			updateQueueNumber();
			temp.controllers.reject("closed before display.");
			return
		}
	} else {
		if (privateVar.lock) {
			privateVar.shuting=true;
			privateVar.lock.then(function(){if (current&&privateVar.id==current.id) current.close()})
			return
		} else {if (current&&privateVar.id==current.id) current.close()}
	}
}
function blockContentSwitch(instance){
	if (!(instance instanceof MiniWindow)) throw new Error("Illegal invoke");
	var privateVar=instance[privateField];
	if (privateVar.closed) return false;
	if (privateVar.id!=current.id) return false;
	contentFrame.className=(privateVar.blocked=!privateVar.blocked)?"blocked":"";
	return true;
}
Object.defineProperty(MiniWindow.prototype,Symbol.toStringTag,{value:"MiniWindow",writable:false});
function fadeOut(target) {
	return new Promise(function(resolve){ 
		target.addEventListener("transitionend",function(event){event.stopPropagation();resolve()},{once:true});
		target.style.opacity="0";
	})
}
function fadeIn(target) {
	return new Promise(function(resolve){
		target.addEventListener("transitionend",function(event){event.stopPropagation();resolve()},{once:true});
		target.style.opacity="1";
	})
}

function close(){if (current) current.close()}
function remove(){layer.remove()}
function reload(){document.body.appendChild(layer)}
function create(content,title="",boardSize=null,noManualClose=false) {
	switch (typeof content) {
		case "string":
			break;
		case "object":
			if (content instanceof Node) break;
		default:
			throw new TypeError("传入的内容不为字符串或 HTML 节点。");
	}
	if (typeof title!="string") title="";
	noManualClose=Boolean(noManualClose);
	var config={
		window:{
			width:null,
			height:null
		},
		content:{
			width:null,
			height:null
		}
	};
	if (boardSize instanceof Object) {
		for (let item of ["window","content"]) {
			if (boardSize[item] instanceof Object) {
				let data=boardSize[item];
				let size=config[item];
				size.width=typeof data.width=="string"?data.width:null;
				size.height=typeof data.height=="string"?data.height:null;
			}
		}
	}
	return queueUp({content,title,config,noManualClose})
}
var clearTimes=0;
function clear() {
	if (clearTimes>2&&confirm("您在此网页中使用了多次清除弹窗功能。\n若您正受到弹窗的干扰，您可以选择在结束浏览此网页前都不再显示弹窗。\n您是否要这么做？")) {
		reload=create=function evil(){throw new Error("Denied by user.")};
		let temp=queue;
		queue=[];
		for (let item of temp) {item.controllers.reject("user refused to view.")};
		close();
		layer.remove();
		return;
	}
	if (!confirm("即将清除所有正在排队的弹窗，同时也会关闭当前弹窗。你确定要这么做吗？")) return;
	++clearTimes;
	var temp=queue;
	queue=[];
	if (temp[0]&&temp[0].interface[privateField].lock) {
		let remain=temp.splice(0,1)[0];
		remain.interface.addEventListener("showstart",close),{once:true};
		queue.push(remain);
	}
	updateQueueNumber();
	close();
	for (let item of temp) {item.controllers.reject("user refused to view.")}
}
function updateQueueNumber(){windowQueue.innerText=queue.length>99?"99+":queue.length}
windowQueue.addEventListener("click",clear);
windowClose.addEventListener("click",close);
contentFrame.addEventListener("transitionend",preventBubble);
document.body.appendChild(node.DocumentFragment);
export {create,remove,reload}