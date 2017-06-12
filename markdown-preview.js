// ==UserScript==
// @name         markdown-preview
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        file:///*.md
// @grant        none
// ==/UserScript==

(function() {
	'use strict';

	// Your code here...

	var requireList = [
		"https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_CHTML"
	];

	function injectMathJax(){
		var s = document.createElement('script');
		s.type = "text/x-mathjax-config";
		s.innerHTML = "MathJax.Hub.Config({ tex2jax: {inlineMath: [['$','$'], ['\\\\(','\\\\)']]} });";
		document.getElementsByTagName('head')[0].append(s);
	}

	function injectScript(src){
		var s, t;
		s = document.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = src;
		t = document.getElementsByTagName('head')[0]; t.append(s);
	}

	function loopInject(){
		for(var i=0;i<requireList.length;i++){
			injectScript(requireList[i]);
		}
	}

	injectMathJax();
	loopInject();

})();
