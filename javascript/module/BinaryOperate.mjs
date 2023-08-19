const TypedArray = Object.getPrototypeOf(Uint8Array);
function splitBytes(data, splitLength) {
	if (arguments.length < 2) throw new TypeError(`Failed to execute 'sliceByte': 2 arguments required, but only ${arguments.length} present.`);
	if (!(data instanceof TypedArray)) throw new TypeError("Failed to execute 'sliceByte': Argument 'data' is not type of TypedArray.");
	if (!Array.isArray(splitLength)) throw new TypeError("Failed to execute 'sliceByte': Argument 'splitLength' is not an Array.");
	var totalBits = 0;
	for (let i of splitLength) {
		if (!Number.isInteger(i)) throw new Error("Failed to execute 'sliceByte': Length of bits must be integer.");
		if (i < 1) throw new Error("Failed to execute 'sliceByte': Length of bits cannot less than 1.");
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
function littleEndianToUint(data) {
	if (!(data instanceof Uint8Array)) throw new TypeError("Failed to execute 'littleEndianToUint': Argument 'data' is not type of Uint8Array.");
	const length = data.length;
	if (length > 4) throw new Error(`Failed to execute 'littleEndianToUint': Cannot process data with length greater then 4.`);
	var result = 0;
	for (let i = 0; i < length; ++i) result += data[i] * 2 ** (8 * i);
	return result;
}
function littleEndianToInt(data) {
	if (!(data instanceof Uint8Array)) throw new TypeError("Failed to execute 'littleEndianToInt': Argument 'data' is not type of Uint8Array.");
	const length = data.length;
	if (length > 4) throw new Error(`Failed to execute 'littleEndianToInt': Cannot process data with length greater then 4.`);
	var result = 0;
	for (let i = 0; i < length; ++i) result |= data[i] << 8 * i;
	return result;
}
function littleEndianToBigUint(data) {
	if (!(data instanceof Uint8Array)) throw new TypeError("Failed to execute 'littleEndianToBigUint': Argument 'data' is not type of Uint8Array.");
	const length = BigInt(data.length);
	var result = 0n;
	for (let i = 0n; i < length; ++i) result |= BigInt(data[i]) << 8n * i;
	return result;
}
function littleEndianToBigInt(data) {
	if (!(data instanceof Uint8Array)) throw new TypeError("Failed to execute 'littleEndianToBigInt': Argument 'data' is not type of Uint8Array.");
	const length = BigInt(data.length);
	var result = 0n;
	for (let i = 0n; i < length; ++i) result |= BigInt(data[i]) << 8n * i;
	return data[length - 1n] > 127 ? result | -1n << length * 8n : result;
}
function bigEndianToUint(data) {
	if (!(data instanceof Uint8Array)) throw new TypeError("Failed to execute 'bigEndianToUint': Argument 'data' is not type of Uint8Array.");
	const length = data.length;
	if (length > 4) throw new Error(`Failed to execute 'bigEndianToUint': Cannot process data with length greater then 4.`);
	var result = 0;
	for (let i = 0; i < length; ++i) result = result * 2 ** 8 + data[i];
	return result;
}
function bigEndianToInt(data) {
	if (!(data instanceof Uint8Array)) throw new TypeError("Failed to execute 'bigEndianToInt': Argument 'data' is not type of Uint8Array.");
	const length = data.length;
	if (length > 4) throw new Error(`Failed to execute 'bigEndianToInt': Cannot process data with length greater then 4.`);
	var result = 0;
	for (let i = 0; i < length; ++i) result = result << 8 | data[i];
	return result;
}
function bigEndianToBigUint(data) {
	if (!(data instanceof Uint8Array)) throw new TypeError("Failed to execute 'bigEndianToBigUint': Argument 'data' is not type of Uint8Array.");
	const length = BigInt(data.length);
	var result = 0n;
	for (let i = 0n; i < length; ++i) result = result << 8n | BigInt(data[i]);
	return result;
}
function bigEndianToBigInt(data) {
	if (!(data instanceof Uint8Array)) throw new TypeError("Failed to execute 'bigEndianToBigInt': Argument 'data' is not type of Uint8Array.");
	const length = BigInt(data.length);
	var result = 0n;
	for (let i = 0n; i < length; ++i) result = result << 8n | BigInt(data[i]);
	return data[0] > 127 ? result | -1n << length * 8n : result;
}
function uintToLittleEndian(value, size) {
	if (typeof value != "number") throw new TypeError("Failed to execute 'uintToLittleEndian': Argument 'value' is not a number.");
	if (value < 0 || !Number.isInteger(value)) throw new Error("Failed to execute 'uintToLittleEndian': Argument 'value' must be unsign integer.");
	if (typeof size != "number") throw new TypeError("Failed to execute 'uintToLittleEndian': Argument 'size' is not a number.");
	if (!Number.isInteger(size)) throw new Error("Failed to execute 'uintToLittleEndian': Argument 'size' must be integer.");
	if (size > 4) throw new Error("Failed to execute 'uintToLittleEndian': Argument 'size' cannot greater than 4.");
	if (value > 2 ** (size * 8) - 1) throw new Error("Failed to execute 'uintToLittleEndian': Given size cannot contain the value.");
	const result = new Uint8Array(size);
	for (let i = 0; i < size && value; ++i) {
		result[i] = value % 256;
		value >>>= 8;
	}
	return result;
}
function intToLittleEndian(value, size) {
	if (typeof value != "number") throw new TypeError("Failed to execute 'intToLittleEndian': Argument 'value' is not a number.");
	if (!Number.isInteger(value)) throw new Error("Failed to execute 'intToLittleEndian': Argument 'value' must be integer.");
	if (typeof size != "number") throw new TypeError("Failed to execute 'intToLittleEndian': Argument 'size' is not a number.");
	if (!Number.isInteger(size)) throw new Error("Failed to execute 'intToLittleEndian': Argument 'size' must be integer.");
	if (size > 4) throw new Error("Failed to execute 'intToLittleEndian': Argument 'size' cannot greater than 4.");
	if (value < 0) {
		if (value < (-2) ** (size * 8 - 1)) throw new Error("Failed to execute 'intToLittleEndian': Given size cannot contain the value.");
		const result = new Uint8Array(size);
		for (let i = 0; i < size && value; ++i) {
			result[i] = value % 256;
			value >>>= 8;
		}
		return result;
	} else {
		if (value > 2 ** (size * 8 - 1) - 1) throw new Error("Failed to execute 'intToLittleEndian': Given size cannot contain the value.");
		const result = new Uint8Array(size);
		value ^= -1;
		for (let i = 0; i < size; ++i) {
			result[i] = value % 256 ^ 255;
			value >>>= 8;
		}
		return result
	}
}
function bigUintToLittleEndian(value, size) {
	if (typeof value != "bigint") throw new TypeError("Failed to execute 'bigUintToLittleEndian': Argument 'value' is not a bigint.");
	if (value < 0n) throw new Error("Failed to execute 'bigUintToLittleEndian': Argument 'value' must be unsign integer.");
	if (typeof size != "number") throw new TypeError("Failed to execute 'bigUintToLittleEndian': Argument 'size' is not a number.");
	if (!Number.isInteger(size)) throw new Error("Failed to execute 'bigUintToLittleEndian': Argument 'size' must be integer.");
	if (value > 2n ** (BigInt(size) * 8n) - 1n) throw new Error("Failed to execute 'bigUintToLittleEndian': Given size cannot contain the value.");
	const result = new Uint8Array(size);
	for (let i = 0; i < size && value; ++i) {
		result[i] = Number(value % 256n);
		value >>= 8n;
	}
	return result;
}
function bigIntToLittleEndian(value, size) {
	if (typeof value != "bigint") throw new TypeError("Failed to execute 'bigIntToLittleEndian': Argument 'value' is not a bigint.");
	if (typeof size != "number") throw new TypeError("Failed to execute 'bigIntToLittleEndian': Argument 'size' is not a number.");
	if (!Number.isInteger(size)) throw new Error("Failed to execute 'bigIntToLittleEndian': Argument 'size' must be integer.");
	if (value < 0n) {
		if (value < (-2n) ** (BigInt(size) * 8n - 1n)) throw new Error("Failed to execute 'bigIntToLittleEndian': Given size cannot contain the value.");
		const result = new Uint8Array(size);
		for (let i = 0; i < size && value; ++i) {
			result[i] = Number(value % 256n);
			value >>= 8n;
		}
		return result;
	} else {
		if (value > 2n ** (BigInt(size) * 8n - 1n) - 1n) throw new Error("Failed to execute 'bigIntToLittleEndian': Given size cannot contain the value.");
		const result = new Uint8Array(size);
		value ^= -1n;
		for (let i = 0; i < size; ++i) {
			result[i] = Number(value % 256n) ^ 255;
			value >>= 8n;
		}
		return result
	}
}
function uintToBigEndian(value, size) {
	if (typeof value != "number") throw new TypeError("Failed to execute 'uintToBigEndian': Argument 'value' is not a number.");
	if (value < 0 || !Number.isInteger(value)) throw new Error("Failed to execute 'uintToBigEndian': Argument 'value' must be unsign integer.");
	if (typeof size != "number") throw new TypeError("Failed to execute 'uintToBigEndian': Argument 'size' is not a number.");
	if (!Number.isInteger(size)) throw new Error("Failed to execute 'uintToBigEndian': Argument 'size' must be integer.");
	if (size > 4) throw new Error("Failed to execute 'uintToBigEndian': Argument 'size' cannot greater than 4.");
	if (value > 2 ** (size * 8) - 1) throw new Error("Failed to execute 'uintToBigEndian': Given size cannot contain the value.");
	const result = new Uint8Array(size);
	for (let i = size - 1; i > -1 && value; --i) {
		result[i] = value % 256;
		value >>>= 8;
	}
	return result;
}
function intToBigEndian(value, size) {
	if (typeof value != "number") throw new TypeError("Failed to execute 'intToBigEndian': Argument 'value' is not a number.");
	if (!Number.isInteger(value)) throw new Error("Failed to execute 'intToBigEndian': Argument 'value' must be integer.");
	if (typeof size != "number") throw new TypeError("Failed to execute 'intToBigEndian': Argument 'size' is not a number.");
	if (!Number.isInteger(size)) throw new Error("Failed to execute 'intToBigEndian': Argument 'size' must be integer.");
	if (size > 4) throw new Error("Failed to execute 'intToBigEndian': Argument 'size' cannot greater than 4.");
	if (value < 0) {
		if (value < (-2) ** (size * 8 - 1)) throw new Error("Failed to execute 'intToBigEndian': Given size cannot contain the value.");
		const result = new Uint8Array(size);
		for (let i = size - 1; i > -1 && value; --i) {
			result[i] = value % 256;
			value >>>= 8;
		}
		return result;
	} else {
		if (value > 2 ** (size * 8 - 1) - 1) throw new Error("Failed to execute 'intToBigEndian': Given size cannot contain the value.");
		const result = new Uint8Array(size);
		value ^= -1;
		for (let i = size - 1; i > -1; --i) {
			result[i] = value % 256 ^ 255;
			value >>>= 8;
		}
		return result
	}
}
function bigUintToBigEndian(value, size) {
	if (typeof value != "bigint") throw new TypeError("Failed to execute 'bigUintToBigEndian': Argument 'value' is not a bigint.");
	if (value < 0n) throw new Error("Failed to execute 'bigUintToBigEndian': Argument 'value' must be unsign integer.");
	if (typeof size != "number") throw new TypeError("Failed to execute 'bigUintToBigEndian': Argument 'size' is not a number.");
	if (!Number.isInteger(size)) throw new Error("Failed to execute 'bigUintToBigEndian': Argument 'size' must be integer.");
	if (value > 2n ** (BigInt(size) * 8n) - 1n) throw new Error("Failed to execute 'bigUintToBigEndian': Given size cannot contain the value.");
	const result = new Uint8Array(size);
	for (let i = size - 1; i > -1 && value; --i) {
		result[i] = Number(value % 256n);
		value >>= 8n;
	}
	return result;
}
function bigIntToBigEndian(value, size) {
	if (typeof value != "bigint") throw new TypeError("Failed to execute 'bigIntToBigEndian': Argument 'value' is not a bigint.");
	if (typeof size != "number") throw new TypeError("Failed to execute 'bigIntToBigEndian': Argument 'size' is not a number.");
	if (!Number.isInteger(size)) throw new Error("Failed to execute 'bigIntToBigEndian': Argument 'size' must be integer.");
	if (value < 0n) {
		if (value < (-2n) ** (BigInt(size) * 8n - 1n)) throw new Error("Failed to execute 'bigIntToBigEndian': Given size cannot contain the value.");
		const result = new Uint8Array(size);
		for (let i = size - 1; i > -1 && value; --i) {
			result[i] = Number(value % 256n);
			value >>= 8n;
		}
		return result;
	} else {
		if (value > 2n ** (BigInt(size) * 8n - 1n) - 1n) throw new Error("Failed to execute 'bigIntToBigEndian': Given size cannot contain the value.");
		const result = new Uint8Array(size);
		value ^= -1n;
		for (let i = size - 1; i > -1; --i) {
			result[i] = Number(value % 256n) ^ 255;
			value >>= 8n;
		}
		return result
	}
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
	littleEndianToUint,
	littleEndianToInt,
	littleEndianToBigUint,
	littleEndianToBigInt,
	bigEndianToUint,
	bigEndianToInt,
	bigEndianToBigUint,
	bigEndianToBigInt,
	uintToLittleEndian,
	intToLittleEndian,
	bigUintToLittleEndian,
	bigIntToLittleEndian,
	uintToBigEndian,
	intToBigEndian,
	bigUintToBigEndian,
	bigIntToBigEndian,
	bitsOf,
	bitsOfBigInt,
	TypedArray
}