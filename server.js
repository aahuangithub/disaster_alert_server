const express = require('express')
const app = express()
const path = require('path')
const [dbuser, dbpw] = [process.env.dbuser, process.env.dbpw]
app.use(express.static('./'))
app.use(express.json())
app.get('/test', function(req, res){
    res.send({"success": true})
})
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'))
})
app.listen(process.env.PORT, function(){console.log('now listening on '+process.env.PORT)})