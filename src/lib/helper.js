export const formatYear = (input) => {
    let espectedOutput = input;
    if (espectedOutput !== "") {
        espectedOutput = espectedOutput.replace(/\D/g, "");
    }
    if (espectedOutput !== "" && espectedOutput !== null) {
        espectedOutput = espectedOutput.slice(0, 4) || 0;
    }
    return espectedOutput;
}

export const addDotToEndOfString = (input) => {
    return input.charAt(input.length-1) !== "." ? input + '.' : input;
}

export const notNull = (input) => {
    return input !== null && input !== '' && input !== '-';
}

export const validateNullOrEmptyObject = (object) => {
    let isValid = true;
    const values = Object.values(object);
    values.map((obj) => {
        if (!obj || obj === '') {
            isValid = false;
        }
    })
    return isValid;
}