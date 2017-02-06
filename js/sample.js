var verbose = true; //toggle verbose
if(verbose) console.log("Begin");

//default error handler
function defaultErrorCallback(x){
	if(verbose) console.log("i am the default error callback.");    
	console.log(x);
}
//element builder
function elBuildo(tag,a,text){
	var node = document.createElement(tag);
	var i = 0;
	if(a.length!=0) while(i<(a.length-1)) { node.setAttribute(a[i], a[++i]); i++; }		
	node.innerHTML = text;
	return node;
}
//card builder
function cardBuilder(dataBall){
	var card = elBuildo("div", ["class", "card"], "");
		var box = elBuildo("div", ["class", "box"], "");
			box.appendChild(elBuildo("div", ["class", "content"], '<a href="'+dataBall.url+'"><img class="thumbnail" src="'+((dataBall.thumbnail.indexOf(".jpg")>0)?dataBall.thumbnail:"")+'" alt=""></a>'));
			box.appendChild(elBuildo("div", ["class", "info"], '<p>'+dataBall.title+'</p>'));
		card.appendChild(box);
		card.appendChild(elBuildo("div", ["class", "triangle"], ""));
		card.appendChild(elBuildo("p", ["class", "sub"], dataBall.subreddit));
		card.appendChild(elBuildo("p", ["class", "auth"], dataBall.author));
	return card;
}
//frontpage of subreddit
function makeFrontpage(res) {
	response = JSON.parse(res);
	if(verbose) console.log("getFrontpage()", response);
	var children = response.data.children;
	for(var i in children) document.querySelector(".main").appendChild(cardBuilder(children[i].data));
	loadMore.onclick  = function(){  
		r.after(response.data.after).go(makeFrontpage, defaultErrorCallback); 
	};
}
function speak(x){
	response = JSON.parse(x);
	console.log(response);
}
function speakSubreddits(res) {
	response = JSON.parse(res);
	if(verbose) console.log("getFrontpage()", response);
	var children = [];
	for(var i in response.data.children) children.push(response.data.children[i].data.display_name);
	console.log(children);
}

//TESTING
//subreddit
	//var r = new getReddit().subreddit("museum").after("null").count("50").go(makeFrontpage, defaultErrorCallback);	
	//var r = new getReddit().subreddit('museum').hot().limit("5").count("5").go(makeFrontpage, defaultErrorCallback);
	// var r = new getReddit().subreddit('museum').hot().go(makeFrontpage, defaultErrorCallback);
	// var r = new getReddit().subreddit('museum').rising().go(makeFrontpage, defaultErrorCallback);
	// var r = new getReddit().subreddit('museum').controversial().go(makeFrontpage, defaultErrorCallback);
	// var r = new getReddit().subreddit('museum').controversial("all").go(makeFrontpage, defaultErrorCallback);
	// var r = new getReddit().subreddit('museum').top("all").go(makeFrontpage, defaultErrorCallback);
	// var r = new getReddit().subreddit('museum').gilded().go(makeFrontpage, defaultErrorCallback);
	// var r = new getReddit().subreddit('museum').promoted().go(makeFrontpage, defaultErrorCallback);
//WIKI
	//var r = new getReddit().subreddit('pcmasterrace').wiki().go(speak, defaultErrorCallback);
	// var r = new getReddit().subreddit('pcmasterrace').wiki("pages").go(speak, defaultErrorCallback);
	// var r = new getReddit().subreddit('pcmasterrace').wiki("servers").go(speak, defaultErrorCallback);
	// var r = new getReddit().subreddit('pcmasterrace').wiki("revisions/servers").go(speak, defaultErrorCallback);
	

//Subreddit PERIPHERAL (about)
	// var r = new getReddit().subreddit('museum').go(makeFrontpage, defaultErrorCallback);
	// 	r.subreddit('museum').about().go(speak, defaultErrorCallback);
	// 	r.subreddit('museum').about("rules").go(speak, defaultErrorCallback);
		// r.subreddit('museum').about("banned").go(speak, defaultErrorCallback);
		// r.subreddit('museum').about("contributors").go(speak, defaultErrorCallback);
		// r.subreddit('museum').about("moderators").go(speak, defaultErrorCallback);
		// r.subreddit('museum').about("muted").go(speak, defaultErrorCallback);
		// r.subreddit('museum').about("wikibanned").go(speak, defaultErrorCallback);
		// r.subreddit('museum').about("wikicontributors").go(speak, defaultErrorCallback);
			

//subreddits, a collection of subreddits
		// /subreddits/default
		// /subreddits/gold
		// /subreddits/new
		// /subreddits/popular
	// var r = new getReddit().subreddits('popular').go(speak, defaultErrorCallback);

		// /subreddits/search
	// var r = new getReddit().subreddits('popular').search("nsfw").go(speakSubreddits, defaultErrorCallback);
	// var r = new getReddit().subreddits('popular').search("nsfw").sort("relevance").go(speakSubreddits, defaultErrorCallback);
	// var r = new getReddit().subreddits('popular').search("nsfw").sort("activity").go(speakSubreddits, defaultErrorCallback);

		// /subreddits/mine/contributor
		// /subreddits/mine/moderator
		// /subreddits/mine/subscriber
		// /subreddits/mine/where
	// var r = new getReddit().subreddits('mine/subscriber').go(speak, defaultErrorCallback);


//by_id
	//var r = new getReddit().by_id('t3_5q0325').go(speak, defaultErrorCallback);

//comments
	// var r = new getReddit().subreddit('nsfw').comments("5pvuqm").go(speak, defaultErrorCallback);
	// var r = new getReddit().subreddit('nsfw').comments("5pvuqm").sort("best").go(speak, defaultErrorCallback);
	// var r = new getReddit().subreddit('nsfw').comments("5pvuqm").sort("top").go(speak, defaultErrorCallback);
	// var r = new getReddit().subreddit('nsfw').comments("5pvuqm").sort("new").go(speak, defaultErrorCallback);
	// var r = new getReddit().subreddit('nsfw').comments("5pvuqm").sort("newest").go(speak, defaultErrorCallback);
	// var r = new getReddit().subreddit('nsfw').comments("5pvuqm").sort("old").go(speak, defaultErrorCallback);
	// var r = new getReddit().subreddit('nsfw').comments("5pvuqm").sort("qa").go(speak, defaultErrorCallback);
	// var r = new getReddit().subreddit('nsfw').comments("5pvuqm").sort("controversial").go(speak, defaultErrorCallback);
//duplicates
	// var r = new getReddit().subreddit('nsfw').duplicates("5pvuqm").go(speak, defaultErrorCallback);

//user
	// var r = new getReddit().user("GallowBoob").go(speak, defaultErrorCallback);
	 var r = new getReddit().user("GallowBoob").after("null").go(speak, defaultErrorCallback);
	// var r = new getReddit().user("GallowBoob").overview().go(speak, defaultErrorCallback);
	// var r = new getReddit().user("GallowBoob").overview().newest().go(speak, defaultErrorCallback);
	// var r = new getReddit().user("GallowBoob").overview().top("all").go(speak, defaultErrorCallback);
	// var r = new getReddit().user("GallowBoob").overview().controversial("all").go(speak, defaultErrorCallback);

	// var r = new getReddit().user("GallowBoob").comments().go(speak, defaultErrorCallback);
	// var r = new getReddit().user("GallowBoob").comments().newest().go(speak, defaultErrorCallback);
	// var r = new getReddit().user("GallowBoob").comments().top("all").go(speak, defaultErrorCallback);
	// var r = new getReddit().user("GallowBoob").comments().controversial("all").go(speak, defaultErrorCallback);

	// var r = new getReddit().user("GallowBoob").gilded().go(makeFrontpage, defaultErrorCallback);

	// var r = new getReddit().user("GallowBoob").submitted().newest().go(makeFrontpage, defaultErrorCallback);
	// var r = new getReddit().user("GallowBoob").submitted().hot().go(makeFrontpage, defaultErrorCallback);
	// var r = new getReddit().user("GallowBoob").submitted().top("all").go(makeFrontpage, defaultErrorCallback);
	// var r = new getReddit().user("GallowBoob").submitted().top("day").go(makeFrontpage, defaultErrorCallback);
	// var r = new getReddit().user("GallowBoob").submitted().controversial("all").go(makeFrontpage, defaultErrorCallback);
	// var r = new getReddit().user("GallowBoob").submitted().controversial("day").go(makeFrontpage, defaultErrorCallback);

	// var r = new getReddit().user("samSlate").downvoted().go(makeFrontpage, defaultErrorCallback);


//AUTHENTCATED API

//LOGIN LINK: https://www.reddit.com/prefs/apps/
//link to reddit authentication page with app ID's/requests/scope as paramaters. If users accept, they're redirected to the redirect uri you set when you registered your app. 
var loginURI = { 
    client_id: 'yYMefyDnpSKWhw', //your client_id here
    response_type: "code", //code for first login, token for refresh
    state:  "RANDOM_STRING", //https://github.com/reddit/reddit/wiki/OAuth2#authorization
    redirect_uri: 'http://redditairplane.com/login/getRedditLoginURI.html', //YOUR redirect_uri here: https://www.reddit.com/prefs/apps/
    scope: 'save,identity,edit,flair,history,modconfig,modflair,modlog,modposts,modwiki,mysubreddits,privatemessages,read,report,submit,subscribe,vote,wikiedit,wikiread',
    duration: "permanent",
};
var loginURL = "https://www.reddit.com/api/v1/authorize"; 
for(var opt in loginURI) if(loginURI[opt]) loginURL = addParam(loginURL, opt, loginURI[opt]); //build login string

//set login link
loginLink.href = loginURL;

if(localStorage["access_token"]) console.log(localStorage["access_token"]);