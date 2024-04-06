function splitText(inputText, limit = 2000) {
    if (typeof inputText !== 'string') {
        throw new Error('The input text is not a string.');
    } else if (typeof limit !== 'number') {
        throw new Error('The limit must be a number.')
    }

    // regex logic
    
}

module.exports = { splitText }