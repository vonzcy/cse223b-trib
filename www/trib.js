// Generated by CoffeeScript 1.6.3
(function() {
  var addUser, appendError, countPostLength, follow, hoveringFollow, listTribs, listUsers, main, me, postTrib, showHome, showUser, showing, signIn, signOut, unfollow, updateFollow, updateUsers, _showHome, _updateFollow;

  me = "";

  showing = "";

  listTribs = function(data) {
    var li, ret, trib, tribs, ul, _i, _len, _ref;
    ret = JSON.parse(data);
    if (ret.Err !== "") {
      appendError(ret.Err);
      return;
    }
    tribs = $("div#tribs");
    tribs.empty();
    if (ret.Tribs.length === 0) {
      tribs.append("No Tribble.");
      return;
    }
    ul = $("<ul/>");
    ret.Tribs.reverse();
    _ref = ret.Tribs;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      trib = _ref[_i];
      li = $("<li/>");
      li.append('<span class="author">@' + trib.User + '</span> ');
      li.append('<span class="time">' + trib.Time + '</span> ');
      li.append($('<span class="trib" />').text(trib.Message));
      ul.append(li);
    }
    tribs.append(ul);
  };

  showHome = function(ev) {
    ev.preventDefault();
    _showHome();
  };

  _showHome = function() {
    console.log("show home: " + me);
    $.ajax({
      url: "api/list-home",
      type: "POST",
      data: me,
      success: listTribs,
      cache: false
    });
    showing = "!home";
    $("div#timeline").show();
    $("div#whom").hide();
    $("a#follow").hide();
    $("div#tribs").empty();
    $("h2#title").html("Home of " + me);
  };

  showUser = function(ev) {
    var name;
    ev.preventDefault();
    name = $(this).text();
    console.log("show user: " + name);
    $.ajax({
      url: "api/list-tribs",
      type: "POST",
      data: name,
      success: listTribs,
      cache: false
    });
    showing = name;
    $("h2#title").html(name);
    $("div#tribs").empty();
    $("div#timeline").show();
    $("div#whom").show();
    $("a#follow").show();
    updateFollow();
  };

  updateUsers = function(data) {
    var name, ret, ul, users, _i, _len, _ref;
    ret = JSON.parse(data);
    if (ret.Err !== "") {
      appendError(ret.Err);
      return;
    }
    users = $("#users");
    users.empty();
    if (ret.Users.length === 0) {
      users.append("No user.");
      return;
    }
    ul = $("<ul/>");
    _ref = ret.Users;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      name = _ref[_i];
      ul.append('<li><a href="#">' + name + '</a></li>');
    }
    users.append(ul);
    $("#users li").click(showUser);
  };

  addUser = function() {
    var name;
    name = $("form#adduser input#username").val();
    if (name === "") {
      return false;
    }
    $("form#adduser input#username").val("");
    console.log("add user", name);
    $.ajax({
      url: "api/add-user",
      type: "POST",
      data: name,
      success: updateUsers,
      cache: false
    });
    return false;
  };

  listUsers = function() {
    $.ajax({
      url: "api/list-users",
      success: updateUsers,
      cache: false
    });
  };

  appendError = function(e) {
    $("div#errors").show();
    return $("div#errors").append('<div class="error">Error: ' + e + '</div>');
  };

  postTrib = function() {
    return false;
  };

  signIn = function(ev) {
    ev.preventDefault();
    if (showing === "" || showing === "!home") {
      return;
    }
    console.log("sigin in as: " + showing);
    me = showing;
    $("div#who").show();
    $("div#who h3").html("Signed in as " + me);
    $("div#compose").show();
    _showHome();
    updateFollow();
  };

  signOut = function(ev) {
    console.log("sign out");
    ev.preventDefault();
    me = "";
    $("div#who").hide();
    $("div#compose").hide();
    $("a#follow").hide();
    if (showing === "!home") {
      $("div#timeline").hide();
    }
  };

  hoveringFollow = false;

  _updateFollow = function(data) {
    var but, ret;
    but = $("a#follow");
    ret = JSON.parse(data);
    if (ret.Err !== "") {
      appendError(ret.Err);
      return;
    }
    but.unbind("mouseenter mouseleave");
    but.unbind("click");
    if (ret.V) {
      if (hoveringFollow) {
        but.html("Unfollow");
      } else {
        but.html("Following");
      }
      but.hover((function(ev) {
        $(this).html("Unfollow");
        hoveringFollow = true;
      }), (function(ev) {
        $(this).html("Following");
        hoveringFollow = false;
      }));
      but.click(unfollow);
    } else {
      but.html("Follow");
      but.hover((function(ev) {
        hoveringFollow = true;
      }), (function(ev) {
        hoveringFollow = false;
      }));
      but.click(follow);
    }
  };

  follow = function(ev) {
    ev.preventDefault();
    $.ajax({
      url: "api/follow",
      type: "POST",
      data: JSON.stringify({
        Who: me,
        Whom: showing
      }),
      success: _updateFollow,
      cache: false
    });
  };

  unfollow = function(ev) {
    ev.preventDefault();
    $.ajax({
      url: "api/unfollow",
      type: "POST",
      data: JSON.stringify({
        Who: me,
        Whom: showing
      }),
      success: _updateFollow,
      cache: false
    });
  };

  updateFollow = function() {
    if (me === "" || showing === "!home") {
      $("a#follow").hide();
      return;
    }
    $("a#follow").html("&nbsp;");
    $.ajax({
      url: "api/is-following",
      type: "POST",
      data: JSON.stringify({
        Who: me,
        Whom: showing
      }),
      success: _updateFollow,
      cache: false
    });
  };

  countPostLength = function() {
    var left, len, text;
    text = $("form#post textarea").val();
    len = text.length;
    left = 140 - len;
    $("span#nchar").text("" + left);
    if (left < 0) {
      $("span#nchar").addClass("ncharover");
    } else {
      $("span#nchar").removeClass("ncharover");
    }
  };

  main = function() {
    $("form#adduser").submit(addUser);
    $("form#post").submit(postTrib);
    $("div#errors").hide();
    $("div#timeline").hide();
    $("a#signin").click(signIn);
    $("a#home").click(showHome);
    $("a#signout").click(signOut);
    $("form#post textarea").keydown(function() {
      return setTimeout((function() {
        return countPostLength();
      }), 1);
    });
    $("form#post textarea").keypress(function() {
      return setTimeout((function() {
        return countPostLength();
      }), 1);
    });
    $("form#post textarea").keyup(countPostLength);
    $("form#post textarea").change(countPostLength);
    listUsers();
  };

  $(document).ready(main);

}).call(this);
