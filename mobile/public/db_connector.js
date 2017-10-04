// Get the file path of the current window
var url=location.href;
var urlFilename = url.substring(url.lastIndexOf('/')+1);
// DEBUG: console.log(urlFilename);

// Initialise needed variablses

var wordlistNo = 0;
var chosenList = null;
var pagehash = null;
// Get reference for firebase database
var database = firebase.database();
console.log("Connected to database");
// Get reference to firebase storage bucket
var storage = firebase.storage();
console.log("Connected to storage bucket");

var listNo;

// Run functions according to needed
if (urlFilename == "wordListSelection.html"){
	getWordLists();
} else {
	pagehash = window.location.hash;
	// DEBUG: console.log("hash: " + pagehash);
	populateWordListOnRecordAudio();
}


function getWordLists() {
firebase.database().ref('/wordlists/').once('value').then(function(snapshot) {
	wordlists = snapshot.val();
	var divId = document.getElementById("wordlistRow");

	snapshot.forEach(function(childSnapshot){
		var childKey = childSnapshot.key;
		var childData = childSnapshot.val();
		var childName = childData.name;
		var childLanguage = childData.language;
		wordlistNo++;
	
	var listButton = createButtonToSelectionPage(childData);
		divId.appendChild(listButton);
		console.log("Wordlist button made")


	})
	console.log(wordlistNo);
}).catch(function(db_error) {
		console.log("Error loading wordlists: " + db_error);

	});

}

function createButtonToSelectionPage(childData){
	var listButton = document.createElement('button');
	listButton.className = 'btn btn-default';
	listButton.innerText = childData.name;
	// listButton.href = "recordAudio.html#" + childData.listnum + "." + childData.language + "." + childData.name;
	// DEBUG: console.log("button href: " + listButton.href)
	listButton.addEventListener("click", function(){
		chosenList = childData;
		console.log("Button clicked. List chosen is: " + childData.name);
		window.location.href = ("recordAudio.html#" + childData.listnum + "#" + childData.language);
		populateWordListOnRecordAudio();
	});
	return listButton;
}

function populateWordListOnRecordAudio(){

	firebase.database().ref('/wordlists/').once('value').then(function(snapshot) {
		console.log("Accessed database");
	var listGroupID = document.getElementById("wordlistgroup");
	var listHeadingID = document.getElementById("listheading");
	if (pagehash == null) {
		listNo = parseInt(0);
	} else {
		listNo = parseInt(pagehash.substring(1)) - 1;
	}
	
	snapshot.forEach(function(childSnapshot){
		// DEBUG: console.log("key: " + childSnapshot.key + ", listNo: " + listNo);
	if (childSnapshot.key == listNo){
		currentChild = childSnapshot;

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


function upload(AudioBLOB){
 	// Create a storage reference from our storage service
    var storageRef = storage.ref();
    var inputRef = storageRef.child('Input/');
    var uploadTask = storageRef.child('Input/' + tempFilepath).put(AudioBLOB);
    console.log("File uploaded");


}
function createSession(date, filepath){
    // Create a session node in database
    var sessionData = {
    	date : date,
    	filepath : "Input/".concat(filepath),
    	language : getHashValueLanguage(),
    	name : filepath,
    	scrapped : 0,
    	spliced : 0,
    	verified : 0,
    	wordlist : getHashValueKey()
    };

    var newSessionKey = database.ref().child('sessions').push().key;

    var updates = {};
    updates['/sessions/' + newSessionKey] = sessionData;

    database.ref().update(updates);
    console.log("Session node pushed to database");
}

function getDateFormat(date){        
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
function getNameFormat(date){
	var listNo = getHashValueListNo();
	tempFilepath = "auct_list".concat(getHashValueListNo()).concat("_").concat(date);
	return tempFilepath;
}
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