/*
Javascript function that, when called by a mouseClick event, will
connect to the Firebase cloud server and download all the appropriate
(verified and not scrapped) audio segement's URLs and generate
a text file for later downloading.
*/

function download(name, but) {
	"use strict";

	// Define appearance variables for UI elements
	var warningClass = "btn btn-warning btn-rounded btn-download";
	var primaryClass = "btn btn-primary btn-rounded btn-download";
	var successClass = "btn btn-success btn-rounded btn-download";

	// Turn button orange to show that download is occuring
	but.className = warningClass;

	console.log("Downloading "+name);

	// Declare arrays for storing data
	var downloadPaths = [];
	var downloadURLs = [];
	var downloadCues = [];

	// Connect Firebase cloud database and file storage
	var database = firebase.database();
	var storage = firebase.storage();
	var storageRef = storage.ref('/');

	// Insert Firebase 'sessions' table results into an array
	firebase.database().ref('/sessions/').once('value').then(function(snapshot) {
		var dbSessions = snapshot.val();

		// Insert Firebase 'segments' table results into an array
		firebase.database().ref('/segments/').once('value').then(function(snapshot) {
			var dbSegs = Object.values(snapshot.val());
			// Loop through the segments and find ones that match the session and are verified
			for (var i = 0; i < dbSegs.length; i++) {
				if(dbSessions[dbSegs[i].session].name == name & dbSegs[i].verified == 1) {
					console.log("Downloading : "+dbSegs[i].label);

					// Generate the remote URL for the segment's .wav file
					var audioRef = storageRef.child(dbSegs[i].filename);
					audioRef.getDownloadURL().then(function(link) {

						// Save the URL
						var cue = "<label>"+"\t"+link;
						downloadURLs.push(link);
						downloadCues.push(cue);

						// Update the UI button to green for success
						but.className = successClass;

						// Generate a text file with the URLs and trigger save event
						var blob = new Blob(downloadCues, {type: "text/plain;charset=utf-8"});
						saveAs(blob, name+".txt");
						console.log("> "+link);

					}).catch(function(error) { // Catch URL generation errors
						console.log("couldn't load url");
					});

				}
			}
			// Change button to black if no files are available for download
			but.className = primaryClass;

		}).catch(function(db_error) { // Catch DB read errors
			console.log("Error loading from DB segments");
		});


	}).catch(function(db_error) {
		console.log("Error loading from DB sessions");
	});


}
