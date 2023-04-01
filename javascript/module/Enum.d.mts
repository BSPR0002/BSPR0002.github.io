type customAccessor = {
	hasIndex?: (this: Enum, array: any[], index: number) => boolean,
	hasValue?: (this: Enum, array: any[], value: any) => boolean,
	valueOf?: (this: Enum, array: any[], index: number) => any,
	indexOf?: (this: Enum, array: any[], value: any) => number,
	size?: (this: Enum, array: any[]) => number
};
declare class Enum {
	constructor(array: any[], custom?: customAccessor);
	hasIndex(index: number): boolean;
	hasValue(value: any): boolean;
	valueOf(index: number): any;
	indexOf(value: any): number;
	size(): number;
	customHasIndex(index: number): boolean;
	customHasValue(value: any): boolean;
	customValueOf(index: number): any;
	customIndexOf(value: any): number;
	customSize(): number;
	keys(): IterableIterator<number>;
	entries(): IterableIterator<[number, any]>;
	values(): IterableIterator<any>;
	forEach(callbackfn: (value: any, index: number, array: readonly any[]) => void, thisArg?: any): void
}
declare function simpleEnum(array: string[], uppercase = true): string[];
export { Enum, simpleEnum }
export default Enum;