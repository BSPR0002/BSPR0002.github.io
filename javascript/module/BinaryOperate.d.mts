type TypedArray = Uint8Array | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array | Float32Array | Float64Array | Uint8ClampedArray;
declare function splitBytes(data: TypedArray, splitLength: number[]): number;
declare function littleEndianToNumber(data: Uint8Array): number;
declare function littleEndianToBigInt(data: Uint8Array): bigint;
declare function bigEndianToNumber(data: Uint8Array): number;
declare function bigEndianToBigInt(data: Uint8Array): bigint;
declare function numberToLittleEndian(value:number,size:number): Uint8Array;
declare function bigIntToLittleEndian(value:bigint,size:number): Uint8Array;
declare function numberToBigEndian(value:number,size:number): Uint8Array;
declare function bigIntToBigEndian(value:bigint,size:number): Uint8Array;
declare function bitsOf(value:number): number;
declare function bitsOfBigInt(value:bigint): number;
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