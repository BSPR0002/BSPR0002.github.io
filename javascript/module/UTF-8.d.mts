import BufferContext from "./BufferContext.mjs";
declare function decode(data: Uint8Array | BufferContext): number;
declare function encode(value: number): Uint8Array;
declare function decodeString(data: Uint8Array): string;
declare function decodeString(string: string): Uint8Array;
export { decode, encode, encodeString, decodeString }