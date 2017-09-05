(function (){

	// Get a reference to the Firebase database service
	var database = firebase.database();

	var segPanel = document.getElementsByClassName("segment-holder")[0];
	var audioSegs = [];

	var segSelect = function (s) {
		// Prime the menu options
		var labelButton = document.getElementsByClassName("button-label")[s.id];
		var removeButton = document.getElementsByClassName("button-remove")[s.id];

		labelButton.addEventListener("click", function() {
			var newLabel = prompt("Enter new label", s.label);
			if(newLabel != "") {
				s.label = newLabel;
			}
			buttons[s.id].innerText = s.label;
			console.log("Labelled as '"+s.label+"'")
		});

		removeButton.addEventListener("click", function() {
			if (confirm("Remove this segment?") == true) {
			    console.log("Removed segment");
			    // Remove the segment

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

	for (var i = 0; i < 10; i++) {
		// Firebase DB query here
		var s = {
			id : i,
			filepath : "segments/sample_fruit_0000"+i+".wav",
			language : "English",
			label : "",
			markup : ""
		};

		// Some Test shit
		if (s.id == 0) {
			s.label = "avocado";
		}

		var type = "primary";
		var text = "Segment "+s.id.toString();
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



}());
