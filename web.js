/**
 * Created by YCotov on 11/23/15.
 */
global.confComp    = {};
var express         = require("express");
var path            = require('path');
var app             = express();


app.use(express.logger());
app.use(express.static(path.join(__dirname, "public")));
app.get('/hello', function(request, response) {
    response.send('Hello!');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});

/**
 * 
 */
app.get('/home', function(request, res) {
    
});
app.get('/stress', function(request, res) {
    
});
app.get('/getchartdata', function(request, res) {
});
app.get('/setresult', function(request, res) {
    /*
    var result = new ResultModel({
        ind: request.query.ind,
        time: request.query.runtime,
        nodCount: nodesCount,
        result: request.query.result,
        _task: global.confComp.task._id
    });*/
    /*
    result.save(function (err) {
        if (err){
            console.log ('Error on save!');
            res.end("ERROR");
        }
        else
            res.end("SUCCESS");
    });*/   
});