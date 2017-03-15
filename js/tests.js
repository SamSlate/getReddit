var imaginarySpaceships = new getReddit().url("r/imaginarySpaceships");
    imaginarySpaceships.controversial().go()
    .then(function(res){
        console.log(res.kind, res.data);
        return true;
    })
    .then(function(success){
        imaginarySpaceships.hot().go()
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
    });