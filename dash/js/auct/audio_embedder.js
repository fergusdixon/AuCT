/*
Javascript controller that reads from the Firebase cloud database,
generates audio elements and inserts them into the page,
and then retrieves the URLs for the .wav files.
*/

var clips = []; // This is global and holds the audio files

function embedAudio(sid) {
	"use strict";

	// Connect to Firebase cloud server DB
	var database = firebase.database();
	// Clear the contents of the global array clips
	clips = [];

	// Get a reference to the Firebase cloud file storage
	var storage = firebase.storage();
	var storageRef = storage.ref('/');

	console.log("embedding audio...");

	// Retrieve contents of 'segments' table in cloud database and write to array
	firebase.database().ref('/segments/').once('value').then(function(snapshot) {
		var dbSegs = Object.values(snapshot.val());

		// Loop through array and check that if the segment corresponds to the session
		for (var i = 0; i < dbSegs.length; i++) {
			if(dbSegs[i].session == sid) {
				var s = dbSegs[i];
				// Generate a URL for the .wav file
				var audioRef = storageRef.child(s.filename);
				audioRef.getDownloadURL().then(function(link) {
					// Generate an audio element and embed URL
					var audio = document.createElement('audio');
					audio.src = link;
					clips.push(audio); // Add to global array
					// console.log("> "+link);
				}).catch(function(error) {
					console.log("couldn't load url");
				});
			}
		};
	}).catch(function(db_error) { // Catches all embedding errors
		console.log("Error embedding audio from DB");
	});

}

