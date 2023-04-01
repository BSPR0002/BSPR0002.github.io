import {splitBytes,littleEndianToNumber,bigEndianToNumber,numberToLittleEndian,numberToBigEndian,TypedArray} from "./BinaryOperate.mjs";
import Enum from "./Enum.mjs";
import {decodeString,encodeString} from "./UTF-8.mjs";
const VENDOR=Symbol("VENDOR"),RESERVED_METADATA_BLOCK_TYPE=Symbol("reserved metadata block type"),metadataBlockTypes=new Enum(
	["STREAMINFO","PADDING","APPLICATION","SEEKTABLE","VORBIS_COMMENT","CUESHEET","PICTURE",RESERVED_METADATA_BLOCK_TYPE], {
		valueOf(target,key) {
			if (key<0||key>126) throw new Error("Invalid metadata block type.");
			return key>7?RESERVED_METADATA_BLOCK_TYPE:target.valueOf(key);
		}
	}
);
function allMetadataBlock(data,context=null) {
	var result=[];
	var last=false,currentIndex=4;
	while (!last) {
		let start=currentIndex,temp=splitBytes(data.subarray(currentIndex,++currentIndex),[1,7]),length=bigEndianToNumber(data.subarray(currentIndex,currentIndex+=3));
		last=Boolean(temp[0]);
		result.push({
			start,
			type:temp[1],
			typeName:metadataBlockTypes.customValueOf(temp[1]),
			data:data.subarray(currentIndex,currentIndex+=length),
			end:currentIndex
		});
	}
	if (context) context.metadataBlockEnd=currentIndex;
	return result
}
function decodeVorbisComment(data) {
	var index=4,result={
		[VENDOR]:decodeString(data.subarray(index,index+=littleEndianToNumber(data.subarray(0,4))))
	};
	for (let i=0,l=littleEndianToNumber(data.subarray(index,index+=4));i<l;++i) {
		let temp=littleEndianToNumber(data.subarray(index,index+=4));
		temp=decodeString(data.subarray(index,index+=temp))
		let edge=temp.indexOf("="),tag=temp.substring(0,edge),string=temp.substring(edge+1);
		if (tag in result) {
			let value=result[tag];
			if (typeof value=="string") {result[tag]=[value,string]} else {value.push(string)}
		} else result[tag]=string;
	}
	return result
}
function encodeVorbisComment(tags) {
	const vendor=encodeString(VENDOR in tags?tags[VENDOR]:"BSIF.FLAC.encodeVorbisComment"),temp=[];
	var n=0;
	for (let key in tags) {
		if (key==VENDOR) continue;
		let data=encodeString(`${key}=${tags[key]}`),length=numberToLittleEndian(data.length,4);
		temp.push(length,data);
		++n;
	}
	temp.unshift(numberToLittleEndian(vendor.length,4),vendor,numberToLittleEndian(n,4))
	return new Blob(temp)
}
function encodeMetadataBlockHeader(data,type,isLast) {
	var length=-1;
	if (data instanceof TypedArray||data instanceof ArrayBuffer) {length=data.byteLength} else if (data instanceof Blob) length=data.size;
	if (typeof type=="string") type=metadataBlockTypes.indexOf(type);
	const header=new Uint8Array(4);
	if (isLast) header[0]=128
	header[0]+=metadataBlockTypes.hasIndex(type)?type:7;
	header.set(numberToBigEndian(length,3),1);
	return header
}
export {allMetadataBlock,decodeVorbisComment,encodeVorbisComment,encodeMetadataBlockHeader}