const scope = registration.scope, ownCachePrefix = new URL(scope).pathname + ":";
function ownUrl(fileUrl) { return scope + fileUrl }
function requiredScriptsUrl(fileUrl) { return "/javascript/module/" + fileUrl }
class CacheController {
	constructor(version) {
		const ownCacheName = ownCachePrefix + version;
		Object.defineProperties(this, {
			ownCacheName: { enumerable: true, value: ownCacheName },
			cacheScopes: {
				enumerable: true, value: Object.freeze([
					{ cacheName: ownCacheName, scope },
					{ cacheName: "/javascript/module/", scope: origin + "/javascript/module/" },
					{ cacheName: "/", scope: origin + "/" }
				])
			},
			version: { enumerable: true, value: version }
		})
	}
	async install(resources) {
		const { own, requiredScripts, shared } = resources;
		await (await caches.open(this.ownCacheName)).addAll(own.map(ownUrl));
		if (requiredScripts) await (await caches.open("/javascript/module/")).addAll(requiredScripts.map(requiredScriptsUrl));
		if (shared) await (await caches.open("/")).addAll(shared);
		console.log("Service worker installed successfully.\nResource version: " + this.version);
	}
	async respond(request) {
		const url = request.url;
		if (request.mode == "navigate") return url != scope && url != scope + "index.html" ?
			new Response(null, { status: 301, headers: { Location: scope } }) :
			await (await caches.open(this.ownCacheName)).match(scope + "index.html");
		for (let { scope, cacheName } of this.cacheScopes) {
			if (!url.startsWith(scope)) continue;
			const response = await (await caches.open(cacheName)).match(url);
			if (response) return response;
			break;
		}
		return fetch(request);
	}
	async clean() { for (let cacheName of await caches.keys()) if (cacheName.startsWith(ownCachePrefix) && cacheName != this.ownCacheName) await caches.delete(cacheName) }
}
export default CacheController;