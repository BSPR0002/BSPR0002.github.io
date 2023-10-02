import { parseAndGetNodes } from "./ArrayHTML.mjs";
const { documentFragment, nodes } = parseAndGetNodes([
	["div", [

	], { id: "BSIF_console_emulator" }],
	["STYLE", [
		"#BSIF_console_emulator"
	]]
]);

const ORIGIN_CONSOLE = console;
window.addEventListener("error", catchError, {passive: true});
function log() {
	ORIGIN_CONSOLE.log(...arguments);
}
function info() {
	ORIGIN_CONSOLE.info(...arguments)
}
function warn() {
	ORIGIN_CONSOLE.warn(...arguments);

}
function catchError() {

}
function error() {
	ORIGIN_CONSOLE.error(...arguments);
	
}
function debug() {
	ORIGIN_CONSOLE.debug(...arguments);

}
function print() {

}
function errorPrint() {

}
window.console = Object.freeze({
	info,
	log,
	warn,
	error,
	debug
});
document.appendChild(documentFragment);