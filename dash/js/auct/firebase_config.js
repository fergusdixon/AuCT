/*
Script to configure Firebase remote access across application
*/

(function (){
	"use strict";
	var config = {
	  apiKey: "AIzaSyD6S977TAzMc809mhI-rO_J_EK_vAmTYhA",
	  authDomain: "auct-capstone.firebaseapp.com",
	  databaseURL: "https://auct-capstone.firebaseio.com",
	  projectId: "auct-capstone",
	  storageBucket: "auct-capstone.appspot.com",
	  messagingSenderId: "166934669737"
	};
	firebase.initializeApp(config);
}());
