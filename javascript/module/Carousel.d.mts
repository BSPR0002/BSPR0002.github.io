type carouselItem = {
	image?: string,
	text?: string,
	action?: string
}
declare class Carousel {
	constructor(data: carouselItem[], start = false);
	waitTime: number;
	readonly running: boolean;
	readonly element: HTMLDivElement;
	start(): void;
	stop(): void;
	static create(data: carouselItem[], target: HTMLElement | DocumentFragment | Document): Carousel
}
export default Carousel;