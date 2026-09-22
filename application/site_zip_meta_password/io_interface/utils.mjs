function isValidNumberType(value, allowNaN = true) {
	if (typeof value == "number")
		return Number.isNaN(value) && !allowNaN ?
			false :
			Number.isInteger(value) && value >= 0;
	if (value === undefined || value === null)
		return true;
	return false;
}

/**
 * @param {Worker} worker
 * @param {any[]} data
 * @param {Transferable[]} [transfer]
 */
async function send(worker, data, transfer = []) {
	const { port1, port2 } = new MessageChannel();
	port1.start();
	const { promise, resolve } = Promise.withResolvers();
	port1.addEventListener("message", resolve, { once: true });
	transfer.push(port2);
	worker.postMessage(data, transfer);
	const { data: response } = await promise;
	port1.close();
	if (!response[0]) throw response[1];
	return response[1];
}

export { isValidNumberType, send };