declare const EVENT_LISTENERS: unique symbol;
type AddEventListenerParameters<T extends keyof HTMLElementEventMap> = [
	T,
	((this: HTMLElement, event: HTMLElementEventMap[T]) => any) | EventListenerObject,
	(boolean | AddEventListenerOptions)?
];
type CustomEventListenerParameters = [
	string,
	((this: HTMLElement, event: Event) => any) | EventListenerObject,
	(boolean | AddEventListenerOptions)?
]
type ArrayHTMLElementNode = [
	keyof HTMLElementTagNameMap,
	(ArrayHTMLCollection | string | boolean | number | bigint | Node)?,
	{
		style?: Partial<CSSStyleDeclaration> | string,
		class?: string[] | string,
		[EVENT_LISTENERS]?: (AddEventListenerParameters<keyof HTMLElementEventMap> | CustomEventListenerParameters)[],
		[key: string]: any
	}?,
	string?
];
type ArrayHTMLTextNode = [
	"#comment" | "#text",
	(string | boolean | number | bigint)?,
	void?,
	string?
];
type ArrayHTMLShadowRootNode = [
	"#shadow",
	ArrayHTMLCollection | string | boolean | number | bigint | Node | void,
	ShadowRootInit,
	string?
];
type ArrayHTMLNode = ArrayHTMLElementNode | ArrayHTMLTextNode | ArrayHTMLShadowRootNode;
type ArrayHTMLCollection = (ArrayHTMLNode | string | boolean | number | bigint | Node)[];
declare function serialize(node: Node, onlyChildren?: boolean): ArrayHTMLCollection;
declare function parse(ArrayHTML: ArrayHTMLCollection): DocumentFragment;
declare function parseAndGetNodes(ArrayHTML: ArrayHTMLCollection): {
	documentFragment: DocumentFragment,
	nodes: { [key: string]: HTMLElementTagNameMap[keyof HTMLElementTagNameMap] | Comment | Text | ShadowRoot }
};
declare function parseAndGetNodes(ArrayHTML: ArrayHTMLCollection, appendTo: Node): { [key: string]: HTMLElementTagNameMap[keyof HTMLElementTagNameMap] | Comment | Text | ShadowRoot };
export { parse, serialize, parseAndGetNodes, EVENT_LISTENERS }