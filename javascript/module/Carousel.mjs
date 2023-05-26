import { parse as ArrayHTML } from "./ArrayHTML.mjs";
document.head.appendChild(ArrayHTML([["STYLE", [
	".bs-carousel_box{box-sizing:border-box;width:100%;height:100%;border:1px solid black;position:relative;border-radius:1rem;background-color:black;overflow:hidden;transition:none 0.4s ease-in-out}",
	".bs-carousel_scroll,.bs-carousel_item{width:100%;height:100%}",
	".bs-carousel_scroll{left:0;position:absolute;top:0;display:grid;grid-auto-flow:column;grid-auto-columns:100%;transition-property:left;transition-duration:inherit;transition-timing-function:inherit;z-index:1}",
	".bs-carousel_item{position:relative;display:block;background-color:white}",
	".bs-carousel_item_image{width:100%;height:100%;background-position:center;background-size:cover;transition:transform 0.2s ease-in}",
	".bs-carousel_item.action{cursor:pointer}",
	".bs-carousel_item.action:hover>.bs-carousel_item_image{transform:scale(1.05)}",
	".bs-carousel_item.action:active>.bs-carousel_item_image{transition-duration:0s;transform:scale(1.025)}",
	".bs-carousel_item_text{box-sizing:border-box;width:100%;padding:0.5em;position:absolute;left:0;bottom:0;background-color:rgba(0,0,0,0.5);color:white;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
	".bs-carousel_paginations{width:min-content;height:0.25rem;margin:0 auto;padding:0.25rem 0.5rem;position:absolute;top:0;left:0;right:0;opacity:0.5;background-color:rgba(0,0,0,50%);display:grid;grid-auto-flow:column;grid-auto-columns:1rem;gap:0.5rem;transition-property:opacity,padding,height;transition-duration:inherit;transition-timing-function:inherit;border-radius:0 0 0.5rem 0.5rem;overflow:hidden;z-index:3}",
	".bs-carousel_paginations:hover{height:1rem;padding:0.5rem;opacity:1}",
	".bs-carousel_paginations_item{box-sizing:border-box;width:1rem;margin:0;display:block;border-radius:0.125rem;outline:none;appearance:none;background-color:#DDDDDD;overflow:hidden;transition-property:background-color,border-radius;transition-duration:inherit;transition-timing-function:inherit;cursor:pointer}",
	".bs-carousel_paginations_item:hover{background-color:#FFC000}",
	".bs-carousel_paginations_item:active{background-color:#00C000}",
	".bs-carousel_paginations:hover>.bs-carousel_paginations_item{border-radius:0.25rem}",
	".bs-carousel_paginations_float,.bs-carousel_paginations_item:checked{background-color:#00C0FF}",
	".bs-carousel_paginations_float{width:1rem;height:0.25rem;border-radius:0.125rem;position:absolute;left:0.5rem;top:0.25rem;transition-property:top,height,border-radius,transform;transition-duration:inherit;transition-timing-function:inherit}",
	".bs-carousel_paginations:hover>.bs-carousel_paginations_float{height:1rem;top:0.5rem;border-radius:0.25rem}",
	".bs-carousel_arrow{height:2rem;width:1.5rem;margin:auto 0;border:none;position:absolute;top:0;bottom:0;opacity:0;background-color:rgba(0,0,0,0.5);color:white;font-size:1rem;line-height:2rem;text-align:center;z-index:2;transition:opacity 0.2s ease-in;cursor:pointer}",
	".bs-carousel_box.single>.bs-carousel_paginations,.bs-carousel_box.single>.bs-carousel_arrow{display:none}",
	".bs-carousel_arrow.prev{border-radius:0 0.5rem 0.5rem 0;left:0}",
	".bs-carousel_arrow.next{border-radius:0.5rem 0 0 0.5rem;right:0}",
	".bs-carousel_box:hover>.bs-carousel_arrow{opacity:1}"
]]]));
function buildItem(data) {
	const temp = [];
	if ("image" in data) temp.push(["DIV", null, { class: "bs-carousel_item_image", style: `background-image:url("${data.image}")` }]);
	if ("text" in data) temp.push(["DIV", data.text, { class: "bs-carousel_item_text", title: data.text }]);
	var item = ["DIV", temp, { class: "bs-carousel_item" }, "item"];
	const action = data.action, attribute = item[2];
	switch (typeof action) {
		case "function":
			attribute.class += " action";
			item = ArrayHTML([item], true).nodes.item;
			item.addEventListener("click", action);
			break;
		case "string":
			item[0] = "A";
			attribute.href = action;
			attribute.class += " action";
			attribute.target = "_blank";
		default:
	}
	return item;
}
function filter(item) { return item instanceof Object }
class Carousel {
	#waitTime = 10000;
	get waitTime() { return this.#waitTime }
	set waitTime(value) {
		const temp = Number(value);
		if (!isFinite(temp) || temp < 1000) return;
		this.#waitTime = temp;
		this.#resetInterval();
	}
	#running = false;
	get running() { return this.#running }
	#intervalId = null;
	#size;
	#box;
	#float;
	#navi;
	#pagination;
	#scroll;
	#formChange() {
		const number = Number(this.#pagination.value);
		this.#scroll.left = -number * 100 + "%";
		this.#float.transform = `translateX(${number * 1.5}rem)`;
	}
	#change(page) {
		this.#pagination[page].checked = true;
		this.#navi.dispatchEvent(new Event("change"));
	}
	#next() {
		const next = Number(this.#pagination.value) + 1;
		this.#change(next > -1 && next < this.#size ? next : 0);
	}
	#prev() {
		const prev = Number(this.#pagination.value) - 1, size = this.#size;
		this.#change(prev > -1 && prev < size ? prev : size - 1);
	}
	#resetInterval() {
		if (!this.#running) return;
		clearInterval(this.#intervalId);
		this.#intervalId = setInterval(this.#next.bind(this), this.#waitTime);
	}
	#resume() {
		if (!this.#running) return;
		this.#intervalId = setInterval(this.#next.bind(this), this.#waitTime);
	}
	#pause() {
		if (!this.#running) return;
		clearInterval(this.#intervalId);
	}
	#start() {
		if (this.#running) return;
		this.#running = true;
		this.#intervalId = setInterval(this.#next.bind(this), this.#waitTime);
	}
	#stop() {
		if (!this.#running) return;
		this.#running = false;
		clearInterval(this.#intervalId);
	}
	constructor(data, start = false) {
		if (!Array.isArray(data)) throw new TypeError("Failed to construct 'Carousel': Argument 'data' is not an array.");
		const items = data.filter(filter).map(buildItem);
		const number = this.#size = items.length;
		const paginations = [["DIV", null, { class: "bs-carousel_paginations_float" }, "float"]];
		for (let i = 0; i < number; ++i) paginations.push(["INPUT", null, { type: "radio", class: "bs-carousel_paginations_item", name: "bs-carousel_page", value: i }]);
		const nodes = ArrayHTML([["DIV", [
			["DIV", items, { class: "bs-carousel_scroll" }, "scroll"],
			["FORM", paginations, { class: "bs-carousel_paginations" }, "navi"],
			["BUTTON", "<", { class: "bs-carousel_arrow prev" }, "prevButton"],
			["BUTTON", ">", { class: "bs-carousel_arrow next" }, "nextButton"]
		], { class: "bs-carousel_box" }, "box"]], true).nodes;
		const box = this.#box = nodes.box;
		if (number < 2) {
			box.className += "single";
			return;
		}
		this.#float = nodes.float.style;
		const navi = this.#navi = nodes.navi, { prevButton, nextButton } = nodes;
		this.#pagination = navi.elements["bs-carousel_page"];
		this.#scroll = nodes.scroll.style;
		navi.addEventListener("change", this.#formChange.bind(this), { passive: true });
		box.addEventListener("mouseenter", this.#pause.bind(this), { passive: true });
		box.addEventListener("mouseleave", this.#resume.bind(this), { passive: true });
		prevButton.addEventListener("click", this.#prev.bind(this), { passive: true });
		nextButton.addEventListener("click", this.#next.bind(this), { passive: true });
		if (start) this.#start();
	}
	get element() { return this.#box }
	start() { if (this.#size > 1) this.#start() }
	stop() { this.#stop() }
	static create(data, target) {
		if (!(target instanceof HTMLElement || target instanceof DocumentFragment || target instanceof Document)) throw new TypeError("Failed to execute 'create' on 'Carousel': Argument 'target' cannot append elements.")
		const temp = new Carousel(data, true);
		target.appendChild(temp.#box);
		return temp;
	}
	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: this.name,
			configurable: true
		});
	}
}
export default Carousel;