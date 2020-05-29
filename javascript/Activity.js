var Activity={
	"ReleaseAgreement":function() {
		window_board.display(ArrayHtml.decode([
			"您好，欢迎访问蓝天信息工厂！",["BR"],
			"欢迎您在我们网站的资源库中发布与投放内容。",["BR"],
			"发布与投放内容需要注意如下事项：",
			["UL",[
				["LI",[
					"发布的内容需要经过我们的审查。",["BR"],
					"（审查质量、内容量、是否与库中现有内容重复以及归属问题）"]],
				["LI",[
					"您需要向我们提供内容的链接。",["BR"],
					"（目前仅支持百度网盘与磁力链接，若您有需要，可请求我们支持更多类型）"]],
				["LI",[
					"对于您自己的内容，你可以随时要求我们更改或下线。",["BR"],
					"若与他人内容发生纠纷，请联系我们进行协商。"]],
				["LI",["未经您的同意，我们不会将您发布的内容以任何形式转载或用于盈利行为。"]],
				["LI",["有任何问题可与我们商议。"]]
			]],
			"若您有意，请通过“关于我们”页面的联系方式与我们接洽。"
		],"ReleaseAgreement"),"发布协约");
	},
	"mobile_survey":{
		"interface":function() {
			switch (localStorage.getItem("MobileDemo")) {
				case "0":
					return false;
				case "1":
					window.location.href="/Mobile";
					break;
				default:
					window_board.display(ArrayHtml.decode(Activity.mobile_survey.HA,"Activity.mobile_survey"),"调查")
			};
		},
		"operate":function(result) {
			window_board.hide();
			switch (result) {
				case "0":
					localStorage.setItem("MobileDemo","0");
					break;
				case "1":
					localStorage.setItem("MobileDemo","1");
				case "2":
					window.location.href="/Mobile";
			}
		},
		"HA":[
			["p",[
				"为追求移动端的高体验度，我们正在设计移动版页面。",["br"],
				"您是否愿意进行体验？（不推荐电脑用户使用）",["br"]
			]],
			["br"],
			["form",[
				["input",,{"type":"radio","name":"mobile_survey","value":"0","checked":""}],"不，我要继续使用桌面版。",["br"],
				["input",,{"type":"radio","name":"mobile_survey","value":"2"}],"我愿意尝试一次移动版。",["br"],
				["input",,{"type":"radio","name":"mobile_survey","value":"1"}],"我希望在测试期内一直使用移动版。",["br"],
				["button","确定",{
					"type":"button",
					"style":"border:solid 1px #000000;border-radius:5px;transition:background-color 0.2s",
					"onclick":"javascript:Activity.mobile_survey.operate(this.parentNode.elements.mobile_survey.value)",
					"onmouseover":"javascript:this.style.backgroundColor='#FFFFFF'",
					"onmouseout":"javascript:this.style.backgroundColor=null"
				}]
			]],
		]
	}
}

var News=(function(){
	var retry=0;
	var Data=[];
	function request() {
		if (getNotificationPermission(request)===1) AJAX({
			"url":"/json/News.json","type":"json",
			"success":play,
			"fail":function() {
				if (retry<5) {
					retry++;
					request();
				}
			}
		});
	};
	function play(data) {
		Data=data;
		operator();
	};
	function operator() {
		if (getNotificationPermission()!=0&&Data[0]) {
			var data=Data.splice(0,1)[0];
			if ((LogManager(data.ID,data.name)||data.force==true)&&data.unshow!=true) {
				var model={
					"title":data.title,"message":data.preview.message,"icon":"/favicon.png","keep":true,
					"show":function(){LogRecorder(data.ID,data.name)},
					"close":operator
				};
				if (data.preview.image) model.image=data.preview.image;
				if (data.board) model.click=function(){
					window.focus();
					window_board.display(ArrayHtml.decode(data.board,"News_"+data.ID),data.title)
					this.close();
				};
				NotificationCreater(model);
			} else operator();
		};
	};
	function LogManager(NewsID,NewsName) {
		var data=localStorage.getItem("News_log_ID_"+NewsID);
		if (data!=null) {
			try {
				var log=JSON.parse(data);
				if (typeof log!="object"||typeof log.have_read!="number"||typeof log.name!="string") throw "推送记录损坏";
				var pass=(new Date).getTime()-log.have_read;
				if (NewsName!=log.name||pass>259200000||pass<=0) {
					localStorage.removeItem("News_log_ID_"+NewsID);
					throw "推送记录过期";
				};
				return false;
			} catch(error) {console.log("异常的推送记录:"+"ID"+NewsID,error)};
		}
		return true;
	};
	function LogRecorder(NewsID,NewsName) {
		if (typeof NewsName!="string") NewsName="";
		var log={"name":NewsName,"have_read":(new Date).getTime()};
		localStorage.setItem("News_log_ID_"+NewsID,JSON.stringify(log));
	};
	return {
		"request":request,
		"play":play,
	};
})();

