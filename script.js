//Value variables
let mode = "";
let numOnScreen = "0";
let num1 = "";
let num2 = "";
let nextNumNew = false;
let shiftIsPressed = false;

//Screen and button variables
const screenText = document.querySelector("#screenText");
const numButtons = document.querySelectorAll(".num-button");
const modeButtons = document.querySelectorAll(".mode-button");
const buttonDecimal = document.querySelector("#button-decimal");
const buttonClear = document.querySelector("#button-clear");
const buttonBackspace = document.querySelector("#button-backspace");
const buttonEquals = document.querySelector("#button-equals");

//Num button event listeners
numButtons.forEach((numButton) => {
    numButton.addEventListener("click", (e)=> {
        numEntry(e.target.textContent);
    });
});
//Mode button event listeners
modeButtons.forEach((modeButton) => {
    modeButton.addEventListener("click", (e)=> {
        setMode(e.target.getAttribute("data-mode"));  
    });
})
//Other button event listeners
buttonDecimal.addEventListener("click", ()=> { decimalEntry(); });
buttonBackspace.addEventListener("click", ()=> { backspace(); });
buttonClear.addEventListener("click", ()=> { clear(); });
buttonEquals.addEventListener("click", ()=> { equals(); });

//Keyboard input
window.addEventListener("keydown", (e)=> {

    //shiftIsPressed toggle on (off is 'keyup' below)
    if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        if (!shiftIsPressed) shiftIsPressed = true;
    }

    //Inputs w/o shift (or indifferent)
    if (!shiftIsPressed && e.code.includes("Digit")) numEntry(e.code.charAt(5));
    else if (e.code === "Period") decimalEntry();
    else if (e.code === "KeyC") clear();
    else if (e.code === "Minus") setMode("subtract");
    else if (e.code === "KeyX") setMode("multiply");
    else if (e.code === "Slash") setMode("divide");

    //Inputs w/ shift
    else if (shiftIsPressed && e.code === "Equal") {
        setMode("add");
        pressEffect(document.querySelector("#button-add"));
    }
    else if (shiftIsPressed && e.code === "Digit6") {
        setMode("exponent");
        pressEffect(document.querySelector("#button-exponent"));
    }
    else if (shiftIsPressed && e.code === "Digit8") {
        setMode("multiply");
        pressEffect(document.querySelector("#button-multiply"));
    }

    //Inputs w/ two options:
    else if (e.code === "Backspace" || e.code === "Delete") {
        backspace();
        pressEffect(document.querySelector("#button-backspace"));
    }
    else if (e.code === "Enter" || (!shiftIsPressed && e.code === "Equal")) {
        equals();
        pressEffect(document.querySelector("#button-equals"));
    }

    //Press effect for inputs w/o shift
    if (!shiftIsPressed && document.querySelector(`[data-eCode="${e.code}"]`) != null) {
        pressEffect(document.querySelector(`[data-eCode="${e.code}"]`));
    }
});

function pressEffect(button) {
    button.classList.add("pressed");
    setTimeout(function() { button.classList.remove("pressed"); }, 50);
    setTimeout(function() { button.classList.add("lit"); }, 50);
    setTimeout(function() { button.classList.remove("lit"); }, 150);
}

window.addEventListener("keyup", (e) => {
    if (shiftIsPressed && (e.code === "ShiftLeft" || e.code === "ShiftRight" )) {
        shiftIsPressed = false;
    }
});

function setMode(modeString) {
    if(!nextNumNew) {
        nextNumNew = true;
        //If no mode, set num1
        if (mode == "") {
            num1 = numOnScreen; 
            screenBlink();
        }
        //Otherwise set num2 & operate
        else {                              
            num2 = numOnScreen;
            operate();
        }
    }
    mode = modeString;
}

//Called w/ = button, or operator press
function operate() {
    if (mode === "add") numOnScreen = add(num1, num2);
    else if (mode === "subtract") numOnScreen = subtract(num1, num2);
    else if (mode === "multiply") numOnScreen = multiply(num1, num2);
    else if (mode === "divide") numOnScreen = divide(num1, num2);
    else if (mode === "exponent") numOnScreen = exponent(num1, num2);
    screenBlink();
    solutionCleanup();
    updateScreen();
    num1 = numOnScreen;
}

//Number changing functions
function numEntry(pressedNum) {
    //Most presses
    if (!nextNumNew) {
        if (numOnScreen == "0" && !numOnScreen.includes(".")) numOnScreen = pressedNum;
        else numOnScreen += pressedNum;
    }
    //First press after operation
    else {
        nextNumNew = false; 
        if (mode == "") clear(); //If first press after equals
        numOnScreen = pressedNum;
    }
    updateScreen();
}

function decimalEntry() {
    if (nextNumNew) {
        numOnScreen = "0.";
        nextNumNew = false;
    }
    else if (numOnScreen.includes(".")) return;
    else numOnScreen += "."; //Tried .concat("."); no dice
    updateScreen(); 
}

function backspace() {
    if (nextNumNew) nextNumNew = false;
    numOnScreen = numOnScreen.substring(0, numOnScreen.length - 1);
    if (numOnScreen.length == 0) numOnScreen = "0";
    updateScreen();
}

function clear() {
    mode = "";
    num1 = "";
    num2 = "";
    numOnScreen = "0";
    screenBlink();
    updateScreen();
}

function solutionCleanup() {
    numOnScreen = parseFloat(numOnScreen).toPrecision(9).toString(); //Round to 9 decimal points
    numOnScreen = parseFloat(numOnScreen).toString(); //Remove trailing zeroes
    if (numOnScreen.length > 10) numOnScreen = numOnScreen.substring(0, 10); //Remove excess digits
}

function updateScreen() { screenText.textContent = numOnScreen; }
function screenBlink() {
    screenText.style.opacity = 0;
    setTimeout(function() {screenText.style.opacity = 1;}, 50);
}

//Individual operation functions
function add(num1, num2) {
    return (parseFloat(num1) + parseFloat(num2)).toString(); //Still works, but w/ float decimal issues
}
function subtract(num1, num2) {
    return (num1 - num2).toString();
}
function multiply(num1, num2) {
    return (num1 * num2).toString();
}
function divide(num1, num2) {
    return (num1 / num2).toString();
}
function exponent(num1, num2) {
    return (num1 ** num2).toString();
}

function equals() {
    if (num1 != "") {
        num2 = numOnScreen;
        operate();
        mode = "";
        nextNumNew = true;
    }
}
