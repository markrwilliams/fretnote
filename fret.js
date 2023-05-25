import {makeSVG, group, ellipse, line, rect, text} from "./svg.js";

export const highToLowStrings = ["E1", "B", "G", "D", "A", "E0"];
export const lowToHighStrings = ["E0", "A", "D", "G", "B", "E1"];

// make sure high-to-low is checked by default
export var strings = highToLowStrings;

export function setStrings(s) {
    strings = s;
}

const twelveTone = ["E", "F", "F♯/G♭", "G", "G♯/A♭", "A", "A♯/B♭", "B", "C", "C♯/D♭", "D", "D♯/E♭"];

const edgeOffset = 2;
export const fretWidth = 50;
const stringWidth = 25;
const noteFontSize = 10;

function getStringY(name) {
    return edgeOffset + strings.indexOf(name) * stringWidth;
}

const singleDots = [3, 5, 7, 9, 15, 17, 19, 21];
const doubleDots = [12, 24];

const dotScale = 0.8

function getDotX(x) {
    return x + (fretWidth - Math.floor(fretWidth * dotScale));
}

function getDotY(y) {
    return y - (stringWidth - Math.floor(stringWidth * dotScale));
}


const singleDotY = getDotY((getStringY("D") + getStringY("G")) / 2);
const doubleDot1Y = getDotY((getStringY("A") + getStringY("D")) / 2);
const doubleDot2Y = getDotY((getStringY("G") + getStringY("B")) / 2);

const dotH = stringWidth * dotScale / 2;
const dotW = fretWidth * dotScale - getDotX(0);

const fretY = edgeOffset + (strings.length - 1) * stringWidth;


function getFretX(fretIdx) {
    return edgeOffset + fretWidth * fretIdx;
}

function fretLine(fretX) {
    return line()
        .stroke()
        .start(fretX, edgeOffset+0.5)
        .end(fretX, fretY+0.5);
}

export const STRING = "string";
export const NOTE = "note";

export function getID(kind, string, fretNum) {
    return `${kind}-${string}-${fretNum}`;
}

export function changeIDKind(id, kind) {
    let parts = id.split(/-/);
    parts[0] = kind;
    return parts.join("-");
}

export function makeNote(string, fretNum, x, y) {
    let note = twelveTone[(twelveTone.indexOf(string) + fretNum) % twelveTone.length];
    return group(
        ellipse()
            .outline()
            .fill("lightgrey")
            .cx(x + fretWidth/2)
            .cy(y)
            .rx(noteFontSize + noteFontSize/2)
            .ry(noteFontSize),
        text()
            .topLeft(x + fretWidth/2, y + noteFontSize/2-1)
            .property("text-anchor", "middle")
            .property("class", "notetext")
            .contents(note)
    );
}


export function getHiddenNotes() {
    let queries = ['g[style*="display: none"].notes', 'g[style*="display:none"].notes'];
    for (let query of queries) {
        let nodes = document.querySelectorAll(query);
        if (nodes.length !== 0) {
            return nodes
        }
    }
    return null;
}


export function drawFretBoard(fretCount) {
    let svg = makeSVG(document.getElementById("fretboard"));

    for (let fretNum = 0; fretNum <= fretCount; fretNum++) {
        let fretX = getFretX(fretNum);
        fretLine(getFretX(fretNum+1)).show(svg);

        if (singleDots.includes(fretNum)) {
            rect()
                .fill("black")
                .topLeft(getDotX(fretX), singleDotY)
                .height(dotH)
                .width(dotW)
                .show(svg);
        }
        else if (doubleDots.includes(fretNum)) {
            rect()
                .fill("black")
                .topLeft(getDotX(fretX), doubleDot1Y)
                .height(dotH)
                .width(dotW)
                .show(svg);
            rect()
                .fill("black")
                .topLeft(getDotX(fretX), doubleDot2Y)
                .height(dotH)
                .width(dotW)
                .show(svg);
        }

        for (let stringNum in strings) {
            let string = strings[stringNum];
            let stringNote = string.replace(/[0-9]/, '');
            let stringY = edgeOffset + stringNum * stringWidth;
            line()
                .stroke()
                .start(fretX - 0.5, stringY)
                .end(fretX + fretWidth + 0.5, stringY)
                .id(getID(STRING, string, fretNum))
                .show(svg);
            makeNote(stringNote, fretNum, fretX, stringY)
                .property("class", "notes")
                .property("id", getID(NOTE, string, fretNum))
                .show(svg);
        }

        text()
            .topLeft(fretX + stringWidth, fretY + stringWidth)
            .property("text-anchor", "middle")
            .property("class", "fretnumtext")
            .contents((fretNum).toString())
            .show(svg);
    }
}

drawFretBoard(document.getElementById("fretCount").value)
