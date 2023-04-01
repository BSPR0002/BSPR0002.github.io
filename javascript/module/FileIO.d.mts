type readTypes = [string, string, ArrayBuffer];
const enum readableTypes { TEXT, DATA_URL, ARRAY_BUFFER };
declare function read<T = readableTypes>(file: Blob, readType: T): Promise<readTypes[T]>;
declare function save(file: Blob, saveName?: string): void;
declare function get(multiple = false): Promise<File>;
export { read, save, get, readableTypes };