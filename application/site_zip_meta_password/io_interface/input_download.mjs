import IOInterface from "./interface.mjs";
import { isValidNumberType, send } from "./utils.mjs";
import { downloadSave, inputGet } from "/javascript/module/file_io.mjs";

class FileIO extends IOInterface {
	#worker;
	#fileName;
	get fileName() { return this.#fileName }
	#originalSize;
	get originalSize() { return this.#originalSize }
	/**
	 * @param {File} file 
	 */
	constructor(file) {
		super();
		this.#fileName = file.name;
		this.#originalSize = file.size;
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
		if (!isValidNumberType(offset, false))
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
		if (!isValidNumberType(size, false))
			throw new TypeError("参数 'size' 无效");
		return send(this.#worker, ["truncate", size]);
	}

	async save() {
		downloadSave(await send(this.#worker, ["blob"]), this.#fileName);
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