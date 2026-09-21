import IOInterface from "./interface.mjs";
import { downloadSave, inputGet } from "/javascript/module/file_io.mjs";

function isValidNumberType(value) {
	const type = typeof value;
	if (type == "number")
		return Number.isNaN(value) || (Number.isInteger(value) && value >= 0);
	if (type == "undefined" || value === null)
		return true;
	return false
}

/**
 * @param {Worker} worker
 * @param {any[]} data
 * @param {Transferable[]} [transfer]
 */
async function send(worker, data, transfer = []) {
	const { port1, port2 } = new MessageChannel();
	port1.start();
	const { promise, resolve } = Promise.withResolvers();
	port1.addEventListener("message", resolve, { once: true });
	transfer.push(port2);
	worker.postMessage(data, transfer);
	const { data: response } = await promise;
	port1.close();
	if (!response[0]) throw response[1];
	return response[1];
}

class FileIO extends IOInterface {
	#worker;
	/**
	 * @param {Blob} file 
	 */
	constructor(file) {
		super();
		const worker = this.#worker = new Worker(import.meta.resolve("./input_download_worker.mjs"), { type: "module" });
		worker.postMessage(file);
	}

	/**
	 * @param {number} [start]
	 * @param {number} [length]
	 */
	read(start, length) {
		if (!isValidNumberType(start))
			throw new TypeError("参数 'start' 类型无效");
		if (!isValidNumberType(length))
			throw new TypeError("参数 'length' 类型无效");
		return send(this.#worker, ["read", start, length]);
	}

	/**
	 * @param {string|Blob|ArrayBuffer|DataView|import("/javascript/module/binary_operate.mjs").TypedArray} content
	 * @param {number} [offset]
	 */
	write(content, offset) {
		// @ts-ignore
		if (!(typeof content == "string" || content instanceof Blob || content instanceof ArrayBuffer || ArrayBuffer.isView(content)))
			throw new TypeError("参数 'content' 类型无效");
		if (!isValidNumberType(offset) || Number.isNaN(offset))
			throw new TypeError("参数 'offset' 类型无效");
		const transfer = [];
		if (ArrayBuffer.isView(content)) {
			const { buffer, byteOffset, byteLength } = content;
			if (byteOffset || byteLength != buffer.byteLength) {
				// @ts-ignore
				transfer.push(content = buffer.slice(byteOffset, byteLength + byteOffset));
			} else
				// @ts-ignore
				content = buffer;
		}
		return send(this.#worker, ["write", content, offset], transfer);
	}

	truncate(size) {
		if (typeof size != "number" || !Number.isInteger(size) || size < 0)
			throw new TypeError("参数 'size' 无效");
		return send(this.#worker, ["truncate", size]);
	}

	/**
	 * @param {string} [saveName]
	 */
	async save(saveName) {
		downloadSave(await send(this.#worker, ["blob"]), saveName);
	}

	close() {
		this.#worker.postMessage(["exit"]);
		this.#worker = null;
	}

	static async getInstance() {
		const instance = new this(await inputGet(false, ".7z")),
			{ promise, resolve } = Promise.withResolvers();
		instance.#worker.addEventListener("message", resolve, { once: true });
		await promise;
		return instance;
	}
}

export default FileIO;