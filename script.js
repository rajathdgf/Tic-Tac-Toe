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

// AI's Move Logic with Reduced Power
const computerMove = () => {
    let board = Array.from(btnRef).map(button => button.innerText);

    // Decide to play optimally or randomly
    let playRandom = Math.random() < 0.3; // 30% chance for a random move

    if (playRandom) {
        // Make a random move
        let emptyCells = [];
        btnRef.forEach((button, index) => {
            if (button.innerText === "") {
                emptyCells.push(index);
            }
        });
        let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        btnRef[randomIndex].innerText = "O";
        btnRef[randomIndex].disabled = true;
        count++;
        winChecker();
        return;
    }

    // Otherwise, play with logic (reduced Minimax strategy)
    let bestMove = null;
    let bestScore = -Infinity;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = "O"; // Try AI move
            let score = simplifiedScore(board, false); // Use a simplified evaluation
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

// Simplified scoring function for reduced Minimax logic
const simplifiedScore = (board, isMaximizing) => {
    let winner = checkWinner(board);
    if (winner === "X") return -10;
    if (winner === "O") return 10;
    if (winner === "tie") return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "O";
                let score = simplifiedScore(board, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "X";
                let score = simplifiedScore(board, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
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
