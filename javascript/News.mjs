import {ArrayHTML} from "/javascript/BSFL.mjs";
import {setting,notificationPermission} from "/javascript/Config.mjs";
import {create as MiniWindow} from "/javascript/MiniWindow.mjs";
const getPermission=()=>setting.getItem("push news",true);
var log=localStorage.getItem("BSNewsLog");
async function request() {
	for (let trys=0;trys<5;++trys) {
		let response=await new Promise(function(resolve){getJSON("/json/news.json",resolve,false,function(){resolve(false)})})
		if (response) return response
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
function operator(list) {
	for (let item of list) {
		if (item.unshow||(!item.force&&getLog(item.id))) continue;
		let model={
			"title":item.title,"icon":"/favicon.png","keep":true,
			"show":function(){setLog(item.id)},
		};
		let previewMessage=null,showContent=null;
		if (item.preview) {
			if (item.preview.image) model.image=item.preview.image;
			if (item.preview.message) previewMessage=item.preview.message;
		}
		try {showContent=typeof item.content=="string"?item.content:ArrayHTML.decode(item.content)} catch(none) {}
		model.message=previewMessage?previewMessage:(typeof showContent=="string"?showContent:"详情请点击查看。");
		model.click=function(){
			window.focus();
			MiniWindow(showContent,item.title).onshow=function(){
				setLog(item.id);
				saveLog();
			};
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
				"input[type=checkbox].switch:hover{border-color:#000000}"
			]],
			["div",[
				["span","访问网站时自动推送通知",{style:"font-weight:bold;white-space:nowrap;overflow:hidden"}],
				["input",null,{type:"checkbox",class:"switch"},"auto"]
			],{style:"display:grid;height:2em;grid-template-columns:1fr 48px;grid-gap:1em;place-items:center start;border-bottom:dashed 1px var(--softEdge)"}]
		],{id:"NewsBoard",style:"display:grid;grid-template-columns:384px;grid-gap:8px"},"body"]
	],true);
	var auto=frame.getNodes.auto;
	auto.checked=getPermission();
	auto.addEventListener("change",function(){setting.setItem("push news",this.checked)});
	MiniWindow(frame.DocumentFragment,"推送通知");
}
export {show,boardShow}