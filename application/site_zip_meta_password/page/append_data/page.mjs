import { generateKey, restoreKey, transform } from "../../crypto.mjs";
import { $7Z_HEAD, FileComponent, META_TAG, usingFileSystemAccessApi } from "../../reader.mjs";
import OverlayWindow from "/component/overlay_window/OverlayWindow.mjs";
import { littleEndianToBigUint, littleEndianToUint, uintToLittleEndian } from "/javascript/module/binary_operate.mjs";
import { isArrayLikesEqual } from "/javascript/module/equals.mjs";
import { decodeString, encodeString } from "/javascript/module/utf-8.mjs";

if (usingFileSystemAccessApi)
	document.getElementById("append-warn").style.display = "block";

const box = document.getElementById("append-view"),
	noneFileText = document.getElementById("append-none-file").style,
	notAllowText = document.getElementById("append-write-not-allow"),
	notAllowTextStyle = notAllowText.style,
	/** @ts-ignore @type {HTMLTextAreaElement} */
	input = document.getElementById("append-input"),
	/** @ts-ignore @type {HTMLButtonElement} */
	writeButton = document.getElementById("append-write");

var allowWrite = false, hasData = false, officialEnd = null;

const fc = new FileComponent(document.querySelector("#page-append .file-component"), true);
fc.fileChangeNotifier.addHandler(async function (file) {
	if (file) {
		let content = null;
		box.className = "bs-loading";
		try {
			const head = await file.read(0, 8);
			if (!isArrayLikesEqual(head.subarray(0, 6), $7Z_HEAD))
				throw new Error("文件不是 7-Zip 压缩文件");
			const { originalSize: size } = file;
			officialEnd = 32 +
				Number(littleEndianToBigUint(await file.read(12, 8))) +
				Number(littleEndianToBigUint(await file.read(20, 8)));
			if (hasData = size > officialEnd)
				content = await parse(file, size, officialEnd);
		} catch (error) {
			writeButton.disabled = true;
			allowWrite = hasData = false;
			officialEnd = null;
			noneFileText.display = "none";
			notAllowText.innerText = error.message;
			notAllowTextStyle.display = "inline";
			return;
		} finally {
			box.className = "";
		}
		writeButton.disabled = false;
		noneFileText.display = notAllowTextStyle.display = "none";
		notAllowText.innerHTML = "";
		allowWrite = true;
		if (content !== null && await OverlayWindow.confirm("文件有附加数据，你想将其替换到输入框中吗？")) input.value = content;
	} else {
		writeButton.disabled = true;
		allowWrite = hasData = false;
		officialEnd = noneFileText.display = notAllowTextStyle.display = null;
		notAllowText.innerHTML = "";
	}
});

/**
 * @param {import("../../io_interface/interface.mjs").default} file
 * @param {number} size
 * @param {number} target
 */
async function parse(file, size, target) {
	if (size <= target + 42) return null;
	const length = littleEndianToUint(await file.read(target, 2));
	target += 2;
	if (length > 255) return null;
	if (size < target + length) return null;
	const data = await file.read(target, length);
	if (!isArrayLikesEqual(data.subarray(0, 8), META_TAG)) return null;
	try {
		return decodeString(transform(restoreKey(data.subarray(8, 40)), data.subarray(40)));
	} catch (error) {
		console.error(error);
		return null;
	}
}

document.getElementById("append-write").addEventListener("click", async function () {
	if (!allowWrite) return;
	const content = input.value;
	if (!content) {
		OverlayWindow.alert("请输入附加内容");
		return;
	}
	const data = encodeString(content), { length } = data;
	if (length > 215) {
		OverlayWindow.alert(`附加内容过长，请尝试缩短。（${length} / 215）`);
		return;
	}
	if (hasData && !await OverlayWindow.confirm("文件有附加数据，将会进行覆盖，确定吗？")) return;
	if (!await OverlayWindow.confirm("即将进行写操作，是否继续？")) return;
	const io = fc.ioInterface,
		closeWait = OverlayWindow.wait("正在进行写入操作，请勿关闭浏览器，保持计算机电源接通！", "写入中");
	try {
		let current = officialEnd;
		const key = generateKey(), { keyData } = key;
		// @ts-ignore
		await io.truncate(current, false);
		// @ts-ignore
		await io.write(uintToLittleEndian(length + 40, new Uint8Array(2)), current, false);
		// @ts-ignore
		await io.write(META_TAG, current += 2, false);
		// @ts-ignore
		await io.write(keyData, current += META_TAG.byteLength, false);
		// @ts-ignore
		await io.write(transform(key.key, data), current += keyData.byteLength, false);
	} catch (error) {
		OverlayWindow.alert(error.toString(), "错误");
		closeWait();
	}
	if (usingFileSystemAccessApi) {
		await io.save();
		OverlayWindow.alert("写入完成");
		closeWait();
	} else {
		closeWait();
		await OverlayWindow.alert("处理完成，点击确定保存文件！");
		io.save();
	}
});