function loadSeg(sid, wlref) {
	console.log("loading session "+sid+"...");

	// Get a reference to the Firebase database service
	var database = firebase.database();
	// Get a reference to the storage service, which is used to create references in your storage bucket
	var storage = firebase.storage();
	var storageRef = storage.ref('/');

	var segPanel = document.getElementsByClassName("segment-holder")[sid];
	var audioSegs = [];

	console.log("Generating segments...");

	segPanel.innerHTML = "<h3>loading...</h3>";

	// Firebase once-off DB query
	firebase.database().ref('/wordlists/').once('value').then(function(snapshot) {
		var wordlist = snapshot.val()[wlref];
		console.log("Wordlist "+wordlist.name+" loaded");

		// Firebase once-off DB query
		firebase.database().ref('/segments/').once('value').then(function(snapshot) {
			var dbSegs = snapshot.val();

			for (var i = 0; i < 3; i++) { //for (var i = 0; i < dbSegs.length; i++) {

				if(dbSegs[i].session == sid) {

					var s = {
						id : dbSegs[i].id,
						filepath : dbSegs[i].filepath,
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
					if(len > 0) {
						if(i>0) {suggestions += "<button class='btn btn-default active'>"+wordlist.words[i-1]+"</button>";}
						if(i<len-1) {suggestions += "<button class='btn btn-default active'>"+wordlist.words[i+1]+"</button>";}
						if(i>1) {suggestions += "<button class='btn btn-default active'>"+wordlist.words[i-2]+"</button>";}
						if(i<len-2) {suggestions += "<button class='btn btn-default active'>"+wordlist.words[i+2]+"</button>";}
					}

					s.markup = "<button class='btn btn-"+type+" btn-rounded btn-segment'>"+s.label+"</button>"
										+suggestions+"<br>";

					audioSegs.push(s);

				}

			};

			segPanel.innerHTML = "";

			for (var i = 0; i < audioSegs.length; i++) {

				segPanel.innerHTML += audioSegs[i].markup;
			}

			console.log("Linking audio playback...");

			for (var i = audioSegs.length - 1; i >= 0; i--) {
				var s = audioSegs[i];
				// Create a reference to the file we want to download
				var audioRef = storageRef.child(s.filepath);
				// Get the download URL
				audioRef.getDownloadURL().then(function(url) {
					s.url = url;
					// console.log("loaded url: "+url);

				}).catch(function(error) {
					console.log("couldn't load url");
				});
			}

			// TODO make audio play on mouseover
			var roundButtons = document.getElementsByClassName('btn-segment');

			for (var i = roundButtons.length - 1; i >= 0; i--) {
				roundButtons[i].addEventListener("mouseover", function() {
					var audio = document.createElement('audio');
					audio.src = audioSegs[0].url;
					audio.play();
				});

			}

			console.log("Loaded session "+sid);


		}).catch(function(db_error) {
			console.log("Error loading segments from DB");
			// location.reload();
		});


	}).catch(function(db_error) {
		console.log("Error loading wordlist from DB");
		// location.reload();
	});

}
