let btnRef = document.querySelectorAll(".button-option");
let popupRef = document.querySelector(".popup");
let newgameBtn = document.getElementById("new-game");
let restartBtn = document.getElementById("restart");
let msgRef = document.getElementById("message");

// Winning Pattern Array
let winningPattern = [
    [0, 1, 2],
    [0, 3, 6],
    [2, 5, 8],
    [6, 7, 8],
    [3, 4, 5],
    [1, 4, 7],
    [0, 4, 8],
    [2, 4, 6],
];

// Game Variables
let xTurn = true; // Player 'X' always starts
let count = 0; // To track the total moves made
let isVsComputer = true; // Enable computer opponent

// Disable All Buttons
const disableButtons = () => {
    btnRef.forEach((element) => (element.disabled = true));
    popupRef.classList.remove("hide");
};

// Enable all buttons (For New Game and Restart)
const enableButtons = () => {
    btnRef.forEach((element) => {
        element.innerText = "";
        element.disabled = false;
        element.classList.remove("winning", "fall");
    });
    popupRef.classList.add("hide");
    xTurn = true;
    count = 0;
};

// This function is executed when a player wins
const winFunction = (letter, pattern) => {
    disableButtons();
    pattern.forEach((index) => btnRef[index].classList.add("winning"));
    btnRef.forEach((element, idx) => {
        if (!pattern.includes(idx)) {
            element.classList.add("fall");
        }
    });
    if (letter === "X") {
        msgRef.innerHTML = "&#x1F389; <br> 'X' Wins!";
    } else {
        msgRef.innerHTML = "&#x1F389; <br> 'O' Wins!";
    }
};

// Function for a draw
const drawFunction = () => {
    disableButtons();
    msgRef.innerHTML = "&#x1F60E; <br> It's a Draw!";
};

// Minimax Algorithm for AI
const minimax = (board, depth, isMaximizing) => {
    const winner = checkWinner(board);
    if (winner === "O") return 10 - depth;
    if (winner === "X") return depth - 10;
    if (board.every(cell => cell !== "")) return 0; // Draw

    if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "O"; // AI's move
                best = Math.max(best, minimax(board, depth + 1, false));
                board[i] = ""; // Undo move
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "X"; // Player's move
                best = Math.min(best, minimax(board, depth + 1, true));
                board[i] = ""; // Undo move
            }
        }
        return best;
    }
};

// Function to determine the best move for AI
const bestMove = () => {
    let bestVal = -Infinity;
    let move = -1;
    let board = Array.from(btnRef).map(button => button.innerText);

    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = "O"; // AI's move
            let moveVal = minimax(board, 0, false);
            board[i] = ""; // Undo move

            if (moveVal > bestVal) {
                move = i;
                bestVal = moveVal;
            }
        }
    }
    return move;
};

// Check for a win or draw
const checkWinner = (board) => {
    for (let pattern of winningPattern) {
        const [a, b, c] = pattern;
        if (board[a] === board[b] && board[b] === board[c] && board[a] !== "") {
            return board[a]; // 'X' or 'O'
        }
    }
    return null; // No winner
};

// Check for a win
const winChecker = () => {
    let board = Array.from(btnRef).map(button => button.innerText);
    const winner = checkWinner(board);
    
    if (winner) {
        winFunction(winner, winningPattern.find(pattern => {
            return pattern.every(index => btnRef[index].innerText === winner);
        }));
        return true;
    }

    if (count === 9) {
        drawFunction();
        return true;
    }

    return false;
};

// User and Computer Moves
btnRef.forEach((element) => {
    element.addEventListener("click", () => {
        if (element.innerText === "" && !isVsComputer) {
            element.innerText = "X";
            element.disabled = true;
            count++;
            if (winChecker()) return;

            // If it's a draw or win, stop the game
            if (count < 9) {
                setTimeout(() => {
                    const move = bestMove();
                    btnRef[move].innerText = "O";
                    btnRef[move].disabled = true;
                    count++;
                    if (winChecker()) return;
                }, 500); // Delay for better UX
            }
        }
    });
});

// New Game and Restart
newgameBtn.addEventListener("click", enableButtons);
restartBtn.addEventListener("click", enableButtons);

// Enable Buttons and disable popup on page load
window.onload = enableButtons;
