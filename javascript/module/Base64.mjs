const BtoA = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "/"],
	AtoB = { "A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6, "H": 7, "I": 8, "J": 9, "K": 10, "L": 11, "M": 12, "N": 13, "O": 14, "P": 15, "Q": 16, "R": 17, "S": 18, "T": 19, "U": 20, "V": 21, "W": 22, "X": 23, "Y": 24, "Z": 25, "a": 26, "b": 27, "c": 28, "d": 29, "e": 30, "f": 31, "g": 32, "h": 33, "i": 34, "j": 35, "k": 36, "l": 37, "m": 38, "n": 39, "o": 40, "p": 41, "q": 42, "r": 43, "s": 44, "t": 45, "u": 46, "v": 47, "w": 48, "x": 49, "y": 50, "z": 51, "0": 52, "1": 53, "2": 54, "3": 55, "4": 56, "5": 57, "6": 58, "7": 59, "8": 60, "9": 61, "+": 62, "/": 63 };
function getBinary(character, index) {
	const data = AtoB[character];
	if (data === undefined) throw new Error(`Invalid character "${character}" at [${index}].`);
	return data
}
/**
 * 将字节数组编码为 Base64 字符串
 * @param {Uint8Array} uint8Array 需要编码的字节数组
 * @returns Base64 字符串
 */
function encode(uint8Array) {
	if (!(uint8Array instanceof Uint8Array)) throw new TypeError("Failed to execute 'encode': Argument 'uint8Array' is not an Uint8Array.");
	const dataLength = uint8Array.byteLength, tail = dataLength % 3, end = dataLength - tail;
	var index = 0, result = "";
	while (index < end) {
		let temp = uint8Array[index++];
		result += BtoA[temp >>> 2];
		temp = (temp & 3) << 8 | uint8Array[index++];
		result += BtoA[temp >>> 4];
		temp = (temp & 15) << 8 | uint8Array[index++];
		result += BtoA[temp >>> 6];
		result += BtoA[temp & 63];
	}
	if (tail) {
		let temp = uint8Array[index++];
		result += BtoA[temp >>> 2];
		if (tail == 1) {
			result += BtoA[(temp & 3) << 4];
			result += "==";
		} else {
			temp = (temp & 3) << 8 | uint8Array[index];
			result += BtoA[temp >>> 4];
			result += BtoA[(temp & 15) << 2];
			result += "=";
		}
	}
	return result
}
/**
 * 将 Base64 字符串解码为字节数组
 * @param {string} base64String 需要解码的 Base64 字符串
 * @returns 字节数组
 */
function decode(base64String) {
	if (typeof base64String != "string") throw new TypeError("Failed to execute 'decode': Argument 'base64String' is not a string.");
	const stringLength = base64String.length;
	if (stringLength % 4) throw new Error("Invalid string, string length is not a multiple of 4.");
	var padding = 0;
	for (let i = 1; i < 4; ++i) {
		if (base64String[stringLength - i] != "=") break;
		if (i > 2) throw new Error("Invalid string with more than 2 complements(=).");
		++padding
	}
	const buffer = new Uint8Array(stringLength * 0.75 - padding), end = padding ? stringLength - 4 : stringLength;
	var index = 0, byte = 0;
	while (index < end) {
		let temp = getBinary(base64String[index], index++) << 6 | getBinary(base64String[index], index++);
		buffer[byte++] = temp >>> 4;
		temp = (temp & 15) << 6 | getBinary(base64String[index], index++);
		buffer[byte++] = temp >>> 2;
		buffer[byte++] = (temp & 3) << 6 | getBinary(base64String[index], index++);
	}
	if (padding) {
		let temp = getBinary(base64String[index], index++) << 6 | getBinary(base64String[index], index++);
		buffer[byte++] = temp >>> 4;
		if (padding == 1) buffer[byte] = (temp & 15) << 4 | getBinary(base64String[index], index) >>> 2;
	}
	return buffer
}
export { encode, decode }