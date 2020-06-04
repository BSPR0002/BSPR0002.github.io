document.getElementById("navigation").addEventListener("mouseover",WakeHoverPointer);
document.getElementById("navigation").addEventListener("mouseout",HideHoverPointer);
document.getElementById("nav_item_1").addEventListener("mouseover",function(){MoveHoverPointer(90)});
document.getElementById("nav_item_2").addEventListener("mouseover",function(){MoveHoverPointer(290)});
document.getElementById("nav_item_3").addEventListener("mouseover",function(){MoveHoverPointer(490)});
document.getElementById("nav_item_4").addEventListener("mouseover",function(){MoveHoverPointer(690)});
document.getElementById("nav_item_1").addEventListener("click",function(){ChangePage(1)});
document.getElementById("nav_item_2").addEventListener("click",function(){ChangePage(2)});
document.getElementById("nav_item_3").addEventListener("click",function(){ChangePage(3)});
document.getElementById("nav_item_4").addEventListener("click",function(){ChangePage(4)});
document.getElementById("window_board_close").addEventListener("click",window_board.hide);
ChangePage(1); //加载主页

window.addEventListener("load",function() {
	News.request();
},{"once":true});