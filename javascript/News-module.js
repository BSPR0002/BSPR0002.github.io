var log=null;
function getLog(){
	if (log==null) {
		let data=localStorage.getItem("BSNewsLog");
		try {
			dara=JSON.parse(data);
			if (!(data instanceof Object)) throw "broken";
			log=data;
		} catch(none) {
			localStorage.setItem("BSNewsLog","{}");
			log={};
			console.warn("推送记录损坏，已进行重置！");
		}
	}
	return log
}
function setLog(id) {
	var log=getLog();
	log[id]=Date.now();
	localStorage.setItem("BSNewsLog",JSON.stringify(log));
}
function removeLog(id) {
	var log=getLog();
	delete log[id];
	localStorage.setItem("BSNewsLog",JSON.stringify(log));
}
var lastFullCheck=0;
function fullCheck(){
	if (Date.now()-lastFullCheck<60) return;
	lastFullCheck=Date.now();
	var log=getLog();
	for (let index in log) check(index,log[index]);
}
function LogManager(id) {
	var log=getLog();
	setTimeout(fullCheck,0)
	return check(id);
}
function check(id,data) {
	try {
		if (typeof data!="number") throw "推送记录损坏";
		let pass=Date.now()-data;
		if (pass>259200000||pass<1) throw "推送记录过期";
		return true
	} catch(exception) {
		removeLog(id);
		console.warn("异常的推送记录："+exception+"，已删除！\n\tID："+id+"\n\t源数据："+JSON.stringify(data))
	}
	return false
}
async function show() {
	if (await Notification.requestPermission()!="granted") return;
	var data=await request();
	if (!data) return;
	await operator(data);
}
async function request() {
	for (let trys=0;trys<5;++trys) {
		let response=await new Promise(function(resolve){
			AJAX({
				"url":"/json/news.json","type":"json",
				"success":resolve,
				"fail":function(){resolve(false)}
			});
		})
		if (response) return response
	}
	return false
};
async function operator(list) {
	var MiniWindow=await import("/javascript/MiniWindow-module.js");
	for (let item of list) {
		if (!(LogManager(item.id)||item.force)||item.unshow) continue;
		await new Promise(function(resolve){
			var model={
				"title":item.title,"icon":"/favicon.png","keep":true,
				"show":function(){setLog(item.id)},
				"close":resolve
			};
			var previewMessage=null,showContent=null;
			if (item.preview) {
				if (item.preview.image) model.image=item.preview.image;
				if (item.preview.message) previewMessage=item.preview.message;
			}
			try {showContent=typeof item.content=="string"?item.content:ArrayHTML.decode(item.content)}
			model.message=previewMessage?previewMessage:(typeof showContent=="string"?showContent:"详情请点击查看。");
			model.click=function(){
				window.focus();
				MiniWindow.show(showContent,item.title);
				this.close();
			};
			NotificationCreater(model);
		})
	}
};
export {show}