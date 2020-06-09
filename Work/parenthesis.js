/**
 * @file Remove parentesis and reverse the word inside
 */

 /**
  * Simple way to reverse string
  */
 function reverseString(str) {
    return str.split("").reverse().join("");
 } // end function reverse

let weirdString = 'foo(foo(bar))blim';
let stringAsArray = weirdString.split("(");
let secondSplit = stringAsArray[1].split(")");
let wordToReverse = reverseString(secondSplit[0]);
let remainingString = '';
if (secondSplit.length > 1) {
    secondSplit.shift();
    remainingString = secondSplit.join("");
}
stringAsArray[1] = `${wordToReverse}${remainingString}`;
console.log(stringAsArray.join("").replace('))', ''));