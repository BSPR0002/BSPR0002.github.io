

/* 玩具
var robot=new MultiThread("self.onmessage=function(e){self.postMessage(self.eval(e.data))}",function(d){console.log(d)});
robot.do=function(command){
	this.send(command);
}
*/

class DecimalNumber {
	get [Symbol.toStringTag](){return "DecimalNumber"}
	#sign=false;
	#integer=0n;
	#mantissa=new Uint8Array(64);
	#extreme=0;
	#notNumber=false;
	get sign(){return this.#sign}
	get integer(){return this.#integer}
	get mantissa(){return new Uint8Array(this.#mantissa)}
	get extreme(){return this.#extreme}
	constructor(initial=undefined){
		if (arguments.length>0) {
			let input=initial;
			switch (typeof input) {
				case "object":
					if (input instanceof this.constructor) {
						this.#sign=input.#sign;
						this.#integer=input.#integer;
						this.#mantissa=new Uint8Array(input.#mantissa);
						this.#extreme=input.#extreme;
						break;
					};
					if (input===null) break;
				case "string":	
				case "number":
					if (!isFinite(input)) {
						this.#notNumber=true;
						break
					}
					if (input==0) break;
					let translate=input.toString().split(".");
					let integer=BigInt(translate[0]);
					this.#integer=(this.#sign=input<0)?-integer:integer;
					if (translate[1]) {
						let temp=translate[1],length=temp.length>64?65:temp.length,mantissa=this.#mantissa;
						for (let i=0,l=(length>63?64:length);i<l;++i) mantissa[i]=parseInt(temp[i]);
						if (length==65) this.#extreme=parseInt(temp[64])
					}
					break;
				case "bigint":
					this.#integer=input
				default:
			}
		}
	}
	toString() {
		if (this.#notNumber) return "NaN";
		var fixed=this.plus(0);
		var integer=fixed.#integer;
		var mantissa="";
		for (let i=63,temp=fixed.#mantissa,first=true;i>-1;--i) {
			if (first&&temp[i]==0) {continue} else {first=false}
			mantissa=temp[i]+mantissa;
		}
		return (fixed.#sign&&(integer||mantissa)?"-":"")+(mantissa?integer+"."+mantissa:integer)
	}
	isGreater(compare) {
		if (!(compare instanceof this.constructor)) compare=new this.constructor(compare);
		if (this.#sign<compare.#sign) return true;
		var translate=x=>this.#sign?!x:x;
		{
			let intGreater=this.#integer>compare.#integer;
			if (intGreater||this.#integer<compare.#integer) return translate(intGreater);
		}
		for (let selfMantissa=this.#mantissa,compareMantissa=compare.#mantissa,i=0;i<64;++i) {
			if (selfMantissa[i]>compareMantissa[i]) return translate(true);
			if (selfMantissa[i]<compareMantissa[i]) return translate(false);
		}
		if (this.#extreme>compare.#extreme) return translate(true);
		return false
	}
	isEqual(compare) {
		if (!(compare instanceof this.constructor)) compare=new this.constructor(compare);
		for (let selfMantissa=this.#mantissa,compareMantissa=compare.#mantissa,i=0;i<64;++i) if (selfMantissa[i]!=compareMantissa[i]) return false;
		if (this.#sign==compare.#sign&&this.#integer==compare.#integer&&this.#extreme==compare.#extreme) return true;
		return false;
	}
	isNaN(){return this.#notNumber}
	add(addend){
		var result=new this.constructor(this)
		var resultMantissa=result.#mantissa;
		var temp=[];
		for (let item of arguments) temp=temp.concat(item);
		for (let addend of temp) {
			addend=new this.constructor(addend);
			let sub=this.#sign!=addend.#sign,last=0;
			if (sub) {
				addend.#sign=!addend.#sign;
				let isGreater=addend.isGreater(result),minuend=isGreater?addend:result,subtrahend=isGreater?result:addend;
				if (isGreater) result.#sign=!result.#sign;
				result.#integer=minuend.#integer-subtrahend.#integer;
				result.#extreme=minuend.#extreme-subtrahend.#extreme;
				if (result.#extreme<0) {
					result.#extreme+=10;
					last=1;
				}
				let minuendMantissa=minuend.#mantissa,subtrahendMantissa=subtrahend.#mantissa;
				if (result.#extreme==1||result.#extreme==9) {
					let first=minuendMantissa[63]-subtrahendMantissa[63]-last;
					if (first<0) first+=10;
					if (result.#extreme==9) {
						if (first==9) {
							result.#extreme=0;
							last-=1
						}
					} else if (first%10==0) result.#extreme=0
				}
				for (let i=63;i>-1;--i) {
					let calc=minuendMantissa[i]-subtrahendMantissa[i]-last;
					if (calc<0) {
						calc+=10;
						last=1;
					} else last=0;
					resultMantissa[i]=calc;
				}
				if (last) {
					--result.#integer;
				}
				continue;
			}
			result.#integer+=addend.#integer
			result.#extreme+=addend.#extreme;
			if (result.#extreme>9) {
				result.#extreme-=10;
				last=1;
			}
			let addendMantissa=addend.#mantissa;
			if (result.#extreme==1||result.#extreme==9) {
				let first=resultMantissa[63]+addendMantissa[63]+last;
				if (first>10) first-=10;
				if (result.#extreme==9) {
					if (first==9) {
						result.#extreme=0;
						last+=1
					}
				} else if (first%10==0) result.#extreme=0
			}
			for (let i=63;i>-1;--i) {
				let calc=resultMantissa[i]+addendMantissa[i]+last;
				if (calc>9) {
					calc-=10;
					last=1;
				} else last=0;
				resultMantissa[i]=calc;
			}
			if (last) ++result.#integer;
		}
		return result;
	}
	sub(subtrahends) {
		var temp=[],next=[];
		for (let item of arguments) temp=temp.concat(item);
		for (let subtrahend of temp) {
			if (!(subtrahend instanceof this.constructor)) subtrahend=new this.constructor(subtrahend);
			subtrahend.#sign=!subtrahend.#sign;
			next.push(subtrahend)
		}
		return this.plus(next)
	}
	multiply(multiplier) {
		var operand1=new this.constructor(this),operand2=new this.constructor(multiplier);
		if (operand1.#notNumber||operand2.#notNumber) return this.constructor.notNumber();
		
		
		
		
		
		
	}
	static notNumber() {
		var temp=new this;
		temp.#notNumber=true;
		return temp
	}
	static constructFromData(integer_BigInt,sign_boolean=null,mantissa_Uint8Array=null,extreme_number=null) {
		var result=new this;
		if (typeof integer_BigInt!="bigint") throw new TypeError("Failed to construct DecimalNumber from data: Parameter 'integer_BigInt' is not a BigInt.");
		if (integer_BigInt<0) throw new TypeError("Failed to construct DecimalNumber from data: The integer part cannot be negative.");
		result.#integer=integer_BigInt;
		if (sign_boolean!=null) {
			if (typeof sign_boolean!="boolean") throw new TypeError("Failed to construct DecimalNumber from data: Parameter 'sign_boolean' is not a boolean.");
			result.#sign=sign_boolean;
		}
		if (mantissa_Uint8Array!=null) {
			if (!(mantissa_Uint8Array instanceof Uint8Array)) throw new TypeError("Failed to construct DecimalNumber from data: Parameter 'mantissa_Uint8Array' is not a Uint8Array.");
			result.#mantissa=new Uint8Array(64);
			let length=mantissa_Uint8Array.length;
			for (let i=0,l=length>63?64:length;i<l;++i) {
				if (mantissa_Uint8Array[i]>9) throw new TypeError("Failed to construct DecimalNumber from data: One of the mantissa is greater than 9.[at mantissa_Uint8Array["+i+"]]");
				result.#mantissa=mantissa_Uint8Array[i];
			}
		}
		if (extreme_number!=null) {
			if (typeof extreme_number!="number") throw new TypeError("Failed to construct DecimalNumber from data: Parameter 'extreme_number' is not a number.");
			result.#extreme=extreme_number;
		}
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

async function dooo(times) {
	var random=Math.random,tt=new randomStatistician;
	function infunc(resolve){setTimeout(resolve,random()*100)}
	for (let i=0;i<times;++i) {
		await new Promise(infunc);
		tt.record(random());
	}
	console.log("done",tt.analyze())
}