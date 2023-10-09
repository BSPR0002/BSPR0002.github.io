import { parseAndGetNodes as ArrayHTML } from "./ArrayHTML.mjs";
const { layer, windowBody, windowTitle, windowQueue, windowClose, windowContent, contentFrame, confirmStyle, subLayer, subTitle, subFrame, subBody } = ArrayHTML([
	["div", [
		["style", [
			"#MiniWindowLayer,#MiniWindowSubLayer{top:0;bottom:0;left:0;right:0;z-index:1073741823;display:none}",
			"#MiniWindowLayer{position:fixed;background-color:rgba(0,0,0,0.7)}",
			"#MiniWindowSubLayer{position:absolute}",
			"#MiniWindow,#MiniWindowSub{box-sizing:border-box;place-self:center;min-width:16rem;min-height:8rem;max-width:80%;max-height:80%;overflow:hidden;border-radius:0.75rem;padding:0.75rem;display:grid;grid-template-rows:1.25rem auto 1fr;background-color:var(--MiniWindow_backgroundColor);color:var(--MiniWindow_textColor);font-size:0.9375rem;user-select:text}",
			"#MiniWindowLayer,#MiniWindow,#MiniWindowSub{animation-duration:0.5s;animation-fill-mode:forwards}",
			"#MiniWindow{--MiniWindow_backgroundColor:#FFFFFF;--MiniWindow_textColor:#404040;--MiniWindow_buttonBackgroundColor:#CCCCCC;--MiniWindow_buttonHoverBackgroundColor:#7FBFFF;--MiniWindow_buttonActiveBackgroundColor:#0080FF;--MiniWindow_buttonTextColor:#000000;--MiniWindow_buttonHoverTextColor:#000000;--MiniWindow_buttonActiveTextColor:#FFFFFF}",
			"@keyframes MiniWindowFadeIn{from{opacity:0}}",
			"@keyframes MiniWindowFadeOut{to{opacity:0}}",
			"#MiniWindowLayer.in,#MiniWindow.in{animation-name:MiniWindowFadeIn}",
			"#MiniWindowLayer.out,#MiniWindow.out{animation-name:MiniWindowFadeOut}",
			"@keyframes MiniWindowSubWindowIn{from{opacity:0;transform:translateY(-1rem)}}",
			"@keyframes MiniWindowSubWindowOut{to{opacity:0}}",
			"#MiniWindowSub{box-shadow:#000000 0 0 0.5rem}",
			"#MiniWindowSub.in{animation:MiniWindowSubWindowIn 0.2s forwards}",
			"#MiniWindowSub.out{animation:MiniWindowSubWindowOut 0.2s forwards}",
			"#MiniWindow button{border:none;border-radius:0.25rem;padding:0.5em}",
			"#MiniWindow button,#MiniWindowQueue{background-color:var(--MiniWindow_buttonBackgroundColor);color:var(--MiniWindow_buttonTextColor);user-select:none}",
			"#MiniWindow button:hover{background-color:var(--MiniWindow_buttonHoverBackgroundColor);color:var(--MiniWindow_buttonHoverTextColor)}",
			"#MiniWindow button:active:focus{background-color:var(--MiniWindow_buttonActiveBackgroundColor);color:var(--MiniWindow_buttonActiveTextColor)}",
			"#MiniWindowTop{overflow:hidden;display:grid;grid-template-columns:1fr 2em 1.25rem;gap:0.25rem}",
			"#MiniWindowTop>*{height:100%;width:100%}",
			"#MiniWindowTitle,#MiniWindowSubTitle{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}",
			"#MiniWindowQueue{box-sizing:border-box;border:solid 0.125rem var(--MiniWindow_buttonTextColor);border-radius:0.25rem;overflow:hidden;display:grid;place-content:center;font-size:0.75rem}",
			"#MiniWindowClose{position:relative;border-radius:0.25rem}",
			"#MiniWindowClose::before,#MiniWindowClose::after{content:\"\";position:absolute;top:0;bottom:0;left:0;right:0;margin:auto;border-radius:0.0625rem;width:0.125rem;height:1rem;background-color:var(--MiniWindow_buttonTextColor);transform:rotate(45deg)}",
			"#MiniWindowClose::before{transform:rotate(-45deg)}",
			"#MiniWindowClose:hover::before,#MiniWindowClose:hover::after{background-color:var(--MiniWindow_buttonHoverTextColor)}",
			"#MiniWindowClose:active::before,#MiniWindowClose:active::after{background-color:var(--MiniWindow_buttonActiveTextColor)}",
			"#MiniWindowHR,#MiniWindowSubHR{box-sizing:border-box;width:100%;border:solid 0.0625rem var(--MiniWindow_textColor);border-radius:0.0625rem;background-color:var(--MiniWindow_textColor)}",
			"#MiniWindowContentFrame{position:relative;width:100%;height:100%;overflow:hidden}",
			"#MiniWindowLayer.in>#MiniWindow::after,#MiniWindowLayer.out>#MiniWindow::after,#MiniWindow.in::after,#MiniWindow.out::after,#MiniWindowSub.in::after,#MiniWindowSub.out::after,#MiniWindowContentFrame.blocked::after{content:\"\";position:absolute;z-index:2147483647;left:0;right:0;top:0;bottom:0;display:block;opacity:0}",
			"#MiniWindowContent{position:relative;max-width:100%;max-height:100%;width:100%;height:100%;overflow:auto;word-wrap:break-word;word-break:normal;color:var(--MiniWindow_textColor);user-select:text}",
			"#MiniWindowContent img{max-width:100%;height:auto}",
			"#MiniWindowSubContentFrame{display:grid;gap:0.5rem}",
			"#MiniWindowSubContentFrame.confirm,#MiniWindowSubContentFrame.alert{grid-template-rows:1fr auto}",
			"#MiniWindowSubMessage{overflow:hidden auto}",
			"#MiniWindowSubButtons{display:grid;grid-auto-columns:minmax(auto,6rem);grid-auto-flow:column;gap:0.5rem;justify-self:end}",
			"#MiniWindowSubButtons>button{font-weight:bold}",
			"#MiniWindowSubContentFrame.wait{grid-template-columns:2rem 1fr;place-items:center start}",
			"#MiniWindowSubCycle,#MiniWindowSubCycle::before{width:2rem;height:2rem}",
			"@keyframes MiniWindowSubCycle{from{transform:rotate(0)}to{transform:rotate(1turn)}}",
			"#MiniWindowSubCycle::before{display:block;content:\"\";box-sizing:border-box;background-color:transparent;border:solid 0.125rem;border-color:#0080FF #0080FF transparent transparent;border-radius:50%;transform-origin:center;animation:MiniWindowSubCycle 1s linear infinite forwards running}"
		]],
		["div", [
			["div", [
				["span", null, { id: "MiniWindowTitle" }, "windowTitle"],
				["span", "0", { id: "MiniWindowQueue", title: "正在排队的弹窗数量" }, "windowQueue"],
				["button", null, { id: "MiniWindowClose", title: "关闭" }, "windowClose"]
			], { id: "MiniWindowTop" }],
			["HR", null, { id: "MiniWindowHR" }],
			["div", [
				["div", null, { id: "MiniWindowContent" }, "windowContent"]
			], { id: "MiniWindowContentFrame" }, "contentFrame"],
			["div", [
				["div", [
					["span", null, { id: "MiniWindowSubTitle" }, "subTitle"],
					["HR", null, { id: "MiniWindowSubHR" }],
					["div", null, { id: "MiniWindowSubContentFrame" }, "subFrame"]
				], { id: "MiniWindowSub" }, "subBody"]
			], { id: "MiniWindowSubLayer" }, "subLayer"]
		], { id: "MiniWindow" }, "windowBody"]
	], { id: "MiniWindowLayer" }, "layer"],
	["style", [
		"#MiniWindowContent{display:grid;grid-template-rows:1fr auto;gap:0.5rem}",
		"#MiniWindow_confirm_descriptions{overflow:hidden auto}",
		"#MiniWindow_confirm_buttons{display:grid;grid-template-columns:repeat(2,minmax(auto,6rem));gap:0.5rem;justify-self:end}",
		"#MiniWindow_confirm_buttons>button{font-weight:bold}"
	], null, "confirmStyle"]
]).nodes;
const queue = [], windowStyle = windowBody.style;
var pending = false, closeCurrent = null, unshiftMode = false;
function preventBubble(event) { event.stopPropagation() }
const STYLE_NAMES = ["backgroundColor", "textColor", "buttonBackgroundColor", "buttonHoverBackgroundColor", "buttonActiveBackgroundColor", "buttonTextColor", "buttonHoverTextColor", "buttonActiveTextColor"];
class QueueItem {
	controller = new MiniWindowController(this);
	instance;
	data;
	constructor(instance, data) {
		this.instance = instance;
		this.data = data;
	}
	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: "QueueItem",
			configurable: true
		});
	}
}
class MiniWindowController {
	constructor(queueItem) { this.queueItem = queueItem }
	pending = true;
	active = false;
	closed = false;
	blocked = true;
	queueItem;
	subWindow = null;
	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: this.name,
			configurable: true
		});
	}
}
class SubWindowController {
	promise1;
	promise2;
	active = true;
	resolve1;
	reject1;
	resolve2;
	#ex1(resolve, reject) { this.resolve1 = resolve; this.reject1 = reject }
	#ex2(resolve) { this.resolve2 = resolve }
	constructor() {
		this.promise1 = new Promise(this.#ex1.bind(this));
		this.promise2 = new Promise(this.#ex2.bind(this));
	}
	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: this.name,
			configurable: true
		});
	}
}
class MiniWindow extends EventTarget {
	static #checkInstance(instance) { if (!(instance instanceof this)) throw new TypeError("Illegal invocation") }
	#onshow = null;
	#onshown = null;
	#onclose = null;
	#onclosed = null;
	get onshow() { return this.#onshow }
	get onshown() { return this.#onshown }
	get onclose() { return this.#onclose }
	get onclosed() { return this.#onclosed }
	#onshowHandler(event) { if (this.#onshow) this.#onshow(event) }
	set onshow(value) {
		super.removeEventListener("show", this.#onshowHandler);
		if (typeof value == "function") {
			super.addEventListener("show", this.#onshowHandler);
			this.#onshow = value
		} else this.#onshow = null;
	}
	#onshownHandler(event) { if (this.#onshown) this.#onshown(event) }
	set onshown(value) {
		super.removeEventListener("shown", this.#onshownHandler);
		if (typeof value == "function") {
			super.addEventListener("shown", this.#onshownHandler);
			this.#onshown = value
		} else this.#onshown = null;
	}
	#oncloseHandler(event) { if (this.#onclose) this.#onclose(event) }
	set onclose(value) {
		super.removeEventListener("close", this.#oncloseHandler);
		if (typeof value == "function") {
			super.addEventListener("close", this.#oncloseHandler);
			this.#onclose = value
		} else this.#onclose = null;
	}
	#onclosedHandler(event) { if (this.#onclosed) this.#onclosed(event) }
	set onclosed(value) {
		super.removeEventListener("closed", this.#onclosedHandler);
		if (typeof value == "function") {
			super.addEventListener("closed", this.#onclosedHandler);
			this.#onclosed = value
		} else this.#onclosed = null;
	}
	#controller;
	get active() { return this.#controller.active }
	get closed() { return this.#controller.closed }
	get blocked() { return this.#controller.blocked }
	constructor(content, title = undefined, options = null) {
		if (arguments.length < 1) throw new TypeError("Failed to construct 'MiniWindow': 1 argument required, but only 0 present.");
		if (typeof content != "string" && !(content instanceof Node)) throw new TypeError("Failed to construct 'MiniWindow': Argument 'content' is not a string or HTML node.");
		if (typeof options != "object") throw new TypeError("Failed to construct 'MiniWindow': Argument 'options' is not an object.");
		super();
		const queueItem = new QueueItem(this, { content, title, options });
		this.#controller = queueItem.controller;
		queueUp(queueItem);
	}
	blockSwitch(toState = undefined) {
		MiniWindow.#checkInstance(this);
		return blockContentSwitch(this.#controller, toState);
	}
	close() {
		MiniWindow.#checkInstance(this);
		closeInstance(this.#controller);
	}
	after(content, title = undefined, options = null) {
		MiniWindow.#checkInstance(this);
		if (arguments.length < 1) throw new TypeError("Failed to execute 'after' on 'MiniWindow': 1 argument required, but only 0 present.");
		if (typeof content != "string" && !(content instanceof Node)) throw new TypeError("Failed to execute 'after' on 'MiniWindow': Argument 'content' is not a string or HTML node.");
		if (typeof options != "object") throw new TypeError("Failed to execute 'after' on 'MiniWindow': Argument 'options' is not an object.");
		if (!this.#controller.active) throw new Error("Failed to execute 'after' on 'MiniWindow': The instance is not active.");
		unshiftMode = true;
		const temp = new MiniWindow(content, title, options);
		unshiftMode = false;
		return temp;
	}
	#subWindowCheck() {
		if (!this.#controller.active) throw new Error(`Failed to execute 'subWindowCheck' on 'MiniWindow': The instance is not active.`);
		if (this.#controller.subWindow?.active) throw new Error(`Failed to execute 'subWindowCheck' on 'MiniWindow': Sub window is occupied now.`);
	}
	async #createSub(controller, type, title, content) {
		const main = this.#controller, pre = main.subWindow;
		main.subWindow = controller;
		if (pre) {
			await pre.promise2;
			if (!main.active) {
				controller.resolve2();
				return;
			}
		}
		showSub(type, title, content);
		try { await controller.promise1 } finally {
			controller.active = false;
			closeSub(main, controller);
		}
	}
	alert(message) {
		MiniWindow.#checkInstance(this);
		if (typeof message != "string") throw new TypeError("Failed to execute 'alert' on 'MiniWindow': Argument 'message' is not a string.");
		this.#subWindowCheck();
		const AH = ArrayHTML([
			["div", message, { id: "MiniWindowSubMessage" }],
			["div", [["button", "确认", null, "ok"]], { id: "MiniWindowSubButtons" }]
		]), ok = AH.nodes.ok, controller = new SubWindowController, { promise1, resolve1 } = controller;
		ok.addEventListener("click", function () { resolve1() }, { once: true, passive: true });
		this.#createSub(controller, "alert", "提示", AH.documentFragment);
		return promise1;
	}
	confirm(message) {
		MiniWindow.#checkInstance(this);
		if (typeof message != "string") throw new TypeError("Failed to execute 'confirm' on 'MiniWindow': Argument 'message' is not a string.");
		this.#subWindowCheck();
		const AH = ArrayHTML([
			["div", message, { id: "MiniWindowSubMessage" }],
			["div", [
				["button", "是", null, "yes"],
				["button", "否", null, "no"]
			], { id: "MiniWindowSubButtons" }]
		]), { yes, no } = AH.nodes, controller = new SubWindowController, { promise1, resolve1 } = controller;
		yes.addEventListener("click", function () { resolve1(true) }, { once: true, passive: true });
		no.addEventListener("click", function () { resolve1(false) }, { once: true, passive: true });
		this.#createSub(controller, "confirm", "确认", AH.documentFragment);
		return promise1;
	}
	wait(message) {
		if (typeof message != "string") throw new TypeError("Failed to execute 'wait' on 'MiniWindow': Argument 'message' is not a string.");
		this.#subWindowCheck("wait");
		const AH = ArrayHTML([
			["div", null, { id: "MiniWindowSubCycle" }],
			["div", message, { id: "MiniWindowSubMessage" }]
		]), controller = new SubWindowController, { resolve1 } = controller;
		this.#createSub(controller, "wait", "请等待", AH.documentFragment);
		return resolve1;
	}
	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: this.name,
			configurable: true
		});
	}
	static confirm(content, title = "确认") {
		if (arguments.length < 1) throw new TypeError("Failed to execute 'confirm': 1 argument required, but only 0 present.");
		if (typeof content != "string" && !(content instanceof Node)) throw new TypeError("Failed to execute 'confirm': Argument 'content' is not a string or HTML node.");
		if (typeof title != "string") title = "确认";
		const AH = ArrayHTML([
			confirmStyle,
			["div", content, { id: "MiniWindow_confirm_descriptions" }],
			["div", [
				["button", "是", null, "yes"],
				["button", "否", null, "no"]
			], { id: "MiniWindow_confirm_buttons" }]
		], true), { yes, no } = AH.nodes;
		var fulfill;
		const promise = new Promise(function (resolve) { fulfill = resolve }), miniWindow = new this(AH.documentFragment, title, { noManualClose: true, size: { width: "384px" } });
		yes.addEventListener("click", function () {
			fulfill(true);
			miniWindow.close();
		}, { once: true, passive: true });
		no.addEventListener("click", function () {
			fulfill(false);
			miniWindow.close();
		}, { once: true, passive: true });
		return promise;
	}
}
function clearContent() {
	windowBody.style = "";
	windowClose.style = "";
	windowContent.innerHTML = "";
	windowContent.style = "";
	for (let i of STYLE_NAMES) windowStyle.setProperty(`--MiniWindow_${i}`, null);
	contentFrame.className = "";
}
function setStyle(data) {
	if (!(data instanceof Object)) return;
	for (let i of STYLE_NAMES) if (i in data) windowStyle.setProperty(`--MiniWindow_${i}`, data[i]);
}
const sizeFormat = /^\d+%$/;
function setSize(data) {
	if (!(data instanceof Object)) return;
	if ("width" in data) {
		let width = data.width;
		(sizeFormat.test(width) ? windowBody : windowContent).style.width = width;
	}
	if ("height" in data) {
		let height = data.height;
		(sizeFormat.test(height) ? windowBody : windowContent).style.height = height;
	}
}
function setContent(data) {
	const { content, title, options } = data;
	windowTitle.innerText = title ?? "提示";
	windowContent.innerHTML = "";
	switch (typeof content) {
		case "string":
			windowContent.innerText = content;
			break;
		case "object":
			windowContent.appendChild(content);
			break;
	}
	if (!options) return;
	if (options.noManualClose) windowClose.style.display = "none";
	if ("size" in options) setSize(options.size);
	if ("style" in options) setStyle(options.style);
}
function fadeIn(target) {
	return new Promise(function (resolve) {
		target.addEventListener("animationend", function (event) { preventBubble(event); target.className = ""; resolve() }, { once: true, passive: true });
		target.className = "in";
	})
}
function fadeOut(target) {
	return new Promise(function (resolve) {
		target.addEventListener("animationend", function (event) { preventBubble(event); target.className = ""; resolve() }, { once: true, passive: true });
		target.className = "out";
	})
}
async function operator() {
	var target = layer;
	while (true) {
		let { data, instance, controller } = queue.splice(0, 1)[0];
		controller.pending = false;
		updateQueueNumber();
		setContent(data);
		let close = new Promise(waitClose);
		controller.active = true;
		instance.dispatchEvent(new Event("show"));
		await fadeIn(target);
		instance.dispatchEvent(new Event("shown"));
		await close;
		closeCurrent = null;
		controller.active = false;
		controller.closed = true;
		if (controller.subWindow?.active) controller.subWindow.reject1(new Error("MiniWindow close"));
		instance.dispatchEvent(new Event("close"));
		await fadeOut(target = queue.length ? windowBody : layer);
		instance.dispatchEvent(new Event("closed"));
		clearContent();
		if (target == windowBody && !queue.length) {
			await fadeOut(target = layer);
			windowBody.className = "";
			if (!queue.length) break;
		} else if (!queue.length) break;
	}
}
async function show() {
	if (!queue.length) {
		pending = false;
		return;
	}
	layer.style.display = "grid";
	await operator();
	layer.style.display = null;
	pending = false;
}
function updateQueueNumber() { windowQueue.innerText = queue.length > 99 ? "99+" : queue.length }
function queueUp(queueItem) {
	if (unshiftMode) {
		queue.unshift(queueItem);
		updateQueueNumber();
		return;
	}
	queue.push(queueItem);
	updateQueueNumber();
	if (pending) return;
	pending = true;
	queueMicrotask(show);
}
function waitClose(resolve) { closeCurrent = resolve }
function closeInstance(controller) {
	if (controller.closed) return;
	controller.closed = true;
	if (controller.pending) {
		let index = queue.indexOf(controller.queueItem);
		queue.splice(index, 1);
		updateQueueNumber();
	} else closeCurrent();
}
function blockContentSwitch(controller, toState) {
	if (!controller.active) return false;
	contentFrame.className = (controller.blocked = toState ?? !controller.blocked) ? "blocked" : "";
	return true;
}
function close(event) {
	if (!event.isTrusted) throw new Error("MiniWindow only accept user gesture!");
	if (closeCurrent) closeCurrent();
}
async function showSub(type, title, content) {
	subTitle.innerText = title;
	subFrame.className = type;
	subFrame.appendChild(content);
	subLayer.style.display = "grid";
	await fadeIn(subBody);
}
async function closeSub(main, controller) {
	await fadeOut(subBody);
	clearSub();
	controller.resolve2();
	if (main.subWindow == controller) main.subWindow = null;
}
function clearSub() {
	subLayer.style.display = null;
	subTitle.innerText = subFrame.className = subFrame.innerHTML = "";
}
function remove() { layer.remove() }
function reload() { document.body.appendChild(layer) }
windowClose.addEventListener("click", close, { passive: true });
contentFrame.addEventListener("animationend", preventBubble, { passive: true });
document.body.appendChild(layer);
export default MiniWindow;
export { MiniWindow, remove, reload }