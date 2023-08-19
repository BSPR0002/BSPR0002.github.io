import { splitBytes, littleEndianToUint, bigEndianToUint, uintToLittleEndian, uintToBigEndian, TypedArray } from "../BinaryOperate.mjs";
import Enum from "../Enum.mjs";
import { decodeString, encodeString } from "../UTF-8.mjs";
import BufferContext from "../BufferContext.mjs";
const metadataBlockTypes = new Enum(["STREAMINFO", "PADDING", "APPLICATION", "SEEKTABLE", "VORBIS_COMMENT", "CUESHEET", "PICTURE"]);
const typeOfUint8Array = Uint8Array.prototype,
	typeOfBufferContext = BufferContext.prototype,
	typeOfTypedArray = TypedArray.prototype,
	typeOfArrayBuffer = ArrayBuffer.prototype,
	typeOfBlob = Blob.prototype;
class MetadataBlock {
	get typeName() { return Enum.keyOf(metadataBlockTypes, this.type) ?? "RESERVED" }
	constructor(type, data) {
		Object.defineProperties(this, {
			type: { value: type, enumerable: true },
			data: { value: data, enumerable: true }
		});
	}
	decodeData() {
		switch (this.type) {
			case 0: return new StreamInfoMetadata(this.data);
			case 1: return this.data.byteLength;
			case 2: {
				const data = this.data;
				return Object.defineProperties(Object.create(ApplicationMetadata), {
					applicationId: { value: bigEndianToUint(data.subarray(0, 4)), enumerable: true },
					data: { value: data.subarray(4), enumerable: true }
				});
			}
			case 3: return; //not support
			case 4: return new VorbisCommentMetadata(this.data);
			case 5: return; //not support
			case 6: return new PictureMetedata(this.data);
			default: throw new Error("Failed to execute 'decodeData' on 'MetadataBlock': Invalid type.")
		}
	}
	static encodeHeader(data, type, isLast) {
		var length;
		switch (Object.getPrototypeOf(data)) {
			case typeOfTypedArray:
			case typeOfArrayBuffer:
				length = data.byteLength;
				break;
			case typeOfBlob:
				length = data.size;
				break;
			default:
				throw new TypeError("Failed to execute 'encodeMetadataBlockHeader': Argument 'data' must be type of TypedArray, ArrayBuffer or Blob.");
		}
		if (typeof type != "number" || !Number.isInteger(type) || type < 0 || type > 6) throw new Error("Failed to execute 'encodeMetadataBlockHeader': Argument 'type' is invalid.");
		if (length > 16777215) throw new Error("Failed to execute 'encodeMetadataBlockHeader': Data length must not grater than 16777215.");
		const header = new Uint8Array(4);
		header[0] = isLast ? type | 128 : type;
		header.set(uintToBigEndian(length, 3), 1);
		return header
	}
	static { Object.defineProperty(this.prototype, Symbol.toStringTag, { value: this.name, configurable: true }) }
}
function allMetadataBlock(context) {
	var array;
	switch (Object.getPrototypeOf(context)) {
		case typeOfUint8Array:
			context = new BufferContext(array = context, 4);
			break;
		case typeOfBufferContext:
			if ((array = context.array) instanceof Uint8Array) break;
		default:
			throw new TypeError("Failed to execute 'allMetadataBlock': Argument 'context' is not a Uint8Array or a BufferContext containing a Uint8Array.");
	}
	const result = [];
	var last = false, current = context.current;
	do {
		const [temp, type] = splitBytes(array.subarray(current, ++current), [1, 7]), length = bigEndianToUint(array.subarray(current, current += 3));
		last = Boolean(temp);
		result.push(new MetadataBlock(type, array.subarray(current, current += length)));
	} while (!last);
	context.current = current;
	return result
}
const streamInfoMetadataSplitter = [20, 3, 5, 36];
class StreamInfoMetadata {
	constructor(data) {
		if (!(data instanceof Uint8Array)) throw new TypeError("Failed to construct 'StreamInfoMetadata': Argument 'data' is not a Uint8Array.");
		if (data.byteLength != 34) throw new Error("Failed to construct 'StreamInfoMetadata': Data length is not 34 bytes.");
		const temp = splitBytes(data.subarray(10, 18), streamInfoMetadataSplitter);
		Object.defineProperties(this, {
			minBlockSize: { value: bigEndianToUint(data.subarray(0, 2)), enumerable: true },
			maxBlockSize: { value: bigEndianToUint(data.subarray(2, 4)), enumerable: true },
			minFrameSize: { value: bigEndianToUint(data.subarray(4, 7)), enumerable: true },
			maxFrameSize: { value: bigEndianToUint(data.subarray(7, 10)), enumerable: true },
			sampleRate: { value: temp[0], enumerable: true },
			channels: { value: temp[1] + 1, enumerable: true },
			sampleSize: { value: temp[2] + 1, enumerable: true },
			totalSamples: { value: temp[3], enumerable: true },
			MD5: { value: data.subarray(18, 34), enumerable: true }
		});
	}
	static { Object.defineProperty(this.prototype, Symbol.toStringTag, { value: this.name, configurable: true }) }
}
const ApplicationMetadata = Object.defineProperty({}, Symbol.toStringTag, { value: "ApplicationMetadata", configurable: true });
class VorbisCommentMetadata {
	#vendor
	get vendor() { return this.#vendor }
	set vendor(value) {
		if (typeof value != "string") throw new TypeError("Value must be a string");
		this.#vendor = value;
	}
	constructor(data) {
		if (!(data instanceof Uint8Array)) throw new TypeError("Failed to construct 'VorbisCommentMetadata': Argument 'data' is not a Uint8Array.");
		const tags = {};
		var index = 4;
		this.#vendor = decodeString(data.subarray(index, index += littleEndianToUint(data.subarray(0, 4))));
		for (let i = 0, l = littleEndianToUint(data.subarray(index, index += 4)); i < l; ++i) {
			let temp = littleEndianToUint(data.subarray(index, index += 4));
			temp = decodeString(data.subarray(index, index += temp));
			const edge = temp.indexOf("=");
			if (edge == -1) throw new Error("Invalid tag content.");
			const tag = temp.substring(0, edge).toUpperCase(), string = temp.substring(edge + 1);
			if (tag in tags) {
				tags[tag].push(string);
			} else tags[tag] = [string];
		}
		Object.defineProperty(this, "tags", { value: tags, configurable: true, enumerable: true });
	}
	encode() { return VorbisCommentMetadata.encode(this.tags, this.#vendor) }
	static encode(tags, vendor = "") {
		if (!(tags instanceof Object)) throw new TypeError("Failed to execute 'encode': Argument 'tags' must be an object.");
		if (typeof vendor != "string") throw new TypeError("Failed to execute 'encode': Argument 'vendor' must be a string.");
		vendor = encodeString(vendor || "BSIF.FLAC.MetadataBlock");
		const vendorLength = vendor.byteLength;
		if (vendorLength > 4294967295) throw new TypeError("Failed to execute 'encode': Argument 'vendor' is too long.");
		const temp = [];
		var n = 0;
		for (let key in tags) {
			if (key.indexOf("=") != -1) throw new Error("Failed to execute 'encode': The key of tag cannot contain character 0x3D(=).");
			const data = tags[key];
			switch (typeof data) {
				case "string": {
					const item = encodeString(`${key}=${data}`);
					let length = item.byteLength;
					if (length > 4294967295) throw new TypeError("Failed to execute 'encode': Content too long.");
					length = uintToLittleEndian(length, 4);
					temp.push(length, item);
					++n;
					break;
				}
				case "object":
					if (!Array.isArray(data)) throw new TypeError("Failed to execute 'encode': Invalid tag data.");
					for (let item of data) {
						if (typeof item != "string") throw new TypeError("Failed to execute 'encode': Invalid tag data.");
						item = encodeString(`${key}=${item}`);
						let length = item.byteLength;
						if (length > 4294967295) throw new TypeError("Failed to execute 'encode': Content too long.");
						length = uintToLittleEndian(length, 4);
						temp.push(length, item);
						++n;
					}
					break;
				default:
					throw new TypeError("Failed to execute 'encode': Invalid tag data.");
			}
		}
		temp.unshift(uintToLittleEndian(vendorLength, 4), vendor, uintToLittleEndian(n, 4))
		return new Blob(temp)
	}
}
class PictureMetedata {
	constructor(data) {
		if (!(data instanceof Uint8Array)) throw new TypeError("Failed to construct 'PictureMetedata': Argument 'data' is not a Uint8Array.");
		let current = 8;
		Object.defineProperty(this, "relationShip", { value: bigEndianToUint(data.subarray(0, 4)), enumerable: true });
		let length = bigEndianToUint(data.subarray(4, 8));
		const mime = decodeString(data.subarray(current, current += length));
		Object.defineProperty(this, "MIME", { value: mime, enumerable: true });
		length = bigEndianToUint(data.subarray(current, current += 4));
		Object.defineProperties(this, {
			description: { value: decodeString(data.subarray(current, current += length)), enumerable: true },
			width: { value: bigEndianToUint(data.subarray(current, current += 4)), enumerable: true },
			height: { value: bigEndianToUint(data.subarray(current, current += 4)), enumerable: true },
			pixelSize: { value: bigEndianToUint(data.subarray(current, current += 4)), enumerable: true },
			indexedColorNumber: { value: bigEndianToUint(data.subarray(current, current += 4)), enumerable: true },
		});
		length = bigEndianToUint(data.subarray(current, current += 4));
		Object.defineProperty(this, "image", { value: new Blob([data.subarray(current, current + length)], { type: mime }), enumerable: true });
	}
	static { Object.defineProperty(this.prototype, Symbol.toStringTag, { value: "PictureMetedata", configurable: true }) }
}
export { allMetadataBlock, MetadataBlock, StreamInfoMetadata, VorbisCommentMetadata, metadataBlockTypes }