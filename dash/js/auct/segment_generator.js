(function (){

	var segPanel = document.getElementsByClassName("segment-holder")[0];
	var audioSegs = [];

	var play = function (s) {
		document.getElementById("audio").play();
	}

	console.log("Generating segments...");

	for (var i = 0; i < 10; i++) {

		var s = {
			id : i,
			filepath : "segments/sample_fruit_0000"+i+".wav",
		};

		segPanel.innerHTML += " <div class='btn-group audio-seg'>"
													+"<a href='#' data-toggle='dropdown' class='btn btn-primary btn-lg dropdown-toggle'>"
													+"SEGMENT 1 <span class='caret'></span></a>"
													+"<audio id='audio' src='"+s.filepath+"'"
													+"style='visibility: hidden; width: 0px; height: 0px;'"
													+"controls preload='auto' autobuffer></audio><ul class='dropdown-menu'"
													+"role='menu'><li><a href='#'>Label</a></li><li><a href='#'>Remove"
													+"</a></li></ul></div>"

		audioSegs.push(s);

	};

	console.log("Linking audio playback...");

	var audio_segments = document.getElementsByClassName("audio-seg");
	var myseg = audio_segments[0];

	myseg.onclick = function(myseg) {
		play(myseg);
	};

}());
