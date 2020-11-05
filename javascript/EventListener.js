{
	let hoverPointer=document.getElementById("nav_hover_pointer");
	let pointer=document.getElementById("nav_pointer");
	function moveHoverPointer(pst){hoverPointer.style.left=pst+"px"}
	function movePointer(pst){pointer.style.left=pst+"px"}
}

for (let i=1;i<5;++i) {
	let item=document.getElementById("nav_item_"+i),pst=i*200-110;
	item.addEventListener("mouseover",function(){moveHoverPointer(pst)});
	item.addEventListener("click",function(){changeSheet(i)});
}

document.getElementById("window_board_close").addEventListener("click",window_board.hide);
changeSheet(1); //加载主页

window.addEventListener("load",function() {
	News.request();
},{"once":true});