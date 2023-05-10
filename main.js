var isTurn = true; // true = X, false = O
var squares = document.getElementsByClassName("square");
var docMsg = document.getElementById("message")
var docReset = document.getElementById("reset")
var docScore = document.getElementById("score")
var score = 0
var win = false
docMsg.innerHTML = isTurn ? "It is X's turn" : "It is O's turn"

function squareClicked(square) {
    console.log(square);
    if (square.value != "") return
    square.value = isTurn ? 'X' : 'O';
    isTurn = !isTurn;
    docMsg.innerHTML = isTurn ? "It is X's turn" : "It is O's turn"
}