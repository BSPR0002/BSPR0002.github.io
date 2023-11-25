import { EVENT_LISTENERS, parse } from "/javascript/module/ArrayHTML.mjs";
const menu = document.getElementById("menu");
var focused = false;
function buildMenu(array) { menu.appendChild(parse(array.map(menuMapper1))) }
function focusMenu() { if (menu.contains(document.activeElement)) this.focus() }
function clickOption({ target }) { if (target != this) target.blur() }
function menuMapper1(item, tabindex) { return ["div", [item.title, ["div", item.options.map(menuMapper2), { class: "menu_expand" }]], { class: "menu_item", tabindex, [EVENT_LISTENERS]: [["mouseenter", focusMenu], ["click", clickOption]] }] }
function menuMapper2(item) { return ["button", item.title, { class: "menu_option", [EVENT_LISTENERS]: [["click", item.action]] }] }
export { buildMenu };