type ArrayHTMLNode = [
	keyof HTMLElementTagNameMap | "#comment" | "#text" | "#shadow",
	(ArrayHTMLCollection | string | boolean | number | bigint | Node)?,
	{
		[key: string]: string | any,
		style?: { [key in keyof CSSStyleDeclaration]: string } | string,
		class?: string[] | string
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
export { parse, serialize, parseAndGetNodes }