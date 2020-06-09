/**
 * @file Group words by similar letters (or in my case by lenght)
 */
let wordsGroup = ['AMOR', 'XISELA', 'JAMON', 'ROMA', 'OMAR', 'MORA', 'ESPONJA', 'RAMO', 'JAPONES', 'ARMO',
'MOJAN', 'MARO', 'ORAM', 'MONJA', 'ALEXIS'];
let sameWordsGroup =['AMOR', 'XISELA', 'JAMON', 'ROMA', 'OMAR', 'MORA', 'ESPONJA', 'RAMO', 'JAPONES', 'ARMO',
'MOJAN', 'MARO', 'ORAM', 'MONJA', 'ALEXIS'];
let printObject = {};

for (let word of wordsGroup) {
    let wordAsArray = word.split("");
    printObject[word] = [];
    for (let sameWord of sameWordsGroup) {
        let sameWordArray = sameWord.split("");
        let match = false;
        if (word !== sameWord) {
            match = wordAsArray.every(element => sameWordArray.includes(element));
        } // end if
        if (match) {
            printObject[word].push(sameWord);
        } // end if
    } // end for
} // end for

console.log(printObject);