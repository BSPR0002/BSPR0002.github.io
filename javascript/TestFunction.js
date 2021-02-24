class DecimalNumber {
	get [Symbol.toStringTag](){return "DecimalNumber"}
	static #LIMIT=1;
	static get LIMIT(){return this.#LIMIT}
	static set LIMIT(value){this.#LIMIT=Boolean(value)}
	#sign=false;
	#integer=0n;
	#mantissa=new Uint8Array(64);
	#notNumber=false;
	get sign(){return this.#sign}
	get integer(){return this.#integer}
	get mantissa(){return new Uint8Array(this.#mantissa)}
	constructor(initial=undefined) {
		switch (typeof initial) {
			case "object":
				if (initial===null) break;
				if (initial instanceof this.constructor) {
					this.#sign=initial.#sign;
					this.#integer=initial.#integer;
					this.#mantissa=new Uint8Array(initial.#mantissa);
					break;
				};
			case "string":	
			case "number":
				if (!isFinite(initial)) {
					this.#notNumber=true;
					break
				}
				if (initial==0) break;
				let translate=initial.toString().split(".");
				let integer=BigInt(translate[0]);
				this.#integer=(this.#sign=initial<0)?-integer:integer;
				if (translate[1]) {
					let temp=translate[1],length=temp.length>64?65:temp.length,mantissa=this.#mantissa;
					for (let i=0,l=(length>63?64:length);i<l;++i) mantissa[i]=parseInt(temp[i]);
				}
				break;
			case "bigint":
				this.#integer=initial;
				break;
			case "boolean":
				if (initial) this.#integer=1n;
			default:
		}
	}
	#actualPoint() {
		var array=this.#mantissa;
		for (var i=63;i>-1;--i) if (array[i]!=0) break;
		return i+1
	}
	#limit() {
		var mantissa=this.#mantissa,skip=false,before=mantissa[0];
		for (let i=1;i<62;++i) {
			if (mantissa[i]!=before) {
				skip=true;
				break
			}
		}
		if (skip) return;
		switch (before) {
			case 0:
				if (mantissa[63]==1&&this.constructor.#LIMIT) mantissa[63]=0;
				break;
			case 9:
				if (mantissa[63]==9) {
					this.#mantissa=new Uint8Array(64);
					++this.#integer;
				}
			default:
		}
	}
	toString() {
		if (this.#notNumber) return "NaN";
		var fixed=new this.constructor(this);
		fixed.#limit();
		var integer=fixed.#integer;
		var mantissa=fixed.#mantissa.slice(0,this.#actualPoint()).join("");
		return (fixed.#sign&&(integer||mantissa)?"-":"")+(mantissa?integer+"."+mantissa:integer)
	}
	isGreater(compare) {
		compare=new this.constructor(compare);
		if (this.#notNumber||compare.#notNumber) return false;
		if (this.#sign<compare.#sign) return true;
		var translate=x=>this.#sign?!x:x;
		var intGreater=this.#integer>compare.#integer;
		if (this.#integer!=compare.#integer) return translate(intGreater);
		for (let selfMantissa=this.#mantissa,compareMantissa=compare.#mantissa,i=0;i<64;++i) {
			if (selfMantissa[i]>compareMantissa[i]) return translate(true);
			if (selfMantissa[i]<compareMantissa[i]) return translate(false);
		}
		return false
	}
	isEqual(compare) {
		compare=new this.constructor(compare);
		if (this.#notNumber||compare.#notNumber) return false;
		for (let selfMantissa=this.#mantissa,compareMantissa=compare.#mantissa,i=0;i<64;++i) if (selfMantissa[i]!=compareMantissa[i]) return false;
		if (this.#sign==compare.#sign&&this.#integer==compare.#integer) return true;
		return false;
	}
	isNaN(){return this.#notNumber}
	add(addend) {
		var result=new this.constructor(this)
		addend=new this.constructor(addend);
		if (this.#notNumber||addend.#notNumber) {
			result.#notNumber=true;
			return result
		}
		var sub=this.#sign!=addend.#sign,last=0;
		var operandOne=1,operandTen=-10,carry=x=>x>9;
		if (sub) {
			if (addend.#sign=!addend.#sign?addend.isGreater(this):this.isGreater(addend)) {
				let temp=result;
				result=addend,addend=temp,result.#sign=!result.#sign;
			}
			addend.#integer=-addend.#integer,addend.#mantissa=new Int8Array(addend.#mantissa);
			for (let i=0;i<64;++i) addend.#mantissa[i]=-addend.#mantissa[i];
			operandOne=-1,operandTen=10,carry=x=>x<0;
		}
		result.#integer+=addend.#integer;
		var resultMantissa=result.#mantissa,addendMantissa=addend.#mantissa;
		for (let i=63;i>-1;--i) {
			let calc=resultMantissa[i]+addendMantissa[i]+last;
			if (carry(calc)) {
				calc+=operandTen;
				last=operandOne;
			} else last=0;
			resultMantissa[i]=calc;
		}
		if (last) result.#integer+=operandOne;
		result.#limit();
		return result
	}
	sub(subtrahend) {
		subtrahend=new this.constructor(subtrahend);
		subtrahend.#sign=!subtrahend.#sign;
		return this.add(subtrahend)
	}
	multiply(multiplier) {
		multiplier=new this.constructor(multiplier);
		var self=new this.constructor(this),result=new this.constructor;
		if (self.#notNumber||multiplier.#notNumber) {
			result.#notNumber=true;
			return result
		}
		result.#sign=Boolean(self.#sign^multiplier.#sign);
		var mantissaBits=0,bits1=self.#actualPoint(),bits2=multiplier.#actualPoint(),operand1=BigInt(self.#integer+self.#mantissa.slice(0,bits1).join("")),operand2=BigInt(multiplier.#integer+multiplier.#mantissa.slice(0,bits2).join(""));
		mantissaBits+=bits1+bits2;
		var temp1=String(operand1*operand2),length1=temp1.length,temp2=temp1.substring(length1-mantissaBits),length2=temp2.length;
		if (length1>mantissaBits) result.#integer=BigInt(temp1.substring(0,length1-mantissaBits));
		if (length2+64>mantissaBits) {
			while (temp2.length<mantissaBits) temp2="0"+temp2;
			for (let i=0,l=temp2.length<64?temp2.length:64,mantissa=result.#mantissa;i<l;++i) mantissa[i]=+temp2[i];
		}
		result.#limit()
		return result
	}
	divide(divisor) {
		divisor=new this.constructor(divisor);
		var self=new this.constructor(this),result=new this.constructor;
		if (self.#notNumber||!(+divisor)) {
			result.#notNumber=true;
			return result
		}
		result.#sign=Boolean(self.#sign^divisor.#sign);
		var bits1=self.#actualPoint(),bits2=divisor.#actualPoint(),move=String(self.#integer).length+bits2,temp="",operand1=self.#integer+self.#mantissa.join(""),operand2=BigInt(divisor.#integer+divisor.#mantissa.slice(0,bits2).join(""));
		for (let i=-String(self.#integer).length,temp1="";i<64;++i) {
			temp1+=operand1.substring(0,1);
			operand1=operand1.substring(1);
			let temp2=BigInt(temp1),temp3=temp2/operand2;
			temp+=temp3;
			if (temp3) temp1=String(temp2%operand2);
			if (!(+temp1||+operand1)) break;
		}
		while (temp.length<move) temp+="0";
		result.#integer=BigInt(temp.substring(0,move))
		for (let temp1=temp.substring(move),l=temp1.length,i=0;i<l;i++) result.#mantissa[i]=+temp1[i];
		result.#limit()
		return result
	}
	static notNumber() {
		var temp=new this;
		temp.#notNumber=true;
		return temp
	}
	static fromData(integer,sign=null,mantissa=null) {
		var result=new this,mantissaZero=true;
		if (typeof integer!="bigint") throw new TypeError("Failed to construct DecimalNumber from data: Argument 'integer' is not a BigInt.");
		if (integer<0) throw new TypeError("Failed to construct DecimalNumber from data: The integer part cannot be negative.");
		result.#integer=integer;
		if (sign!=null) {
			if (typeof sign!="boolean") throw new TypeError("Failed to construct DecimalNumber from data: Argument 'sign' is not a boolean.");
			result.#sign=sign;
		}
		if (mantissa!=null) {
			if (!(mantissa instanceof Uint8Array)) throw new TypeError("Failed to construct DecimalNumber from data: Argument 'mantissa' is not a Uint8Array.");
			result.#mantissa=new Uint8Array(64);
			let length=mantissa.length;
			for (let i=0,l=length>63?64:length;i<l;++i) {
				if (mantissa[i]>9) throw new TypeError("Failed to construct DecimalNumber from data: One of the mantissa is greater than 9.[at mantissa["+i+"]]");
				if (result.#mantissa=mantissa[i]) mantissaZero=false;
			}
		}
		if (!result.integer&&mantissaZero) result.#sign=false;
		result.#limit()
		return result
	}
}

class WebAudioPlayer {
	#node=document.createElement("audio");
	get node(){return this.#node}
	#localSrc=null;
	constructor(file=null,playImmediately=false,loop=false){
		switch (typeof file) {
			case "object":
				if (file instanceof Blob) {
					let address=this.#localSrc=URL.createObjectURL(file);
					this.#node.src=address;
				}
			default:
				break;
			case "string":
				this.#node.src=file;
		}
		if (playImmediately) this.#node.play();
		if (loop) this.#node.loop=true;
	}
	get position(){return this.#node.currentTime}
	set position(value){return this.#node.currentTime=value}
	showElement(targetElement) {
		if (!(targetElement instanceof HTMLElement)) throw new Error("Failed to execute 'showElement' on WebAudioPlayer: Argument 'targetElement' is not a HTMLElement.");
		this.node.controls=true;
		targetElement.appendChild(this.#node)
	}
}

class randomStatistician {
	#data=(new Array(10)).fill(0n);
	get data(){return this.#data.concat()}
	record(number) {
		number=Number(number);
		if (number<0||number>=1) throw new Error("Input out of range.");
		++this.#data[Math.floor(number*10)]
	}
	reset(){this.#data=(new Array(10)).fill(0n)}
	analyze(){
		var total=0n,result="",i=0;
		for (let item of this.#data) total+=item;
		var result=[["total",total.toString()]];
		while (i<10) {
			let starting=i/10,subscript=i++,quantity=this.#data[subscript];
			result.push(["["+starting+","+i/10+")",quantity.toString(),(total==0?"0":Number(quantity)*100/+Number(total))+"%"]);
		}
		return result
	}
}

BytesOperate={
	[Symbol.toStringTag]:"BytesOperate",
	getBits:byteReader,
	littleEndianNumber,
	bigEndianNumber,
	numberToLittleEndian:function numberToLittleEndian(value,size) {
		var temp=Array.from(value.toString(16)),result=new Uint8Array(size);
		for (let i=0,l=result.length;temp.length&&i<l;++i) {
			let data=temp.splice(-2);
			data.unshift("0x");
			result[i]=eval(data.join(""))
		}
		return result
	},
	numberToBigEndian:function numberToBigEndian(value,size) {
		var temp=Array.from(value.toString(16)),result=new Uint8Array(size);
		for (let i=result.length-1;temp.length&&i>-1;++i) {
			let data=temp.splice(-2);
			data.unshift("0x");
			result[i]=eval(data.join(""))
		}
		return result
	},
	toArrayBuffer:data=>new Blob([data]).arrayBuffer()
}

function byteReader(byteValue) {
	var temp=byteValue.toString(2);
	while (temp.length<8) temp="0"+temp;
	return temp
}

function littleEndianNumber(array) {
	var temp="0b";
	for (let i=array.length-1;i>-1;--i) temp+=byteReader(array[i]);
	return eval(temp)
}

function bigEndianNumber(array) {
	var length=array.length,temp="0b";
	for (let i=0;i<length;++i) temp+=byteReader(array[i]);
	return eval(temp)
}

function flacMetaBlockReader(arrayBuffer) {
	if (!(arrayBuffer instanceof ArrayBuffer)) throw new Error("invalid input");
	var temp=new Uint8Array(arrayBuffer),result=[];
	var last=0,currentIndex=4;
	while (!last) {
		let block={},temp1=byteReader(temp[currentIndex++]),length=bigEndianNumber(temp.slice(currentIndex,currentIndex+=3));
		last=+temp1[0];
		switch (eval("0b"+temp1.substring(1))) {
			case 0:block.type="STREAMINFO";break;
			case 1:block.type="PADDING";break;
			case 2:block.type="APPLICATION";break;
			case 3:block.type="SEEKTABLE";break;
			case 4:block.type="VORBIS_COMMENT";break;
			case 5:block.type="CUESHEET";break;
			case 6:block.type="PICTURE";break;
			case 127:block.type="INVALID";break;
			default:block.type="RESERVED"
		}
		block.data=temp.slice(block.start=currentIndex,block.end=currentIndex+=length);
		result.push(block);
	}
	return result
}

async function flacVCdecoder(data) {
	if (!(data instanceof Uint8Array)) throw new Error("1!");
	var index=0,temp=littleEndianNumber(data.slice(0,index+=4)),result={};
	result.vendor=await FileIO.read(new Blob([data.slice(index,index+=temp)]),"Text");
	for (let i=0,l=littleEndianNumber(data.slice(index,index+=4));i<l;++i) {
		let temp=littleEndianNumber(data.slice(index,index+=4));
		temp=(await FileIO.read(new Blob([data.slice(index,index+=temp)]),"Text")).split("=");
		result[temp.splice(0,1)[0]]=temp.join("=");
	}
	return result
}

function createVCBlock(tags) {
	var toLittleEndian=BytesOperate.numberToLittleEndian,toBigEndian=BytesOperate.numberToBigEndian;
	if (!("vendor" in tags)) tags.vendor="reference libFLAC 1.3.1 20141125";
	var vendor=new Blob([tags.vendor]);
	var list=0,temp=[];
	for (let item of ["TITLE","VERSION","ALBUM","TRACKNUMBER","ARTIST","PERFORMER","COPYRIGHT","LICENSE","ORGANIZATION","DESCRIPTION","GENRE","DATE","LOCATION","CONTACT","ISRC"]) {
		if (!(item in tags)) continue;
		let data=new Blob([item,"=",tags[item]]),length=toLittleEndian(data.size,4);
		temp.push(length,data);
		++list;
	}
	temp.unshift(toLittleEndian(vendor.size,4),vendor,toLittleEndian(list,4));
	return new Blob(temp)
}

