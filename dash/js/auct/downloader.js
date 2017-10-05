/*
Javascript controller that reads a set of sessions from the Firebase
cloud database and dynamically generates UI buttons on the downloads page
which allow the user to download the clips from that session.
*/
(function (){
	"use strict";

	// Get a reference to the Firebase database service
	var database = firebase.database();

	// Local variable instantiation
	var languages = [];
	var sessions = [];

	// Retrieving the UI element into which markup will be inserted
	var seshPanel = document.getElementsByClassName("downloads-holder")[0];
	// Show loader gif
	seshPanel.innerHTML = "<center><img width='30px' height='auto' src='img/loaders/default.gif'></center>";

	// Firebase once-off DB query of sessions table
	firebase.database().ref('/sessions/').once('value').then(function(snapshot) {
		var dbSessions = snapshot.val();

	  for (var i = 0; i < dbSessions.length; i++) {
	  	if(dbSessions[i] != null) {
	  				// Sessions class defined and instantiated below
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

	  // UI updated with dynamically generated UI buttons for downloading sessions
		seshPanel.innerHTML = "";
	  for (var i = 0; i < sessions.length; i++) {
	  	seshPanel.innerHTML += "<button class='btn btn-rounded btn-primary btn-download' onClick='download(\""+sessions[i].name+"\", this)'><i class='fa fa-arrow-down'> "+sessions[i].language+" | "+sessions[i].date+"</i></button><br>";
	  }

	}).catch(function(db_error) { // Catch DB read errors and show retry button
		console.log("Error loading from DB");
		seshPanel.innerHTML = "<center><a onclick='location.reload()'><h3>Retry</h3></a></center>";
	});


}());
