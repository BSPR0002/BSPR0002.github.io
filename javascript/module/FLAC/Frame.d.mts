import BufferContext from "../BufferContext.mjs";
import { StreamInfoMetadata } from "./MetadataBlock.mjs";
const enum subFrameTypes { CONSTANT, VERBATIM, FIXED, LPC }
type FrameHeader = {
	readonly blockingStrategy: 0 | 1;
	readonly id: number;
	readonly blockSize: number;
	readonly sampleRate: number;
	readonly sampleSize: number;
	readonly channels: number;
	readonly CRC8: number;
}
declare class SubFrame {
	readonly type: subFrameTypes;
	readonly typeName: string;
	readonly sampleSize: number;
}
declare class ConstantSubFrame extends SubFrame {
	constructor(context: BufferContext, sampleSize: number);
	readonly type: subFrameTypes.constant;
	readonly typeName: "CONSTANT";
	readonly sample: number;
}
declare class VerbatimSubFrame extends SubFrame {
	constructor(context: BufferContext, sampleSize: number, blockSize: number);
	readonly type: subFrameTypes.verbatim;
	readonly typeName: "VERBATIM";
	readonly samples: number[];
}
declare class PredictorSubFrame extends SubFrame {
	readonly order: number;
	readonly warmUpSamples: number[];
	readonly residual: number[];
}
declare class FixedSubFrame extends PredictorSubFrame {
	constructor(context: BufferContext, sampleSize: number, blockSize: number, order: number);
	readonly type: subFrameTypes.fixed;
	readonly typeName: "FIXED";
}
declare class LPCSubFrame extends PredictorSubFrame {
	constructor(context: BufferContext, sampleSize: number, blockSize: number, order: number);
	readonly type: subFrameTypes.lpc;
	readonly typeName: "LPC";
	readonly coefficientsPrecision: number;
	readonly coefficientsShift: number;
	readonly coefficients: number[];
}
declare class Frame {
	readonly header: FrameHeader;
	readonly subFrames: SubFrame[];
	readonly CRC16: number;
	decode(): Int32Array[];
	verify(): boolean;
}
declare function extractFrames(context: BufferContext, streamInfo: StreamInfoMetadata): Frame;
declare function extractFrame(context: BufferContext, streamInfo: StreamInfoMetadata): Frame[];
export { extractFrames, extractFrame, ConstantSubFrame, VerbatimSubFrame, FixedSubFrame, LPCSubFrame, SubFrame, Frame, subFrameTypes }