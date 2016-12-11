var verbose = verbose || true;

//credentials
var client_id = 'cZEjE0RQEbXcHQ'; //https://www.reddit.com/prefs/apps
var uri =  'http://redditairplane.com/login/'; //where reddit drops users after authorizing your app

//login
function login(code, state){
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
function getSubscriptions(){
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
function subscribe(name, act, sub, callback){
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

function toggleFav(child,card,i,callback){
/*
	//alert(name);
	var name = el.getAttribute("cname");
	if(verbose) console.log("toggle save: "+name);

	//get "this"
	//el = document.getElementById("fav"+name);
	if(verbose) console.log(el);

	//is faved? (child.saved?"faved":"fav")
	var faved = false;
	if(el.classList.contains("faved"))
		faved = true;

	if(verbose) console.log("faved: "+faved);
*/
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
function vote(name, vote, callback){
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



//get user



//get page

function getPage(page, callback, err){
	//do not speak() page name here
	//loadingStatus.innerHTML = "Getting Page: "+page+"...";

	//var pageid = crc32(page);
	//loadingStatus.appendChild(openEl('p',["id",pageid],"Getting Page: "+page+"..."));

	if(verbose)  console.log("getPage()", page);

	var loggedin = false;
	if(loggedin==true)
		get(page,  "GET", "json", callback, err);
	else {
		if(verbose)  console.log("else");
		$.ajax({
				url: page,
				method: "GET",
				dataType: "json",
				timeout: 6000,
				async: true,
				success: callback,
				error: err
		});
	}
		

//	}else{
	/*
		//loadingStatus.appendChild(openEl('p',["id",pageid],"Getting Page: "+page+"..."));
		$.ajax({
				url: page,
				method: "GET",
				dataType: "json",
				timeout: 6000,
				async: true,
				beforeSend: function (jqXHR) {
					jqXHR.setRequestHeader("Authorization","bearer " + localStorage.access_token);
				},
			success: function (response) {
				callback(response);
			},
			error: err,
		});
	//}
	*/
}


//vote 



//comment



//get
function get(page, meth, dat, callback, err){
	$.ajax({
		url: page,
		method: meth,
		dataType: dat,
		timeout: 6000,
		async: true,
		beforeSend: function (jqXHR) {
			if(localStorage.access_token)
				jqXHR.setRequestHeader("Authorization", "bearer " + localStorage.access_token);
		},
		success: function (response) {
			if(verbose) console.log('  success ('+meth+', '+dat+'):\n\t',page);
			if(verbose) console.log(response);
			callback(response);
		},
		error: function (request){
			if(verbose) console.log('  failed ('+meth+', '+dat+'):\n\t'+page);
			if(verbose) console.log(request);
			err(request);
		}
	});
}