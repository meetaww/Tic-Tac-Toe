document.addEventListener("DOMContentLoaded", () => {
  let board = ["", "", "", "", "", "", "", "", ""];
  let currentPlayer = "X";
  let gameActive = true;
  let scores = {
    player: 0,
    computer: 0,
  };

  const boardElements = document.getElementById("board");
  const cells = document.querySelectorAll(".cell"); // FIXED: querySelectorAll
  const statusElement = document.getElementById("status");
  const restartBtn = document.getElementById("restart-btn");
  const playerScore = document.getElementById("your-score");
  const ComputerScore = document.getElementById("com-score");

  let ties = 0; // FIXED: let instead of const

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  cells.forEach((cell) => {
    cell.addEventListener("click", () => handleCellClick(cell)); // FIXED: cell instead of cells
  });

  restartBtn.addEventListener("click", restartGame);

  function handleCellClick(cell) {
    const index = cell.getAttribute("data-index");
    if (board[index] !== "" || !gameActive || currentPlayer !== "X") {
      return;
    }

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add("x");

    if (checkWin()) {
      endGame(false);
      return;
    }

    if (checkDraw()) {
      endGame(true);
      return;
    }

    currentPlayer = "O";
    statusElement.textContent = "Computer's Turn (O)"; // FIXED: O instead of 0
    setTimeout(computerMove, 500); // FIXED: 500ms instead of 5000ms
  }

  function computerMove() {
    if (!gameActive) return;
    const bestMove = findBestMove(); // FIXED: added ()
    board[bestMove] = currentPlayer;
    cells[bestMove].textContent = currentPlayer;
    cells[bestMove].classList.add("o");

    if (checkWin()) {
      endGame(false);
      return;
    }

    if (checkDraw()) {
      endGame(true);
      return;
    }

    currentPlayer = "X";
    statusElement.textContent = "Your Turn (X)";
  }

  // for the computer
  function findBestMove() {
    //try to win
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "O"; // FIXED: "O" instead of "0"
        if (checkWin()) {
          board[i] = "";
          return i; // FIXED: return i
        }
        board[i] = "";
      }
    }

    //block player from winning
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "X";
        if (checkWin()) {
          board[i] = "";
          return i; // FIXED: return i
        }
        board[i] = "";
      }
    }

    //try to take the center
    if (board[4] === "") return 4;

    //try to take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter((corner) => board[corner] === "");
    if (availableCorners.length > 0) {
      return availableCorners[
        Math.floor(Math.random() * availableCorners.length)
      ];
    }

    //take any available edge
    const edges = [1, 3, 5, 7];
    const availableEdges = edges.filter((edge) => board[edge] === ""); // FIXED: edges instead of corners
    if (availableEdges.length > 0) {
      return availableEdges[
        Math.floor(Math.random() * availableEdges.length)
      ];
    }
  }

  function checkWin() {
    return winningCombinations.some((combination) => {
      return combination.every((index) => {
        return board[index] === currentPlayer;
      });
    });
  }

  function checkDraw() {
    return board.every((cell) => cell !== "");
  }

  function endGame(isDraw) {
    gameActive = false;
    restartBtn.classList.remove("hidden");

    if (isDraw) {
      statusElement.textContent = "Draw"; // FIXED: statusElement
      ties += 1;
      console.log(ties);
    } else {
      if (currentPlayer == "X") {
        statusElement.textContent = "You win!"; // FIXED: statusElement
        scores.player += 1;
        playerScore.textContent = scores.player;
      } else {
        statusElement.textContent = "Computer wins!"; // FIXED: statusElement
        scores.computer += 1;
        ComputerScore.textContent = scores.computer;
      }
    }
  }

  function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X"; // FIXED: uppercase X
    gameActive = true;

    statusElement.textContent = "Your Turn (X)";
    restartBtn.classList.add("hidden"); // FIXED: add instead of remove

    cells.forEach((cell) => {
      cell.textContent = "";
      cell.classList.remove("x", "o");
    });
  }
});