(function(){

	// Declare and Zero the graphic elements
	var barLab = document.getElementsByClassName("progress-bar-primary")[0];
	var barMap = document.getElementsByClassName("progress-bar-primary")[1];
	var barFail = document.getElementsByClassName("progress-bar-danger")[0];
	var numLab = document.getElementsByClassName("labelled-perc")[0];
	var numMap = document.getElementsByClassName("words-num")[0];
	var numFail = document.getElementsByClassName("failed-num")[0];
	numLab.innerText = "0%";
	barLab.style.width = "0%";
	numMap.innerText = "0/0";
	barMap.style.width = "0%";
	numFail.innerText = "0%";
	barFail.style.width = "0%";

	var database = firebase.database();
	var samples = []

	console.log("Retrieving Stats...");

	firebase.database().ref('/samples/').once('value').then(function(snapshot) {
		samples = snapshot.val();

		var labelled = 0;
		var total = samples.length;
		var failures = 1;

		for (var i = samples.length - 1; i >= 0; i--) {
			if(samples[i].label != "") {
				labelled++;
			}
		}

		// Update dashboard
		numLab.innerText = ((labelled*100)/total).toString()+"%";
		barLab.style.width = numLab.innerText;
		numMap.innerText = labelled+"/10";
		barMap.style.width = ((labelled*100)/10).toString()+"%";;
		numFail.innerText = (failures*100/10).toString()+"%";
		barFail.style.width = numFail.innerText;

		console.log("Stats loaded");

	}).catch(function(db_error) {
		console.log("Error loading stats");

	});

}());
