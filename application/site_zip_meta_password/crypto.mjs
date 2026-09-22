import { bigUintToBigEndian } from "/javascript/module/binary_operate.mjs";

const { floor } = Math;

function generateKey() {
	const keyData = Uint8Array.from([40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 0, 0, 0, 0, 0, 0, 0, 0]),
		random = new Uint8Array(24);
	crypto.getRandomValues(random);
	for (let i = 0; i < 24; ++i) {
		const i2 = floor(random[i] * 0.09375), t = keyData[i2];
		keyData[i2] = keyData[i];
		keyData[i] = t;
	}
	crypto.getRandomValues(random);
	for (let i = 0; i < 24; ++i)
		keyData[i] = keyData[i] << 1 | (random[i] & 0x80 ? 1 : 0);
	const timestamp = BigInt(Date.now());
	bigUintToBigEndian(timestamp, keyData.subarray(24));
	return {
		timestamp,
		keyData,
		key: restoreKey(keyData)
	};
}

/**
 * 
 * @param {number} a 
 * @param {Uint8Array} b 
 */
function getDataBit(a, b) {
	const flip = a & 1;
	a >>>= 1;
	const bitOffset = a & 7, byteOffset = 7 - (a >>> 3);
	return (flip ? ~b[byteOffset] : b[byteOffset]) & (1 << bitOffset);
}

/**
 * 
 * @param {Uint8Array} keyData 
 */
function restoreKey(keyData) {
	const restoreData = keyData.subarray(0, 24),
		base = keyData.subarray(24),
		key = new Uint8Array(8);
	key[0] = base[7];
	key[7] = base[6];
	var kI = 1, rI = 0, bI = 5;
	while (kI < 7) {
		const bB = base[bI--];
		key[kI++] = getDataBit(restoreData[rI++], base) | (bB & 1) |
			getDataBit(restoreData[rI++], base) | (bB & 2) |
			getDataBit(restoreData[rI++], base) | (bB & 4) |
			getDataBit(restoreData[rI++], base) | (bB & 8);
		key[kI++] = getDataBit(restoreData[rI++], base) | (bB & 16) |
			getDataBit(restoreData[rI++], base) | (bB & 32) |
			getDataBit(restoreData[rI++], base) | (bB & 64) |
			getDataBit(restoreData[rI++], base) | (bB & 128);
	}
	return key;
}

/**
 * 
 * @param {Uint8Array} key 
 * @param {Uint8Array} data 
 */
function transform(key, data) {
	const { length } = data,
		result = new Uint8Array(length);
	for (let i = 0; i < length; ++i)
		result[i] = data[i] ^ key[i & 7];
	return result;
}

export { generateKey, restoreKey, transform };