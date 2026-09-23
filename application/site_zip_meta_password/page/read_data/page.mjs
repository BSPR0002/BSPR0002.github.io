import { littleEndianToBigUint, littleEndianToUint } from "/javascript/module/binary_operate.mjs";
import { isArrayLikesEqual } from "/javascript/module/equals.mjs";
import { $7Z_HEAD, FileComponent, META_TAG } from "../../reader.mjs";
import { restoreKey, transform } from "../../crypto.mjs";
import { decodeString } from "/javascript/module/utf-8.mjs";

const box = document.getElementById("data-box"),
	noneFileText = document.getElementById("data-none-file").style,
	errorText = document.getElementById("data-error"),
	errorTextStyle = errorText.style,
	contentView = document.getElementById("data-view").style,
	contentText = document.getElementById("data-content");

var data = null;

new FileComponent(document.querySelector("#page-read .file-component"), false).fileChangeNotifier.addHandler(async function (io) {
	if (io) {
		box.className = "bs-loading";
		try {
			contentText.innerText = data = await parse(io);
		} catch (error) {
			contentText.innerHTML = "";
			errorText.innerText = error.message;
			noneFileText.display = "none";
			errorTextStyle.display = "block";
			contentView.display = null;
			return;
		} finally {
			box.className = "";
		}
		noneFileText.display = errorTextStyle.display = "none";
		contentView.display = "block";
	} else {
		noneFileText.display = errorTextStyle.display = contentView.display = data = null;
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

document.getElementById("data-copy").addEventListener("click", function () {
	navigator.clipboard.writeText(data);
});