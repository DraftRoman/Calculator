const display = document.getElementById("display-value");
const buttons = document.querySelectorAll(".btn");

let currentValue = "0";
let firstValue = null;
let operator = null;
let waitingForSecondValue = false;

function updateDisplay() {
    display.textContent = currentValue;
}
updateDisplay();

buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        const value = e.target.dataset.value;

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
    });
});

function isNumber(val) {
    return !isNaN(val);
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
        case '/': return second !== 0 ? first / second : "Error";
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
    } else if (operator) {
        const result = calculate(firstValue, operator, value);
        currentValue = String(result);
        firstValue = result;
    }

    waitingForSecondValue = true;
    operator = nextOperator;
}

function handleEqual() {
    const value = parseFloat(currentValue);

    if (operator && firstValue !== null) {
        const result = calculate(firstValue, operator, value);
        currentValue = String(result);
        firstValue = null;
        operator = null;
        waitingForSecondValue = false;
    }
}

function resetCalculator() {
    currentValue = '0';
    firstValue = null;
    operator = null;
    waitingForSecondValue = false;
}
