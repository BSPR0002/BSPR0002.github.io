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
declare function encode(node: Node, onlyChildren = true): ArrayHTMLCollection;
declare function decode(ArrayHTML: ArrayHTMLCollection): DocumentFragment;
declare function decodeAndGetNodes(ArrayHTML: ArrayHTMLCollection): {
	documentFragment: DocumentFragment,
	nodes: { [key: string]: HTMLElementTagNameMap[keyof HTMLElementTagNameMap] | Comment | Text | ShadowRoot };
};
export { decode, encode, decodeAndGetNodes }