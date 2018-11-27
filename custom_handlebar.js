/*
 * Tristan Hilbert
 * 11/21/2018
 * Custom Handlebar Helper Function for Calendar Templating
 * 
 */

//TODO
//timeIndex time

//sorry i deleted your functions they were super cool but i made them templates to add the tags

const times = require('./times.json')

module.exports.attach_custom_handles = function(handlebar){
    handlebar.registerHelper("getDay", function(obj, key){
        return parseInt(obj[key]);
    });
    handlebar.registerHelper("yearPrint", function(year){
        if(year < 10){year = "All";}
        return year;
    });
    handlebar.registerHelper("dayPrint", function(date, day){
        if(date != 0){day = day + ': ' + String(date);}
        return day;
    });
    handlebar.registerHelper("monthPrint", function(month){
        if(month > 12){month = "All";}
        return month;
    });
    handlebar.registerHelper("timeConvert", function(time){
        return times[time];
    });
    handlebar.registerHelper("ifDay", function(day, check, out){
        if(check[day]){return String(out);}
        return "";
    });
}