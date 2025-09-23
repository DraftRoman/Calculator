const display = document.getElementById("display-value");
const buttons = document.querySelectorAll(".btn");

const CALCULATOR_STATE = {
    INITIAL_VALUE: "0",
    ERROR_MESSAGE: "Error"
};
let operator = null;
let waitingForSecondValue = false;
let currentValue = CALCULATOR_STATE.INITIAL_VALUE;
let firstValue = null;
let isResult = false;
function updateDisplay() {
    display.textContent = currentValue;
}
updateDisplay();

buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        const value = e.target.dataset.value;
        handleButtonClick(value);
    });
});

document.addEventListener('keydown', (e) => {
    const keyMap = {
        '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
        '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
        '+': '+', '-': '-', '*': '*', '/': '/',
        'Enter': '=', '=': '=',
        'Escape': 'C', 'c': 'C', 'C': 'C'
    };

    const value = keyMap[e.key];
    if (value) {
        e.preventDefault();
        handleButtonClick(value);
    }
});

function handleButtonClick(value) {
    if (isNumber(value)) {
        handleNumber(value);
    } 
    else if (isOperator(value)) {
        handleOperator(value);
    }
    else if (value === '=') {
        handleEqual();
    }
    else if (value === 'C') {
        resetCalculator();
    }
    updateDisplay();
}


function isNumber(val) {
    if (isResult) {
        resetCalculator();
    }
    return !isNaN(val) && val !== null && val !== undefined && val !== '';
}

function isOperator(val) {
    return ['+', '-', '*', '/'].includes(val);
}

function handleNumber(num) {
    if (waitingForSecondValue) {
        currentValue = num;
        waitingForSecondValue = false;
    } else {
        currentValue = currentValue === '0' ? num : currentValue + num;
    }
}

function calculate(first, operator, second) {
    switch (operator) {
        case '+': return first + second;
        case '-': return first - second;
        case '*': return first * second;
        case '/': return second !== 0 ? first / second : CALCULATOR_STATE.ERROR_MESSAGE;
        default:  return second;
    }
}

function handleOperator(nextOperator) {
    const value = parseFloat(currentValue);

    if (operator && waitingForSecondValue) {
        operator = nextOperator;
    
        return;
    }

    if (firstValue === null) {
        firstValue = value;
    } else if (operator && !isResult) {
        const result = calculate(firstValue, operator, value);
        
        if (result === CALCULATOR_STATE.ERROR_MESSAGE) {
            currentValue = result;
            resetCalculator();
            return;
        }
        
        currentValue = String(result);
        firstValue = result;
    }

    waitingForSecondValue = true;
    operator = nextOperator;
    isResult = false; 
}


function handleEqual() {
    const value = parseFloat(currentValue);

    if (operator && firstValue !== null) {
        const result = calculate(firstValue, operator, value);
        currentValue = String(result);
        firstValue = result;    
        operator = null;
        waitingForSecondValue = false;
        isResult = true;
    }
}

function resetCalculator() {
    currentValue = '0';
    firstValue = null;
    operator = null;
    waitingForSecondValue = false;
    isResult = false;
}
