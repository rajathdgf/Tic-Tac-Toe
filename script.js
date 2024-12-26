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

// Computer's Turn Logic
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

    // Block user from winning
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

// Check for a win
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
                    count++;
                    winChecker();
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
