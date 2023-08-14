import Enum from "./Enum.mjs";
const sourceTypes = new Enum(["AUDIO_BUFFER_SOURCE_NODE", "OSCILLATOR_NODE", "CONSTANT_SOURCE_NODE"]),
	typeofAudioBufferSourceNode = AudioBufferSourceNode.prototype,
	typeofOscillatorNode = OscillatorNode.prototype,
	typeofConstantSourceNode = ConstantSourceNode.prototype,
	changeSourceNode = Symbol("protected changeSourceNode");
class ChainBase {
	#input;
	#output;
	#chain = [];
	get chain() { return Array.from(this.#chain) }
	constructor(input, output) {
		this.#input = input;
		this.#output = output;
	}
	insertNode(node, order = this.#chain.length) {
		if (!(node instanceof AudioNode)) throw new TypeError("Failed execute 'insertNode' on 'ChainBase': Argument 'node' is not type of AudioNode.");
		if (!(typeof order == "number" && Number.isInteger(order))) throw new TypeError("Failed execute 'insertNode' on 'ChainBase': Argument 'order' is not an integer number.");
		const chain = this.#chain, currentLength = chain.length;
		if (order < 0 || order > currentLength) throw new Error("Failed execute 'insertNode' on 'ChainBase': Argument 'order' must greater than 0 and not greater than length of chain.");
		const before = order ? chain[order] : this.#input, after = order < currentLength ? chain[currentLength] : this.#output;
		++chain.length;
		chain.copyWithin(order + 1, order);
		chain[order] = node;
		before.disconnect(after);
		before.connect(node).connect(after);
	}
	removeNode(node) {
		if (!(node instanceof AudioNode)) throw new TypeError("Failed execute 'insertNode' on 'ChainBase': Argument 'node' is not type of AudioNode.");
		const chain = this.#chain, index = chain.indexOf(node);
		if (index == -1) throw new Error("Failed execute 'insertNode' on 'ChainBase': Provided node is not in the chain.");
		const before = index ? chain[index - 1] : this.#input, after = index == chain.length - 1 ? this.#output : chain[index + 1];
		chain.splice(index, 1);
		before.disconnect(node);
		node.disconnect(before.connect(after));
	}
	relinkChain() {
		var node = this.#input;
		for (let item of this.#chain) node = node.connect(item);
		node.connect(this.#output);
	}
	clearChain() {
		const chain = this.#chain, output = this.#output;
		if (chain.length) {
			chain[chain.length - 1].disconnect(output);
			chain.length = 0;
		}
		this.#input.connect(this.#output);
	}
	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, { value: this.name, configurable: true });
		this.prototype[changeSourceNode] = function (newSource) {
			const nextNode = this.#chain[0] ?? this.#output;
			this.#input.disconnect(nextNode);
			(this.#input = newSource).connect(nextNode);
		}
	}
}
class AudioPlayer extends ChainBase {
	#context;
	get context() { return this.#context }
	#beforeGain;
	#afterGain;
	constructor() {
		const context = new AudioContext, beforeGain = context.createGain(), afterGain = context.createGain();
		super(beforeGain, beforeGain.connect(afterGain));
		afterGain.connect(context.destination);
		this.#context = context;
		(this.#beforeGain = beforeGain).gain.value = 1;
		(this.#afterGain = afterGain).gain.value = 0.33;
	}
	get gain() { return this.#beforeGain.gain.value }
	set gain(value) { this.#beforeGain.gain.value = value }
	get volume() { return Math.round(this.#afterGain.gain.value * 100) }
	set volume(value) { this.#afterGain.gain.value = value / 100 }
	pause() { return this.#context.suspend() }
	resume() { return this.#context.resume() }
	close() { return this.#context.close() }
	linkController(controller) {
		if (!(controller instanceof AudioController)) throw new TypeError("Failed execute 'linkController' on 'AudioPlayer': Argument 'controller' is not type of AudioController.");
		controller.connect(this.#beforeGain);
	}
	linkSource(sourceNode) {
		var controller;
		switch (Object.getPrototypeOf(sourceNode)) {
			case typeofAudioBufferSourceNode:
				controller = new BufferSourceController(sourceNode);
				break;
			case typeofOscillatorNode:
				controller = new OscillatorController(sourceNode);
				break;
			case typeofConstantSourceNode:
				controller = new ConstantSourceController(sourceNode);
				break;
			default:
				controller = new AudioController(sourceNode);
		}
		controller.connect(this.#beforeGain);
		return controller;
	}
	linkBuffer(audioBuffer) {
		const audioSource = this.#context.createBufferSource();
		audioSource.buffer = audioBuffer;
		return this.linkSource(audioSource);
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
	static { Object.defineProperty(this.prototype, Symbol.toStringTag, { value: this.name, configurable: true }) }
}
class AudioController extends ChainBase {
	#sourceNode;
	#gainNode;
	#destination;
	constructor(sourceNode) {
		if (!(sourceNode instanceof AudioScheduledSourceNode)) throw new TypeError("Failed to construct 'AudioController': Argument 'sourceNode' is not of type AudioScheduledSourceNode.");
		const gain = sourceNode.context.createGain();
		super(sourceNode, sourceNode.connect(gain));
		this.#sourceNode = sourceNode;
		(this.#gainNode = gain).gain.value = 1;
	}
	get volume() { return Math.round(this.#gainNode.gain.value * 100) }
	set volume(value) { this.#gainNode.gain.value = value / 100 }
	start(delay = 0) {
		if (typeof delay != "number" || !Number.isFinite(delay) || delay < 0) throw new TypeError("Failed to execute 'start' on 'AudioController': Argument 'delay' must be an finite number that equal or greater than 0.");
		const sourceNode = this.#sourceNode;
		if (delay > 0) {
			sourceNode.start(sourceNode.context.currentTime + delay)
		} else sourceNode.start();
	}
	stop(delay = 0) {
		if (typeof delay != "number" || !Number.isFinite(delay) || delay < 0) throw new TypeError("Failed to execute 'stop' on 'AudioController': Argument 'delay' must be an finite number that equal or greater than 0.");
		const sourceNode = this.#sourceNode;
		if (delay > 0) {
			sourceNode.stop(sourceNode.context.currentTime + delay)
		} else sourceNode.stop();
	}
	get onended() { return this.#sourceNode.onended }
	set onended(value) { this.#sourceNode.onended = value }
	connect(input) { this.#gainNode.connect(this.#destination = input) }
	disconnect() {
		this.#gainNode.disconnect(this.#destination);
		this.#destination = undefined;
	}
	destroy() {
		this.#gainNode.disconnect(this.#destination)
		this.#sourceNode.stop();
	}
	static {
		Object.defineProperties(this.prototype, {
			[Symbol.toStringTag]: { value: this.name, configurable: true },
			sourceType: { value: NaN, configurable: true, enumerable: true }
		});
		Object.defineProperty(this, "sourceTypes", { value: sourceTypes, enumerable: true });
		this.prototype[changeSourceNode] = function (newSource) { ChainBase.prototype[changeSourceNode].call(this, this.#sourceNode = newSource) }
	}
}
class BufferSourceController extends AudioController {
	#sourceNode;
	get loop() { return this.#sourceNode.loop }
	get loopStart() { return this.#sourceNode.loopStart }
	get loopEnd() { return this.#sourceNode.loopEnd }
	get playbackRate() { return Math.round(this.#sourceNode.playbackRate.value * 100) / 100 }
	set loop(value) {
		this.#sourceNode.loop = value;
		if (this.#startTime !== undefined && value) this.#noPause = true;
	}
	set loopStart(value) { this.#sourceNode.loopStart = value }
	set loopEnd(value) { this.#sourceNode.loopEnd = value }
	set playbackRate(value) {
		this.#sourceNode.playbackRate.value = value;
		if (this.#startTime !== undefined && value != 1) this.#noPause = true;
	}
	get detune() { return this.#sourceNode.detune.value }
	set detune(value) {
		this.#sourceNode.detune.value = value;
		if (this.#startTime !== undefined && value != 0) this.#noPause = true;
	}
	constructor(sourceNode) {
		if (!(sourceNode instanceof AudioBufferSourceNode)) throw new TypeError("Failed to construct 'BufferSourceController': Argument 'sourceNode' is not of type AudioBufferSourceNode.");
		super(sourceNode);
		this.#sourceNode = sourceNode;
	}
	start(delay = 0, offset = 0, duration = undefined) {
		if (typeof delay != "number" || !Number.isFinite(delay) || delay < 0) throw new TypeError("Failed to execute 'start' on 'BufferSourceController': Argument 'delay' must be an finite number that equal or greater than 0.");
		if (typeof offset != "number" || !Number.isFinite(offset) || offset < 0) throw new TypeError("Failed to execute 'start' on 'BufferSourceController': Argument 'offset' must be an finite number that equal or greater than 0.");
		if (duration !== undefined && (typeof duration != "number" || !Number.isFinite(duration) || duration < 0)) throw new TypeError("Failed to execute 'start' on 'BufferSourceController': Argument 'duration' must be an finite number that equal or greater than 0.");
		const sourceNode = this.#sourceNode, currentTime = sourceNode.context.currentTime;
		sourceNode.start(delay ? currentTime + delay : 0, offset, duration);
		this.#startTime = currentTime - offset;
		if (sourceNode.playbackRate.value != 1 || sourceNode.detune.value != 0 || sourceNode.loop) this.#noPause = true;
	}
	stop(delay = 0) {
		super.stop(delay);
		this.#startTime = undefined;
	}
	restart(delay = 0, offset = 0, duration = undefined) {
		if (typeof delay != "number" || !Number.isFinite(delay) || delay < 0) throw new TypeError("Failed to execute 'restart' on 'BufferSourceController': Argument 'delay' must be an finite number that equal or greater than 0.");
		if (typeof offset != "number" || !Number.isFinite(offset) || offset < 0) throw new TypeError("Failed to execute 'restart' on 'BufferSourceController': Argument 'offset' must be an finite number that equal or greater than 0.");
		if (duration !== undefined && (typeof duration != "number" || !Number.isFinite(duration) || duration < 0)) throw new TypeError("Failed to execute 'restart' on 'BufferSourceController': Argument 'duration' must be an finite number that equal or greater than 0.");
		const sourceNode = this.#sourceNode, context = sourceNode.context, currentTime = context.currentTime, newSource = this.#sourceNode = context.createBufferSource();
		newSource.buffer = sourceNode.buffer;
		AudioController.prototype[changeSourceNode].call(this, newSource);
		newSource.loop = sourceNode.loop;
		newSource.loopStart = sourceNode.loopStart;
		newSource.loopEnd = sourceNode.loopEnd;
		newSource.onended = sourceNode.onended;
		const playbackRate = newSource.playbackRate.value = sourceNode.playbackRate.value;
		if ((newSource.detune.value = sourceNode.detune.value) == 0 && playbackRate == 1 && !newSource.loop) this.#noPause = false;
		newSource.start(delay ? currentTime + delay : 0, offset, duration);
		this.#startTime = currentTime - offset;
		this.#duration = undefined;
	}
	#startTime;
	#duration;
	#noPause = false;
	pause() {
		if (this.#noPause) throw new Error("Failed to execute 'pause' on 'BufferSourceController': Pause function has been disabled due to changes in loop, playback rate or detune.")
		const startTime = this.#startTime;
		if (startTime === undefined) return;
		const sourceNode = this.#sourceNode;
		sourceNode.stop();
		this.#startTime = undefined;
		this.#duration = sourceNode.context.currentTime - startTime;
	}
	resume() { if (this.#duration !== undefined) this.restart(0, this.#duration) }
	get current() {
		if (this.#noPause) return undefined;
		if (this.#duration !== undefined) return this.#duration;
		const startTime = this.#startTime;
		if (startTime !== undefined) {
			const sourceNode = this.#sourceNode, duration = sourceNode.buffer.duration, current = sourceNode.context.currentTime - startTime;
			return current < duration ? current : duration;
		}
		return undefined;
	}
	static {
		Object.defineProperties(this.prototype, {
			[Symbol.toStringTag]: { value: this.name, configurable: true },
			sourceType: { value: sourceTypes.AUDIO_BUFFER_SOURCE_NODE, configurable: true, enumerable: true }
		});
	}
}
class OscillatorController extends AudioController {
	#sourceNode;
	constructor(sourceNode) {
		if (!(sourceNode instanceof OscillatorNode)) throw new TypeError("Failed to construct 'OscillatorController': Argument 'sourceNode' is not of type OscillatorController.");
		super(sourceNode);
		this.#sourceNode = sourceNode;
	}
	get detune() { return this.#sourceNode.detune.value }
	set detune(value) { this.#sourceNode.detune.value = value }
	get frequency() { return this.#sourceNode.frequency.value }
	set frequency(value) { this.#sourceNode.frequency.value = value }
	get waveType() { return this.#sourceNode.type }
	set waveType(value) { this.#sourceNode.type = value }
	static {
		Object.defineProperties(this.prototype, {
			[Symbol.toStringTag]: { value: this.name, configurable: true },
			sourceType: { value: sourceTypes.OSCILLATOR_NODE, configurable: true, enumerable: true }
		});
	}
}
class ConstantSourceController extends AudioController {
	#sourceNode;
	get offset() { return this.#sourceNode.offset.value }
	set offset(value) { this.#sourceNode.offset.value = value }
	constructor(sourceNode) {
		if (!(sourceNode instanceof ConstantSourceNode)) throw new TypeError("Failed to construct 'ConstantSourceController': Argument 'sourceNode' is not of type ConstantSourceNode.");
		super(sourceNode);
		this.#sourceNode = sourceNode;
	}
	static {
		Object.defineProperties(this.prototype, {
			[Symbol.toStringTag]: { value: this.name, configurable: true },
			sourceType: { value: sourceTypes.CONSTANT_SOURCE_NODE, configurable: true, enumerable: true }
		});
	}
}
class AudioAnalyser {
	#node;
	constructor(context) {
		if (!(context instanceof AudioContext)) throw new TypeError("Failed to construct 'AudioAnalyser': Argument 'context' is not of type AudioContext.");
		const analyser = this.#node = context.createAnalyser(), magnification = context.sampleRate / 48000;
		if (magnification > 1) {
			let i = 2;
			while (i < 16) if (i < magnification) { i *= 2 } else break;
			analyser.fftSize *= i;
		} else if (magnification < 1) {
			let i = 0.5;
			while (i > 0.015625) if (i > magnification) { i /= 2 } else break;
			analyser.fftSize *= (i < magnification ? i * 2 : i);
		}
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
	insertToChain(chainBase, index = undefined) {
		if (!(chainBase instanceof ChainBase)) throw new TypeError("Failed execute 'insertToChain' on 'AudioPlayer': Argument 'chainBase' is not type of ChainBase.");
		chainBase.insertNode(this.#node, index);
	}
}
export { AudioPlayer, AudioController, BufferSourceController, OscillatorController, ConstantSourceController, AudioAnalyser }