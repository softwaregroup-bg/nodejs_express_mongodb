var express = require('express');
var mongo = require('mongodb');

var app = express();

app.configure(function(){});


var Server = mongo.Server,
    Db = mongo.Db;

var server = new Server('localhost', 27017, {auto_reconnect: true});
    db = new Db('utlogdb', server);

db.open(function(err,db){
    if(!err){
        console.log("Connected to '" + db.databaseName + "' database");
        db.collection('utlog', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The '" + collection.collectionName + "' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

app.get('/', function(req, res){
    db.collection('utlog', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
});

app.get('/id/:id', function(req, res){
    db.collection('utlog', function(err, collection) {
        collection.find().toArray(function(err, items) {
            var out = [];
            items.forEach(function(item){
                if(item._id == req.params.id)
                    out.push(item);
            });
            res.send(JSON.stringify(out));
        });
    });
});
app.get('/date/:date', function(req, res){
    db.collection('utlog', function(err, collection) {
        collection.find().toArray(function(err, items) {
            var out = [];
            items.forEach(function(item){
                if(item.date.toString() == (new Date(req.params.date)).toString())
                    out.push(item);
            });
            res.send(JSON.stringify(out));
        });
    });
});

app.get('/add', function(req, res){
    res.send('Record Added.');
    db.collection('utlog', function(err, collection) {
        collection.insert({"date":new Date(),"body":'bodi bla bla'}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
            }
        });
    });
    
});

app.listen(3000);
console.log('listen on port: 3000');