let sea_button = document.getElementById('bg-audio-btn');
let sea_playing = false;
let sea_audio = document.getElementById('bg-audio');

sea_button.addEventListener('click', function(event){
	sea_playing = !sea_playing;

	if (sea_playing == true) {
		sea_audio.play();
		this.innerHTML = '<i class="fas fa-volume-mute"></i>';
	} else {
		sea_audio.pause();
		this.innerHTML = '<i class="fas fa-water"></i>';
	}
})