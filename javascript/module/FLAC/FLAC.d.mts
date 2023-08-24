import BufferContext from "../BufferContext.mjs";
import { allMetadataBlock } from "./MetadataBlock.mjs";
import { extractFrames } from "./Frame.mjs"
declare class FLAC {
	context: BufferContext;
	metadataBlocks: ReturnType<typeof allMetadataBlock>;
	frames: ReturnType<typeof extractFrames>;
}
declare function extract(data: Uint8Array, extractFrames = false): FLAC;