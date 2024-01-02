import { parse, parseAndGetNodes, EVENT_LISTENERS } from "./ArrayHTML.mjs";
const { layer, windowBody, windowTitle, windowQueue, windowClose, windowContent, contentFrame, confirmStyle, subLayer, subTitle, subFrame, subBody } = parseAndGetNodes([
	["div", [
		["style", [
			"#mini-window-layer,#mini-window-sub-layer{top:0;bottom:0;left:0;right:0;z-index:1073741823;display:none}",
			"#mini-window-layer{position:fixed;background-color:rgba(0,0,0,0.7)}",
			"#mini-window-sub-layer{position:absolute}",
			"#mini-window,#mini-window-sub{box-sizing:border-box;place-self:center;min-width:16rem;min-height:8rem;max-width:80%;max-height:80%;overflow:hidden;border-radius:0.75rem;padding:0.75rem;display:grid;grid-template-rows:1.25rem auto 1fr;background-color:var(--mini-window-background-color);color:var(--mini-window-text-color);font-size:0.9375rem;user-select:text}",
			"#mini-window-layer,#mini-window,#mini-window-sub{animation-duration:0.5s;animation-fill-mode:forwards}",
			"#mini-window{--mini-window-background-color:#FFFFFF;--mini-window-text-color:#404040;--mini-window-button-background-color:#CCCCCC;--mini-window-button-hover-background-color:#7FBFFF;--mini-window-button-active-background-color:#0080FF;--mini-window-button-text-color:#000000;--mini-window-button-hover-text-color:#000000;--mini-window-button-active-text-color:#FFFFFF}",
			"@keyframes mini-window-fade-in{from{opacity:0}}",
			"@keyframes mini-window-fade-out{to{opacity:0}}",
			"#mini-window-layer.in,#mini-window.in{animation-name:mini-window-fade-in}",
			"#mini-window-layer.out,#mini-window.out{animation-name:mini-window-fade-out}",
			"@keyframes mini-window-sub-window-in{from{opacity:0;transform:translateY(-1rem)}}",
			"@keyframes mini-window-sub-window-out{to{opacity:0}}",
			"#mini-window-sub{box-shadow:#000000 0 0 0.5rem}",
			"#mini-window-sub.in{animation:mini-window-sub-window-in 0.2s forwards}",
			"#mini-window-sub.out{animation:mini-window-sub-window-out 0.2s forwards}",
			"#mini-window .mini-window-button{border:none;border-radius:0.25rem;padding:0.5em}",
			"#mini-window .mini-window-button,#mini-window-queue{background-color:var(--mini-window-button-background-color);color:var(--mini-window-button-text-color);user-select:none}",
			"#mini-window .mini-window-button:hover{background-color:var(--mini-window-button-hover-background-color);color:var(--mini-window-button-hover-text-color)}",
			"#mini-window .mini-window-button:active:focus{background-color:var(--mini-window-button-active-background-color);color:var(--mini-window-button-active-text-color)}",
			"#mini-window-top{overflow:hidden;display:grid;grid-template-columns:1fr 2em 1.25rem;gap:0.25rem}",
			"#mini-window-top>*{height:100%;width:100%}",
			"#mini-window-title,#mini-window-sub-title{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}",
			"#mini-window-queue{box-sizing:border-box;border:solid 0.125rem var(--mini-window-button-text-color);border-radius:0.25rem;overflow:hidden;display:grid;place-content:center;font-size:0.75rem}",
			"#mini-window-close{position:relative;border-radius:0.25rem}",
			"#mini-window-close::before,#mini-window-close::after{content:\"\";position:absolute;top:0;bottom:0;left:0;right:0;margin:auto;border-radius:0.0625rem;width:0.125rem;height:1rem;background-color:var(--mini-window-button-text-color);transform:rotate(45deg)}",
			"#mini-window-close::before{transform:rotate(-45deg)}",
			"#mini-window-close:hover::before,#mini-window-close:hover::after{background-color:var(--mini-window-button-hover-text-color)}",
			"#mini-window-close:active::before,#mini-window-close:active::after{background-color:var(--mini-window-button-active-text-color)}",
			"#mini-window-hr,#mini-window-sub-hr{box-sizing:border-box;width:100%;border:solid 0.0625rem var(--mini-window-text-color);border-radius:0.0625rem;background-color:var(--mini-window-text-color)}",
			"#mini-window-content-frame{position:relative;width:100%;height:100%;overflow:hidden}",
			"#mini-window-layer.in>#mini-window::after,#mini-window-layer.out>#mini-window::after,#mini-window.in::after,#mini-window.out::after,#mini-window-sub.in::after,#mini-window-sub.out::after,#mini-window-content-frame.blocked::after{content:\"\";position:absolute;z-index:2147483647;left:0;right:0;top:0;bottom:0;display:block;opacity:0}",
			"#mini-window-content{position:relative;max-width:100%;max-height:100%;width:100%;height:100%;overflow:auto;word-wrap:break-word;word-break:normal;color:var(--mini-window-text-color);user-select:text}",
			"#mini-window-content img{max-width:100%;height:auto}",
			"#mini-window-sub-content-frame{display:grid;gap:0.5rem}",
			"#mini-window-sub-content-frame.confirm,#mini-window-sub-content-frame.alert{grid-template-rows:1fr auto}",
			"#mini-window-sub-message{overflow:hidden auto}",
			"#mini-window-sub-buttons{display:grid;grid-auto-columns:minmax(auto,6rem);grid-auto-flow:column;gap:0.5rem;justify-self:end}",
			"#mini-window-sub-buttons>.mini-window-button{font-weight:bold}",
			"#mini-window-sub-content-frame.wait{grid-template-columns:2rem 1fr;place-items:center start}",
			"#mini-window-sub-cycle,#mini-window-sub-cycle::before{width:2rem;height:2rem}",
			"@keyframes mini-window-sub-cycle{from{transform:rotate(0)}to{transform:rotate(1turn)}}",
			"#mini-window-sub-cycle::before{display:block;content:\"\";box-sizing:border-box;background-color:transparent;border:solid 0.125rem;border-color:#0080FF #0080FF transparent transparent;border-radius:50%;transform-origin:center;animation:mini-window-sub-cycle 1s linear infinite forwards running}"
		]],
		["div", [
			["div", [
				["span", null, { id: "mini-window-title" }, "windowTitle"],
				["span", "0", { id: "mini-window-queue", title: "正在排队的弹窗数量" }, "windowQueue"],
				["button", null, { id: "mini-window-close", class: "mini-window-button", title: "关闭" }, "windowClose"]
			], { id: "mini-window-top" }],
			["hr", null, { id: "mini-window-hr" }],
			["div", [
				["div", null, { id: "mini-window-content" }, "windowContent"]
			], { id: "mini-window-content-frame" }, "contentFrame"],
			["div", [
				["div", [
					["span", null, { id: "mini-window-sub-title" }, "subTitle"],
					["hr", null, { id: "mini-window-sub-hr" }],
					["div", null, { id: "mini-window-sub-content-frame" }, "subFrame"]
				], { id: "mini-window-sub" }, "subBody"]
			], { id: "mini-window-sub-layer" }, "subLayer"]
		], { id: "mini-window" }, "windowBody"]
	], { id: "mini-window-layer" }, "layer"],
	["style", [
		"#mini-window-content{display:grid;grid-template-rows:1fr auto;gap:0.5rem}",
		"#mini-window-confirm-descriptions{overflow:hidden auto}",
		"#mini-window-confirm-buttons{display:grid;grid-template-columns:repeat(2,minmax(auto,6rem));gap:0.5rem;justify-self:end}",
		"#mini-window-confirm-buttons>.mini-window-button{font-weight:bold}"
	], null, "confirmStyle"]
]).nodes;
const queue = [], windowStyle = windowBody.style;
var pending = false, closeCurrent = null, unshiftMode = false;
function preventBubble(event) { event.stopPropagation() }
const STYLE_NAMES = {
	backgroundColor: "background-color",
	textColor: "text-color",
	buttonBackgroundColor: "button-background-color",
	buttonHoverBackgroundColor: "button-hover-background-color",
	buttonActiveBackgroundColor: "button-active-background-color",
	buttonTextColor: "button-text-color",
	buttonHoverTextColor: "button-hover-text-color",
	buttonActiveTextColor: "button-active-text-color"
};
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
		const controller = new SubWindowController, { promise1, resolve1 } = controller;
		this.#createSub(controller, "alert", "提示", parse([
			["div", message, { id: "mini-window-sub-message" }],
			["div", [["button", "确认", { class: "mini-window-button", [EVENT_LISTENERS]: [["click", () => { resolve1() }, { once: true, passive: true }]] }]], { id: "mini-window-sub-buttons" }]
		]));
		return promise1;
	}
	confirm(message) {
		MiniWindow.#checkInstance(this);
		if (typeof message != "string") throw new TypeError("Failed to execute 'confirm' on 'MiniWindow': Argument 'message' is not a string.");
		this.#subWindowCheck();
		const controller = new SubWindowController, { promise1, resolve1 } = controller;
		this.#createSub(controller, "confirm", "确认", parse([
			["div", message, { id: "mini-window-sub-message" }],
			["div", [
				["button", "是", { class: "mini-window-button", [EVENT_LISTENERS]: [["click", () => { resolve1(true) }, { once: true, passive: true }]] }],
				["button", "否", { class: "mini-window-button", [EVENT_LISTENERS]: [["click", () => { resolve1(false) }, { once: true, passive: true }]] }]
			], { id: "mini-window-sub-buttons" }]
		]));
		return promise1;
	}
	wait(message) {
		if (typeof message != "string") throw new TypeError("Failed to execute 'wait' on 'MiniWindow': Argument 'message' is not a string.");
		this.#subWindowCheck("wait");
		const controller = new SubWindowController;
		this.#createSub(controller, "wait", "请等待", parse([
			["div", null, { id: "mini-window-sub-cycle" }],
			["div", message, { id: "mini-window-sub-message" }]
		]));
		return controller.resolve1;
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
		var fulfill;
		const promise = new Promise(function (resolve) { fulfill = resolve }), miniWindow = new this(parse([
			confirmStyle,
			["div", content, { id: "mini-window-confirm-descriptions" }],
			["div", [
				["button", "是", {
					class: "mini-window-button", [EVENT_LISTENERS]: [["click", () => {
						fulfill(true);
						miniWindow.close();
					}, { once: true, passive: true }]]
				}],
				["button", "否", {
					class: "mini-window-button", [EVENT_LISTENERS]: [["click", () => {
						fulfill(false);
						miniWindow.close();
					}, { once: true, passive: true }]]
				}]
			], { id: "mini-window-confirm-buttons" }]
		], true), title, { noManualClose: true, size: { width: "384px" } });
		return promise;
	}
}
function clearContent() {
	windowBody.style = "";
	windowClose.style = "";
	windowContent.innerHTML = "";
	windowContent.style = "";
	for (let i in STYLE_NAMES) windowStyle.setProperty(`--mini-window-${STYLE_NAMES[i]}`, null);
	contentFrame.className = "";
}
function setStyle(data) {
	if (!(data instanceof Object)) return;
	for (let i in STYLE_NAMES) if (i in data) windowStyle.setProperty(`--mini-window-${STYLE_NAMES[i]}`, data[i]);
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