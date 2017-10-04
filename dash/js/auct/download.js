function download(name, but) {
	"use strict";

	var warningClass = "btn btn-warning btn-rounded btn-download";
	var primaryClass = "btn btn-primary btn-rounded btn-download";
	var successClass = "btn btn-success btn-rounded btn-download";

	but.className = warningClass;

	console.log("Downloading "+name);

	var downloadPaths = [];
	var downloadURLs = [];

	var database = firebase.database();
	var storage = firebase.storage();
	var storageRef = storage.ref('/');

	// Firebase once-off DB query
	firebase.database().ref('/sessions/').once('value').then(function(snapshot) {
		var dbSessions = snapshot.val();

		firebase.database().ref('/segments/').once('value').then(function(snapshot) {
			var dbSegs = snapshot.val();
			for (var i = 0; i < dbSegs.length; i++) {
				if(dbSessions[dbSegs[i].session].name == name & dbSegs[i].verified == 1) {
					console.log("Downloading : "+dbSegs[i].label);

					var audioRef = storageRef.child(dbSegs[i].filepath);
					audioRef.getDownloadURL().then(function(link) {
						downloadURLs.push(link);
						but.className = successClass;

						// window.open(link);

						console.log("> "+link);
					}).catch(function(error) {
						console.log("couldn't load url");
					});

				}
			}

			but.className = primaryClass;
		}).catch(function(db_error) {
			console.log("Error loading from DB segments");
		});
	}).catch(function(db_error) {
		console.log("Error loading from DB sessions");
	});


}
