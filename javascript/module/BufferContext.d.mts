import { TypedArray } from "./BinaryOperate.mjs";
declare class BufferContext<TA extends TypedArray> {
	readonly array: TA;
	current: number;
	data: any;
	constructor(array: TA, current = 0, data?: any);
	readonly length: number;
	readonly hasNext: boolean;
}
export default BufferContext;
export { BufferContext }