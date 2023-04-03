import { TypedArray } from "./BinaryOperate.mjs";
type readTypes = [string, string, ArrayBuffer];
type saveTypes = TypedArray | ArrayBuffer | Blob | DataView | string;
const enum readableTypes { TEXT, DATA_URL, ARRAY_BUFFER };
declare function read<T = readableTypes>(file: Blob, readType: T): Promise<readTypes[T]>;
declare function downloadSave(file: Blob, saveName?: string): void;
declare function get(options?: openFileOptions): Promise<File | File[]>;
declare function save(data: saveTypes, options?: saveFileOptions): Promise<boolean>;
declare function open(options?: openFileOptions): Promise<FileSystemFileHandle>;
declare function openDirectory(options?: openDirectoryOptions): Promise<FileSystemDirectoryHandle>;
export { get, open, openDirectory, save, downloadSave, read, readableTypes }
//dom.d.ts
type acceptType = {
	description?: string,
	accept: { [key: string]: string[] }
}
type fileOptions = {
	excludeAcceptAllOption?: boolean,
	types?: acceptType[]
}
type openFileOptions = { multiple?: boolean } & fileOptions;
type saveFileOptions = { suggestedName?: string } & fileOptions;
type openDirectoryOptions = {
	id?: string,
	mode?: "read" | "readwrite",
	startIn?: FileSystemHandle | string
}