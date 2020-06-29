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
	linkAudio(AudioBuffer) {
		var source=this.audioContext.createBufferSource();
		source.buffer=AudioBuffer;
		source.connect(this.analyser);
		source.connect(this.gainNode);
		var controller={
			"start":function(){source.start()},
			"stop":function(){source.stop()}
		};
		for (let item of ["loop","loopStart","loopEnd","onended"]) {
			Object.defineProperty(controller,item,{
				"get":function(){return source[item]},
				"set":function(value){source[item]=value},
				"enumerable":true
			});
		};
		for (let item of [["detune","detune"],["speed","playbackRate"]]) {
			Object.defineProperty(controller,item[0],{
				"get":function(){return source[item[1]].value},
				"set":function(value){source[item[1]].value=value},
				"enumerable":true
			});
		};
		for (let item of [["pause",0],["resume",1]]) controller[item[0]]=function(){source.playbackRate.value=item[1]};
		return controller
	}
	async linkBuffer(ArrayBuffer) {
		return this.linkAudio(await this.audioContext.decodeAudioData(ArrayBuffer))
	}
	play(AudioBuffer,loop=false,loopStart=0,loopEnd=0) {
		var audio=this.linkAudio(AudioBuffer);
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
}

