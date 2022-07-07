import Board from "./board.js";

let board = new Board(); // creates a new game htmlBoard

// Examine the grid of the game htmlBoard in the browser console.
// Create the UI of the game using HTML elements based on this grid.
console.log(board.grid);

// Your code here

window.addEventListener("DOMContentLoaded", event => {
    let htmlBoard = document.createElement("section");
    htmlBoard.setAttribute("id", "board");

    let row = 0; let col = 0;

    for(let i = 0; i < 81; i++) {
        let square = document.createElement("div");
        square.setAttribute("id", `${row},${col}`)
        htmlBoard.appendChild(square);

        col++;
        if (col === 9) {col = 0; row++}
    }

    document.body.appendChild(htmlBoard);
    let visited = new Set();
    let click = 0;

    htmlBoard.addEventListener("click", event => {
        if (board.isGameOver()) { return }
        let current = event.target;

        if (current === htmlBoard) { return }

        if (visited.has(current.id)) { return }
        else {visited.add(current.id)}
        click++;

        let row = Number(current.id[0]);
        let col = Number(current.id[2]);

        let spot = board.makeHit(row, col);
        if (spot) {
            current.setAttribute("class", "hit");
            let boat = document.createElement("p");
            boat.innerText = spot;
            current.appendChild(boat);
        } else {
            current.setAttribute("class", "miss");
            let missed = document.createElement("p");
            missed.innerText = "X";
            current.appendChild(missed);
        }

        if (board.isGameOver()) {
            let h1 = document.querySelector("h1");
            h1.insertAdjacentHTML("afterend",`<h2>You won in ${click} clicks!</h2>`);
        };
    });

    let resetButton = document.createElement("button");
    resetButton.setAttribute("id", "reset");
    resetButton.setAttribute("type", "button")
    resetButton.innerText = "reset game";
    document.body.appendChild(resetButton);

    resetButton.addEventListener("click", event => {
        board = new Board();
        let squares = htmlBoard.children;

        for(let i = 0; i < squares.length; i++) {
            squares[i].classList.remove("hit");
            squares[i].classList.remove("miss");
            let inner = squares[i].querySelector("p");
            if (inner) {inner.remove()}
        }

        click = 0;
        let h2 = document.querySelector("h2");
        if (h2) { h2.remove() }
        visited = new Set();
    })

});
