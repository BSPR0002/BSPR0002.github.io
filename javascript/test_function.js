const moduleConfig = {
	AJAX: {
		path: "/javascript/module/ajax.mjs"
	},
	fetch: {
		path: "/javascript/module/fetch.mjs",
		name: "iFetch"
	},
	AudioPlayer: {
		path: "/javascript/module/AudioPlayer.mjs",
		default: "AudioPlayer"
	},
	ArrayHTML: {
		path: "/javascript/module/array_HTML.mjs"
	},
	OverlayWindow: {
		path: "/component/overlay_window/OverlayWindow.mjs",
		default: "OverlayWindow"
	},
	Enum: {
		path: "/javascript/module/Enum.mjs",
		default: "default"
	},
	UTF8: {
		path: "/javascript/module/utf-8.mjs"
	},
	FileIO: {
		path: "/javascript/module/file_io.mjs"
	},
	FLAC: {
		path: "/javascript/module/FLAC/FLAC.mjs"
	},
	Base64: {
		path: "/javascript/module/base64.mjs"
	},
	BufferContext: {
		path: "/javascript/module/BufferContext.mjs",
		default: "default"
	},
	BinaryOperate: {
		path: "/javascript/module/binary_operate.mjs"
	},
	LocalStorageObject: {
		path: "/javascript/module/LocalStorageObject.mjs",
		default: "default"
	},
	IndexedDatabase: {
		path: "/javascript/module/IndexedDatabase.mjs",
		default: "default"
	},
	DynamicIndexedDatabase: {
		path: "/javascript/module/DynamicIndexedDatabase.mjs",
		default: "default"
	},
	detune: {
		path: "/others/script/detune.mjs",
		default: "use"
	},
	JSZip: {
		path: "/javascript/module/JSZip.mjs",
		default: "default"
	},
	Rational: {
		path: "/javascript/module/Rational.mjs",
		default: "default"
	},
	PromiseWithResolvers: {
		path: "/others/polyfill/Promise.withResolvers.mjs",
		default: "default"
	},
	StringExtension: {
		path: "/javascript/module/string_extension.mjs"
	},
	ContextMenu: {
		path: "/component/context_menu/context_menu.mjs",
		default: "showMenu"
	},
	trackList: {
		path: "/others/script/tracklist.mjs",
		default: "default"
	},
	torrent: {
		path: "/others/script/torrent.mjs"
	},
	flac2wav: {
		path: "/others/script/flac2wav.mjs",
		default: "default"
	},
	listFiles: {
		path: "/others/script/listFiles.mjs",
		default: "default"
	},
	crlf: {
		path: "/others/script/crlf.mjs",
		default: "convert"
	}
};
for (const key in moduleConfig) {
	const item = moduleConfig[key];
	if (!Object.hasOwn(item, "name")) item.name = key;
};
Object.freeze(moduleConfig);
async function importModule(config, useDefault = true) {
	const name = config.name, module = await import(config.path);
	window[name] = useDefault && "default" in config ? module[config.default] : module;
	console.log("Imported " + name);
	return module;
}
function printArguments() { console.log(this, arguments) }
function manual() { debugger }
class RandomStatistician {
	#data = (new Array(10)).fill(0n);
	get data() { return this.#data.concat() }
	record(number) {
		number = Number(number);
		if (number < 0 || number >= 1) throw new Error("Input out of range.");
		++this.#data[Math.floor(number * 10)]
	}
	reset() { this.#data = (new Array(10)).fill(0n) }
	analyze() {
		var total = 0n, i = 0;
		for (let item of this.#data) total += item;
		var result = [["total", total.toString()]];
		while (i < 10) {
			let starting = i / 10, subscript = i++, quantity = this.#data[subscript];
			// @ts-ignore
			result.push(["[" + starting + "," + i / 10 + ")", quantity.toString(), (total == 0 ? "0" : Number(quantity) * 100 / +Number(total)) + "%"]);
		}
		return result
	}
}
class PerSecond {
	#data = [];
	record() {
		this.#data.push(Date.now());
		this.#check();
	}
	#check() {
		const limit = Date.now() - 1000, data = this.#data;
		for (let i = data.length; i; --i) if (data[0] < limit) { data.shift() } else break;
	}
	reset() { this.#data = [] }
	get times() {
		this.#check();
		return this.#data.length;
	}
}

const gain = (y, z = 16) => 2 ** (z * (y - 1));

function generateRandomArray(length, min, max) {
	const range = max - min + 1, array = new Array(length);
	for (let i = length - 1; i; --i) array[i] = Math.floor(Math.random() * range) + min;
	return array;
}