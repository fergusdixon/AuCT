function download(name, but) {
	"use strict";

	var warningClass = "btn btn-warning btn-rounded btn-download";
	var primaryClass = "btn btn-primary btn-rounded btn-download";
	var successClass = "btn btn-success btn-rounded btn-download";

	but.className = warningClass;

	console.log("Downloading "+name);

	var downloadPaths = [];
	var downloadURLs = [];
	var downloadCues = [];

	var database = firebase.database();
	var storage = firebase.storage();
	var storageRef = storage.ref('/');


	// Firebase once-off DB query
	firebase.database().ref('/sessions/').once('value').then(function(snapshot) {
		var dbSessions = snapshot.val();

		firebase.database().ref('/segments/').once('value').then(function(snapshot) {
			var dbSegs = Object.values(snapshot.val());
			// console.log(dbSegs.length);
			for (var i = 0; i < dbSegs.length; i++) {
				if(dbSessions[dbSegs[i].session].name == name & dbSegs[i].verified == 1) {
					console.log("Downloading : "+dbSegs[i].label);
					var audioRef = storageRef.child(dbSegs[i].filename);
					audioRef.getDownloadURL().then(function(link) {

						var cue = "<label>"+"\t"+link;
						downloadURLs.push(link);
						downloadCues.push(cue);

						but.className = successClass;

						var blob = new Blob(downloadCues, {type: "text/plain;charset=utf-8"});
						saveAs(blob, name+".txt");

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
