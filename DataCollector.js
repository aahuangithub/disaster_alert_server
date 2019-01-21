const request = require('request');
let Parser = require('rss-parser');
let parser = new Parser();
var distance = require('gps-distance');
var responseObject = { latestEventsArray: [] } // why?
setTimeout(function(){
request('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson', { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    for (var i = 0; i < body.features.length; i++) {
        if (new Date().valueOf() - body.features[i].properties.time < 6000999900) {
            console.log(body.features[i]);
            let feature = body.features[i]
            let properties = feature.properties
            if(properties.mag>=4.5)
                request.get('/user/contacts', (err, res, body)=>{
                    let contacts = body
                    contacts
                        .map(o=>sendNotification('earthquake', properties.mag, o.name, properties.place.replace("km"," kilometers")))
                })
        }
    }


    request('http://www.fire.ca.gov/rss/rss.xml', { json: false }, (err, res, body) => {
        if (err) { return console.log(err); }
        parser.parseString(body, function (err, feed) {
            feed.items.forEach(function (entry) {
                if (new Date().valueOf() - new Date(entry.isoDate).valueOf() < 600099900) {
                    console.log(entry);
                    sendNotification('fire'); // I have no idea if this works or not b/c it has never been triggered
                }
            })
        })

    });
});


function isWithinRadiusKm(radius, triggerLoc, eventLoc) {
    return (distance(triggerLoc.Lat, triggerLoc.Long, eventLoc.Lat, eventLoc.Long) <= radius)
}

function sendNotification(type, magnitude, person,location) {
    if (type == 'earthquake') {
        request('http://api.notifymyecho.com/v1/NotifyMe?notification=' +
            encodeURIComponent("A magnitude " +
                magnitude + ` earthquake was reported near ${person} ${location}. Should I call them and make sure they are ok?`)
            + '&accessCode=' +
            process.env.notifyAccessCode)
    } else {
        request(`http://api.notifymyecho.com/v1/NotifyMe?notification=${encodeURIComponent(`A ${type} was reported near ${person}. Should I call them and make sure they are ok?`)}&accessCode=` + process.env.notifyAccessCode)
    }
}
}, 30000)