var verbose = true; //toggle verbose
if(verbose) console.log("Begin");

//default error handler
function defaultErrorCallback(x){
	if(verbose) console.log("i am the default error callback:", x.responseText);    
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
//query string object return
function q(){
	// This function is anonymous, is executed immediately and
	// the return value is assigned to QueryString!
	var query_string = {};
	var query = window.location.search.substring(1);
	var found = false;
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		if(pair[i] != ""){
			// If first entry with this name
			if (typeof query_string[pair[0]] === "undefined") {
				query_string[pair[0]] = decodeURIComponent(pair[1]);
			// If second entry with this name
			} else if (typeof query_string[pair[0]] === "string"){
				var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
				query_string[pair[0]] = arr;
			// If third or later entry with this name
			} else {
				query_string[pair[0]].push(decodeURIComponent(pair[1]));
			}
			found = true;
		}
	}
	//if(found) console.log("query_string: ", query_string);
	//	else console.log("no query_string");
	return query_string;
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
	response = (typeof x !== 'object')?JSON.parse(x):x;
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
	// r.subreddit('museum').about().go(speak, defaultErrorCallback);
	// r.subreddit('museum').about("rules").go(speak, defaultErrorCallback);
	// r.subreddit('museum').about("banned").go(speak, defaultErrorCallback);
	// r.subreddit('museum').about("contributors").go(speak, defaultErrorCallback);
	// r.subreddit('museum').about("moderators").go(speak, defaultErrorCallback);
	// r.subreddit('museum').about("muted").go(speak, defaultErrorCallback);
	// r.subreddit('museum').about("wikibanned").go(speak, defaultErrorCallback);
	// r.subreddit('museum').about("wikicontributors").go(speak, defaultErrorCallback);
			

//subreddits, a collection of subreddits
	// var r = new getReddit().subreddits().where('default').go(speakSubreddits, defaultErrorCallback);
	// var r = new getReddit().subreddits().where('gold').go(speakSubreddits, defaultErrorCallback);
	// var r = new getReddit().subreddits().where('new').go(speakSubreddits, defaultErrorCallback);
	// var r = new getReddit().subreddits().where('popular').go(speakSubreddits, defaultErrorCallback);
	// var r = new getReddit().subreddits('default').go(speakSubreddits, defaultErrorCallback); //subreddits(x) == subreddits().where(x)
		
//mine		
	// var r = new getReddit().subreddits().mine('contributor').go(speak, defaultErrorCallback);
	// var r = new getReddit().subreddits().mine('moderator').go(speak, defaultErrorCallback);
	// var r = new getReddit().subreddits().mine('subscriber').go(function(data){
	// 	speak(data);
	// 	r.after(data.data.after).go(speak, defaultErrorCallback);
	// }, defaultErrorCallback);

// /subreddits/search
	// var r = new getReddit().subreddits().search('nsfw').go(speak, defaultErrorCallback);

//by_id
	//var r = new getReddit().by_id('t3_5q0325').go(speak, defaultErrorCallback);

//comments
	// var r = new getReddit().subreddit('BlackPeopleTwitter').comments("5shdde").go(speak, defaultErrorCallback);
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
	// var r = new getReddit().user("GallowBoob").after("null").go(speak, defaultErrorCallback);
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

//Login Link
	loginLink.href = new getReddit().loginLink;

//LOGIN
	if(q().login == "true"){ //login Case
		//login(code, state, callback)
		new getReddit().login(q().code, q().state, function(data){ 
			//do stuff, redirect to homepage probably... 
			window.location.replace("/");
		});
	}

//me
	// var r = new getReddit().me().go(speak, defaultErrorCallback);
	// r.me().go(
	// 	function(response){
	// 		if(verbose) console.log(response);
	// 		localStorage["user"] = response;
	// 	}, 
	// 	defaultErrorCallback
	// );
	// r.me("blocked").go(speak, defaultErrorCallback);
	// r.me("friends").go(speak, defaultErrorCallback);
	// r.me("karma").go(speak, defaultErrorCallback);
	// r.me("prefs").go(speak, defaultErrorCallback);
	// r.me("trophies").go(speak, defaultErrorCallback);

//prefs
	// var r = new getReddit();
	// 	r.prefs("blocked").go(speak, defaultErrorCallback);
	// 	r.prefs("friends").go(speak, defaultErrorCallback);
	// 	r.prefs("messaging").go(speak, defaultErrorCallback);
	// 	r.prefs("trusted").go(speak, defaultErrorCallback);

//commenting
	// new getReddit().comment("t3_52c1hu", "Comment Body").go(speak, defaultErrorCallback); //fullname of parent (comment or post), "comment text"
//delete
	// new getReddit().delete("t1_ddfe69e").go(speak, defaultErrorCallback); 
//editusertext
	//  new getReddit().editusertext("t1_ddfe3qa", "edited comment").go(speak, defaultErrorCallback);
//hide
	// new getReddit().hide("t3_52c1hu").go(speak, defaultErrorCallback);
//unhide
	// new getReddit().unhide("t3_52c1hu").go(speak, defaultErrorCallback);
//info
	// new getReddit().info("t3_5shdde").go(speak, defaultErrorCallback);
//lock
	// new getReddit().lock("t3_52c1hu").go(speak, defaultErrorCallback);
//unlock
	// new getReddit().unlock("t3_52c1hu").go(speak, defaultErrorCallback);
//save
	//  new getReddit().save("t3_52c1hu").go(speak, defaultErrorCallback);
	//  new getReddit().save("t3_52c1hu", "space").go(speak, defaultErrorCallback); //save(name, category)
//saved_categories
	// new getReddit().saved_categories().go(speak, defaultErrorCallback); //https://www.reddit.com/user/USER_NAME/saved/CATEGORY/
//sendreplies
	// new getReddit().sendreplies("t3_52c1hu", true).go(speak, defaultErrorCallback); //toggle repliese for post/comment
//vote
	// new getReddit().vote("t3_52c1hu", 1, 2).go(speak, defaultErrorCallback); //toggle repliese for post/comment






 
