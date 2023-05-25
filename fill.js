import {makeNote, fretWidth, getID, changeIDKind, STRING, NOTE, strings, getHiddenNotes} from "./fret.js";
import {makeSVG, group, ellipse, line, rect, text, startBlinking, stopBlinking} from "./svg.js";

let svg = makeSVG(document.getElementById("notes"));

for (let i = 0; i < 12; i++) {
    makeNote("E", i, i * fretWidth, 0).property("class", "choices").show(svg);
}

const openNotes = strings.map(s => getID(NOTE, s, 0));

function hide(element) {
    element.style = "display: none";
}

function show(element) {
    element.style = "";
}

class Position {
    constructor(string, note) {
        this.string = string;
        this.note = note;
    }

    ask() {
        startBlinking(this.string);
    }

    reset() {
        stopBlinking(this.string);
    }

    answer() {
        return this.note.textContent;
    }

    guessed() {
        this.reset();
        show(this.note)
    }
}

var positionToGuess = null;

function clearBoard() {
    let notes = document.querySelectorAll(".notes");
    notes.forEach(function(note) {
        if (!openNotes.includes(note.id)) {
            hide(note);
        }
    });
}

function showChoose() {
    show(document.getElementById("choose"));
}

function hideChoose() {
    hide(document.getElementById("choose"));
}

function randomHiddenNote() {
    let hiddenNotes = getHiddenNotes();
    if (hiddenNotes === null) {
        return null
    }

    let randomIdx = Math.floor(Math.random() * hiddenNotes.length);
    let note = hiddenNotes[randomIdx];
    return note;
}

function nextRound() {
    let note = randomHiddenNote();
    if (note === null) {
        // game is over
        hideChoose();
        return
    }

    let stringID = changeIDKind(note.id, STRING)
    let string = document.getElementById(stringID);

    positionToGuess = new Position(string, note);
    positionToGuess.ask();
}

function checkChoice(choice) {
    if (positionToGuess === null) {
        // no game active
        return;
    }

    if (choice.textContent === positionToGuess.answer()) {
        positionToGuess.guessed();
        positionToGuess = null;
        nextRound();
    }
}

export function cancelGame() {
    if (positionToGuess !== null) {
        positionToGuess.reset();
        positionToGuess = null;
    }
    hideChoose();
}

document.querySelectorAll(".choices").forEach(
    c => c.addEventListener(
        "click", e => checkChoice(e.currentTarget)));


document.getElementById("playGame").addEventListener("click", function() {
    cancelGame();

    clearBoard();
    showChoose();
    nextRound();
})
