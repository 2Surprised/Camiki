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
    let isVeryFirstTextSnippet = true // Whether this is the very first textSnippet to be processed

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
        whatWasX === 'paragraph' ? toString = alreadyInserted.join('\n\n') : // if teXt is a paragraph
        whatWasX === 'word' ? toString = alreadyInserted.join(' ') : // if teXt is a word
        toString = alreadyInserted.join('') // else teXt must be a character

        // Pushes all alreadyInserted[] strings to the final array as one string, if not empty
        if (toString) { brokenUpTextWithinLimit.push(toString) }
        // Resets all values used in processing
        alreadyInserted.length = 0
        lengthOfStringsAlreadyInserted = 0
    }

    // forEachTeXt()
    // The forEachTeXt() function handles all the logic that processes the input text.
    // teXt (x) can be an entire paragraph of text, words within a paragraph, or characters of a word.
    function forEachTeXt(x, isNewTextSnippet) {

        // Determines if the strings in alreadyInserted[] need to be pushed to brokenUpTextWithinLimit[]
        // so that different words won't be stuck together, but rather split up, regardless of the limit.
        if (isNewTextSnippet) {
            // If forEachTeXt has been passed a new textSnippet, it treats it as a paragraph by default.
            // This is because textSnippets is an array of string(s) divided along instances of '\n\n'.
            pushInsertedTeXt()
            whatIsX = 'paragraph'
            whatWasX = whatIsX
        } else if (whatIsX !== whatWasX) {
            // If the current teXt is different from the previous teXt, that means that the current
            // teXt belong to a new word that shouldn't be joined together with the word before.
            pushInsertedTeXt()
        }

        // REDUCE:
        // If a single teXt is already over the limit, this splits the teXt up into multiple parts.
        // It then calls forEachTeXt() on each of the parts, making sure all strings are processed.
        if (x.length > characterLimit) {
            if (whatIsX === 'paragraph') {
                // Must be a paragraph or sentence, reduces to words
                const words = x.split(' ')
                // Updates teXt types before the reduced teXt is processed
                whatWasX = whatIsX
                whatIsX = 'word'
                for (const word of words) { forEachTeXt(word, false) }
                // Updates teXt types after the reduced teXt is processed
                whatIsX = 'paragraph'
            } else {
                // Must be a word, reduces to characters
                const characters = x.split('')
                // Updates teXt types before the reduced teXt is processed
                whatWasX = whatIsX
                whatIsX = 'character'
                for (const character of characters) { forEachTeXt(character, false) }
                // Updates teXt types after the reduced teXt is processed
                whatIsX = 'word'
            }
        }

        // RESTART:
        // If a teXt surpasses the limit when added with all the strings already inserted,
        // all the strings in alreadyInserted[] are pushed to brokenUpTextWithinLimit[], and the
        // current teXt will be passed into the forEachTeXt() function again to be processed properly.
        else if (x.length + lengthOfStringsAlreadyInserted > characterLimit) {
            // Pushes all currently stored strings, then resets all values used in processing
            pushInsertedTeXt()
            // Continues the processing of teXt
            forEachTeXt(x, false)
        }

        // INSERT:
        // If a teXt doesn't surpass the limit when added with all the strings already inserted,
        // the teXt is inserted along with the rest of the strings in alreadyInserted[].
        else {
            let accountForWhitespace = 0

            // If the last teXt was a paragraph, the current teXt must belong to a new textSnippet (paragraph).
            // Therefore, to give the paragraphs the necessary distancing, 2 \n\n characters have to be added.
            if (whatWasX === 'paragraph' && !isVeryFirstTextSnippet) {
                alreadyInserted.push(`\n\n${x}`)
                accountForWhitespace += 2 // Adds two to account for 2 \n\n characters

            // This runs if the textSnippet is the very first (i.e. very first string) to be handled, so
            // there shouldn't be 2 preceding \n\n characters, as it doesn't have any preceding teXt.
            } else {
                isVeryFirstTextSnippet = false
                alreadyInserted.push(x)
            }

            // When joining strings in alreadyInserted[], whitespace between words have to be accounted for,
            // as well as \n\n characters between paragraphs, and no whitespace when joining characters
            whatIsX === 'word' ? accountForWhitespace += 1 :
            whatIsX === 'paragraph' ? accountForWhitespace += 2 : 0

            // Handles logic related to accounting for whitespace, so the character limit isn't exceeded
            lengthOfStringsAlreadyInserted += x.length + accountForWhitespace

            // Updates whatWasX before the next teXt is processed
            whatWasX = whatIsX
        }
    }
}

module.exports = { splitText };

// ------------------------------------------- TESTING -------------------------------------------

let testString = `Alright, let's do this again.

I'll start by assuming that:

- The number of players up to level 200 based on my previous calculations are correct. There are a total of 2,774 players with at least 200 levels, which sounds perfectly reasonable.
- There are a total of 80 players above level 400.

From level 200 to level 400, there are a total of 8 level milestones, level 225, 250, 275, 300, 325, 350, 375 and 400 itself. That gives us this new equation, where \`n\` is the percentage of players with the last level milestone as well as the next level milestone:`

const testArray = splitText(testString, 50)
const testJoined = testArray.join(' ')

console.log(testArray)
console.log(testJoined)