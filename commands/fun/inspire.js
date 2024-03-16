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
                
                new Jimp(1000, 500, '#FF00FF', (error, image) => {

                    if (error) throw error;
                    Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(font => {
                        image.print(font, 200, 200, 'Hello world!')
                        image.getBuffer(Jimp.MIME_PNG, (error, imageFile) => {
                            if (error) throw error;
                            interaction.reply({ files: [imageFile] })
                        });
                    });

                });

            })

    }

}