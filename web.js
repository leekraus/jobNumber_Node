/**
 * Created by nborisov on 9/28/13.
 */
global.confComp    = {};
var express         = require("express");
var task_wrapper    = require("./public/js/server_taskgen.js");
var path            = require('path');
var TaskModel       = require ("./libs/mongoose").TaskModel;
var ResultModel     = require ("./libs/mongoose").ResultModel;
var app             = express();
var nodesCount      = 1;
var ind             = 3;

app.use(express.logger());
app.use(express.static(path.join(__dirname, "public")));
app.get('/hello', function(request, response) {
    response.send('Hello!');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});

app.get('/gettask', function(request, res) {
    nodesCount++;
    if (global.confComp.task) {
        global.confComp.task.ind = ind;
        ind+= 2;

        res.end(JSON.stringify(global.confComp.task, undefined, 2));
    } else {
        TaskModel.find({_id: 0}).exec(function(err, result) {
            if (!err) {
                global.confComp.task = result[0];
                global.confComp.task.ind = ind;
                ind+= 2;

                res.end(JSON.stringify(global.confComp.task, undefined, 2));
            } else {
                res.end('Error in first query. ' + err);
            }
        });
    }
});
app.get('/stress', function(request, res) {
    var i;
    for (i=3;i<200;i+=2) {

        var result = new ResultModel({
            ind: i,
            time: Math.round(i + Math.random()*5*i + Math.random()*3),
            nodCount: 1,
//            result: ((Math.random(1) >= 0.5) ? 1 : 0),
            result: isPrime(i),
            _task: 0
        });
        console.log(i);
        result.save(function (err) {
            if (err) console.log ('Error on save!')
        });
    }
});
app.get('/getchartdata', function(request, res) {
    ResultModel.find({_task: 0}, 'ind time result')
//        .sort('ind')
        .limit(100)
        .exec(function(err, results){
            if (!err) {
                results.sort(function(a,b) { return parseFloat(a.ind) - parseFloat(b.ind) } );
                var arrays = {ind: [], time: [], result: []};
                results.forEach(function(item, i, arr){
                    arrays.ind.push(+results[i].ind);
                    arrays.time.push(+results[i].time);
                    arrays.result.push(+results[i].result);
                });
                res.end(JSON.stringify(arrays, undefined, 2));
            } else {
                res.end('Error in first query. ' + err);
            }

    });
});

app.get('/setresult', function(request, res) {
    var result = new ResultModel({
        ind: request.query.ind,
        time: request.query.runtime,
        nodCount: nodesCount,
        result: request.query.result,
        _task: global.confComp.task._id
    });
    result.save(function (err) {
        if (err){
            console.log ('Error on save!');
            res.end("ERROR");
        }
        else
            res.end("SUCCESS");
    });
    nodesCount--;
});

isPrime = function(n) {
    if (isNaN(n) || !isFinite(n) || n%1 || n<2) return 0;
    if (n==leastFactor(n)) return 1;
    return 0;
}

// leastFactor(n)
// returns the smallest prime that divides n
//     NaN if n is NaN or Infinity
//      0  if n=0
//      1  if n=1, n=-1, or n is not an integer

leastFactor = function(n){
    if (isNaN(n) || !isFinite(n)) return NaN;
    if (n==0) return 0;
    if (n%1 || n*n<2) return 1;
    if (n%2==0) return 2;
    if (n%3==0) return 3;
    if (n%5==0) return 5;
    var m = Math.sqrt(n);
    for (var i=7;i<=m;i+=30) {
        if (n%i==0)      return i;
        if (n%(i+4)==0)  return i+4;
        if (n%(i+6)==0)  return i+6;
        if (n%(i+10)==0) return i+10;
        if (n%(i+12)==0) return i+12;
        if (n%(i+16)==0) return i+16;
        if (n%(i+22)==0) return i+22;
        if (n%(i+24)==0) return i+24;
    }
    return n;
}



