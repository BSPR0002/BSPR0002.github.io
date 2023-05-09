const enum sourceTypes { AUDIO_BUFFER_SOURCE_NODE, OSCILLATOR_NODE, CONSTANT_SOURCE_NODE };
declare class ChainBase {
	readonly chain: AudioNode[];
	constructor(input: AudioNode, ouput: AudioNode);
	insertNode(node: AudioNode, order?: number): void;
	removeNode(node: AudioNode): void;
	relinkChain(): void;
	clearChain(): void;
}
declare class AudioPlayer extends ChainBase {
	readonly context: AudioContext;
	constructor();
	gain: number;
	volume: number;
	pause(): Promise<void>;
	resume(): Promise<void>;
	close(): Promise<void>;
	linkController(controller: AudioController): void;
	linkSource(sourceNode: AudioScheduledSourceNode): AudioController;
	linkBuffer(audioBuffer: AudioBuffer): BufferSourceController;
	play(audioBuffer: AudioBuffer, loop = false, loopStart = 0, loopEnd = 0): BufferSourceController;
	playFile(file: Blob, loop = false, loopStart = 0, loopEnd = 0): Promise<BufferSourceController>;
}
declare class AudioController extends ChainBase {
	constructor(sourceNode: AudioScheduledSourceNode);
	volume: number;
	start(delay = 0): void;
	stop(delay = 0): void;
	onended: ((this: AudioScheduledSourceNode, ev: Event) => any) | null;
	connext(input: AudioNode): void;
	disconnect(): void;
	destroy(): void;
	readonly sourceType = NaN;
}
declare class BufferSourceController extends AudioController {
	loop: boolean;
	loopStart: number;
	loopEnd: number;
	playbackRate: number;
	detune: number;
	constructor(sourceNode: AudioBufferSourceNode);
	start(delay = 0, offset = 0, duration?: number): void;
	restart(delay = 0, offset = 0, duration?: number): void;
	pause(): void;
	resume(): void;
	readonly current: number | undefined;
	readonly sourceType = sourceTypes.AUDIO_BUFFER_SOURCE_NODE;
}
declare class OscillatorController extends AudioController {
	constructor(sourceNode: OscillatorNode);
	detune: number;
	frequency: number;
	waveType: OscillatorType;
	readonly sourceType = sourceTypes.OSCILLATOR_NODE;
}
declare class ConstantSourceController extends AudioController {
	offset: number;
	constructor(sourceNode: ConstantSourceNode);
	readonly sourceType = sourceTypes.CONSTANT_SOURCE_NODE;
}
declare class AudioAnalyser {
	constructor(context: AudioContext)
	minDecibels: number;
	maxDecibels: number;
	fftSize: number;
	readonly frequencyBinCount: number;
	getByteTimeDomainData(uint8Array: Uint8Array): void;
	getByteFrequencyData(uint8Array: Uint8Array): void;
	getFloatTimeDomainData(float32Array: Float32Array): void;
	getFloatFrequencyData(float32Array: Float32Array): void;
	insertToChain(chainBase: ChainBase, index?: number): void;
}
export { AudioPlayer, AudioController, BufferSourceController, OscillatorController, ConstantSourceController, AudioAnalyser }