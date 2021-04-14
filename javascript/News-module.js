import {setting,notificationPermission} from "/javascript/Config.mjs";
import {create as MiniWindow} from "/javascript/MiniWindow-module.js";
var permission=setting.getItem("push news");
if (typeof permission!="boolean") setting.setItem("push news",permission=true);
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
async function check(id) {
	var list=[];
	try {
		let temp=await data;
		if (!temp) return;
		for (let item of temp) {
			list.push(item.id);
		}
	} catch(none) {return}
	for (let item in log) if (list.indexOf(item)==-1) removeLog(item);
}
async function show() {
	if (!await notificationPermission()) return;
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
export {show}