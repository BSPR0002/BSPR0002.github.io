import Notifier from "/javascript/module/Notifier.mjs";

const $7Z_HEAD = Uint8Array.from([0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C]),
	META_TAG = Uint8Array.from([0x42, 0x53, 0x49, 0x46, 0x37, 0x7a, 0x6d, 0x70]);

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
		this.#noneFileText.style.display = this.#fileInfoBox.style.display = null;
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

export { $7Z_HEAD, META_TAG, FileComponent, fileSystemAccessApiAvailable };