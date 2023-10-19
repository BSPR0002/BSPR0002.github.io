const EVENT_LISTENERS: symbol = Symbol("event listeners property");
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
type ArrayHTMLNode = [
	keyof HTMLElementTagNameMap | "#comment" | "#text" | "#shadow",
	(ArrayHTMLCollection | string | boolean | number | bigint | Node)?,
	{
		style?: Partial<CSSStyleDeclaration> | string,
		class?: string[] | string,
		[EVENT_LISTENERS]?: (AddEventListenerParameters<keyof HTMLElementEventMap> | CustomEventListenerParameters)[],
		[key: string]: any
	}?,
	string?
];
type ArrayHTMLCollection = (ArrayHTMLNode | string | boolean | number | bigint | Node)[];
declare function serialize(node: Node, onlyChildren = true): ArrayHTMLCollection;
declare function parse(ArrayHTML: ArrayHTMLCollection): DocumentFragment;
declare function parseAndGetNodes(ArrayHTML: ArrayHTMLCollection): {
	documentFragment: DocumentFragment,
	nodes: { [key: string]: HTMLElementTagNameMap[keyof HTMLElementTagNameMap] | Comment | Text | ShadowRoot };
};
export { parse, serialize, parseAndGetNodes, EVENT_LISTENERS }