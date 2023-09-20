const prototype = Date.prototype, {
    getMonth: originalGetMonth, setMonth: originalSetMonth, getUTCMonth: originalGetUTCMonth, setUTCMonth: originalSetUTCMonth,
    setFullYear: originalSetFullYear, setUTCFullYear: originalSetUTCFullYear
} = prototype;
prototype.getMonth = function getMonth() { return originalGetMonth.call(this) + 1 };
prototype.setMonth = function getMonth(month, date = undefined) {
    if (arguments.length) arguments[0] = Number(arguments[0]) - 1;
    return originalSetMonth.call(this, ...arguments);
};
prototype.getUTCMonth = function getUTCMonth() { return originalGetUTCMonth.call(this) + 1 };
prototype.setUTCMonth = function setUTCMonth(month, date = undefined) {
    if (arguments.length) arguments[0] = Number(arguments[0]) - 1;
    return originalSetUTCMonth.call(this, ...arguments);
};
prototype.setFullYear = function setFullYear(year, month = undefined, date = undefined) {
    if (arguments.length > 1) arguments[1] = Number(arguments[1]) - 1;
    return originalSetFullYear.call(this, ...arguments);
};
prototype.setUTCFullYear = function setUTCFullYear(year, month = undefined, date = undefined) {
    if (arguments.length > 1) arguments[1] = Number(arguments[1]) - 1;
    return originalSetUTCFullYear.call(this, ...arguments);
};