(function (){
	"use strict";

	// Get a reference to the Firebase database service
	var database = firebase.database();
	var languages = [];
	var sessions = [];
	var seshPanel = document.getElementsByClassName("downloads-holder")[0];
	seshPanel.innerHTML = "<center><img width='30px' height='auto' src='img/loaders/default.gif'></center>";

	// Firebase once-off DB query
	firebase.database().ref('/sessions/').once('value').then(function(snapshot) {
		var dbSessions = snapshot.val();

	  for (var i = 0; i < dbSessions.length; i++) {
	  	if(dbSessions[i] != null) {
	  		  	var s = {
	  		  		id : i,
	  		  		date : dbSessions[i].date,
	  		  		filename : dbSessions[i].filename,
	  		  		language : dbSessions[i].language,
	  		  		name : dbSessions[i].name,
	  		  		scrapped : dbSessions[i].scrapped,
	  		  		spliced : dbSessions[i].spliced,
	  		  		verified : dbSessions[i].verified,
	  		  		wordlistref : dbSessions[i].wordlist
	  		  	};

	  				sessions.push(s);
	  	}
	  };

		seshPanel.innerHTML = "";
	  for (var i = 0; i < sessions.length; i++) {
	  	seshPanel.innerHTML += "<button class='btn btn-rounded btn-primary btn-download' onClick='download(\""+sessions[i].name+"\", this)'><i class='fa fa-arrow-down'> "+sessions[i].language+" | "+sessions[i].date+"</i></button><br>";
	  }


	}).catch(function(db_error) {
		console.log("Error loading from DB");
		// location.reload();
	});


}());
