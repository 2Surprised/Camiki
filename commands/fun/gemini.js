const { SlashCommandBuilder } = require('discord.js');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

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
        const gemini = genAI.getGenerativeModel({ model: "gemini-1.0-pro"});
        const chat = gemini.startChat();
        const message = interaction.options.getString('prompt');
        const response = await chat.sendMessage(message);
        console.log(response);
        await interaction.reply({ content: `${response.text()}` });
    }

}