const { sqrt, PI } = Math;
class InvalidArgumentError extends Error {
	constructor(message = "Unknown") { super(message) }
	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: this.name,
			configurable: true
		});
		this.prototype.name = this.name
	}
}
function root(value, index = 2, power = 1) {
	if (arguments.length < 1) throw new TypeError("1 argument required, but only 0 present.");
	if (typeof value != "number" || !isFinite(value)) throw new InvalidArgumentError("Argument 'value' is not a finite number.");
	if (typeof index != "number" || !isFinite(index)) throw new InvalidArgumentError("Argument 'index' is not a finite number.");
	if (typeof power != "number" || !isFinite(power)) throw new InvalidArgumentError("Argument 'power' is not a finite number.");
	if (index == 0) throw new InvalidArgumentError("Argument 'index' must not 0.");
	if (value < 0) {
		if (!Number.isInteger(index)) throw new InvalidArgumentError("Cannot evaluate the non integer index root of a negative number.");
		if (index % 2) return [-((-value) ** (power / index))];
		throw new InvalidArgumentError("Cannot evaluate the even index root of a negative number.");
	}
	const result = value ** (power / index);
	return index % 2 ? [result] : [result, -result];
}
Math.root = root;
class Circle {
	static #checkInstance(instance) { if (!(instance instanceof this)) throw new TypeError("Illegal invocation") }
	#centerX;
	#centerY;
	#radius;
	get centerX() { return this.#centerX }
	get centerY() { return this.#centerY }
	get radius() { return this.#radius }
	set centerX(value) {
		if (typeof value != "number" || !isFinite(value)) throw new TypeError("Failed to set property 'centerX' to 'Circle': The value is not a finite number.");
		this.#centerX = value;
	}
	set centerY(value) {
		if (typeof value != "number" || !isFinite(value)) throw new TypeError("Failed to set property 'centerY' to 'Circle': The value is not a finite number.");
		this.#centerY = value;
	}
	set radius(value) {
		if (typeof value != "number" || !isFinite(value)) throw new TypeError("Failed to set property 'radius' to 'Circle': The value is not a finite number.");
		if (value == 0) throw new TypeError("Failed to set property 'radius' for 'Circle': The radius cannot be 0.");
		this.#radius = value;
	}
	constructor(centerX = 0, centerY = 0, radius = 1) {
		if (typeof centerX != "number" || !isFinite(centerX)) throw new TypeError("Failed to construct 'Circle': Argument 'centerX' is not a finite number.");
		this.#centerX = centerX;
		if (typeof centerY != "number" || !isFinite(centerY)) throw new TypeError("Failed to construct 'Circle': Argument 'centerY' is not a finite number.");
		this.#centerY = centerY;
		if (typeof radius != "number" || !isFinite(radius)) throw new TypeError("Failed to construct 'Circle': Argument 'radius' is not a finite number.");
		if (radius == 0) throw new TypeError("Failed to construct 'Circle': The radius cannot be 0.");
		this.#radius = radius;
	}
	getExpression() {
		const centerX = this.#centerX, centerY = this.#centerY;
		return `${centerX == 0 ? "x²" : `(x ${centerX < 0 ? "+ " + centerX : "- " + centerX})²`} + ${centerY == 0 ? "y²" : `(y ${centerY < 0 ? "+ " + centerY : "- " + centerY})²`} = ${this.#radius ** 2}`;
	}
	getDiameter() { return this.#radius * 2 }
	getPerimeter() { return 2 * PI * this.#radius }
	getAera() { return PI * this.#radius ** 2 }
	intersectionsWith(circle) {
		Circle.#checkInstance(this);
		if (arguments.length < 1) throw new TypeError("Failed to execute 'intersectionsWith' on 'Circle': 1 argument required, but only 0 present.");
		if (!(circle instanceof Circle)) throw new TypeError("Failed to execute 'intersectionsWith' on 'Circle': Argument 'circle' is not type of 'Circle'.");
		//x : -((2*d-2*b)*y+f**2-d**2-c**2+b**2+a**2-e**2)/(2*c-2*a)
		//y : -((2*c-2*a)*x+f**2-d**2-c**2+b**2+a**2-e**2)/(2*d-2*b)
		const a = this.#centerX, b = this.#centerY, c = circle.#centerX, d = circle.#centerY, e = this.#radius, f = circle.#radius;
		if (b == d) {
			const resultY1 = -((c - a) * sqrt(-(f ** 4) + (2 * d ** 2 - 4 * b * d + 2 * c ** 2 - 4 * a * c + 2 * b ** 2 + 2 * a ** 2 + 2 * e ** 2) * f ** 2 - d ** 4 + 4 * b * d ** 3 + ((-2 * c ** 2) + 4 * a * c - 6 * b ** 2 - 2 * a ** 2 + 2 * e ** 2) * d ** 2 + (4 * b * c ** 2 - 8 * a * b * c + 4 * b ** 3 + (4 * a ** 2 - 4 * e ** 2) * b) * d - c ** 4 + 4 * a * c ** 3 + ((-2 * b ** 2) - 6 * a ** 2 + 2 * e ** 2) * c ** 2 + (4 * a * b ** 2 + 4 * a ** 3 - 4 * e ** 2 * a) * c - b ** 4 + (2 * e ** 2 - 2 * a ** 2) * b ** 2 - a ** 4 + 2 * e ** 2 * a ** 2 - e ** 4) + (d - b) * f ** 2 - d ** 3 + b * d ** 2 + (-(c ** 2) + 2 * a * c + b ** 2 - a ** 2 - e ** 2) * d - b * c ** 2 + 2 * a * b * c - b ** 3 + (e ** 2 - a ** 2) * b) / (2 * d ** 2 - 4 * b * d + 2 * c ** 2 - 4 * a * c + 2 * b ** 2 + 2 * a ** 2);
			if (isNaN(resultY1)) return [];
			const resultY2 = ((c - a) * sqrt(-(f ** 4) + (2 * d ** 2 - 4 * b * d + 2 * c ** 2 - 4 * a * c + 2 * b ** 2 + 2 * a ** 2 + 2 * e ** 2) * f ** 2 - d ** 4 + 4 * b * d ** 3 + ((-2 * c ** 2) + 4 * a * c - 6 * b ** 2 - 2 * a ** 2 + 2 * e ** 2) * d ** 2 + (4 * b * c ** 2 - 8 * a * b * c + 4 * b ** 3 + (4 * a ** 2 - 4 * e ** 2) * b) * d - c ** 4 + 4 * a * c ** 3 + ((-2 * b ** 2) - 6 * a ** 2 + 2 * e ** 2) * c ** 2 + (4 * a * b ** 2 + 4 * a ** 3 - 4 * e ** 2 * a) * c - b ** 4 + (2 * e ** 2 - 2 * a ** 2) * b ** 2 - a ** 4 + 2 * e ** 2 * a ** 2 - e ** 4) + (b - d) * f ** 2 + d ** 3 - b * d ** 2 + (c ** 2 - 2 * a * c - b ** 2 + a ** 2 + e ** 2) * d + b * c ** 2 - 2 * a * b * c + b ** 3 + (a ** 2 - e ** 2) * b) / (2 * d ** 2 - 4 * b * d + 2 * c ** 2 - 4 * a * c + 2 * b ** 2 + 2 * a ** 2),
				resultX = -((2 * d - 2 * b) * resultY1 + f ** 2 - d ** 2 - c ** 2 + b ** 2 + a ** 2 - e ** 2) / (2 * c - 2 * a);
			return resultY1 == resultY2 ? [new Point(resultX, resultY1)] : [new Point(resultX, resultY1), new Point(resultX, resultY2)];
		}
		const resultX1 = -((d - b) * sqrt(-(f ** 4) + (2 * d ** 2 - 4 * b * d + 2 * c ** 2 - 4 * a * c + 2 * b ** 2 + 2 * a ** 2 + 2 * e ** 2) * f ** 2 - d ** 4 + 4 * b * d ** 3 + ((-2 * c ** 2) + 4 * a * c - 6 * b ** 2 - 2 * a ** 2 + 2 * e ** 2) * d ** 2 + (4 * b * c ** 2 - 8 * a * b * c + 4 * b ** 3 + (4 * a ** 2 - 4 * e ** 2) * b) * d - c ** 4 + 4 * a * c ** 3 + ((-2 * b ** 2) - 6 * a ** 2 + 2 * e ** 2) * c ** 2 + (4 * a * b ** 2 + 4 * a ** 3 - 4 * e ** 2 * a) * c - b ** 4 + (2 * e ** 2 - 2 * a ** 2) * b ** 2 - a ** 4 + 2 * e ** 2 * a ** 2 - e ** 4) + (c - a) * f ** 2 + ((-c) - a) * d ** 2 + (2 * b * c + 2 * a * b) * d - c ** 3 + a * c ** 2 + (-(b ** 2) + a ** 2 - e ** 2) * c - a * b ** 2 - a ** 3 + e ** 2 * a) / (2 * d ** 2 - 4 * b * d + 2 * c ** 2 - 4 * a * c + 2 * b ** 2 + 2 * a ** 2);
		if (isNaN(resultX1)) return [];
		const resultX2 = ((d - b) * sqrt(-(f ** 4) + (2 * d ** 2 - 4 * b * d + 2 * c ** 2 - 4 * a * c + 2 * b ** 2 + 2 * a ** 2 + 2 * e ** 2) * f ** 2 - d ** 4 + 4 * b * d ** 3 + ((-2 * c ** 2) + 4 * a * c - 6 * b ** 2 - 2 * a ** 2 + 2 * e ** 2) * d ** 2 + (4 * b * c ** 2 - 8 * a * b * c + 4 * b ** 3 + (4 * a ** 2 - 4 * e ** 2) * b) * d - c ** 4 + 4 * a * c ** 3 + ((-2 * b ** 2) - 6 * a ** 2 + 2 * e ** 2) * c ** 2 + (4 * a * b ** 2 + 4 * a ** 3 - 4 * e ** 2 * a) * c - b ** 4 + (2 * e ** 2 - 2 * a ** 2) * b ** 2 - a ** 4 + 2 * e ** 2 * a ** 2 - e ** 4) + (a - c) * f ** 2 + (c + a) * d ** 2 + ((-2 * b * c) - 2 * a * b) * d + c ** 3 - a * c ** 2 + (b ** 2 - a ** 2 + e ** 2) * c + a * b ** 2 + a ** 3 - e ** 2 * a) / (2 * d ** 2 - 4 * b * d + 2 * c ** 2 - 4 * a * c + 2 * b ** 2 + 2 * a ** 2),
			resultY1 = -((2 * c - 2 * a) * resultX1 + f ** 2 - d ** 2 - c ** 2 + b ** 2 + a ** 2 - e ** 2) / (2 * d - 2 * b);
		return resultX1 == resultX2 ? [new Point(resultX1, resultY1)] : [new Point(resultX1, resultY1), new Point(resultX2, -((2 * c - 2 * a) * resultX2 + f ** 2 - d ** 2 - c ** 2 + b ** 2 + a ** 2 - e ** 2) / (2 * d - 2 * b))];
	}
	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: this.name,
			configurable: true
		});
	}
}
class Point {
	#x;
	#y;
	get x() { return this.#x }
	get y() { return this.#y }
	set x(value) {
		if (typeof value != "number" || !isFinite(value)) throw new TypeError("Failed to set property 'x' to 'Point': The value is not a finite number.");
		this.#x = value;
	}
	set y(value) {
		if (typeof value != "number" || !isFinite(value)) throw new TypeError("Failed to set property 'y' to 'Point': The value is not a finite number.");
		this.#y = value;
	}
	constructor(x = 0, y = 0) {
		if (typeof x != "number" || !isFinite(x)) throw new TypeError("Failed to construct 'Point': Argument 'x' is not a finite number.");
		this.#x = x;
		if (typeof y != "number" || !isFinite(y)) throw new TypeError("Failed to construct 'Point': Argument 'y' is not a finite number.");
		this.#y = y;
	}
	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: this.name,
			configurable: true
		});
	}
	static #checkInstance(instance) { if (!(instance instanceof this)) throw new TypeError("Illegal invocation") }
	equals(point) {
		Point.#checkInstance(this)
		if (!(point instanceof Point)) return false;
		if (this == point) return true;
		return this.#x == point.#x && this.#y == point.#y;
	}
}
export { root, InvalidArgumentError, Circle, Point }