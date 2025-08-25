// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  const board = document.getElementById('board');
  const movesDisplay = document.getElementById('moves');
  const timerDisplay = document.getElementById('timer');
  const bestTimeDisplay = document.getElementById('best-time');
  const message = document.getElementById('message');
  const restartBtn = document.getElementById('restart');
  const startBtn = document.getElementById('start-game');

  const symbols = ['🍎','🍌','🍇','🍓','🍉','🍒','🥝','🍍'];
  let cardsArray = [...symbols, ...symbols];
  let flippedCards = [];
  let matched = 0;
  let moves = 0;
  let timer;
  let totalSeconds = 0;
  let gameStarted = false;
  let bestTime = null;

  function shuffle(array) {
    for (let i = array.length -1; i>0; i--) {
      const j = Math.floor(Math.random() * (i+1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function startTimer() {
    timer = setInterval(() => {
      totalSeconds++;
      let mins = Math.floor(totalSeconds/60);
      let secs = totalSeconds%60;
      timerDisplay.textContent = `${mins}:${secs.toString().padStart(2,'0')}`;
    },1000);
  }

  function stopTimer() { clearInterval(timer); }

  function createBoard() {
    board.innerHTML = '';
    shuffle(cardsArray).forEach(symbol => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <div class="card-inner">
          <div class="card-front">?</div>
          <div class="card-back">${symbol}</div>
        </div>
      `;
      card.addEventListener('click', () => flipCard(card));
      board.appendChild(card);
    });
  }

  function flipCard(card) {
    if (!gameStarted) return;
    if (card.classList.contains('flip') || flippedCards.length === 2) return;

    card.classList.add('flip');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
      moves++;
      movesDisplay.textContent = moves;
      checkMatch();
    }
  }

  function checkMatch() {
    const [card1, card2] = flippedCards;
    const symbol1 = card1.querySelector('.card-back').textContent;
    const symbol2 = card2.querySelector('.card-back').textContent;

    if (symbol1 === symbol2) {
      matched += 2;
      flippedCards = [];

      if (matched === cardsArray.length) {
        stopTimer();
        message.style.display = 'block';
        updateBestTime();
      }
    } else {
      setTimeout(() => {
        card1.classList.remove('flip');
        card2.classList.remove('flip');
        flippedCards = [];
      },800);
    }
  }

  function updateBestTime() {
    if (bestTime === null || totalSeconds < bestTime) {
      bestTime = totalSeconds;
      let mins = Math.floor(bestTime/60);
      let secs = bestTime%60;
      bestTimeDisplay.textContent = `${mins}:${secs.toString().padStart(2,'0')}`;
    }
  }

  function startGame() {
    gameStarted = true;
    startBtn.style.display = 'none';
    board.style.display = 'grid';
    restartBtn.style.display = 'inline-block';
    resetGame();
  }

  function resetGame() {
    matched = 0;
    moves = 0;
    movesDisplay.textContent = moves;
    totalSeconds = 0;
    timerDisplay.textContent = '0:00';
    message.style.display = 'none';
    flippedCards = [];
    clearInterval(timer);
    startTimer();
    createBoard();
  }

  startBtn.addEventListener('click', startGame);
  restartBtn.addEventListener('click', resetGame);
});
