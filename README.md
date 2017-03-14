# getReddit
*An entirely client-side javascript wrapper for the Reddit API*

## usage
`var r = new getReddit().url("/r/ImaginaryStarships/top/?sort=top&t=all").go(function(jsonObj){
    console.log(jsonObj) //[a json object](https://www.reddit.com/r/ImaginaryStarships/top/.json?sort=top&t=all)
}, defaultErrorCallback);`
