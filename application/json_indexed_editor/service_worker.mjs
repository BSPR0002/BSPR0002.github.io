import CacheController from "../support.mjs"
const cacheController = new CacheController(2);
self.addEventListener("install", event => {
    event.waitUntil(cacheController.install({
        own: [
            "index.html",
            "manifest.webmanifest",
            "main.mjs",
            "editor.mjs",
            "data.mjs",
            "ui.mjs",
            "editor.css",
            "buttons.svg",
            "icon.svg",
            "icon.png",
            "icon-monochrome.svg"
        ],
        requiredScripts: [
            "ArrayHTML.mjs",
            "MiniWindow.mjs",
            "IndexedDatabase.mjs",
            "PromiseAdapter.mjs",
            "FileIO.mjs",
            "BinaryOperate.mjs"
        ],
        shared: [
            "/css/BSIF_style.css"
        ]
    }))
});
self.addEventListener("fetch", event => { event.respondWith(cacheController.respond(event.request)) });
self.addEventListener("activate", event => { event.waitUntil(cacheController.clean()) });