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

// Function for a win
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

        // Check if reward should be shown
        if (playerWinCount === 5) {
            claimRewardBtn.classList.remove("hide");
        }
    } else {
        msgRef.innerHTML = "&#x1F389; <br> 'O' Wins!";
        computerWins++;
        computerWinsRef.innerText = computerWins;
    }
};

// Function for a draw
const drawFunction = () => {
    disableButtons();
    msgRef.innerHTML = "&#x1F60E; <br> It's a Draw!";
    draws++;
    drawsRef.innerText = draws;
};

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

// Existing logic for winChecker, computerMove, and event listeners goes here...
// (Keep the rest of your existing game logic.)
