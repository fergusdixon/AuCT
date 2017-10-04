function updateLabel(id, sesh, button) {
	"use strict";
	var warningClass = "btn btn-warning btn-rounded btn-segment";
	var primaryClass = "btn btn-primary btn-rounded btn-segment";
	var successClass = "btn btn-success btn-rounded btn-segment";
	var dangerClass = "btn btn-danger btn-rounded btn-segment";
	var mode = 1; // 1 = update label, 0 = scrap label;

	if(button == null){mode = 0;}

	var segButton = document.getElementById("seg-"+id);
	var oldLabel = segButton.innerText;

	if(mode == 1){
		var newLabel = button.innerText;
		segButton.innerText = newLabel;
		button.innerText = oldLabel;

		console.log("Update "+sesh+" at "+id+" to "+newLabel);
	} else {
		console.log("Scrap "+oldLabel);
	}

	segButton.className = warningClass;

	var database = firebase.database();

	// Firebase once-off DB query
	firebase.database().ref('/segments/').once('value').then(function(snapshot) {
		var dbSegs = snapshot.val();

		for (var i = 0; i < dbSegs.length; i++) {
			var s = dbSegs[i];
			if(s.session == sesh && s.label == oldLabel) {
				if(mode == 1) { // If in update mode
					firebase.database().ref('segments/'+i).set({
					  filepath: s.filepath,
					  label: newLabel,
					  scrapped : 0,
					  session: sesh,
					  verified: 1
					});
					segButton.className = successClass;
				} else { // If in scrap mode
					firebase.database().ref('segments/'+i).set({
					  filepath: s.filepath,
					  label: oldLabel,
					  scrapped : 1,
					  session: sesh,
					  verified: 0
					});
					segButton.className = dangerClass;
				}
				break;
			}
		};

	}).catch(function(db_error) {
		console.log("Error loading segments from DB");
	});

}

