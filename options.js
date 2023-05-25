import {drawFretBoard, setStrings, highToLowStrings, lowToHighStrings} from "./fret.js";
import {cancelGame} from "./fill.js";

document.getElementById("showFretNumbers").addEventListener("click", function(e) {
    let checked = e.target.checked;
    let style = checked ? "" : "display: none";
    let fretNums = document.querySelectorAll(".fretnumtext");
    fretNums.forEach(f => f.style = style);
});

document.getElementById("fretCount").addEventListener("change", function(e) {
    document.querySelector("#fretboard svg").remove();
    cancelGame();
    drawFretBoard(e.currentTarget.value);
});

document.getElementById("highToLow").addEventListener("click", function(e) {
    document.querySelector("#fretboard svg").remove();
    cancelGame();
    setStrings(highToLowStrings);
    drawFretBoard(document.getElementById("fretCount").value);
})

document.getElementById("lowToHigh").addEventListener("click", function(e) {
    document.querySelector("#fretboard svg").remove();
    cancelGame();
    setStrings(lowToHighStrings);
    drawFretBoard(document.getElementById("fretCount").value);
})
