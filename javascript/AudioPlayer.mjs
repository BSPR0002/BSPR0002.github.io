class AudioController {
	constructor(AudioNode) {
		if (!(AudioNode instanceof AudioScheduledSourceNode)) throw new TypeError("输入的参数不是音频源节点！");
		this.audioNode=AudioNode;
		switch (true) {
			case AudioNode instanceof AudioBufferSourceNode:
				for (let item of ["loop","loopStart","loopEnd"]) {
					Object.defineProperty(this,item,{
						get:function(){return this.audioNode[item]},
						set:function(value){this.audioNode[item]=value},
						enumerable:true
					});
				}
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
				}
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
Object.defineProperty(AudioController.prototype,Symbol.toStringTag,{value:"AudioController",writable:false});
class AudioPlayer {
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
		}
		audio.start();
		return audio
	}
	async playFile(file,loop=false,loopStart=0,loopEnd=0) {
		if (!(file instanceof Blob)) throw new TypeError("Failed to execute 'playFile' on AudioPlayer: Argument 'file' is not a binary object.");
		var buffer=await this.audioContext.decodeAudioData(await file.arrayBuffer());
		return this.play(buffer,loop,loopStart,loopEnd)
	}
	pause(){this.audioContext.suspend()}
	resume(){this.audioContext.resume()}
	close(){this.audioContext.close()}
}
Object.defineProperty(AudioPlayer.prototype,Symbol.toStringTag,{value:"AudioPlayer",writable:false});
export {AudioPlayer};