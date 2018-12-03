/*
 * Server.js
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
const months = require('./months.json')                                           
const assert = require('assert');                                  //List of months organzed by index
var context = require("./context.json");                           //Our context file with times, days, and dates


/*
 * Set up Mongo vars
 */
const MongoClient = require('mongodb').MongoClient;                
var mongoHost = process.env.MONGO_HOST || '35.235.123.219';
var mongoPort = process.env.MONGO_PORT || 27017;
var mongoUser = process.env.MONGO_USER || 'csta';
var mongoPassword = process.env.MONGO_PASSWORD || 'gcp-csta';
var mongoDbName = process.env.MONGO_DB_NAME || 'final';
var mongoUrl = 'mongodb://' + mongoUser + ':' + mongoPassword + '@' + mongoHost + ':' + mongoPort + '/' + mongoDbName;
var db;
var port = process.env.PORT || 80;

/*
 * Connect to Mongo DB
 */
MongoClient.connect(mongoUrl, function (err, client){
	assert.equal(null, err);                                //if no errors
	console.log('Driver connected to Mongo DB');

	db = client.db(mongoDbName);                            //sets up db var
	app.listen(port, function(){
		console.log("Server listening on port", port);	    //starts server conditional on the DB
	});

	//debug_Database();                                       //adds our debug events
});

//Set up handlebars helper functions
const custom_handles = require("./custom_handlebar.js");
custom_handles.attach_custom_handles(handlebars);

//Set up express
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");
app.use(express.static('public'));
app.use("/compiled", express.static('compiled')) /* For Compiled Stylsheets */
app.use(bodyParser.json());

/*
 * Renders a page that contains eavh event corresponding to that date, including repeated events
 */
app.get("/event/:month/:year/:date/:time/:day", function(req, res, next){
    var date = parseInt(req.params.date);
    var time = parseInt(req.params.time);
	var year = parseInt(req.params.year);       //gets parameters from the url
    var month = parseInt(req.params.month);
    day = req.params.day;

    db.collection('event').find({$or: [{"time":time, "year":year, "month":month, "date": date},                     //finds events that are strictly equal to the parameters
            {"year":0, "time":time, $or: [{'day':day}, {'day': "All"}]}]}).toArray(function(err, eventDocs){        //finds events with the right day of the week that are repeats
        var event = eventDocs;
        if(date == 0){event = null;}                        //if not a real date deletes the array so that it doesnt show repeats on zero dates
        res.status(200).render('events', {event});
    });
});

/*
 * Calculates the current week date and year and renders a calendar based on that date 
 */
app.get("/", function(req, res, next){ 
    var now = new Date();
    var date = new Date(now.getFullYear(), now.getMonth(), 1);                                              //Get current month, week, and year
    var week = Math.floor((now.getDate() + (date.getDay() == 0 ? 6 : (date.getDay() - 1)) - 1) / 7);        //Does tricky math to do so
    renderCalendar(week, date.getFullYear(), date.getMonth(), res, next);                            
});

/*
 * Renders a calendar based on an inputed month week and year
 */
app.get("/:month/:week/:year", function(req, res, next){
    var week = parseInt(req.params.week);
    var year = parseInt(req.params.year);                           //grabs params from url
    var month = parseInt(req.params.month);
    renderCalendar(week, year, month, res, next);
});



/* 
 * Renders a calendar based on a week year and month
 */
function renderCalendar(week, year, month, res, next){
    var w2; var y2; var m2;        //temp vars for later

    db.collection('event').find( { $or: [{"month":month, "year":year}, {"year":0}]}).toArray(function(err, event){   //grabs events within the month and repeats
    
    cal = new c.Calendar(1);
    cal = cal.monthDays(year, month);                                  //creates new double array of dates
    w2 = cal.length-1;                                                 //saves the number of weeks in the month           
   	if(cal.length > week){                                             //if the requested week is within the month
		var contextClone = JSON.parse(JSON.stringify(context));        //copy context
            cal = cal[week];                                           //switch to a single week 
            var i = 0;
            for(var key in contextClone['weekDates']){
                contextClone['weekDates'][key] = cal[i];               //fill the week dates objects with the correct dates
                i++;
            }   
            contextClone['month'] = months[String(month)];             //sets month to be printed
            contextClone['year'] = year;                               //sets year to be printed
      	 	for(var j = 0; j < event.length; j++){
                for(var i = 0; i < cal.length; i++){                   //for every object and day of the week
                    if(((event[j]['day'] == 'All' || cal[i] == event[j]["date"]) ||                                     //if the event is a daily repeat or on that date
                            (event[j]['day'] == contextClone['day'][i] && event[j]['year'] == 0)) && cal[i] != 0){      //or the day of the week is the same and its a weekly
                                                                                                                        //repeat and the day is on the calendar
                        contextClone["times"][event[j]["time"]][contextClone["day"][i]] = true;                         //than set the event identifier to true
                    
                    }
                }
            }
            contextClone["local"] = "/event/"+String(month)+'/'+String(year)+'/';      //sets the beginning of the web address string
           
            nextLast(week, w2, month, m2, year, y2, contextClone);                     //sets up the next and last buttons

        	res.status(200).render('calendar_app', {'context': contextClone});         //renders
    	}
    	else{
        	console.log("bad");                                                        //if a bad date moves on to the 404             
        	next(); 
    	}
    });
}

/*
 * For any non recognized address sends 404
 */
app.get("*", function(req, res, next){
    res.status(404).render('404', {});
});

/*
 * Adds a new event to the MongoDB based on a formatted POST request
 */
app.post('/event/:month/:date/:year/:time', function(req, res, next){
	var month = parseInt(req.params.month);
    var date = parseInt(req.params.date);
    var repeat = req.body.repeat;                   //pulls vars from request
	var year = parseInt(req.params.year);
	var time = parseInt(req.params.time);
	var time12Num = time;
    var name = req.body.name;
    var amPm;
    timeBack = req.body.timeBack;

    var tempDate = new Date(year, month, date);     //sets day of the week
    var day = tempDate.getDay();
    if(day == 0){day = 6;}
    else{day -= 1;}
    day = context['day'][day];                     
    if(repeat == 'week'){
        month = 15;                                 //sets up repeat if week
        date = 0;
        year = 0;
    }
    if(repeat == 'day'){
        month = 15;                                 //sets up repeat if day
        date = 0;
        day = 'All';
        year = 0;
    }
    
	if(time12Num >= 12){
		amPm = 'PM';                                //converts 24 hour time to 12 hour time with notation
		if(time12Num > 12){
			time12Num -= 12;
		}
	}else{
		amPm = 'AM';
		if(time12Num == 0)
			time12Num = 12;
	}
	var time12 = (time12Num < 10 ? '0' : '') + time12Num + ':' + timeBack + ' ' + amPm;       
    
    console.log('========================= inserting ========================');
    console.log("*** ", name, " ***");                                              //inserts the element and logs it
	db.collection('event').insertOne({'name': name, 'time': time, 'time12': time12, 'month': month, 'year': year, 'day': day, 'date': date});
    res.status(200).send('Post added successfully');
    console.log('========================= done =============================');
    
});

/* 
 * Deletes an element from the Mongo DB
 */
app.delete('/event/:month/:year/:day/:time/:day/delete', function(req, res, next){
    var day = req.body.day;
    var time = parseInt(req.params.time);           //pulls vars from the request
    var name = req.body.name;

    console.log('========================= deleting ========================');
    console.log("*** ", name, " ***");                                              //deletes element and logs it
	db.collection('event').deleteOne({'name': name, 'time': time, $or: [{'day':day},{'day': "All"}]});
	res.status(200).send('Post added successfully');
});
 

                                                                         
/*
 * Adds 5 events to the MongoDB to test it 
 */
function debug_Database(){
	if(process.env.DEBUG){
        console.log("====Running");
        
		db.collection('event').drop();
		db.collection('event').insertOne({'name': "Killin Time", 'time': 11, 'time12': "11:00 AM", 'month': 10, 'year': 2018, 'date': 3, 'day': "Sat"});
		db.collection('event').insertOne({'name': "Porking Time", 'time': 14, 'time12': "02:00 PM", 'month': 11, 'year': 2018, 'date': 6, 'day': "Thu"});
		db.collection('event').insertOne({'name': "Another Time Long Ago", 'time': 15, 'time12': "03:00 PM", 'month': 9, 'year': 2019, 'date': 17, 'day': "Thu"});
        db.collection('event').insertOne({'name': "Disney Land", "time": 17, 'time12': "05:00 PM", 'month': 1, 'year': 2019, 'date': 1, 'day': "Fri"});
        db.collection('event').insertOne({'name': "Repeat", "time": 12, 'time12': "01:00 PM", 'month': 15, 'year': 0, 'date': 0, 'day': "Fri"});
        db.collection('event').insertOne({'name': "Repeat", "time": 2, 'time12': "01:00 PM", 'month': 15, 'year': 0, 'date': 0, 'day': "All"});
	}
}


/*
 *  Sets links to be fed to the next and last buttons
 */
function nextLast(week, w2, month, m2, year, y2, contextClone){
    //======================== for next link ============================//
    if(week == w2){                             //if week is last in month
        w2 = 0;                                 
        if(month == 11){y2 = year + 1; m2 = 0}  //move to next month, if december move to next year
        else{m2 = month+1; y2 = year;}
    }
    else{w2 = week+1; y2=year; m2=month}        //otherwise just add a week

    contextClone["next"] = '/' + String(m2) + '/' + String(w2) + '/' + String(y2);  //sets next object accordingly
    //======================== for last link ============================//
    if(week == 0){                              //if first week
        if(month == 0){y2 = year - 1; m2 = 11}  //if january decrament year, month becomes 11
        else{m2 = month - 1; y2 = year;}        //otherwise month is decramented
        var cal = new c.Calendar(1);            //uses new calendar to go to last week of previous month
        cal = cal.monthDays(y2, m2);
        w2 = cal.length -1;
    }
    else{w2 = week-1; y2=year; m2=month}        //else week sub 1
    contextClone["last"] = '/' + String(m2) + '/' + String(w2) + '/' + String(y2);  //sets last object accordingly
}