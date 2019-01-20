const request = require('request');
let Parser = require('rss-parser');
let parser = new Parser();
var distance = require('gps-distance');
var responseObject = { latestEventsArray: [] }

request.post('https://alexa-disaster.herokuapp.com/debug', (err, res, body) => {console.log(res.body)})

request('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson', { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    for (var i = 0; i < body.features.length; i++) {
        if (new Date().valueOf() - body.features[i].properties.time < 600000) {
            console.log(body.features[i]);
            sendNotification(body.features[i].properties.type, body.features[i].properties.mag)
            //responseObject.latestEventsArray.push({ type: body.features[i].properties.type, magnitude: body.features[i].properties.mag, location: { lat: body.features[i].geometry.coordinates[0], long: body.features[i].geometry.coordinates[1] } })
        }
    }


    request('http://www.fire.ca.gov/rss/rss.xml', { json: false }, (err, res, body) => {
        if (err) { return console.log(err); }
        parser.parseString(body, function (err, feed) {
            feed.items.forEach(function (entry) {
                if (new Date().valueOf() - new Date(entry.isoDate).valueOf() < 600000) {
                    console.log(entry);
                    sendNotification('fire');
                }
            })
        })

    });
});


function isWithinRadiusKm(radius, triggerLoc, eventLoc) {
    return (distance(triggerLoc.Lat, triggerLoc.Long, eventLoc.Lat, eventLoc.Long) <= radius)
}

function sendNotification(type, magnitude) {
    if (type == 'earthquake') {
        request('http://api.notifymyecho.com/v1/NotifyMe?notification=' +
            encodeURIComponent("A magnitude " + 
                magnitude + ' earthquake was reported near your contact, Sam. Should I call them and make sure they are ok?') 
                +'&accessCode=' + 
                process.env.notifyAccessCode)
    } else {
        request(`http://api.notifymyecho.com/v1/NotifyMe?notification=${encodeURIComponent(`A ${type} was reported near your contact, Sam. Should I call them and make sure they are ok?`)}&accessCode=` + process.env.notifyAccessCode)
    }
} 
