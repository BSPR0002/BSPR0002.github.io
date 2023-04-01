import {getJSON} from "./AJAX.mjs";
class CacheJSON {
	#address;
	#loaded=false;
	#fetching=false;
	#currentRequest=null;
	#mission=null;
	#lastFetch=-1;
	#data=null;
	abortRequest(){if (this.#currentRequest) this.#currentRequest.abort()}
	constructor(address,immediatelyFetch=true) {
		if (typeof address!="string") throw new TypeError("Failed to construct 'CacheJSON': Constructor require a string for resource address.");
		this.#address=address;
		if (immediatelyFetch) this.fetch();
	}
	get lastFetch(){return this.#lastFetch}
	get data(){
		const source=this.#data;
		if (typeof source=="object"&&source!=null) return Object.assign(Array.isArray(source)?[]:{},source);
		return source
	}
	get loaded(){return this.#loaded}
	fetch() {
		if (this.#fetching) return this.#mission;
		return this.#mission=this.#fetch();
	}
	#fetchHandler(resolve,reject){this.#currentRequest=getJSON(this.#address,resolve,false,reject)}
	async #fetch() {
		this.#fetching=true;
		try {
			this.#data=await new Promise(this.#fetchHandler.bind(this));
			this.#lastFetch=Date.now();
			this.#loaded=true;
		} catch(none){this.#loaded=false} finally {
			this.#currentRequest=null;
			this.#fetching=false;
			this.#mission=null;
		}
		return this.#loaded;
	}
	static {
		Object.defineProperty(this.prototype,Symbol.toStringTag,{
			value:"CacheJSON",
			writable:false,
			configurable:true,
			enumerable:false
		});
	}
}
export {CacheJSON}