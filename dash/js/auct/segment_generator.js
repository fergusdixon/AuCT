(function (){

	// Get a reference to the Firebase database service
	var database = firebase.database();

	var segPanel = document.getElementsByClassName("segment-holder")[0];
	var audioSegs = [];

	var writeLabel = function (s, newLabel) {
		if(newLabel != "") {
			firebase.database().ref('samples/'+s.id).set({
				id: s.id,
				filepath: s.filepath,
				language: s.language,
				label: newLabel
			});
			console.log("Updat sent to DB");
		}
	}

	var segSelect = function (s) {
		// Prime the menu options
		var labelButton = document.getElementsByClassName("button-label")[s.id];
		var removeButton = document.getElementsByClassName("button-remove")[s.id];

		labelButton.addEventListener("click", function() {
			var newLabel = prompt("Enter new label", s.label);
			if(newLabel != "") {
				s.label = newLabel;
			}
			var buttons = document.getElementsByClassName("dropdown-toggle");
			buttons[s.id].innerText = s.label;

			// Update the database
			writeLabel(s, newLabel);

			console.log("Labelled as '"+s.label+"'")
		});

		removeButton.addEventListener("click", function() {
			if (confirm("Remove this segment?") == true) {
			    console.log("Removed segment");

			    // Remove the segment from database

			    // Refresh the page

			} else {
			    console.log("Segment not removed");
			}
		});

		// Play the sound
		console.log("Playing "+s.id);
		var audio = document.createElement('audio');
		audio.src = s.filepath;
		audio.play();
	}

	console.log("Generating segments...");

	// Firebase once-off DB query
	firebase.database().ref('/samples/').once('value').then(function(snapshot) {
		var dbSegs = snapshot.val();

	  for (var i = 0; i < dbSegs.length; i++) {
	  	var s = {
	  		id : dbSegs[i].id,
	  		filepath : dbSegs[i].filepath,
	  		language : dbSegs[i].language,
	  		label : dbSegs[i].label,
	  		markup : ""
	  	};

	  	var type = "primary";
	  	var text = "Segment "+s.id;
	  	if(s.label != "") {
	  		text = s.label;
	  		type = "success";
	  	}


	  	s.markup = " <div class='btn-group audio-seg'>"
	  						+"<a href='#' data-toggle='dropdown' class='btn btn-"+type+" btn-lg dropdown-toggle'>"
	  						+text+" <span class='caret'></span></a>"
	  						+"<audio id='audio' src='"+s.filepath+"'"
	  						+"style='visibility: hidden; width: 0px; height: 0px;'"
	  						+"controls preload='auto' autobuffer></audio><ul class='dropdown-menu'"
	  						+"role='menu'><li><a href='#' class='button-label'>Label</a></li><li><a href='#'"
	  						+"class='button-remove'>Remove</a></li></ul></div>"

	  	audioSegs.push(s);
	  	// console.log("Added "+s.label);

	  };

	  for (var i = 0; i < audioSegs.length; i++) {
	  	segPanel.innerHTML += audioSegs[i].markup;
	  }

	  console.log("Linking audio playback...");

	  var buttons = document.getElementsByClassName("dropdown-toggle");

	  // TODO Figure out why this won't work in a loop of some kind
	  buttons[0].addEventListener("click", function() {segSelect(audioSegs[0])});
	  buttons[1].addEventListener("click", function() {segSelect(audioSegs[1])});
	  buttons[2].addEventListener("click", function() {segSelect(audioSegs[2])});
	  buttons[3].addEventListener("click", function() {segSelect(audioSegs[3])});
	  buttons[4].addEventListener("click", function() {segSelect(audioSegs[4])});
	  buttons[5].addEventListener("click", function() {segSelect(audioSegs[5])});
	  buttons[6].addEventListener("click", function() {segSelect(audioSegs[6])});
	  buttons[7].addEventListener("click", function() {segSelect(audioSegs[7])});
	  buttons[8].addEventListener("click", function() {segSelect(audioSegs[8])});
	  buttons[9].addEventListener("click", function() {segSelect(audioSegs[9])});

	  console.log("Ready.");


	}).catch(function(db_error) {
		console.log("Error loading from DB");
		location.reload();
	});


}());
