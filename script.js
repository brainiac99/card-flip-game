"use strict";

const overlays = document.querySelectorAll(`[class^="overlay"]`);
const cards = document.querySelectorAll(".card");

class AudioController {
  constructor() {
    this.bgMusic = new Audio("Assets/Audio/creepy.mp3");
    this.flip = new Audio("Assets/Audio/flip.wav");
    this.match = new Audio("Assets/Audio/match.wav");
    this.victory = new Audio("Assets/Audio/victory.wav");
    this.gameOver = new Audio("Assets/Audio/gameover.wav");
    this.bgMusic.volume = 0.5;
    this.bgMusic.loop = true;
  }
  startMusic() {
    this.bgMusic.play();
  }
  stopMusic() {
    this.bgMusic.pause();
    this.bgMusic.currentTime = 0;
  }
  flipSound() {
    this.flip.play();
  }
  matchSound() {
    this.match.play();
  }
  victorySound() {
    this.stopMusic();
    this.victory.play();
  }
  gameOverSound() {
    this.stopMusic();
    this.gameOver.play();
  }
}

class Game {
  constructor(totalTime, cards) {
    this.cardsArray = cards;
    this.totalTime = totalTime;
    this.timeRemaining = totalTime;
    this.timer = document.querySelector(".time-remaining");
    this.flips = document.querySelector(".flips-count");
    this.ac = new AudioController();
  }
  startGame() {
    this.cardToCheck = null;
    this.totalFlips = 0;
    this.timeRemaining = this.totalTime;
    this.matchedCards = [];
    this.busy = true;

    setTimeout(() => {
      this.ac.startMusic();
      this.shuffleCards();
      this.countDown = this.startCountDown();
      this.busy = false;
    }, 500);
    this.hideCards();
    this.timer.innerText = this.timeRemaining;
    this.flips.innerText = this.totalFlips;
  }
  hideCards() {
    this.cardsArray.forEach((card) => {
      card.classList.remove("visible");
      card.classList.remove("matched");
    });
  }
  canFlip(card) {
    return (
      !this.busy &&
      this.cardToCheck !== card &&
      !this.matchedCards.includes(card)
    );
  }
  flipCard(card) {
    if (this.canFlip(card)) {
      this.ac.flipSound();
      this.totalFlips++;
      this.flips.innerText = this.totalFlips;
      card.classList.add("visible");

      if (this.cardToCheck) {
        this.checkForMatch(card);
      } else this.cardToCheck = card;
    }
  }
  checkForMatch(card) {
    if (this.getCardType(card) === this.getCardType(this.cardToCheck)) {
      this.cardMatch(card, this.cardToCheck);
    } else {
      this.cardMismatch(card, this.cardToCheck);
    }
    this.cardToCheck = null;
  }
  cardMatch(card1, card2) {
    this.matchedCards.push(card1);
    this.matchedCards.push(card2);
    card1.classList.add("matched");
    card2.classList.add("matched");
    this.ac.matchSound();
    if (this.matchedCards.length === this.cardsArray.length) this.victory();
  }
  cardMismatch(card1, card2) {
    this.busy = true;
    setTimeout(() => {
      card1.classList.remove("visible");
      card2.classList.remove("visible");
      this.busy = false;
    }, 1000);
  }
  getCardType(card) {
    return card.querySelector(".value").src;
  }
  shuffleCards() {
    for (let i = this.cardsArray.length - 1; i > 0; i--) {
      let randIndex = Math.floor(Math.random() * (i + 1));
      this.cardsArray[randIndex].style.order = i;
      this.cardsArray[i].style.order = randIndex;
    }
  }
  startCountDown() {
    return setInterval(() => {
      this.timeRemaining--;
      this.timer.innerText = this.timeRemaining;
      if (this.timeRemaining === 0) this.gameOver();
    }, 1000);
  }
  gameOver() {
    clearInterval(this.countDown);
    this.ac.gameOverSound();
    document.querySelector(".overlay-game-over").classList.add("visible");
  }
  victory() {
    clearInterval(this.countDown);
    this.ac.victorySound();
    document.querySelector(".overlay-win").classList.add("visible");
  }
}

overlays.forEach((overlay) =>
  overlay.addEventListener("click", () => {
    overlay.classList.remove("visible");
    game.startGame();
  })
);

cards.forEach((card) => {
  card.addEventListener("click", () => {
    game.flipCard(card);
  });
});

const game = new Game(100, cards);
