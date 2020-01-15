function AJAX(parameter) {
	var model={"method":"get","url":null,"async":true,"username":null,"password":null,"send":null,"cache":true,"success":function(){},"fail":function(){}};
	Object.assign(model,parameter);
	var XMLHR=new XMLHttpRequest();
	XMLHR.open(model.method,model.url,model.async,model.username,model.password);
	if (model.cache==false) XMLHR.setRequestHeader("If-Modified-Since","0");
	XMLHR.onreadystatechange=function() {
		if (XMLHR.readyState==4) {
			if (XMLHR.status==200||XMLHR.status==304) {
				model.success(XMLHR.responseText);
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

function getXML(url,callback,AllowCache) {
	var AJAXModel={"url":url,"success":function(response) {
		callback(new DOMParser().parseFromString(response,"text/xml"));
	}};
	if (AllowCache==false) AJAXModel.cache=false;
	AJAX(AJAXModel);
}

function EmptyElement(TargetElement) {
	var Operator=document.createRange();
	Operator.selectNodeContents(TargetElement);
	Operator.deleteContents();
}

function Load(url,TargetElement,AllowCache) {
	var AJAXModel={"url":url,"success":function(response) {
		var Operator=document.createRange().createContextualFragment(response);
		TargetElement.appendChild(Operator);
	}};
	if (AllowCache==false) AJAXModel.cache=false;
	AJAX(AJAXModel);
}

function Each(obj,action) {
	for (var key in obj){action(key,obj[key])};
}