class controller {
	constructor(){throw new TypeError("Illegal constructor")}
	static #VM=document.getElementById("VM");
	static #started=false;
	static #packet=null;
	static run(pack){
		if (this.#started) throw new Error("VM has been start!");
		if (!(pack instanceof Blob)) throw new TypeError("Failed to start VM: Data packet required!");
		this.#VM.src="./engine/engine.html";
		this.#started=true;
	}
	static exit(){
		this.#VM.removeAttribute("src");
		this.#started=false;
	}
}