import { makeGameBoard, resetGameState, currentUser } from './game-utils.js';

// DOM Elements
const giveUpButton = document.getElementById('give-up');
const resetGameButton = document.getElementById('reset-game');
const newGameButton = document.getElementById('new-game');
const difficultyLevelDisplay = document.getElementById('difficulty-level');
const gameBoard = document.querySelector('#game-board');

// Audio Elements
var pageAudio = document.getElementById('page-open-audio');
pageAudio.volume = 0.2;
pageAudio.play();

// Rendered Elements
difficultyLevelDisplay.textContent = `difficulty level: ${currentUser.game}`;

// Click Handlers
giveUpButton.addEventListener('click', () => {
    resetGameButton.style.display = 'block';
    newGameButton.style.display = 'block';
    giveUpButton.style.display = 'none';
    gameBoard.classList.add('noClick');
    const cards = gameBoard.querySelectorAll('.card');
    setTimeout(() => {
        gameBoard.classList.remove('noClick');
        for (let card of cards) {
            card.classList.add('is-flipped', 'noClick');
        }
    }, 2000);

});

resetGameButton.addEventListener('click', () => {
    resetGameState();
    makeGameBoard();
    resetGameButton.style.display = 'none';
    newGameButton.style.display = 'none';
    giveUpButton.style.display = 'block';

    const restartAudio = document.querySelector('#restart-audio');
    restartAudio.volume = 0.1;
    restartAudio.play();
});

newGameButton.addEventListener('click', () => {
    window.location = '../index.html';
});

// Called Functions
makeGameBoard();
