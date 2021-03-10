(async function(){
var large=document.getElementById("information_box_large");
var largeScroll=large.querySelector("#information_box_large_scroll");
var largeTop=large.querySelector("#information_box_large_pagination");
var largeTopFloat=largeTop.querySelector("#information_box_large_pagination_float");
var smalls=document.querySelectorAll(".information_box.small");
var informations=await import("/javascript/Information-module.js");
var MiniWindow=(await import("/javascript/MiniWindow-module.js")).create;
var data={all:[],carousel:[],single:[]};
try {
	data.all=await informations.getAll();
	data.carousel=await informations.getCarousel();
	data.single=await informations.getSingle();
} catch(none){}
function constructContent(data) {
	var node=ArrayHTML.decode([
		["div",[
			["div",null,{class:"information_box_image",style:`background-image:url("${data.image}")`}],
			["div",null,{class:"information_box_text"},"text"]
		],{class:"information_box_content"},"content"]
	],true),main=node.getNodes.content,text=node.getNodes.text;
	switch (data.link[0]) {
		case "address":
			main.addEventListener("click",function(){window.open(data.link[1])});
			break;
		case "board":
			main.addEventListener("click",function(){MiniWindow(data.link[1].content,data[1].title)});
			break;
		default:
			main.className+=" no";
	}
	main.addEventListener("transitionend",preventBubble);
	text.innerText=data.message;
	return main
}
largeTop.addEventListener("change",function(){change(+this.elements.information_box_large_pagination.value)})
var preventBubble=event=>event.stopPropagation();
var carousel=[],paginations=[];
for (let i=0,collection=data.carousel,l=collection.length;i<l;++i) {
	let item=constructContent(collection[i]);
	carousel.push(item);
	paginations.push(["input",null,{type:"radio",value:i,class:"information_box_large_pagination",name:"information_box_large_pagination"},String(i)]);
}
largeScroll.innerHTML="";
if (carousel.length) {
	largeScroll.classList.remove("none");
	largeScroll.style="grid-template-columns:repeat("+carousel.length+",100%)";
	largeScroll.appendChild(ArrayHTML.decode(carousel));
	paginations[0][2].checked="";
	paginations=ArrayHTML.decode(paginations,true);
	largeTop.appendChild(paginations.DocumentFragment);
	paginations=paginations.getNodes;
	largeTop.style=`width:${carousel.length+(carousel.length-1)*0.5+1}em;grid-template-columns:repeat(${carousel.length},1em)`;
} else {
	largeScroll.classList.add("none");
	largeScroll.style="";
}
function change(n){
	if (n<0||n>carousel.length-1||n==current) return;
	largeScroll.style.left=-(current=n)+"00%"
	largeTopFloat.style.transform=`translateX(${1.5*n}em`
}
function show(target){
	return new Promise(function(resolve){
		target.addEventListener("transitionend",resolve,{once:true});
		target.clientTop;
		target.style.opacity=1;
	});
}
var current=0,intervalId=-1;
function changeByScript(){
	let temp=current+1==carousel.length?0:current+1;
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
show(largeScroll).then(function(){large.classList.remove("loading")});
if (carousel.length>1) {
	intervalId=setInterval(auto,6000);
	large.addEventListener("mouseenter",function(){clearInterval(intervalId)});
	large.addEventListener("mouseleave",function(){intervalId=setInterval(auto,6000)});
	largeTop.style.display="grid";
	largeTop.clientTop;
	largeTop.className="on";
}
for (let i=0,single=data.single;i<3;++i) {
	let content=single[i]?constructContent(single[i]):ArrayHTML.decode([["div",null,{class:"none"},"none"]],true).getNodes.none;
	smalls[i].appendChild(content);
	show(content).then(function(){smalls[i].classList.remove("loading")});
}
})()