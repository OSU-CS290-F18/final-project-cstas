/*
 * Node.js backend for CS TAs, group 3, calendar web app, final project in CS 290
 * Authors: Tristan Hilbert, Tyler Titsworth, Ryan Kennedy, Alexander Guyer
 * Created on 11/7/2018 @ 1:46 am
 *
 */
const bodyParser = require('body-parser');
const express = require('express');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const app = express();
const c = require('calendar');

const MongoClient = require('mongodb').MongoClient;

const assert = require('assert');
var mongoHost = process.env.MONGO_HOST || '35.235.123.219';
var mongoPort = process.env.MONGO_PORT || 27017;
var mongoUser = process.env.MONGO_USER || 'csta';
var mongoPassword = process.env.MONGO_PASSWORD || 'gcp-csta';
var mongoDbName = process.env.MONGO_DB_NAME || 'final';
var mongoUrl = 'mongodb://' + mongoUser + ':' + mongoPassword + '@' + mongoHost + ':' + mongoPort + '/' + mongoDbName;
var db;
var port = process.env.PORT || 80;

// /*
//  *
//  * Connect to Mongo DB
//  *
//  */

MongoClient.connect(mongoUrl, function (err, client){
	assert.equal(null, err);
	console.log('Driver connected to Mongo DB');

	db = client.db(mongoDbName);
	app.listen(port, function(){
		console.log("Server listening on port", port);	
	});

	debug_Database();
});

//Set up Tristan's weird Templating
const custom_handles = require("./custom_handlebar.js");
custom_handles.attach_custom_handles(handlebars);

//Set up express
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");
app.use(express.static('public'));
app.use(bodyParser.json());

//set up blocks
var context = require("./context.json");
context["event"] = "*Event*";

app.get("/event/:month/:year/:time", function(req, res, next){
    //should search for event here
    var time = parseInt(req.params.time);
    var year = parseInt(req.params.year);
	var month = parseInt(req.params.month);
	var pass = {};
	pass.base = "../../../..";
    db.collection('event').find({"time":time, "year":year, "month":month}).toArray(function(err, eventDocs){
        console.log(eventDocs);
        pass.event_pass = {};
		pass.event = eventDocs;
		console.log("== Passing: ", pass);
        res.status(200).render('events', pass);
    });
});

app.get("/:month/:week/:year", function(req, res, next){
    var week = parseInt(req.params.week);
    var year = parseInt(req.params.year);
    var month = parseInt(req.params.month);
    renderCalendar(week, year, month, res, next);
});

function renderCalendar(week, year, month, res, next){
    var w2; var y2; var m2;
    db.collection('event').find({"month":month, "year":year}).toArray(function(err, event){
    cal = new c.Calendar(1);
    cal = cal.monthDays(year, month);
    w2 = cal.length-1;
   	if(cal.length > week){
		var contextClone = JSON.parse(JSON.stringify(context));
       		cal = cal[week];
      	 	for(var j = 0; j < event.length; j++){
           		if(event[j]["year"] == year && event[j]["month"] == month){
                		for(var i = 0; i < cal.length; i++){
                   			if(cal[i] == event[j]["day"]){
                      			 	contextClone["times"][event[j]["time"]][contextClone["day"][i]] = true;
                    			}
                		}
            		}
            }
            contextClone["local"] = "/event/"+String(month)+'/'+String(year)+'/';            
            if(week == w2){
                w2 = 0;
                if(month == 11){y2 = year + 1; m2 = 0}
                else{m2 = month+1; y2 = year;}
            }
            else{w2 = week+1; y2=year; m2=month}
            contextClone["next"] = '/' + String(m2) + '/' + String(w2) + '/' + String(y2);
            
            if(week == 0){
                if(month == 0){y2 = year - 1; m2 = 11}
                else{m2 = month - 1; y2 = year;}
                cal = new c.Calendar(1);
                cal = cal.monthDays(y2, m2);
                w2 = cal.length -1;
            }
            else{w2 = week-1; y2=year; m2=month}
            contextClone["last"] = '/' + String(m2) + '/' + String(w2) + '/' + String(y2);
        	res.status(200).render('calendar_app', {'context': contextClone});
    	}
    	else{
            delete cal;
        	console.log("bad");
        	next();
    	}
    });
}



//serve webpage, will need updating
app.get("/", function(req, res, next){
    //Get current month, week, and year, then render that page
    var now = new Date();
    var date = new Date(now.getFullYear(), now.getMonth(), 1);//Move to first of month
    var week = Math.floor((now.getDate() + (date.getDay() == 0 ? 6 : (date.getDay() - 1)) - 1) / 7);
    renderCalendar(week, date.getFullYear(), date.getMonth(), res, next);
});

app.get("*", function(req, res, next){
    res.status(404).render('404', {});
});

//Response handler for event posts. As month, week, year, and time are all path parameters, the only body parameter
//should be the name. Here's an example post:

/*
var request = new XMLHttpRequest();
var requestUrl = '/event/' + someMonth + '/' + someDay + '/' + someYear + '/' + someTime;
request.open('POST', requestUrl);
var bodyObj = {
	name: someName
};
var body = JSON.stringify(bodyObj);
request.setRequestHeader({
	'Content-Type': 'application/json'
});
request.addEventListener('load', function(event){
	//Perhaps make an alert saying the post was successful after checking event.target.status == 200, or
	//alert an error if the status is something else
});
request.send(body);

//Simply replace someMonth, someDay, someYear, someTime, and someName with the actual user input in the modal when
//asking the user what event they would like to create

*/

app.post('/event/:month/:day/:year/:time', function(req, res, next){
	var month = req.params.month;
	var day = req.params.day;
	var year = req.params.year;
	var time = req.params.time;
	var time12Num = time;
	var name = req.body.name;
	var amPm;
	if(time12Num >= 12){
		amPm = 'PM';
		if(time12Num > 12){
			time12Num -= 12;
		}
	}else{
		amPm = 'AM';
		if(time12Num == 0)
			time12Num = 12;
	}
	
	var time12 = (time12Num < 10 ? '0' : '') + time12Num + ':00 ' + amPm;
	
	//Now update the database
	db.collection('event').insertOne({'name': name, 'time': time, 'time12': time12, 'month': month, 'year': year, 'day': day});
	res.status(200).send('Post added successfully');
});


/*
 Set Up Use Debugging Events
 -- Tristan H
*/
function debug_Database(){
	if(process.env.DEBUG){
		db.collection('event').drop();
		db.collection('event').insertOne({'name': "Killin Time", 'time': 11, 'time12': "11:00 AM", 'month': 10, 'year': 2018, 'day': 3});
		db.collection('event').insertOne({'name': "Porking Time", 'time': 14, 'time12': "02:00 PM", 'month': 11, 'year': 2018, 'day': 6});
		db.collection('event').insertOne({'name': "Another Time Long Ago", 'time': 15, 'time12': "03:00 PM", 'month': 9, 'year': 2019, 'day': 17});
		db.collection('event').insertOne({'name': "Disney Land", "time": 17, 'time12': "05:00 PM", 'month': 1, 'year': 2019, 'day': 1});
	}
}