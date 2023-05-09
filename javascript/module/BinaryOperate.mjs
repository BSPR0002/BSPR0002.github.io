const TypedArray = Object.getPrototypeOf(Uint8Array);
function splitBytes(data, splitLength) {
	if (arguments.length < 2) throw new TypeError(`Failed to execute 'sliceByte': 2 arguments required, but only ${arguments.length} present.`);
	if (!(data instanceof TypedArray)) throw new TypeError("Failed to execute 'sliceByte': Argument 'data' is not type of TypedArray.");
	if (!Array.isArray(splitLength)) throw new TypeError("Failed to execute 'sliceByte': Argument 'splitLength' is not an Array.");
	var totalBits = 0;
	for (let i of splitLength) {
		if (!Number.isInteger(i)) throw new Error("Failed to execute 'sliceByte': Length of bits must be integer.");
		if (i < 1) throw new Error("Failed to execute 'sliceByte': Length of bits connot less than 1.");
		totalBits += i;
	}
	const bitsPerElement = data.BYTES_PER_ELEMENT * 8;
	if (totalBits != data.length * bitsPerElement) throw new Error("Failed to execute 'sliceByte': SliceRule's total value is not equal number of data's bits.");
	data = data.constructor.from(data);
	const result = new Array(splitLength.length);
	var currentByte = 0, byteRemainBits = bitsPerElement, temp = data[0];
	for (let i in splitLength) {
		let length = splitLength[i];
		if (length > 53) throw new Error("Failed to execute 'sliceByte': Cannot process values with length greater than 53.");
		let value = 0;
		while (length) {
			if (!byteRemainBits) {
				temp = data[currentByte];
				byteRemainBits = bitsPerElement;
			}
			if (length >= byteRemainBits) {
				length -= byteRemainBits;
				value *= 1 << byteRemainBits;
				value += temp;
				byteRemainBits = 0;
				++currentByte
			} else {
				value *= 1 << length;
				value += temp >>> (byteRemainBits -= length);
				temp %= 1 << byteRemainBits;
				break;
			}
		}
		result[i] = value;
	}
	return result;
}
function littleEndianToNumber(data) {
	if (arguments.length < 1) throw new TypeError("Failed to execute 'littleEndianToNumber': 1 argument required, but only 0 present.");
	if (!(data instanceof Uint8Array)) throw new TypeError("Failed to execute 'littleEndianToNumber': Argument 'data' is not type of Uint8Array.");
	const bitsPerElement = data.BYTES_PER_ELEMENT * 8, length = data.length;
	if (length > 4) throw new Error(`Failed to execute 'littleEndianToNumber': Cannot process data with length greater then 4.`);
	var result = 0;
	for (let i = 0; i < length; ++i) result += data[i] << bitsPerElement * i;
	return result;
}
function littleEndianToBigInt(data) {
	if (arguments.length < 1) throw new TypeError("Failed to execute 'littleEndianToBigInt': 1 argument required, but only 0 present.");
	if (!(data instanceof Uint8Array)) throw new TypeError("Failed to execute 'littleEndianToBigInt': Argument 'data' is not type of Uint8Array.");
	const bitsPerElement = BigInt(data.BYTES_PER_ELEMENT * 8), length = BigInt(data.length);
	var result = 0n;
	for (let i = 0n; i < length; ++i) result += BigInt(data[i]) << bitsPerElement * i;
	return result;
}
function bigEndianToNumber(data) {
	if (arguments.length < 1) throw new TypeError("Failed to execute 'bigEndianToNumber': 1 argument required, but only 0 present.");
	if (!(data instanceof Uint8Array)) throw new TypeError("Failed to execute 'bigEndianToNumber': Argument 'data' is not type of Uint8Array.");
	return littleEndianToNumber(Uint8Array.from(data).reverse());
}
function bigEndianToBigInt(data) {
	if (arguments.length < 1) throw new TypeError("Failed to execute 'bigEndianToBigInt': 1 argument required, but only 0 present.");
	if (!(data instanceof Uint8Array)) throw new TypeError("Failed to execute 'bigEndianToBigInt': Argument 'data' is not type of Uint8Array.");
	return littleEndianToBigInt(Uint8Array.from(data).reverse());
}
function numberToLittleEndian(value, size) {
	if (arguments.length < 2) throw new TypeError(`Failed to execute 'numberToLittleEndian': 2 arguments required, but only ${arguments.length} present.`);
	if (typeof value != "number") throw new TypeError("Failed to execute 'numberToLittleEndian': Argument 'value' is not a number.");
	if (value < 0 || !Number.isInteger(value)) throw new Error("Failed to execute 'numberToLittleEndian': Argument 'value' must be unsign integer.");
	if (typeof size != "number") throw new TypeError("Failed to execute 'numberToLittleEndian': Argument 'size' is not a number.");
	if (!Number.isInteger(size)) throw new Error("Failed to execute 'numberToLittleEndian': Argument 'size' must be integer.");
	if (size < 1) throw new Error("Failed to execute 'numberToLittleEndian': Argument 'size' connot less than 1.");
	const result = new Uint8Array(size);
	for (let i = 0; i < size && value; ++i) {
		result[i] = value % 256;
		value >>>= 8;
	}
	return result;
}
function numberToBigEndian(value, size) {
	if (arguments.length < 2) throw new TypeError(`Failed to execute 'numberToBigEndian': 2 arguments required, but only ${arguments.length} present.`);
	if (typeof value != "number") throw new TypeError("Failed to execute 'numberToBigEndian': Argument 'value' is not a number.");
	if (value < 0 || !Number.isInteger(value)) throw new Error("Failed to execute 'numberToBigEndian': Argument 'value' must be unsign integer.");
	if (typeof size != "number") throw new TypeError("Failed to execute 'numberToBigEndian': Argument 'size' is not a number.");
	if (!Number.isInteger(size)) throw new Error("Failed to execute 'numberToBigEndian': Argument 'size' must be integer.");
	if (size < 1) throw new Error("Failed to execute 'numberToBigEndian': Argument 'size' connot less than 1.");
	return numberToLittleEndian(value, size).reverse();
}
function bigIntToLittleEndian(value, size) {
	if (arguments.length < 2) throw new TypeError(`Failed to execute 'bigIntToLittleEndian': 2 arguments required, but only ${arguments.length} present.`);
	if (typeof value != "bigint") throw new TypeError("Failed to execute 'bigIntToLittleEndian': Argument 'value' is not a bigint.");
	if (value < 0) throw new Error("Failed to execute 'bigIntToLittleEndian': Argument 'value' connot less than 0.");
	if (typeof size != "number") throw new TypeError("Failed to execute 'bigIntToLittleEndian': Argument 'size' is not a number.");
	if (size < 1) throw new Error("Failed to execute 'bigIntToLittleEndian': Argument 'size' connot less than 1.");
	const result = new Uint8Array(size);
	for (let i = 0; i < size && value; ++i) {
		result[i] = Number(value % 256n);
		value >>= 8n;
	}
	return result;
}
function bigIntToBigEndian(value, size) {
	if (arguments.length < 2) throw new TypeError(`Failed to execute 'bigIntToBigEndian': 2 arguments required, but only ${arguments.length} present.`);
	if (typeof value != "bigint") throw new TypeError("Failed to execute 'bigIntToBigEndian': Argument 'value' is not a bigint.");
	if (value < 0) throw new Error("Failed to execute 'bigIntToBigEndian': Argument 'value' connot less than 0.");
	if (typeof size != "number") throw new TypeError("Failed to execute 'bigIntToBigEndian': Argument 'size' is not a number.");
	if (size < 1) throw new Error("Failed to execute 'bigIntToBigEndian': Argument 'size' connot less than 1.");
	return bigIntToLittleEndian(value, size).reverse();
}
function bitsOf(value) {
	if (typeof value != "number") throw new TypeError("Failed to execute 'bitsOf': Argument 'value' is not a number.");
	if (!isFinite(value)) throw new TypeError("Failed to execute 'bitsOf': Argument 'value' is not finite.");
	if (value < 0 || !Number.isInteger(value)) throw new Error("Failed to execute 'bitsOf': Argument 'value' must be unsign integer.");
	if (value > 4294967295) return bitsOfBigInt(BigInt(value));
	for (var result = 0; value; value >>>= 1) ++result;
	return result;
}
function bitsOfBigInt(value) {
	if (typeof value != "bigint") throw new TypeError("Failed to execute 'bitsOfBigInt': Argument 'value' is not a bigint.");
	if (value < 0n) throw new Error("Failed to execute 'bitsOfBigInt': Argument 'value' must be unsign integer.");
	for (var result = 0; value; value >>= 1n) ++result;
	return result;
}
export {
	splitBytes,
	littleEndianToNumber,
	littleEndianToBigInt,
	bigEndianToNumber,
	bigEndianToBigInt,
	numberToLittleEndian,
	bigIntToLittleEndian,
	numberToBigEndian,
	bigIntToBigEndian,
	bitsOf,
	bitsOfBigInt,
	TypedArray
}