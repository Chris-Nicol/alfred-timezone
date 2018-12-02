'use strict';
const alfy = require('alfy');
const moment = require('moment-timezone');


//get timezones to process
var defaultTimezone = 'Europe/Madrid';
var timezones = ['America/Vancouver', 'Europe/Madrid', 'Asia/Calcutta'];

// get time from input (defaults to now)
var requestedTime = parseTimeFromInput(alfy.input);

//return list of times
var results = getTimesByTimezone(requestedTime, defaultTimezone, timezones);
alfy.output(results);


//Returns list of times based on requested time for each timezone
function getTimesByTimezone(requestedTime, defaultTimezone, requestedTimezones){

	var items = requestedTimezones
			.map(zone => {
    
				return {
					title: moment(requestedTime, zone).format('h:mma zz'),
					valid: false,
					subtitle:  moment(requestedTime, zone).format('dddd'),
					// icon: {
					// 	path: formatting.getIconByType(x.icon, units, x)
					// }
				};
			});
		
	return items;
}


//Parses input from Alfred to look for a valid time provided from the user. Defaults to current time or returns error is a valid time is not provided
function parseTimeFromInput(time) {
	
	//If there's blank input, user is looking for current time
	if (time == '') {
		return new Date();
	}

	var hour, minute, 
		pm = time.match(/p/i) !== null,
		num = time.replace(/[^0-9]/g, '');
	
	// Parse for hour and minute
	switch(num.length) {
	case 4:
		hour = parseInt(num[0] + num[1], 10);
		minute = parseInt(num[2] + num[3], 10);
		break;
	case 3:
		hour = parseInt(num[0], 10);
		minute = parseInt(num[1] + num[2], 10);
		break;
	case 2:
	case 1:
		hour = parseInt(num[0] + (num[1] || ''), 10);
		minute = 0;
		break;
	default:
		return new Date();
	}
	
	// Make sure hour is in 24 hour format
	if( pm === true && hour > 0 && hour < 12 ) hour += 12;
	
	// Force pm for hours between 13:00 and 23:00
	if( hour >= 13 && hour <= 23 ) pm = true;
	
	// Keep within range
	if( hour <= 0 || hour >= 24 ) hour = 0;
	if( minute < 0 || minute > 59 ) minute = 0;
 
	// Format output
	var d = new Date();    	    	
	d.setHours(hour);
	d.setMinutes(minute);
	d.setSeconds(0, 0);	 
	return d;
}
