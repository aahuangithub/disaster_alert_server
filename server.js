//express setup
const express = require('express')
const app = express()
const path = require('path')
app.use(express.static('./'))
app.use(express.json())

//db stuff
const User = require('./models/User')
const Contact = require('./models/Contact')
const [dbuser, dbpw] = [process.env.dbuser, process.env.dbpw]
const mongoose = require('mongoose');
let dev_db_url = `mongodb://${dbuser}:${dbpw}@ds161794.mlab.com:61794/disaster`
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.get('/test', function(req, res){
    res.send({"success": true})
})
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, "Alexa", "html5up-solid-state", 'elements.html'))
})

app.post('/user/create', function(req, res){
    var awesome_instance = new User({ email: req.body.email, userid: req.body.id, contacts: [] });
    awesome_instance.save(function (err) {
        if(err) 
            res.status(500).send()
        else
            res.status(202).send()
    })

})

// debug route -- will return true if debugging
app.post('/debug', function(req, res){
    res.send(JSON.stringify({success: true}))
})

// sets up the server
if(!process.env.PORT) process.env.PORT = 3000
app.listen(process.env.PORT, function(){console.log('now listening on '+process.env.PORT)})