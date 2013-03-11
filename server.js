/*
    first run npm install
    then when into dir type node server.js
*/

var express = require('express');//inclide express
var mongo = require('mongodb');//then mongo fw

var app = express();//new expess

app.configure(function(){});//make express config


var Server = mongo.Server,//mongodb server
    Db = mongo.Db;//and db

var server = new Server('localhost', 27017, {auto_reconnect: true});//create server conn
db = new Db('utlogdb', server);//to database

db.open(function(err,db){//test connection
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
//router for req /
app.get('/', function(req, res){
    db.collection('utlog', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
});

//router for req /id/:id ,request should look like http://localhost:3000/id/513e496a6effb2b75d000001
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
//router will look for a date for req /date/:date ,request should look like http://localhost:3000/date/2013-03-11T21:15:22.902Z
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
//will add random log when http://localhost:3000/add is opened
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

app.listen(3000);//start the server on port 3000
console.log('listen on port: 3000');