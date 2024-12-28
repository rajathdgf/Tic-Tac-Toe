// Select DOM elements
let btnRef = document.querySelectorAll(".button-option");
let popupRef = document.querySelector(".popup");
let newgameBtn = document.getElementById("new-game");
let restartBtn = document.getElementById("restart");
let msgRef = document.getElementById("message");
let playerWinsRef = document.getElementById("player-wins");
let computerWinsRef = document.getElementById("computer-wins");
let drawsRef = document.getElementById("draws");
let claimRewardBtn = document.getElementById("claim-reward");
let rewardPopupRef = document.querySelector(".reward-popup");
let discountRef = document.getElementById("discount");
let discountCodeRef = document.getElementById("discount-code");
let copyCodeBtn = document.getElementById("copy-code");

// Game Stats
let playerWins = 0;
let computerWins = 0;
let draws = 0;
let playerWinCount = 0;

// Winning Patterns
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
let xTurn = true; // Player starts with 'X'
let count = 0; // Track moves
let isVsComputer = true; // Computer opponent enabled

// Disable all buttons
const disableButtons = () => {
    btnRef.forEach((element) => (element.disabled = true));
    popupRef.classList.remove("hide");
};

// Enable all buttons for new/restart game
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

// Handle win logic
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
        playerWins++;
        playerWinCount++;
        playerWinsRef.innerText = playerWins;

        // Check for reward eligibility
        if (playerWinCount === 5) {
            claimRewardBtn.classList.remove("hide");
        }
    } else {
        msgRef.innerHTML = "&#x1F389; <br> 'O' Wins!";
        computerWins++;
        computerWinsRef.innerText = computerWins;
    }
};

// Handle draw logic
const drawFunction = () => {
    disableButtons();
    msgRef.innerHTML = "&#x1F60E; <br> It's a Draw!";
    draws++;
    drawsRef.innerText = draws;
};

// Computer AI move
const computerMove = () => {
    let emptyCells = [];
    btnRef.forEach((button, index) => {
        if (button.innerText === "") {
            emptyCells.push(index);
        }
    });

    // Check if computer can win
    for (let i of winningPattern) {
        let [a, b, c] = i;
        if (
            btnRef[a].innerText === "O" &&
            btnRef[b].innerText === "O" &&
            btnRef[c].innerText === ""
        ) {
            btnRef[c].innerText = "O";
            btnRef[c].disabled = true;
            return;
        }
        if (
            btnRef[a].innerText === "O" &&
            btnRef[c].innerText === "O" &&
            btnRef[b].innerText === ""
        ) {
            btnRef[b].innerText = "O";
            btnRef[b].disabled = true;
            return;
        }
        if (
            btnRef[b].innerText === "O" &&
            btnRef[c].innerText === "O" &&
            btnRef[a].innerText === ""
        ) {
            btnRef[a].innerText = "O";
            btnRef[a].disabled = true;
            return;
        }
    }

    // Block player from winning
    for (let i of winningPattern) {
        let [a, b, c] = i;
        if (
            btnRef[a].innerText === "X" &&
            btnRef[b].innerText === "X" &&
            btnRef[c].innerText === ""
        ) {
            btnRef[c].innerText = "O";
            btnRef[c].disabled = true;
            return;
        }
        if (
            btnRef[a].innerText === "X" &&
            btnRef[c].innerText === "X" &&
            btnRef[b].innerText === ""
        ) {
            btnRef[b].innerText = "O";
            btnRef[b].disabled = true;
            return;
        }
        if (
            btnRef[b].innerText === "X" &&
            btnRef[c].innerText === "X" &&
            btnRef[a].innerText === ""
        ) {
            btnRef[a].innerText = "O";
            btnRef[a].disabled = true;
            return;
        }
    }

    // Make a random move
    let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    btnRef[randomIndex].innerText = "O";
    btnRef[randomIndex].disabled = true;
};

// Check for a win or draw
const winChecker = () => {
    for (let i of winningPattern) {
        let [a, b, c] = i;
        let element1 = btnRef[a].innerText;
        let element2 = btnRef[b].innerText;
        let element3 = btnRef[c].innerText;

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

// Player and Computer Moves
btnRef.forEach((element) => {
    element.addEventListener("click", () => {
        if (element.innerText === "") {
            element.innerText = "X";
            element.disabled = true;
            count++;
            winChecker();

            // Computer's turn after player's move
            if (isVsComputer && count < 9) {
                setTimeout(() => {
                    computerMove();
                    count++;
                    winChecker();
                }, 500);
            }
        }
    });
});

// Claim Reward Logic
claimRewardBtn.addEventListener("click", () => {
    let discount = Math.floor(Math.random() * 41) + 10; // Generate 10-50% discount
    let discountCode = `SAVE${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    discountRef.innerText = discount;
    discountCodeRef.innerText = discountCode;
    rewardPopupRef.classList.remove("hide");
    playerWinCount = 0; // Reset win count
    claimRewardBtn.classList.add("hide");
});

// Copy Discount Code
copyCodeBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(discountCodeRef.innerText).then(() => {
        alert("Code copied to clipboard!");
        rewardPopupRef.classList.add("hide");
    });
});

// New Game and Restart
newgameBtn.addEventListener("click", enableButtons);
restartBtn.addEventListener("click", enableButtons);

// Initialize game
window.onload = enableButtons;
