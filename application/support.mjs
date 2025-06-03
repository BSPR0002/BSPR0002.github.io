/** @ts-ignore @type {ServiceWorkerRegistration} */
const {scope} = registration, cacheNamePrefix = new URL(scope).pathname + ":",
	scopeMapping = {
		scriptModule: "/javascript/module/",
		component: "/component/",
		website: "/"
	};
/**
 * @param {string[]} list
 * @param {string} scope
 * @param {string[]} paths
 */
function addScopeUrls(list, scope, paths) { for (const item of paths) list.push(scope + item) }
class CacheController {
	/**
	 * @param {string | number} version 
	 */
	constructor(version) {
		this.cacheName = cacheNamePrefix + (this.version = version);
		Object.defineProperties(this, {
			ownCacheName: { enumerable: true },
			version: { enumerable: true }
		});
	}
	/**
	 * @param {{ own: string[], scriptModule?: string[], website?: string[], component?: string[] }} resources
	 */
	async install(resources) {
		const { own } = resources, cache = await caches.open(this.cacheName), list = [];
		addScopeUrls(list, scope, own);
		for (const key in scopeMapping)
			if (key in resources)
				addScopeUrls(list, scopeMapping[key], resources[key]);
		await cache.addAll(list);
		console.log("Service worker installed successfully.\nResource version: " + this.version);
	}
	/**
	 * @param {Request} request
	 */
	async respond(request) {
		const url = request.url, cache = await caches.open(this.cacheName);
		if (request.mode == "navigate") {
			const indexFile = scope + "index.html";
			return url != scope && url != indexFile ?
				new Response(null, { status: 301, headers: { Location: scope } }) :
				await cache.match(indexFile);
		}
		return await cache.match(url) ?? fetch(request);
	}
	async clean() {
		for (const cacheName of await caches.keys())
			if (cacheName.startsWith(cacheNamePrefix) && cacheName != this.cacheName)
				await caches.delete(cacheName)
	}
	async uninstall() {
		for (const cacheName of await caches.keys())
			if (cacheName.startsWith(cacheNamePrefix))
				await caches.delete(cacheName)
	}
}
export default CacheController;