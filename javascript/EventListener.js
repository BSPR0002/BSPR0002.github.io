{
	let hoverPointer=document.getElementById("nav_hover_pointer");
	let pointer=document.getElementById("nav_pointer");
	function moveHoverPointer(n){hoverPointer.style.transform=`translateX(${n*200}px)`}
	function movePointer(n){pointer.style.transform=`translateX(${n*200}px)`}
}

for (let i=0,collection=document.getElementById("navigation").getElementsByClassName("navigation"),l=collection.length;i<l;++i) {
	let item=collection[i];
	item.addEventListener("mouseenter",function(){moveHoverPointer(i)});
	item.addEventListener("click",function(){changeSheet(i)});
}

changeSheet(0); //加载主页

window.addEventListener("load",function() {
	import("/javascript/News-module.js").then(News=>News.show());
},{"once":true});