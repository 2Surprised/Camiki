const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GEMINI_API_KEY } = require('../../config.json');
const { splitText } = require('../../utilities/text.js')
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

module.exports = {

    data: new SlashCommandBuilder()
        .setName('gemini')
        .setDescription('Prompt Gemini from the comfort of Discord!')
        .addStringOption(string => string
            .setName('prompt')
            .setDescription('The prompt you wish to use.')
            .setRequired(true)
        ),

    async execute(interaction) {
        try {

            interaction.deferReply();

            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            const prompt = interaction.options.getString('prompt');
            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();
            const arrayOfText = splitText(text, 4096);

            for (let index = 0; index < arrayOfText.length; index++) {
                const textSnippet = arrayOfText[index];

                const embed = new EmbedBuilder()
                .setAuthor({
                    name : 'Camiki',
                    iconURL: 'https://cdn.discordapp.com/attachments/1200510427306676264/1212693699675557908/image.png'
                })
                .setColor('#ff57f6')
                .setDescription(`${textSnippet}`)
                .setFooter({ text: 'Powered by Gemini. Have a nice day!' });

                setTimeout(() => {
                    interaction.followUp({ embeds: [embed] })
                }, index * 1000) // Rate limits the followUps to every 1 second
            }

        } catch (error) {
            console.error(error);
            interaction.followUp('Sorry, Gemini\'s response couldn\'t be displayed, or it isn\'t supported.');
        }
    }
}
