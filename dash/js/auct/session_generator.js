(function (){
	"use strict";


	// Get a reference to the Firebase database service
	var database = firebase.database();
	var sessions = [];
	var seshPanel = document.getElementsByClassName("session-holder")[0];

	console.log("Generating sessions...");

	// Firebase once-off DB query
	firebase.database().ref('/sessions/').once('value').then(function(snapshot) {
		var dbSessions = snapshot.val();

	  for (var i = 0; i < dbSessions.length; i++) {
	  	if(dbSessions[i] != null) {
	  		  	var s = {
	  		  		id : i,
	  		  		date : dbSessions[i].date,
	  		  		filepath : dbSessions[i].filepath,
	  		  		language : dbSessions[i].language,
	  		  		name : dbSessions[i].name,
	  		  		scrapped : dbSessions[i].scrapped,
	  		  		spliced : dbSessions[i].spliced,
	  		  		verified : dbSessions[i].verified,
	  		  		// wordlistref : dbSessions[i]['wordlist-ref'], //TODO update this for the new DB
	  		  		wordlistref : dbSessions[i].wordlist, //TODO update this for the new DB
	  		  		markup : ""
	  		  	};

	  		  	// console.log(i+": "+s);

	  		  	s.markup = "<div class='panel panel-default'><div class='panel-heading'>"
	  									+"<div class='panel-title-box'><h3>"+s.date+" "+s.language+" list"+s.wordlistref+"</h3></div></div>"
	  									+"<div class='panel-body'><form class='form-horizontal' role='form'>"
	  									+"<div class='form-group'><div class='col-md-12 segment-holder'>"
	  									+"<button class='btn btn-info btn-block seg-load-button'"
	  									+"onclick='loadSeg("+s.id+","+s.wordlistref+")'>Load Segments</button>"
	  									+"</div></div></form></div></div>";

	  				sessions.push(s);
	  	}

	  };

	  for (var i = 0; i < sessions.length; i++) {
	  	seshPanel.innerHTML += sessions[i].markup;
	  }

	  console.log("Sessions loaded");


	}).catch(function(db_error) {
		console.log("Error loading from DB");
		// location.reload();
	});


}());
