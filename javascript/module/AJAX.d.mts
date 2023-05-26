type statusCallback<R extends XMLHttpRequest> = (this: R, status: number) => void;
type eventCallback<R extends XMLHttpRequest> = (this: R, event: ProgressEvent) => void;
type responseCallback<R extends XMLHttpRequest> = (this: R, response: any) => void;
type failedCallback = statusCallback | eventCallback;
type sendType = XMLHttpRequestBodyInit | HTMLFormElement | Object | any;
type AJAXOptions = {
	url: string | URL,
	method?: string,
	async?: boolean,
	username?: string,
	password?: string,
	success?: responseCallback,
	fail?: statusCallback,
	done?: statusCallback,
	error?: eventCallback,
	abort?: eventCallback,
	type?: XMLHttpRequestResponseType,
	data?: sendType,
	timeout?: number,
	cache?: boolean,
	noSend?: boolean
};
type subLoads = {
	selector: string,
	loader: (element: HTMLElement, allowCache: boolean, abortHandlerSetter: (abortHandler: () => void) => void) => Promise<any>,
	processor: (element: HTMLElement, response: any) => void
};
declare class LoadRequest extends XMLHttpRequest {
	readonly responseType: "document-fragment";
	readonly responseText: never;
	readonly responseXML: never;
	readonly response: DocumentFragment | null;
	open(method: string, url: string | URL, username?: string | null, password?: string | null): void;
	readonly static subLoads: subLoads[];
}
/**
 * 发送 AJAX 请求
 */
declare function ajax(options: AJAXOptions): XMLHttpRequest;
/**
 * 以 GET 方式发送 AJAX 请求，并以 JSON 形式获取回复
 * @param url 请求 URL
 * @param callback 成功回调
 * @param allowCache 是否允许使用浏览器缓存
 * @param fail 失败回调
 */
declare function getJSON(url: AJAXOptions["url"], callback: responseCallback, allowCache = true, fail?: failedCallback): XMLHttpRequest;
/**
 * 以 GET 方式发送 AJAX 请求，并以 XML 形式获取回复
 * @param url 请求 URL
 * @param callback 成功回调
 * @param allowCache 是否允许使用浏览器缓存
 * @param fail 失败回调
 */
declare function getXML(url: AJAXOptions["url"], callback: responseCallback, allowCache = true, fail?: failedCallback): XMLHttpRequest;
/**
 * 以 POST 方式发送 AJAX 请求，并以 JSON 形式获取回复
 * @param url 请求 URL
 * @param data 需要发送的数据
 * @param callback 成功回调
 * @param fail 失败回调
 */
declare function postJSON(url: AJAXOptions["url"], data: sendType, callback: responseCallback, fail?: failedCallback): XMLHttpRequest;
/**
 * 以 GET 方式发送 AJAX 请求，并将回复解析为 DOM 然后替换到指定元素中
 * @param url 请求 URL
 * @param targetElement 目标元素
 * @param allowCache 是否允许使用浏览器缓存
 * @param preloadResource 是否预加载 DOM 中的某些资源
 * @param success 成功回调
 * @param fail 失败回调
 */
declare function load(
	url: AJAXOptions["url"],
	targetElement: HTMLElement,
	allowCache = true,
	preloadResource = true,
	success?: statusCallback,
	fail?: failedCallback
): LoadRequest | XMLHttpRequest;
export { ajax, getJSON, getXML, load, postJSON }