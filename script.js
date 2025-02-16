const audioElement = document.getElementById('musics');
const currentTime = document.getElementById('current-time');
const musicDuration = document.getElementById('duration');
const playButton = document.querySelector('.controls .bi-play');
const nextButton = document.querySelector('.controls .bi-skip-forward');
const prevButton = document.querySelector('.controls .bi-skip-backward');
const volumeControl = document.querySelector('.volume input');
const progressBar = document.getElementById('progress');

const musics = [
    {
        nome: 'Pressão',
        artista: 'Blxck',
        arquivo: './Musics/Blxck - Pressão (Zaraki Kenpachi)(MP3_320K).mp3'
    },
    {
        nome: 'Feiticeiro Descolado',
        artista: 'MHRAP',
        arquivo: './Musics/FEITICEIRO DESCOLADO.mp3'
    },
    {
        nome: 'Kisame e Itachi',
        artista: 'MHRAP',
        arquivo: './Musics/Kisame e Itachi.mp3'
    },
    {
        nome: 'Ninja Descolado 4',
        artista: 'MHRAP',
        arquivo: './Musics/NINJA DESCOLADO 4.mp3'
    },
    {
        nome: 'Tipo Gas',
        artista: 'MHRAP',
        arquivo: './Musics/Tipo Gas.mp3'
    },
    {
        nome: 'Tipo Pain 2',
        artista: 'MHRAP',
        arquivo: './Musics/Tipo Pain 2.mp3'
    },
    {
        nome: 'Tipo Suguru Geto',
        artista: 'MHRAP',
        arquivo: './Musics/Tipo Suguru Geto.mp3'
    },
    {
        nome: 'Tipo Tobi 2',
        artista: 'MHRAP',
        arquivo: './Musics/Tipo Tobi  2.mp3'
    },
    {
        nome: 'Tipo Tobirama 2',
        artista: 'MHRAP',
        arquivo: './Musics/Tipo Tobirama 2.mp3'
    }
];

let currentSongIndex = 0;

// Função para carregar a música
function loadSong(index) {
    const song = musics[index];
    audioElement.src = song.arquivo;
    audioElement.load();
    document.querySelector('.song-info p:first-child').textContent = song.nome;
    document.querySelector('.song-info p:nth-child(2)').textContent = song.artista;

    musicDuration.textContent = '0:00'
    currentTime.textContent = '0:00'
    progressBar.value = 0

    audioElement.addEventListener('loadedmetadata', () => {
        if (!isNaN(audioElement.duration)) {
            musicDuration.textContent = formatTime(audioElement.duration);
        }
    })
}

// Função para reproduzir a música
function playSong() {
    audioElement.play().then(() => {
        playButton.classList.remove('bi-play');
        playButton.classList.add('bi-pause');
    }).catch((error) => {
        console.error('Erro ao reproduzir o áudio:', error);
    });
}

// Função para pausar a música
function pauseSong() {
    audioElement.pause();
    playButton.classList.remove('bi-pause');
    playButton.classList.add('bi-play');
}

// Função para avançar para a próxima música
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % musics.length;
    loadSong(currentSongIndex);
    playSong();
}

// Função para voltar para a música anterior
function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + musics.length) % musics.length;
    loadSong(currentSongIndex);
    playSong();
}

function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

// Event listener para o botão de play/pause
playButton.addEventListener('click', () => {
    if (audioElement.paused) {
        playSong();
    } else {
        pauseSong();
    }
});

// Event listeners para os botões de próximo e anterior
nextButton.addEventListener('click', nextSong);
prevButton.addEventListener('click', prevSong);

// Event listener para o controle de volume
volumeControl.addEventListener('input', (e) => {
    audioElement.volume = e.target.value / 100;
});

// Carrega a primeira música ao iniciar
loadSong(currentSongIndex);

// Atualizar a barra de progresso conforme a música é reproduzida
audioElement.addEventListener('timeupdate', () => {
    currentTime.textContent = formatTime(audioElement.currentTime)
    const progress = (audioElement.currentTime / audioElement.duration) * 100;
    progressBar.value = progress;
});

// Atualizar o tempo total da música
audioElement.addEventListener('loadedmetadata', () => {
    if (!isNaN(audioElement.duration)) {
        musicDuration.textContent = formatTime(audioElement.duration)
    }
})

// Permitir que o usuário arraste a barra para mudar o tempo da música
progressBar.addEventListener('input', () => {
    const seekTime = (progressBar.value / 100) * audioElement.duration;
    audioElement.currentTime = seekTime;
});

// Tratamento de erros
audioElement.addEventListener('error', () => {
    console.error('Erro ao carregar o áudio. Verifique o caminho do arquivo e o formato.');
    musicDuration.textContent = '0:00'
    currentTime.textContent = '0:00'
    progressBar.value = 0
});
