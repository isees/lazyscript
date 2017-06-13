// ==UserScript==
// @name         tower_lazy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  show action bar
// @author       You
// @match        https://tower.im/projects/*
// @grant        none
// ==/UserScript==

(function() {
	'use strict';

	// Your code here...
	var matchedLength = 0;
	var clickMarkRules = [
		"div.checkbox-container"
	];

	var style = document.createElement("style");
	style.type = "text/css";
	style.innerHTML = ".todolist .actions{display:block;}";
	document.getElementsByTagName("head")[0].appendChild(style);


	var queryMatchedNodes = function() {
		var nodes = [];
		for (var i = 0; i < clickMarkRules.length; i++) {
			var matchList = document.querySelectorAll(clickMarkRules[i]);
			nodes = nodes.concat([].slice.call(matchList));
		}
		return nodes;
	};

	var addClickMark = function(nodes) {
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];
			node.setAttribute("onclick", "");
		}
	};

	var run = function() {
		var matchNodes = queryMatchedNodes();
		if (matchNodes.length > matchedLength) {
			matchedLength = matchNodes.length;
			addClickMark(matchNodes);
		}
		setTimeout(run, 3000);
	};

	run();

})();
