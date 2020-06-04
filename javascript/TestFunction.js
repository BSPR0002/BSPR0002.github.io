function testfunc() {
	var UA=DetectUA().Mobile?"移动设备":"电脑";
	alert("您的UA为"+UA);
	NotificationCreater({"title":"检测UA","message":navigator.userAgent,"icon":"/favicon.png","keep":true});
}