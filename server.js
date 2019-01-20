//express setup
const express = require('express')
const app = express()
const path = require('path')
const request = require('request')
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


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "Alexa", "html5up-solid-state", 'elements.html'))
})

app.post('/user/create', function (req, res) {
    var awesome_instance = new User({ email: req.body.email, userid: req.body.id, contacts: [] });
    awesome_instance.save(function (err) {
        if (err)
            res.status(500).send()
        else
            res.status(202).send()
    })
})

app.post('/user/email', function (req, res) {
    console.log('user email triggered')
    User.findOne({
        email: req.body.email}, function(err, user) {
            console.log(user, err)
            if (user)
                res.send(user)

            else
                res.status(400).send()

        }
    )
})

app.get('/notify', function (req, res) {
    function sendNotification(type, magnitude) {
        if (type == 'earthquake') {
            request('http://api.notifymyecho.com/v1/NotifyMe?notification=' +
                encodeURIComponent("A magnitude " +
                    magnitude + ' earthquake was reported near your contact, Sam. Should I call them and make sure they are ok?')
                + '&accessCode=' +
                process.env.notifyAccessCode)
        } else {
            request(`http://api.notifymyecho.com/v1/NotifyMe?notification=${encodeURIComponent(`A ${type} was reported near your contact, Sam. Should I call them and make sure they are ok?`)}&accessCode=` + process.env.notifyAccessCode)
        }
    }
    sendNotification('fire')
    res.status(200).send()
})
app.post('/user/contacts', function (req, res) {

})
// debug route -- will return true if debugging
app.post('/debug', function (req, res) {
    console.log('the debug route was called with post')
    res.send(JSON.stringify({ success: true }))
})

// sets up the server
if (!process.env.PORT) process.env.PORT = 3000
app.listen(process.env.PORT, function () { console.log('now listening on ' + process.env.PORT) })