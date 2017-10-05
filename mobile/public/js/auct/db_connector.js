// Expose variables globally
var wordlistNo = 0;
var listNo;

// Get the file path of the current window
var url=location.href;
var urlFilename = url.substring(url.lastIndexOf('/')+1, url.indexOf("#"));
//DEBUG: console.log(urlFilename);


// Get reference for firebase database
var database = firebase.database();
console.log("Connected to database");
// Get reference to firebase storage bucket
var storage = firebase.storage();
console.log("Connected to storage bucket");


// Use filepath name to decide which function to start with
if (urlFilename == "wordListSelection.html"){
	getWordLists();
} else {
	populateWordListOnRecordAudio();
}

/**
* Returns all wordlists from the database
* Filters word list to get only for selected language
* Gets data for each individual wordlist node
* Creates a button for each list
* User selects from one of these
*/
function getWordLists() {
	// Goes into 'wordlists' node of database
	var chosenLanguage = window.location.hash.substring(1);
	// DEBUG: console.log("chosenLanguage:" + chosenLanguage);

	// Gets filtered word lists from database
	firebase.database().ref('/wordlists/').orderByChild("language").equalTo(chosenLanguage).once('value').then(function(snapshot) {
		wordlists = snapshot.val();
		var divId = document.getElementById("wordlistRow");

		// Get data for each child
		snapshot.forEach(function(childSnapshot){
			var childKey = childSnapshot.key;
			var childData = childSnapshot.val();
			var childName = childData.name;
			var childLanguage = childData.language;
			wordlistNo++;
		
			// Create a button for the child node
			var listButton = createButtonToSelectionPage(childData);
			divId.appendChild(listButton);
			// DEBUG: console.log("Wordlist button made")

		})
	}).catch(function(db_error) {
			console.log("Error loading wordlists: " + db_error);

		});

}

/**
* Create button for wordlist child node
* Button redirects to recordAudio.html
* Adds chosen wordlist name to url hash
*/
function createButtonToSelectionPage(childData){
	var listButton = document.createElement('button');
	listButton.className = 'btn btn-default btn-md btn-block';
	listButton.innerText = childData.name;
	// DEBUG: console.log("button href: " + listButton.href)

	// Create container for button that is responsive to size changes
	var block = document.createElement('div');
	block.className = ('col-xs-12 col-sm-4 col-md-2');
	block.appendChild(listButton);

	// Sets it so that user is transferred to recordAudio.html page
	// Passes data about the wordlist chosen via the url hash
	listButton.addEventListener("click", function(){
		// DEBUG: console.log("Button clicked. List chosen is: " + childData.name);
		window.location.href = ("recordAudio.html#" + childData.listnum + "#" + childData.language);
		populateWordListOnRecordAudio();
	});
	return block;
}

/**
* Gets the word list chosen by the user in the previous page from the url hash
* Access all words from the chosen wordlist
* Add a list element to the UI
*/
function populateWordListOnRecordAudio(){
	// References to 'wordlists'
	firebase.database().ref('/wordlists/').once('value').then(function(snapshot) {
		var listGroupID = document.getElementById("wordlistgroup");
		var listHeadingID = document.getElementById("listheading");
		
		snapshot.forEach(function(childSnapshot){
			console.log("key: " + childSnapshot.key + ", listNo: " + getHashValueListNo());
			listNo = parseInt(getHashValueListNo() - 1);
			if (childSnapshot.key == listNo) {
				currentChild = childSnapshot;

				// Create list item for each word
				listHeadingID.innerText = childSnapshot.val().name;
				var list = childSnapshot.val().words;
				for (var i = 0; i < list.length; i++) {
					var li = document.createElement("li");
					li.className = "list-group-item";
					li.innerText = list[i];
					listGroupID.appendChild(li);
					//DEBUG: console.log("added item: " + list[i]);
				}
			}

		})
	}).catch(function(db_error) {
		console.log("Error loading wordlists: " + db_error);

	});

}


/**
* Upload given audio file, typically in .wav format, to the firebase storage bucket
*/
function upload(AudioBLOB, filename, datestring, e){
	// Set up label to hold progress
	progressLabel = document.getElementById("progressLabel" + filename);
	progressLabel.innerText = progressLabel.textContent = ' ';    

 	// Create a storage reference from our storage service
    var storageRef = storage.ref();
    var inputRef = storageRef.child('Input/');
    var uploadfilename = filename.concat(".wav");

    // Upload file 
    var uploadTask = storageRef.child('Input/' + uploadfilename).put(AudioBLOB);
    // DEBUG: console.log("File uploaded: Input/" + uploadfilename);

    // Listen for state changes, errors, and completion of the upload.
	uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
	  function(snapshot) {
	    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
	    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
	   	progressLabel.innerText = progressLabel.textContent = 'Upload is ' + Math.round(progress) + '% done';
	   	// DEBUG: console.log("progress: " + progressLabel.innerText);
	    // DEBUG: console.log('Upload is ' + progress + '% done');

	    switch (snapshot.state) {
	      case firebase.storage.TaskState.PAUSED: // or 'paused'
	        console.log('Upload is paused');
	        break;
	      case firebase.storage.TaskState.RUNNING: // or 'running'
	        // console.log('Upload is running');
	        break;
	    }
	  }, function(error) {

	  // Common error codes
	  switch (error.code) {
	    case 'storage/unauthorized':
	      // User doesn't have permission to access the object
	      break;

	    case 'storage/canceled':
	      // User canceled the upload
	      break;

	    case 'storage/unknown':
	      // Unknown error occurred, inspect error.serverResponse
	      break;
	  }
	}, function() {
	  // Upload completed successfully, now we can get the download URL and create a session
	  var downloadURL = uploadTask.snapshot.downloadURL;
	  createSession(datestring, filename);
	});
}

/**
* Add a node to the session subtree to show that an audio file has been added
* This will later be used by the Segmentor to watch for incoming file
* Uses .set() from firebase databases
* Function called when audio file has been submitted successfully
*/
function createSession(date, filepath){
    // Create a session node in database
    // Data respondes to data in the firebase database
    database.ref('sessions').once('value', function(snapshot) {
	   	// Gets the numder of nodes in the subtree and adds 1 to it to use as an identifyer
	  	database.ref('sessions/' + (snapshot.numChildren())).set({
	    date : date,
	    filepath : "Input/".concat(filepath).concat(".wav"),
	    language : getHashValueLanguage(),
	    name : filepath,
	    scrapped : 0,
	    spliced : 0,
	    verified : 0,
	    wordlist : getHashValueKey()
	  });
	  /** DEBUG:
	  * console.log("date:" + date);
	  * console.log("filepath: " + filepath + ".wav");
	  * console.log("language: " + getHashValueLanguage());
	  * console.log("name: " + filepath);
	  * console.log("wordlist: " + getHashValueKey);
	  * console.log("Session node pushed to database");
	  */
  });
}

// Edit date format to suit the database pathname
// Format YYYYmmDDhhMMss
function getDateFormatForFile(date){        
    now = date;
    var yyyy = now.getFullYear();
    var mm = now.getMonth() < 9 ? "0" + (now.getMonth() + 1) : (now.getMonth() + 1);
    var dd  = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
    var hh = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
    var min = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
    var ss = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();
    tempDate = now;
    return "".concat(yyyy).concat(mm).concat(dd).concat(hh).concat(min).concat(ss);
}
// Edit date format to suit 'date' label in database
// Format: yyyy-MM-dd_HH:mm:ss
function getDateFormatForLabel(date){
	now = date;
	var yyyy = now.getFullYear();
    var mm = now.getMonth() < 9 ? "0" + (now.getMonth() + 1) : (now.getMonth() + 1);
    var dd  = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
    var hh = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
    var min = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
    var ss = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();
    tempDate = now;
    return "".concat(yyyy).concat("-"+mm).concat("-"+dd).concat("_"+hh).concat(":"+min).concat(":"+ss);
}
// Create the full file name
// Format: "auct_list00_YYYYmmDDhhMMss.wav"
function getNameFormat(date){
	var listNo = getHashValueListNo();
	tempFilepath = "auct_list".concat(getHashValueListNo()).concat("_").concat(date);
	return tempFilepath;
}

// Get values needed for searching and uploading from url hash

function getHashValueListNo(){
	var ahash = window.location.hash.substring(1);
	var values = ahash.split("#");
	//DEBUG: console.log("ListNo: " + values[0] - 1);
	return values[0];
}
function getHashValueKey(){
	var ahash = window.location.hash.substring(1);
	var values = ahash.split("#");
	// DEBUG: console.log("Key: " + values[0] - 1);
	return values[0] - 1;
}
function getHashValueLanguage(){
	var ahash = window.location.hash.substring(1);
	var values = ahash.split("#");
	// DEBUG: console.log("Language: " + values[1]);
	return values[1];
}
