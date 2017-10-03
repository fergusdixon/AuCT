console.log("Opening word list page");


var wordlists = [];
var database = firebase.database();
console.log("connected to database")

var chosenList = null;

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
		var listButton = document.createElement('button');
		listButton.className = 'btn btn-default';
		listButton.innerText = childName;
		listButton.href = "recordAudio.html";
		listButton.addEventListener("click", function(){
			chosenList = childData;
			console.log("Button clicked. List chosen is: " + childData.name);
			window.location.href = ("recordAudio.html");
		});

		divId.appendChild(listButton);
		console.log("wordlist button made")

	})
}).catch(function(db_error) {
		console.log("Error loading wordlists: " + db_error);

	});



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