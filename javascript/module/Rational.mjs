const { isFinite, isInteger, isNaN } = Number, toPrimitive = Symbol.toPrimitive;
class DivideByZeroError extends Error {
	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: this.name,
			configurable: true
		});
		Object.defineProperty(this.prototype, "name", {
			value: this.name,
			writable: true,
			configurable: true
		})
	}
}
class Rational {
	static #reduceFactor(n, d) {
		if (d == 0) return n;
		return this.#reduceFactor(d, n % d);
	}
	#denominator;
	get denominator() { return this.#denominator }
	#numerator;
	get numerator() { return this.#numerator }
	[toPrimitive]() { return this.#numerator / this.#denominator }
	constructor(x, denominator) {
		if (arguments.length < 1) throw new TypeError("Failed to construct 'Rational': 1 argument required, but only 0 present.")
		if (arguments.length > 1) {
			denominator = Number(denominator);
			if (isNaN(denominator)) throw new TypeError("Failed to construct 'Rational': Argument 'denominator' is NaN.");
			if (isFinite(denominator)) {
				if (denominator == 0) throw new DivideByZeroError("Failed to construct 'Rational': Argument 'denominator' cannot be 0.");
				x = Number(x);
				if (isNaN(x) || !isFinite(x)) {
					this.#numerator = x;
					this.#denominator = 1;
				} else {
					const divisor = Rational.#reduceFactor(x, denominator);
					this.#numerator = x / divisor;
					this.#denominator = denominator / divisor;
				}
			} else {
				this.#numerator = 0;
				this.#denominator = 1;
			}
		} else {
			switch (typeof x) {
				default:
					x = Number(x);
				case "number":
					if (isNaN(x) || !isFinite(x)) {
						this.#numerator = x;
						this.#denominator = 1;
					} else {
						let denominator = 1;
						while (!isInteger(x)) {
							denominator *= 10;
							x *= 10;
						}
						const divisor = Rational.#reduceFactor(x, denominator);
						this.#numerator = x / divisor;
						this.#denominator = denominator / divisor;
					}
					break;
				case "bigint":
					this.#numerator = Number(x);
					this.#denominator = 1;
					break;
			}
		}
	}
	#isFinite() { return isFinite(this.#numerator) }
	isFinite() { return this.isFinite() }
	static isFinite(x) { return x instanceof Rational ? x.#isFinite() : isFinite(x) }
	#isInteger() { return isFinite(this.#numerator) && this.#denominator == 1 }
	isInteger() { return this.#isInteger() }
	static isInteger(x) { return x instanceof Rational ? x.#isInteger() : isInteger(x) }
	#isNaN() { return isNaN(this.#numerator) }
	isNaN() { return this.isNaN() }
	static isNaN(x) { return x instanceof Rational ? x.#isNaN() : isNaN(x) }
	plus(x) {
		if (!(x instanceof Rational)) x = new Rational(x);
		const d1 = this.#denominator, d2 = x.#denominator;
		return d1 == d2 ? new Rational(this.#numerator + x.#numerator, d1) : new Rational(this.#numerator * d2 + x.#numerator * d1, d1 * d2);
	}
	minus(x) {
		if (!(x instanceof Rational)) x = new Rational(x);
		const d1 = this.#denominator, d2 = x.#denominator;
		return d1 == d2 ? new Rational(this.#numerator - x.#numerator, d1) : new Rational(this.#numerator * d2 - x.#numerator * d1, d1 * d2);
	}
	multiply(x) {
		if (!(x instanceof Rational)) x = new Rational(x);
		return new Rational(this.#numerator * x.#numerator, this.#denominator * x.#denominator);
	}
	divide(x) {
		if (!(x instanceof Rational)) x = new Rational(x);
		if (x.#numerator == 0) throw new DivideByZeroError("Failed to execute 'divide' on 'Rational': Argument 'x' is 0.");
		return new Rational(this.#numerator * x.#denominator, this.#denominator * x.#numerator);
	}
	toString(radius = undefined) { return this[toPrimitive]().toString(radius) }
	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: this.name,
			configurable: true
		});
	}
}
export default Rational;
export { Rational };