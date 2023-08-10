declare class PromiseAdapter {
	readonly promise: Promise<any>;
	readonly resolve: (value?: any) => void;
	readonly reject: (reason?: any) => void;
}
export {PromiseAdapter};
export default PromiseAdapter;