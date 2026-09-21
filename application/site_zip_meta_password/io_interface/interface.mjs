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
	 * @param {string} [saveName]
	 * @return {Promise<void>}
	 */
	save(saveName) { throw new TypeError("Non-implemented.") }
	close() { throw new TypeError("Non-implemented.") }
	/**
	 * @return {Promise<IOInterface>}
	 */
	static getInstance() { throw new TypeError("Non-implemented.") }
}

export default IOInterface;