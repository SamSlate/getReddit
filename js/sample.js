var verbose = true;
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
			box.appendChild(elBuildo("div", ["class", "content"], '<img class="thumbnail" src="'+((dataBall.thumbnail.indexOf(".jpg")>0)?dataBall.thumbnail:"")+'" alt="">'));
			box.appendChild(elBuildo("div", ["class", "info"], '<p>'+dataBall.title+'</p>'));
		card.appendChild(box);
		card.appendChild(elBuildo("div", ["class", "triangle"], ""));
		card.appendChild(elBuildo("p", ["class", "sub"], dataBall.subreddit));
		card.appendChild(elBuildo("p", ["class", "auth"], dataBall.author));
	return card;
}

//get comment page
var commPageLink = "https://www.reddit.com/r/OldSchoolCool/comments/5gpyts/rita_hayworth_1948/.json";
function getCommentPage(response) {
	if(verbose)  console.log("getCommentPage()", response);

	//get the goods
	var pageData = response[0].data.children[0].data;
	document.querySelector(".main").appendChild(cardBuilder(pageData));
}
//getPage(commPageLink, getCommentPage, defaultErrorCallback);

//frontpage of subreddit
function makeFrontpage(res) {
	response = JSON.parse(res);
	if(verbose) console.log("getFrontpage()", response);
	var children = response.data.children;
	for(var i in children) document.querySelector(".main").appendChild(cardBuilder(children[i].data));
	loadMore.onclick  = function(){  r.after(response.data.after).go(makeFrontpage, defaultErrorCallback); };
}
function speak(x){
	response = JSON.parse(x);
	console.log(response);
}
//sub
	//var r = new getReddit().subreddit("museum").after("null").count("50").go(makeFrontpage, defaultErrorCallback);
	
	var r = new getReddit().subreddit('museum').go(makeFrontpage, defaultErrorCallback);
	// var r = new getReddit().subreddit('museum').hot().go(makeFrontpage, defaultErrorCallback);
	// var r = new getReddit().subreddit('museum').rising().go(makeFrontpage, defaultErrorCallback);
	// var r = new getReddit().subreddit('museum').controversial().go(makeFrontpage, defaultErrorCallback);
	// var r = new getReddit().subreddit('museum').controversial("all").go(makeFrontpage, defaultErrorCallback);
	// var r = new getReddit().subreddit('museum').top("all").go(makeFrontpage, defaultErrorCallback);
	// var r = new getReddit().subreddit('museum').gilded().go(makeFrontpage, defaultErrorCallback);
	// var r = new getReddit().subreddit('museum').promoted().go(makeFrontpage, defaultErrorCallback);

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




