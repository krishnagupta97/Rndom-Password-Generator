const inputSlider = document.querySelector("[data-lengthSlider]")
const lengthDisplay = document.querySelector("[data-lengthNumber]")

const passwordDisplay = document.querySelector("[data-passwordDisplay]")
const copyBtn = document.querySelector("[data-copy]")
const copyMsg = document.querySelector("[data-copyMsg]")
const uppercaseCheck = document.querySelector("#uppercase")
const lowercaseCheck = document.querySelector("#lowercase")
const numbersCheck = document.querySelector("#numbers")
const symbolsCheck = document.querySelector("#symbols")
const indicator = document.querySelector("[data-indicator]")
const generateBtn = document.querySelector(".generateButton")
const allCheckBox = document.querySelectorAll("input[type=checkbox]")

const symbols = '~`!@#$%^&*()_-+={[}]|;:",<.>/?';


// initially variabales
let password = "";
let passwordLength = 10;
let checkCount = 0;

// all functions
const handleSlider = () => {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = parseInt(inputSlider.min);
    const max = parseInt(inputSlider.max);
    console.log(((passwordLength - min)/(max - min))*100 );
    inputSlider.style.backgroundSize = ((passwordLength - min)/(max - min))*100 + "% 100%";
};

const setIndicator = (color) => {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
};

const getRndInteger = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const generateRandomNumber = () => getRndInteger(0, 9);

const generateLowerCase = () => String.fromCharCode(getRndInteger(97, 123));

const generateUpperCase = () => String.fromCharCode(getRndInteger(65, 91));

const generateSymbol = () => {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
};

const calcStrength = () => {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
};

const copyContent = async () => {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    } catch (e) {
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
        copyMsg.innerText = "";
    }, 2000);
}

const shufflePassword = (array) => {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[j];
        array[j] = array[i];
        array[i] = temp;
    }
    let str = "";
    array.forEach(ele => {str+= ele});
    return str;
}

const handleCheckBoxChange = () => {
    checkCount = 0;
    allCheckBox.forEach(checkbox => {
        if (checkbox.checked) checkCount++;
    });

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
};

// initially called functions
handleSlider();
setIndicator("#ccc");


// all events
allCheckBox.forEach(checkbox => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', () => {
    passwordLength = inputSlider.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) copyContent();
});

generateBtn.addEventListener('click', () => {
    // none of check boxes are checked
    password = "";

    if (checkCount == 0) return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    console.log("Starting the Journey")

    let funcArr = [];

    if (uppercaseCheck.checked) funcArr.push(generateUpperCase);
    if (lowercaseCheck.checked) funcArr.push(generateLowerCase);
    if (numbersCheck.checked) funcArr.push(generateRandomNumber);
    if (symbolsCheck.checked) funcArr.push(generateSymbol);

    // compulsory addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("Compulsory Addition Done");

    // remaining addition
    for (let i = 0;i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length);
        console.log("Randome index : " + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining Addition Done");

    password = shufflePassword(Array.from(password));
    console.log("Shuffling Done");

    passwordDisplay.value = password;

    calcStrength();
});

inputSlider.addEventListener("input", () => {
    const value = (inputSlider.value - inputSlider.min) / (inputSlider.max - inputSlider.min);
    const gradient = `linear-gradient(90deg, var(--vb-violet) ${value * 100}%, rgba(0,0,0,0) ${value * 100}%)`;
    inputSlider.style.background = gradient;
});
