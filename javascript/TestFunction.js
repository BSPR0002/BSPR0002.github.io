function testfunc() {
	if (DetectUA().Mobile==true) {alert("您的UA为移动设备")} else {alert("您的UA为电脑")}
	NotificationCreater({"title":"检测UA","message":navigator.userAgent,"icon":"/favicon.png","keep":true});
}