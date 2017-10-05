// Expose globally these variables
var audio_context;
var recorder;
var audio_stream;
var canvas;
var canvasCtx;
var audioCtx;
var mainSection;
var _language;
var _name;
var _key;

/**
 * Check if getUserMedia is supported on the browser
 * Create instances of AudioContext
 */
function Initialize() {
    try {
        // Monkeypatch for AudioContext, getUserMedia and URL
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
        window.URL = window.URL || window.webkitURL;
        // Store the instance of AudioContext globally
        audio_context = new AudioContext;
        console.log('Audio context is ready !');
        console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
} catch (e) {
        alert('No web audio support in this browser!');
    }
}
 
/**
 * Starts the recording process by requesting the access to the microphone.
 * Then, if granted proceed to initialize the Recorder library and store the stream.
 *
 * It only stops when the method stopRecording is triggered.
 */
function startRecording() {
    console.log("In recording");
    // Access the Microphone using the navigator.getUserMedia method to obtain a stream
    navigator.getUserMedia({ audio: true }, function (stream) {
        // Expose the stream to be accessible globally
        audio_stream = stream;
        console.log("In getUserMedia. Stream: " + typeof stream + " audio_stream: " + typeof audio_stream);
        visualize(stream);
        // Create the MediaStreamSource for the Recorder library
        var input = audio_context.createMediaStreamSource(stream);
        console.log('Media stream succesfully created');

        // Initialize the Recorder Library
        recorder = new Recorder(input);
        console.log('Recorder initialised');

        // Start recording
        recorder && recorder.record();
        console.log('Recording...');

        // Disable Record button and enable stop button        
        document.getElementById("recordbtn").disabled = true;
        document.getElementById("stopbtn").disabled = false;

    }, function (e) {
        console.error('No live audio input: ' + e);
    });
}

/**
 * Stops the recording process. The method expects a callback as first
 * argument (function) executed once the AudioBlob is generated and it
 * receives the same Blob as first argument. The second argument is
 * optional and specifies the format to export the blob either wav or mp3
 */
function stopRecording(callback, AudioFormat) {
    // Stop the recorder instance
    recorder && recorder.stop();
    console.log('Stopped recording.');

    // Stop the getUserMedia Audio Stream
    audio_stream.getAudioTracks()[0].stop();

    // Disable Stop button and enable Record button
    document.getElementById("recordbtn").disabled = false;
    document.getElementById("stopbtn").disabled = true;

    // Use the Recorder Library to export the recorder Audio as a .wav file
    // The callback providen in the stop recording method receives the blob
    if(typeof(callback) == "function"){

    /**
     * Export the AudioBLOB using the exportWAV method from Recorder library.
     */
    recorder && recorder.exportWAV(function (blob) {
        callback(blob);

        // create WAV download link using audio data blob
        // createDownloadLink();

        // Clear the Recorder to start again !
        recorder.clear();
        }, (AudioFormat || "audio/wav"));
    }
}

/** 
* This is what starts once the recordAudio.html file is opened
* Initializes everything once the window loads
*/
window.onload = function(){
    // Prepare and check if requirements are filled
    Initialize();

    // Set up canvas for waveform
    canvas = document.querySelector('.visualizer');
    mainSection = document.querySelector('.main-controls');

    // visualiser setup - create web audio api context and canvas
    canvasCtx = canvas.getContext("2d");
    console.log("Visualiser set up: canvasCtx: " + typeof canvasCtx);

    // Handle on start recording button
    document.getElementById("recordbtn").addEventListener("click", function(){
        startRecording();
        console.log("Audio_stream: " + typeof audio_stream);
        //visualize(audio_stream);
    }, false);

    // Handle on stop recording button
    document.getElementById("stopbtn").addEventListener("click", function(){
        // Set audio format as wav format
        var _AudioFormat = "audio/wav";

        stopRecording(function(AudioBLOB){

            // Create an Audio item and related components to the list to allow for playback of every stored Audio
            var url = URL.createObjectURL(AudioBLOB);
            var container = document.createElement('div');
            var audio = document.createElement('audio');
            var title = document.createElement('a');
            var titlerow = document.createElement('div');
            var audiorow = document.createElement('div');
            var buttonrow = document.createElement('div');

            // Create buttons to submit or delete
            var submitbtn = document.createElement('button');
            var deletebtn = document.createElement('button');
            submitbtn.innerText = "Submit";
            deletebtn.innerText = "Delete";
            deletebtn.className = 'btn btn-default';
            submitbtn.className = 'btn btn-default';

            // Set layout and look for each item
            container.className = "container-fluid"
            titlerow.className = 'row';
            audiorow.className = 'row';
            buttonrow.className = 'row';


            // Set controls for audio player
            audio.controls = true;
            audio.src = url;
            title.href = url;
            
            // Get information for naming of file and for link name in UI
            // Format: auct_list00_YYYYmmDDhhMMss.wav
            var now = new Date(); 
            var datestring = getDateFormatForLabel(now);
            var filedate = getDateFormatForFile(now);
            var filename = getNameFormat(filedate);

            // Add components to UI
            console.log("Filename here is: " + filename);
            title.download = filename;
            title.innerHTML = title.download;
            audiorow.appendChild(audio);
            titlerow.appendChild(title);
            buttonrow.appendChild(submitbtn);
            buttonrow.appendChild(deletebtn);
            container.appendChild(titlerow);
            container.appendChild(audiorow);
            container.appendChild(buttonrow);
            var recordingslist = document.getElementById("recordingslist");
            recordingslist.appendChild(container);


            // Submit that specific audio file to the firebase storage
            submitbtn.onclick = function(){
                upload(AudioBLOB, filedate, filename);
                createSession(datestring, filename);

            }

            // Delete that specific audio file and surrounding components
            deletebtn.onclick = function(e){
                evtTgt = e.target;
                evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
                console.log("parent.parent " + evtTgt.parentNode.parentNode);
                console.log("parent " + evtTgt.parentNode);
                console.log("evtTgt " + evtTgt);
            }
        }, _AudioFormat);
    }, false);
};

/**
* Uses MediaStream to analyse audio
* Produces a waveform of the audio
*/
function visualize(stream) {
    console.log("In visualizer. Stream: " + typeof stream);
    var source = audio_context.createMediaStreamSource(stream);

    var analyser = audio_context.createAnalyser();
    analyser.fftSize = 2048;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);
    //analyser.connect(audioCtx.destination);

    console.log("Got here without errors");

    draw()

    // Draw the wave form onto the screen
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
  console.log("resize. offsetWidth: " + mainSection.offsetWidth);
}

window.onresize();
    
