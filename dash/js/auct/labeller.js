/*
Javascript function that, when called by an event listener, will
updated the Firebase cloud database to reflect changes made by the
user in the UI, with appropriate aesthetic responses (e.g. colour)
generated through the DOM.
*/

function updateLabel(id, sesh, button) {
	"use strict";

	// Define appearance variables for UI elements
	var warningClass = "btn btn-warning btn-rounded btn-segment";
	var primaryClass = "btn btn-primary btn-rounded btn-segment";
	var successClass = "btn btn-success btn-rounded btn-segment";
	var dangerClass = "btn btn-danger btn-rounded btn-segment";

	// Differentiate between changing a label and scrapping it
	var mode = 1; // 1 = update label, 0 = scrap label;
	if(button == null){mode = 0;}

	// Retrieve the appropriate strings from the UI elements
	var segButton = document.getElementById("sesh-"+sesh+"-seg-"+id);
	var oldLabel = segButton.innerText;
	if(mode == 1){ // Updating a label causes the labels to switch on UI
		var newLabel = button.innerText;
		segButton.innerText = newLabel;
		button.innerText = oldLabel;
		console.log("Update "+sesh+" at "+id+" to "+newLabel);
	} else {
		console.log("Scrap "+oldLabel);
	}

	// Button changes to orange to show that it is processing
	segButton.className = warningClass;

	/* Retrieving all the data from segments and,
	finding the correct segment and updating fields */
	var database = firebase.database();
	firebase.database().ref('/segments/').once('value').then(function(snapshot) {
		var dbSegs = Object.values(snapshot.val());

		for (var i = 0; i < dbSegs.length; i++) {
			var s = dbSegs[i];
			if(s.session == sesh && s.label == oldLabel) { // If it's segment we want
				if(mode == 1) { // If in update mode
					firebase.database().ref('/segments/'+i).set({
					  filename: s.filename,
					  label: newLabel,
					  scrapped : 0,
					  session: sesh,
					  verified: 1
					});
					segButton.className = successClass;
				} else { // If in scrap mode
					firebase.database().ref('/segments/'+i).set({
					  filename: s.filename,
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

	}).catch(function(db_error) { // Catches any errors in labelling / scrapping
		console.log("Error labelling");
	});

}

