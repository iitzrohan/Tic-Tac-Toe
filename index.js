// ################################################################################
// Tic Tac Toe

const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;

initializeGame();

function initializeGame(){
    cells.forEach(cell => cell.addEventListener("click", cellClickedByHuman));
    restartBtn.addEventListener("click", restartGame);
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}
function cellClickedByHuman(){
    const cellIndex = this.getAttribute("cellIndex");

    if(options[cellIndex] != "" || !running){
        return;
    }

    updateCell(this, cellIndex);
    checkWinnerTicTac();
    setTimeout(computerMove, 300); // Delay computer's move for better user experience
}

function cellClickedByComputer(index) {
    if (options[index] !== "" || !running) {
        return;
    }

    updateCell(cells[index], index);
    checkWinnerTicTac();
}

function updateCell(cell, index){
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
}
function changePlayer(){
    currentPlayer = (currentPlayer == "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`;
}
function checkWinnerTicTac(){
    let roundWon = false;

    for(let i = 0; i < winConditions.length; i++){
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if(cellA == "" || cellB == "" || cellC == ""){
            continue;
        }
        if(cellA == cellB && cellB == cellC){
            roundWon = true;
            break;
        }
    }

    if(roundWon){
        statusText.textContent = `${currentPlayer} wins!`;
        running = false;
    }
    else if(!options.includes("")){
        statusText.textContent = `Draw!`;
        running = false;
    }
    else{
        changePlayer();
    }
}
function restartGame(){
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `${currentPlayer}'s turn`;
    cells.forEach(cell => cell.textContent = "");
    running = true;
}

/* function computerMove() {
    if (!running) {
        return;
    }

    // Implement a simple computer strategy (randomly select an available cell)
    const availableCells = [];
    for (let i = 0; i < options.length; i++) {
        if (options[i] === "") {
            availableCells.push(i);
        }
    }

    if (availableCells.length === 0) {
        // No available cells, the game is a draw
        statusText.textContent = "Draw!";
        running = false;
    } else {
        // Randomly select an available cell
        const randomIndex = Math.floor(Math.random() * availableCells.length);
        const computerIndex = availableCells[randomIndex];
        cellClickedByComputer(computerIndex);
    }
} */

function computerMove() {
    if (!running) {
        return;
    }

    // Check for winning move
    const winningMove = findWinningMove();
    if (winningMove !== -1) {
        cellClickedByComputer(winningMove);
        return;
    }

    // Check for blocking move
    const blockingMove = findBlockingMove();
    if (blockingMove !== -1) {
        cellClickedByComputer(blockingMove);
        return;
    }

    // Prioritize corners and center
    const cornersAndCenter = [0, 2, 4, 6, 8];
    const availableCornersAndCenter = cornersAndCenter.filter(index => options[index] === "");
    
    if (availableCornersAndCenter.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableCornersAndCenter.length);
        cellClickedByComputer(availableCornersAndCenter[randomIndex]);
        return;
    }

    // Choose any available cell
    const availableCells = [];
    for (let i = 0; i < options.length; i++) {
        if (options[i] === "") {
            availableCells.push(i);
        }
    }

    if (availableCells.length === 0) {
        // No available cells, the game is a draw
        statusText.textContent = "Draw!";
        running = false;
    } else {
        const randomIndex = Math.floor(Math.random() * availableCells.length);
        cellClickedByComputer(availableCells[randomIndex]);
    }
}

// Function to find a winning move for the computer
function findWinningMove() {
    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if (cellA === currentPlayer && cellB === currentPlayer && cellC === "") {
            return condition[2];
        }
        if (cellA === currentPlayer && cellC === currentPlayer && cellB === "") {
            return condition[1];
        }
        if (cellB === currentPlayer && cellC === currentPlayer && cellA === "") {
            return condition[0];
        }
    }
    return -1; // No winning move found
}

// Function to find a blocking move to prevent the player from winning
function findBlockingMove() {
    const opponent = (currentPlayer === "X") ? "O" : "X";

    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if (cellA === opponent && cellB === opponent && cellC === "") {
            return condition[2];
        }
        if (cellA === opponent && cellC === opponent && cellB === "") {
            return condition[1];
        }
        if (cellB === opponent && cellC === opponent && cellA === "") {
            return condition[0];
        }
    }
    return -1; // No blocking move found
}