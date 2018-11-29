/*
 * Custom_handlebar.js
 * Custom Handlebar Helper Functions for Calendar Templating
 * Authors: Tristan Hilbert / Ryan Kennedy
 * Created: 11/21/2018
 */

const times = require('./times.json');    //saves times.json for conversion between 24hr and 12 hr with notation

module.exports.attach_custom_handles = function(handlebar){
    
    //returns the numerical date corresponding to that day of the week
    handlebar.registerHelper("getDay", function(weekDays, day){
        return parseInt(weekDays[day]);
    });
    
    //Prints the year or ALL if its any year
    handlebar.registerHelper("yearPrint", function(year){
        if(year < 10){year = "All";}
        return year;
    });
    
    //Prints the day of the week and the date if it exists
    handlebar.registerHelper("dayPrint", function(date, day){
        if(date != 0){day = day + ': ' + String(date);}
        return day;
    });
    
    //Returns the month, or ALL if it's any month
    handlebar.registerHelper("monthPrint", function(month){
        if(month > 12){month = "All";}
        return month;
    });
    
    //Converts 12 hour time to 24 hr time
    handlebar.registerHelper("timeConvert", function(time){
        return times[time];
    });
    
    //returns the string out if there is a marked event and returns nothing if there isn't  
    handlebar.registerHelper("ifEvent", function(day, check, out){
        if(check[day]){return String(out);}
        return "";
    });
}