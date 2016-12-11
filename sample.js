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
getPage(commPageLink, getCommentPage, defaultErrorCallback);

//frontpage of subreddit
var subreddit = "OldSchoolCool";
function getFrontpage(response) {
	if(verbose)  console.log("getFrontpage()", response);    
	
	var children = response.data.children;
	for(var i in children)
		document.querySelector(".main").appendChild(cardBuilder(children[i].data));
	
}
//getPage( "https://www.reddit.com/r/"+subreddit+"/.json", getFrontpage, defaultErrorCallback);
getPage( "https://www.reddit.com/.json", getFrontpage, defaultErrorCallback);
	






