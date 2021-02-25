{
	let informations=new Promise(function(resolve,reject){getJSON("/json/informations.json",resolve,false,reject)});
	let large=document.getElementById("information_box_large");
	let largeContent=large.querySelector("#information_box_large_content");
	let largeImage=largeContent.querySelector("#information_box_large_image");
	let largeText=largeContent.querySelector("#information_box_large_describe");
	let smalls=document.querySelectorAll(".information_box.small");
	informations.then(function(data){
		var contents=[];
		for (let carousel=data.carousel,i=0,n=0,l=carousel.length;i<l&&n<10;++i) if (!carousel[i].unshow) contents.push(carousel[i]);
		async function hide(){
			largeContent.setAttribute("disabled","");
			await new Promise(function(done){
				largeContent.addEventListener("transitionend",done,{once:true});
				largeContent.style.opacity=0;
			});
		}
		function change(){
			largeImage.style.backgroundImage=`url("${contents[current].image}")`;
			largeText.innerText=contents[current].message;
		}
		async function show(){
			await new Promise(function(done){
				largeContent.addEventListener("transitionend",done,{once:true});
				largeContent.style.opacity=1;
			});
			largeContent.removeAttribute("disabled");
		}
		if (!contents.length) {
			large.className="none";
			largeText.innerHTML=`<span class="emoji">💦</span><br>目前没有消息`;
			show();
			return;
		}
		var current=0;
		change();
		large.clientTop;
		show().then(function(){large.classList.remove("loading")});
		largeContent.addEventListener("click",function(){
			if (this.hasAttribute("disabled")) return;
			var data=contents[current].link;
			switch (data[0]) {
				case "address":
					window.open(data[1]);
					break;
				case "board":
					import("/javascript/ResourceLibrary-module.js").then(m=>m.show(data[1].content,data[1].title));
				default:
			}
		})
		if (contents.length<2) return;
		async function carousel() {
			if (!document.contains(large)) {
				clearInterval(intervalId);
				return;
			}
			if (++current==contents.length) current=0;
			await hide();
			change();
			show();
		}
		var intervalId=setInterval(carousel,6000);
		large.addEventListener("mouseenter",function(){clearInterval(intervalId)});
		large.addEventListener("mouseleave",function(){intervalId=setInterval(carousel,6000)});


	})




}