import {ArrayHTML} from "/javascript/BSFL.mjs";
import {setting,notificationPermission} from "/javascript/Config.mjs";
import {create as MiniWindow} from "/javascript/MiniWindow.mjs";
const getPermission=()=>setting.getItem("push news",true);
var log=localStorage.getItem("BSNewsLog");
function filter(data) {
	var temp=[];
	for (let item of data) {
		if (item.unshow) continue;
		temp.push(item);
	}
	return temp
};
async function request() {
	for (let trys=0;trys<5;++trys) {
		let response=await new Promise(function(resolve){getJSON("/json/news.json",resolve,false,function(){resolve(false)})});
		if (response) return filter(response);
	}
	return false
}
try {
	let data=JSON.parse(log);
	if (!(data instanceof Object)) throw "broken";
	log=data;
} catch(none) {
	log={};
	saveLog()
}
const getLog=id=>id in log?log[id]:false;
const setLog=id=>log[id]=true;
const removeLog=id=>delete log[id];
function saveLog(){localStorage.setItem("BSNewsLog",JSON.stringify(log))}
var data=request();
async function check() {
	var list=[];
	try {
		let temp=await data;
		if (!temp) return;
		for (let item of temp) {
			list.push(item.id);
		}
	} catch(none) {return}
	for (let item in log) if (list.indexOf(item)==-1) removeLog(item);
	saveLog();
}
check();
async function show() {
	if (!(await notificationPermission()&&getPermission())) return;
	var list=await data;
	if (!data) return;
	operator(list);
}
function showDetail(id,title,content) {
	var showContent,exception=false;
	try {
		showContent=typeof content=="string"?content:ArrayHTML.decode(content)
	} catch(none) {
		showContent="出了点问题，内容回娘家了……😢";
		exception=true;
	}
	MiniWindow(showContent,title).onshow=function(){
		if (exception) return;
		setLog(id);
		saveLog();
	};
}
function operator(list) {
	for (let item of list) {
		if (!item.force&&getLog(item.id)) continue;
		let model={
			"title":item.title,
			"icon":"/favicon.png",
			"keep":true,
			"id":"BSNews"+item.id,
			"renotify":true
		};
		let previewMessage=null;
		if (item.preview) {
			if (item.preview.image) model.image=item.preview.image;
			if (item.preview.message) previewMessage=item.preview.message;
		}
		model.message=previewMessage?previewMessage:(typeof item.content=="string"?showContent:"详情请点击查看。");
		model.click=function(){
			window.focus();
			showDetail(item.id,item.title,item.content);
			this.close();
		};
		createNotification(model);
	}
}
async function boardShow() {
	var frame=ArrayHTML.decode([
		["div",[
			["style",[
				"input[type=checkbox].switch{appearance:none;display:block;box-sizing:border-box;margin:0;place-self:center;width:100%;height:24px;border-radius:12px;border:solid 2px #808080;position:relative;overflow:hidden;outline:none;cursor:pointer}",
				"input[type=checkbox].switch::before{content:\"\";display:block;background-color:#808080;width:16px;height:16px;border-radius:50%;position:absolute;margin:2px;left:0;transition:all 0.5s}",
				"input[type=checkbox].switch:checked::before{background-color:#00C000;left:24px}",
				"input[type=checkbox].switch:checked{border-color:#00C000}",
				"input[type=checkbox].switch:hover{border-color:#000000}",
				"#MiniWindowNewsBoardContainer.loading>*,#MiniWindowNewsBoardContainer.none>*{display:none}",
				"#MiniWindowNewsBoardContainer.loading,#MiniWindowNewsBoardContainer.none{grid-template-rows:repeat(2,1fr);grid-gap:8px}",
				"@keyframes NewsBoardLoadingCircle{from{transform:rotate(0)}to{transform:rotate(1turn)}}",
				"#MiniWindowNewsBoardContainer.loading::before{content:\"\";place-self:end center;width:32px;height:32px;box-sizing:border-box;background-color:transparent;border:solid 2px;border-color:#0080FF #0080FF transparent transparent;border-radius:50%;transform-origin:center;animation:NewsBoardLoadingCircle 1s linear infinite forwards running}",
				"#MiniWindowNewsBoardContainer.loading::after{content:\"正在获取通知……\";place-self:start center}",
				"#MiniWindowNewsBoardContainer.none::before{content:\"💦\";font-size:32px;place-self:end center}",
				"#MiniWindowNewsBoardContainer.none::after{content:\"目前没有通知\";place-self:start center}",
				".MiniWindowNewsBoardNews{display:grid;grid-template-rows:repeat(2,auto);grid-gap:4px;width:100%;overflow:hidden;background-color:#E0E0E0;box-sizing:border-box;border:var(--strongEdge) 1px solid;border-radius:8px;padding:8px;transition:background-color 0.2s ease-in-out;cursor:pointer}",
				".MiniWindowNewsBoardNews.withImage{grid-template-rows:repeat(3,auto)}",
				".MiniWindowNewsBoardNews:hover{background-color:#FFFFFF}",
				".MiniWindowNewsBoardNewsTitle{font-weight:bold;color:var(--defaultColor)}",
				".MiniWindowNewsBoardNewsMessage{color:var(--contentColor)}",
				".MiniWindowNewsBoardNewsImage{width:100%;height:auto;border-radius:4px;box-sizing:border-box;border:var(--softEdge) 1px solid;}"
			]],
			["div",[
				["span","访问网站时自动推送通知",{style:"font-weight:bold;white-space:nowrap;overflow:hidden"}],
				["input",null,{type:"checkbox",class:"switch"},"auto"]
			],{style:"display:grid;height:2em;grid-template-columns:1fr 48px;grid-gap:1em;place-items:center start;border-bottom:dashed 1px var(--strongEdge)"}],
			["div",null,{id:"MiniWindowNewsBoardContainer",class:"loading",style:"display:grid;grid-gap:4px;place-content:start;overflow:auto"},"container"]
		],{id:"NewsBoard",style:"display:grid;height:100%;grid-template-rows:2em 1fr;grid-gap:4px"}]
	],true);
	var auto=frame.getNodes.auto;
	auto.checked=getPermission();
	auto.addEventListener("change",function(){setting.setItem("push news",this.checked)});
	var container=frame.getNodes.container;
	var miniWindow=MiniWindow(frame.DocumentFragment,"推送通知",{content:{width:"384px",height:"512px"}});
	var list=await data;
	if (list.length) {
		for (let item of list) {
			let previewMessage=null,previewImage=null;
			if (item.preview) {
				if (item.preview.image) previewImage=item.preview.image;
				if (item.preview.message) previewMessage=item.preview.message;
			}
			let temp=[
				["div",[
					["span",item.title,{class:"MiniWindowNewsBoardNewsTitle"}],
					["span",previewMessage?previewMessage:(typeof item.content=="string"?showContent:"详情请点击查看。"),{class:"MiniWindowNewsBoardNewsMessage"}]
				],{class:"MiniWindowNewsBoardNews"},"body"]
			];
			if (previewImage) {
				temp[0][1].push(["img",null,{src:previewImage,class:"MiniWindowNewsBoardNewsImage"}]);
				temp[0][2].class+=" withImage";
			}
			temp=ArrayHTML.decode(temp,true);
			temp.getNodes.body.addEventListener("click",function(){
				showDetail(item.id,item.title,item.content);
				miniWindow.close();
			});
			container.appendChild(temp.DocumentFragment);
		}
	} else container.classList.add("none");
	container.classList.remove("loading");
}
export {show,boardShow}