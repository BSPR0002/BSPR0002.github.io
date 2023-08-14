/**
 * Represent an enum with auto-incrementing numeric values or symbols as values.
 */
declare class Enum {
	/**
	 * Constructs a new Enum.
	 * @param array Array of string enum keys.
	 * @param useSymbol Whether to use Symbols instead of numbers for values. Default false.
	 */
	constructor(array: string[], useSymbol = false);

	/**
	 * Get the enum key for a given enum value.
	 * @param instance Enum instance.
	 * @param value Enum value.
	 * @returns Enum key associated with value.
	 */
	static keyOf(instance: Enum, value: number | Symbol): string | undefined;

	/**
	 * Check if a value is a member of the given enum.
	 * @param instance Enum instance.
	 * @param value Enum value.
	 */
	static isValueOf(instance: Enum, value: number | Symbol): boolean;
}
export { Enum };
export default Enum;