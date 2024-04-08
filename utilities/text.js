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
    let whatIsX = ''

    // This will populate brokenUpTextWithinLimit[] with strings, except for the final alreadyInserted[]
    for (const textSnippet of textSnippets) {
        forEachTeXt(textSnippet)
    }

    // This will push the remaining strings in alreadyInserted[]
    combineTeXt()

    return brokenUpTextWithinLimit;





    // The combineText() function handles the logic which determines how strings in alreadyInserted[]
    // are combined together to be pushed as a single string into brokenUpTextWithinLimit[].

    function combineTeXt() {
        let toString = ''
        if (whatIsX === 'paragraph') {
            toString = alreadyInserted.join('\n\n')
        } else if (whatIsX === 'word') {
            toString = alreadyInserted.join(' ')
        } else {
            toString = alreadyInserted.join('')
        }
        brokenUpTextWithinLimit.push(toString)
    }

    // The forEachTeXt() function handles all the logic that processes the input text.
    // teXt (x) can be an entire paragraph of text, words within a paragraph, or characters of a word.

    function forEachTeXt(x) {

        // Determines the type of teXt currently being processed
        if (x.length === 1) {
            whatIsX = 'character'
        } else if (!x.includes(' ')) {
            whatIsX = 'word'
        } else {
            whatIsX = 'paragraph' // or sentence
        }
        
        console.log(`\n"${x}" is a ${whatIsX}`)

        // REDUCE:
        // If a single teXt is already over the limit, this splits the teXt up into multiple parts.
        // It then calls forEachTeXt() on each of the parts, making sure all strings are processed.
        if (x.length > characterLimit) {
            // Must be a paragraph or sentence, reduces to words
            if (whatIsX === 'paragraph') {
                console.log(`Reduced to words!`)
                const words = x.split(' ')
                for (const word of words) { forEachTeXt(word) }
            } else {
                // Must be a word, reduces to characters
                console.log(`Reduced to characters!`)
                const characters = x.split('')
                for (const character of characters) { forEachTeXt(character) }
            }
        }

        // RESTART:
        // If a teXt surpasses the limit when added with all the strings already inserted,
        // all the strings in alreadyInserted[] are pushed to brokenUpTextWithinLimit[], and the
        // current teXt will be passed into the forEachTeXt() function again to be processed properly.
        else if (x.length + lengthOfStringsAlreadyInserted > characterLimit) {
            console.log(`RESTART ${x.length + lengthOfStringsAlreadyInserted}`)
            // Pushes all currently stored strings
            combineTeXt()
            // Resets all values used in processing
            alreadyInserted.length = 0
            lengthOfStringsAlreadyInserted = 0
            // Continues the processing of teXt
            forEachTeXt(x)
        }

        // PUSH:
        // If a teXt doesn't surpass the limit when added with all the strings already inserted,
        // the teXt is inserted along with the rest of the strings in alreadyInserted[].
        else {
            console.log(`FINE ${x.length} + ${lengthOfStringsAlreadyInserted} = ${x.length + lengthOfStringsAlreadyInserted}`)
            alreadyInserted.push(x)
            lengthOfStringsAlreadyInserted += x.length
        }
    }

}

            // TODO: DOES NOT ACCOUNT FOR WHITESPACE DURING CALCULATIONS
            // TODO: DOES NOT ACCOUNT FOR DIFFERENT teXt TYPES

            // If a single X is already over the limit, splits X up into multiple parts (reduce)
            // If a single X surpasses the limit when added, inserts the rest and resets (restart)
            // If a single X doesn't surpass the limit when added, inserts it with the rest (push)

const testString = `stupid me lol\n\ndumbass\n\nThe gerund of a bla is I 27 omg what is your problem\n\nabsolutely hate everything that 34`

console.log(splitText(testString, 30))

module.exports = { splitText };