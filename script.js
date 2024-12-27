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

// Minimax Algorithm for AI decision making
const minimax = (board, depth, isMaximizingPlayer) => {
    const scores = {
        X: -10,
        O: 10,
        tie: 0,
    };

    let winner = checkWinner(board);
    if (winner !== null) {
        return scores[winner];
    }

    if (isMaximizingPlayer) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "O"; // AI plays 'O'
                let score = minimax(board, depth + 1, false);
                board[i] = ""; // Undo move
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "X"; // Player plays 'X'
                let score = minimax(board, depth + 1, true);
                board[i] = ""; // Undo move
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
};

// Check for winner
const checkWinner = (board) => {
    for (let pattern of winningPattern) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[b] === board[c]) {
            return board[a];
        }
    }
    if (board.includes("")) {
        return null;
    }
    return "tie"; // Return 'tie' if no winner and no empty spots
};

// AI's optimal move
const computerMove = () => {
    let board = Array.from(btnRef).map(button => button.innerText);
    let bestMove = null;
    let bestScore = -Infinity;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = "O"; // Try AI move
            let score = minimax(board, 0, false);
            board[i] = ""; // Undo move
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    // Make the best move for AI
    btnRef[bestMove].innerText = "O";
    btnRef[bestMove].disabled = true;
    count++;
    winChecker();
};

// Check for a win
const winChecker = () => {
    let board = Array.from(btnRef).map(button => button.innerText);
    for (let i of winningPattern) {
        let [a, b, c] = i;
        let element1 = board[a];
        let element2 = board[b];
        let element3 = board[c];

        if (element1 !== "" && element2 !== "" && element3 !== "") {
            if (element1 === element2 && element2 === element3) {
                winFunction(element1, i);
                return;
            }
        }
    }
    if (count === 9) {
        drawFunction();
    }
};

// User and Computer Moves
btnRef.forEach((element) => {
    element.addEventListener("click", () => {
        if (element.innerText === "") {
            element.innerText = "X";
            element.disabled = true;
            count++;
            winChecker();

            // Computer's turn after user clicks
            if (isVsComputer && count < 9) {
                setTimeout(() => {
                    computerMove();
                }, 500); // Delay for a better user experience
            }
        }
    });
});

// New Game and Restart
newgameBtn.addEventListener("click", enableButtons);
restartBtn.addEventListener("click", enableButtons);

// Enable Buttons and disable popup on page load
window.onload = enableButtons;
