const audioElement = document.getElementById('musics')
const currentTime = document.getElementById('current-time')
const musicDuration = document.getElementById('duration')
const playButton = document.querySelector('.controls .bi-play')
const nextButton = document.querySelector('.controls .bi-skip-forward')
const prevButton = document.querySelector('.controls .bi-skip-backward')
const volumeControl = document.querySelector('.volume input')
const progressBar = document.getElementById('progress')
const linkHome = document.getElementById('link-home')
const linkSearch = document.getElementById('link-search')
const linkPlaylist = document.getElementById('link-playlist')
const screenHome = document.getElementById('main-screen')
const screenSearch = document.getElementById('search-screen')
const screenPlaylist = document.getElementById('playlist-screen')
const searchInput = document.querySelector('#search-screen input')
const newPlaylistInput = document.getElementById('new-playlist-name')
const createPlaylistBtn = document.getElementById('create-playlist')

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
]

let playlists = JSON.parse(localStorage.getItem('playlists')) || []
updatePlaylists()

let currentSongIndex = 0

// Função para carregar a música
function loadSong(index) {
    const song = musics[index]
    audioElement.src = song.arquivo
    audioElement.load()
    document.querySelector('.song-info p:first-child').textContent = song.nome
    document.querySelector('.song-info p:nth-child(2)').textContent = song.artista

    musicDuration.textContent = '0:00'
    currentTime.textContent = '0:00'
    progressBar.value = 0

    audioElement.addEventListener('loadedmetadata', () => {
        if (!isNaN(audioElement.duration)) {
            musicDuration.textContent = formatTime(audioElement.duration)
        }
    })
}

// Função para reproduzir a música
function playSong() {
    audioElement.play().then(() => {
        playButton.classList.remove('bi-play')
        playButton.classList.add('bi-pause')
    }).catch((error) => {
        console.error('Erro ao reproduzir o áudio:', error)
    })
}

// Função para pausar a música
function pauseSong() {
    audioElement.pause()
    playButton.classList.remove('bi-pause')
    playButton.classList.add('bi-play')
}

// Função para avançar para a próxima música
function nextSong() {
    if(currentPlayListIndex !== null) {
        const currentIndex = currentPlayListSongs.findIndex(song => 
            song.arquivo === musics[currentSongIndex].arquivo
        )
        const newIndex = (currentIndex + 1) % currentPlayListSongs.length
        playSongFromPlaylist(newIndex)
    } else {
        currentSongIndex = (currentSongIndex + 1) % musics.length
        loadSong(currentSongIndex) // Adicione o parâmetro faltante
        playSong()
    }
}

// Função para voltar para a música anterior
function prevSong() {
    if(currentPlayListIndex !== null) {
        const currentIndex = currentPlayListSongs.findIndex(song => 
            song.arquivo === musics[currentSongIndex].arquivo
        )
        const newIndex = (currentIndex - 1 + currentPlayListSongs.length) % currentPlayListSongs.length
        playSongFromPlaylist(newIndex)
    } else {
        currentSongIndex = (currentSongIndex - 1 + musics.length) % musics.length
        loadSong(currentSongIndex) // Adicione o parâmetro faltante
        playSong()
    }
}

// Função para ajustar o formato do tempo
function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

// Função para trocar as telas
function switchScreen(screenActive, linkActive) {
    // Suavizar transição
    document.querySelectorAll('.screen').forEach(screen => {
        screen.style.transition = 'none';
        void screen.offsetHeight;
        screen.style.transition = '';
    });
    
    // Oculta todas as telas
    screenHome.classList.remove('ativa');
    screenSearch.classList.remove('ativa');
    screenPlaylist.classList.remove('ativa');

    // Remove a classe "ativa" de todos os links
    linkHome.classList.remove('ativa');
    linkSearch.classList.remove('ativa');
    linkPlaylist.classList.remove('ativa');

    // Exibe a tela ativa e marca o link como ativo
    screenActive.classList.add('ativa');
    linkActive.classList.add('ativa');
}

// Função para exibir os resultados da pesquisa
function showSearchResults(results) {
    const container = document.querySelector('#search-screen .playlist-grid')
    container.innerHTML = results.map((music, index) => `
        <div class="playlist-card" data-id="${index}">
            <h3>${music.nome}</h3>
            <p>${music.artista}</p>
            <button class="add-to-playlist">Adicionar à Playlist</button>
        </div>
        `).join('')
}

// Função para criar uma playlist
function createPlaylist() {
    const nome = newPlaylistInput.value.trim()
    if(!nome) return

    if(playlists.some(playlist => playlist.nome.toLowerCase() === nome.toLowerCase())) {
        alert('Já existe uma playlist com esse nome!')
        return
    }
    
    playlists.push({
        nome: nome,
        musicas: []
    })
    newPlaylistInput.value = ''
    updatePlaylists()
    savePlaylists()
}

// Função para atualizar uma playlist
function updatePlaylists() {
    const container = document.querySelector('#playlist-screen .playlist-grid')
    container.innerHTML = playlists.map((playlist, index) => `
        <div class="playlist-card" data-index="${index}">
            <h3>${playlist.nome}</h3>
            <p>${playlist.musicas.length} músicas</p>
            <div class="playlist-actions">
                <button class="delete-playlist">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                    </svg>
                </button>
                <button class="edit-playlist">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                    </svg>
                </button>
            </div>
        </div>
    `).join('')

    document.querySelectorAll('.playlist-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if(!e.target.closest('.playlist-actions')) {
                const index = parseInt(card.dataset.index)
                showPlaylistSongs(index)
            }
        })
    })

    savePlaylists()
}

// Função para salvar a playlist
function savePlaylists() {
    localStorage.setItem('playlists', JSON.stringify(playlists))
}

let currentPlayListIndex = null
let currentPlayListSongs = []

// Função para mostrar as músicas da playlist
function showPlaylistSongs(index) {
    const playlist = playlists[index]
    if(!playlist) return
    const container = document.getElementById('playlist-songs')
    const title = document.getElementById('playlist-title')
    const songsContainer = document.getElementById('playlist-songs-container')

    currentPlayListIndex = index
    currentPlayListSongs = playlist.musicas

    title.textContent = playlist.nome
    songsContainer.style.display = 'block'

    container.innerHTML = `
        <button class="play-all-button" onClick="playPlaylist()">Reproduzir Tudo</button>
        ${playlist.musicas.map((song, i) => `
            <div class="song-item" data-index="${i}" onClick="playSongFromPlaylist(${i})">
                <div>
                    <h4>${song.nome}</h4>
                    <p>${song.artista}</p>
                </div>
                <button class="bi bi-play"></button> <!-- Corrigido classe do ícone -->
            </div>
        `).join('')}
    `
}

// Função para tocar as músicas da playlist
function playSongFromPlaylist(index) {
    if(currentPlayListIndex !== null) {
        currentSongIndex = musics.findIndex(song => 
            song.arquivo === currentPlayListSongs[index].arquivo
        )
        loadSong(currentSongIndex)
        playSong()
    }
}

window.playPlaylist = function() {
    if(currentPlayListSongs.length > 0) {
        currentSongIndex = musics.findIndex(song => 
            song.arquivo === currentPlayListSongs[0].arquivo
        )

        if(currentSongIndex !== -1) {
            loadSong(currentSongIndex)
            playSong()
        } else {
            alert("Músicas não encontradas na biblioteca!")
        }
        
    }
}

// Delegation para ações nas playlists
document.querySelector('#playlist-screen .playlist-grid').addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.delete-playlist')
    const editBtn = e.target.closest('.edit-playlist')
    const playlistCard = e.target.closest('.playlist-card')
    
    if (deleteBtn && playlistCard) {
        const playlistIndex = playlistCard.dataset.index
        playlists.splice(playlistIndex, 1)
        updatePlaylists()
        savePlaylists()
    }
    
    if (editBtn && playlistCard) {
        const playlistIndex = playlistCard.dataset.index
        const newName = prompt('Novo nome da playlist:', playlists[playlistIndex].nome)
        if (newName) {
            playlists[playlistIndex].nome = newName
            updatePlaylists()
            savePlaylists()
        }
    }
})

// Adicionar músicas às playlists
document.querySelector('#search-screen .playlist-grid').addEventListener('click', (e) => {
    const addBtn = e.target.closest('.add-to-playlist')
    const musicCard = e.target.closest('.playlist-card')

    if (addBtn && musicCard) {
        const musicIndex = musicCard.dataset.id
        const selectedPlaylist = prompt(`Adicionar à qual playlist?\n${playlists.map((p, i) => `${i + 1} - ${p.nome}`).join('\n')}`)
        
        if (selectedPlaylist) {
            const playlistIndex = parseInt(selectedPlaylist) - 1
            if(playlists[playlistIndex] && musics[musicIndex]) {
                const musicToAdd = {
                    ...music[musicIndex]
                }
                playlists[playlistIndex].musicas.push(musicToAdd)
                updatePlaylists()
                savePlaylists()
                alert('Musica adicionada com sucesso!')
            } else {
                alert('Playlist ou música inválida!')
            }
        }
    }
})

// ---------------------- LISTENERS ------------------------------- \\

// Event listener para o botão de play/pause
playButton.addEventListener('click', () => {
    if (audioElement.paused) {
        playSong()
    } else {
        pauseSong()
    }
})

// Event listeners para os botões de próximo e anterior
nextButton.addEventListener('click', nextSong)
prevButton.addEventListener('click', prevSong)

// Event listener para o controle de volume
volumeControl.addEventListener('input', (e) => {
    audioElement.volume = e.target.value / 100
})

// Atualizar a barra de progresso conforme a música é reproduzida
audioElement.addEventListener('timeupdate', () => {
    currentTime.textContent = formatTime(audioElement.currentTime)
    const progress = (audioElement.currentTime / audioElement.duration) * 100
    progressBar.value = progress
})

// Atualizar o tempo total da música
audioElement.addEventListener('loadedmetadata', () => {
    if (!isNaN(audioElement.duration)) {
        musicDuration.textContent = formatTime(audioElement.duration)
    }
})

// Permitir que o usuário arraste a barra para mudar o tempo da música
progressBar.addEventListener('input', () => {
    const seekTime = (progressBar.value / 100) * audioElement.duration
    audioElement.currentTime = seekTime
})

// Tratamento de erros
audioElement.addEventListener('error', () => {
    console.error('Erro ao carregar o áudio. Verifique o caminho do arquivo e o formato.')
    musicDuration.textContent = '0:00'
    currentTime.textContent = '0:00'
    progressBar.value = 0
})

linkHome.addEventListener('click', (e) => {
    e.preventDefault()
    switchScreen(screenHome, linkHome)
})

linkSearch.addEventListener('click', (e) => {
    e.preventDefault()
    switchScreen(screenSearch, linkSearch)
})

linkPlaylist.addEventListener('click', (e) => {
    e.preventDefault()
    switchScreen(screenPlaylist, linkPlaylist)
})

searchInput.addEventListener('input', (e) => {
    const termo = e.target.value.toLowerCase()
    const results = musics.filter(musics => 
        musics.nome.toLowerCase().includes(termo) ||
        musics.artista.toLowerCase().includes(termo)
    )

    showSearchResults(results)
})

createPlaylistBtn.addEventListener('click', createPlaylist)

switchScreen(screenHome, linkHome)

// Carrega a primeira música ao iniciar
loadSong(currentSongIndex)