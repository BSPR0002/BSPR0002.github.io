type TypedArray = Uint8Array | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array | Float32Array | Float64Array | Uint8ClampedArray;

/**
 * 将数组缓冲区按指定长度拆分成多个整数
 * @param data - 要拆分的TypedArray数组
 * @param splitLength - 拆分长度数组
 * @returns 拆分后的整数数组
 */
declare function splitBytes(data: TypedArray, splitLength: number[]): number[];

/** 
 * 将小端序字节数组转换为无符号整数
 * @param data - 小端序字节数组
 * @returns 转换后的无符号整数
 */
declare function littleEndianToUint(data: Uint8Array): number;

/**
 * 将小端序字节数组转换为有符号整数 
 * @param data - 小端序字节数组
 * @returns 转换后的有符号整数
 */
declare function littleEndianToInt(data: Uint8Array): number;

/**
 * 将小端序字节数组转换为大数无符号整数
 * @param data - 小端序字节数组 
 * @returns 转换后的大数无符号整数
 */
declare function littleEndianToBigUint(data: Uint8Array): bigint;

/**
 * 将小端序字节数组转换为大数有符号整数
 * @param data - 小端序字节数组
 * @returns 转换后的大数有符号整数 
 */
declare function littleEndianToBigInt(data: Uint8Array): bigint;

/**
 * 将大端序字节数组转换为无符号整数
 * @param data - 大端序字节数组
 * @returns 转换后的无符号整数
 */
declare function bigEndianToUint(data: Uint8Array): number;

/**
 * 将大端序字节数组转换为有符号整数
 * @param data - 大端序字节数组
 * @returns 转换后的有符号整数
 */
declare function bigEndianToInt(data: Uint8Array): number;

/**
 * 将大端序字节数组转换为大数无符号整数
 * @param data - 大端序字节数组
 * @returns 转换后的大数无符号整数
 */
declare function bigEndianToBigUint(data: Uint8Array): bigint;

/**
 * 将大端序字节数组转换为大数有符号整数
 * @param data - 大端序字节数组
 * @returns 转换后的大数有符号整数
 */
declare function bigEndianToBigInt(data: Uint8Array): bigint;

/**
 * 将无符号整数转换为小端序字节数组
 * @param value - 要转换的无符号整数 
 * @param bufferArray- 需要写入数据的字节数组 
 * @returns 小端序字节数组
 */
declare function uintToLittleEndian(value: number, bufferArray: Uint8Array): Uint8Array;

/**
 * 将有符号整数转换为小端序字节数组
 * @param value - 要转换的有符号整数
 * @param bufferArray- 需要写入数据的字节数组
 * @returns 小端序字节数组
 */
declare function intToLittleEndian(value: number, bufferArray: Uint8Array): Uint8Array;

/**
 * 将大数无符号整数转换为小端序字节数组
 * @param value - 要转换的大数无符号整数
 * @param bufferArray- 需要写入数据的字节数组 
 * @returns 小端序字节数组
 */
declare function bigUintToLittleEndian(value: bigint, bufferArray: Uint8Array): Uint8Array;

/**
 * 将大数有符号整数转换为小端序字节数组
 * @param value - 要转换的大数有符号整数
 * @param bufferArray- 需要写入数据的字节数组
 * @returns 小端序字节数组
 */ 
declare function bigIntToLittleEndian(value: bigint, bufferArray: Uint8Array): Uint8Array;

/**
 * 将无符号整数转换为大端序字节数组
 * @param value - 要转换的无符号整数
 * @param bufferArray- 需要写入数据的字节数组
 * @returns 大端序字节数组
 */
declare function uintToBigEndian(value: number, bufferArray: Uint8Array): Uint8Array;

/**
 * 将有符号整数转换为大端序字节数组
 * @param value - 要转换的有符号整数
 * @param bufferArray- 需要写入数据的字节数组 
 * @returns 大端序字节数组
 */
declare function intToBigEndian(value: number, bufferArray: Uint8Array): Uint8Array;

/**
 * 将大数无符号整数转换为大端序字节数组
 * @param value - 要转换的大数无符号整数
 * @param bufferArray- 需要写入数据的字节数组
 * @returns 大端序字节数组
 */
declare function bigUintToBigEndian(value: bigint, bufferArray: Uint8Array): Uint8Array;

/**
 * 将大数有符号整数转换为大端序字节数组 
 * @param value - 要转换的大数有符号整数
 * @param bufferArray- 需要写入数据的字节数组
 * @returns 大端序字节数组
 */
declare function bigIntToBigEndian(value: bigint, bufferArray: Uint8Array): Uint8Array;

/**
 * 计算无符号整数的二进制位数
 * @param value - 要计算的无符号整数
 * @returns 二进制位数
 */
declare function bitsOf(value: number): number;

/**
 * 计算大数无符号整数的二进制位数
 * @param value - 要计算的大数无符号整数 
 * @returns 二进制位数
 */
declare function bitsOfBigInt(value: bigint): bigint;


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