// Expose globally your audio_context, the recorder instance and audio_stream
        var audio_context;
        var recorder;
        var audio_stream;
        var storage;

        /**
         * Patch the APIs for every browser that supports them and check
         * if getUserMedia is supported on the browser. 
         * 
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

                // Get reference to firebase storage bucket
                storage = firebase.storage();
            } catch (e) {
                alert('No web audio support in this browser!');
            }
        }
 
        /**
         * Starts the recording process by requesting the access to the microphone.
         * Then, if granted proceed to initialize the library and store the stream.
         *
         * It only stops when the method stopRecording is triggered.
         */
        function startRecording() {
            // Access the Microphone using the navigator.getUserMedia method to obtain a stream
            navigator.getUserMedia({ audio: true }, function (stream) {
                // Expose the stream to be accessible globally
                audio_stream = stream;
                // Create the MediaStreamSource for the Recorder library
                var input = audio_context.createMediaStreamSource(stream);
                console.log('Media stream succesfully created');

                // Initialize the Recorder Library
                recorder = new Recorder(input);
                console.log('Recorder initialised');

                // Start recording !
                recorder && recorder.record();
                console.log('Recording...');

                // Disable Record button and enable stop button !
                
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

            // Stop the getUserMedia Audio Stream !
            audio_stream.getAudioTracks()[0].stop();

            // Disable Stop button and enable Record button !
            document.getElementById("recordbtn").disabled = false;
            document.getElementById("stopbtn").disabled = true;

            // Use the Recorder Library to export the recorder Audio as a .wav file
            // The callback providen in the stop recording method receives the blob
            if(typeof(callback) == "function"){

                /**
                 * Export the AudioBLOB using the exportWAV method.
                 * Note that this method exports too with mp3 if
                 * you provide the second argument of the function
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
        function getNameFormat(){
            var listNo = window.location.hash.substring(1);
            var now = new Date();
            var yyyy = now.getFullYear();
            var mm = now.getMonth() < 9 ? "0" + (now.getMonth() + 1) : (now.getMonth() + 1); // getMonth() is zero-based
            var dd  = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
            var hh = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
            var min = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
            var ss = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();
            return "auct_list".concat(listNo).concat("_").concat(yyyy).concat(mm).concat(dd).concat(hh).concat(min).concat(ss);
        }
        function upload(){

        }

        // Initialize everything once the window loads
        window.onload = function(){
            // Prepare and check if requirements are filled
            Initialize();

            // Handle on start recording button
            document.getElementById("recordbtn").addEventListener("click", function(){
                startRecording();
            }, false);

            // Handle on stop recording button
            document.getElementById("stopbtn").addEventListener("click", function(){
                // Use wav format
                var _AudioFormat = "audio/wav";
                // You can use mp3 to using the correct mimetype
                //var AudioFormat = "audio/mpeg";

                stopRecording(function(AudioBLOB){
                    // Note:
                    // Use the AudioBLOB for whatever you need, to download
                    // directly in the browser, to upload to the server, you name it !

                    // In this case we are going to add an Audio item to the list so you
                    // can play every stored Audio
                    var url = URL.createObjectURL(AudioBLOB);
                    var li = document.createElement('li');
                    var au = document.createElement('audio');
                    var hf = document.createElement('a');

                    // Create buttons to submit or delete
                    var submitbtn = document.createElement('button');
                    var deletebtn = document.createElement('button');
                    submitbtn.innerText = "Submit";
                    deletebtn.innerText = "Delete";
                    deletebtn.className = 'btn btn-default';
                    submitbtn.className = 'btn btn-default';

                    au.controls = true;
                    au.src = url;
                    hf.href = url;
                    var filename = getNameFormat() + '.wav';
                    hf.download = filename;
                    hf.innerHTML = hf.download;
                    li.appendChild(au);
                    li.appendChild(hf);
                    li.appendChild(submitbtn);
                    li.appendChild(deletebtn);
                    var recordingslist = document.getElementById("recordingslist");
                    recordingslist.appendChild(li);

                    // Submit that specific file to the firebase storage
                    submitbtn.onclick = function(){
                        // Create a storage reference from our storage service
                        var storageRef = storage.ref();
                        var inputRef = storageRef.child('Input/');
                        var uploadTask = storageRef.child('Input/' + filename).put(AudioBLOB);
                        console.log("File uploaded");
                    }

                    // Delete that specific audio file and surrounding buttons
                    deletebtn.onclick = function(e){
                        evtTgt = e.target;
                        evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
                    }
                }, _AudioFormat);
            }, false);
        };
    
