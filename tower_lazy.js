// ==UserScript==
// @name         tower_lazy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  show action bar
// @author       You
// @match        https://tower.im/projects/*/todos/*
// @grant        none
// ==/UserScript==

(function() {
	'use strict';

	// Your code here...

	var style = document.createElement("style");
	style.type = "text/css";
	style.innerHTML = ".todolist .actions{display:block;}";
	document.getElementsByTagName("head")[0].appendChild(style);

})();
