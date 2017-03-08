var verbose = verbose || true;

function addParam(uri, key, value) { //string/url building
	var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
	var separator = uri.indexOf('?') !== -1 ? "&" : "?";
	if (uri.match(re)) return uri.replace(re, '$1' + key + "=" + value + '$2');
	else return uri + separator + key + "=" + value;
}

class getReddit{
	constructor (){
	//uri		
		this.dir = []; //directory array .com/dir[0]/dir[1]/etc
		this.uri = '';
		this.uriParams = {};
		this.noOauth = false; //force non-oauth	
		this.ajax = {
			timeout: 6000,
			beforeSend: function (jqXHR) { 
				jqXHR.setRequestHeader("Authorization", "bearer " + localStorage.access_token); 
			}
		};
	//Login/client data:
		this.client_id = 'yYMefyDnpSKWhw'; //your client_id here
		this.redirect_uri = 'http://127.0.0.1:8000/?login=true'; //YOUR redirect_uri here: https://www.reddit.com/prefs/apps/
		this.loginURI = { 
			client_id: this.client_id,
			response_type: "code", //code for first login, token for refresh
			state:  window.location.pathname+window.location.search, //"RANDOM_STRING", //https://github.com/reddit/reddit/wiki/OAuth2#authorization
			redirect_uri: this.redirect_uri, 
			duration: "permanent",
			scope: 'save,identity,edit,flair,history,modconfig,modflair,modlog,modposts,modwiki,mysubreddits,privatemessages,read,report,submit,subscribe,vote,wikiedit,wikiread',
		};
		this.loginURL = "https://www.reddit.com/api/v1/authorize"; 
			for(var opt in this.loginURI) if(this.loginURI[opt]) this.loginURL = addParam(this.loginURL, opt, this.loginURI[opt]); //build login string		
		this.loginLink = this.loginURL; //set login link	
		this.f = []; //functions
	}

//get page (last call for all trains function)
	go(cb, err){
		//make URI
		this.uri = '/';
		for (var i = 0; i < this.dir.length; i++) this.uri += this.dir[i]+'/';

		var res = function(x){ cb((typeof x !== 'object')?JSON.parse(x):x); }
		if (localStorage.getItem("loggedIn") == "true" && !this.noOauth) this.getAuth(res, err);
		else this.unAuth(res, err);
		return this;
	}
//get oauth
	getAuth(res, err){
		for(var name in this.uriParams) if(this.uriParams[name]) this.uri = addParam(this.uri, name, this.uriParams[name]);
		var url = "https://oauth.reddit.com"+this.uri;
		if(verbose)  console.log("getAuth()", url);				
		this.ajax.url = url;
		this.ajax.success = res;
		this.ajax.error = err;
		var that = this;
		this.refresh(function(reply){
			$.ajax(that.ajax);
		});
	}
//get unAuth
	unAuth(res, err){
		this.uri += '.json';
		for(var name in this.uriParams) if(this.uriParams[name]) this.uri = addParam(this.uri, name, this.uriParams[name]);
		var url = "https://www.reddit.com"+this.uri;
		if(verbose)  console.log("unAuth()", url);

		var xhr = new XMLHttpRequest();
			xhr.open("GET", url, true);
			xhr.onload = function () {
				return res(xhr.response);
			};
			xhr.onerror = function () {
				if (err !== undefined) {
					// return err(xhr.response);
					return err(xhr.response);
				}
			};
			xhr.send();
	}
	
//login
	login(code, state, callback){
		var client_id = this.client_id;
		var uri = this.redirect_uri;
		if(verbose) console.log("code: "+code, "state: "+state, "client_id: "+client_id, "uri: "+uri);

		//clear tokens (it's loginpage)
		console.log("localStorage.clear()");
		localStorage.clear();

	//login code
		$.ajax({
			type: "POST",
			url: 'https://ssl.reddit.com/api/v1/access_token',
			data: {
				code: code,
				client_id: client_id,
				redirect_uri: uri,
				state: state,
				grant_type: 'authorization_code'
			},
			username: client_id,
			crossDomain: true,
			beforeSend: function(xhr){
				xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + ''));
			},
			success: function(data, x, y){
				if(verbose) console.log("  data", data, "x", x, "y", y);

				localStorage.setItem("access_token",  data.access_token);
				localStorage.setItem("refresh_token",  data.refresh_token);
				localStorage.setItem("scope",  data.scope);
				localStorage.setItem("loggedIn", true);

				if(verbose) console.log("  new access_token: "+localStorage.access_token);
				if(verbose) console.log("  new refresh_token: "+localStorage.refresh_token);
				if(verbose) console.log("  new scope: "+localStorage.scope);
				if(verbose) console.log("  new loggedIn: "+localStorage.loggedIn);

				callback(data);
			},
			error: function (data) {
				console.log("ERROR: REFRESH FAILED", data);
			}
		});
	}

//refresh token
	refresh(callback){
		var client_id = this.client_id;
		var uri = this.redirect_uri;
	//refresh code
		$.ajax({
			type: "POST",
			url: 'https://ssl.reddit.com/api/v1/access_token',
			data: {
				client_id: client_id,
				grant_type: 'refresh_token',
				refresh_token: localStorage.refresh_token,
				scope: localStorage.scope,
				state: 'RANDOM_STRING',
				duration: 'permanent',
				redirect_uri: uri,
			},
			username: client_id,
			crossDomain: true,
			beforeSend: function(xhr){
				xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + ''));
			},
			success: function(data, x, y){
				if(verbose) console.log("  token refreshed");
				// if(verbose) console.log("  data", data, "x", x, "y", y);
				localStorage.setItem("access_token",  data.access_token);
				//localStorage.setItem("refresh_token",  data.refresh_token); //refresh token stays the same
				localStorage.setItem("scope",  data.scope);
				localStorage.setItem("loggedIn", true);

				// if(verbose) console.log("  new access_token: "+localStorage.access_token);
				// if(verbose) console.log("  new refresh_token: "+localStorage.refresh_token);
				// if(verbose) console.log("  new scope: "+localStorage.scope);
				// if(verbose) console.log("  new loggedIn: "+localStorage.loggedIn);

				callback(data);
			},
			error: function (data) {
				console.log("ERROR: REFRESH FAILED", data);
			}
		});
	}
	

/*

	THE API CHEKLIST:
	all endpoints listed on https://www.reddit.com/dev/api

*/

//listings -> uri parameters
	after(s){ this.uriParams.after=s; return this; }
	before(s){  this.uriParams.before=s; return this; }
	limit(s){  this.uriParams.limit=s; return this; }
	count(s){  this.uriParams.count=s; return this; }
	show(s){  this.uriParams.show=s; return this; }
	sr_detail(s){  this.uriParams.sr_detail=s; return this; }
	sort(s){  this.uriParams.sort=s; return this; } // sort	one of relevance OR activity (/subreddits/search)

//modhashes
	//afaik these are obsolete

//API

// account
// /api/v1/me
	me(x){	
		this.dir = ["api","v1", "me"];
	// /api/v1/me/blocked
	// /api/v1/me/friends
	// /api/v1/me/karma
	// /api/v1/me/prefs
	// /api/v1/me/trophies
		if(x) this.dir.push(x);		
		this.ajax.method = "GET";	
		return this;
	}
	prefs(x){
		this.dir = ["prefs"];
	// /prefs/blocked
	// /prefs/friends
	// /prefs/messaging
	// /prefs/trusted
		if(x) this.dir.push(x); // /prefs/where
		this.ajax.method = "GET";
		return this;
	}

// captcha
// /api/needs_captcha

// flair
// /api/clearflairtemplates
// /api/deleteflair
// /api/deleteflairtemplate
// /api/flair
// /api/flairconfig
// /api/flaircsv
// /api/flairlist
// /api/flairselector
// /api/flairtemplate
// /api/selectflair
// /api/setflairenabled

// reddit gold
// /api/v1/gold/gild/fullname
// /api/v1/gold/give/username

// links & comments
// /api/comment
	comment(parent, txt){
		this.dir = ["api","comment"];
		this.ajax.method =  "POST";
		this.ajax.data = { api_type: "json", text: txt, thing_id: parent };
		this.ajax.async=  true;
		return this;
	}
// /api/del
	delete(name){
		this.dir = ["api","del"];
		this.ajax.method = "POST";
		this.ajax.data = { id: name, modhash: "null" };
		return this;
	}
// /api/editusertext
	editusertext(parent, txt){
		this.comment(parent, txt);
		this.dir = ["api","editusertext"];
		return this;
	}
// /api/hide
	hide(name){
		this.dir = ["api","hide"];
		this.ajax.method = "POST";
		this.ajax.data = { id: name, modhash: "null" };
		return this;
	}
// /api/unhide
	unhide(name){
		this.dir = ["api","unhide"];
		this.ajax.method = "POST";
		this.ajax.data = { id: name, modhash: "null" };
		return this;
	}
// /api/info
	info(name){
		this.dir = ["api","info"];
		this.ajax.method = "GET";
		this.ajax.data = { id: name, modhash: "null" };
		return this;
	}
// /api/lock
	lock(name){
		this.dir = ["api","lock"];
		this.ajax.method = "POST";
		this.ajax.data = { id: name, modhash: "null" };
		return this;
	}
// /api/unlock
	unlock(name){
		this.dir = ["api","unlock"];
		this.ajax.method = "POST";
		this.ajax.data = { id: name, modhash: "null" };
		return this;
	}
// /api/marknsfw
	marknsfw(name){
		this.dir = ["api","marknsfw"];
		this.ajax.method = "POST";
		this.ajax.data = { id: name, modhash: "null" };
		return this;
	}
// /api/unmarknsfw
	unmarknsfw(name){
		this.dir = ["api","unmarknsfw"];
		this.ajax.method = "POST";
		this.ajax.data = { id: name, modhash: "null" };
		return this;
	}
// /api/morechildren
// /api/report
// /api/save
	save(name, categoryName){
		this.dir = ["api","save"];
		this.ajax.method = "POST";
		this.ajax.data = { id: name, category: categoryName, modhash: "null" };
		return this;
	}
// /api/unsave
	unsave(name, categoryName){
		this.dir = ["api","unsave"];
		this.ajax.method = "POST";
		this.ajax.data = { id: name, category: categoryName, modhash: "null" };
		return this;
	}
// /api/saved_categories
	saved_categories(){
		this.dir = ["api","saved_categories"];
		this.ajax.method = "GET";
		this.ajax.data = { id: name, modhash: "null" };
		return this;
	}
// /api/sendreplies
	sendreplies(name, state){
		this.dir = ["api","sendreplies"];
		this.ajax.method = "POST";
		this.ajax.data = { id: name, state: state, modhash: "null" };
		return this;
	}
// /api/set_contest_mode
	set_contest_mode(name, state){
		this.dir = ["api","set_contest_mode"];
		this.ajax.method = "POST";
		this.ajax.data = { api_type: "json", id: name, state: state, modhash: "null" };
		return this;
	}
// /api/set_subreddit_sticky
	set_subreddit_sticky(name, state, num){
		this.dir = ["api","set_contest_mode"];
		this.ajax.method = "POST";
		this.ajax.data = { api_type: "json", num: num, id: name, state: state, modhash: "null" };
		return this;
	}
// /api/set_suggested_sort
	set_suggested_sort(name, sort){
		this.dir = ["api","set_suggested_sort"];
		this.ajax.method = "POST";
		this.ajax.data = { api_type: "json", sort: sort, id: name, modhash: "null" };
		return this;
	}
// /api/spoiler
	spoiler(name){
		this.dir = ["api","spoiler"];
		this.ajax.method = "POST";
		this.ajax.data = { id: name, modhash: "null" };
		return this;
	}
// /api/unspoiler
	unspoiler(name){
		this.dir = ["api","unspoiler"];
		this.ajax.method = "POST";
		this.ajax.data = { id: name, modhash: "null" };
		return this;
	}
// /api/store_visits
// /api/submit
// /api/vote
	vote(name, dir, rank){
		this.dir = ["api","vote"];
		this.ajax.method = "POST";
		this.ajax.data = { id: name, dir: dir, rank: rank, modhash: "null" };
		return this;
	}

// listings
// /by_id/names
	by_id(fullname){ 
		this.dir[0] = "by_id";
		this.dir[1] = fullname;
		return this;
	}

// live threads
// /api/live/by_id/names
// /api/live/create
// /api/live/happening_now
// /api/live/thread/accept_contributor_invite
// /api/live/thread/close_thread
// /api/live/thread/delete_update
// /api/live/thread/edit
// /api/live/thread/invite_contributor
// /api/live/thread/leave_contributor
// /api/live/thread/report
// /api/live/thread/rm_contributor
// /api/live/thread/rm_contributor_invite
// /api/live/thread/set_contributor_permissions
// /api/live/thread/strike_update
// /api/live/thread/update
// /live/thread
// /live/thread/about
// /live/thread/contributors
// /live/thread/discussions

// private messages
// /api/block
// /api/collapse_message
// /api/compose
// /api/del_msg
// /api/read_all_messages
// /api/read_message
// /api/unblock_subreddit
// /api/uncollapse_message
// /api/unread_message
// /message/inbox
// /message/sent
// /message/unread
// /message/where

// misc
// /api/v1/scopes

// moderation
// /about/edited
// /about/log
// /about/modqueue
// /about/reports
// /about/spam
// /about/unmoderated
// /about/location
// /api/accept_moderator_invite
// /api/approve
// /api/distinguish
// /api/ignore_reports
// /api/leavecontributor
// /api/leavemoderator
// /api/mute_message_author
// /api/remove
// /api/unignore_reports
// /api/unmute_message_author
// /stylesheet

// new modmail
// /api/mod/bulk_read
// /api/mod/conversations
// /api/mod/conversations/:conversation_id
// /api/mod/conversations/:conversation_id/archive
// /api/mod/conversations/:conversation_id/highlight
// /api/mod/conversations/:conversation_id/mute
// /api/mod/conversations/:conversation_id/unarchive
// /api/mod/conversations/:conversation_id/unmute
// /api/mod/conversations/:conversation_id/user
// /api/mod/conversations/read
// /api/mod/conversations/subreddits
// /api/mod/conversations/unread
// /api/mod/conversations/unread/count

// multis
// /api/filter/filterpath
// /api/filter/filterpath/r/srname
// /api/multi/copy
// /api/multi/mine
// /api/multi/rename
// /api/multi/user/username
// /api/multi/multipath
// /api/multi/multipath/description
// /api/multi/multipath/r/srname

// search
	//advancedSearch()? 
	/* this is so tied to the UI I don't know how to present it here in a way that's helpful and not cumbersome... */
	search(searchBall){
		this.uriParams = searchBall;
		if(this.dir.length == 0 || this.dir[0] == "r") dir.push("search");
		// if(this.dir[0] == "user" && dir[1]){
		// 	this.uriParams.q += "author:"+dir[1];
		// 	dir = ["search"]; //all other user page functions are now fucked...
		// }
		var that = this;
		return { //sorting
			relevance: function(){ 
				that.uriParams.sort = 'relevance'; 
				return that;
			},
			top: function(t){
				that.uriParams.sort = 'top';
				that.uriParams.t = t;
				return that;
			},
			newest: function(){ 
				that.uriParams.sort = 'new'; 
				return that;
			},
			comments: function(t){
				that.uriParams.sort = 'comments';
				that.uriParams.t = t;
				return that;
			},
		//listing options
			after: that.after.bind(that),
			before: that.before.bind(that),
			count: that.count.bind(that),
			show: that.show.bind(that),
			sr_detail: that.sr_detail.bind(that),
		//go
			go: that.go.bind(that)
		}
	}

// subreddit
	subreddit(subreddit){  
		this.dir[0] = "r";
		this.dir[1] = subreddit;

		var that = this;
		var sorting = {
// /comments/article
			comments: function(article){ 
				that.dir[0] = "r";
				that.dir[2] = "comments";
				that.dir[3] = article;		
				var sorting = {
					sort: function(t){
						if(t=="newest") t = "new";
						that.uriParams.sort = t;
						return that;
					},
					go: that.go.bind(that)
				}
				return sorting;
			},
// /duplicates/article
			duplicates: function(article){ 
				that.dir[2] = "duplicates";
				that.dir[3] = article;
				return that; 
			},
// /controversial
			controversial: function(t){ 
				that.dir[2] = "controversial";
				that.uriParams.sort = 'controversial';
				that.uriParams.t = t;
				return that; 
			},
// /hot
			hot: function(){ 
				that.dir[2] = "hot";
				that.uriParams.sort = 'hot';
				return that; 
			},
// /new
			newest: function(){ //-_-
				that.dir[2] = "new";
				that.uriParams.sort = 'new';
				return that; 
			},
// /random
		/*//CORS rejects Redirects.....
			random: function(){
				that.dir[1] = "random";
				return that; 
			},
		*/
// /rising
			rising: function(){ 
				that.dir[2] = "rising";
				that.uriParams.sort = 'rising';
				return that; 
			},
// /top
			top: function(t){ 
				that.dir[2] = "top";
				that.uriParams.sort = 'top';
				that.uriParams.t = t;
				return that; 
			},
////gilded
			gilded: function(){ 
				that.dir[2] = "gilded";
				return that; 
			},
////promoted
			promoted: function(){ 
				that.dir[2] = "ads";
				return that; 
			},		
// /r/subreddit/about
			// /about/rules
			// /about/banned
			// /about/contributors
			// /about/moderators
			// /about/muted
			// /about/wikibanned
			// /about/wikicontributors
			about: function(x){ 
				that.dir[2] = "about";
				if(x) that.dir[3] = x; // /about/where
				return that; 
			},
// /sidebar 
			sidebar: function(){ //IDK if this endpoint actually exists
				that.dir[2] = "sidebar";
				return that; 
			},
// /sticky
			sticky: function(){ 
				that.dir[2] = "sticky";
				console.log("sticky(): Will 404 if there is not currently a sticky post in this subreddit. -reddit.com"); //¯\_(ツ)_/¯ I can't find a example of this that works
				return that; 
			},
// wiki
// /api/wiki/alloweditor/add
// /api/wiki/alloweditor/del
// /api/wiki/alloweditor/act
// /api/wiki/edit
// /api/wiki/hide
// /api/wiki/revert
			// /wiki/pages
			// /wiki/{page}
			// /wiki/discussions/{page}
			// /wiki/revisions
			// /wiki/revisions/{page}
			// /wiki/settings/{page}
			wiki: function(x){ 
				that.dir[2] = "wiki";
				that.dir[3] = x?x:"pages";
				return that; 
			},
		//listing options
			after: that.after.bind(that),
			before: that.before.bind(that),
			count: that.count.bind(that),
			show: that.show.bind(that),
			sr_detail: that.sr_detail.bind(that),
		//go
			go: that.go.bind(that)
		}
// /r/subreddit/about/edit

// /api/delete_sr_banner
// /api/delete_sr_header
// /api/delete_sr_icon
// /api/delete_sr_img
// /api/recommend/sr/srnames
// /api/search_reddit_names
// /api/site_admin
// /api/submit_text
// /api/subreddit_stylesheet
// /api/subreddits_by_topic
// /api/subscribe
// /api/upload_sr_img
		return sorting; 
	}

//SUBREDDITS
	subreddits(x){
		this.dir[0] = "subreddits"; 
		var that = this;		
		var opts = {
			search: function(q){ // /subreddits/search
				that.dir[1] = "search";
				that.uriParams.q=q?q:"";
				return that;
			},
			where: function(q){ // /subreddits/where
			// /subreddits/default
			// /subreddits/gold
			// /subreddits/new
			// /subreddits/popular
				that.noOauth = true; //oauth 401's
				that.dir.push(q);
				return that;
			},
			mine: function(q){ // /subreddits/mine/where
				// /subreddits/mine/contributor
				// /subreddits/mine/moderator
				// /subreddits/mine/subscriber
				that.dir.push("mine");
				that.dir.push(q);
				that.ajax.method = "GET";
				that.ajax.dataType = "json";
				return that;
			},
			go: that.go.bind(that) //go
		}
		if(x) return opts.where(x);		
		return opts;
	}

// USER
	user(user){
		this.dir[0] = "user";
		this.dir[1] = user;		
		var that = this;		
		var sorting = {
			hot: function(){ 
				that.uriParams.sort = 'hot'; 
				return that;
			},
			newest: function(){ 
				that.uriParams.sort = 'new'; 
				return that;
			},
			top: function(t){
				that.uriParams.sort = 'top';
				that.uriParams.t = t?t:"all";
				return that;
			},
			controversial: function(t){
				that.uriParams.sort = 'controversial';
				that.uriParams.t = t?t:"all";
				return that;
			},
		//listing options
			after: that.after.bind(that),
			before: that.before.bind(that),
			count: that.count.bind(that),
			show: that.show.bind(that),
			sr_detail: that.sr_detail.bind(that),
		//go
			go: that.go.bind(that)
		}

// /api/friend
// /api/setpermissions
// /api/unfriend
// /api/username_available
// /api/v1/me/friends/username
// /api/v1/user/username/trophies

		var userOpts = {
// /user/username/about
		/* I can't find a single users that returns an about page */
// /user/username/comments
			comments: function(){
				that.dir[2] = "comments";
				return sorting;
			},
// /user/username/downvoted
			downvoted: function(){
				that.dir[2] = "downvoted";
				return sorting;
			},
// /user/username/gilded
			gilded: function(){
				that.dir[2] = "gilded";
				return that;
			},
// /user/username/hidden
			hidden: function(){
				that.dir[2] = "hidden";
				return sorting;
			},
// /user/username/overview
			overview: function(){
				that.dir[2] = "overview";
				return sorting;
			},
// /user/username/saved
			saved: function(){
				that.dir[2] = "saved";
				return sorting;
			},
// /user/username/submitted
			submitted: function(){
				that.dir[2] = "submitted";
				return sorting;
			},
// /user/username/upvoted
			upvoted: function(){
				that.dir[2] = "upvoted";
				return sorting;
			},
		//listing options
			after: that.after.bind(that),
			before: that.before.bind(that),
			count: that.count.bind(that),
			show: that.show.bind(that),
			sr_detail: that.sr_detail.bind(that),
		//go
			go: that.go.bind(that)
		};

		return userOpts;
	};	
}


	