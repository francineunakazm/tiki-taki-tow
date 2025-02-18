var currentPlayer = 'player';
var isAiGame = false;
let round = 0;
let p1score = 0;
let p2score = 0;
let aiscore = 0;
let drawscore = 0;

// Declare Computer AI selectedDifficulty variable globally
var selectedDifficulty;
var opponent_Name;

// GETTING THE PHP SESSION VARIABLES AND PUTTING IT ON JAVASCRIPT VARIABLE
// Accessing the hidden input field values
var userName = document.getElementById("userName").value;
var playerID = document.getElementById("playerID").value;

// Now you can use these JavaScript variables in your JavaScript code
console.log("Player ID is " + playerID);
console.log("Player Name is " + userName);

// SOUND EFFECTS
var winRound = new Audio('music/win.mp3');
var playerplace = new Audio('music/place.mp3');
var opponentplace = new Audio('music/opponent_place.mp3');
var lose = new Audio('music/lose.mp3');
var bg = new Audio('music/background.mp3')
bg.volume = 0.2;

hideBoard();

var isMusicOn = false;
var musicElement = document.getElementById("music");

function music() {
    isMusicOn = !isMusicOn;

    if (isMusicOn) {
        musicElement.innerHTML = "Music On";
        bg.play();
    } else {
        musicElement.innerHTML = "Music Off";
        bg.pause();
    }
}

function okGame() {
  var opponentRadio = document.querySelector('input[name="opponent"]:checked');
  if (document.querySelector('input[value="player"]:checked')) {
    document.getElementById("select").style.display = "none";
    document.getElementById("ticTacToeGrid").style.display = "table";
    document.getElementById("back").style.display = "inline-block";
    document.getElementById("resetB").style.display = "inline-block";
    showBoard();
    displayPlayerTurn();
    openPopup("First to Get 5 Points, Wins!");
    document.getElementById("player1score").style.marginBottom = "-15px";
  } else if (document.querySelector('input[value="ai"]:checked')) {
    isAiGame = true;
    opponentRadio.value = 'ai';
    document.getElementById("group").style.display = "none";
    document.getElementById("select").style.display = "none";
    document.getElementById("difficultyForm").style.display = "flex";
    document.getElementById("back").style.display = "inline-block";
  } else {
    // alert("Please select an opponent before starting the game.");
    openPopup("Please select an opponent before starting the game.");
  }
}

function startGame() {
  var difficultyRadio = document.querySelector('input[name="difficulty"]:checked');
  // Use the selected difficulty value as needed
  selectedDifficulty = difficultyRadio.value;

  if (difficultyRadio) {
    document.getElementById("difficultyForm").style.display = "none";
    document.getElementById("ticTacToeGrid").style.display = "table";
    document.getElementById("backAi").style.display = "inline-block";
    document.getElementById("resetB").style.display = "inline-block";
    document.getElementById("back").style.display = "none";
    showBoard();
    displayPlayerTurn();
    openPopup("First to Get 5 Points, Wins!");
    document.getElementById("player2score").style.display = "none";
    document.getElementById("player1score").style.marginBottom = "-15px";
    if (isAiGame) {
      currentPlayer = 'player';
    }
  } else {
    // alert("Please select a difficulty level before starting the game.");
    openPopup("Please select a difficulty level before starting the game.");
  }
}

function makeMove(cell) {
  if (cell.innerHTML === '') {
    if (currentPlayer === 'player') {
      cell.innerHTML = 'X';
      // Use the selected difficulty value as needed
      opponent_Name = "Computer AI: "+ selectedDifficulty;
      console.log("Selected difficulty:", opponent_Name); //Check Opponent Name via Console

      if(isMusicOn == true){
        playerplace.play();
      }
      if (checkWin('X')) {
        const scoreadd = ++p1score;
        const roundadd = ++round;
        document.getElementById("scores").innerHTML = `X - ${scoreadd} | O - ${p2score} | Draw - ${drawscore}`;
        document.getElementById("rounds").innerHTML = `Rounds No: ${roundadd}`;
        displayPlayerTurn();
        if (p1score > 4) {
          // AFTER WIN RECORD THE GAME RESULT IN TO THE DATABASE
          recordGameResult(playerID, userName, opponent_Name, p1score, aiscore, userName);
          console.log(playerID, userName, opponent_Name, p1score, aiscore, userName);

          // ADD MUSIC
          if(isMusicOn == true){
            winRound.play();
          }
          setTimeout(function() {
            openPopup("Player 1 (X) Wins The Game!", function() {
              setTimeout(function(){
                goHome();
              },200);
            });
        }, 200);
      } else if (p1score < 5) {
          openPopup("Player 1 (X) Wins The Round!", function() {
            setTimeout(function() {resetBoard();}, 200);
          });
      }
      } else if (checkDraw()) {
          openPopup("WE HAVE A DRAW!", function(){
            setTimeout(function() {resetBoard();}, 200);
          });
      } else {
        currentPlayer = isAiGame ? 'ai' : 'player2';
        if (isAiGame && currentPlayer === 'ai') {
          makeAiMove();
        } else {
          displayPlayerTurn(); // Display turn for player2
        }
      }
    } else if (currentPlayer === 'player2') {
      cell.innerHTML = 'O';
      if(isMusicOn == true){
        opponentplace.play();
      }
      if (checkWin('O')) {
        const scoreadd = ++p2score;
        const roundadd = ++round;
        document.getElementById("scores").innerHTML = `X - ${p1score} | O - ${[scoreadd]} | Draw - ${drawscore}`;
        document.getElementById("rounds").innerHTML = `Rounds No: ${roundadd}`;
        displayPlayerTurn();
        if (p2score > 4) {
          if(isMusicOn == true){
            winRound.play();
          }
          setTimeout(function() {
            openPopup("Player 2 (O) Wins The Game!", function() {
              // Code to execute after pop-up is closed
              setTimeout(function(){
                  goHome();
              },200);
            });
        }, 200);
        } else if (p2score < 5) { 
            openPopup("Player 2 (O) Wins The Round!", function() {
              // Code to execute after pop-up is closed
              setTimeout(function() {resetBoard();}, 200);
              currentPlayer = 'player';
              displayPlayerTurn(); 
            });
        }
      }else if (checkDraw()){ //If the Game is draw
        const scoreadd = ++drawscore;
        const roundadd = ++round;
        document.getElementById("scores").innerHTML = `X - ${p1score} | O - ${[p2score]} | Draw - ${scoreadd}`;
        document.getElementById("rounds").innerHTML = `Rounds No: ${roundadd}`;
        openPopup("WE HAVE A DRAW!", function(){
          setTimeout(function() {resetBoard();}, 200);
        });
      }
       else {
        currentPlayer = 'player';
      } displayPlayerTurn(); 
    } else if (currentPlayer === 'ai') {
      cell.innerHTML = 'O';
      displayPlayerTurn(); 
    }
  }
}

function checkWinAi() {
  if (checkWin('O')) {
    const scoreadd = ++aiscore;
    const roundadd = ++round;
    document.getElementById("rounds").innerHTML = `Rounds No: ${roundadd}`;
    document.getElementById("scores").innerHTML = `X - ${p1score} | O - ${scoreadd} | Draw - ${drawscore}`;
    displayPlayerTurn();
    if (aiscore > 4) {
      // AFTER WIN RECORD THE GAME RESULT IN TO THE DATABASE
      recordGameResult(playerID, userName, opponent_Name, p1score, aiscore, opponent_Name);
      console.log(playerID, userName, opponent_Name, p1score, aiscore, opponent_Name);

      // ADD MUSIC
      if(isMusicOn == true){
        lose.play();
      }
      setTimeout(function() {
        openPopup("COMPUTER AI (O) Wins The Game!", function() {
          setTimeout(function() {
              goHome();
          },200);
        });
    }, 200);

    } else if (aiscore < 5) {
          // alert('AI Wins The Round');
          setTimeout(function() {
            openPopup("COMPUTER AI (O) Wins The Round!", function() {
              // Code to execute after pop-up is closed
              setTimeout(function() {resetBoard();},200);
            });
        }, 200);
    }
  }else if (checkDraw()){ 
    const scoreadd = ++drawscore;
    const roundadd = ++round;
    document.getElementById("scores").innerHTML = `X - ${p1score} | O - ${[aiscore]} | Draw - ${scoreadd}`;
    document.getElementById("rounds").innerHTML = `Rounds No: ${roundadd}`;
    openPopup("WE HAVE A DRAW!", function(){
      // Code to execute after pop-up is closed
      setTimeout(function() {resetBoard();}, 200);
    });
  }
   else { 
    currentPlayer = 'player';
  }
  displayPlayerTurn();
}

function hideBoard() {
  document.getElementById("scores").style.display = "none";
  document.getElementById("rounds").style.display = "none";
}

function showBoard() {
  document.getElementById("scores").style.display = "flex";
  document.getElementById("rounds").style.display = "flex";
  document.getElementById("group").style.display = "none";
  document.getElementsByClassName("image-container")[0].style.marginBottom = "-5px";
  document.getElementsByClassName("image-container")[0].style.width = "400px";
}

function showAiBoard() {
  document.getElementById("ticTacToeGrid").style.display = "none";
  document.getElementById("difficultyForm").style.display = "flex";
  document.getElementById("backAi").style.display = "none";
  document.getElementById("resetB").style.display = "none";
  document.getElementById("group").style.display = "none";
  document.getElementById("back").style.display = "flex";
  hideBoard();
}

function resetBoard() {
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 6; col++) {
      document.getElementById(`ticTacToeGrid`).rows[row].cells[col].innerHTML = '';
    }
  }
  // Switch back to Player 1 - X
  currentPlayer = 'player';
}

function displayPlayerTurn() {
  var turnElement = document.getElementById("playerTurn");
  if (currentPlayer === 'player') {
    turnElement.textContent = "Player 1's Turn (X)";
  } else if (currentPlayer === 'player2') {
    turnElement.textContent = "Player 2's Turn (O)";
  } else if (currentPlayer === 'ai') {
    turnElement.textContent = "AI's Turn (O)";
  }
}

function checkWin(playerSymbol) {
  // Check for horizontal win (6 in a row)
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 1; col++) {
      if (
        document.getElementById(`ticTacToeGrid`).rows[row].cells[col].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row].cells[col + 1].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row].cells[col + 2].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row].cells[col + 3].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row].cells[col + 4].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row].cells[col + 5].innerHTML === playerSymbol
      ) {
        return true;
      }
    }
  }

  // Check for vertical win (5 in a row)
  for (let row = 0; row < 1; row++) {
    for (let col = 0; col < 6; col++) {
      if (
        document.getElementById(`ticTacToeGrid`).rows[row].cells[col].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 1].cells[col].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 2].cells[col].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 3].cells[col].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 4].cells[col].innerHTML === playerSymbol
      ) {
        return true;
      }
    }
  }

  // Check for diagonal win (5 in a row)
  for (let row = 0; row < 1; row++) {
    for (let col = 0; col < 1; col++) {
      if (
        document.getElementById(`ticTacToeGrid`).rows[row].cells[col].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 1].cells[col + 1].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 2].cells[col + 2].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 3].cells[col + 3].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 4].cells[col + 4].innerHTML === playerSymbol
      ) {
        return true;
      } else if (
        document.getElementById(`ticTacToeGrid`).rows[row].cells[col + 4].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 1].cells[col + 3].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 2].cells[col + 2].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 3].cells[col + 1].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 4].cells[col].innerHTML === playerSymbol
      ) {
        return true;

      } else if (
        document.getElementById(`ticTacToeGrid`).rows[row].cells[col + 1].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 1].cells[col + 2].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 2].cells[col + 3].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 3].cells[col + 4].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 4].cells[col + 5].innerHTML === playerSymbol
      ) {
        return true;

      } 
       else if (
        document.getElementById(`ticTacToeGrid`).rows[row].cells[col + 5].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 1].cells[col + 4].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 2].cells[col + 3].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 3].cells[col + 2].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 4].cells[col + 1].innerHTML === playerSymbol
      ) {
        return true;

      } 
      
      // Check for diagonal win (4 in a row)
      else if (
        document.getElementById(`ticTacToeGrid`).rows[row + 1].cells[col].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 2].cells[col + 1].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 3].cells[col + 2].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 4].cells[col + 3].innerHTML === playerSymbol
      ) {
        return true;
      } else if (
        document.getElementById(`ticTacToeGrid`).rows[row].cells[col + 2].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 1].cells[col + 3].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 2].cells[col + 4].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 3].cells[col + 5].innerHTML === playerSymbol
      ) {
        return true;
      } else if (
        document.getElementById(`ticTacToeGrid`).rows[row].cells[col + 2].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 1].cells[col + 3].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 2].cells[col + 4].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 3].cells[col + 5].innerHTML === playerSymbol
      ) {
        return true;
      } else if (
        document.getElementById(`ticTacToeGrid`).rows[row].cells[col + 2].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 1].cells[col + 3].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 2].cells[col + 4].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 3].cells[col + 5].innerHTML === playerSymbol
      ) {
        return true;
      } else if (
        document.getElementById(`ticTacToeGrid`).rows[row].cells[col + 3].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 1].cells[col + 2].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 2].cells[col + 1].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 3].cells[col].innerHTML === playerSymbol
      ) {
        return true;
      } else if (
        document.getElementById(`ticTacToeGrid`).rows[row + 1].cells[col + 5].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 2].cells[col + 4].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 3].cells[col + 3].innerHTML === playerSymbol &&
        document.getElementById(`ticTacToeGrid`).rows[row + 4].cells[col + 2].innerHTML === playerSymbol
      ) {
        return true;
      }
    }
  }

    // Check for diagonal win (2 in a row)
    for (let row = 0; row < 1; row++) {
      for (let col = 0; col < 1; col++) {
        if (
          document.getElementById(`ticTacToeGrid`).rows[row + 1].cells[col].innerHTML === playerSymbol &&
          document.getElementById(`ticTacToeGrid`).rows[row].cells[col + 1].innerHTML === playerSymbol
        ) {
          return true;
        } else if (
          document.getElementById(`ticTacToeGrid`).rows[row + 3].cells[col].innerHTML === playerSymbol &&
          document.getElementById(`ticTacToeGrid`).rows[row + 4].cells[col + 1].innerHTML === playerSymbol
        ) {
          return true;
        } else if (
          document.getElementById(`ticTacToeGrid`).rows[row].cells[col + 4].innerHTML === playerSymbol &&
          document.getElementById(`ticTacToeGrid`).rows[row + 1].cells[col + 5].innerHTML === playerSymbol
        ) {
          return true;
        } else if (
          document.getElementById(`ticTacToeGrid`).rows[row  + 3].cells[col + 5].innerHTML === playerSymbol &&
          document.getElementById(`ticTacToeGrid`).rows[row + 4].cells[col + 4].innerHTML === playerSymbol
        ) {
          return true;

        // Check for diagonal win (3 in a row)
        } else if (
          document.getElementById(`ticTacToeGrid`).rows[row].cells[col + 3].innerHTML === playerSymbol &&
          document.getElementById(`ticTacToeGrid`).rows[row + 1].cells[col + 4].innerHTML === playerSymbol &&
          document.getElementById(`ticTacToeGrid`).rows[row + 2].cells[col + 5].innerHTML === playerSymbol         
        ) {
          return true;
        } else if (
          document.getElementById(`ticTacToeGrid`).rows[row].cells[col + 2].innerHTML === playerSymbol &&
          document.getElementById(`ticTacToeGrid`).rows[row + 1].cells[col + 1].innerHTML === playerSymbol &&
          document.getElementById(`ticTacToeGrid`).rows[row + 2].cells[col].innerHTML === playerSymbol         
        ) {
          return true;
        } else if (
          document.getElementById(`ticTacToeGrid`).rows[row + 2].cells[col].innerHTML === playerSymbol &&
          document.getElementById(`ticTacToeGrid`).rows[row + 3].cells[col + 1].innerHTML === playerSymbol &&
          document.getElementById(`ticTacToeGrid`).rows[row + 4].cells[col + 2].innerHTML === playerSymbol         
        ) {
          return true;
        }  else if (
          document.getElementById(`ticTacToeGrid`).rows[row + 2].cells[col + 5].innerHTML === playerSymbol &&
          document.getElementById(`ticTacToeGrid`).rows[row + 3].cells[col + 4].innerHTML === playerSymbol &&
          document.getElementById(`ticTacToeGrid`).rows[row + 4].cells[col + 3].innerHTML === playerSymbol         
        ) {
          return true;
        } 
      }
    }

  return false;
}

// CHECK IF IT IS DRAW or TIE
function checkDraw() {
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 6; col++) {
      if (document.getElementById(`ticTacToeGrid`).rows[row].cells[col].innerHTML === '') {
        return false; // If any cell is empty, the game is not a draw
      }
    }
  }
  return true;
}

function makeAiMove() {
  if (document.querySelector('input[value="Easy"]:checked')) {
    displayPlayerTurn();
    setTimeout(function() {
    makeRandomMove();
  }, 60);
  } else if (document.querySelector('input[value="Difficult"]:checked')) {
    displayPlayerTurn();
    makeMediumMove();
  } else if (document.querySelector('input[value="Expert"]:checked')) {
    displayPlayerTurn();
    makeHardMove();
  }
}

function makeRandomMove() {
  var emptyCells = document.querySelectorAll('td:empty');
  if (emptyCells.length) {
    var randomIndex = Math.floor(Math.random() * emptyCells.length);
    var selectedCell = emptyCells[randomIndex];

    if (selectedCell.innerHTML === '') {
      selectedCell.innerHTML = 'O';
      currentPlayer = 'player';
      displayPlayerTurn();
    } checkWinAi();
  }
}

function makeMediumMove() {
  var currentPlayerSymbol = 'O';
  var opponentPlayerSymbol = 'X';

  // Check if the opponent is about to win
  var blockingMove = findBlockingMove(opponentPlayerSymbol);

  // Randomly determine whether to block or win
  var blockChance = Math.random();
  var winChance = Math.random();

  if (blockingMove && blockChance < 0.8) {
    setTimeout(function () {
      blockingMove.innerHTML = currentPlayerSymbol;
      currentPlayer = 'player';
      displayPlayerTurn();
      checkWinAi();
    }, 100);
  } else {
    // Shuffle the empty cells
    var emptyCells = Array.from(document.querySelectorAll('td:empty'));
    shuffleArray(emptyCells);

    // Randomly prioritize winning moves
    var winningMove = null;

    emptyCells.forEach(cell => {
      cell.innerHTML = currentPlayerSymbol;

      if (checkWin(currentPlayerSymbol) && winChance < 0.6) {
        winningMove = cell;
      }

      cell.innerHTML = '';
    });

    // If there's a winning move, play it
    if (winningMove) {
      setTimeout(function () {
        winningMove.innerHTML = currentPlayerSymbol;
        currentPlayer = 'player';
        displayPlayerTurn();
        checkWinAi();
      }, 100);
    } else {

      // Use minimax with shuffled cells for blocking moves
      var bestScore = -Infinity;
      var bestMove;

      emptyCells.forEach(cell => {
        cell.innerHTML = currentPlayerSymbol;
        var score = minimax(0, false, currentPlayerSymbol, opponentPlayerSymbol);
        cell.innerHTML = '';

        if (score > bestScore) {
          bestScore = score;
          bestMove = cell;
        }
      });

      // Play the best blocking move
      if (bestMove) {
        setTimeout(function () {
          bestMove.innerHTML = currentPlayerSymbol;
          currentPlayer = 'player';
          displayPlayerTurn();
          checkWinAi();
        }, 100);
      }
    }
  }
}

function makeHardMove() {
  var currentPlayerSymbol = 'O';
  var opponentPlayerSymbol = 'X';

  // Check if the opponent is about to win
  var blockingMove = findBlockingMove(opponentPlayerSymbol);

  if (blockingMove) {
    setTimeout(function () {
      blockingMove.innerHTML = currentPlayerSymbol;
      currentPlayer = 'player';
      displayPlayerTurn();
    }, 100);
  } else {
    // Shuffle the empty cells
    var emptyCells = Array.from(document.querySelectorAll('td:empty'));
    shuffleArray(emptyCells);

    // Use minimax with shuffled cells
    var bestScore = -Infinity;
    var bestMove;
    emptyCells.forEach(cell => {
      cell.innerHTML = currentPlayerSymbol;
      var score = minimax(0, false, currentPlayerSymbol, opponentPlayerSymbol);
      cell.innerHTML = '';
      if (score > bestScore) {
        bestScore = score;
        bestMove = cell;
      }
    });
    if (bestMove) {
      setTimeout(function () {
        bestMove.innerHTML = currentPlayerSymbol;
        currentPlayer = 'player';
        displayPlayerTurn();
        checkWinAi();
      }, 100);
    }
  }
}

function minimax(depth, isMaximizing, currentPlayerSymbol, opponentPlayerSymbol) {
  if (depth > 0) {
    return 0;
  }
  if (checkWin(currentPlayerSymbol)) {
    return 1;
  } else if (checkWin(opponentPlayerSymbol)) {
    return -1;
  } else if (checkDraw()) {
    return 0;
  }
  if (isMaximizing) {
    var bestScore = -Infinity;
    document.querySelectorAll('td:empty').forEach(cell => {
      if (cell.innerHTML === '') {
        cell.innerHTML = currentPlayerSymbol;
        var score = minimax(depth + 1, false, currentPlayerSymbol, opponentPlayerSymbol);
        cell.innerHTML = '';

        // Prioritize winning moves
        if (score === 1) {
          score -= 0.5;
        }
        bestScore = Math.max(bestScore, score);
      }
    });
    return bestScore;
  } else {
    var bestScore = Infinity;
    document.querySelectorAll('td:empty').forEach(cell => {
      if (cell.innerHTML === '') {
        cell.innerHTML = opponentPlayerSymbol;
        var score = minimax(depth + 1, !isMaximizing, currentPlayerSymbol, opponentPlayerSymbol);
        cell.innerHTML = '';
        
        // Prioritize blocking moves
        if (score === 0) {
          score -= 0.6;
        }
        bestScore = Math.min(bestScore, score);
      }
    });
    return bestScore;
  }
}

function findBlockingMove(opponentPlayerSymbol) {
  // Check each empty cell to see if it blocks opponent from winning
  var blockingMove = null;
  document.querySelectorAll('td:empty').forEach(cell => {
    cell.innerHTML = opponentPlayerSymbol;
    if (checkWin(opponentPlayerSymbol)) {
      blockingMove = cell;
    }
    cell.innerHTML = '';
  });
  return blockingMove;
}


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}


function resetScore() {
  p1score = 0;
  p2score = 0;
  aiscore = 0;
  drawscore = 0;
  round = 0;

  // Update the UI to display the reset scores
  document.getElementById("scores").innerHTML = `X - ${p1score} | O - ${p2score} | Draw - ${drawscore}`;
  document.getElementById("rounds").innerHTML = `Rounds No: ${round}`;

  resetBoard();
}

// ====== POP UP BOX FUNCTION ======
let popupCallback;

function openPopup(message, callback) {
  document.getElementById("popup-message").innerHTML = message;
  document.getElementById("popup").style.display = "block";
  popupCallback = callback;
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
  if (popupCallback) {
    popupCallback();
    popupCallback = null; // Reset callback to avoid memory leaks
  }
}

function goHome() {
  document.getElementById("select").style.display = "flex";
  document.getElementById("ticTacToeGrid").style.display = "none";
  document.getElementById("rounds").style.display = "none";
  document.getElementById("difficultyForm").style.display = "none";


  document.getElementById("scores").style.display = "none";
  document.getElementById("rounds").style.display = "none";


  document.getElementById("backAi").style.display = "none";
  document.getElementById("resetB").style.display = "none";
  document.getElementById("group").style.display = "flex";
  document.getElementById("back").style.display = "none";
  document.getElementById("playerTurn").style.display = "none";

  var imageContainer = document.getElementsByClassName("image-container")[0];
  imageContainer.style.marginBottom = "";
  imageContainer.style.width = "";

  var formElement = document.getElementById("select");
  formElement.reset();

  resetScore();
}

// AJAX FUNCTION THAT RECORD THE GAME RESULT IN TO MYSQL DATABASE (PHP)
function recordGameResult(player_ID, playerName, opponentName, playerScore, opponentScore, winnerName) {
  // Create an object with the data to send
  var data = {
      player_ID: player_ID,
      playerName: playerName,
      opponentName: opponentName,
      playerScore: playerScore,
      opponentScore: opponentScore,
      winnerName: winnerName
  };

  // Send the data to the PHP script using AJAX
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'handleScoreboard.php', true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
          console.log(xhr.responseText);
          // Handle response from PHP if needed
          // For example, display a success message or handle errors
      }
  }
  // Convert data object to a query string
  var queryString = Object.keys(data).map(key => key + '=' + encodeURIComponent(data[key])).join('&');
  xhr.send(queryString);
}