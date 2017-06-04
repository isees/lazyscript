// ==UserScript==
// @name         zhihu_lay 0.2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/0.16.1/axios.min.js
// @match        https://*.zhihu.com/*
// @grant        none
// ==/UserScript==

(function() {
	'use strict';

	// Your code here...
	var currentIndex = 0;
	var current = document.querySelector("li.current > a");
	if ((current && ["首页", "话题", "发现"].indexOf(current.innerText) >= 0)) {
		currentIndex = 1;
	} else {
		var tab = document.querySelector("div.search-tabs li.active a");
		if (tab && tab.innerText === "内容") {
			currentIndex = 1;
		}
	}

	var style = document.createElement("style");
	style.type = "text/css";
	style.innerHTML = ".following .follow-btn {display:none;} .unfollow .unfollow-btn {display:none;} .bar-item{height:30px;display:flex; align-items:center; padding:2px;border-bottom:1px solid #ddd;margin-bottom:10px;} .bar-width{width:200px} .follow-btn{color:#fff!important;background:#89c3ff; border:1px solid #ffffff;box-shadow:0 0 0 white inset;} .unfollow-btn{background: #eee; color: #888; border: 1px solid #ddd;} .follow-btn,.unfollow-btn{padding:0;margin:0;margin-left:16px;width:78px; height:26px; line-height:24px; font-size:12px; border-radius: 3px; cursor: pointer; box-sizing: border-box;} .bar-item .metax{display:flex;flex-direction:row;margin-right:10px;flex:1;height:14px;} .bar-item .metax a{color:#466f98;margin-right:20px} .bar-item .metax .key{color:#999;} .bar-item .metax .value{color:#555555;font-weight:bold;}";

	document.getElementsByTagName("head")[0].appendChild(style);

	var apiUrl = "/api/v4/members/$username$/followers";

	var follow = function() {
		var self = this;
		var userName = self.getAttribute("data-username");
		var url = apiUrl.replace("$username$", userName);
		axios.post(url, {}).then(function(response) {
			// console.log(response);
			self.parentNode.classList.remove("unfollow");
			self.parentNode.classList.add("following");
		}).catch(function(error) {
			console.log(error);
		});
	};

	var unfollow = function() {
		var self = this;
		var userName = self.getAttribute("data-username");
		var url = apiUrl.replace("$username$", userName);
		axios.delete(url, {}).then(function(response) {
			// console.log(response);
			self.parentNode.classList.remove("following");
			self.parentNode.classList.add("unfollow");
		}).catch(function(error) {
			console.log(error);
		});
	};


	var createOP = function(user, answer, doc, follower, isFollowing, gender) {

		var userName = user.substr(user.lastIndexOf("/") + 1, user.length);

		var userCard = document.createElement("div");
		userCard.className = "bar-item";

		userCard.innerHTML = '<div class="metax"> <a target="_blank" href="' + user + '/answers"> <span class="value">' + answer + '</span> <span class="key">回答</span> </a> <a target="_blank" href="' + user + '/posts"> <span class="value">' + doc + '</span> <span class="key">文章</span> </a> <a target="_blank" href="' + user + '/followers"> <span class="value">' + follower + '</span> <span class="key">关注者</span> </a></div>';

		var btn = document.createElement("div");
		var followClass = isFollowing ? "following" : "unfollow";
		btn.className = followClass;
		var who = "ta";
		if (gender === 1) {
			who = "他";
		} else if (gender === 0) {
			who = "她";
		}

		var followingBtn = document.createElement("button");
		followingBtn.type = "button";
		followingBtn.setAttribute("class", "unfollow-btn");
		followingBtn.setAttribute("data-username", userName);
		followingBtn.innerHTML = "取消关注";
		followingBtn.addEventListener("click", unfollow);

		var unfollowedBtn = document.createElement("button");
		unfollowedBtn.type = "button";
		unfollowedBtn.setAttribute("class", "follow-btn");
		unfollowedBtn.setAttribute("data-username", userName);
		unfollowedBtn.innerHTML = "关注" + who;
		unfollowedBtn.addEventListener("click", follow);

		btn.id = "btn_" + userName;
		btn.appendChild(followingBtn);
		btn.appendChild(unfollowedBtn);
		userCard.appendChild(btn);
		return userCard;
	};

	var getUserInfo = function(userlink) {
		var userPath = userlink.getAttribute("href");
		var userName = userPath.substr(userPath.lastIndexOf("/") + 1, userPath.length);
		var position = userlink.closest(".AuthorInfo");
		if (currentIndex === 1) {
			position = userlink.closest(".summary-wrapper");
		}
		position.classList.add("bain");
		axios.get('/api/v4/members/' + userName + '?include=allow_message%2Cis_followed%2Cis_following%2Cis_org%2Cis_blocking%2Cemployments%2Canswer_count%2Cfollower_count%2Carticles_count%2Cgender%2Cbadge%5B%3F(type%3Dbest_answerer)%5D.topics')
			.then(function(rsp) {
				var data = rsp.data;
				// console.log(data);
				var is_following = data.is_following;
				var gender = data.gender;
				var answer = data.answer_count;
				var doc = data.articles_count;
				var follower = data.follower_count;
				var op = createOP(userPath, answer, doc, follower, is_following, gender);
				insertAfter(op, position);
			})
			.catch(function(error) {
				console.log(error);
			});
	};

	var insertAfter = function(newNode, referenceNode) {
		referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
	};

	var countUser = function(list, num) {
		for (var i = 0; i < list.length; i++) {
			var userlink = list[i];
			if (!userlink.closest(".bain")) {
				getUserInfo(userlink);
			}
		}
	};

	var queryUserList = function() {
		var userList = [];
		if (currentIndex === 1) {
			userList = document.querySelectorAll(".summary-wrapper a.author-link");
		} else {
			userList = document.querySelectorAll("div.AuthorInfo-content div[aria-haspopup='true'] > a");
		}
		return userList;
	};

	var userLinkList = queryUserList();
	var userLength = userLinkList.length;
	countUser(userLinkList, userLength);

	setInterval(function() {
		userLinkList = queryUserList();
		// console.log(userLinkList.length, userLength);
		if (userLinkList.length > userLength) {
			countUser(userLinkList, userLinkList.length - userLength);
			userLength = userLinkList.length;
		}
	}, 3000);

})();
