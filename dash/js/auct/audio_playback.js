(function (){

	var play = function (s) {
		document.getElementById("audio").play();
	}

	console.log("Linking audio playback...");
	var audio_segments = document.getElementsByClassName("audio-seg");
	var myseg = audio_segments[0];

	myseg.onclick = function(myseg) {
		play(myseg);
	};


}());


