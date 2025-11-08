// Adivina el Futbolista - Lógica del Juego

let players = [];
let currentGame = {
    difficulty: null,
    maxQuestions: 0,
    currentQuestion: 0,
    possiblePlayers: [],
    questionHistory: [],
    currentQuestionIndex: 0
};

const difficultyConfig = {
    easy: { maxQuestions: 20, popularity: [1] },
    medium: { maxQuestions: 15, popularity: [1, 2] },
    hard: { maxQuestions: 10, popularity: [2, 3] }
};

const questions = [
    { text: "¿El jugador juega actualmente en LaLiga (España)?", key: "Liga Actual", value: "LaLiga (España)" },
    { text: "¿El jugador juega en la Premier League (Inglaterra)?", key: "Liga Actual", value: "Premier League (ING)" },
    { text: "¿El jugador es delantero?", key: "Posición Principal", value: "Delantero (DC)" },
    { text: "¿El jugador es mediocentro?", key: "Posición Principal", value: "Mediocentro", partial: true },
    { text: "¿El jugador es defensa?", key: "Posición Principal", value: "Defensa", partial: true },
    { text: "¿El jugador es portero?", key: "Posición Principal", value: "Portero (POR)" },
    { text: "¿El jugador juega en el Real Madrid?", key: "Club Actual", value: "Real Madrid" },
    { text: "¿El jugador juega en el FC Barcelona?", key: "Club Actual", value: "FC Barcelona" },
    { text: "¿El jugador juega en el Manchester City?", key: "Club Actual", value: "Manchester City" },
    { text: "¿El jugador tiene menos de 25 años?", key: "Edad", value: 25, type: "less" },
    { text: "¿El jugador tiene más de 30 años?", key: "Edad", value: 30, type: "greater" },
    { text: "¿El jugador ha ganado la Champions League?", key: "Hitos Destacados", value: "Champions", partial: true },
    { text: "¿El jugador ha ganado un Mundial?", key: "Hitos Destacados", value: "Mundial", partial: true },
    { text: "¿El jugador ha ganado una Eurocopa?", key: "Hitos Destacados", value: "Eurocopa", partial: true },
    { text: "¿El jugador juega como extremo?", key: "Posición Principal", value: "Extremo", partial: true },
    { text: "¿El jugador ha ganado el Balón de Oro?", key: "Hitos Destacados", value: "Balón de Oro", partial: true },
    { text: "¿El jugador juega en la Serie A (Italia)?", key: "Liga Actual", value: "Serie A (ITA)" },
    { text: "¿El jugador juega en la Bundesliga (Alemania)?", key: "Liga Actual", value: "Bundesliga (ALE)" },
    { text: "¿El jugador juega en la Ligue 1 (Francia)?", key: "Liga Actual", value: "Ligue 1 (Francia)" },
    { text: "¿El jugador usa el número 10?", key: "Número", value: "10" },
    { text: "¿El jugador usa el número 7?", key: "Número", value: "7" },
    { text: "¿El jugador usa el número 9?", key: "Número", value: "9" },
    { text: "¿El jugador juega en el Liverpool?", key: "Club Actual", value: "Liverpool FC" },
    { text: "¿El jugador juega en el Bayern Múnich?", key: "Club Actual", value: "Bayern Múnich" },
    { text: "¿El jugador juega en el Arsenal?", key: "Club Actual", value: "Arsenal FC" },
    { text: "¿El jugador juega en el Atlético de Madrid?", key: "Club Actual", value: "Atlético de Madrid" },
    { text: "¿El jugador ha jugado anteriormente en la Premier League?", key: "Ligas Anteriores", value: "Premier League", partial: true },
    { text: "¿El jugador puede jugar como lateral?", key: "Otras Posiciones", value: "Lateral", partial: true },
    { text: "¿El jugador es mediocentro defensivo?", key: "Posición Principal", value: "Mediocentro Defensivo (MCD)" },
    { text: "¿El jugador es mediocentro ofensivo?", key: "Posición Principal", value: "Mediocentro Ofensivo (MCO)" }
];

// Cargar datos de jugadores del CSV
async function loadPlayers() {
    try {
        const response = await fetch('bdf.csv');
        const csvText = await response.text();
        parsePlayers(csvText);
    } catch (error) {
        console.error('Error cargando jugadores:', error);
        // Datos de respaldo en caso de error
        useFallbackData();
    }
}

function parsePlayers(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    
    players = [];
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length === headers.length) {
            const player = {};
            headers.forEach((header, index) => {
                player[header.trim()] = values[index].trim();
            });
            players.push(player);
        }
    }
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    
    return result;
}

function useFallbackData() {
    // Datos de respaldo (algunos jugadores clave)
    players = [
        {
            "Nombre": "Kylian Mbappé",
            "Edad": "26",
            "Número": "10",
            "Posición Principal": "Delantero (DC)",
            "Otras Posiciones": "Extremo Izquierdo",
            "Club Actual": "Real Madrid",
            "Liga Actual": "LaLiga (España)",
            "Hitos Destacados": "Ganador Mundial 2018, Bota de Oro Europea (24/25), Pichichi (24/25).",
            "Popularidad (1-5)": "1"
        },
        {
            "Nombre": "Lionel Messi",
            "Edad": "38",
            "Número": "10",
            "Posición Principal": "Delantero",
            "Club Actual": "Inter Miami CF",
            "Liga Actual": "MLS (EE. UU.)",
            "Hitos Destacados": "Ganador Mundial (2022), 8x Balón de Oro, MVP de la MLS (2024)",
            "Popularidad (1-5)": "1"
        }
    ];
}

// Iniciar el juego
function startGame(difficulty) {
    currentGame.difficulty = difficulty;
    currentGame.maxQuestions = difficultyConfig[difficulty].maxQuestions;
    currentGame.currentQuestion = 0;
    currentGame.questionHistory = [];
    currentGame.currentQuestionIndex = 0;
    
    // Filtrar jugadores según la dificultad
    const allowedPopularity = difficultyConfig[difficulty].popularity;
    currentGame.possiblePlayers = players.filter(player => {
        const popularity = parseInt(player["Popularidad (1-5)"]);
        return allowedPopularity.includes(popularity);
    });
    
    if (currentGame.possiblePlayers.length === 0) {
        currentGame.possiblePlayers = players;
    }
    
    // Cambiar a la pantalla de juego
    showScreen('game-screen');
    updateGameUI();
    askNextQuestion();
}

// Mostrar pantalla
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Actualizar UI del juego
function updateGameUI() {
    const difficultyNames = {
        easy: '😊 Fácil',
        medium: '😎 Intermedio',
        hard: '🔥 Difícil'
    };
    
    document.getElementById('current-difficulty').textContent = difficultyNames[currentGame.difficulty];
    document.getElementById('questions-remaining').textContent = 
        currentGame.maxQuestions - currentGame.currentQuestion;
    
    const progress = (currentGame.currentQuestion / currentGame.maxQuestions) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';
}

// Hacer la siguiente pregunta
function askNextQuestion() {
    if (currentGame.currentQuestion >= currentGame.maxQuestions || currentGame.possiblePlayers.length <= 3) {
        endGame();
        return;
    }
    
    // Seleccionar la mejor pregunta (la que mejor divida los jugadores restantes)
    const bestQuestion = findBestQuestion();
    
    if (bestQuestion) {
        document.getElementById('current-question').textContent = bestQuestion.text;
        currentGame.currentQuestionData = bestQuestion;
    } else {
        endGame();
    }
}

// Encontrar la mejor pregunta
function findBestQuestion() {
    // Filtrar preguntas ya hechas
    const availableQuestions = questions.filter(q => 
        !currentGame.questionHistory.some(h => h.question === q.text)
    );
    
    if (availableQuestions.length === 0) return null;
    
    // Seleccionar una pregunta relevante aleatoriamente
    const randomIndex = Math.floor(Math.random() * Math.min(5, availableQuestions.length));
    return availableQuestions[randomIndex];
}

// Responder pregunta
function answerQuestion(answer) {
    const questionData = currentGame.currentQuestionData;
    const isYes = answer === 'yes';
    
    // Registrar la pregunta en el historial
    currentGame.questionHistory.push({
        question: questionData.text,
        answer: isYes ? 'Sí' : 'No'
    });
    
    // Filtrar jugadores según la respuesta
    currentGame.possiblePlayers = currentGame.possiblePlayers.filter(player => {
        const matches = checkPlayerMatch(player, questionData, isYes);
        return matches;
    });
    
    currentGame.currentQuestion++;
    
    // Actualizar historial visual
    updateQuestionHistory();
    updateGameUI();
    
    // Siguiente pregunta o finalizar
    setTimeout(() => {
        askNextQuestion();
    }, 300);
}

// Verificar si el jugador coincide con la pregunta
function checkPlayerMatch(player, question, isYes) {
    const fieldValue = player[question.key];
    
    if (!fieldValue) return !isYes;
    
    if (question.type === 'less') {
        const playerValue = parseInt(player[question.key]);
        const matches = playerValue < question.value;
        return isYes ? matches : !matches;
    }
    
    if (question.type === 'greater') {
        const playerValue = parseInt(player[question.key]);
        const matches = playerValue > question.value;
        return isYes ? matches : !matches;
    }
    
    if (question.partial) {
        const matches = fieldValue.toLowerCase().includes(question.value.toLowerCase());
        return isYes ? matches : !matches;
    }
    
    const matches = fieldValue === question.value;
    return isYes ? matches : !matches;
}

// Actualizar historial de preguntas
function updateQuestionHistory() {
    const historyContainer = document.getElementById('questions-history');
    historyContainer.innerHTML = '';
    
    currentGame.questionHistory.reverse().forEach(item => {
        const questionItem = document.createElement('div');
        questionItem.className = 'question-item';
        
        questionItem.innerHTML = `
            <span class="question-text">${item.question}</span>
            <span class="answer-badge ${item.answer === 'Sí' ? 'yes' : 'no'}">
                ${item.answer}
            </span>
        `;
        
        historyContainer.appendChild(questionItem);
    });
    
    currentGame.questionHistory.reverse();
}

// Finalizar el juego
function endGame() {
    let guessedPlayer = null;
    
    if (currentGame.possiblePlayers.length > 0) {
        // Seleccionar un jugador aleatorio de los posibles
        const randomIndex = Math.floor(Math.random() * currentGame.possiblePlayers.length);
        guessedPlayer = currentGame.possiblePlayers[randomIndex];
    } else {
        // Si no quedan jugadores, seleccionar uno aleatorio
        const randomIndex = Math.floor(Math.random() * players.length);
        guessedPlayer = players[randomIndex];
    }
    
    showResult(guessedPlayer);
}

// Mostrar resultado
function showResult(player) {
    showScreen('result-screen');
    
    const won = currentGame.possiblePlayers.length <= 3 && currentGame.possiblePlayers.length > 0;
    
    document.getElementById('result-icon').textContent = won ? '🎉' : '🤔';
    document.getElementById('result-title').textContent = won ? '¡Lo adiviné!' : '¡Este es mi intento!';
    
    document.getElementById('player-name').textContent = player.Nombre;
    document.getElementById('player-age').textContent = player.Edad;
    document.getElementById('player-position').textContent = player["Posición Principal"];
    document.getElementById('player-club').textContent = player["Club Actual"];
    document.getElementById('player-league').textContent = player["Liga Actual"];
    document.getElementById('player-achievements').textContent = player["Hitos Destacados"];
    
    document.getElementById('questions-used').textContent = currentGame.currentQuestion;
}

// Reiniciar el juego
function restartGame() {
    currentGame = {
        difficulty: null,
        maxQuestions: 0,
        currentQuestion: 0,
        possiblePlayers: [],
        questionHistory: [],
        currentQuestionIndex: 0
    };
    
    showScreen('start-screen');
}

// Cargar jugadores al iniciar
document.addEventListener('DOMContentLoaded', function() {
    loadPlayers();
});