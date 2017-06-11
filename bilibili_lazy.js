// ==UserScript==
// @name         bilibili_lazy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*.bilibili.com/*
// @grant        none
// ==/UserScript==

(function() {
	'use strict';

	// Your code here...

	var interval = 3000;
	var matchedLength = 0;
	var onclickRules = [
		"video",
		".bilibili-player-iconfont-fullscreen",
		".bilibili-player-iconfont-danmaku",
		".bilibili-player-iconfont-danmaku-off"
	];

	var queryMatchedNodes = function(){
		var nodes = [];
		for (var i = 0; i < onclickRules.length; i++) {
			// console.log(onclickRules);
			var list = Array.prototype.slice.call(document.querySelectorAll(onclickRules[i]));
			if (list && list.length > 0) {
				nodes = nodes.concat(list);
			}
		}
		return nodes;
	};

	var addClickMark = function(nodes) {
		for (var j = 0; j < nodes.length; j++) {
			// console.log(nodes);
			nodes[j].setAttribute("onclick", "");
		}
	};

	var run = function(){
		var matchedNodes = queryMatchedNodes();
		if(matchedNodes.length > matchedLength){
			matchedLength = matchedNodes.length;
			addClickMark(matchedNodes);
		}
		setTimeout(run, interval);
	};
	run();


})();
