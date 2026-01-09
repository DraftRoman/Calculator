type Operator = '+' | '-' | '*' | '/';
type ButtonValue = string;

interface CalculatorState {
    INITIAL_VALUE: string;
    ERROR_MESSAGE: string;
}

const display = document.getElementById("display-value") as HTMLElement | null;
const buttons = document.querySelectorAll<HTMLButtonElement>(".btn");

if (!display) {
    throw new Error("Display element not found");
}

const CALCULATOR_STATE: CalculatorState = {
    INITIAL_VALUE: "0",
    ERROR_MESSAGE: "Error"
};
let operator: Operator | null = null;
let waitingForSecondValue = false;
let currentValue: string = CALCULATOR_STATE.INITIAL_VALUE;
let firstValue: number | null = null;
let isResult = false;
function updateDisplay():void {
    display!.textContent = currentValue;
}
updateDisplay();

buttons.forEach(button => {
    button.addEventListener('click', (e: MouseEvent) => {
        const target = e.currentTarget as HTMLButtonElement;
        const value = target.dataset.value;
        if (value) {
            handleButtonClick(value);
        }
    });
});

document.addEventListener('keydown', (e: KeyboardEvent) => {
    const keyMap: Record<string, ButtonValue> = {
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

function handleButtonClick(value: ButtonValue): void {
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


function isNumber(val: string): boolean {
    if (isResult) {
        resetCalculator();
    }
    return val.trim() !== '' && !Number.isNaN(Number(val));
}

function isOperator(val: string): val is Operator{
    return ['+', '-', '*', '/'].includes(val);
}

function handleNumber(num: string): void{
    if (waitingForSecondValue) {
        currentValue = num;
        waitingForSecondValue = false;
    } else {
        currentValue = currentValue === '0' ? num : currentValue + num;
    }
}

function calculate(
    first: number,
    operator: Operator,
    second: number
): number | string {
    switch (operator) {
        case '+': return first + second;
        case '-': return first - second;
        case '*': return first * second;
        case '/': return second !== 0 ? first / second : CALCULATOR_STATE.ERROR_MESSAGE;
        default:  return second;
    }
}

function handleOperator(nextOperator: Operator):void {
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
        firstValue = result as number;
    }
    waitingForSecondValue = true;
    operator = nextOperator;
    isResult = false; 
}

function handleEqual():void {
    const value = parseFloat(currentValue);

    if (operator && firstValue !== null) {
        const result = calculate(firstValue, operator, value);
        currentValue = String(result);
        firstValue = typeof result === 'number' ? result : null;;    
        operator = null;
        waitingForSecondValue = false;
        isResult = true;
    }
}

function resetCalculator(): void {
    currentValue = '0';
    firstValue = null;
    operator = null;
    waitingForSecondValue = false;
    isResult = false;
}
