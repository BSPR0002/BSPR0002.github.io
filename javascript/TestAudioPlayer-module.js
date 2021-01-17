class AudioController {
	get [Symbol.toStringTag](){return "AudioController"}
	constructor(AudioNode) {
		if (!(AudioNode instanceof AudioScheduledSourceNode)) throw new Error("输入的参数不是音频源节点！");
		this.audioNode=AudioNode;
		switch (true) {
			case AudioNode instanceof AudioBufferSourceNode:
				for (let item of ["loop","loopStart","loopEnd"]) {
					Object.defineProperty(this,item,{
						get:function(){return this.audioNode[item]},
						set:function(value){this.audioNode[item]=value},
						enumerable:true
					});
				};
				Object.defineProperty(this,"speed",{
					get:function(){return Math.round(this.audioNode.playbackRate.value*100)/100},
					set:function(value){this.audioNode.playbackRate.value=value},
					enumerable:true
				});
				this.pause=function(){this.audioNode.playbackRate.value=0};
				this.resume=function(){this.audioNode.playbackRate.value=1};
			case AudioNode instanceof OscillatorNode:
				Object.defineProperty(this,"detune",{
					get:function(){return this.audioNode.detune.value},
					set:function(value){this.audioNode.detune.value=value},
					enumerable:true
				});
				if (AudioNode instanceof AudioBufferSourceNode) break;
				for (let item of ["frequency","type"]) {
					Object.defineProperty(this,item,{
						get:function(){return this.audioNode[item]},
						set:function(value){this.audioNode[item]=value},
						enumerable:true
					});
				};
				break;
			case AudioNode instanceof ConstantSourceNode:
				Object.defineProperty(this,"offset",{
					get:function(){return this.audioNode.offset.value},
					set:function(value){this.audioNode.offset.value=value},
					enumerable:true
				});
		}
		Object.freeze(this);
	}
	start(){this.audioNode.start()}
	stop(){this.audioNode.stop()}
	get onended(){return this.audioNode.onended}
	set onended(value){this.audioNode.onended=value}
	get detune(){return this.audioNode.detune}
	set detune(value){this.audioNode.detune=value}
}

class AudioPlayer {
	get [Symbol.toStringTag](){return "AudioPlayer"}
	constructor() {
		var audioContext=this.audioContext=new AudioContext;
		var gainNode=this.gainNode=audioContext.createGain();
		gainNode.gain.value=0.33;
		(this.analyser=gainNode.connect(audioContext.createAnalyser())).connect(audioContext.destination);
	}
	get volume(){return Math.round(this.gainNode.gain.value*100)}
	set volume(value){this.gainNode.gain.value=value/100}
	linkAudio(AudioNode) {
		AudioNode.connect(this.gainNode);
		return new AudioController(AudioNode);
	}
	linkBuffer(AudioBuffer) {
		var audioNode=this.audioContext.createBufferSource();
		audioNode.buffer=AudioBuffer;
		return this.linkAudio(audioNode);
	}
	play(AudioBuffer,loop=false,loopStart=0,loopEnd=0) {
		var audio=this.linkBuffer(AudioBuffer);
		if (loop===true) {
			audio.loop=true;
			audio.loopStart=typeof loopStart=="number"?loopStart:0;
			audio.loopEnd=typeof loopEnd=="number"?loopEnd:0;
			if (audio.loopStart!=0&&!(audio.loopEnd>audio.loopStart)) console.warn("设置的循环结束点不晚于循环开始点，音频循环可能会不符合预期效果。");
		};
		audio.start();
		return audio
	}
	async playFile(file,loop=false,loopStart=0,loopEnd=0) {
		if (!(file instanceof Blob)) throw new Error("Failed to execute 'playFile' on AudioPlayer: Argument 'file' is not a binary object.");
		var buffer=await this.audioContext.decodeAudioData(await file.arrayBuffer());
		return this.play(buffer,loop,loopStart,loopEnd)
	}
	pause(){this.audioContext.suspend()}
	resume(){this.audioContext.resume()}
	close(){this.audioContext.close()}
}

var audioPlayer=new AudioPlayer,audioController=null,busy=false,nodes=null,context,fftSizeStatu=false;
async function play() {
	if (busy) return alert("尚在加载其他音频，请稍后！");
	stop();
	changeFileName([2]);
	busy=true;
	try {
		let file=nodes.input.files[0];
		audioController=await audioPlayer.playFile(file,true);
		changeFileName([1,file.name]);
		nodes.playbackRate.innerText=1;
	} catch(e) {
		alert("发生了错误，您可能没有选择正确的音频文件。");
		changeFileName([0]);
	};
	busy=false
}
function stop(){
	if (audioController) {
		audioController.stop();
		audioController=null;
		changeFileName([0]);
	}
}
function changeSpeed(fasterOrSlower){
	if (audioController) {
		let temp=audioController.speed*10
		switch (Boolean(fasterOrSlower)) {
			case true:
				if (temp<40) nodes.playbackRate.innerText=audioController.speed=(temp+1)/10;
				break;
			case false:
				if (temp>1) nodes.playbackRate.innerText=audioController.speed=(temp-1)/10;
		}
	}
}
function changeFileName(option){
	switch (option[0]) {
		case 1:
			nodes.currentFile.title=nodes.currentFile.innerText=option[1];
			break;
		case 2:
			nodes.currentFile.innerText="读取文件中……";
			nodes.currentFile.removeAttribute("title");
			break;
		default:
			nodes.currentFile.innerText="无文件";
			nodes.currentFile.removeAttribute("title");
	}
}
function fftSizeSwitch(){audioPlayer.analyser.fftSize=(fftSizeStatu=!fftSizeStatu)?8192:2048};
fftSizeSwitch();
var toolInterface={play,stop,changeSpeed,fftSizeSwitch,player:audioPlayer};
Object.defineProperty(toolInterface,"controller",{
	get:function(){return audioController},
	set:function(){throw new Error("Assignment rejected.")},
	enumerable:true
})
testTools.audioPlayer=toolInterface;
function run() {
	context=testCanvas.context;
	context.translate(0.5,255.5);
	context.scale(1,-1);
	var data=new Uint8Array(1024);
	var data2=new Uint8Array(2048);
	function draw() {
		audioPlayer.analyser.getByteFrequencyData(data);
		context.beginPath();
		context.strokeStyle="rgb(255,0,0)";
		context.moveTo(-0.5,data[0]);
		for (let x=0;x<1024;++x) context.lineTo(x,data[x]);
		context.lineTo(1023.5,data[1023]);
		context.stroke();
	}
	function draw2() {
		audioPlayer.analyser.getByteTimeDomainData(data2);
		context.beginPath();
		context.strokeStyle="rgb(0,0,255)";
		context.moveTo(-0.5,data2[0]);
		for (let x=0;x<1024;++x) context.lineTo(x,data2[x*2]);
		context.lineTo(1023.5,data2[2046]);
		context.stroke();
	}
	function loop() {
		context.clearRect(0,0,1024,256);
		draw();
		draw2();
		requestAnimationFrame(loop)
	}
	var AH=[["DIV",[["SPAN","BSIF Audio Player",{"style":"grid-area:name"}],["SPAN",[["SPAN","当前文件："],["SPAN","无文件",null,"currentFile"]],{"style":"white-space:nowrap;text-overflow:ellipsis;overflow:hidden;max-width:100%;font-size:14px"}],["DIV",[["STYLE","#test_audio_player button{border:solid 2px #FFFFFF;border-radius:4px;background-color:#000000;font-size:15px}#test_audio_player .controls_speed{padding:0;width:24px;height:24px}"],["BUTTON","播放",null,"play"],["BUTTON","停止",null,"stop"],["DIV",[["BUTTON","－",{"class":"controls_speed","title":"-0.1"},"speedDown"],["SPAN",["× ",["SPAN","1",null,"playbackRate"]]],["BUTTON","＋",{"class":"controls_speed","title":"+0.1"},"speedUp"]],{"style":"display:grid;grid-template-columns:24px 1fr 24px;grid-gap:5px;place-items:center;width:100%;height:100%","title":"速度"}]],{"style":"display:grid;grid-template-columns:1fr 1fr 2fr;grid-gap:5px;place-items:center;width:100%;height:100%"}],["INPUT",null,{"type":"file","style":"grid-area:input;width:100%"},"input"]],{"style":"display:grid;grid-template-rows:1fr 1fr;grid-template-columns:1fr 1fr;grid-template-areas:\"name current\"\"input controls\";grid-gap:5px;place-items:center","class":"test_tools","id":"test_audio_player"}]];
	var toolInterface=ArrayHTML.decode(AH,true);
	nodes=toolInterface.getNodes;
	nodes.play.addEventListener("click",play);
	nodes.stop.addEventListener("click",stop);
	nodes.speedUp.addEventListener("click",function(){changeSpeed(true)});
	nodes.speedDown.addEventListener("click",function(){changeSpeed(false)});
	document.getElementById("tools_plate").appendChild(toolInterface.DocumentFragment);
	loop();
}
run();