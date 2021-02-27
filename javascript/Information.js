(async function(){
var large=document.getElementById("information_box_large");
var largeScroll=large.querySelector("#information_box_large_scroll");
var largeTop=large.querySelector("#information_box_large_pagination");
var largeTopFloat=largeTop.querySelector("#information_box_large_pagination_float");
var smalls=document.querySelectorAll(".information_box.small");
var informations=await new Promise(function(resolve,reject){getJSON("/json/informations.json",resolve,false,reject)});
var MiniWindow=(await import("/javascript/ResourceLibrary-module.js")).create;
largeTop.addEventListener("change",function(){change(+this.elements.information_box_large_pagination.value)})
var preventBubble=event=>event.stopPropagation(),contents=[],paginations=[];
for (let carousel=informations.carousel,i=0,n=0,l=carousel.length;i<l&&n<10;++i) {
	if (carousel[i].unshow) continue;
	let item=carousel[i],node=ArrayHTML.decode([
		["div",[
			["div",null,{class:"information_box_large_image",style:`background-image:url("${item.image}")`}],
			["div",null,{class:"information_box_large_text"},"text"]
		],{class:"information_box_large_content"},"content"]
	],true);
	let main=node.getNodes.content,text=node.getNodes.text;
	switch (item.link[0]) {
		case "address":
			main.addEventListener("click",function(){window.open(item.link[1])});
			break;
		case "board":
			main.addEventListener("click",function(){MiniWindow(item.link[1].content,data[1].title)});
			break;
		default:
			main.className+=" no";
	}
	main.addEventListener("transitionend",preventBubble);
	text.innerText=item.message;
	contents.push(main);
}
if (!contents.length) content.push(["div",[
	["div",null,{class:"information_box_large_image"}],
	["div",[["span","💦",{class:"emoji"}],["br"],"目前没有消息"],{class:"information_box_large_text none"}]
],{class:"information_box_large_content"},"content"]);
largeScroll.innerHTML="";
largeScroll.style="grid-template-columns:repeat("+contents.length+",100%)";
largeScroll.appendChild(ArrayHTML.decode(contents));
for (let i=0,l=contents.length;i<l;++i) paginations.push(["input",null,{type:"radio",value:i,class:"information_box_large_pagination",name:"information_box_large_pagination"},""+i]);
paginations[0][2].checked="";
paginations=ArrayHTML.decode(paginations,true);
largeTop.appendChild(paginations.DocumentFragment);
paginations=paginations.getNodes;
largeTop.style=`width:${contents.length+(contents.length-1)*0.5+1}em;grid-template-columns:repeat(${contents.length},1em)`;
function change(n){
	if (n<0||n>contents.length-1||n==current) return;
	largeScroll.style.left=-(current=n)+"00%"
	largeTopFloat.style.transform=`translateX(${1.5*n}em`
}
function show(){
	return new Promise(function(resolve){
		largeScroll.addEventListener("transitionend",resolve,{once:true});
		largeScroll.clientTop;
		largeScroll.style.opacity=1;
	});
}
var current=0,intervalId=-1;
function changeByScript(){
	let temp=current+1==contents.length?0:current+1;
	paginations[temp].checked=true;
	change(temp);
}
function auto() {
	if (!document.contains(large)) {
		clearInterval(intervalId);
		return;
	}
	changeByScript();
}
show().then(function(){large.classList.remove("loading")});
if (contents.length>1) {
	intervalId=setInterval(auto,6000);
	large.addEventListener("mouseenter",function(){clearInterval(intervalId)});
	large.addEventListener("mouseleave",function(){intervalId=setInterval(auto,6000)});
	largeTop.style.display="grid";
	largeTop.clientTop;
	largeTop.className="on";
}







})()