/*
Javascript controller to dynamically generate panel elements
on the landing page corresponding to the sessions logged
in the Firebase Cloud database.
*/
(function (){
	"use strict";


	// Get a reference to the Firebase database service
	var database = firebase.database();
	var sessions = [];

	// Find the correct UI element into which the sessions' markup is generated
	var seshPanel = document.getElementsByClassName("session-holder")[0];

	// Show loader gif
	seshPanel.innerHTML = "<center><img width='30px' height='auto' src='img/loaders/default.gif'></center>";

	console.log("Generating sessions...");

	// Firebase query of 'sessions' table and generation of segment objects
	firebase.database().ref('/sessions/').once('value').then(function(snapshot) {
		var dbSessions = snapshot.val();
	  for (var i = 0; i < dbSessions.length; i++) {
	  	if(dbSessions[i] != null) {
	  				// The session class is created and instantiated with database fields
	  		  	var s = {
	  		  		id : i,
	  		  		date : dbSessions[i].date,
	  		  		filename : dbSessions[i].filename,
	  		  		language : dbSessions[i].language,
	  		  		name : dbSessions[i].name,
	  		  		scrapped : dbSessions[i].scrapped,
	  		  		spliced : dbSessions[i].spliced,
	  		  		verified : dbSessions[i].verified,
	  		  		wordlistref : dbSessions[i].wordlist,
	  		  		markup : ""
	  		  	};

	  		  	// Update the session type based on tags
	  		  	var type = "default";
	  		  	if(s.verified == 1){type = "success"};
	  		  	if(s.scrapped == 1){type = "danger"};

	  		  	// Dynamically modify session markup for each instance
	  		  	s.markup = "<div class='panel panel-"+type+"'><div class='panel-heading'>"
	  									+"<div class='panel-title-box'><h3>"+s.language+" | "+s.date+" | list"+s.wordlistref+"</h3></div></div>"
	  									+"<div class='panel-body'><form class='form-horizontal' role='form'>"
	  									+"<div class='form-group'><div class='col-md-12 segment-holder'>"
	  									+"<button class='btn btn-info btn-block seg-load-button' type='button'"
	  									+"onclick='loadSeg("+s.id+","+s.wordlistref+",this)'>Load Segments</button>"
	  									+"</div></div></form></div></div>";

	  				sessions.push(s); // Push to array
	  	}
	  };

	 	// Update the UI to show panels for each session
	  seshPanel.innerHTML = "";
	  for (var i = 0; i < sessions.length; i++) {
	  	seshPanel.innerHTML += sessions[i].markup;
	  }

	  console.log("Sessions loaded");
	}).catch(function(db_error) { // Catch DB read errors and show retry button
		console.log("Error sessions loading from DB");
		seshPanel.innerHTML = "<center><a onclick='location.reload()'><h3>Retry</h3></a></center>";

	});


}());
