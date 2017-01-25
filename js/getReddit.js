var verbose = verbose || true;

//string/url building
function addParam(uri, key, value) {
	var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
	var separator = uri.indexOf('?') !== -1 ? "&" : "?";
	if (uri.match(re)) return uri.replace(re, '$1' + key + "=" + value + '$2');
	else return uri + separator + key + "=" + value;
}

class getReddit{

	constructor (){
		//credentials
		this.client_id = 'rnhyBqzYf3PTPA'; //https://www.reddit.com/prefs/apps
		this.loginUri =  'http://redditairplane.com/login/'; //where reddit drops users after authorizing your app

		//uri		
		this.dir = {}; //subredd/user
		this.uriParams = {};
		this.uri = '';
	}	

	//get page (last call for all trains function)
	go(res, err){
		this.buildUri();
		if(verbose) console.log("go()", this.uri);
		if (localStorage.getItem("loggedIn") === true) 
			this.getAuth(res, err);
		else 
			this.unAuth(res, err);
	}
	//get oauth
	getAuth(res, err){
		if(verbose)  console.log("getAuth()", this, localStorage.access_token);
	}
	//get unAuth
	unAuth(res, err){
		var url = "https://www.reddit.com"+this.uri;
		if(verbose)  console.log("unAuth()", url);

		var xhr = new XMLHttpRequest();
			xhr.open("GET", url, true);
			xhr.onload = function () {
				return res(xhr.response);
			};
			xhr.onerror = function () {
				if (err !== undefined) {
					return err(xhr.response);
				}
			};
			xhr.send();
	}
	//get subreddit page
	subreddit(subreddit){ this.dir.subreddit = subreddit;  return this; }
	
	//get user page
	user(user){ this.dir.user = user;  return this; }
	userSubmitted(user){ this.user(user); this.userSubmitted = true;  return this; }

	//make URI
	buildUri(){
		//if(verbose) console.log("buildUri()");		
		if(this.dir.subreddit){
			this.uri = '/r/'+this.dir.subreddit+'/';
			if(this.comments) this.uri += 'comments/'+this.article+'/';
			if(this.uriParams.sort) this.uri += this.uriParams.sort+'/';
		}
		if(this.dir.user){
			this.uri = '/user/'+this.dir.user+'/';
			if(this.userSubmitted) this.uri += 'submitted/';
		}
		//json cap
		this.uri += '.json';
		//sprinkle in parameters
		for(var name in this.uriParams) { if(this.uriParams[name]) this.uri = addParam(this.uri, name, this.uriParams[name]) };
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
//modhashes
	//afaik these are obsolete

// account
// /api/v1/me
// /api/v1/me/blocked
// /api/v1/me/friends
// /api/v1/me/karma
// /api/v1/me/prefs
// /api/v1/me/trophies
// /prefs/blocked
// /prefs/friends
// /prefs/messaging
// /prefs/trusted
// /prefs/where

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

// /api/del
// /api/editusertext
// /api/hide
// /api/info
// /api/lock
// /api/marknsfw
// /api/morechildren
// /api/report
// /api/save
// /api/saved_categories
// /api/sendreplies
// /api/set_contest_mode
// /api/set_subreddit_sticky
// /api/set_suggested_sort
// /api/spoiler
// /api/store_visits
// /api/submit
// /api/unhide
// /api/unlock
// /api/unmarknsfw
// /api/unsave
// /api/unspoiler
// /api/vote

// listings
// /by_id/names
// /comments/article
	comments(article){ 
		this.comments = true;
		this.article = article;
		return this; 
	}
// /controversial
	controversial(t){ 
		this.uriParams.sort = 'controversial';
		this.uriParams.t = t;
		return this; 
	}
// /duplicates/article
	duplicates(article){ 
		this.duplicates = true;
		this.article = article;
		return this; 
	}
// /hot
	hot(){ 
		this.uriParams.sort = 'hot';
		return this; 
	}
// /new
	newest(){ //-_-
		this.uriParams.sort = 'new';
		return this; 
	}
// /random
// /rising
	rising(){ 
		this.uriParams.sort = 'rising';
		return this; 
	}
// /top
	top(t){ 
		this.uriParams.sort = 'top';
		this.uriParams.t = t;
		return this; 
	}
// /sort
	//moot
	//sort(s){  this.uriParams.sort=s; return this; }
	//t(s){  this.uriParams.t=s; return this; }

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
// /search

// subreddits
// /about/banned
// /about/contributors
// /about/moderators
// /about/muted
// /about/wikibanned
// /about/wikicontributors
// /about/where
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
// /r/subreddit/about
// /r/subreddit/about/edit
// /r/subreddit/about/rules
// /sidebar
// /sticky
// /subreddits/default
// /subreddits/gold
// /subreddits/mine/contributor
// /subreddits/mine/moderator
// /subreddits/mine/subscriber
// /subreddits/mine/where
// /subreddits/new
// /subreddits/popular
// /subreddits/search
// /subreddits/where

// users
// /api/friend
// /api/setpermissions
// /api/unfriend
// /api/username_available
// /api/v1/me/friends/username
// /api/v1/user/username/trophies
// /user/username/about
// /user/username/comments
// /user/username/downvoted
// /user/username/gilded
// /user/username/hidden
// /user/username/overview
// /user/username/saved
// /user/username/submitted
// /user/username/upvoted
// /user/username/where

// wiki
// /api/wiki/alloweditor/add
// /api/wiki/alloweditor/del
// /api/wiki/alloweditor/act
// /api/wiki/edit
// /api/wiki/hide
// /api/wiki/revert
// /wiki/discussions/page
// /wiki/pages
// /wiki/revisions
// /wiki/revisions/page
// /wiki/settings/page
// /wiki/page		


	//login
	login(code, state){
		//(reddit will add code/state parameters to the URI) 
		if(verbose) console.log("code: "+code);
		if(verbose) console.log("state: "+state);

		//clear tokens (it's loginpage)
		localStorage.clear();
		
		//login code
		$.ajax({
			type: "POST",
			url: 'https://ssl.reddit.com/api/v1/access_token',
			data: {
				code: code,
				client_id: client_id,
				redirect_uri: uri,
				grant_type: 'authorization_code',
				state: state
			},
			username: client_id,
			crossDomain: true,
			beforeSend: function(xhr){
				xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + ''));
			}
		}).done(function(data){
			if(verbose) console.log("data", data);

			localStorage["access_token"] = data.access_token;
			localStorage["refresh_token"] = data.refresh_token;
			localStorage["scope"] = data.scope;
			
			//first loggin
			$.ajax({
				url: "https://oauth.reddit.com/api/v1/me.json",
				method: "GET",
				dataType: "json",
				timeout: 6000,
				beforeSend: function (jqXHR) {
					jqXHR.setRequestHeader("Authorization", "bearer " + localStorage.access_token);
				},
				success: function (response) {
					if(verbose) console.log('response');
					if(verbose) console.log(response);
					localStorage["user"] = response.name;
					mainContent.getElementsByTagName("h1").innerHTML = "Success! Redirecting...";
					window.location.replace(state);
				},
				error: function () {
					if(verbose) console.log("initial loggin fialed (me.json), clearing tokens");
					mainContent.getElementsByTagName("h1").innerHTML = "Error...";
					//clear localStorage?
					localStorage.clear();
					alert("login failed: redirecting you to reddit login screen again");
					window.location.replace("https://www.reddit.com/api/v1/authorize?client_id=cZEjE0RQEbXcHQ&response_type=code&state="+state+"&redirect_uri=http://redditairplane.com/login/&scope=save,identity,edit,flair,history,modconfig,modflair,modlog,modposts,modwiki,mysubreddits,privatemessages,read,report,submit,subscribe,vote,wikiedit,wikiread&duration=permanent");
				}
			});
		});

		if(verbose) console.log(localStorage.token?localStorage.token:"no token");
	}
	//getSubscriptions
	getSubscriptions(){
		if(verbose) console.log("getSubscriptions()");
		get("https://oauth.reddit.com/api/subreddits/mine/subscriber", "GET", "JSON", 
			function (response) {
				if(verbose)  console.log('getSubscriptions success!', response);
				return response;
			},
			function (request) {
				if(verbose) console.log("getSubscriptions request failed!", request);
				return request;
			}
		);
	}
	//subscribe
	subscribe(name, act, sub, callback){
		if(verbose) console.log("subscribe()",name, act, sub, callback);
		//toggle save
		if(localStorage.access_token)
			$.ajax({
				url: "https://oauth.reddit.com/api/subscribe",
				method: "POST",
				data: {modhash: "null", action: act, sr: sub},
				timeout: 6000,
				async: true,
				beforeSend: function (jqXHR) {
					jqXHR.setRequestHeader("Authorization", "bearer " + localStorage.access_token);
				},
				success: function (response) {
					if(verbose) console.log(act + 'scribed to ' +sub+ ' ('+name+')');
					if(verbose) console.log(response);
					callback(true); //callback success
				},
				error: function (response) {
					console.log("failed to " + act + 'scribe from ' + sub + ' ('+name+')');
					alert("failed to " + act + 'scribe from '+name);
					if(verbose) console.log(response);
					callback(false);
				}
			});
		else alert("login to subscribe!");
	}
	//toggle favorite/save
	toggleFav(child,card,i,callback){

		//toggle save
		if(localStorage.access_token)
			$.ajax({
				url: "https://oauth.reddit.com/api/"+(child.saved?"unsave":"save"),
				method: "POST",
				data: {id: child.name},
				timeout: 6000,
				async: true,
				beforeSend: function (jqXHR) {
					jqXHR.setRequestHeader("Authorization", "bearer " + localStorage.access_token);
				},
				success: function (response) {
					if(verbose) console.log('save toggle success! saved: '+!child.saved);
					if(verbose) console.log(response);

					child.saved = !child.saved;
					callback(child,card,i);
					//toggle class
					//el.className = ("fButton "+(faved?"fav":"faved"));
				},
				error: function (response) {
					console.log('save toggle failed!');
					console.log(response);
				}
			});
	}
	//vote
	vote(name, vote, callback){
		if(localStorage.access_token)
			$.ajax({
				url: "https://oauth.reddit.com/api/vote",
				method: "POST",
				data: {id: name, dir: vote},
				timeout: 6000,
				async: true,
				beforeSend: function (jqXHR) {
					jqXHR.setRequestHeader("Authorization", "bearer " + localStorage.access_token);
				},
				success: function (response) {
					if(verbose) console.log('vote success! ',name);
					if(verbose) console.log(response);
					//callback success
					callback(true);

				},
				error: function (response) {
					if(verbose) console.log('vote failed!');
					if(verbose) console.log(response);
					if(response.status == 401){
						alert("error 401: Unauthorized -Token Might have Expired\nrefreshing token and trying again...");
						refreshToken(function(successfulRefresh){
							if(verbose) console.log(" refresh success: "+successfulRefresh);
							vote(name, vote, callback);
						});
					}
					else if(response.status == 400)
						alert("Error: Votes Closed (Old Thread)");
					else{
						alert(" Vote Failed: error "+response.status+"\nWait 10 seconds and try again, or refresh the page");
						callback(false);
					}
				}
			});
		else alert("login to vote!");
	}
	//make comment
}