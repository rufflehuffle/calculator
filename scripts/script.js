let holdingShift = false;
trackShift();
window.addEventListener('keydown', (e) => runDisplay(e));
handlePressClass();

function operate(operator, x, y) {
    switch (operator) {
        case '+':
            return x + y;
        case '-':
            return x - y;
        case '*':
            return x * y;
        case '/':
            return x / y;
    }
}

let displayIsAnswer = false;

function pushDisplay(char) {
    char = char.toString();

    const display = document.querySelector('#display-main');

    if (!(isOperator(char)) && displayIsAnswer) {
        display.textContent = "";
    }

    if (display.textContent === "0" || display.textContent === "ERROR") {
        display.textContent = "";
    }
    display.textContent += char;

    displayIsAnswer = false;
}

function clearDisplay() {
    const display = document.querySelector('#display-main');
    display.textContent = "0";

    const lowerDisplay = document.querySelector('#display-lower');
    lowerDisplay.textContent = "";

    displayIsAnswer = false;
}

function deleteFromDisplay() {
    const display = document.querySelector('#display-main');
    const text = display.textContent;

    let modifiedText = text.split('');
    modifiedText.pop();
    modifiedText = modifiedText.join('')

    display.textContent = modifiedText;

    if (displayIsAnswer) {
        display.textContent = '';
    }

    if (display.textContent === '') {
        display.textContent = "0";
    }

    displayIsAnswer = false;
}

function runCalculation() {
    const display = document.querySelector('#display-main');

    const input = sanitizeInput(display.textContent);
    const result = operateOnArray(input);
    const roundedResult = (+result).toFixed(4);
    const cleanedResult = removeTrailingZeros(roundedResult);

    if (sanitizeInput(display.textContent) === 'ERROR') {
        cleanedResult = "ERROR"
    }

    const lowerDisplay = document.querySelector('#display-lower');
    lowerDisplay.textContent = display.textContent;

    display.textContent = cleanedResult;

    populateHistory(lowerDisplay.textContent, display.textContent);

    displayIsAnswer = true;
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

    let decimalFound = false;

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

        if (isDecimal(prev) && isDecimal(string[i])) {
            return "ERROR";
        }

        if (isDecimal(string[i])) {
            if (decimalFound) {
                return "ERROR";
            }
            decimalFound = true;
        }

        if (isOperator(string[i])) {
            decimalFound = false;
        }

        if (isNumeric(string[i]) && isNumeric(prev)) {
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
    return (symbol.match('[+*/-]'));
}

function isNumber(n) {
    return (n.match('[0-9]'))
}

function isDecimal(n) {
    return (n.match('[\.]'));
}

function isNumeric(n) {
    return (isNumber(n) || isDecimal(n));
}

function removeTrailingZeros(string) {
    return (+string).toString();
}

function trackShift() {
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

function runDisplay(e) {
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
    key.classList.add('pressed');
}

function populateHistory(equation, result) {
    const historyContainer = document.querySelector('#history-equations');

    if (historyContainer.childElementCount >= 10) {
        historyContainer.removeChild(historyContainer.lastChild)
    }
    
    const history = document.createElement('div');
    history.classList.add('history');
    
    const equationElement = document.createElement('span');
    equationElement.classList.add('equation');
    equationElement.textContent = equation;

    const resultElement = document.createElement('span');
    resultElement.classList.add('result');
    resultElement.textContent = result;

    history.appendChild(equationElement);
    history.appendChild(resultElement);

    history.setAttribute('onclick', `pushDisplay(${result})`);

    historyContainer.insertBefore(history, historyContainer.childNodes[0]);
}

function handlePressClass() {
    const keys = document.querySelectorAll('.numbers, .operations')
    keys.forEach(
        (key) => key.addEventListener('transitionend', 
            () => key.classList.remove('pressed')
        )
    );
}