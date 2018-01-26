function padLeft(value, len) {

    let hexLength = len * 2;
    if (value.length > len)
        return value;

    let outStr = value;
    for (let i = 0; i < (hexLength - value.length); i++) {
        outStr = '0' + outStr;
    }
    return outStr;
}

function padRight(string, chars) {
    return string + (new Array(chars - string.length + 1).join('0'));
};

export {padLeft, padRight}