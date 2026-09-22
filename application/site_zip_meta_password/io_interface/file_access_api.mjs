import IOInterface from "./interface.mjs";
import { isValidNumberType } from "./utils.mjs";
import { open, read, ReadType } from "/javascript/module/file_io.mjs";

const WRITER_CONFIG = { keepExistingData: true };

class FileIO extends IOInterface {
	#handle;
	#writer;
	#file;

	/**
	 * @param {FileSystemFileHandle} handle
	 * @param {File} file
	 * @param {FileSystemWritableFileStream | void} writer
	 */
	constructor(handle, file, writer) {
		super();
		this.#handle = handle;
		this.#file = file;
		this.#writer = writer;
	}

	/**
	 * @param {number} [start]
	 * @param {number} [length]
	 */
	async read(start, length) {
		if (!isValidNumberType(start))
			throw new TypeError("参数 'start' 类型无效");
		if (!isValidNumberType(length))
			throw new TypeError("参数 'length' 类型无效");
		if (Number.isNaN(start ?? NaN)) start = 0;
		const file = this.#file;
		if (start > file.size) throw new RangeError("超出范围");
		if (length === 0) return new Uint8Array(0);
		return new Uint8Array(await read(
			Number.isNaN(length ?? NaN) ? file.slice(start) : file.slice(start, start + length),
			ReadType.ARRAY_BUFFER
		));
	}

	/**
	 * @param {string|Blob|ArrayBuffer|DataView|import("/javascript/module/binary_operate.mjs").TypedArray} content
	 * @param {number} [offset]
	 */
	async write(content, offset, flush = true) {
		if (!(typeof content == "string" || content instanceof Blob || content instanceof ArrayBuffer || ArrayBuffer.isView(content)))
			throw new TypeError("参数 'content' 类型无效");
		if (!isValidNumberType(offset, false))
			throw new TypeError("参数 'offset' 类型无效");
		const writer = this.#writer;
		if (!writer) throw new Error("该实例无法写入");
		// @ts-ignore
		await writer.write({
			type: "write",
			data: content,
			position: offset ?? this.#file.size
		});
		if (flush) await this.save();
	}

	async truncate(size, flush = true) {
		if (!isValidNumberType(size, false))
			throw new TypeError("参数 'size' 无效");
		const writer = this.#writer;
		if (!writer) throw new Error("该实例无法写入");
		await writer.truncate(size);
		if (flush) await this.save();
	}

	async save() {
		const writer = this.#writer;
		if (!writer) throw new Error("该实例无法写入");
		await writer.close();
		this.#file = await this.#handle.getFile();
		this.#writer = await this.#handle.createWritable(WRITER_CONFIG);
	}

	close() {
		const writer = this.#writer;
		if (writer) {
			writer.close();
			this.#writer = null;
		}
		this.#handle = null;
	}

	static async getInstance(writable = false) {
		/** @ts-ignore @type {FileSystemFileHandle} */
		const handle = await open({
			types: [{
				accept: { "application/7z": [".7z"] },
				description: "7z 压缩文件"
			}]
		});
		return new this(handle, await handle.getFile(), writable ? await handle.createWritable(WRITER_CONFIG) : null);
	}
}

export default FileIO;