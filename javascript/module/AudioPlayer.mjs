class AudioController {
	static AUDIO_BUFFER_SOURCE_NODE = 1;
	static OSCILLATOR_NODE = 2;
	static CONSTANT_SOURCE_NODE = 3;
	#output = null;
	#destination;
	#audioSource;
	#audioSourceType;
	get audioSourceType() { return this.#audioSourceType }
	#analyserNode = null;
	#analyser = null;
	get analyser() { return this.#analyser }
	#gainNode;
	get volume() { return Math.round(this.#gainNode.gain.value * 100) }
	set volume(value) { this.#gainNode.gain.value = value / 100 }
	#enableLoop = false;
	get loop() { return this.#enableLoop ? this.#audioSource.loop : null }
	get loopStart() { return this.#enableLoop ? this.#audioSource.loopStart : null }
	get loopEnd() { return this.#enableLoop ? this.#audioSource.loopEnd : null }
	set loop(value) { if (this.#enableLoop) this.#audioSource.loop = value }
	set loopStart(value) { if (this.#enableLoop) this.#audioSource.loopStart = value }
	set loopEnd(value) { if (this.#enableLoop) this.#audioSource.loopEnd = value }
	#enablePlaybackRate = false;
	get playbackRate() { return this.#enablePlaybackRate ? Math.round(this.#audioSource.playbackRate.value * 100) / 100 : null }
	set playbackRate(value) { if (this.#enablePlaybackRate) this.#audioSource.playbackRate.value = value }
	pause() { if (this.#enablePlaybackRate) this.#audioSource.playbackRate.value = 0 }
	resume() { if (this.#enablePlaybackRate) this.#audioSource.playbackRate.value = 1 }
	#enableDetune = false;
	get detune() { return this.#enableDetune ? this.#audioSource.detune.value : null }
	set detune(value) { if (this.#enableDetune) this.#audioSource.detune.value = value }
	#enableOscillator = false;
	get frequency() { return this.#enableOscillator ? this.#audioSource.frequency : null }
	set frequency(value) { if (this.#enableOscillator) this.#audioSource.frequency = value }
	get type() { return this.#enableOscillator ? this.#audioSource.type : null }
	set type(value) { if (this.#enableOscillator) this.#audioSource.type = value }
	#enableOffset = false;
	get offset() { return this.#enableOffset ? this.#audioSource.offset.value : null }
	set offset(value) { if (this.#enableOffset) this.#audioSource.offset.value = value }
	constructor(audioSource, context) {
		if (arguments.length < 2) throw new TypeError(`Failed to construct 'AudioController': 2 arguments required, but only ${arguments.length} present.`);
		if (!(audioSource instanceof AudioScheduledSourceNode)) throw new TypeError("Failed to construct 'AudioController': Argument 'audioNode' is not of type AudioScheduledSourceNode.");
		if (!(context instanceof AudioContext)) throw new TypeError("Failed to construct 'AudioController': Argument 'context' is not of type AudioContext.");
		this.#audioSource = audioSource;
		audioSource.connect(this.#destination = this.#gainNode = context.createGain());
		this.#gainNode.gain.value = 1;
		switch (true) {
			case audioSource instanceof AudioBufferSourceNode:
				this.#audioSourceType = AudioController.AUDIO_BUFFER_SOURCE_NODE;
				this.#enableLoop = this.#enablePlaybackRate = true;
			case audioSource instanceof OscillatorNode:
				if (!this.#audioSourceType) this.#audioSourceType = AudioController.OSCILLATOR_NODE;
				this.#enableDetune = true;
				if (audioSource instanceof AudioBufferSourceNode) break;
				this.#enableOscillator = true;
				break;
			case audioSource instanceof ConstantSourceNode:
				this.#audioSourceType = AudioController.CONSTANT_SOURCE_NODE;
				this.#enableOffset = true;
		}
	}
	start(delay) {
		const audioSource = this.#audioSource;
		delay = isNaN(delay) ? 0 : Number(delay);
		if (delay > 0) {
			audioSource.start(audioSource.context.currentTime + delay)
		} else audioSource.start();
	}
	stop(delay = 0) {
		const audioSource = this.#audioSource;
		if (typeof delay != "number") delay = Number(delay);
		if (isNaN(delay)) delay = 0;
		if (delay > 0) {
			audioSource.stop(audioSource.context.currentTime + delay)
		} else audioSource.stop();
	}
	get onended() { return this.#audioSource.onended }
	set onended(value) { this.#audioSource.onended = value }
	connect(output) { this.#destination.connect(this.#output = output) }
	disconnect() { this.#destination.disconnect(this.#output) }
	destroy() {
		this.#destination.disconnect(this.#output)
		this.#audioSource.stop();
	}
	setAnalyser(context, afterGain = true) {
		if (arguments.length < 1) throw new TypeError("Failed to execute 'setAnalyser' on 'AudioController': 1 argument required, but only 0 present.");
		if (!(context instanceof AudioContext)) throw new TypeError("Failed to execute 'setAnalyser' on 'AudioController': Argument 'context' is not of type AudioContext.");
		if (this.#analyser) throw new Error("Failed to excute 'setAnalyser' on 'AudioController': Analyser has been set.")
		const analyser = this.#analyserNode = context.createAnalyser();
		if (afterGain) {
			if (this.#output) this.#gainNode.disconnect(this.#output);
			this.#gainNode.connect(this.#destination = analyser).connect(this.#output);
		} else {
			analyser.connect(this.#gainNode);
			this.#audioSource.disconnect(this.#gainNode);
			this.#audioSource.connect(analyser);
		}
		return this.#analyser = new AudioAnalyser(analyser);
	}
	removeAnalyser() {
		if (!this.#analyserNode) throw new Error("Failed to excute 'removeAnalyser' on 'AudioController': Analyser has not set.");
		const output = this.#output;
		if (this.#destination == this.#gainNode) {
			this.#audioSource.disconnect(this.#analyserNode);
			this.#audioSource.connect(this.#gainNode);
			this.#analyserNode.disconnect(this.#gainNode);
		} else {
			this.#gainNode.disconnect(this.#analyserNode);
			this.#destination = this.#gainNode;
			if (output) this.#analyserNode.disconnect(output);
		}
		if (output) this.#gainNode.connect(output);
		this.#analyser = this.#analyserNode = null;
	}
	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: "AudioController",
			configurable: true
		});
		for (let item of ["AUDIO_BUFFER_SOURCE_NODE", "OSCILLATOR_NODE", "CONSTANT_SOURCE_NODE"]) Object.defineProperty(this, item, { enumerable: true });
	}
}
class AudioPlayer {
	#context = new AudioContext;
	#gainNode;
	#analyserNode = null;
	#analyser = null;
	get analyser() { return this.#analyser }
	#destination;
	constructor() {
		const context = this.#context, gainNode = this.#destination = this.#gainNode = context.createGain();
		gainNode.gain.value = 0.33;
		gainNode.connect(context.destination);
	}
	get volume() { return Math.round(this.#gainNode.gain.value * 100) }
	set volume(value) { this.#gainNode.gain.value = value / 100 }
	linkAudio(audioSource) {
		const controller = new AudioController(audioSource, this.#context);
		controller.connect(this.#destination);
		return controller;
	}
	linkBuffer(audioBuffer) {
		const audioSource = this.#context.createBufferSource();
		audioSource.buffer = audioBuffer;
		return this.linkAudio(audioSource);
	}
	play(audioBuffer, loop = false, loopStart = 0, loopEnd = 0) {
		const controller = this.linkBuffer(audioBuffer);
		if (loop) {
			controller.loop = true;
			controller.loopStart = typeof loopStart == "number" ? loopStart : 0;
			controller.loopEnd = typeof loopEnd == "number" ? loopEnd : 0;
			if (controller.loopStart != 0 && controller.loopEnd <= controller.loopStart) console.warn("The set end point of the loop is not later than the start point, and the audio cycle may not effect expectedly.", controller);
		}
		controller.start();
		return controller
	}
	async playFile(file, loop = false, loopStart = 0, loopEnd = 0) {
		if (!(file instanceof Blob)) throw new TypeError("Failed to execute 'playFile' on 'AudioPlayer': Argument 'file' is not a binary object.");
		return this.play(await this.#context.decodeAudioData(await file.arrayBuffer()), loop, loopStart, loopEnd)
	}
	setAnalyser(afterGain = true) {
		if (this.#analyser) throw new Error("Failed to excute 'setAnalyser' on 'AudioPlayer': Analyser has been set.")
		const analyser = this.#analyserNode = this.#context.createAnalyser();
		if (afterGain) {
			let destination = this.#context.destination;
			this.#gainNode.disconnect(destination)
			this.#gainNode.connect(analyser).connect(destination);
		} else {
			if (this.#gainNode.input) throw new Error("Failed to execute 'setAnalyser' on 'AudioPlayer': It must disconnect all inputs of the gain node first to set a analyzer before gain.");
			(this.#destination = analyser).connect(this.#gainNode);
		}
		return this.#analyser = new AudioAnalyser(analyser);
	}
	setControllerAnalyser(controller, afterGain = true) {
		if (arguments.length < 1) throw new TypeError("Failed to execute 'setControllerAnalyser' on 'AudioPlayer': 1 argument required, but only 0 present.");
		if (!(controller instanceof AudioController)) throw new TypeError("Failed to execute 'setControllerAnalyser' on 'AudioPlayer': Argument 'controller' is not of type AudioController.");
		controller.setAnalyser(this.#context, afterGain);
	}
	removeAnalyser() {
		if (!this.#analyser) throw new Error("Failed to excute 'removeAnalyser' on 'AudioPlayer': Analyser has not set.");
		const gainNode = this.#gainNode, analyserNode = this.#analyserNode;
		if (this.#destination == gainNode) {
			let destination = this.#context.destination;
			gainNode.disconnect(analyserNode);
			gainNode.connect(destination);
			analyserNode.disconnect(destination);
		} else {
			if (analyserNode.input) throw new Error("Failed to execute 'removeAnalyser' on 'AudioPlayer': It must disconnect all inputs of the analyser node first to remove a analyzer before gain.");
			analyserNode.disconnect(gainNode);
			this.#destination = gainNode;
		}
		this.#analyser = this.#analyserNode = null;
	}
	pause() { this.#context.suspend() }
	resume() { this.#context.resume() }
	close() { this.#context.close() }
	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: "AudioPlayer",
			configurable: true
		})
	}
}
class AudioAnalyser {
	#node;
	constructor(analyser) {
		if (arguments.length < 1) throw new TypeError("Failed to construct 'AudioAnalyser': 1 argument required, but only 0 present.");
		if (!(analyser instanceof AnalyserNode)) throw new TypeError("Failed to construct 'AudioAnalyser': Argument 'analyser' is not of type AnalyserNode.");
		this.#node = analyser;
	}
	#floatFrequencyRange = 255;
	get floatFrequencyRange() { return this.#floatFrequencyRange }
	set floatFrequencyRange(value) {
		if (value < 1 || value == Infinity) throw new TypeError("Failed to set property 'floatFrequencyRange' on 'AudioAnalyser': The value must be finite and greater than or equal to 1.");
		this.#floatFrequencyRange = value;
	}
	get minDecibels() { return this.#node.minDecibels }
	set minDecibels(value) { this.#node.minDecibels = value }
	get maxDecibels() { return this.#node.maxDecibels }
	set maxDecibels(value) { this.#node.maxDecibels = value }
	getByteTimeDomainData(uint8Array) { this.#node.getByteTimeDomainData(uint8Array) }
	getByteFrequencyData(uint8Array) { this.#node.getByteFrequencyData(uint8Array) }
	getFloatTimeDomainData(float32Array) { this.#node.getFloatTimeDomainData(float32Array) }
	getFloatFrequencyData(float32Array) { this.#node.getFloatFrequencyData(float32Array) }
	get fftSize() { return this.#node.fftSize }
	set fftSize(value) { this.#node.fftSize = value }
	get frequencyBinCount() { return this.#node.frequencyBinCount }
}
export { AudioPlayer, AudioController };