/* Get elements */
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const fullscreen = player.querySelector('.fullscreen')
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

/* Functions */
function spaceToggle(e) {
    if (e.which === 32) togglePlay();
}

function togglePlay() {
    if (video.paused) video.play();
    else video.pause();
}

function updateButton() {
    const icon = this.paused ? '►' : '❚ ❚' ;
    toggle.textContent = icon;
}

function skip() {
    let skipTime = parseFloat(this.dataset.skip);
    video.currentTime += skipTime;
}

function handleRangeUpdate() {
    video[this.name] = this.value;
}

function handleProgress() {
    const percent = (video.currentTime/video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`
}

function scrub(e) {
    console.log(e);
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
}

//Handled differently by browsers, so checking which method to call
//todo: fullscreen shows default player options
function toggleFullscreen() {
    console.log('a');
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.webkitRequestFullScreen) {
        video.webkitRequestFullscreen();
    } else if (video.mozRequestFullScreen) {
        video.mozRequestFullScreen();
    }
}
 
/* Event Listeners */
document.addEventListener('keydown', spaceToggle);

video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('click', togglePlay);
video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay);
fullscreen.addEventListener('click', toggleFullscreen);

ranges.forEach(slider => slider.addEventListener('change',  handleRangeUpdate));
ranges.forEach(slider => slider.addEventListener('mousemove', handleRangeUpdate));
skipButtons.forEach(btn => btn.addEventListener('click', skip));

let mousedown = false; 
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);
