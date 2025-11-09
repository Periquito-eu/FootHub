// Adivina el Futbolista - Lógica del Juego

let players = [];
let currentGame = {
    difficulty: null,
    maxQuestions: 0,
    currentQuestion: 0,
    secretPlayer: null,
    questionHistory: [],
    guessedCorrectly: false
};

const difficultyConfig = {
    easy: { maxQuestions: 20, popularity: [1] },
    medium: { maxQuestions: 15, popularity: [1, 2] },
    hard: { maxQuestions: 10, popularity: [2, 3] }
};

// Keywords for analyzing player questions
const questionKeywords = {
    leagues: {
        keywords: ['laliga', 'españa', 'premier', 'inglaterra', 'serie a', 'italia', 'bundesliga', 'alemania', 'ligue 1', 'francia', 'mls'],
        field: 'Liga Actual'
    },
    clubs: {
        keywords: ['real madrid', 'barcelona', 'manchester city', 'liverpool', 'bayern', 'arsenal', 'atletico', 'inter', 'napoli', 'miami'],
        field: 'Club Actual'
    },
    positions: {
        keywords: ['delantero', 'mediocentro', 'defensa', 'portero', 'extremo', 'lateral', 'mediapunta'],
        field: 'Posición Principal'
    },
    age: {
        keywords: ['edad', 'años', 'joven', 'viejo', 'veterano'],
        field: 'Edad'
    },
    achievements: {
        keywords: ['mundial', 'champions', 'eurocopa', 'balon de oro', 'copa', 'ganador', 'campeon'],
        field: 'Hitos Destacados'
    },
    number: {
        keywords: ['numero', 'número', 'dorsal'],
        field: 'Número'
    },
    nationality: {
        keywords: ['nacionalidad', 'pais', 'país', 'frances', 'español', 'brasileño', 'argentino', 'ingles'],
        field: 'Nacionalidad'
    }
};

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
    currentGame.guessedCorrectly = false;
    
    // Filtrar jugadores según la dificultad
    const allowedPopularity = difficultyConfig[difficulty].popularity;
    const availablePlayers = players.filter(player => {
        const popularity = parseInt(player["Popularidad (1-5)"]);
        return allowedPopularity.includes(popularity);
    });
    
    // Seleccionar jugador secreto aleatorio
    if (availablePlayers.length > 0) {
        const randomIndex = Math.floor(Math.random() * availablePlayers.length);
        currentGame.secretPlayer = availablePlayers[randomIndex];
    } else {
        // Si no hay jugadores con esa popularidad, usar todos
        const randomIndex = Math.floor(Math.random() * players.length);
        currentGame.secretPlayer = players[randomIndex];
    }
    
    console.log('Jugador secreto:', currentGame.secretPlayer.Nombre); // Para debugging
    
    // Cambiar a la pantalla de juego
    showScreen('game-screen');
    updateGameUI();
    focusQuestionInput();
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

// Focus on question input
function focusQuestionInput() {
    const input = document.getElementById('player-question');
    if (input) {
        input.focus();
    }
}

// Submit player's question
function submitQuestion() {
    const questionInput = document.getElementById('player-question');
    const question = questionInput.value.trim();
    
    if (!question) {
        alert('Por favor, escribe una pregunta');
        return;
    }
    
    // Analyze the question and get AI response
    const answer = analyzeQuestion(question);
    
    // Add to history
    currentGame.questionHistory.push({
        question: question,
        answer: answer
    });
    
    currentGame.currentQuestion++;
    
    // Clear input
    questionInput.value = '';
    
    // Update UI
    updateQuestionHistory();
    updateGameUI();
    
    // Check if game should end
    if (currentGame.currentQuestion >= currentGame.maxQuestions) {
        showGuessScreen();
    } else {
        focusQuestionInput();
    }
}

// Analyze player's question and return yes/no based on secret player
function analyzeQuestion(question) {
    const lowerQuestion = question.toLowerCase();
    const player = currentGame.secretPlayer;
    
    // Check for specific numbers (like jersey numbers)
    const numberMatch = lowerQuestion.match(/\b(\d+)\b/);
    if ((lowerQuestion.includes('numero') || lowerQuestion.includes('número') || lowerQuestion.includes('dorsal')) && numberMatch) {
        return player['Número'] === numberMatch[1] ? 'Sí' : 'No';
    }
    
    // Check for age-related questions
    if (lowerQuestion.includes('edad')) {
        const ageMatch = lowerQuestion.match(/(\d+)/);
        if (ageMatch) {
            const age = parseInt(ageMatch[1]);
            const playerAge = parseInt(player['Edad']);
            
            if (lowerQuestion.includes('menos') || lowerQuestion.includes('menor')) {
                return playerAge < age ? 'Sí' : 'No';
            } else if (lowerQuestion.includes('mas') || lowerQuestion.includes('más') || lowerQuestion.includes('mayor')) {
                return playerAge > age ? 'Sí' : 'No';
            } else {
                return playerAge === age ? 'Sí' : 'No';
            }
        }
    }
    
    // Check for leagues
    if (lowerQuestion.includes('laliga') || lowerQuestion.includes('españa')) {
        return player['Liga Actual'].toLowerCase().includes('laliga') ? 'Sí' : 'No';
    }
    if (lowerQuestion.includes('premier') || lowerQuestion.includes('inglaterra')) {
        return player['Liga Actual'].toLowerCase().includes('premier') ? 'Sí' : 'No';
    }
    if (lowerQuestion.includes('serie a') || lowerQuestion.includes('italia')) {
        return player['Liga Actual'].toLowerCase().includes('serie a') ? 'Sí' : 'No';
    }
    if (lowerQuestion.includes('bundesliga') || lowerQuestion.includes('alemania')) {
        return player['Liga Actual'].toLowerCase().includes('bundesliga') ? 'Sí' : 'No';
    }
    if (lowerQuestion.includes('ligue 1') || lowerQuestion.includes('francia')) {
        return player['Liga Actual'].toLowerCase().includes('ligue 1') || player['Liga Actual'].toLowerCase().includes('francia') ? 'Sí' : 'No';
    }
    if (lowerQuestion.includes('mls')) {
        return player['Liga Actual'].toLowerCase().includes('mls') ? 'Sí' : 'No';
    }
    
    // Check for clubs - need to check exact matches for common clubs
    const clubs = [
        'real madrid', 'barcelona', 'manchester city', 'liverpool', 'arsenal',
        'bayern', 'munich', 'atletico', 'inter', 'napoli', 'miami', 'tottenham',
        'chelsea', 'juventus', 'psg', 'milan'
    ];
    for (const club of clubs) {
        if (lowerQuestion.includes(club)) {
            return player['Club Actual'].toLowerCase().includes(club) ? 'Sí' : 'No';
        }
    }
    
    // Check for positions
    if (lowerQuestion.includes('delantero') || lowerQuestion.includes('atacante')) {
        return player['Posición Principal'].toLowerCase().includes('delantero') ? 'Sí' : 'No';
    }
    if (lowerQuestion.includes('mediocentro') || lowerQuestion.includes('medio')) {
        return player['Posición Principal'].toLowerCase().includes('mediocentro') || 
               player['Posición Principal'].toLowerCase().includes('medio') ? 'Sí' : 'No';
    }
    if (lowerQuestion.includes('defensa') || lowerQuestion.includes('defensor')) {
        return player['Posición Principal'].toLowerCase().includes('defensa') ? 'Sí' : 'No';
    }
    if (lowerQuestion.includes('portero') || lowerQuestion.includes('arquero') || lowerQuestion.includes('guardameta')) {
        return player['Posición Principal'].toLowerCase().includes('portero') ? 'Sí' : 'No';
    }
    if (lowerQuestion.includes('extremo')) {
        return player['Posición Principal'].toLowerCase().includes('extremo') || 
               (player['Otras Posiciones'] && player['Otras Posiciones'].toLowerCase().includes('extremo')) ? 'Sí' : 'No';
    }
    if (lowerQuestion.includes('lateral')) {
        return player['Posición Principal'].toLowerCase().includes('lateral') || 
               (player['Otras Posiciones'] && player['Otras Posiciones'].toLowerCase().includes('lateral')) ? 'Sí' : 'No';
    }
    
    // Check for achievements
    if (lowerQuestion.includes('mundial')) {
        return player['Hitos Destacados'] && player['Hitos Destacados'].toLowerCase().includes('mundial') ? 'Sí' : 'No';
    }
    if (lowerQuestion.includes('champions')) {
        return player['Hitos Destacados'] && player['Hitos Destacados'].toLowerCase().includes('champions') ? 'Sí' : 'No';
    }
    if (lowerQuestion.includes('eurocopa')) {
        return player['Hitos Destacados'] && player['Hitos Destacados'].toLowerCase().includes('eurocopa') ? 'Sí' : 'No';
    }
    if (lowerQuestion.includes('balon de oro') || lowerQuestion.includes('balón de oro')) {
        return player['Hitos Destacados'] && player['Hitos Destacados'].toLowerCase().includes('balón de oro') ? 'Sí' : 'No';
    }
    
    // Default response when question is not understood
    return 'No estoy seguro';
}

// Show guess screen
function showGuessScreen() {
    // Show the guess input area
    document.getElementById('game-area').style.display = 'none';
    document.getElementById('guess-area').style.display = 'block';
    document.getElementById('final-guess-input').focus();
}

// Submit final guess
function submitGuess() {
    const guessInput = document.getElementById('final-guess-input');
    const guess = guessInput.value.trim().toLowerCase();
    
    if (!guess) {
        alert('Por favor, escribe el nombre del futbolista');
        return;
    }
    
    const secretPlayerName = currentGame.secretPlayer.Nombre.toLowerCase();
    
    // Check if the guess is correct (allowing some flexibility)
    currentGame.guessedCorrectly = guess === secretPlayerName || 
                                    secretPlayerName.includes(guess) ||
                                    guess.includes(secretPlayerName);
    
    showResult();
}

// Allow Enter key to submit
function handleQuestionKeyPress(event) {
    if (event.key === 'Enter') {
        submitQuestion();
    }
}

function handleGuessKeyPress(event) {
    if (event.key === 'Enter') {
        submitGuess();
    }
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
    showGuessScreen();
}

// Mostrar resultado
function showResult() {
    showScreen('result-screen');
    
    const player = currentGame.secretPlayer;
    const won = currentGame.guessedCorrectly;
    
    document.getElementById('result-icon').textContent = won ? '🎉' : '😢';
    document.getElementById('result-title').textContent = won ? '¡Correcto! ¡Lo adivinaste!' : '¡No es correcto!';
    
    document.getElementById('player-name').textContent = player.Nombre;
    document.getElementById('player-age').textContent = player.Edad;
    document.getElementById('player-position').textContent = player["Posición Principal"];
    document.getElementById('player-club').textContent = player["Club Actual"];
    document.getElementById('player-league').textContent = player["Liga Actual"];
    document.getElementById('player-achievements').textContent = player["Hitos Destacados"] || 'N/A';
    
    // Add nationality if available
    const nationalityElement = document.getElementById('player-nationality');
    if (nationalityElement) {
        nationalityElement.textContent = player["Nacionalidad"] || 'N/A';
    }
    
    document.getElementById('questions-used').textContent = currentGame.currentQuestion;
}

// Reiniciar el juego
function restartGame() {
    currentGame = {
        difficulty: null,
        maxQuestions: 0,
        currentQuestion: 0,
        secretPlayer: null,
        questionHistory: [],
        guessedCorrectly: false
    };
    
    // Reset game area visibility
    const gameArea = document.getElementById('game-area');
    const guessArea = document.getElementById('guess-area');
    if (gameArea) gameArea.style.display = 'block';
    if (guessArea) guessArea.style.display = 'none';
    
    showScreen('start-screen');
}

// Cargar jugadores al iniciar
document.addEventListener('DOMContentLoaded', function() {
    loadPlayers();
});