(function (){

	// Get a reference to the Firebase database service
	var database = firebase.database();

	var segPanel = document.getElementsByClassName("segment-holder")[0];
	var audioSegs = [];

	var playSeg = function (s) {
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
			console.log("yes");
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
							+"role='menu'><li><a href='#'>Label</a></li><li><a href='#'>Remove"
							+"</a></li></ul></div>"

		audioSegs.push(s);

	};

	for (var i = 0; i < audioSegs.length; i++) {
		segPanel.innerHTML += audioSegs[i].markup;
	}

	console.log("Linking audio playback...");

	var buttons = document.getElementsByClassName("dropdown-toggle");

	// TODO Figure out why this won't work in a loop of some kind
	buttons[0].addEventListener("click", function() {playSeg(audioSegs[0])});
	buttons[1].addEventListener("click", function() {playSeg(audioSegs[1])});
	buttons[2].addEventListener("click", function() {playSeg(audioSegs[2])});
	buttons[3].addEventListener("click", function() {playSeg(audioSegs[3])});
	buttons[4].addEventListener("click", function() {playSeg(audioSegs[4])});
	buttons[5].addEventListener("click", function() {playSeg(audioSegs[5])});
	buttons[6].addEventListener("click", function() {playSeg(audioSegs[6])});
	buttons[7].addEventListener("click", function() {playSeg(audioSegs[7])});
	buttons[8].addEventListener("click", function() {playSeg(audioSegs[8])});
	buttons[9].addEventListener("click", function() {playSeg(audioSegs[9])});



}());
