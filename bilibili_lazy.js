// ==UserScript==
// @name         bilibili_lazy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *.bilibili.com/*
// @noframes     ignore iframes
// @grant        none
// ==/UserScript==

(function() {
  "use strict";

  // Your code here...

  var interval = 3000;
  var matchedLength = 0;
  var onclickRules = [
    "video",
    ".bilibili-player-iconfont-fullscreen",
    ".bilibili-player-iconfont-danmaku",
    ".bilibili-player-iconfont-danmaku-off"
  ];

  var queryMatchedNodes = function() {
    var nodes = [];
    for (var i = 0; i < onclickRules.length; i++) {
      var list = Array.prototype.slice.call(
        document.querySelectorAll(onclickRules[i])
      );
      if (list && list.length > 0) {
        nodes = nodes.concat(list);
      }
    }
    return nodes;
  };

  var addClickMark = function(nodes) {
    var matchedNodes = queryMatchedNodes();
    if (matchedNodes.length > matchedLength) {
      matchedLength = matchedNodes.length;
      for (var j = 0; j < nodes.length; j++) {
        nodes[j].setAttribute("onclick", "");
      }
    }
  };

  var newNoticeClick = function() {
    var notice = document.querySelector("div.new-notice-bar");
    if (notice == null) {
      return;
    }
    notice.click();
  };

  var run = async function() {
    while (true) {
      addClickMark();
      newNoticeClick();
      await new Promise(r => setTimeout(r, interval));
    }
    setTimeout(run, interval);
  };

  run();
})();
