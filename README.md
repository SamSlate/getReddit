# getReddit
*An entirely client-side javascript wrapper for the Reddit API*

## goal

a modifiable/executible reddit object. 

## usage

    var r = new getReddit().url("/r/ImaginaryStarships/top/?sort=top&t=all").go(function(jsonObj){
        console.log(jsonObj);
    }, defaultErrorCallback);
    
where [a json object](https://www.reddit.com/r/ImaginaryStarships/top/.json?sort=top&t=all) is returned to a callback function. 

the above `.url()` is equivilant to:

    var r = new getReddit().subreddit('ImaginaryStarships').top("all").go(callback, defaultErrorCallback);
    
the reddit object `r` can now be modifed by various function calls: 

    r.after('t3_5qrj9s');

given `jsonObj`, you can modify the reddit object `r` and update your page:

    loadMoreButton.onclick  = function(){  
		r.after(jsonObj.data.after).go(updatePageCallBack, defaultErrorCallback); 
	};
    
or request 'about' subreddit section:

    r.about().go(function(jsonObj){
        console.log(jsonObj);
    }, defaultErrorCallback);
    
    
\*very much a work in progress, critiques/contributions welcome
