/*
Javascript function to dynamically generate UI elements
(like buttons and labels) based on the segments stored in the Firebase
cloud database, for the corresponding session that triggered
it via an event listener.
*/
function loadSeg(sid, wlref, but) {
	"use strict";

	console.log("loading session "+sid+"...");

	// Uncomment below code to restrict concurrent session editing
	/*
	var otherSessions = document.getElementsByClassName("segment-holder");
	for (var i = 0; i < otherSessions.length; i++) {
		if(otherSessions[i] != but.parentElement){
			otherSessions[i].innerHTML = "";
		}
	}
	*/

	// Get a reference to the Firebase database service
	var database = firebase.database();

	// Generate local variables based on parameters
	var segPanel = but.parentElement;
	var audioSegs = [];

	console.log("Generating segments...");

	// Show loader gif
	segPanel.innerHTML = "<center><img width='30px' height='auto' "
											+"src='img/loaders/default.gif'></center>";
	embedAudio(sid); // Calls function to embed audio files into UI for preview

	// Firebase once-off DB query of wordlist table
	firebase.database().ref('/wordlists/').once('value').then(function(snapshot) {
		var wordlist = snapshot.val()[wlref];
		console.log("Wordlist "+wordlist.name+" loaded");

		// Firebase once-off DB query of segments table
		firebase.database().ref('/segments/').once('value').then(function(snapshot) {
			var dbSegs = Object.values(snapshot.val());
			var pos = -1; // position of segment in current session
			for (var i = 0; i < dbSegs.length; i++) {
				if(dbSegs[i].session == sid) {
					pos++;
					// Segments class defined and instantiated below
					var s = {
						position : pos,
						filename : dbSegs[i].filename,
						url : "",
						label : dbSegs[i].label,
						scrapped : dbSegs[i].scrapped,
						session : dbSegs[i].session,
						verified : dbSegs[i].verified,
						markup : ""
					};

					// Segment type determined based on tags
					var type = "primary";
					var suggestions = "";
					var len = wordlist.words.length;
					if(s.verified == 1) {type = "success";}
					if(s.scrapped == 1) {type = "danger";}

					// Markup variables
					var classString = "class = 'btn btn-default active' type='button'";
					var clickString = "onClick='updateLabel("+s.position+","+s.session+",";
					var scrapButton = "<button type='button' class='btn btn-scrap' "
					+"onClick='updateLabel("+s.position+","+s.session+",null)'>X</button>";

					/* Markup dynamically generated for suggestion words
					according to place in wordlist */
					if(len > 0) {
						if(s.position>0) {suggestions += "<button "+classString+clickString
							+"this)'>"+wordlist.words[s.position-1]+"</button>";}
						if(s.position<len-1) {suggestions += "<button "+classString
							+clickString+"this)'>"+wordlist.words[s.position+1]+"</button>";}
						if(s.position>1) {suggestions += "<button "+classString
							+clickString+"this)'>"+wordlist.words[s.position-2]+"</button>";}
						if(s.position<len-2) {suggestions += "<button "+classString
							+clickString+"this)'>"+wordlist.words[s.position+2]+"</button>";}
					}

					/* Dynamic markup configuration for segment and
					suggestion buttons on the UI */
					s.markup = "<button type='button' class='btn btn-"+type
										+" btn-rounded btn-segment' id='sesh-"+sid+"-seg-"
										+s.position+"'"+clickString+"this)' onmouseover='clips["
										+s.position+"].play()'>"+s.label+"</button>"
										+suggestions+scrapButton+"<br>";

					audioSegs.push(s); // Segment objects pushed to array
				}

			};

			// Markup of UI session container updated with segment markup
			segPanel.innerHTML = "";
			for (var i = 0; i < audioSegs.length; i++) {
				segPanel.innerHTML += audioSegs[i].markup;
			}
			console.log("Loaded session "+sid);

		}).catch(function(db_error) { // catches DB error and shows retry button
			console.log("Error loading segments from DB");
			segPanel.innerHTML =
			"<center><a onclick='location.reload()'><h3>Retry</h3></a></center>";
		});

	}).catch(function(db_error) { // catches DB error and triggers reload
		console.log("Error loading wordlist from DB");
		location.reload();
	});

}
