var clips = []; // This is global

function embedAudio(sid) {
	"use strict";

	var database = firebase.database();

	// Get a reference to the storage service, which is used to create references in your storage bucket
	var storage = firebase.storage();
	var storageRef = storage.ref('/');

	// var clips = [];

	console.log("embedding audio...");

	// Firebase once-off DB query
	firebase.database().ref('/segments/').once('value').then(function(snapshot) {
		var dbSegs = snapshot.val();

		for (var i = 0; i < 3; i++) { //for (var i = 0; i < dbSegs.length; i++) {

			if(dbSegs[i].session == sid) {

				var s = dbSegs[i];

				var audioRef = storageRef.child(s.filepath);
				audioRef.getDownloadURL().then(function(link) {
					var audio = document.createElement('audio');
					audio.src = link;
					clips.push(audio);
					console.log("> "+link);
				}).catch(function(error) {
					console.log("couldn't load url");
				});

			}

		};

	}).catch(function(db_error) {
		console.log("Error loading segments from DB");
	});

}

