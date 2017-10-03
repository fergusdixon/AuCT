console.log("Opening word list page");


var wordlists = [];
var database = firebase.database();
console.log("connected to database")

firebase.database().ref('/wordlists/').once('value').then(function(snapshot) {
	wordlists = snapshot.val();

	for (var list in wordlists){
		console.log(list);
		console.log(list.name);
	}

	snapshot.forEach(function(childSnapshot){
		var childKey = childSnapshot.key;
		var childData = childSnapshot.val();
		console.log("key: " + childKey);
		console.log("data: " + childData);
		var childName = childData.name;
		console.log("name: " + childName)
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