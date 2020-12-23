//try {ArrayHTML.decode(["test"])} catch(none) {throw new Error("缺失依赖！需要 BSFL.ArrayHTML.decode")};
var node=ArrayHTML.decode([["DIV",[
	["DIV",[
		["STYLE",[
			"#MiniWindowContent img{max-width:100%;height:auto}",
			"#MiniWindowClose{background-color:rgba(0,0,0,0.2)}",
			"#MiniWindowClose:hover{background-color:rgba(0,128,255,0.5)}",
			"#MiniWindowClose:active{background-color:rgb(0,128,255)}",
			"#MiniWindowClose::before,#MiniWindowClose::after{content:\"\";display:block;box-sizing:border-box;position:absolute;width:80%;height:2px;border-radius:1px;top:0;bottom:0;left:0;right:0;margin:auto;background-color:#000000;transform-origin:center;transform:rotate(45deg)}",
			"#MiniWindowClose::after{transform:rotate(-45deg)}"
		]],
		["DIV",[
			["P",null,{},"title"],
			["BUTTON",null,{id:"MiniWindowClose",title:"关闭",style:"position:relative;border:none;border-radius:4px"},"close"]
		],{style:"overflow:hidden;display:grid;grid-template-columns:1fr 20px;grid-gap:2px"}],
		["HR",null,{style:"width:100%;border:solid 1px;border-radius:1px"}],
		["DIV",null,{id:"MiniWindowContent",style:"word-wrap:break-word;word-break:normal;overflow:auto"},"content"]
	],{id:"MiniWindow",style:"box-sizing:border-box;min-width:256px;min-height:128px;max-width:80%;max-height:80%;overflow:hidden;margin:auto;background-color:#FFFFFF;border-radius:10px;padding:10px;display:grid;grid-template-rows:20px auto 1fr;font-size:15px"},"window"]
],{id:"MiniWindowLayer",style:"position:fixed;top:0;bottom:0;left:0;right:0;z-index:1073741823;background-color:rgba(0,0,0,0.7);opacity:0;display:none;transition:opacity 0.5s ease-in-out"},"layer"]],true);
var manager={
	state:false,
	closed:true,
	queue:Promise.resolve(),
	lastInterface:null
};
function waitClose(resolve){manager.lastInterface=resolve}
async function next(queue,data) {
	await queue;
	display(...data);
	await new Promise(waitClose);
}
async function show(content,title,noManualClose,boardSize={}){await (manager.queue=next(manager.queue,[content,title,noManualClose,boardSize]))}
function display(content,title,noManualClose,boardSize={}) {
	if (typeof boardSize!="object") {
		console.warn("无法接收参数 boardSize ！\n",boardSize);
		boardSize={};
	};
	var layer=node.getNodes.layer;
	var window=node.getNodes.window;
	var windowTitle=node.getNodes.title;
	var windowClose=node.getNodes.close;
	var windowContent=node.getNodes.content;
	window.style.width=boardSize.width?boardSize.width:null;
	window.style.height=boardSize.height?boardSize.height:null;
	windowClose.style.display=noManualClose===true?"none":"block";
	if (typeof title=="string") {
		windowTitle.innerText=title;
	} else {
		windowTitle.innerText="提示";
	};
	windowContent.innerHTML="";
	switch (typeof content) {
		case "string":
			windowContent.innerText=content;
			break;
		case "object":
			if (content instanceof Node) {
				windowContent.appendChild(content);
				break;
			};
		default:
			throw new TypeError("传入的内容不为字符串或 HTML 节点。");
	};
	manager.closed=false;
	layer.style.display="flex";
	layer.clientTop;
	layer.style.opacity="1";
}
function close() {
	if (manager.closed) return false;
	manager.closed=true;
	var layer=node.getNodes.layer;
	layer.addEventListener("transitionend",function(){
		layer.style.display="none";
		layer.clientTop;
		manager.lastInterface();
	},{once:true});
	layer.style.opacity="0";
}
function remove(){
	var layer=node.getNodes.layer;
	if (!layer.parentNode) return false;
	layer.parentNode.removeChild(layer)
}
function reload(){
	var layer=node.getNodes.layer;
	document.body.appendChild(layer)
}
node.getNodes.close.addEventListener("click",close);
document.body.appendChild(node.DocumentFragment);
//window.MiniWindow={[Symbol.toStringTag]:"MiniWindow",show,close,remove,reload}
export {show,close,remove,reload}