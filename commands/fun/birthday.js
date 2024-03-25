const { SlashCommandBuilder } = require('discord.js')

module.exports = {

    data: new SlashCommandBuilder()
        .setName('birthday')
        .setDescription('Wish someone a happy birthday!')
        .addUserOption(user => user
            .setName('user')
            .setDescription('The lucky birthday person!')
        ),

    async execute(interaction) {

        

    }

}