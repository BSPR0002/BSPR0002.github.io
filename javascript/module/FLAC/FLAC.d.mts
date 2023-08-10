import BufferContext from "../BufferContext.mjs";
import { allMetadataBlock } from "./MetadataBlock.mjs";
import { decodeFrames } from "./Frame.mjs"
declare class FLAC {
	context: BufferContext;
	metadataBlocks: ReturnType<typeof allMetadataBlock>;
	frames: ReturnType<typeof decodeFrames>;
}
declare function extract(data: Uint8Array, decodeFrames = false): FLAC;