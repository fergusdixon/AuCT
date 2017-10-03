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




	// firebase.database().ref('segments/'+s.id).set({
	//   filepath: s.filepath,
	//   label: newLabel,
	//   scrapped : 0,
	//   session: x,
	//   verified: 1
	// });

 segButton.className = successClass;


}
