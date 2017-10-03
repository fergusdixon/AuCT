console.log("Opening word list page");

// Get the file path of the current window
var url=location.href;
var urlFilename = url.substring(url.lastIndexOf('/')+1);
console.log(urlFilename);

// Initialise needed variablses

var wordlistNo = 0;
var chosenList = null;
var pagehash = null;
// Get reference for firebase database
var database = firebase.database();
console.log("connected to database")

// Run functions according to needed
if (urlFilename == "wordListSelection.html"){
	getWordLists();
	addButtons();
} else {
	pagehash = window.location.hash;
	console.log("hash: " + pagehash);
	populateWordListOnRecordAudio();
}


function getWordLists() {
firebase.database().ref('/wordlists/').once('value').then(function(snapshot) {
	wordlists = snapshot.val();
	var divId = document.getElementById("wordlistRow");

	snapshot.forEach(function(childSnapshot){
		var childKey = childSnapshot.key;
		var childData = childSnapshot.val();
		console.log("key: " + childKey);
		console.log("data: " + childData);
		var childName = childData.name;
		console.log("name: " + childName)
		wordlistNo++;
		console.log("starting button creation...")
	
	var listButton = createButtonToSelectionPage(childData);
		divId.appendChild(listButton);
		console.log("wordlist button made")


	})
	console.log(wordlistNo);
}).catch(function(db_error) {
		console.log("Error loading wordlists: " + db_error);

	});

}

function createButtonToSelectionPage(childData){
	console.log("adding a button")
	var listButton = document.createElement('button');
	listButton.className = 'btn btn-default';
	listButton.innerText = childData.name;
	listButton.href = "recordAudio.html#" + childData.listnum;
	console.log("button href: " + listButton.href)
	listButton.addEventListener("click", function(){
		chosenList = childData;
		console.log("Button clicked. List chosen is: " + childData.name);
		window.location.href = ("recordAudio.html#" + childData.listnum);
		populateWordListOnRecordAudio();
	});
	return listButton;
}

function populateWordListOnRecordAudio(){

	firebase.database().ref('/wordlists/').once('value').then(function(snapshot) {
		console.log("accessed database");
	var listGroupID = document.getElementById("wordlistgroup");
	var listHeadingID = document.getElementById("listheading");
	if (pagehash == null) {
		var listNo = parseInt(0);
	} else {
		var listNo = parseInt(pagehash.substring(1)) - 1;
	}
	
	snapshot.forEach(function(childSnapshot){
		console.log("key: " + childSnapshot.key + ", listNo: " + listNo);
	if (childSnapshot.key == listNo){
		console.log(childSnapshot.val().name);
		listHeadingID.innerText = childSnapshot.val().name;
		var list = childSnapshot.val().words;
		for (var i = 0; i < list.length; i++) {
			var li = document.createElement("li");
			li.className = "list-group-item";
			li.innerText = list[i];
			listGroupID.appendChild(li);
			console.log("added item: " + list[i]);
	}
	}

})
	}).catch(function(db_error) {
		console.log("Error loading wordlists: " + db_error);

	});

}



// Example code to read data once
// var userId = firebase.auth().currentUser.uid;
// return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
//   var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
//   // ...
// });

// // Example code to read child node
// database.once('value', function(snapshot) {
//   snapshot.forEach(function(childSnapshot) {
//     var childKey = childSnapshot.key;
//     var childData = childSnapshot.val();
//     console.log("childData");
//     // ...
//   });
// });

// Another example for value events
// // Get elements
// const dbRefObject = firebase.database().ref().child('Object');
// // Create references
// const dbRefObject = firebase.database().ref().child('Object');
// // Sync object changes
// dbRefObject.on('value', snap => console.log(snap.val()));

// ANother example for child events
// const dbRefObject = firebase.database().ref().child('auct-capstone');
// console.log("Ref Object: " + dbRefObject);
// const ulList = document.getElementById('List');
// const dbRefList = dbRefObject.child('wordlists'); // from above
// console.log("Ref List: " + dbRefList);
// dbRefList.on('child_added', snap => {
// 	const li = document.createElement('li');
// 	li.innerText = snap.val();
// 	li.id = snap.key;
// 	ulList.appendChild(li);
// })