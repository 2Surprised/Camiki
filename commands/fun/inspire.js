const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const Jimp = require('jimp');

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
                const textBufferY = 16;
                let finalHeight = textBufferY;

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

                        // image.crop(
                        //     0,
                        //     finalHeight,
                        //     0,
                        //     imageHeight - finalHeight
                        // )

                        image.getBuffer(Jimp.MIME_PNG, (error, imageFile) => {
                            if (error) throw error;
                            interaction.reply({ files: [imageFile] });
                        });

                    });

                });

            })
            .catch(error => {
                console.error(error)
                interaction.reply({ content: 'Sorry, the API could not be reached. Try again!', ephemeral: true })
            })

    }

}