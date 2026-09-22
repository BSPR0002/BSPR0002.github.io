import { littleEndianToBigUint, littleEndianToUint } from "/javascript/module/binary_operate.mjs";
import { isArrayLikesEqual } from "/javascript/module/equals.mjs";
import Notifier from "/javascript/module/Notifier.mjs";

const $7Z_HEAD = Uint8Array.from([0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C]),
	META_TAG = Uint8Array.from([0x42, 0x53, 0x49, 0x46, 0x37, 0x7a, 0x6d, 0x70]);

/**
 * 
 * @param {Blob} blob 
 */
async function parse(blob) {
	const head = await blob.slice(0, 8).bytes();
	if (!isArrayLikesEqual(head.subarray(0, 6), $7Z_HEAD)) throw new Error("文件不是 7-Zip 压缩文件");
	// Skip version number 2 bits
	// Skip start header crc 4 bits
	const { size } = blob;
	var target = 32 +
		Number(littleEndianToBigUint(await blob.slice(12, 20).bytes())) +
		Number(littleEndianToBigUint(await blob.slice(20, 28).bytes()));
	if (size < target + 42) throw new Error("未检测到附加数据");
	const length = littleEndianToUint(await blob.slice(target, target += 2).bytes());
	if (length > 255) throw new Error("附加数据长度超过限制");
	const end = target + length;
	if (size < end) throw new Error("无法识别附加数据");
	const data = await blob.slice(target, end).bytes();
	if (!isArrayLikesEqual(data.subarray(0, 8), META_TAG))
		throw new Error("无法识别附加数据");
	return {
		keyData: data.subarray(8, 40),
		content: data.subarray(40)
	};
}

/** @typedef {import("./io_interface/interface.mjs").default} IOInterface */
// @ts-ignore
const fileSystemAccessApiAvailable = typeof window.showOpenFilePicker == "function",
	/** @type {typeof import("./io_interface/interface.mjs").default} */
	FileIO = (await import(import.meta.resolve(`./io_interface/${fileSystemAccessApiAvailable ? "file_access_api" : "input_download"}.mjs`))).default;

class FileComponent {
	#writable;
	/** @type {IOInterface} */
	#ioInterface = null;
	get ioInterface() { return this.#ioInterface }
	/** @type {Notifier<[IOInterface | void]>} */
	#fileChangeNotifier = new Notifier;
	get fileChangeNotifier() { return this.#fileChangeNotifier }
	/** @type {HTMLDivElement} */
	#noneFileText;
	/** @type {HTMLDivElement} */
	#fileInfoBox;
	/** @type {HTMLDivElement} */
	#fileNameText;
	/** @type {HTMLDivElement} */
	#fileSizeText;

	async #selectFile() {
		var newInstance;
		try {
			newInstance = await FileIO.getInstance(this.#writable);
		} catch (error) {
			if (error.name == "AbortError") return;
			throw error;
		}
		this.#ioInterface?.close();
		this.#ioInterface = newInstance;
		this.#fileNameText.innerText = newInstance.fileName;
		this.#fileSizeText.innerText = sizeText(newInstance.originalSize);
		this.#noneFileText.style.display = "none";
		this.#fileInfoBox.style.display = "block";
		this.#fileChangeNotifier.trigger(newInstance);
	}

	#clear() {
		const io = this.#ioInterface;
		if (!io) return;
		io.close();
		this.#noneFileText.style.display = "block";
		this.#fileInfoBox.style.display = "none";
		this.#fileNameText.innerText = this.#fileSizeText.innerText = "";
		this.#fileChangeNotifier.trigger(null);
	}

	/**
	 * @param {HTMLElement} element
	 * @param {boolean} writable
	 */
	constructor(element, writable) {
		this.#writable = writable;
		this.#noneFileText = element.querySelector(".none-file");
		this.#fileInfoBox = element.querySelector(".file-info");
		this.#fileNameText = element.querySelector(".file-name");
		this.#fileSizeText = element.querySelector(".file-size");
		element.querySelector(".select-file").addEventListener("click", this.#selectFile.bind(this));
		element.querySelector(".file-clear").addEventListener("click", this.#clear.bind(this));
	}
}

const sizeUnits = ["B", "KiB", "MiB", "GiB", "TiB", "PiB"],
	sizeUnitEnd = sizeUnits.length;
function sizeText(size) {
	for (var i = 0; i < sizeUnitEnd; ++i)
		if (size < 2 ** (10 * (i + 1)) * 0.97)
			break;
	if (i === 0) return `${size} ${sizeUnits[i]}`;
	if (i === sizeUnitEnd) --i;
	const value = size / (2 ** (10 * i)),
		clip = value < 10 ? 100 : 10,
		number = Math.floor(value * clip) / clip;
	return `${Number.isInteger(number) && !Number.isInteger(value) ? number.toFixed(1) : number} ${sizeUnits[i]}`;
}

export { parse, $7Z_HEAD, META_TAG, FileComponent, fileSystemAccessApiAvailable };