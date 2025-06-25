// Список ваших музыкальных файлов
const backgroundTracks = [
    'music/Project_114.mp3',
    'music/default1.mp3'
];

let currentAudio = null;
let hasInteracted = false;

// Показываем предупреждение, если автовоспроизведение не разрешено браузером
function showUserInteractionWarning() {
    const warning = document.createElement('div');
    warning.id = 'musicWarning';
    warning.style.position = 'absolute';
    warning.style.top = '50%';
    warning.style.left = '50%';
    warning.style.transform = 'translate(-50%, -50%)';
    warning.style.backgroundColor = '#000';
    warning.style.color = '#ff0066';
    warning.style.padding = '20px';
    warning.style.border = '2px solid #ff0066';
    warning.style.zIndex = '9999';
    warning.style.textAlign = 'center';
    warning.style.fontFamily = `'Courier New', monospace`;
    warning.innerHTML = `
        <p>Музыка ожидает взаимодействия с пользователем.</p>
        <p>Нажмите любую клавишу или кликните, чтобы начать воспроизведение.</p>
    `;
    document.body.appendChild(warning);

    const removeWarning = () => {
        document.removeEventListener('click', removeWarning);
        document.removeEventListener('keydown', removeWarning);
        document.body.removeChild(warning);
        hasInteracted = true;
        playRandomTrack();
    };

    document.addEventListener('click', removeWarning);
    document.addEventListener('keydown', removeWarning);
}

// Функция для запуска случайного трека
function playRandomTrack() {
    if (currentAudio) {
        currentAudio.pause(); // Останавливаем текущий трек
    }

    const randomIndex = Math.floor(Math.random() * backgroundTracks.length);
    const selectedTrack = backgroundTracks[randomIndex];

    currentAudio = new Audio(selectedTrack);
    currentAudio.loop = false; // Отключаем loop, будем использовать onended
    currentAudio.volume = 0.5; // Можно настроить громкость по умолчанию

    currentAudio.onended = () => {
        playRandomTrack(); // Автоматически играем следующий трек
    };

    currentAudio.play().catch(e => {
        console.warn("Autoplay был заблокирован.");
        showUserInteractionWarning();
    });
}

// Автозапуск после первой активности пользователя
document.addEventListener('click', () => {
    if (!hasInteracted) {
        hasInteracted = true;
        playRandomTrack();
    }
});

document.addEventListener('keydown', () => {
    if (!hasInteracted) {
        hasInteracted = true;
        playRandomTrack();
    }
});
const volumeSlider = document.getElementById('musicVolume');

if (volumeSlider) {
    volumeSlider.addEventListener('input', () => {
        if (currentAudio) {
            currentAudio.volume = parseFloat(volumeSlider.value);
        }
    });
}