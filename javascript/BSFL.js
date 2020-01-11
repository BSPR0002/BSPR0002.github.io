function AJAX(parameter) {
	var model={"method":"get","url":null,"async":true,"username":null,"password":null,"send":null,"cache":true,"success":null,"fail":null};
	Object.assign(model,parameter);
	var XMLHR=new XMLHttpRequest();
	XMLHR.open(model.open,model.url,model.async,model.username,model.password);
	if (model.cache==false) XMLHR.setRequestHeader("If-Modified-Since","0");
	XMLHR.onreadystatechange=function() {
		if (XMLHR.readyState==4) {
			if (XMLHR.status==200||XMLHR.status==304) {
				model.success(XMLHR.responseText);
			} else if (typeof model.fail=="function") {
				model.fail();
			} else model.fail;
		};
	};
	XMLHR.send(model.send);
}
