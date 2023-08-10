import BufferContext from "../BufferContext.mjs";
import { StreamInfoMetadata } from "./MetadataBlock.mjs";
const enum subFrameTypes { constant, verbatim, fixed, lpc }
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
	readonly type: subFrameTypes | symbol;
	readonly typeName: string;
	readonly wastedBits: number;
}
declare class ConstantSubFrame extends SubFrame {
	constructor(wastedBits: number, context: BufferContext, frameInfo: FrameHeader);
	readonly type: subFrameTypes.constant;
	readonly typeName: "constant";
	readonly sample: number;
}
declare class VerbatimSubFrame extends SubFrame {
	constructor(wastedBits: number, context: BufferContext, frameInfo: FrameHeader);
	readonly type: subFrameTypes.verbatim;
	readonly typeName: "verbatim";
	readonly samples: number[];
}
declare class PredictorSubFrame extends SubFrame {
	readonly order: number;
	readonly warmUpSamples: number[];
	readonly residual: number[];
}
declare class FixedSubFrame extends PredictorSubFrame {
	constructor(wastedBits: number, context: BufferContext, frameInfo: FrameHeader, order: number);
	readonly type: subFrameTypes.fixed;
	readonly typeName: "fixed";
}
declare class LPCSubFrame extends PredictorSubFrame {
	constructor(wastedBits: number, context: BufferContext, frameInfo: FrameHeader, order: number);
	readonly type: subFrameTypes.lpc;
	readonly typeName: "lpc";
	readonly coefficientsPrecision: number;
	readonly coefficientsShift: number;
	readonly coefficients: number[];
}
type Frame = {
	readonly start: number;
	readonly header: FrameHeader;
	readonly subFrames: SubFrame[];
	readonly CRC16: number;
	readonly end: number;
}
declare function extractFrames(context: BufferContext, streamInfo: StreamInfoMetadata): Frame;
declare function extractFrame(context: BufferContext, streamInfo: StreamInfoMetadata): Frame[];
export { extractFrames, extractFrame, ConstantSubFrame, VerbatimSubFrame, FixedSubFrame, LPCSubFrame, SubFrame, subFrameTypes }