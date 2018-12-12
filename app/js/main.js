let loadingbar = document.getElementById('loading-bar');
let timer;
let width;
let audio;
let response = [];
let audio_blurb = document.getElementById('audio-blurb');
let mediaRecorder;
let shell_noise = document.getElementById('noise');
let conch = document.getElementById('recordingsList');
let random_response;
let au = document.getElementById('mic-audio');

//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream; //stream from getUserMedia()
var rec; //Recorder.js object
var input; //MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext; //new audio context to help us record

var recordButton = document.getElementById("recorder-btn");

recordButton.addEventListener("click", startRecording);

function startRecording() {
	console.log("recordButton clicked");

  var constraints = { audio: true, video:false }

  /*
  Disable the record button until we get a success or fail from getUserMedia()
  */

  recordButton.disabled = true;

  navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
  	console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

  	/* assign to gumStream for later use */
  	gumStream = stream;

  	/* use the stream */
  	input = audioContext.createMediaStreamSource(stream);

      /* 
      Create the Recorder object and configure to record mono sound (1 channel)
      Recording 2 channels  will double the file size
      */
      rec = new Recorder(input,{numChannels:1})

      //start the recording process
      rec.record()

      console.log("Recording started");

    }).catch(function(err) {
      //enable the record button if getUserMedia() fails
      recordButton.disabled = false;
    });
}

function stopRecording() {
    console.log("stopButton clicked");
    //tell the recorder to stop the recording
    rec.stop();
 
    //stop microphone access
    gumStream.getAudioTracks()[0].stop();
 
    //create the wav blob and pass it on to createDownloadLink
    rec.exportWAV(createDownloadLink);
    rec.clear();
}


function createDownloadLink(blob) {
	
	var url = URL.createObjectURL(blob);

	//add controls to the <audio> element
	au.controls = true;
	au.src = url;
	au.autoplay = false;
	au.play();
	
	//add the new audio element to li

	//add the li element to the ol
	conch.appendChild(au);
}

// LOAD AUDIO RESPONSES
function shell_response() {
	for(let i = 0; i < 8; i++) {
		response[i] = new Audio(`sounds/response${i}.mp3`);
	}
	random_response = response[Math.floor(Math.random() * response.length)];
	random_response.setAttribute("id", "conch-says");
	conch.appendChild(random_response);
}

function loading_bar() {
	timer = setInterval(frame, 60) 
	width = 1;
	function frame() {
		if (width >= 100) {
			clearInterval(timer);
		} else {
			width++;
			loadingbar.style.width = width + '%';
		}
	}
}

function add_button_class() {
	let element, name, arr;
  element = document.getElementById("recorder-btn");
  name = "recording";
  arr = element.className.split(" ");
  if (arr.indexOf(name) == -1) {
      element.className += " " + name;
  }
  recordButton.disabled = true;
  element.style.cursor = "wait";
}

function remove_button_class() {
	let element = document.getElementById("recorder-btn");
  element.className = element.className.replace(/\brecording\b/g, "");
  recordButton.disabled = false;
  element.style.cursor = "default";
}

recordButton.addEventListener('click', function (event) {

	// RECORD AUDIO RESPONSE & STORE AUDIO DATA CHUNK
	loading_bar();
	add_button_class();
	shell_response();
	random_response.pause();
	au.pause();

	setTimeout(() => {
    stopRecording();
		add_button_class();
		setTimeout(() => {
			shell_noise.style.display = 'block';
			random_response.play();
			remove_button_class();
			
			setTimeout(() => {
				shell_noise.style.display = 'none';
				au.src = "";
				var elem = document.querySelector('#conch-says');
				elem.parentNode.removeChild(elem);
			}, 1500);
		}, 6500);
	}, 6000);
});