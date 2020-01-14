function AJAX(parameter) {
	var model={"method":"get","url":null,"async":true,"username":null,"password":null,"send":null,"cache":true,"success":function(){},"fail":function(){}};
	Object.assign(model,parameter);
	var XMLHR=new XMLHttpRequest();
	XMLHR.open(model.method,model.url,model.async,model.username,model.password);
	if (model.cache==false) XMLHR.setRequestHeader("If-Modified-Since","0");
	XMLHR.onreadystatechange=function() {
		if (XMLHR.readyState==4) {
			if (XMLHR.status==200||XMLHR.status==304) {
				model.success(XMLHR.responseText,XMLHR.getResponseHeader("content-type"));
			} else model.fail(XMLHR.status);
		};
	};
	XMLHR.send(model.send);
}

function getJSON(url,callback,AllowCache){
	var AJAXModel={"url":url,"success":function(response) {
		callback(JSON.parse(response));
	}};
	if (AllowCache==false) AJAXModel.cache=false;
	AJAX(AJAXModel);
}

function EmptyElement(TargetElement) {
	var Operator=TargetElement.cloneNode(true);
	for (var i=Operator.childNodes.length;i>0;i--) {
		Operator.removeChild(Operator.firstChild);
	};
	TargetElement.parentNode.replaceChild(Operator,TargetElement);
}

function load(url,TargetElement,AllowCache) {
	var AJAXModel={"url":url,"success":function(response,contentType) {
		if (/text\/html/i.test(contentType)) {
			var Operator=new DOMParser().parseFromString(response,"text/xml");
			response=Operator;
		};
		
		tt=Operator;
	}};
	if (AllowCache==false) AJAXModel.cache=false;
	AJAX(AJAXModel);
}