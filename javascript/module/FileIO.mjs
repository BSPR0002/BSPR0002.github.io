const readableTypes=Object.freeze({TEXT:0,DATA_URL:1,ARRAY_BUFFER:2}),readFunctions=[
	FileReader.prototype.readAsText,
	FileReader.prototype.readAsDataURL,
	FileReader.prototype.readAsArrayBuffer
];
function read(file,readType){
	if (arguments.length<2) throw new TypeError("Failed to execute 'read': 2 arguments required, but only "+arguments.length+" present.");
	if (!(file instanceof Blob)) throw new TypeError("Failed to execute 'read': Argument 'file' is not a binary object.");
	if (!(readType in readFunctions)) throw new Error("Failed to execute 'read': Argument 'readtype' is not one of FileIO.readableTypes.");
	return new Promise(function(resolve){
		var Operator=new FileReader;
		Operator.addEventListener("load",function(){resolve(Operator.result)});
		readFunctions[readType].apply(Operator,[file]);
	});
}
async function save(file,saveName){
	const objectURL=URL.createObjectURL(file),address=document.createElement("a");
	address.href=objectURL;
	address.download=typeof saveName=="string"?saveName:"";
	address.dispatchEvent(new MouseEvent("click"));
	URL.revokeObjectURL(objectURL);
}
function get(multiple=false) {
	return new Promise(function(resolve){
		var input=document.createElement("input");
		input.type="file";
		input.multiple=multiple;
		input.addEventListener("change",function(){resolve(multiple?this.files:this.files[0])},{once:true});
		input.dispatchEvent(new MouseEvent("click"));
	});
}
export {read,save,get,readableTypes}