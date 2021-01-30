class MultiThread {
	constructor(scriptAddress,listener=null,onerror=null,name=null) {
		this.core=new Worker(scriptAddress,{name:name?name:""});
		this.changeListener(listener);
		if (typeof onerror=="function") this.core.onerror=onerror;
	}
	static fromCodeString(codeString,listener=null,onerror=null,name=null){
		var fileAddress=URL.createObjectURL(new Blob([codeString],{type:"application/javascript;charset=utf-8"}));
		var worker=new this(fileAddress,listener,onerror,name);
		URL.revokeObjectURL(fileAddress);
		return worker;
	}
	send(data) {this.core.postMessage(data)}
	transfer(ArrayBuffer) {this.core.postMessage(ArrayBuffer,[ArrayBuffer])}
	changeListener(listener) {if (typeof listener=="function") this.core.onmessage=function(event){listener(event.data)}}
	shut(){this.core.terminate()}
}
export {MultiThread};