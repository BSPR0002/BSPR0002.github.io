const moduleConfig = {
	AJAX: {
		path: "/javascript/module/AJAX.mjs"
	},
	AudioPlayer: {
		path: "/javascript/module/AudioPlayer.mjs",
		default: "AudioPlayer"
	},
	ArrayHTML: {
		path: "/javascript/module/ArrayHTML.mjs"
	},
	MiniWindow: {
		path: "/javascript/module/MiniWindow.mjs",
		default: "MiniWindow"
	},
	Enum: {
		path: "/javascript/module/Enum.mjs",
		default: "default"
	},
	UTF8: {
		path: "/javascript/module/UTF-8.mjs"
	},
	FileIO: {
		path: "/javascript/module/FileIO.mjs"
	},
	FLAC: {
		path: "/javascript/module/FLAC/FLAC.mjs"
	},
	Base64: {
		path: "/javascript/module/Base64.mjs"
	},
	trackList: {
		path: "/unuse/tracklist.mjs",
		default: "default"
	},
	torrent: {
		path: "/unuse/torrent.mjs"
	},
	flac2wav: {
		path: "/unuse/flac2wav.mjs",
		default: "default"
	},
	BufferContext: {
		path: "/javascript/module/BufferContext.mjs",
		default: "default"
	},
	BinaryOperate: {
		path: "/javascript/module/BinaryOperate.mjs"
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
		path: "/unuse/detune.mjs",
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
	privatifyConstructor: {
		path: "/javascript/module/privatifyConstructor.mjs",
		default: "default"
	},
	PromiseAdapter: {
		path: "/javascript/module/PromiseAdapter.mjs",
		default: "default"
	}
};
for (let i in moduleConfig) moduleConfig[i].name = i;
Object.freeze(moduleConfig);
async function importModule(config, useDefault = true) {
	const name = config.name, module = await import(config.path);
	window[name] = useDefault && "default" in config ? module[config.default] : module;
	console.log("Imported " + name);
	return module;
}
function printArguments() { console.log(arguments) }
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

const gain = (y, z = 16) => 2 ** (z * (y - 1))