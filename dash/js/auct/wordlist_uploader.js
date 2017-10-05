/*
Javascript function to submit new wordlist (and associated data)
to Firebase cloud DB wordlist table and provide UI confirmation.
*/

function upload(but) {
	"use strict";

	// Set the submit button to orange to show working state
  but.className = "btn btn-warning btn-submit-wordlist";

  // Get form, its elements and values from UI
	var form = document.getElementsByClassName("wordlist-form")[0];
	var lang = form.elements['wl-upload-lang'].value;
	var name = form.elements['wl-upload-name'].value;
	var text = form.elements['wl-upload-text'].value;

	// Set position of new wordlist in DB = current size of wordlist table
	var pos = wlists;
	// Splice new wordlist on commas into array
	var newWords = text.split(",");
	// Get a reference to the database service
	var database = firebase.database();

	// Write to the wordlists table in Firebase DB
  firebase.database().ref('wordlists/' + pos).set({
    language: lang,
    listnum: pos.toString(),
    name : name,
    words : newWords
  });
  console.log("Wordlist added");
  // Disable the submit button and set colour to green
  but.disabled = true;
  but.className = "btn btn-success btn-submit-wordlist";


}
