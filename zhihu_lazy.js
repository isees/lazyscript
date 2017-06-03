// ==UserScript==
// @name         zhihu_lazy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  直接显示知乎用户信息和关注/取关
// @author       You
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/0.16.1/axios.min.js
// @match        https://*.zhihu.com/*
// ==/UserScript==

/* jshint ignore:start */
var inline_src = (<><![CDATA[
/* jshint ignore:end */
    /* jshint esnext: false */
    /* jshint esversion: 6 */

    // Your code here...
    
    
    
    
    var style = document.createElement("style");
style.type = "text/css";
style.innerHTML = ".following .Button--blue { display: none; } .unfollow .Button--grey { display: none; }";
document.getElementsByTagName("head")[0].appendChild(style);

var apiUrl = "/api/v4/members/$username$/followers";

var follow = function() {
	var self = this;
	var userName = self.getAttribute("data-username");
	var url = apiUrl.replace("$username$", userName);
	axios.post(url, {}).then(function(response) {
		console.log(response);
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
		console.log(response);
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
	userCard.className = "HoverCard-item";

	userCard.innerHTML = '<div class="NumberBoard"> <a class="Button NumberBoard-item Button--plain" type="button" href="' + user + '/answers"> <div class="NumberBoard-name">回答</div> <div class="NumberBoard-value">' + answer + '</div> </a> <a class="Button NumberBoard-item Button--plain" type="button" href="' + user + '/posts"> <div class="NumberBoard-name">文章</div> <div class="NumberBoard-value">' + doc + '</div> </a> <a class="Button NumberBoard-item Button--plain" type="button" href="' + user + '/followers"> <div class="NumberBoard-name">关注者</div> <div class="NumberBoard-value">' + follower + '</div> </a> </div>';

	var btn = document.createElement("div");
	var followClass = isFollowing ? "following" : "unfollow";
	btn.className = "MemberButtonGroup ProfileButtonGroup HoverCard-buttons " + followClass;
	var who = "ta";
	if (gender == 1) {
		who = "他";
	} else if (gender == 0) {
		who = "她";
	}

	var followingBtn = document.createElement("button");
	followingBtn.type = "button";
	followingBtn.setAttribute("class", "Button FollowButton Button--primary Button--grey");
	followingBtn.setAttribute("data-username", userName);
	followingBtn.innerHTML = "<!-- react-text:  -->已关注<!-- /react-text -->";
	followingBtn.addEventListener("click", unfollow);

	var unfollowedBtn = document.createElement("button");
	unfollowedBtn.type = "button";
	unfollowedBtn.setAttribute("class", "Button FollowButton Button--primary Button--blue");
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

var getUserInfo = function(userlink) {
	var userPath = userlink.getAttribute("href");
	var userName = userPath.substr(userPath.lastIndexOf("/") + 1, userPath.length);

	axios.get('/api/v4/members/' + userName + '?include=allow_message%2Cis_followed%2Cis_following%2Cis_org%2Cis_blocking%2Cemployments%2Canswer_count%2Cfollower_count%2Carticles_count%2Cgender%2Cbadge%5B%3F(type%3Dbest_answerer)%5D.topics')
		.then(function(rsp) {
			var data = rsp.data;
			console.log(data);
			var is_following = data.is_following;
			var gender = data.gender;
			var answer = data.answer_count;
			var doc = data.articles_count;
			var follower = data.follower_count;
			insertAfter(createOP(userPath, answer, doc, follower, is_following, gender),
				userlink.closest(".AuthorInfo"));
		})
		.catch(function(error) {
			console.log(error);
		});
};

var insertAfter = function(newNode, referenceNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};

var countUser = function(list, num) {
	for (var i = list.length - num; i < list.length; i++) {
		var userlink = list[i];
		getUserInfo(userlink);
	}
};

var userLinkList = document.querySelectorAll("div.AuthorInfo-content div[aria-haspopup='true'] > a");
var userLength = userLinkList.length;
countUser(userLinkList, userLength);

setInterval(function() {
	userLinkList = document.querySelectorAll("div.AuthorInfo-content div[aria-haspopup='true'] > a");
	if (userLinkList.length > userLength) {
		countUser(userLinkList, userLinkList.length - userLength);
		userLength = userLinkList.length;
	}
}, 3000);


/* jshint ignore:start */
]]></>).toString();
var c = Babel.transform(inline_src, { presets: [ "es2015", "es2016" ] });
eval(c.code);
/* jshint ignore:end */