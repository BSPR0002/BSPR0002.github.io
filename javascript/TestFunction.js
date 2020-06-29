class AudioPlayer {
	constructor() {
		var audioContext=new window.AudioContext;
		var analyser=audioContext.createAnalyser();
		var gainNode=audioContext.createGain();
		analyser.connect(audioContext.destination);
		gainNode.connect(audioContext.destination);
		this.audioContext=audioContext;
		this.analyser=analyser;
		this.gainNode=gainNode;
		gainNode.gain.value=0;
		Object.defineProperty(this,"volume",{
			"get":function(){return Math.round((gainNode.gain.value+1)*1000)/10},
			"set":function(value){gainNode.gain.value=value/100-1},
			"enumerable":true
		});
	}
	linkAudio(AudioNode) {
		if (!(AudioNode instanceof AudioScheduledSourceNode)) throw new Error("输入参数不是音频源节点！")
		AudioNode.connect(this.analyser);
		AudioNode.connect(this.gainNode);
		var controller={
			"audioNode":AudioNode,
			"start":function(){AudioNode.start()},
			"stop":function(){AudioNode.stop()}
		};
		Object.defineProperty(controller,"onended",{
			"get":function(){return AudioNode.onended},
			"set":function(value){AudioNode.onended=value},
			"enumerable":true
		});
		Object.defineProperty(controller,"detune",{
			"get":function(){return AudioNode.detune.value},
			"set":function(value){AudioNode.detune.value=value},
			"enumerable":true
		});
		return controller
	}
	linkBuffer(AudioBuffer) {
		var source=this.audioContext.createBufferSource();
		source.buffer=AudioBuffer;
		var controller=this.linkAudio(source)
		for (let item of ["loop","loopStart","loopEnd"]) {
			Object.defineProperty(controller,item,{
				"get":function(){return controller.audioNode[item]},
				"set":function(value){controller.audioNode[item]=value},
				"enumerable":true
			});
		};
		Object.defineProperty(controller,"speed",{
			"get":function(){return controller.audioNode.playbackRate.value},
			"set":function(value){controller.audioNode.playbackRate.value=value},
			"enumerable":true
		});
		for (let item of [["pause",0],["resume",1]]) controller[item[0]]=function(){controller.audioNode.playbackRate.value=item[1]};
		return controller
	}
	play(AudioBuffer,loop=false,loopStart=0,loopEnd=0) {
		var audio=this.linkBuffer(AudioBuffer);
		if (loop===true) {
			audio.loop=true;
			audio.loopStart=typeof loopStart=="number"?loopStart:0;
			audio.loopEnd=typeof loopEnd=="number"?loopEnd:0;
			if (audio.loopStart!=0&&audio.loopEnd==0) console.warn("设置的循环结束时间为 0，音频循环可能不会符合预期效果。");
		};
		audio.start();
		return audio
	}
	async playFile(file,loop=false,loopStart=0,loopEnd=0) {
		var buffer=await this.audioContext.decodeAudioData(await file.arrayBuffer());
		return this.play(buffer,loop,loopStart,loopEnd)
	}
	pause(){this.audioContext.suspend()}
	resume(){this.audioContext.resume()}
	close(){this.audioContext.close()}
}

