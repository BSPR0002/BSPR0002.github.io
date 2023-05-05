import { TypedArray } from "../BinaryOperate.mjs";
import BufferContext from "../BufferContext.mjs";
const enum metadataBlockTypes { STREAMINFO, PADDING, APPLICATION, SEEKTABLE, VORBIS_COMMENT, CUESHEET, PICTURE, RESERVED }
declare class MetadataBlock {
	constructor(type: metadataBlockTypes, data: Uint8Array, start: number, end: number);
	readonly type: metadataBlockTypes;
	readonly typeName: string;
	readonly data: Uint8Array;
	decodeData(): StreamInfoMetadata | number | ApplicationMetadata | PictureMetadata | VorbisCommentMetadata | void;
	static encodeHeader(data: TypedArray | ArrayBuffer | Blob, type: metadataBlockTypes, isLast: boolean): Uint8Array;
}
declare class StreamInfoMetadata {
	readonly minBlockSize: number;
	readonly maxBlockSize: number;
	readonly minFrameSize: number;
	readonly maxFrameSize: number;
	readonly sampleRate: number;
	readonly channels: number;
	readonly sampleSize: number;
	readonly totalSamples: number;
	readonly MD5: Uint8Array;
	constructor(data: Uint8Array);
}
type ApplicationMetadata = {
	readonly applicationId: number,
	readonly data: Uint8Array
};
type vorbisCommentMetadataTags = { [key: string]: string | string[] }
declare class VorbisCommentMetadata {
	constructor(data: Uint8Array);
	vendor: string;
	readonly tags: vorbisCommentMetadataTags;
	encode(): Blob;
	static encode(tags: vorbisCommentMetadataTags, vendor?: string): Blob;
}
declare class PictureMetadata {
	readonly relationShip: number;
	readonly MIME: string;
	readonly description: string;
	readonly width: number;
	readonly height: number;
	readonly pixelSize: number;
	readonly indexedColorNumber: number;
	readonly image: Blob;
}
declare function allMetadataBlock(context: BufferContext): MetadataBlock[];
declare function allMetadataBlock(data: Uint8Array): MetadataBlock[];
export { allMetadataBlock, MetadataBlock, StreamInfoMetadata, VorbisCommentMetadata, metadataBlockTypes }