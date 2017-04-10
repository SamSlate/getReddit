//subreddit test
function subredditTest(){
    var imaginarySpaceships = new getReddit().url("r/imaginarySpaceships");
    imaginarySpaceships.go().then(function(success){
        imaginarySpaceships.hot().go()
        .then(function(res){
            console.log(res.kind, res.data);
            return true;
        })
        .catch(defaultErrorCallback);
    })
    .then(function(success){
        imaginarySpaceships.controversial().go()
        .then(function(res){
            console.log(res.kind, res.data);
            return true;
        })
        .catch(defaultErrorCallback);
    })
    .then(function(success){
        imaginarySpaceships.newest().go()
        .then(function(res){
            console.log(res.kind, res.data);
            return true;
        })
        .catch(defaultErrorCallback);
    })
    .then(function(success){
        imaginarySpaceships.rising().go()
        .then(function(res){
            console.log(res.kind, res.data);
            return true;
        })
        .catch(defaultErrorCallback);
    })
    .then(function(success){
        imaginarySpaceships.top().go()
        .then(function(res){
            console.log(res.kind, res.data);
            return true;
        })
        .catch(defaultErrorCallback);
    })
    .then(function(success){
        imaginarySpaceships.gilded().go()
        .then(function(res){
            console.log(res.kind, res.data);
            return true;
        })
        .catch(defaultErrorCallback);
    })
    .then(function(success){
        imaginarySpaceships.promoted().go()
        .then(function(res){
            console.log(res.kind, res.data);
            return true;
        })
        .catch(defaultErrorCallback);
    })
    .then(function(success){
        imaginarySpaceships.about().go()
        .then(function(res){
            console.log(res.kind, res.data);
            return true;
        })
        .catch(defaultErrorCallback);
    })
    .then(function(success){
        imaginarySpaceships.sidebar().go()
        .then(function(res){
            console.log(res.kind, res.data);
            return true;
        })
        .catch(defaultErrorCallback);
    })
    .then(function(success){
        imaginarySpaceships.sticky().go()
        .then(function(res){
            console.log(res.kind, res.data);
            return true;
        })
        .catch(defaultErrorCallback);
    })
    .then(function(success){
        imaginarySpaceships.wiki().go()
        .then(function(res){
            console.log(res.kind, res.data);
            return true;
        })
        .catch(defaultErrorCallback);
    })
    .catch(defaultErrorCallback);

//user tests
var samslate = new getReddit().url("user/samslate");
    samslate.go().then(function(success){
        samslate.hot().go()
        .then(function(res){
            console.log(res.kind, res.data);
            return true;
        })
        .catch(defaultErrorCallback);
    })
    .then(function(success){
        samslate.controversial().go()
        .then(function(res){
            console.log(res.kind, res.data);
            return true;
        })
        .catch(defaultErrorCallback);
    })
    .then(function(success){
        samslate.newest().go()
        .then(function(res){
            console.log(res.kind, res.data);
            return true;
        })
        .catch(defaultErrorCallback);
    })
    .then(function(success){
        samslate.top().go()
        .then(function(res){
            console.log(res.kind, res.data);
            return true;
        })
        .catch(defaultErrorCallback);
    })
    .then(function(success){
        samslate.comments().go()
        .then(function(res){
            console.log(res.kind, res.data);
            return true;
        })
        .catch(defaultErrorCallback);
    })
    .then(function(success){
        samslate.downvoted().go()
        .then(function(res){
            console.log(res.kind, res.data);
            return true;
        })
        .catch(defaultErrorCallback);
    })
    .then(function(success){
        samslate.hidden().go()
        .then(function(res){
            console.log(res.kind, res.data);
            return true;
        })
        .catch(defaultErrorCallback);
    })
    .then(function(success){
        samslate.hidden().go()
        .then(function(res){
            console.log(res.kind, res.data);
            return true;
        })
        .catch(defaultErrorCallback);
    })
    .then(function(success){
        samslate.overview().go()
        .then(function(res){
            console.log(res.kind, res.data);
            return true;
        })
        .catch(defaultErrorCallback);
    })
    .then(function(success){
        samslate.saved().go()
        .then(function(res){
            console.log(res.kind, res.data);
            return true;
        })
        .catch(defaultErrorCallback);
    })
    .then(function(success){
        samslate.submitted().go()
        .then(function(res){
            console.log(res.kind, res.data);
            return true;
        })
        .catch(defaultErrorCallback);
    })
    .then(function(success){
        samslate.upvoted().go()
        .then(function(res){
            console.log(res.kind, res.data);
            return true;
        })
        .catch(defaultErrorCallback);
    })