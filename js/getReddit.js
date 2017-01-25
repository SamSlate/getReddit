var verbose = verbose || true;

class getReddit{
		
	constructor (){
		//credentials
		this.client_id = 'cZEjE0RQEbXcHQ'; //https://www.reddit.com/prefs/apps
		this.uri =  'http://redditairplane.com/login/'; //where reddit drops users after authorizing your app
	}

	//get
	get(url, res, err){
		url = "https://www.reddit.com"+url+".json";

		if (localStorage.getItem("loggedIn") === true) getAuth(url, res, err);
		else this.unAuth(url, res, err);
	}
	//get oauth
	getAuth(url, res, err){
		if(verbose)  console.log("getAuth()", url, localStorage.access_token);

	}
	//get unAuth
	unAuth(url, res, err){
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