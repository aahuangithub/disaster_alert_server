const express = require('express')
const app = express()
const path = require('path')
const User = require('./models/User')
const Contact = require('./models/Contact')

const [dbuser, dbpw] = ['aahuang', 'mlabmlab1']
app.use(express.static('./'))
app.use(express.json())

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
app.post('/test', function(req, res){
    // Create an instance of model SomeModel
    var awesome_instance = new User({ email: 'awesome', id:'test', contacts: [] });

    awesome_instance.save(function (err) {
});
})
if(!process.env.PORT)
    process.env.PORT = 3000
app.listen(process.env.PORT, function(){console.log('now listening on '+process.env.PORT)})