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
	if(verbose)  console.log("getFrontpage()", response);    
	
	var children = response.data.children;
	for(var i in children)
		document.querySelector(".main").appendChild(cardBuilder(children[i].data));
}
function speak(x){
	response = JSON.parse(x); 
	console.log(response);
}
//var subreddit = "OldSchoolCool";
//getPage( "https://www.reddit.com/r/"+subreddit+"/.json", getFrontpage, defaultErrorCallback);
//get("/", makeFrontpage, defaultErrorCallback);


//var r = new getReddit();

//sub
	//r.subreddit("museum").after("null").count("50").go(makeFrontpage, defaultErrorCallback);
	//r.subreddit("museum").after("t3_5p085i").count("50").go(makeFrontpage, defaultErrorCallback);
	//r.subreddit("museum").sort("top").t("week").go(makeFrontpage, defaultErrorCallback);
	//r.subreddit("museum").top("week").go(makeFrontpage, defaultErrorCallback);
	//r.subreddit("museum").newest().go(makeFrontpage, defaultErrorCallback);
	new getReddit().subreddit('nsfw').hot().go(makeFrontpage, defaultErrorCallback);

//user
	//new getReddit().userSubmitted('SamSlate').hot().go(makeFrontpage, defaultErrorCallback);



//comments
	//new getReddit().subreddit('nsfw').comments("5pvuqm").go(speak, defaultErrorCallback);
	//new getReddit().subreddit('nsfw').comments("5pvuqm").controversial().go(speak, defaultErrorCallback);
//duplicates
	//new getReddit().subreddit('nsfw').duplicates("5pvuqm").go(speak, defaultErrorCallback);






