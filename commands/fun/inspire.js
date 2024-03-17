const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const Jimp = require('jimp');

const embed = new EmbedBuilder()
    .setAuthor({
        name : 'Camiki',
        iconURL: 'https://cdn.discordapp.com/attachments/1200510427306676264/1212693699675557908/image.png'
    })
    .setColor('#ff57f6')
    .setFooter({ text: 'Have a nice day!' });

module.exports = {

    data: new SlashCommandBuilder()
        .setName('inspire')
        .setDescription('Get an inspirational quote.'),

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
                const imageHeight = 500;
                const textBufferX = 20;
                const textBufferY = 10;
                const extraBottomBuffer = 2;
                let finalHeight = textBufferY + extraBottomBuffer;

                new Jimp(imageWidth, imageHeight, '#FFFFFF', (error, image) => {

                    if (error) throw error;
                    Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(font => {

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
                            .setDescription('Dictums are submitted by the public, expect variation in response quality and standard, and exercise substantiation.')
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