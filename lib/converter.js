export function feetInchesToCm (feet = 0, inches = 0) {
    if (typeof inches === 'undefined') {
        inches = 0
    }
    return Math.floor(feet * 30.48 + inches * 2.54)
}

export function inchesToCm (inches) {
    return Math.floor(inches * 2.54)
}
