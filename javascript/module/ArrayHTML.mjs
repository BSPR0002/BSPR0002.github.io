function decodeCollection(data,outer,collector) {
	if (!Array.isArray(data)) throw new TypeError("Decode error: Detected non-Array object");
	for (let item of data) {
		switch (typeof item) {
			case "string":
			case "number":
			case "bigint":
			case "boolean":
				outer.appendChild(document.createTextNode(item));
				break;
			case "object":
				if (!item) break;
				if (item instanceof Node) {
					outer.appendChild(item);
					break;
				}
				decodeNode(item,outer,collector)
			default:
		}
	}
}
function decodeStyleObject(node,object) {
	const styleObject=node.style;
	for (let index in object) styleObject[index]=[object[index]];
}
function decodeAttribute(node,attributeName,data) {
	switch (attributeName) {
		case "style":
			if (data instanceof Object) {
				decodeStyleObject(node,data);
				return;
			}
			break;
		case "class":
			node.setAttribute("class",Array.isArray(data)?data.join(" "):data);
			return;
		default:
	}
	node.setAttribute(attributeName,data)
}
function decodeContent(node,content,collector) {
	switch (typeof content) {
		case "string":
		case "number":
		case "bigint":
		case "boolean":
			node.innerText=content;
			return;
		case "object":
			if (!content) return;
			if (content instanceof Node) {
				node.appendChild(content);
				return;
			}
			try {decodeCollection(content,node,collector)} catch(error){console.warn(error)}
		default:
	}
}
function decodeNode(data,outer,collector) {
	if (!Array.isArray(data)) throw new TypeError("Decode error: Detected non-Array object");
	var content=data[1],node;
	switch (data[0]) {
		case "#comment":
			outer.appendChild(node=document.createComment(content));
			break;
		case "#text":
			outer.appendChild(node=document.createTextNode(content));
			break;
		case "#shadow":
			try {
				if (!(outer instanceof Element)) throw new TypeError("Container is not an Element.")
				node=outer.attachShadow(data[2])
			} catch(error) {
				console.warn("Decode error: Failed to attach shadow DOM\n",data,"\non",outer,`\n${error.name}: ${error.message}`);
				return;
			}
			decodeContent(node,content,collector);
			break;
		default:
			outer.appendChild(node=document.createElement(data[0]));
			if (data[2] instanceof Object) {
				for (let attribute in data[2]) try {decodeAttribute(node,attribute,data[2][attribute])} catch (error) {console.warn("Decode error: Failed to set attribute",attribute,"to",data[2][attribute],"on",node,`\n${error.name}: ${error.message}`)}
			}
			decodeContent(node,content,collector);
	}
	if (collector&&(3 in data)) collector[data[3]]=node;
}
function decode(ArrayHTML) {
	const documentFragment=document.createDocumentFragment();
	decodeCollection(ArrayHTML,documentFragment);
	return documentFragment;
}
function decodeAndGetNodes(ArrayHTML) {
	const nodes={},documentFragment=document.createDocumentFragment();
	decodeCollection(ArrayHTML,documentFragment,nodes);
	return {documentFragment,nodes};
}
function encodeIterator(node,outer) {
	if (node.nodeName=="#text") {
		outer.push(node.textContent);
	} else {
		for (let child of node.childNodes) {encodeNode(child,outer)}
	}
}
function encodeNode(node,outer){
	switch (node.nodeName) {
		case "#text":
			outer.push(node.textContent);
			break;
		case "#comment":
			outer.push(["#comment",node.textContent]);
			break;
		case "#document":
			encodeIterator(node,outer);
		case "html":
			break;
		default:
			let child=[node.nodeName];
			try {
				if (node.hasAttributes()) {
					child[2]={};
					for (let attribute of node.attributes) {
						child[2][attribute.name]=attribute.value;
					}
				}
			} catch(error) {console.warn("Encode exception: Failed to get attributes of node",node)}
			if (node.hasChildNodes()) {
				encodeIterator(node,child[1]=[]);
			}
			outer.push(child);
	}
}
function encode(node,onlyChildren=true) {
	if (!(node instanceof Node)) throw new TypeError("Encode failed: Argument 'node' is not type of Node");
	const ArrayHtml=[];
	if (onlyChildren) {encodeIterator(node,ArrayHtml)} else {encodeNode(node,ArrayHtml)}
	return ArrayHtml;
}
export {decode,encode,decodeAndGetNodes}