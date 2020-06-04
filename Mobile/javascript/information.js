(function() {//Beginning
	async function Initial_News() {
		await new Promise(function(resolve) {
			var wait=setInterval(function() {
				if (document.getElementById("News")) {
					clearInterval(wait);
					resolve();
				}
			},100)
		});
		document.getElementById("News").addEventListener("click",function(){
			window_board.display("这个区域还在建设中……","糟糕！")
		});
		document.getElementById("News_text").innerText="加载中……";
		var data=await new Promise(function(resolve){getJSON("/json/News.json",resolve,false)});
		var empty=true;
		for (let i=data.length-1;i>-1;i--) {if (data[i].unshow) {data.splice(i,1)} else empty=false};
		if (empty) {
			document.getElementById("News_text").innerText="哎呀，新鲜消息还在酝酿中……";
			return;
		};
		var lastShow=-1;
		var currentShow=0;
		var allData=data.length;
		function changeShow() {
			document.getElementById("News_icon").addEventListener("transitionend",function(){
				this.className="normal";
				this.style.backgroundImage="url(\""+data[currentShow].preview.image+"\")";
				this.style.opacity=1;
			},{"once":true});
			document.getElementById("News_text").addEventListener("transitionend",function(){
				this.innerText=data[currentShow].preview.message;
				this.style.opacity=1;
			},{"once":true});
			document.getElementById("News_icon").style.opacity=0;
			document.getElementById("News_text").style.opacity=0;
		};
		var loopShow=setInterval(function(){
			LastShow=currentShow++;
			if (currentShow==allData) currentShow=0;
			if (!(document.getElementById("News"))||LastShow==currentShow) {
				clearInterval(loopShow);
				return;
			};
			changeShow();
		},11000)
		changeShow();
	};
	async function Initial_AboutUs(self) {
		await new Promise(function(resolve) {
			var wait=setInterval(function() {
				if (document.getElementById("about_us")) {
					clearInterval(wait);
					resolve();
				}
			},100)
		});
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
	};
	Initial_News();
	Initial_AboutUs();
})();