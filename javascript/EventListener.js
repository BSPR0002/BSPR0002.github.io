document.addEventListener("DOMContentLoaded",function() {
	document.getElementById("navigation").addEventListener("mouseover",WakeHoverPointer);
	document.getElementById("navigation").addEventListener("mouseout",HideHoverPointer);
	document.getElementById("nav_item_1").addEventListener("mouseover",function() {
		MoveHoverPointer(90);
	});
	document.getElementById("nav_item_1").addEventListener("click",function() {
		MovePointer(90);
		ChangePage("home_page");
	});
	document.getElementById("nav_item_2").addEventListener("mouseover",function() {
		MoveHoverPointer(290);
	});
	document.getElementById("nav_item_2").addEventListener("click",function() {
		MovePointer(290);
		ChangePage("resource_library");
	});
	document.getElementById("nav_item_3").addEventListener("mouseover",function() {
		MoveHoverPointer(490);
	});
	document.getElementById("nav_item_3").addEventListener("click",function() {
		MovePointer(490);
		ChangePage("projects");
	});
	document.getElementById("nav_item_4").addEventListener("mouseover",function() {
		MoveHoverPointer(690);
	});
	document.getElementById("nav_item_4").addEventListener("click",function() {
		MovePointer(690);
		ChangePage("about_us");
	});
});