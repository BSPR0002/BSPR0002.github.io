function WakeHoverPointer() {
	document.getElementById("nav_hover_pointer").style.borderBottom="10px solid #92C1DC";
}

function MoveHoverPointer(pst) {
	document.getElementById("nav_hover_pointer").style.left=pst+"px";
}

function HideHoverPointer() {
	document.getElementById("nav_hover_pointer").style.borderBottom="0 solid #92C1DC";
}

function MovePointer(pst) {
	document.getElementById("nav_pointer").style.left=pst+"px";
}

function testclick() {
	void(0);
}