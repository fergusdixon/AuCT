function updateLabel(id, sesh, button) {
	"use strict";

	var warningClass = "btn btn-warning btn-rounded btn-segment";
	var primaryClass = "btn btn-primary btn-rounded btn-segment";
	var successClass = "btn btn-success btn-rounded btn-segment";

	console.log("Update "+sesh+" at "+id+" to "+button.innerText);
	var segButton = document.getElementById("seg-"+id);
	var oldLabel = segButton.innerText;
	var newLabel = button.innerText;

	segButton.innerText = newLabel;
	segButton.className = warningClass;
	button.innerText = oldLabel;

	var database = firebase.database();


	// Firebase once-off DB query
	firebase.database().ref('/segments/').once('value').then(function(snapshot) {
		var dbSegs = snapshot.val();

		for (var i = 0; i < dbSegs.length; i++) {
			var s = dbSegs[i];
			if(s.session == sesh && s.label == oldLabel) {
				firebase.database().ref('segments/'+i).set({
				  filepath: s.filepath,
				  label: newLabel,
				  scrapped : 0,
				  session: sesh,
				  verified: 1
				});
				segButton.className = successClass;
				break;
			}
		};

	}).catch(function(db_error) {
		console.log("Error loading segments from DB");
	});

}
