/**
 * @typedef {import("/javascript/module/binary_operate.mjs").TypedArray} TypedArray
 */

class IOInterface {
	/**
	 * @param {number} start
	 * @param {number} [length]
	 * @return {Promise<Uint8Array>}
	 */
	read(start, length) { throw new TypeError("Non-implemented.") }
	/**
	 * @param {string|Blob|ArrayBuffer|TypedArray} content
	 * @param {number} [offset]
	 * @return {Promise<void>}
	 */
	write(content, offset) { throw new TypeError("Non-implemented.") }
	/**
	 * @param {number} size
	 * @return {Promise<void>}
	 */
	truncate(size) { throw new TypeError("Non-implemented.") }
	/**
	 * @return {Promise<void>}
	 */
	save() { throw new TypeError("Non-implemented.") }
	close() { throw new TypeError("Non-implemented.") }
	/** @return {number} */
	get originalSize() { throw new TypeError("Non-implemented.") }
	/** @return {string} */
	get fileName() { throw new TypeError("Non-implemented.") }
	/**
	 * @param {boolean} [writable]
	 * @return {Promise<IOInterface>}
	 */
	static getInstance(writable) { throw new TypeError("Non-implemented.") }
}

export default IOInterface;