import BufferContext from "./BufferContext.mjs";
const { log2, floor, ceil } = Math;
function getCodeBytes(headValue) {
	var bytes = 0, mask = 128;
	for (let i = 8; i; --i) {
		if (!(headValue & mask)) break;
		mask >>>= 1;
		++bytes;
	}
	if (bytes == 1 || bytes == 8) throw new Error("Invalid data");
	return bytes || 1;
}
function encode(value) {
	if (typeof value != "number") throw new TypeError("Failed to execute 'encode': Argument 'value' is not a number.");
	if (!Number.isInteger(value) || value < 0) throw new TypeError("Failed to execute 'encode': Argument 'value' must be an unsigned integer.");
	if (value < 128) {
		const result = new Uint8Array(1);
		result[0] = value;
		return result
	}
	const bitsOfValue = floor(log2(value)) + 1;
	if (bitsOfValue > 36) throw new TypeError("Failed to execute 'encode': UTF-8 cannot encode values with bits greater than 36.");
	let byteLength = ceil((bitsOfValue - 1) / 5);
	const result = new Uint8Array(byteLength);
	for (let i = byteLength - 1; i; --i) {
		let temp = value & 63;
		value = (value - temp) / 64;
		result[i] = 128 | temp;
	}
	byteLength = 8 - byteLength;
	result[0] = (255 >>> byteLength << byteLength) | value;
	return result;
}
const typeOfUint8Array = Uint8Array.prototype,
	typeOfBufferContext = BufferContext.prototype;
function decode(data) {
	var bytes;
	switch (Object.getPrototypeOf(data)) {
		case typeOfUint8Array: {
			let length = data.length;
			if (length > 7 || length < 1) throw new Error("Failed to execute 'decode': Unexpected data length.");
			bytes = getCodeBytes(data[0]);
			if (bytes != length) throw new Error("Failed to execute 'decode': Invalid code.");
			break;
		}
		case typeOfBufferContext: {
			let temp = data.array
			if (temp instanceof Uint8Array) {
				let current = data.current;
				bytes = getCodeBytes(temp[current]);
				data = temp.subarray(current, data.current = current + bytes);
				break;
			}
		}
		default:
			throw new TypeError("Failed to execute 'decode': Argument 'data' is not a Uint8Array or a BufferContext containing a Uint8Array.");
	}
	if (bytes == 1) return data[0];
	var result = 0, offset = 0;
	for (let i = bytes - 1; i; --i) {
		const temp = data[i];
		if (temp >>> 6 != 2) throw new Error("Failed to execute 'decode': Invalid code.");
		result += (temp & 63) * 2 ** offset;
		offset += 6;
	}
	if (bytes < 7) result += (data[0] & 127 >>> bytes) * 2 ** offset;
	return result;
}
const encoder = new TextEncoder(), decoder = new TextDecoder("utf-8");
function encodeString(string) {
	if (typeof string != "string") throw new TypeError("Failed to execute 'encodeString': Argument 'string' is not a string.");
	return encoder.encode(string);
}
function decodeString(data) {
	if (!(data instanceof Uint8Array)) throw new TypeError("Failed to execute 'decodeString': Argument 'data' is not a Uint8Array.");
	return decoder.decode(data);
}
export { decode, encode, encodeString, decodeString }