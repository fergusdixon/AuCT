(function (){

	var play = function (s) {
		s.play();
	}

	console.log("Linking audio playback...");
	var audio_segments = document.getElementsByName("audio");
	var myseg = audio_segments[0];

	play(myseg);

}());


