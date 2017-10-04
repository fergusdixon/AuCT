// Expose variables globally

var wordlistNo = 0;
var chosenList = null;
var pagehash = null;
var listNo;

// Get the file path of the current window
var url=location.href;
var urlFilename = url.substring(url.lastIndexOf('/')+1);
// DEBUG: console.log(urlFilename);


// Get reference for firebase database
var database = firebase.database();
console.log("Connected to database");
// Get reference to firebase storage bucket
var storage = firebase.storage();
console.log("Connected to storage bucket");


// Use filepath name to decide which functions to start with
if (urlFilename == "wordListSelection.html"){
	getWordLists();
} else {
	pagehash = window.location.hash;
	// DEBUG: console.log("hash: " + pagehash);
	populateWordListOnRecordAudio();
}

/**
* Returns all wordlists from the database
* Gets data for each individual node
* Creates a button for each list
* User selects from one of these
*/
function getWordLists() {
	// Goes into 'wordlists' node of database
	firebase.database().ref('/wordlists/').once('value').then(function(snapshot) {
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
			console.log("Wordlist button made")

		})
		console.log(wordlistNo);
	}).catch(function(db_error) {
			console.log("Error loading wordlists: " + db_error);

		});

}

/**
* Create button for child node
*/
function createButtonToSelectionPage(childData){
	var listButton = document.createElement('button');
	listButton.className = 'btn btn-default';
	listButton.innerText = childData.name;
	// DEBUG: console.log("button href: " + listButton.href)

	// Sets it so that user is transferred to recordAudio.html page
	// Passes data about the wordlist chosen via the url hash
	listButton.addEventListener("click", function(){
		chosenList = childData;
		console.log("Button clicked. List chosen is: " + childData.name);
		window.location.href = ("recordAudio.html#" + childData.listnum + "#" + childData.language);
		populateWordListOnRecordAudio();
	});
	return listButton;
}

/**
* Gets the word list chosen by the user in the previous page
* Access all words from the wordlist
* Add a list element to the UI
*/
function populateWordListOnRecordAudio(){
	// References to 'wordlists'
	firebase.database().ref('/wordlists/').once('value').then(function(snapshot) {
		console.log("Accessed database");
		var listGroupID = document.getElementById("wordlistgroup");
		var listHeadingID = document.getElementById("listheading");
		
		// For testing purposes:
		if (pagehash == null) {
			listNo = parseInt(0);
		} else {
			listNo = parseInt(pagehash.substring(1)) - 1;
		}
		
		snapshot.forEach(function(childSnapshot){
			// DEBUG: console.log("key: " + childSnapshot.key + ", listNo: " + listNo);
			if (childSnapshot.key == listNo){
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
* Uploaded given audio file, typically in .wav format, to the firebase storgae bucket
*/
function upload(AudioBLOB){
 	// Create a storage reference from our storage service
    var storageRef = storage.ref();
    var inputRef = storageRef.child('Input/');
    var uploadTask = storageRef.child('Input/' + tempFilepath).put(AudioBLOB);
    console.log("File uploaded: Input/" + tempFilepath + ".wav");
    alert("File submitted");

}

/**
* Add a node to the session subtree to show that an audio file has been added
* This will later be used by the Segmentor to watch for incoming file
* Uses .set() from firebase databases
* Function called by the  main audio recorder when submitting an audio file
*/
function createSession(date, filepath){
    // Create a session node in database
    // Data respondes to data in the firebase database
    database.ref('sessions').once('value', function(snapshot) {
	    //database.ref('sessions').once('value', function(snapshot) { console.log('Count: ' + snapshot.numChildren()); });
	   	// Gets the numder of nodes in the subtree and adds 1 to it to use as an identifyer
	  	database.ref('sessions/' + (snapshot.numChildren() + 1)).set({
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
    var mm = now.getMonth() < 9 ? "0" + (now.getMonth() + 1) : (now.getMonth() + 1); // getMonth() is zero-based
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
    var mm = now.getMonth() < 9 ? "0" + (now.getMonth() + 1) : (now.getMonth() + 1); // getMonth() is zero-based
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
	console.log("ListNo: " + values[0] - 1);
	return values[0];
}
function getHashValueKey(){
	var ahash = window.location.hash.substring(1);
	var values = ahash.split("#");
	console.log("Key: " + values[0] - 1);
	return values[0] - 1;
}
function getHashValueLanguage(){
	var ahash = window.location.hash.substring(1);
	var values = ahash.split("#");
	console.log("Language: " + values[1]);
	return values[1];
}