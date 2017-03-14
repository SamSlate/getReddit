# getReddit
*An entirely client-side javascript wrapper for the Reddit API*

## goal

simplify the reddit api for entirely browser/clientside devices. 

Reddit uri conventions are... unique. Hopefully this will save other webdevelopers a lot of headaches when they just want to make, say a page background that pulls the day's top post from r/earthporn. 

Or full fledged login/logout reddit app. The syntax is the same. 


## usage

Makes like-reddit endpoints (subbreddits, users, etc) objects. 

`var imaginarySpaceships = new getReddit().subreddit("imaginarySpaceships");

    imaginarySpaceships.hot().go()

        .then(function(res){

            console.log(res); // r.imaginarySpaceships hot/front page

        })`

once created, all reddit enpoints related to that page type can be called on that object without re-instantiating the object:
        
`imaginarySpaceships.wiki().go()
    
    .then(function(res){
    
        console.log(res.kind); //wikipagelisting 
    
    })
    
    .catch(defaultErrorCallback);`

and the standard subreddit filtering:

`imaginarySpaceships.top("week").go()
    
    .then(function(res){
    
        console.log(res); //this weeks top post 
    
    })
    
    .catch(defaultErrorCallback);`

see /js/test.js for the working list of object endpoints. 
