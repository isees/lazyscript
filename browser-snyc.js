// ==UserScript==
// @name         browsersync
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        file:///**/*.md
// @match        file:///**/*.htm
// @match        file:///**/*.html
// @grant        none
// ==/UserScript==

(function() {
	var src = document.createElement("script");
	src.async = true;
	src.src = "http://127.0.0.1:3000/browser-sync/browser-sync-client.js?v=2.18.12";
	document.head.appendChild(src);
})();
