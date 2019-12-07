function AJAXstandardLOAD(targ) {
	var xmlhttp;
	if (window.XMLHttpRequest) {
		xmlhttp=new XMLHttpRequest();
	} else {
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			console.log(xmlhttp.responseText);
			console.log(xmlhttp.responsexXML);
			//this.innerHTML=xmlhttp.responseXML;
		}
	}
	xmlhttp.open("GET",targ,true);
	xmlhttp.send();
}