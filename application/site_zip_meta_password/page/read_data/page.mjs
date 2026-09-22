import { littleEndianToBigUint, littleEndianToUint } from "/javascript/module/binary_operate.mjs";
import { isArrayLikesEqual } from "/javascript/module/equals.mjs";
import { $7Z_HEAD, FileComponent, META_TAG } from "../../reader.mjs";
import { restoreKey, transform } from "../../crypto.mjs";
import { decodeString } from "/javascript/module/utf-8.mjs";

const box = document.getElementById("data-box"),
	noneFileText = document.getElementById("data-none-file"),
	errorText = document.getElementById("data-error"),
	contentView = document.getElementById("data-view"),
	contentText = document.getElementById("data-content");

new FileComponent(document.querySelector("#page-read .file-component"), false).fileChangeNotifier.addHandler(async function (io) {
	if (io) {
		box.className = "bs-loading";
		try {
			contentText.innerText = await parse(io);
		} catch (error) {
			errorText.innerText = error.message;
			noneFileText.style.display = "none";
			errorText.style.display = "block";
			contentView.style.display = null;
			return;
		} finally {
			box.className = "";
		}
		noneFileText.style.display = errorText.style.display = "none";
		contentView.style.display = "block";
	} else {
		noneFileText.style.display = errorText.style.display = contentView.style.display = null;
		errorText.innerHTML = contentText.innerHTML = "";
	}
});

/**
 * @param {import("../../io_interface/interface.mjs").default} file 
 */
async function parse(file) {
	const head = await file.read(0, 8);
	if (!isArrayLikesEqual(head.subarray(0, 6), $7Z_HEAD)) throw new Error("文件不是 7-Zip 压缩文件");
	// Skip version number 2 bits
	// Skip start header crc 4 bits
	const { originalSize: size } = file;
	var target = 32 +
		Number(littleEndianToBigUint(await file.read(12, 8))) +
		Number(littleEndianToBigUint(await file.read(20, 8)));
	if (size <= target + 42) throw new Error("未检测到附加数据");
	const length = littleEndianToUint(await file.read(target, 2));
	target += 2;
	if (length > 255) throw new Error("附加数据长度超过限制");
	if (size < target + length) throw new Error("无法识别附加数据");
	const data = await file.read(target, length);
	if (!isArrayLikesEqual(data.subarray(0, 8), META_TAG))
		throw new Error("无法识别附加数据");
	return decodeString(transform(restoreKey(data.subarray(8, 40)), data.subarray(40)));
}