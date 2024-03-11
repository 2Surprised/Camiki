const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { nasaAPIkey } = require('../../config.json')

const apodEmbed = new EmbedBuilder()
    .setAuthor({
        name : 'Camiki',
        iconURL: 'https://cdn.discordapp.com/attachments/1200510427306676264/1212693699675557908/image.png'
    })
    .setTitle('Astronomy Picture of the Day')
    .setColor('#ff57f6')
    .setFooter({ text: 'Have a nice day!' });

module.exports = {

    data: new SlashCommandBuilder()
        .setName('apod')
        .setDescription('Fetches the latest Astronomy Picture of the Day (APOD).'),

    async execute(interaction) {

        const response = fetch(`https://api.nasa.gov/planetary/apod?api_key=${nasaAPIkey}`)
            .then(response => {
                if (!response.ok) throw new Error('Invalid response.');
                return response.json();
            })
            .then(data => {
                if (data.media_type === 'image') {

                    apodEmbed
                    .setTitle(data.title)
                    .setDescription(`${data.explanation}\n${data.copyright}${data.date}`)
                    .setImage(data.url)

                    interaction.reply({ embeds: [apodEmbed] })

                }
            })
            .catch(error => {
                console.error('Error:', error)
            });

    }

}