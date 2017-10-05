/*
Javascript controller to dynamically generate panel elements
on the wordlist page corresponding to the wordlists logged
in the Firebase Cloud database.
*/

var wlists = null; // Global variable for list of wordlists

(function (){
	"use strict";


	// Get a reference to the Firebase database service
	var database = firebase.database();
	var wordlists = [];

	// Find the correct UI element into which the wordlists' markup is generated
	var wlPanel = document.getElementsByClassName("wordlist-panel")[0];

	// Show loader gif
	wlPanel.innerHTML = "<center><img width='30px' height='auto' "
												+"src='img/loaders/default.gif'></center>";

	console.log("Generating wordlists...");

	// Firebase query of 'wordlists' table and generation of segment objects
	firebase.database().ref('/wordlists/').once('value').then(function(snapshot) {
		var dbWordLists = snapshot.val();
		wlists = dbWordLists.length;
		document.getElementsByClassName("btn-submit-wordlist")[0].disabled=false;
	  for (var i = 0; i < dbWordLists.length; i++) {
	  	if(dbWordLists[i] != null) {
	  		var wl = dbWordLists[i];
	  	// Dynamically modify wordlist markup for each instance
	  	var markup = "<div class='panel panel-default'>"
	  						+"<div class='panel-heading'>"
								+"<div class='panel-title-box'>"
								+"<h3>"+wl.language+" | "+wl.name+"</h3></div></div>"
								+"<div class='panel-body'>"
								+"<form class='form-horizontal' role='form'>"
								+"<div class='form-group'>"
								+"<div class='col-md-12 wordlist-holder'>"
								+"<input type='text' class='wl-input' name='input-"+wl.name+"'"
								+"value='"+wl.words+"' </input>"
								+"</div></div></form></div></div>";

			wordlists.push(markup);
	  	}
	  };

	 	// Update the UI to show panels for each wordlist
	  wlPanel.innerHTML = "";
	  for (var i = 0; i < wordlists.length; i++) {
	  	wlPanel.innerHTML += wordlists[i];
	  }

	  console.log("Wordlists loaded");
	}).catch(function(db_error) { // Catch DB read errors and show retry button
		console.log("Error loading wordlists from DB");
		wlPanel.innerHTML =
		"<center><a onclick='location.reload()'><h3>Retry</h3></a></center>";

	});


}());
