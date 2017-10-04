(function (){
	"use strict";

	// Declare the graphic elements
	var barLab = document.getElementsByClassName("progress-bar-primary")[0];
	var barFail = document.getElementsByClassName("progress-bar-danger")[0];
	var numLab = document.getElementsByClassName("labelled-perc")[0];
	var numFail = document.getElementsByClassName("failed-num")[0];

	var database = firebase.database();
	var segments = []

	console.log("Retrieving Stats...");

	firebase.database().ref('/segments/').once('value').then(function(snapshot) {
		segments = Object.values(snapshot.val());

		var labelled = 0;
		var total = segments.length;
		var scrapped = 0;

		for (var i = segments.length - 1; i >= 0; i--) {

			if(segments[i] != null) {
				if(segments[i].verified == 1) {
					labelled++;
				}
				if(segments[i].scrapped == 1) {
					scrapped++;
				}
			}

		}

		// Update dashboard
		barLab.style.width = ((labelled*100)/total).toString()+"%";
		numLab.innerText = labelled+"/"+total+" | "+((labelled*100)/total).toString()+"%";

		barFail.style.width = (scrapped*100/total).toString()+"%";
		numFail.innerText = scrapped+"/"+total+" | "+(scrapped*100/total).toString()+"%";

		console.log("Stats loaded");

	}).catch(function(db_error) {
		console.log("Error loading stats");
		document.getElementsByClassName("stats-body")[0].innerHTML = "<center><a onclick='location.reload()'><h3>Retry</h3></a></center>";

	});

}());
