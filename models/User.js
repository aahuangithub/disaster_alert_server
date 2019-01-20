const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Contact = require('./Contact.js')

let User = new Schema({
    email: {type: String},
    userid: {type: String},
    contacts: []
});


module.exports = mongoose.model('User', User);