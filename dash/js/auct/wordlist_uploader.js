function upload(but) {
	"use strict";

  but.className = "btn btn-warning btn-submit-wordlist";

	var form = document.getElementsByClassName("wordlist-form")[0];
	var lang = form.elements['wl-upload-lang'].value;
	var name = form.elements['wl-upload-name'].value;
	var text = form.elements['wl-upload-text'].value;

	var pos = wlists;

	var newWords = text.split(",");

	// Get a reference to the database service
	var database = firebase.database();

  firebase.database().ref('wordlists/' + pos).set({
    language: lang,
    listnum: pos.toString(),
    name : name,
    words : newWords
  });
  console.log("Wordlist added");
  but.disabled = true;
  but.className = "btn btn-success btn-submit-wordlist";


}
