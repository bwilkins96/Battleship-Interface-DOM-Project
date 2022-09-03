import Board from "./board.js";

let board = new Board(); // creates a new game htmlBoard

// Examine the grid of the game htmlBoard in the browser console.
// Create the UI of the game using HTML elements based on this grid.
//console.log(board.grid);

// Your code here

window.addEventListener("DOMContentLoaded", event => {
    let htmlBoard = document.createElement("section");
    htmlBoard.setAttribute("id", "board");

    let row = 0; let col = 0;

    for(let i = 0; i < 81; i++) {
        let square = document.createElement("div");
        square.setAttribute("id", `${row},${col}`);
        square.setAttribute('class', 'mystery');
        htmlBoard.appendChild(square);

        col++;
        if (col === 9) {col = 0; row++}
    }

    document.body.appendChild(htmlBoard);
    let visited = new Set();
    let click = 0;
    let remaining = 20;
    let lost = false;
    let shipHitsLeft = 17;

    htmlBoard.addEventListener("click", event => {
        if (board.isGameOver()) { return }
        if (lost) { return }
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

        let clicksTracker = document.querySelector('.clicks');
        clicksTracker.innerText = `You have ${remaining - click} clicks remaining!`

        if (board.isGameOver()) {
            //let h1 = document.querySelector("h1");
            //h1.insertAdjacentHTML("afterend",`<h2 class="win">You won in ${click} clicks with ${remaining - click} clicks left!</h2>`);
            clicksTracker.innerText = `You won in ${click} clicks with ${remaining - click} clicks left!`;
            clicksTracker.classList.add('over');
            return;
        };

        if (shipHitsLeft > board.numRemaining) {
            shipHitsLeft = board.numRemaining;
            remaining+=2;
            clicksTracker.innerText = `You hit a ship and now have ${remaining - click} clicks remaining!`
        }

        if ((remaining - click) === 0) {
            lost = true;
            clicksTracker.innerText = 'You have no clicks left, sorry about that!';
            clicksTracker.classList.add('over');
        }
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
            squares[i].classList.add("mystery");
            let inner = squares[i].querySelector("p");
            if (inner) {inner.remove()}
        }

        click = 0;
        let h2 = document.querySelector(".win");
        if (h2) { h2.remove() }
        visited = new Set();

        remaining = 20;
        lost = false;

        let clicksTracker = document.querySelector('.clicks');
        if (clicksTracker.classList.contains('over')) {
            clicksTracker.classList.remove('over');
        }
        clicksTracker.innerText = 'You have 20 clicks remaining!';
        shipHitsLeft = 17;
    })

    let howTo = document.querySelector('.howTo');
    let howToButton = document.getElementById('howToButton');
    let howToClicks = 0;

    howToButton.addEventListener('click', () => {
        howToClicks++;

        if (howToClicks % 2 === 0) {
            howTo.classList.add('hidden');
            howToButton.innerText = 'Open How-to';
        } else {
            howTo.classList.remove('hidden');
            howToButton.innerText = 'Close How-to';
        }
    });

});
