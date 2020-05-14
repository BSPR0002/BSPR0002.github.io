function testfunc() {
	if (DetectUA().Mobile==true) {alert("您的UA为移动设备")} else {alert("您的UA为电脑")}
	NotificationCreater({"title":"检测UA","message":navigator.userAgent,"icon":"/favicon.png","keep":true});
}

if (window.location.origin=="file://") { //本地模拟支持
	var LocalDebug=document.createElement("script");
	LocalDebug.src="/javascript/LocalDebug.js";
	document.head.appendChild(LocalDebug);
}