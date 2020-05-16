let holdingShift = false;
handleShift();

window.addEventListener('keydown',
    (e) => {
        let key = document.querySelector(`div[data-key='${e.keyCode}']`)
        
        if (holdingShift) {
            const shiftKey = document.querySelector(`.shift[data-key='${e.keyCode}']`);
            if (shiftKey) {
                key = shiftKey;
            }
        }

        if (!key) {
            return;
        }
        key.onclick();
    }
);


function add(x, y) {
    return x + y;
}

function subtract(x, y) {
    return x - y;
}

function multiply(x, y) {
    return x * y;
}

function divide(x, y) {
    return x / y;
}

function operate(operator, x, y) {
    switch (operator) {
        case '+':
            return add(x, y);
        case '-':
            return subtract(x, y);
        case '*':
            return multiply(x, y);
        case '/':
            return divide(x, y);
    }
}

function pushDisplay(char) {
    const display = document.querySelector('#display-main');
    if (display.textContent === "0" || display.textContent === "ERROR") {
        display.textContent = "";
    }
    display.textContent += char;
}

function clearDisplay() {
    const display = document.querySelector('#display-main');
    display.textContent = "0";

    const lowerDisplay = document.querySelector('#display-lower');
    lowerDisplay.textContent = "";
}

function deleteFromDisplay() {
    const display = document.querySelector('#display-main');
    const text = display.textContent;
    
    let modifiedText = text.split('');
    modifiedText.pop();
    modifiedText = modifiedText.join('')

    display.textContent = modifiedText;
    if (display.textContent === '') {
        display.textContent = "0";
    }
}

function runCalculation() {
    const display = document.querySelector('#display-main');
    let result = Math.round(+operateOnArray(sanitizeInput(display.textContent)));

    if (sanitizeInput(display.textContent) === 'ERROR') {
        result = "ERROR"
    }

    const lowerDisplay = document.querySelector('#display-lower');
    lowerDisplay.textContent = display.textContent;

    display.textContent = result;
}

function operateOnArray(sanitizedInput) {
    if (sanitizedInput === "ERROR") {
        return "ERROR";
    }

    for (let i = 0; i < sanitizedInput.length; i++) {
        if (isOperator(sanitizedInput[i])) {
            sanitizedInput = [
                ...sanitizedInput.slice(0, i - 1),
                operate(sanitizedInput[i], +sanitizedInput[i - 1], +sanitizedInput[i + 1]),
                ...sanitizedInput.slice(i + 2)
            ]

            i--;
        }
    }

    return sanitizedInput;
}

function sanitizeInput(string) {
    string = string.split('');

    for (let i = 0, prev = ''; i < string.length; prev = string[i], i++) {
        if (isOperator(string[i]) && isOperator(prev)) {
            return ("ERROR");
        }

        if (i === string.length - 1 && isOperator(string[i])) {
            return ("ERROR");
        }

        if (i === 0 && isOperator(string[i])) {
            return ("ERROR");
        }

        if (isNumber(string[i]) && isNumber(prev)) {
            string = [
                ...string.slice(0, i - 1),
                prev + string[i],
                ...string.slice(i + 1)
            ]

            i--;
            prev = string[i - 1];
        }
    }

    return string;
}

function isOperator(symbol) {
    return (symbol.match('[\*\-\/\+]'));
}

function isNumber(n) {
    return (n.match('[0-9]'))
}

function handleShift() {
    window.addEventListener('keydown',
        (e) => {
            if (e.keyCode === 16) {
                holdingShift = true;
            }
        }
    );

    window.addEventListener('keyup',
        (e) => {
            if (e.keyCode === 16) {
                holdingShift = false;
            }
        }
    );

    window.addEventListener('blur', () => holdingShift = false);
}
