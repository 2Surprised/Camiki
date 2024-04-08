// The splitText() function returns an array containing whole or parts of the text inputted as
// elements of the array. All elements in the returned array are strings that do not exceed the
// character limit specified. Use cases for this function include splitting up text into multiple
// chunks that can later be accessed from the returned array, to avoid character limits, for example.

function splitText(inputText, characterLimit) {
    if (typeof inputText !== 'string') { throw new Error('The input text must be a string.') }
    if (typeof characterLimit !== 'number') { throw new Error('The limit must be a number.') }
    if (characterLimit < 1) { throw new Error('The limit must be set to at least 1.') }
    if (!Number.isInteger(characterLimit)) { throw new Error('The limit must be an integer value.') }

    // Returns input text if it's under the limit
    if (inputText.length <= characterLimit) { return [inputText] }

    // Declares variables that are needed for text processing later
    const textSnippets = inputText.split('\n\n') // Splits text up into paragraphs if possible
    const brokenUpTextWithinLimit = [] // Final result to return
    const alreadyInserted = [] // Strings that will be added to the final result later on
    let lengthOfStringsAlreadyInserted = 0 // Length of all the strings in alreadyInserted[]
    let whatIsX = '' // Whether the current teXt is a paragraph/sentence, word, or character
    let whatWasX = '' // Whether the last teXt was a paragraph/sentence, word, or character

    // This will populate brokenUpTextWithinLimit[] with strings, except for the final alreadyInserted[]
    for (const textSnippet of textSnippets) { forEachTeXt(textSnippet, true) }
    // This will push the remaining strings in alreadyInserted[]
    pushInsertedTeXt()

    return brokenUpTextWithinLimit;

// ---------------------------------------- Functions Used ----------------------------------------

    // pushInsertedTeXt()
    // The pushInsertedTeXt() function handles the logic which determines how strings in alreadyInserted[]
    // are combined together to be pushed as a single string into brokenUpTextWithinLimit[].

    function pushInsertedTeXt() {
        let toString = ''

        // Joins all alreadyInserted[] strings together
        whatIsX === 'paragraph' ?
        toString = alreadyInserted.join('\n\n') : // if teXt is a paragraph
        whatIsX === 'word' ?
        toString = alreadyInserted.join(' ') : // if teXt is a word
        toString = alreadyInserted.join('') // else teXt must be a character

        // Pushes all alreadyInserted[] strings to the final array, if not empty
        if (toString) { brokenUpTextWithinLimit.push(toString) }

        // Resets all values used in processing
        alreadyInserted.length = 0
        lengthOfStringsAlreadyInserted = 0
    }

    // forEachTeXt()
    // The forEachTeXt() function handles all the logic that processes the input text.
    // teXt (x) can be an entire paragraph of text, words within a paragraph, or characters of a word.

    function forEachTeXt(x, isFirstExecution) {

        if (isFirstExecution) {
            // If forEachTeXt has been passed a new textSnippet, it treats it as a paragraph by default
            // This is because textSnippets is an array of string(s) divided along instances of '\n\n'
            pushInsertedTeXt()
            whatIsX = 'paragraph'
            whatWasX = whatIsX
            console.log('\n\n\nNEW TEXT SNIPPET\n\n\n')
        } else if (whatIsX === 'character' && x.length !== 1) {
            // If the teXt is presumed to be a character, but isn't 1 character long, then it must be a
            // word, specifically, a new word that shouldn't be joined together with the characters before.
            pushInsertedTeXt()
            whatIsX = 'word'
            console.log('\nNEW WORD\n')
        } else if (whatWasX === 'word' && whatIsX === 'character') {
            // If the teXt used to be a word, and now the teXt is characters, then those characters must
            // belong to a new word that shouldn't be joined together with the word before.
            pushInsertedTeXt()
            whatWasX = 'character'
            console.log('\nNEW WORD TROLOL\n')
        }
        
        console.log(`\n"${x}" is a ${whatIsX}, last one was ${whatWasX}`)

        // REDUCE:
        // If a single teXt is already over the limit, this splits the teXt up into multiple parts.
        // It then calls forEachTeXt() on each of the parts, making sure all strings are processed.
        if (x.length > characterLimit) {
            if (whatIsX === 'paragraph') {
                // Must be a paragraph or sentence, reduces to words
                console.log(`Reduced to words!`)
                const words = x.split(' ')
                whatWasX = whatIsX
                whatIsX = 'word'
                for (const word of words) { forEachTeXt(word, false) }
            } else {
                // Must be a word, reduces to characters
                console.log(`Reduced to characters!`)
                const characters = x.split('')
                whatWasX = whatIsX
                whatIsX = 'character'
                for (const character of characters) { forEachTeXt(character, false) }
            }
        }

        // RESTART:
        // If a teXt surpasses the limit when added with all the strings already inserted,
        // all the strings in alreadyInserted[] are pushed to brokenUpTextWithinLimit[], and the
        // current teXt will be passed into the forEachTeXt() function again to be processed properly.
        else if (x.length + lengthOfStringsAlreadyInserted > characterLimit) {
            console.log(`RESTART ${x.length + lengthOfStringsAlreadyInserted}`)
            // Pushes all currently stored strings, then resets all values used in processing
            pushInsertedTeXt()
            // Continues the processing of teXt
            forEachTeXt(x, false)
        }

        // PUSH:
        // If a teXt doesn't surpass the limit when added with all the strings already inserted,
        // the teXt is inserted along with the rest of the strings in alreadyInserted[].
        else {
            console.log(`FINE ${x.length} + ${lengthOfStringsAlreadyInserted} = ${x.length + lengthOfStringsAlreadyInserted}`)
            alreadyInserted.push(x)
            lengthOfStringsAlreadyInserted += (x.length + 
                (whatIsX === 'word' ? 1 : // If teXt is a word, adds one to account for whitespace between words
                whatIsX === 'paragraph' ? 2 : 0)) // If teXt is a paragraph, adds two to account for 2 \n characters
        }
    }

}

            // TODO: DOES NOT ACCOUNT FOR DIFFERENT teXt TYPES

            // If a single X is already over the limit, splits X up into multiple parts (reduce)
            // If a single X surpasses the limit when added, inserts the rest and resets (restart)
            // If a single X doesn't surpass the limit when added, inserts it with the rest (push)

const testString = `stupid me lol\n\ndumbass\n\nThe gerund of a bla is I 27 omg what is your problem\n\nabsolutely hate everything that 34`

console.log(splitText(testString, 4))

module.exports = { splitText };