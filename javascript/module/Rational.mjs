const { isFinite, isInteger, isNaN } = Number,
	toPrimitive = Symbol.toPrimitive;
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
		while (d != 0) d = n % (n = d);
		return n;
	}
	static #denominatorPositify(instance, n, d) {
		if (d < 0) {
			instance.#denominator = -d;
			instance.#numerator = -n;
		} else {
			instance.#denominator = d;
			instance.#numerator = n;
		}
	}
	#denominator;
	get denominator() { return this.#denominator }
	#numerator;
	get numerator() { return this.#numerator }
	[toPrimitive]() { return this.#numerator / this.#denominator }
	constructor(x, denominator) {
		if (arguments.length < 1) throw new TypeError("Failed to construct 'Rational': 1 argument required, but only 0 present.")
		x = Number(x);
		if (arguments.length > 1) {
			if (!isInteger(x)) throw new TypeError("Failed to construct 'Rational': Argument 'numerator' is not an integer.");
			if (!isInteger(denominator = Number(denominator))) throw new TypeError("Failed to construct 'Rational': Argument 'denominator' is not an integer.");
			if (denominator == 0) throw new DivideByZeroError("Failed to construct 'Rational': Argument 'denominator' cannot be 0.");
			const divisor = Rational.#reduceFactor(x, denominator);
			Rational.#denominatorPositify(this, x / divisor, denominator / divisor);
		} else if (isFinite(x)) {
			denominator = 1;
			while (!isInteger(x)) {
				denominator *= 10;
				x *= 10;
			}
			const divisor = Rational.#reduceFactor(x, denominator);
			Rational.#denominatorPositify(this, x / divisor, denominator / divisor);
		} else {
			this.#numerator = x;
			this.#denominator = 1;
		}
	}
	isFinite() { return isFinite(this.#numerator) }
	static isFinite(x) { return x instanceof Rational ? isFinite(x.#numerator) : isFinite(x) }
	isInteger() { return isFinite(this.#numerator) && this.#denominator == 1 }
	static isInteger(x) { return x instanceof Rational ? isFinite(x.#numerator) && x.#denominator == 1 : isInteger(x) }
	isNaN() { return isNaN(this.#numerator) }
	static isNaN(x) { return x instanceof Rational ? isNaN(x.#numerator) : isNaN(x) }
	equals(x) {
		if (!(x instanceof Rational)) x = new Rational(x);
		return this.#numerator == x.#numerator && this.#denominator == x.#denominator;
	}
	static isEqual(x1, x2) {
		if (!(x1 instanceof Rational)) x1 = new Rational(x1);
		if (!(x2 instanceof Rational)) x2 = new Rational(x2);
		return x1.#numerator == x2.#numerator && x1.#denominator == x2.#denominator;
	}
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
	divideBy(x) {
		if (!(x instanceof Rational)) x = new Rational(x);
		if (x.#numerator == 0) throw new DivideByZeroError("Failed to execute 'divideBy' on 'Rational': Argument 'x' is 0.");
		return new Rational(this.#numerator * x.#denominator, this.#denominator * x.#numerator);
	}
	toString(decimalForm = false) { return this.#denominator == 1 ? this.#numerator.toString() : decimalForm ? (this.#numerator / this.#denominator).toString() : this.#numerator + "/" + this.#denominator }
	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: this.name,
			configurable: true
		});
	}
}
export default Rational;
export { Rational };