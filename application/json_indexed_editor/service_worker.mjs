import CacheController from "../support.mjs"
const cacheController = new CacheController(1);
self.addEventListener("install", event => {
    event.waitUntil(cacheController.install({
        own: [
            "index.html",
            "manifest.webmanifest",
            "main.mjs",
            "editor.mjs",
            "editor.css",
            "icon.svg",
            "icon.png"
        ],
        requiredScripts: [
            "ArrayHTML.mjs",
            "MiniWindow.mjs",
            "FileIO.mjs",
            "IndexedDatabase.mjs",
            "PromiseAdapter.mjs",
            // /javascript/AppletsDataStorage.mjs
            "BinaryOperate.mjs",
            "DynamicIndexedDatabase.mjs"
        ],
        shared: [
            "/css/BSIF_style.css",
            "/javascript/AppletsDataStorage.mjs"
        ]
    }))
});
self.addEventListener("fetch", event => { event.respondWith(cacheController.respond(event.request)) });
self.addEventListener("activate", event => { event.waitUntil(cacheController.clean()) })