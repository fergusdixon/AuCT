console.log("Hello");
// set up basic variables for app

var record = document.querySelector('#recordbtn');
var stop = document.querySelector('#stopbtn');
var soundClips = document.querySelector('.sound-clips');
var canvas = document.querySelector('.visualizer');
var mainSection = document.querySelector('.main-controls');

// Get a reference to the storage service, which is used to create references in your storage bucket
var storage = firebase.storage();
console.log("got storage")
// Create a storage reference from our storage service
var storageRef = storage.ref();
var inputRef = storageRef.child('Input/');
console.log("got storage references")

// disable stop button while not recording

stop.disabled = true;

// visualiser setup - create web audio api context and canvas

var audioCtx = new (window.AudioContext || webkitAudioContext)();
var canvasCtx = canvas.getContext("2d");

//main block for doing the audio recording

if (navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.');

  var constraints = { audio: true };
  var chunks = [];

  var onSuccess = function(stream) {
    var mediaRecorder = new MediaRecorder(stream);

    visualize(stream);

    record.onclick = function() {
      mediaRecorder.start();
      console.log(mediaRecorder.state);
      console.log("recorder started");
      record.style.background = "red";

      stop.disabled = false;
      record.disabled = true;
    }

    stop.onclick = function() {
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
      console.log("recorder stopped");
      record.style.background = "";
      record.style.color = "";
      // mediaRecorder.requestData();

      stop.disabled = true;
      record.disabled = false;
    }

    mediaRecorder.onstop = function(e) {
      console.log("data available after MediaRecorder.stop() called.");

      var clipName = prompt('Enter a name for your sound clip?','My unnamed clip');
      console.log(clipName);
      var clipContainer = document.createElement('article');
      var clipLabel = document.createElement('p');
      var audio = document.createElement('audio');
      var deleteButton = document.createElement('button');
      var submitButton = document.createElement('button')
     
      clipContainer.classList.add('clip');
      audio.setAttribute('controls', '');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'btn btn-default';
      submitButton.textContent = 'Submit';
      submitButton.className = 'btn btn-default';

      if(clipName === null) {
        clipLabel.textContent = 'My unnamed clip';
      } else {
        clipLabel.textContent = clipName;
      }

      clipContainer.appendChild(audio);
      clipContainer.appendChild(clipLabel);
      clipContainer.appendChild(deleteButton);
      soundClips.appendChild(clipContainer);
      clipContainer.appendChild(submitButton);

      audio.controls = true;
      var blob = new Blob(chunks, { 'type' : 'audio/wav' });
      chunks = [];
      var audioURL = window.URL.createObjectURL(blob);
      audio.src = audioURL;

      
      console.log("recorder stopped");

      submitButton.onclick = function(e){
        console.log("start upload");

        //"myRecording" + ((recIndex<10)?"0":"") + recIndex + ".wav"

        // var link = window.document.createElement('a');
        // link.href = url;
        // link.download = filename || 'output.wav';
        // var click = document.createEvent("Event");
        // click.initEvent("click", true, true);
        // link.dispatchEvent(click);
  Date.prototype.yyyymmddhhmmss = function() {
        var yyyy = this.getFullYear();
        var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
         var dd  = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
   var hh = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
   var min = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
   var ss = this.getSeconds() < 10 ? "0" + this.getSeconds() : this.getSeconds();
   return "".concat(yyyy).concat(mm).concat(dd).concat(hh).concat(min).concat(ss);
  };
// // Upload file and metadata to the object 'images/mountains.jpg'
// var uploadTask = storageRef.child('images/' + file.name).put(file, metadata);
        var wordList = 3;
       
        var today = new Date;
        var date = today.yyyymmddhhmmss();
        console.log(date);
        var filename = "auct_list" + ((wordList<10)?"0":"") + wordList+ "_" + date + ".wav";
        console.log(filename);
      
        // Upload file and metadata to the object 'images/mountains.jpg'
        var uploadTask = storageRef.child('Input/' + filename).put(blob);

      //   ref.put(blob).then(function(snapshot) {
      //     console.log('Uploaded a blob or file!');
      //   });
         console.log("uploaded audio file")
       }

      deleteButton.onclick = function(e) {
        evtTgt = e.target;
        evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
      }

      clipLabel.onclick = function() {
        var existingName = clipLabel.textContent;
        var newClipName = prompt('Enter a new name for your sound clip?');
        if(newClipName === null) {
          clipLabel.textContent = existingName;
        } else {
          clipLabel.textContent = newClipName;
        }
      }
    }

    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    }
  }

  var onError = function(err) {
    console.log('The following error occured: ' + err);
  }

  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

} else {
   console.log('getUserMedia not supported on your browser!');
}

function getFilename(){
  var wordList = 03;
  var today = new Date;
  var date = today.getFullYear()+(today.getMonth()+1)+today.getDate();
  var time = today.getHours() + today.getMinutes() + today.getSeconds();
  var filename = "auct_list" + wordList + "_"+ date + time;
  console.log(filename);
  return filename;
}
// Creates the waveform
function visualize(stream) {
  var source = audioCtx.createMediaStreamSource(stream);

  var analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);
  //analyser.connect(audioCtx.destination);

  draw()

  // Draws the waveform
  function draw() {
    WIDTH = canvas.width
    HEIGHT = canvas.height;

    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

    canvasCtx.beginPath();

    var sliceWidth = WIDTH * 1.0 / bufferLength;
    var x = 0;


    for(var i = 0; i < bufferLength; i++) {
 
      var v = dataArray[i] / 128.0;
      var y = v * HEIGHT/2;

      if(i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height/2);
    canvasCtx.stroke();

  }
}

// Changes size, specifically waveform box
window.onresize = function() {
  canvas.width = mainSection.offsetWidth;
}

window.onresize();