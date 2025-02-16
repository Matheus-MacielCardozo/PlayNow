const playButton = document.getElementById("playButton")

playButton.addEventListener('click', () => {
    if (playButton.innerHTML.includes('bi-play')) {
        playButton.innerHTML = '<i class="bi bi-pause"></i>'
    } else {
        playButton.innerHTML = '<i class="bi bi-play"></i>'
    }
})