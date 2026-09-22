import { encodeString } from "/javascript/module/utf-8.mjs";

/** @type {(Blob|ArrayBuffer)[]} */
const stream = [];
var size = 0;

self.addEventListener("message", function (event) {
	const file = event.data, fileSize = file.size;
	if (fileSize) {
		stream.push(file.slice());
		size = file.size;
	}
	self.addEventListener("message", dispatcher);
	// @ts-ignore
	self.postMessage("ready");
}, { once: true });

/**
 * @param {ArrayBuffer | Blob} object
 */
function getSize(object) {
	if (object instanceof Blob) return object.size;
	// @ts-ignore
	if (object instanceof ArrayBuffer) return object.byteLength;
	throw new Error("内部错误：未知的分片对象");
}

// @ts-ignore
const reader = new FileReaderSync();

/**
 * @param {MessageEvent} event 
 */
function dispatcher(event) {
	const { data, ports: [port] } = event,
		/** @type {Transferable[]} */
		transfer = [];
	var result;
	try {
		switch (data[0]) {
			case "read":
				result = read(data[1], data[2], transfer);
				break;
			case "write":
				write(data[1], data[2]);
				break;
			case "truncate":
				truncate(data[1]);
				break;
			case "blob":
				// @ts-ignore
				result = new Blob(stream);
				break;
			case "exit":
				self.close();
				return;
			default:
				throw new Error("无法识别的指令：" + data[0]);
		}
	} catch (error) {
		port.postMessage([false, error], transfer);
		return;
	}
	port.postMessage([true, result], transfer);
	port.close();
}

/**
 * @param {ArrayBuffer | Blob} object
 * @param {number} start
 * @param {number} maxLength
 */
function chunk(object, start, maxLength) {
	if (object instanceof Blob) {
		const end = start + maxLength;
		return new Uint8Array(reader.readAsArrayBuffer(object.size > end ? object.slice(start, end) : object.slice(start)));
	}
	if (object instanceof ArrayBuffer) {
		const length = object.byteLength - start;
		return new Uint8Array(object, start, length > maxLength ? maxLength : length);
	}
	throw new Error("内部错误：未知的分片对象");
}

/**
 * 从 stream 中组合出一个 Uint8Array
 * @param {number} start 起始位置，可能为空值，视为 0
 * @param {number} length 读取长度，可能为空值，视为读取到末尾
 * @param {Transferable[]} transfer 
 */
function read(start, length, transfer) {
	if (Number.isNaN(start ?? NaN)) start = 0;
	if (start > size) throw new RangeError("超出范围");
	if (Number.isNaN(length ?? NaN) || start + length > size)
		length = size - start;
	if (!length) {
		const result = new Uint8Array(0);
		transfer.push(result.buffer);
		return result;
	}
	const result = new Uint8Array(length),
		items = stream.length;
	var offset = 0, i = 0;
	if (start > 0) {
		for (let skip = 0; i < items && skip < start; ++i) {
			const part = stream[i], size = getSize(part);
			if (skip + size > start) {
				const part = chunk(stream[i], start - skip, length);
				result.set(part);
				offset = part.byteLength;
			}
			skip += size;
		}
	}
	while (i < items && offset < length) {
		const part = chunk(stream[i], 0, length - offset);
		result.set(part, offset);
		offset += part.byteLength;
		++i;
	}
	transfer.push(result.buffer);
	return result;
}

/**
 * 将内容与 stream 组合，模拟随机区段覆盖写入
 * @param {string | ArrayBuffer | Blob} content 内容
 * @param {number} offset 偏移位置
 */
function write(content, offset) {
	offset = offset ?? size;
	if (typeof content == "string")
		// @ts-ignore
		content = encodeString(content).buffer;
	// @ts-ignore
	const contentSize = getSize(content);
	if (contentSize == 0) return;
	if (offset > size) {
		stream.push(new ArrayBuffer(offset - size));
		size = offset;
	}
	if (offset >= size) {
		// @ts-ignore
		stream.push(content);
		size += contentSize;
		return;
	}
	var items = stream.length, streamOffset = 0, tail;
	for (var i = 0; i < items && streamOffset < offset; ++i) {
		const remain = offset - streamOffset,
			part = stream[i],
			partSize = getSize(part);
		if (partSize > remain) {
			tail = stream.splice(i);
			stream[i] = part.slice(0, remain);
			tail[0] = part.slice(remain);
			streamOffset += remain;
		} else streamOffset += partSize;
	}
	if (!tail) tail = stream.splice(i);
	// @ts-ignore
	stream.push(content);
	const end = offset + contentSize;
	if (end >= size) {
		size = end;
		return;
	}
	for (i = 0, items = tail.length; i < items && streamOffset < end; ++i) {
		const remain = end - streamOffset,
			part = tail[i],
			partSize = getSize(part);
		if (partSize > remain) {
			stream.push(part.slice(remain));
			streamOffset += remain;
		} else streamOffset += partSize;
	}
	stream.push(...tail.splice(i));
}

/**
 * @param {number} i
 * @param {number} remain
 */
function clipPart(i, remain) {
	var object = stream[i],
		size = getSize(object);
	if (size > remain)
		stream[i] = object.slice(0, size = remain);
	return size;
}

/**
 * 将 stream 的内容调整到指定大小
 * @param {number} newSize
 */
function truncate(newSize) {
	if (newSize == size) return;
	const oldSize = size;
	size = newSize;
	if (newSize == 0) {
		stream.splice(0);
		return;
	}
	if (newSize > oldSize) {
		stream.push(new ArrayBuffer(newSize - oldSize));
		return;
	}
	const items = stream.length;
	var i = 0;
	for (let offset = 0; i < items && offset < newSize; ++i)
		offset += clipPart(i, newSize - offset);
	stream.splice(i);
}