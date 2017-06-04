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
	if (current && ["首页", "话题", "发现"].indexOf(current.innerText) >= 0) {
		currentIndex = 1;
	}

	var style = document.createElement("style");
	style.type = "text/css";
	style.innerHTML = ".following .follow-btn { display: none; } .unfollow .unfollow-btn { display: none; } .bar-item{ display: flex; align-items: center; padding: 2px; border-bottom: 1px solid #ddd; margin-bottom: 2px; } .bar-width{width:200px} .follow-btn, .unfollow-btn{padding:0;margin:0;margin-left:16px;} .bar-item .meta{width: 280px; display: flex; flex-direction: row; margin-right: 10px;} .bar-item .meta a{flex:1;}";

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

		var container = document.createElement("div");
		container.className = "HoverCard";

		var userCard = document.createElement("div");
		userCard.className = "HoverCard-item bar-item";

		userCard.innerHTML = '<div class="NumberBoard bar-width"> <a class="Button NumberBoard-item Button--plain" type="button" href="' + user + '/answers"> <div class="NumberBoard-name">回答</div> <div class="NumberBoard-value">' + answer + '</div> </a> <a class="Button NumberBoard-item Button--plain" type="button" href="' + user + '/posts"> <div class="NumberBoard-name">文章</div> <div class="NumberBoard-value">' + doc + '</div> </a> <a class="Button NumberBoard-item Button--plain" type="button" href="' + user + '/followers"> <div class="NumberBoard-name">关注者</div> <div class="NumberBoard-value">' + follower + '</div> </a> </div>';

		var btn = document.createElement("div");
		var followClass = isFollowing ? "following" : "unfollow";
		btn.className = "MemberButtonGroup ProfileButtonGroup HoverCard-buttons " + followClass;
		var who = "ta";
		if (gender === 1) {
			who = "他";
		} else if (gender === 0) {
			who = "她";
		}

		var followingBtn = document.createElement("button");
		followingBtn.type = "button";
		followingBtn.setAttribute("class", "Button FollowButton Button--primary Button--grey unfollow-btn");
		followingBtn.setAttribute("data-username", userName);
		followingBtn.innerHTML = "<!-- react-text:  -->已关注<!-- /react-text -->";
		followingBtn.addEventListener("click", unfollow);

		var unfollowedBtn = document.createElement("button");
		unfollowedBtn.type = "button";
		unfollowedBtn.setAttribute("class", "Button FollowButton Button--primary Button--blue follow-btn");
		unfollowedBtn.setAttribute("data-username", userName);
		unfollowedBtn.innerHTML = "<!-- react-text:  -->关注" + who + "<!-- /react-text -->";
		unfollowedBtn.addEventListener("click", follow);

		btn.id = "btn_" + userName;
		btn.appendChild(followingBtn);
		btn.appendChild(unfollowedBtn);
		userCard.appendChild(btn);
		container.appendChild(userCard);
		return container;
	};


	var createIndexOP = function(user, answer, doc, follower, isFollowing, gender) {

		var userName = user.substr(user.lastIndexOf("/") + 1, user.length);

		var container = document.createElement("div");
		container.className = "lower clearfix";

		var userCard = document.createElement("div");
		userCard.className = "HoverCard-item bar-item";

		userCard.innerHTML = '<div class="meta"> <a class="item" target="_blank" href="' + user + '/answers"> <span class="value">' + answer + '</span> <span class="key">回答</span> </a> <a class="item" target="_blank" href="' + user + '/posts"> <span class="value">' + doc + '</span> <span class="key">文章</span> </a> <a class="item" target="_blank" href="' + user + '/followers"> <span class="value">' + follower + '</span> <span class="key">关注者</span> </a></div>';

		var btn = document.createElement("div");
		var followClass = isFollowing ? "following" : "unfollow";
		btn.className = "operation " + followClass;
		var who = "ta";
		if (gender === 1) {
			who = "他";
		} else if (gender === 0) {
			who = "她";
		}

		var followingBtn = document.createElement("button");
		followingBtn.type = "button";
		followingBtn.setAttribute("class", "zg-btn zg-btn-unfollow zm-rich-follow-btn unfollow-btn");
		followingBtn.setAttribute("data-username", userName);
		followingBtn.innerHTML = "取消关注";
		followingBtn.addEventListener("click", unfollow);

		var unfollowedBtn = document.createElement("button");
		unfollowedBtn.type = "button";
		unfollowedBtn.setAttribute("class", "zg-btn zg-btn-follow zm-rich-follow-btn follow-btn");
		unfollowedBtn.setAttribute("data-username", userName);
		unfollowedBtn.innerHTML = "关注" + who;
		unfollowedBtn.addEventListener("click", follow);

		btn.id = "btn_" + userName;
		btn.appendChild(followingBtn);
		btn.appendChild(unfollowedBtn);
		userCard.appendChild(btn);
		container.appendChild(userCard);
		return container;
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
				var op = currentIndex === 1 ? createIndexOP(userPath, answer, doc, follower, is_following, gender) : createOP(userPath, answer, doc, follower, is_following, gender);
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
