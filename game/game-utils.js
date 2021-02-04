import cardDeck from '../data.js';
import { getCurrentUser, saveUsers, getUsers } from '../utils.js';

// DOM Elements
const tryCountDisplay = document.getElementById('try-count');
const displayWrapper = document.getElementById('display-wrapper');
const giveUpButton = document.getElementById('give-up');
const resetGameButton = document.getElementById('reset-game');
const gameBoard = document.querySelector('#game-board');

// Game Constants
export const currentUser = getCurrentUser();
const cardPairs = setGameSize();

// Game State
let matched = 0;
let tryCount = 0;
let clicked = [];

function flipCard() {
    this.classList.toggle('is-flipped');
    const audio = document.querySelector('#flip-audio');
    audio.volume = 0.1;
    audio.play();
    clicked.push(this);
    if (clicked.length === 2) {
        gameBoard.classList.add('noClick');
        tryCount++;
        tryCountDisplay.textContent = `try count: ${tryCount}`;

        const clicked1Id = clicked[0].value;
        const clicked2Id = clicked[1].value;
        if (clicked1Id === clicked2Id) {
            clicked[0].classList.add('noClick');
            clicked[1].classList.add('noClick');

            gameBoard.classList.remove('noClick');
            matched++;

            const matchedAudio = document.querySelector('#match-audio');
            matchedAudio.volume = 0.08;
            matchedAudio.currentTime = 0;
            matchedAudio.play();

            checkEndGame();
            clicked = [];
        } else {
            resetGameButton.classList.add('noClick');
            setTimeout(() => {
                clicked[0].classList.toggle('is-flipped');
                clicked[1].classList.toggle('is-flipped');
                gameBoard.classList.remove('noClick');
                resetGameButton.classList.remove('noClick');
                clicked = [];
            }, 2000);
        }
    }
}

// Exported Functions
export function makeGameBoard() {
    const shuffledDeck = makeShuffledDeck();
    for (let card of shuffledDeck) {
        const cardOnBoard = renderCard(card);
        gameBoard.append(cardOnBoard);
    }
}


export function resetGameState() {
    gameBoard.textContent = '';
    tryCount = 0;
    matched = 0;
    clicked = [];
    tryCountDisplay.textContent = `try count: ${tryCount}`;
}

// Game Utility Functions
function setGameSize() {
    const difficulty = currentUser.game;
    if (difficulty === 'easy') {
        return 6;
    } else if (difficulty === 'medium') {
        return 12;
    } else {
        return 24;
    }
}

function makeShuffledDeck() {
    const copiedDeck = cardDeck.slice();
    copiedDeck.sort(function (a, b) { return 0.5 - Math.random(); });  // chooses random cards
    const halfDeck = copiedDeck.splice(0, cardPairs);
    const fullDeck = halfDeck.concat(halfDeck);
    const shuffledDeck = fullDeck.sort(function (a, b) { return 0.5 - Math.random(); });
    return shuffledDeck;
}

function checkEndGame() {
    if (matched === cardPairs) {
        const winAudio = document.querySelector('#win-audio');
        winAudio.volume = 0.2;
        winAudio.play();

        const winMessage = document.createElement('p');
        winMessage.textContent = `Well done, you have completed level ${currentUser.game} in ${tryCount} turns`;
        giveUpButton.style.display = 'none';
        const resultsButton = document.createElement('button');
        resultsButton.textContent = 'view high scores';
        resultsButton.addEventListener('click', () => {
            window.location = '../results/index.html';
        });

        displayWrapper.textContent = '';
        displayWrapper.append(winMessage, resultsButton);
        const updatedUsersArray = setUserScore();
        saveUsers(updatedUsersArray);
    }
}

function setUserScore() {
    const currentUsersArray = getUsers();
    for (let user of currentUsersArray) {
        if (user.name === currentUser.name) {
            user.levels[currentUser.game].push(tryCount);
        }
    }
    return currentUsersArray;
}

export function renderCard(card) {
    const cardDivWrapper = document.createElement('div');
    cardDivWrapper.classList.add('game-card');

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    cardDiv.id = 'card';
    cardDiv.value = card.id;
    cardDivWrapper.append(cardDiv);
    cardDiv.addEventListener('click', flipCard);

    const frontImg = document.createElement('img');
    frontImg.src = `../assets/cards/${card.img}`;
    frontImg.classList.add('card-face', 'card-front');
    cardDiv.append(frontImg);

    const backImg = document.createElement('img');
    backImg.src = `../assets/cards/mock-up-back.png`;  // switch to new image assets name
    backImg.classList.add('card-face', 'card-back');
    cardDiv.append(backImg);

    return cardDivWrapper;
}