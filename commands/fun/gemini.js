const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GEMINI_API_KEY } = require('../../config.json');
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

            const model = genAI.getGenerativeModel({ model: "gemini-pro"});
            const chat = model.startChat();
            const message = interaction.options.getString('prompt');
            const result = await chat.sendMessage(message);
            const response = await result.response;
            const text = response.text();

            const embed = new EmbedBuilder()
                .setAuthor({
                    name : 'Camiki',
                    iconURL: 'https://cdn.discordapp.com/attachments/1200510427306676264/1212693699675557908/image.png'
                })
                .setColor('#ff57f6')
                .setDescription(`${text}`)
                .setFooter({ text: 'Powered by Gemini. Have a nice day!' });
            
            interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.log(error);
            interaction.followUp('Sorry, Gemini\'s response couldn\'t be displayed, or it isn\'t supported.');
        }
    }
}