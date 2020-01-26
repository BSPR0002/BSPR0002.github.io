function AJAX(parameter) {
	var model={"method":"get","url":null,"async":true,"username":undefined,"password":undefined,"type":"","timeout":0,"send":null,"cache":true,"success":function(){},"fail":function(){}};
	Object.assign(model,parameter);
	var XHR=new XMLHttpRequest();
	XHR.open(model.method,model.url,model.async,model.username,model.password);
	XHR.responseType=model.type;
	XHR.timeout=model.timeout;
	if (model.cache==false) XHR.setRequestHeader("If-Modified-Since","0");
	XHR.onload=function() {
		if ((XHR.status>=200&&XHR.status<300)||XHR.status==304) {
			model.success(XHR.response);
		} else model.fail(XHR.status);
	};
	XHR.send(model.send);
}

function getJSON(url,callback,AllowCache){
	var AJAXModel={"url":url,"type":"json","success":function(response) {
		callback(response);
	}};
	if (AllowCache==false) AJAXModel.cache=false;
	AJAX(AJAXModel);
}

function getXML(url,callback,AllowCache) {
	var AJAXModel={"url":url,"type":"document","success":function(response) {
		callback(response);
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
		EmptyElement(TargetElement);
		TargetElement.appendChild(Operator);
	}};
	if (AllowCache==false) AJAXModel.cache=false;
	AJAX(AJAXModel);
}

function Each(obj,action) {
	for (var key in obj){action(key,obj[key])};
}

//未来备用代码
/*
"error":function(){},
try{
	XHR.send(model.send);
} catch(e) {
	model.error();
};
*/