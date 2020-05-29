(function() {//Beginning
	function Initial_News(self) {
		if (document.getElementById("News")) {
			
		} else setTimeout(function(){self(self)},100);
	};
	function Initial_AboutUs(self) {
		if (document.getElementById("about_us")) {
			document.getElementById("about_us").addEventListener("click",(function() {
				var doc=ArrayHtml.decode([
					"Blue Sky Information Factory",["br"],
					["br"],
					"志向于分享与搬运二次元内容，并提供民间本土化服务（试行）。",["br"],
					["br"],
					"如果您有本土化工程需求或正在寻求工程协助，您可以向我们咨询。",["br"],
					"如果您有想要分享或发布的内容，您可以放到我们的资源库中。",["br"],
					["br"],
					"如果你懂得汉化工作，浏览器前端开发，日语翻译，软件编程，并且有用爱发电的热情，那么我诚恳地邀请您成为 BSIF 的一员!",["br"],
					["br"],
					"联系方式：",["br"],
					"百度贴吧：",["a","BSPR0002",{"href":"http://tieba.baidu.com/home/main?un=BSPR0002&from=tieba"}],["br"],
					"QQ群：",["a","BSIF",{"href":"https://jq.qq.com/?_wv=1027&k=5Ad5ek3"}]
				]);
				function show(){window_board.display(doc.cloneNode(true),"关于我们")};
				return show;
			})());
		} else setTimeout(function(){self(self)},100);
	};
	Initial_News(Initial_News);
	Initial_AboutUs(Initial_AboutUs);
})();