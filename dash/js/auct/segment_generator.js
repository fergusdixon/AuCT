function loadSeg(sid, wlref, but) {
	"use strict";

	console.log("loading session "+sid+"...");

	// Get a reference to the Firebase database service
	var database = firebase.database();


	var segPanel = but.parentElement;
	var audioSegs = [];

	console.log("Generating segments...");

	segPanel.innerHTML = "<center><img width='30px' height='auto' src='img/loaders/default.gif'></center>";
	embedAudio(sid);

	// Firebase once-off DB query
	firebase.database().ref('/wordlists/').once('value').then(function(snapshot) {
		var wordlist = snapshot.val()[wlref];
		console.log("Wordlist "+wordlist.name+" loaded");

		// Firebase once-off DB query
		firebase.database().ref('/segments/').once('value').then(function(snapshot) {
			var dbSegs = Object.values(snapshot.val());

			for (var i = 0; i < dbSegs.length; i++) {
				// console.log(dbSegs[i].session+" vs "+sid);
				if(dbSegs[i].session == sid) {

					var s = {
						position : i,
						filename : dbSegs[i].filename,
						url : "",
						label : dbSegs[i].label,
						scrapped : dbSegs[i].scrapped,
						session : dbSegs[i].session,
						verified : dbSegs[i].verified,
						markup : ""
					};

					var type = "primary";
					var suggestions = "";
					var len = wordlist.words.length;
					if(s.verified == 1) {
						type = "success";
					}
					if(s.scrapped == 1) {
						type = "danger";
					}
					var classString = "class = 'btn btn-default active' type='button'";
					var clickString = "onClick='updateLabel("+s.position+","+s.session+",";
					var scrapButton = "<button type='button' class='btn btn-scrap' onClick='updateLabel("+s.position+","+s.session+",null)'>X</button>";
					if(len > 0) {
						if(i>0) {suggestions += "<button "+classString+clickString+"this)'>"+wordlist.words[i-1]+"</button>";}
						if(i<len-1) {suggestions += "<button "+classString+clickString+"this)'>"+wordlist.words[i+1]+"</button>";}
						if(i>1) {suggestions += "<button "+classString+clickString+"this)'>"+wordlist.words[i-2]+"</button>";}
						if(i<len-2) {suggestions += "<button "+classString+clickString+"this)'>"+wordlist.words[i+2]+"</button>";}
					}


					s.markup = "<button type='button' class='btn btn-"+type+" btn-rounded btn-segment' id='sesh-"+sid+"-seg-"+s.position
										+"'"+clickString+"this)' onmouseover='clips["+s.position+"].play()'>"+s.label+"</button>"
										+suggestions+scrapButton+"<br>";

					audioSegs.push(s);

				}

			};


			segPanel.innerHTML = "";
			for (var i = 0; i < audioSegs.length; i++) {
				segPanel.innerHTML += audioSegs[i].markup;
			}


			console.log("Loaded session "+sid);


		}).catch(function(db_error) {
			console.log("Error loading segments from DB");
			segPanel.innerHTML = "<center><a onclick='location.reload()'><h3>Retry</h3></a></center>";
			// location.reload();
		});


	}).catch(function(db_error) {
		console.log("Error loading wordlist from DB");
		// location.reload();
	});

}
