// ==UserScript==
// @name         Github Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://github.com/*
// @grant        none
// ==/UserScript==

(function() {
	'use strict';

	// Your code here...
	var detail = document.querySelector(".overall-summary ~ .details-reset");
	if(detail!=null){
		detail.setAttribute("open", "");
	}
})();
