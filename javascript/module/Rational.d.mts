declare class Rational {
	constructor(x: any);
	constructor(numerator: any, denominator: any);
	[Symbol.toPrimitive](): number;
	readonly denominator: number;
	readonly numerator: number;
	isFinite(): boolean;
	isInteger(): boolean;
	isNaN(): boolean;
	static isFinite(x: any): boolean;
	static isInteger(x: any): boolean;
	static isNaN(x: any): boolean;
	plus(x: any): Rational;
	minus(x: any): Rational;
	multiply(x: any): Rational;
	divide(x: any): Rational;
	toString(radius?: number): string;
}
export default Rational;
export { Rational };