type MiniWindowOptions = {
	noManualClose?: boolean,
	size?: {
		width?: string,
		height?: string
	},
	style?: MiniWindowStyleOptions
}
type MiniWindowStyleOptions = {
	backgroundColor?: string,
	textColor?: string,
	buttonBackgroundColor?: string,
	buttonHoverBackgroundColor?: string,
	buttonActiveBackgroundColor?: string,
	buttonTextColor?: string,
	buttonHoverTextColor?: string,
	buttonActiveTextColor?: string
}
type MiniWindowEventListener = ((this: MiniWindow, event: Event) => void) | null;
declare class MiniWindow extends EventTarget {
	onshow: MiniWindowEventListener;
	onshown: MiniWindowEventListener;
	onclose: MiniWindowEventListener;
	onclosed: MiniWindowEventListener;
	readonly active: boolean;
	readonly closed: boolean;
	readonly blocked: boolean;
	constructor(content: string | Node, title = "提示", options?: MiniWindowOptions);
	blockSwitch(toState?: boolean): boolean;
	close(): void;
	after(content: string | Node, title = "提示", options?: MiniWindowOptions): MiniWindow;
	alert(message: string): Promise<true>;
	confirm(message: string): Promise<boolean>;
	wait(message: string): () => void;
	static confirm(content: string | Node, title = "确认"): Promise<boolean>;
}
declare function remove(): void;
declare function reload(): void;
export default MiniWindow;
export { MiniWindow, remove, reload }