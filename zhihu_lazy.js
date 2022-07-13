// ==UserScript==
// @name         zhihu_lay
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  try to take over the world!
// @author       You
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/0.16.1/axios.min.js
// @match        https://www.zhihu.com
// @match        https://www.zhihu.com/topic*
// @match        https://www.zhihu.com/explore
// @match        https://www.zhihu.com/collection/*
// @match        https://www.zhihu.com/question/*
// @match        https://www.zhihu.com/search?*type=content*
// @noframes     ignore iframes
// @grant        none
// ==/UserScript==

;;(function () {
  ;('use strict')

  // Your code here...
  var pathname = window.location.pathname
  var search = window.location.search
  var showAvatar = false
  //   var normalList = ["/collection", "/topic", "/explore"];
  var matchRules = [
    '.summary-wrapper a.author-link',
    "div.AuthorInfo-content div[aria-haspopup='true'] > a",
    'div.entry-meta a.author',
    'div.author-info a.author-link',
    // "div.PostIndex-author a.PostIndex-authorName",
  ]

  var onclickRules = ['.hidden-expanded', 'div.summary']

  var addClickMark = function () {
    var nodes = []
    for (var i = 0; i < onclickRules.length; i++) {
      var list = Array.prototype.slice.call(
        document.querySelectorAll(onclickRules[i])
      )
      if (list && list.length > 0) {
        nodes = nodes.concat(list)
      }
    }
    for (var j = 0; j < nodes.length; j++) {
      nodes[j].setAttribute('onclick', '')
    }
  }

  if (
    (pathname === '/search' && search.indexOf('type=content') > 0) ||
    pathname === '/explore' ||
    pathname === '/topic' ||
    pathname.indexOf('/collection') === 0
  ) {
    showAvatar = true
  }

  var style = document.createElement('style')
  style.type = 'text/css'
  style.innerHTML =
    '.following .follow-btn {display:none;} .unfollow .unfollow-btn {display:none;} .bar-item{position:relative;height:36px;display:flex; align-items: flex-end; padding:2px;border-bottom:1px solid #ddd;margin-bottom:10px;} .bar-width{width:200px} .follow-btn{color:#fff!important;background:#89c3ff; border:1px solid #ffffff;box-shadow:0 0 0 white inset;} .unfollow-btn{background: #eee; color: #888; border: 1px solid #ddd;} .follow-btn,.unfollow-btn{padding:0;margin:0;margin-left:16px;width:78px; height:26px; line-height:24px; font-size:12px; border-radius: 3px; cursor: pointer; box-sizing: border-box;} .bar-item .metax{display:flex;flex-direction:row;margin-right:10px;flex:1;height:20px;} .bar-item .metax a{color:#466f98;margin-right:20px} .bar-item .metax .key{color:#999;} .bar-item .metax .value{color:#555555;font-weight:bold;} .x-avatar{width:40px;height:40px;background:#ddd;position: absolute; right: 88px; bottom: 3px; border-radius: 3px;} .PageHeader .QuestionHeader-title{display:none}'

  document.getElementsByTagName('head')[0].appendChild(style)

  var apiUrl = '/api/v4/members/$username$/followers'

  var follow = function () {
    var self = this
    var userName = self.getAttribute('data-username')
    var url = apiUrl.replace('$username$', userName)
    axios
      .post(url, {})
      .then(function (response) {
        // console.log(response);
        self.parentNode.classList.remove('unfollow')
        self.parentNode.classList.add('following')
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  var unfollow = function () {
    var self = this
    var userName = self.getAttribute('data-username')
    var url = apiUrl.replace('$username$', userName)
    axios
      .delete(url, {})
      .then(function (response) {
        // console.log(response);
        self.parentNode.classList.remove('following')
        self.parentNode.classList.add('unfollow')
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  var createOP = function (user, data, sourceType) {
    var isFollowing = data.is_following
    var gender = data.gender
    var answer = data.answer_count
    var doc = data.articles_count
    var follower = data.follower_count
    var avatarUrl = data.avatar_url_template.replace('{size}', 'l')

    var userName = user.substr(user.lastIndexOf('/') + 1, user.length)

    var userCard = document.createElement('div')
    userCard.className = 'bar-item'

    userCard.innerHTML =
      '<div class="metax"> <a target="_blank" href="' +
      user +
      '/answers"> <span class="value">' +
      answer +
      '</span> <span class="key">回答</span> </a> <a target="_blank" href="' +
      user +
      '/posts"> <span class="value">' +
      doc +
      '</span> <span class="key">文章</span> </a> <a target="_blank" href="' +
      user +
      '/followers"> <span class="value">' +
      follower +
      '</span> <span class="key">关注者</span> </a></div>'

    var btn = document.createElement('div')
    var followClass = isFollowing ? 'following' : 'unfollow'
    btn.className = followClass

    if (sourceType === 1 || showAvatar) {
      var avatar = document.createElement('img')
      avatar.className = 'x-avatar'
      avatar.setAttribute('src', avatarUrl)
      userCard.appendChild(avatar)
    }

    var followingBtn = document.createElement('button')
    followingBtn.type = 'button'
    followingBtn.setAttribute('class', 'unfollow-btn')
    followingBtn.setAttribute('data-username', userName)
    followingBtn.innerHTML = '取消关注'
    followingBtn.addEventListener('click', unfollow)

    var unfollowedBtn = document.createElement('button')
    unfollowedBtn.type = 'button'
    unfollowedBtn.setAttribute('class', 'follow-btn')
    unfollowedBtn.setAttribute('data-username', userName)
    var who = ' Ta'
    console.log('gender: ' + gender)
    if (gender === 1) {
      who = '他'
      userCard.style.borderBottomColor = '#89c3ff'
      unfollowedBtn.style.cssText = 'border:1px solid #89c3ff;'
      followingBtn.style.cssText = 'border:1px solid #89c3ff;'
    } else if (gender === 0) {
      who = '她'
      userCard.style.borderBottomColor = '#ff65a1'
      unfollowedBtn.style.cssText =
        'border:1px solid #ff65a1;background-color:#ff65a1;'
      followingBtn.style.cssText = 'border:1px solid #ff65a1;'
    } else {
      userCard.style.borderBottomColor = '#c7a12c'
      unfollowedBtn.style.cssText =
        'border:1px solid #c7a12c;background-color:#c7a12c;'
      followingBtn.style.cssText = 'border:1px solid #c7a12c;'
    }
    unfollowedBtn.innerHTML = '关注' + who
    unfollowedBtn.addEventListener('click', follow)

    btn.id = 'btn_' + userName
    btn.appendChild(followingBtn)
    btn.appendChild(unfollowedBtn)
    userCard.appendChild(btn)
    return userCard
  }

  var getUserInfo = function (userlink) {
    var userPath = userlink.getAttribute('href')
    var displayName = userlink.innerText
    var userName = userPath.substr(
      userPath.lastIndexOf('/') + 1,
      userPath.length
    )
    var position = userlink.closest('div')
    if (userlink.closest('.AuthorInfo')) {
      position = userlink.closest('.AuthorInfo')
    }
    var sourceType = 0
    try {
      var feedSource = userlink
        .closest('.feed-main')
        .querySelector('.feed-source').innerText
      if (feedSource.indexOf(displayName) < 0) {
        sourceType = 1
      }
    } catch (error) {}
    position.classList.add('bain')
    axios
      .get(
        '/api/v4/members/' +
          userName +
          '?include=allow_message%2Cis_followed%2Cis_following%2Cis_org%2Cis_blocking%2Cemployments%2Canswer_count%2Cfollower_count%2Carticles_count%2Cgender%2Cbadge%5B%3F(type%3Dbest_answerer)%5D.topics'
      )
      .then(function (rsp) {
        var data = rsp.data
        if (!data) {
          return
        }
        // console.log(data);
        var op = createOP(userPath, data, sourceType)
        insertAfter(op, position)
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  var insertAfter = function (newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
  }

  var countUser = function (list) {
    for (var i = 0; i < list.length; i++) {
      var userlink = list[i]
      if (!userlink.closest('.bain')) {
        getUserInfo(userlink)
      }
    }
  }

  var queryUserList = function () {
    var userList = []
    for (var i = 0; i < matchRules.length; i++) {
      var list = Array.prototype.slice.call(
        document.querySelectorAll(matchRules[i])
      )
      if (list && list.length > 0) {
        userList = userList.concat(list)
      }
    }
    return userList
  }

  var userLinkList = []
  var userLength = 0
  var run = function () {
    userLinkList = queryUserList()
    if (userLinkList.length > userLength) {
      addClickMark()
      countUser(userLinkList)
      userLength = userLinkList.length
    }
    setTimeout(run, 3000)
  }
  run()
})()
