type ArrayHTMLNode = [
	keyof HTMLElementTagNameMap | "#comment" | "#text" | "#shadow",
	(ArrayHTMLCollection | string | boolean | number | bigint | Node)?,
	{
		[key: string]: string,
		style: CSSStyleDeclaration | string,
		class: string[] | string
	}?,
	string?
];
type ArrayHTMLCollection = (ArrayHTMLNode | string | boolean | number | bigint | Node)[];
declare function encode(node: Node, onlyChildren = true): ArrayHTMLCollection;
declare function decode(ArrayHTML: ArrayHTMLCollection): DocumentFragment;
declare function decodeAndGetNodes(ArrayHTML: ArrayHTMLCollection): {
	documentFragment: DocumentFragment,
	nodes: { [key: string]: HTMLElement };
};
export { decode, encode, decodeAndGetNodes }