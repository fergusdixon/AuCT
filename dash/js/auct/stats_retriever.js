/*
Javascript controller script that connects to Firebase cloud server
and retrieves statistics about the segments stored, then updates
the data bars on the UI via the DOM.
*/

(function (){
	"use strict";

	// Declare the graphic elements with DOM
	var barLab = document.getElementsByClassName("progress-bar-primary")[0];
	var barFail = document.getElementsByClassName("progress-bar-danger")[0];
	var numLab = document.getElementsByClassName("labelled-perc")[0];
	var numFail = document.getElementsByClassName("failed-num")[0];

	// Firebase cloud server integration
	var database = firebase.database();
	// Prepare an array to hold segment objects from server
	var segments = []

	console.log("Retrieving Stats...");

	// Read the contents of the 'segments' table in cloud server to an array
	firebase.database().ref('/segments/').once('value').then(function(snapshot) {
		segments = Object.values(snapshot.val());

		// Prime variables to track statistics
		var labelled = 0;
		var total = segments.length;
		var scrapped = 0;

		for (var i = segments.length - 1; i >= 0; i--) {
			if(segments[i] != null) {
				if(segments[i].verified == 1) {labelled++;} // Counts verified segments
				if(segments[i].scrapped == 1) {scrapped++;} // Counts scrapped segments
			}
		}

		// Calculate stats and update dashboard UI elements
		barLab.style.width = ((labelled*100)/total).toString()+"%";
		numLab.innerText = labelled+"/"+total+" | "+Math.round((labelled*100)/total).toString()+"%";
		barFail.style.width = (scrapped*100/total).toString()+"%";
		numFail.innerText = scrapped+"/"+total+" | "+Math.round((scrapped*100)/total).toString()+"%";

		console.log("Stats loaded");

	}).catch(function(db_error) { // Handles errors from database read and generates a retry button on UI
		console.log("Error loading stats");
		document.getElementsByClassName("stats-body")[0].innerHTML = "<center><a onclick='location.reload()'><h3>Retry</h3></a></center>";

	});

}());
