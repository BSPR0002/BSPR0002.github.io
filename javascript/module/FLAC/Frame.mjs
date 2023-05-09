import { RESERVED } from "./Const.mjs";
import { decode as decodeValue } from "../UTF-8.mjs";
import { bigEndianToNumber, splitBytes } from "../BinaryOperate.mjs";
import { simpleEnum } from "../Enum.mjs";
const { defineProperty, defineProperties, freeze } = Object;
function offsetRead(context, bits) {
	const { array, data } = context;
	var { remain, temp } = data, result = 0;
	while (bits) {
		if (!remain) {
			temp = array[context.current];
			remain = 8;
		}
		if (bits >= remain) {
			bits -= remain;
			result <<= remain;
			result |= temp;
			remain = 0;
			++context.current;
		} else {
			result <<= bits;
			result |= temp >>> (remain -= bits);
			temp %= 1 << remain;
			break;
		}
	}
	data.remain = remain;
	data.temp = temp;
	return result;
}
const FrameHeader = defineProperty({}, Symbol.toStringTag, { value: "FrameHeader", configurable: true });
const frameHeaderSplitter = [15, 1, 4, 4, 4, 3, 1];
function decodeFrameHeader(context, streamInfo) {
	const array = context.array,
		[syncCode, blockingStrategy, blockSizeCode, sampleRateCode, channelCode, sampleSizeCode] = splitBytes(array.subarray(context.current, context.current += 4), frameHeaderSplitter);
	if (syncCode != 32764) throw new Error("Wrong starting position.");
	const idStart = context.current, id = decodeValue(context);
	if (!blockingStrategy && context.current - idStart > 6) throw new Error("Unexpected data length.");
	return defineProperties(Object.create(FrameHeader), {
		blockingStrategy: { value: blockingStrategy, enumerable: true },
		id: { value: id, enumerable: true },
		blockSize: { value: getBlockSize(blockSizeCode, context), enumerable: true },
		sampleRate: { value: getSampleRate(sampleRateCode, context, streamInfo), enumerable: true },
		sampleSize: { value: getSampleSize(sampleSizeCode, streamInfo), enumerable: true },
		channels: { value: getChannels(channelCode), enumerable: true },
		CRC8: { value: array[context.current++], enumerable: true }
	});
}
function getBlockSize(code, context) {
	switch (code) {
		case 0: return RESERVED;
		case 1: return 192;
		case 2: return 576;
		case 3: return 1152;
		case 4: return 2304;
		case 5: return 4608;
		case 6: return bigEndianToNumber(context.array.subarray(context.current, context.current += 1));
		case 7: return bigEndianToNumber(context.array.subarray(context.current, context.current += 2));
		case 8: return 256;
		case 9: return 512;
		case 10: return 1024;
		case 11: return 2048;
		case 12: return 4096;
		case 13: return 8192;
		case 14: return 16385;
		case 15: return 32768;
	}
}
function getSampleRate(code, context, streamInfo) {
	switch (code) {
		case 0: return streamInfo.sampleRate;
		case 1: return 88200;
		case 2: return 176400;
		case 3: return 192000;
		case 4: return 8000;
		case 5: return 16000;
		case 6: return 22050;
		case 7: return 24000;
		case 8: return 32000;
		case 9: return 44100;
		case 10: return 48000;
		case 11: return 96000;
		case 12: return context.array[context.current++];
		case 13: return bigEndianToNumber(context.array.subarray(context.current, context.current += 2));
		case 14: return bigEndianToNumber(context.array.subarray(context.current, context.current += 2)) * 10;
		default: throw new Error("Unexpected value.");
	}
}
function getSampleSize(code, streamInfo) {
	switch (code) {
		case 0: return streamInfo.sampleSize;
		case 1: return 8;
		case 2: return 12;
		case 3: return RESERVED;
		case 4: return 16;
		case 5: return 20;
		case 6: return 24;
		case 7: return 32;
	}
}
function getChannels(code) {
	switch (code) {
		case 0: return ["mono"];
		case 1: return ["left", "right"];
		case 2: return ["left", "right", "center"];
		case 3: return ["front left", "front right", "back left", "back right"];
		case 4: return ["front left", "front right", "front center", "back left", "back right"];
		case 5: return ["front left", "front right", "front center", "LFE", "back left", "back right"];
		case 6: return ["front left", "front right", "front center", "LFE", "back center", "middle left", "middle right"];
		case 7: return ["front left", "front right", "front center", "LFE", "back left", "back right", "middle left", "middle right"];
		case 8: return ["left", "side"];
		case 9: return ["side", "right"];
		case 10: return ["average", "side"];
		default: return RESERVED;
	}
}
const subFrameTypes = simpleEnum(["constant", "verbatim", "fixed", "lpc"]);
class SubFrame {
	constructor(wastedBits) { defineProperty(this, "wastedBits", { value: wastedBits, enumerable: true }) }
	get typeName() { return subFrameTypes[this.type] }
	static {
		defineProperties(this.prototype, {
			[Symbol.toStringTag]: { value: this.name, configurable: true },
			type: { value: RESERVED, configurable: true, enumerable: true }
		});
	}
}
class ConstantSubFrame extends SubFrame {
	constructor(wastedBits, context, frameInfo) {
		super(wastedBits);
		defineProperty(this, "sample", { value: offsetRead(context, frameInfo.sampleSize), enumerable: true });
	}
	static {
		defineProperties(this.prototype, {
			[Symbol.toStringTag]: { value: this.name, configurable: true },
			type: { value: 0, configurable: true, enumerable: true }
		});
	}
}
class VerbatimSubFrame extends SubFrame {
	constructor(wastedBits, context, frameInfo) {
		super(wastedBits);
		const { blockSize, sampleSize } = frameInfo, samples = new Array(blockSize);
		for (let i = 0; i < blockSize; ++i) samples[i] = offsetRead(context, sampleSize);
		defineProperty(this, "samples", { value: freeze(samples), enumerable: true });
	}
	static {
		defineProperties(this.prototype, {
			[Symbol.toStringTag]: { value: this.name, configurable: true },
			type: { value: 1, configurable: true, enumerable: true }
		});
	}
}
class PredictorSubFrame extends SubFrame {
	constructor(wastedBits, order, warmUpSamples, residual) {
		super(wastedBits);
		defineProperties(this, {
			order: { value: order, enumerable: true },
			warmUpSamples: { value: freeze(warmUpSamples), enumerable: true },
			residual: { value: freeze(residual), enumerable: true }
		});
	}
	static {
		defineProperty(this.prototype, Symbol.toStringTag, { value: this.name, configurable: true });
	}
}
function decodeRice(context, codingMethod, samples) {
	var parameter;
	const result = new Array(samples);
	switch (codingMethod) {
		case 0: {
			const temp = offsetRead(context, 4);
			if (temp != 15) parameter = temp;
			break;
		}
		case 1: {
			const temp = offsetRead(context, 5);
			if (temp != 31) parameter = temp;
			break;
		}
		default:
			throw new Error("Unexpected value.");
	}
	if (parameter === undefined) {
		const size = offsetRead(context, 5);
		for (let i = 0; i < samples; ++i) result[i] = offsetRead(context, size);
	} else {
		for (let i = 0; i < samples; ++i) {
			let n = 0;
			while (!offsetRead(context, 1)) ++n;
			result[i] = (n << parameter) | offsetRead(context, parameter);
		}
	}
	return result;
}
function decodeResidual(context, blockSize, predictorOrder) {
	const codingMethod = offsetRead(context, 2), partitionsNumber = 1 << offsetRead(context, 4), samples = blockSize / partitionsNumber, partitions = new Array(partitionsNumber);
	partitions[0] = decodeRice(context, codingMethod, samples - predictorOrder);
	for (let i = 1; i < partitionsNumber; ++i)partitions[i] = decodeRice(context, codingMethod, samples);
	return {
		codingMethod,
		partitions
	};
}
class FixedSubFrame extends PredictorSubFrame {
	constructor(wastedBits, context, frameInfo, order) {
		const { blockSize, sampleSize } = frameInfo, warmUpSamples = new Array(order);
		for (let i = 0; i < order; ++i) warmUpSamples[i] = offsetRead(context, sampleSize);
		super(wastedBits, order, warmUpSamples, decodeResidual(context, blockSize, order));
	}
	static {
		defineProperties(this.prototype, {
			[Symbol.toStringTag]: { value: this.name, configurable: true },
			type: { value: 2, configurable: true, enumerable: true }
		});
	}
}
class LPCSubFrame extends PredictorSubFrame {
	constructor(wastedBits, context, frameInfo, order) {
		const { blockSize, sampleSize } = frameInfo, warmUpSamples = new Array(order), coefficients = new Array(order);
		for (let i = 0; i < order; ++i) warmUpSamples[i] = offsetRead(context, sampleSize);
		const coefficientsPrecision = offsetRead(context, 4) + 1;
		if (coefficientsPrecision > 15) throw new Error("Unexpected value.");
		const coefficientsShift = offsetRead(context, 5);
		for (let i = 0; i < order; ++i) coefficients[i] = offsetRead(context, coefficientsPrecision);
		super(wastedBits, order, warmUpSamples, decodeResidual(context, blockSize, order));
		defineProperties(this, {
			coefficientsPrecision: { value: coefficientsPrecision, enumerable: true },
			coefficientsShift: { value: coefficientsShift, enumerable: true },
			coefficients: { value: freeze(coefficients), enumerable: true }
		});
	}
	static {
		defineProperties(this.prototype, {
			[Symbol.toStringTag]: { value: this.name, configurable: true },
			type: { value: 3, configurable: true, enumerable: true }
		});
	}
}
function decodeSubFrame(context, frameInfo) {
	const checkFlag = offsetRead(context, 1);
	if (checkFlag) throw new Error("Unexpected value.");
	const typeCode = offsetRead(context, 6), wastedBitsFlag = offsetRead(context, 1);
	var wastedBits = 0;
	if (wastedBitsFlag) do { ++wastedBits } while (!offsetRead(context, 1));
	if (typeCode == 0) return new ConstantSubFrame(wastedBits, context, frameInfo);
	if (typeCode == 1) return new VerbatimSubFrame(wastedBits, context, frameInfo);
	if (typeCode > 7 && typeCode < 13) return new FixedSubFrame(wastedBits, context, frameInfo, typeCode - 7);
	if (typeCode > 31) return new LPCSubFrame(wastedBits, context, frameInfo, typeCode - 31);
	return new SubFrame(wastedBits);
}
const Frame = defineProperty({}, Symbol.toStringTag, { value: "Frame", configurable: true });
function decodeFrame(context, streamInfo) {
	const array = context.array, start = context.current, header = decodeFrameHeader(context, streamInfo), channels = header.channels.length, subFrames = new Array(channels), bitOffset = context.data = { remain: 8, temp: array[context.current] };
	for (let i = 0; i < channels; ++i) subFrames[i] = decodeSubFrame(context, header);
	context.data = undefined;
	if (bitOffset.remain) ++context.current;
	return defineProperties(Object.create(Frame), {
		start: { value: start, enumerable: true },
		header: { value: header, enumerable: true },
		subFrames: { value: freeze(subFrames), enumerable: true },
		CRC16: { value: bigEndianToNumber(array.subarray(context.current, context.current += 2)), enumerable: true },
		end: { value: context.current, enumerable: true }
	});
}
function decodeFrames(context, streamInfo) {
	const frames = [];
	while (context.hasNext) frames.push(decodeFrame(context, streamInfo));
	return frames;
}
export { decodeFrames, decodeFrame, ConstantSubFrame, VerbatimSubFrame, FixedSubFrame, LPCSubFrame, SubFrame, subFrameTypes }