import { parse, parseAndGetNodes } from "/javascript/module/array_HTML.mjs";
import MiniWindow from "/javascript/module/MiniWindow.mjs";
import {storage} from "/javascript/Setting.mjs";
import {requestPermission} from "./module/web_permissions.mjs";
import {CacheJSON} from "/javascript/module/CacheJSON.mjs";
import {LocalStorageObject} from "/javascript/module/LocalStorageObject.mjs";
const log=new LocalStorageObject("BSIF.WS.News").object,
	data=new CacheJSON("/json/news.json");
async function getData() {
	if (!data.loaded) for (let i=0;i<5;++i) if (await data.fetch()) break;
	return data.data;
}
async function check() {
	const retainKeys=(await getData())?.map(item=>item.id);
	if (!retainKeys) return;
	for (let key of Object.getOwnPropertyNames(log)) if (retainKeys.indexOf(key)==-1) delete log[key];
}
check();
async function notice() {
	if (!await storage.get("pushNews")) return;
	const list=await getData();
	if (!list) return;
	operator(list);
}
function showDetail(id,title,content) {
	try {
		new MiniWindow(typeof content=="string"?content:parse(content),title,{size:{width:"25rem"}}).addEventListener("show",function(){log[id]=Date.now()});
	} catch(none) {
		new MiniWindow("出了点问题，内容出不来了……😢","出错了",{size:{width:"25rem"}});
	}
}
async function operator(list) {
	var notificationPermission;
	for (let item of list) {
		if (item.unshow||(!item.force&&log[item.id])) continue;
		if (!(notificationPermission??(notificationPermission=await requestPermission("notification","通知您网站的新内容")))) {
			storage.set("pushNews", false);
			return;
		};
		let options={
			icon:"favicon.png",
			requireInteraction:true,
			tag:"BSNews"+item.id,
			renotify:true
		};
		let previewMessage=null;
		if (item.preview) {
			if (item.preview.image) options.image=item.preview.image;
			if (item.preview.message) previewMessage=item.preview.message;
		}
		options.body=previewMessage??typeof item.content=="string"?item.content:"详情请点击查看。";
		new Notification(item.title,options).addEventListener("click",function(){
			window.focus();
			showDetail(item.id,item.title,item.content);
			this.close();
		});
	}
}
const boardStyle=parseAndGetNodes([["style",[
	"#bs-News{display:grid;height:100%;grid-template-rows:auto 1fr}",
	"#bs-News-setting{display:grid;height:2rem;grid-template-columns:1fr 3rem;gap:1em;place-items:center start;border-bottom:dashed 1px var(--strong-edge)}",
	"#bs-News-setting>span{font-weight:bold;white-space:nowrap;overflow:hidden}",
	"#bs-News-setting-switch{appearance:none;display:block;box-sizing:border-box;margin:0;place-self:center;width:100%;height:24px;border-radius:12px;border:solid 2px #808080;position:relative;overflow:hidden;outline:none;cursor:pointer}",
	"#bs-News-setting-switch::before{content:\"\";display:block;background-color:#808080;width:16px;height:16px;border-radius:50%;position:absolute;margin:2px;left:0;transition:all 0.5s}",
	"#bs-News-setting-switch:checked::before{background-color:#00C000;left:24px}",
	"#bs-News-setting-switch:checked{border-color:#00C000}",
	"#bs-News-setting-switch:hover{border-color:#000000}",
	"#bs-News-container{overflow:auto}",
	"#bs-News-container.none{display:grid}",
	"#bs-News-container.none::before{content:\"💦\";font-size:32px;place-self:end center}",
	"#bs-News-container.none::after{content:\"目前没有通知\";place-self:start center}",
	".bs-News-item{box-sizing:border-box;margin-top:0.25rem;border:var(--strong-edge) 1px solid;border-radius:0.25rem;padding:0.5rem;display:grid;grid-auto-rows:auto;gap:0.25rem;overflow:hidden;background-color:#EEEEEE;transition:background-color 0.2s ease-in-out;cursor:pointer}",
	".bs-News-item:hover{background-color:#FFFFFF}",
	".bs-News-item:active{transition-duration:0s;background-color:#BFEFFF}",
	".bs-News-item-title{font-weight:bold;color:var(--defaultColor)}",
	".bs-News-item-message{color:var(--content-color)}",
	".bs-News-item-image{width:100%;height:auto;border-radius:0.25rem;box-sizing:border-box;border:var(--soft-edge) 1px solid}"
],null,"style"]]).nodes.style;
function createWindow(content){return new MiniWindow(content,"推送通知",{size:{width:"25rem",height:"100%"}})}
async function showBoard() {
	const {auto,container,frame}=parseAndGetNodes([
		["div",[
			boardStyle,
			["LABEL",[
				["span","访问网站时自动推送通知"],
				["input",null,{type:"checkbox",id:"bs-News-setting-switch"},"auto"]
			],{id:"bs-News-setting"}],
			["div",null,{class:"bs-loading"},"container"]
		],{id:"bs-News"},"frame"]
	]).nodes;
	auto.checked=await storage.get("pushNews");
	auto.addEventListener("change",function(){storage.set("pushNews",this.checked)});
	var miniWindow;
	container.addEventListener("click",function(event) {
		if (event.isTrusted&&event.target!=container) {
			miniWindow.close();
			miniWindow=createWindow(frame);
		}
	});
	miniWindow=createWindow(frame);
	var list=((await getData())??[]).filter(item=>!item.unshow);
	if (list.length) {
		for (let item of list) {
			let previewMessage=null,previewImage=null,content=item.content;
			if (item.preview) {
				if (item.preview.image) previewImage=item.preview.image;
				if (item.preview.message) previewMessage=item.preview.message;
			}
			let temp=[
				["span",item.title,{class:"bs-News-item-title"}],
				["span",previewMessage??typeof content=="string"?content:"详情请点击查看。",{class:"bs-News-item-message"}]
			];
			if (previewImage) temp.push(["img",null,{src:previewImage,class:"bs-News-item-image"}]);
			let itemBody=parseAndGetNodes([["div",temp,{class:"bs-News-item"},"body"]]).nodes.body;
			itemBody.addEventListener("click",function(){showDetail(item.id,item.title,item.content)});
			container.appendChild(itemBody);
		}
	} else container.classList.add("none");
	container.id="bs-News-container";
	container.classList.remove("bs-loading");
}
export {notice,showBoard}