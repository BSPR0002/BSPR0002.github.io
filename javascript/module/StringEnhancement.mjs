const isNaN = Number.isNaN, max = Math.max;
function codePointAtByCharacter(index = 0) {
	index = Number(index);
	if (isNaN(index)) return this.codePointAt(0);
	const length = this.length;
	if ((index = Math.floor(index)) >= length || index < 0 || index > Number.MAX_SAFE_INTEGER) return undefined;
	let charIndex = 0
	for (let i = 0; i < length; ++i) {
		const codePoint = this.codePointAt(i);
		if (charIndex == index) return codePoint;
		if (codePoint > 65535) ++i;
		++charIndex;
	}
	return undefined;
}
function characterAt(position = 0) {
	position = Number(position);
	if (isNaN(position)) return String.fromCodePoint(this.codePointAt(0));
	const length = this.length;
	if ((position = Math.floor(position)) >= length || position < 0 || position > Number.MAX_SAFE_INTEGER) return "";
	let charIndex = 0
	for (let i = 0; i < length; ++i) {
		const codePoint = this.codePointAt(i);
		if (charIndex == position) return String.fromCodePoint(this.codePointAt(codePoint));
		if (codePoint > 65535) ++i;
		++charIndex;
	}
	return "";
}
function lengthByCharacter() {
	const length = this.length;
	var characters = 0;
	for (let i = 0; i < length; ++i) {
		if (this.codePointAt(i) > 65535) ++i;
		++characters;
	}
	return characters;
}
function substringByCharacter(start, end = Infinity) {
	if (arguments < 1) throw new TypeError("1 argument required, but only 0 present.");
	var characterIndex = 0, i = 0;
	start = Number(start);
	if (isNaN(start) || start < 0) start = 0;
	end = Number(end);
	if (isNaN(end) || end < 0) end = 0;
	if (end < start) {
		let temp = end;
		end = start;
		start = temp;
	}
	const length = this.length;
	if (start >= length) return "";
	while (i < length) {
		if (characterIndex == start) {
			start = characterIndex;
			break;
		}
		if (this.codePointAt(i) > 65535) ++i;
		++characterIndex;
		++i;
	}
	if (end >= length) return this.substring(start);
	while (i < length) {
		if (characterIndex == end) {
			end = characterIndex;
			break;
		}
		if (this.codePointAt(i) > 65535) ++i;
		++characterIndex;
		++i;
	}
	return this.substring(start, end);
}
function sliceByCharacter(start, end = Infinity) {
	if (arguments < 1) throw new TypeError("1 argument required, but only 0 present.");
	var characterIndex = 0, i = 0;
	start = Number(start);
	if (isNaN(start)) start = 0;
	end = Number(end);
	if (isNaN(end)) end = 0;
	const length = this.lengthByCharacter;
	if (start >= length) return "";
	if (start < 0) start = max(start + length, 0);
	if (end < 0) end = max(end + length, 0);
	if (end < start) return "";
	while (i < length) {
		if (characterIndex == start) {
			start = characterIndex;
			break;
		}
		if (this.codePointAt(i) > 65535) ++i;
		++characterIndex;
		++i;
	}
	if (end >= length) return this.substring(start);
	while (i < length) {
		if (characterIndex == end) {
			end = characterIndex;
			break;
		}
		if (this.codePointAt(i) > 65535) ++i;
		++characterIndex;
		++i;
	}
	return this.substring(start, end);
}
Object.defineProperties(String.prototype, {
	characterAt: { configurable: true, writable: true, value: characterAt },
	codePointAtByCharacter: { configurable: true, writable: true, value: codePointAtByCharacter },
	sliceByCharacter: { configurable: true, writable: true, value: sliceByCharacter },
	substringByCharacter: { configurable: true, writable: true, value: substringByCharacter },
	lengthByCharacter: { get: lengthByCharacter }
});