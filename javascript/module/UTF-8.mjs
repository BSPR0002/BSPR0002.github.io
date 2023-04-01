import {bitsOf} from "./BinaryOperate.mjs";
import BufferContext from "./BufferContext.mjs";
function getCodeBytes(headValue) {
	var bytes=0;
	for (let i=7;i>-1;--i) {
		if (!(headValue>>i)) break;
		headValue%=2**i;
		++bytes;
	}
	return bytes?(bytes==1||bytes==8?0:bytes):1;
}
function splitNumber(value) {
	const result=[];
	while (value) {
		result.unshift(value%64);
		value>>>=6;
	}
	return result
}
function splitBigInt(value) {
	const result=[];
	while (value) {
		result.unshift(Number(value%64n));
		value>>=6n;
	}
	return result
}
function encode(value) {
	if (typeof value!="number") throw new TypeError("Failed to execute 'encode': Argument 'value' is not a number.");
	if (!isFinite(value)) throw new TypeError("Failed to execute 'encode': Argument 'value' is not finite.");
	const bitsOfValue=bitsOf(value);
	if (bitsOfValue<8) {
		let result=new Uint8Array(1);
		result[0]=value;
		return result
	}
	if (bitsOfValue>36) throw new TypeError("Failed to execute 'encode': UTF-8 cannot encode values with bits greater than 36.");
	const temp=bitsOfValue>32?splitBigInt(BigInt(value)):splitNumber(value);
	if (bitsOf(temp[0])>7-temp.length) temp.unshift(0);
	const length=temp.length,result=new Uint8Array(length);
	for (let i=length-1;i>0;--i) {
		result[i]=128+temp[i];
	}
	result[0]=(2**length-1<<8-length)+temp[0];
	return result
}
function decode(data) {
	var bytes;
	switch (Object.getPrototypeOf(data)) {
		case Uint8Array.prototype:{
			let length=data.length;
			if (length>7||length<1) throw new Error("Failed to execute 'decode': Unexpected data length.");
			bytes=getCodeBytes(data[0]);
			if (bytes!=length) throw new Error("Failed to execute 'decode': Invalid code.");
			break;
		}	
		case BufferContext.prototype:{
			let temp=data.array
			if (temp instanceof Uint8Array) {
				let current=data.current;
				bytes=getCodeBytes(temp[current]);
				data=temp.subarray(current,data.current=current+bytes);
				break;
			}
		}
		default:
			throw new TypeError("Failed to execute 'decode': Argument 'data' is not a Uint8Array or a BufferContext containing a Uint8Array.");
	}
	if (bytes==1) return data[0];
	var result=0,offset=0;
	for (let i=bytes-1;i>0;--i) {
		result+=data[i]%64<<offset;
		offset+=6;
	}
	if (bytes<7) result+=data[0]%2**(7-bytes)<<offset;
	return result
}
function encodeString(string) {
	if (typeof string!="string") throw new TypeError("Failed to execute 'encodeString': Argument 'string' is not a string.");
	const temp=[];
	var resultLength=0;
	for (let i=0,length=string.length;i<length;++i) {
		let codePoint=string.codePointAt(i),item=encode(codePoint);
		temp.push(item);
		resultLength+=item.length;
		if (codePoint>65535) ++i;
	}
	const result=new Uint8Array(resultLength);
	var offset=0;
	for (let item of temp) {
		result.set(item,offset);
		offset+=item.length;
	}
	return result
}
function decodeString(data) {
	if (!(data instanceof Uint8Array)) throw new TypeError("Failed to execute 'decodeString': Argument 'data' is not a Uint8Array.");
	const context=new BufferContext(data),codePoints=[];
	while (context.hasNext) codePoints.push(decode(context));
	return String.fromCodePoint(...codePoints);
}
export {decode,encode,encodeString,decodeString}