var Activity={
	"mobile_survey":{
		"interface":function (){
			switch (Cookies.toObject()["MobileDemo"]) {
				case "0":
					Cookies.keepAlive("MobileDemo");
					break;
				case "1":
					Cookies.keepAlive("MobileDemo");
					window.location.href="/Mobile";
					break;
				default:
					window_board.display(HADecoder(Activity.mobile_survey.HA,"Activity.mobile_survey"),"调查")
			};
		},
		"operate":function (result){
			window_board.hide();
			switch (result) {
				case "0":
					var expiresDate=new Date();
					expiresDate.setFullYear(expiresDate.getFullYear()+1);
					Cookies.set("MobileDemo","0",expiresDate);
					break;
				case "1":
					var expiresDate=new Date();
					expiresDate.setFullYear(expiresDate.getFullYear()+1);
					Cookies.set("MobileDemo","1",expiresDate);
					window.location.href="/Mobile";
					break;
				case "2":
					window.location.href="/Mobile";
					break;
			}
		},
		"HA":[
			["p",[
				"为追求移动端的高体验度，我们正在设计移动版页面。",
				["br"],
				"您是否愿意进行体验？（不推荐电脑用户使用）",
				["br"]
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
			["br"],
			["p","请注意不要清理您的 cookie ，以免该提示再次弹出。"],
		]
	}
}