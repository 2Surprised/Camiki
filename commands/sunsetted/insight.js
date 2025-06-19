const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const Jimp = require('jimp');

const embed = new EmbedBuilder()
    .setAuthor({
        name : 'Camiki',
        iconURL: 'https://cdn.discordapp.com/attachments/1200510427306676264/1212693699675557908/image.png'
    })
    .setColor('#ff57f6')
    .setFooter({ text: 'Have a nice day!' });

const personalQuotes = [
    'Not everyone is born into a world of privilege and position, where they are not chained by the economical struggles that burden the rest of us.',
    'Passion is a flame that burns on a foundation of freedom, yet the human condition of many is poised atop a rocky ledge, ever close to tipping into the dark abyss below.',
    'No rational person would willfully submit themselves to a risky endeavor, when there exists an inherently better option, grounded upon the realities of human life. That is but a gamble only the rich can afford to bet on.',
    'We must appreciate all those that speak and act with a fiery passion, for they are often subject to underpayment and underappreciation, a life of toil for which they see no fruits, for their labor is but an accepted norm, and no psychological considerations are made for they who can no longer exert the force and effort demanded of them, from top and bottom.',
    'Live and let live, for we are but hatchlings in the same nest.',
    'It is only people who have no experience, who think that every problem has a simple and easy solution. These people are, more often than not, keyboard warriors, people who endlessly complain, yet idle and do nothing to help fight the fire they light up.',
    'A bad apple has no right representing the majority, yet everyone cherry picks examples of bad faith actors, while few go through the struggle of reforming society, even if through small acts of good faith.',
    'We are all human, surely we can work out our differences, and show our gratitude to the ones fighting for us all?',
    'Most of passion fall prey to the predator that is market forces.'
]

module.exports = {

    data: new SlashCommandBuilder()
        .setName('insight')
        .setDescription('Get an insightful quote.')
        .setIntegrationTypes(0, 1)
        .setContexts(0, 1, 2),

    async execute(interaction) {

        fetch(`https://api.fisenko.net/v1/quotes/en/random`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Invalid response.');
                };
                return response.json();
            })
            .then(data => {
                
                const imageWidth = 700;
                const imageHeight = 1000;
                const textBufferX = 20;
                const textBufferY = 12;
                const extraBottomBuffer = 2;
                let finalHeight = textBufferY + extraBottomBuffer;

                new Jimp(imageWidth, imageHeight, '#FFFFFF', (error, image) => {

                    if (error) throw error;
                    // Converted TTF to FNT using: https://ttf2fnt.com/
                    Jimp.loadFont('Related/Fonts/LexendDeca-Regular.fnt').then(font => {

                        image.print( // Deals with the main body of text
                            font,
                            textBufferX,
                            textBufferY,
                            `${data.text}`,
                            imageWidth - (textBufferX * 2),
                            imageHeight - (textBufferY * 2),

                            (error, image, {x, y}) => {
                                if (error) throw error;

                                image.print( // Deals with the display of the author's name
                                    font,
                                    -textBufferX,
                                    y + 10,
                                    { text: `- ${data.author.name}`, alignmentX: Jimp.HORIZONTAL_ALIGN_RIGHT },
                                    imageWidth,
                                    imageHeight,

                                    (error, image, {x, y}) => {
                                        if (error) throw error;
                                        finalHeight += y
                                    }
                                )
                            }
                        )

                        image.crop(0, 0, imageWidth, finalHeight);
                        image.getBuffer(Jimp.MIME_PNG, (error, imageFile) => {
                            if (error) throw error;

                            const quotesImage = new AttachmentBuilder()
                            .setFile(imageFile)
                            .setName('image.png');
                            const replyEmbed = embed
                            .setDescription('Dictums are submitted by the public, so expect variation in response quality and standard, and exercise substantiation.')
                            .setImage('attachment://image.png')
                            .setFooter({ text: 'Data courtesy of the Dictum API. Have a nice day!' });
                            interaction.reply({ embeds: [replyEmbed], files: [quotesImage] });
                        });

                    });

                });

            })
            .catch(error => {
                console.error(error)
                interaction.reply({ content: 'Sorry, the API could not be reached. Try again!', ephemeral: true })
            })

    },

};