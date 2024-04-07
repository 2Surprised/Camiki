function splitText(inputText, paragraphLimit = 2000) {
    if (typeof inputText !== 'string') { throw new Error('The input text must be a string.') }
    if (typeof paragraphLimit !== 'number') { throw new Error('The limit must be a number.') }

    // Simply returns input if under the limit
    if (inputText.length <= limit) { return [inputText] }

    function splitWithParagraphs(textSnippet) {
        const paragraphs = textSnippet.split('\n\n')
        const brokenUpTextWithinLimit = []

        for (const paragraph of paragraphs) {
            
        }
    }

    function splitWithoutParagraphs(textSnippet) {
        const words = textSnippet.split(' ')
        const wordsArray = []
        const lengthOfWordsArray = 0

        for (const word of words) {
            if (word > paragraphLimit) {
                throw new Error('One of the inputted words reached the limit specified.')
            } else if (lengthOfWordsArray + word.length >= paragraphLimit) {

            }
        }
    }

}

const testString = `
stupid me lol\n\ndumbass\n\nThe gerund of a bla is I 27\n\nabsolutely hate everything that 34`

console.log(splitText(testString, 30))

module.exports = { splitText };