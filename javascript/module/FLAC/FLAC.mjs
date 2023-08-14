import BufferContext from "../BufferContext.mjs";
import { allMetadataBlock } from "./MetadataBlock.mjs";
import { extractFrames as extractFramesFunction } from "./Frame.mjs"
const headValue = [102, 76, 97, 67];
function checkHead(data) {
	for (let i = 0; i < 4; ++i) if (data[i] != headValue[i]) throw new Error("Invalid data");
	return new BufferContext(data, 4);
}
class FLAC {
	constructor(context, metadataBlocks, frames) {
		this.context = context;
		this.metadataBlocks = metadataBlocks;
		this.frames = frames;
	}
	static { Object.defineProperty(this.prototype, Symbol.toStringTag, { value: this.name, configurable: true }) }
}
function extract(data, extractFrames = false) {
	if (!(data instanceof Uint8Array)) throw new TypeError("Failed to execute 'decode': Argument 'data' is not a Uint8Array.");
	if (typeof extractFrames != "boolean") throw new TypeError("Failed to execute 'decode': Argument 'extractFrames' is not a boolean.");
	const context = checkHead(data);
	const metadata = allMetadataBlock(context);
	return new FLAC(context, metadata, extractFrames ? extractFramesFunction(context, metadata[0]) : undefined);
}
export { extract }