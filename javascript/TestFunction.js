function testfunc(targ,rqtype) {
	var xmlhttp=null;
	//IE兼容
	if (window.XMLHttpRequest) {
		xmlhttp=new XMLHttpRequest();
	} else {
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	//兼容代码尾部
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			console.log("=1=");
			console.log(xmlhttp.responseText);
			console.log("=2=");
			console.log(xmlhttp.responseXML);
			//this.innerHTML=xmlhttp.responseXML;
		}
	}
	xmlhttp.open("GET",targ,true);
	xmlhttp.send();
}