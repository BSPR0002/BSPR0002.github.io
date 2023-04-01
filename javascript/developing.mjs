class Thread {
	#worker;
	get onerror(){return this.#worker.onerror}
	set onerror(value){this.#worker.onerror=value}
	constructor(scriptAddress,isModule=false,onerror=null,workerName=null) {
		this.#worker=new Worker(scriptAddress,{type:isModule?"module":"classic",name:workerName??`BSIF.Thread[${Date.now()}]`});
		this.#worker.onerror=onerror;
	}
	static fromCodeString(codeString,onerror=null,workerName=null) {
		const fileAddress=URL.createObjectURL(new Blob([codeString],{type:"application/javascript"})),thread=new this(fileAddress,false,onerror,workerName);
		URL.revokeObjectURL(fileAddress);
		return thread;
	}
	send(data,transferList=undefined) {
		const {port1,port2}=new MessageChannel,promise=new Promise(function(resolve) {
			port1.onmessage=function(event) {
				port1.close();
				resolve(event.data);
			};
		});
		this.#worker.postMessage({data,respondPort:port2},Array.isArray(transferList)?[port2].concat(transferList):[port2]);
		return promise
	}
	noResponseSend(data,transferList=undefined){this.#worker.postMessage(data,transferList)}
	shut(){this.#worker.terminate()}
	static convertMessage(event) {
		if (!(event instanceof MessageEvent)) throw new TypeError("Failed to execute 'convertMessage': Argument 'event' is not a MessageEvent.");
		const message=event.data,{respondPort}=message;
		return {data:message.data,respond:respondPort.postMessage.bind(respondPort)}
	}
}
export {Thread};