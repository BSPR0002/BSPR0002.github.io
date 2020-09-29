"use strict";
const global=window;
{
let functions=[];
let temp_toString=Function.prototype.toString;
function toString(){
	if (typeof this!="function") throw new TypeError("Function.prototype.toString requires that 'this' be a Function");
	for (let i of functions) {
		if (this==i) return "function "+this.name+"() { [native code] }";
	}
	return temp_toString.call(this)
}
functions[0]=toString;
Function.prototype.toString=toString;
let Symbols={};
let local={};

Symbols.setMainWindow=Symbol("setMainWindow");
class Window extends EventTarget {
	static toString=toString;
	get [Symbol.toStringTag](){return "Window"}
	static #legal=true;
	[Symbols.setMainWindow](){this.#isMainWindow=true}
	#isMainWindow=false;
	#Element=document.createElement("div");
	#closable=true;
	get closable(){return this.#closable}
	#screenWidth=800;
	get screenWidth(){return this.#screenWidth}
	set screenWidth(value) {
		value=parseInt(value);
		if (!isFinite(value)) throw new TypeError("The input value is not a finite number.")
		if (value<256) {
			console.warn("The minimum screen width is 256.")
			return this.#screenWidth=256;
		}
		if (value>4096) {
			console.warn("The maximum screen width is 4096.")
			return this.#screenWidth=4096;
		}
	}
	#screenHeight=600;
	get screenHeight(){return this.#screenHeight}
	set screenHeight(value) {
		value=parseInt(value);
		if (!isFinite(value)) throw new TypeError("The input value is not a finite number.")
		if (value<256) {
			console.warn("The minimum screen height is 256.")
			return this.#screenHeight=256;
		}
		if (value>4096) {
			console.warn("The maximum screen height is 4096.")
			return this.#screenHeight=4096;
		}
	}
	constructor(options) {
		super();
		if (options.closable===false) this.#closable=false;
		Object.freeze(this);
		if (options.screenWidth) this.#screenWidth=options.screenWidth;
		if (options.screenHeight) this.#screenHeight=options.screenHeight;
		var window=this.Element;
		
	}
}
functions.push(Window);
Object.freeze(Window);
local.Window=Window;
global.Window=Window;

class System extends EventTarget {
	static toString=toString;
	static #builtIn=false;
	get [Symbol.toStringTag](){return "System"}
	static #legal=true;
	version=0.001000;
	versionString="Build 1.0(1000)";
	platform="web";
	OS="browser";
	language=navigator.language;
	programPath=(function(){
		var temp=location.pathname.split("/");
		temp.splice(0,1);
		temp[temp.length-1]="";
		return temp.join("\\")
	})();
	appDataPath="C:\\fakepath\\AppData\\";
	#onblur=null;
	get onblur(){return this.#onblur}
	set onblur(value){
		if (typeof value=="function"||value===null) this.#onblur=value;
		return value
	}
	#onfocus=null;
	get onblur(){return this.#onfocus}
	set onblur(value){
		if (typeof value=="function"||value===null) this.#onfocus=value;
		return value
	}
	#onerror=null;
	get onblur(){return this.#onerror}
	set onblur(value){
		if (typeof value=="function"||value===null) this.#onerror=value;
		return value
	}
	#mainWindow=null;
	get mainWindow(){return this.#mainWindow}
	#exitOnMainWindowClose=true;
	get exitOnMainWindowClose(){return this.#exitOnMainWindowClose}
	set exitOnMainWindowClose(value){
		this.#exitOnMainWindowClose=Boolean(value);
		return value
	}
	#onMainWindowClose=function(){if (this.#exitOnMainWindowClose) this.exit()}
	setMainWindow(Window){
		if (!(Window instanceof local.Window)) throw new TypeError("Failed to execute 'setMainWindow' on 'System': Parameter 'Window' is not an instance of Engine Window!")
		if (this.#mainWindow) throw new Error("Failed to execute 'setMainWindow' on 'System': The main window has been set.");
		Window[Symbols.setMainWindow]();
		this.#mainWindow=Window;
		Window.addEventListener("close",this.#onMainWindowClose.bind(this));
	}
	#appLocked=false
	#appLockKey=null;
	createAppLock(key){
		if (this.#appLocked) throw new Error("Failed to execute 'createAppLock' on 'System': Application lock with key '"+this.#appLockKey+"' has been set!");
		this.#appLockKey=String(key);
		console.log("Debugger: Set application lock with key '"+this.#appLockKey+"'.")
		return this.#appLocked=true
	}
	exit() {
		if (!this.#legal) throw new TypeError("Illegal invocation");
		window.close()
	}
	constructor() {
		super();
		if (this.constructor.#builtIn) throw new TypeError("Illegal constructor");
		this.constructor.#builtIn=true;
		var self=this;
		this.addEventListener("blur",function(event){if (typeof this.#onblur=="function") this.#onblur(event)});
		this.addEventListener("focus",function(event){if (typeof this.#onfocus=="function") this.#onfocus(event)});
		this.addEventListener("error",function(event){if (typeof this.#onerror=="function") this.#onerror(event)});
		
		Object.defineProperty(this,"title",{
			"get":function(){return document.title},
			"set":function(value){return document.title=value},
			"configurable":false,
			"enumerable":true
		})
		Object.freeze(this)
	}
}
functions.push(System);
Object.freeze(System);
global.System=System;
}
const system=new System;
window.addEventListener("error",function(event) {
	event.preventDefault();
	var error=event.error?event.error:{"name":"未知","message":"未知"};
	console.log("出错文件：",event.filename,"\n出错行号：",event.lineno,"\n出错列号：",event.colno,"\n错误类型：",error.name,"\n错误详情：",error.message);
	return true
});
console.log("Debugger: The web system environment has been set up.");
