declare class Rational {
	constructor(x: any);
	constructor(numerator: any, denominator: any);
	[Symbol.toPrimitive](): number;
	readonly denominator: number;
	readonly numerator: number;
	isFinite(): boolean;
	isInteger(): boolean;
	isNaN(): boolean;
	equals(x: any): boolean;
	static isFinite(x: any): boolean;
	static isInteger(x: any): boolean;
	static isNaN(x: any): boolean;
	static isEqual(x1: any, x2: any): boolean;
	plus(x: any): Rational;
	minus(x: any): Rational;
	multiply(x: any): Rational;
	divideBy(x: any): Rational;
	toString(decimalForm = false): string;
}
export default Rational;
export { Rational };