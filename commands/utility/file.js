const { SlashCommandBuilder } = require('discord.js');
const { spawn } = require('node:child_process');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('file')
        .setDescription('Commands related to files.')
        .addSubcommand(command => command
            .setName('convert')
            .setDescription('Convert a file to another format.')
            .addAttachmentOption(attachment => attachment
                .setName('from')
                .setDescription('The file to convert.')
                .setRequired(true)
            )
            .addStringOption(string => string
                .setName('to')
                .setDescription('The format to convert the file to. (e.g. mp4)')
                .setRequired(true),
            ),
        ),

    async execute(interaction) {

        const inputFile = interaction.options.getAttachment('from');
        const outputFile = 'output.mp4';
        const ffmpegCommand = `ffmpeg -i ${inputFile} ${outputFile}`;
        const ffmpegProcess = spawn(ffmpegCommand, { shell: true });

        console.log(inputFile);

        ffmpegProcess.stdin.on('data', data => {
            console.log('teehee')
            console.log(data);
        });

        ffmpegProcess.stderr.on('data', data => {
            console.error('FFmpeg Error:', data);
        });

        ffmpegProcess.on('close', code => {
            if (code === 0) {
                console.log('Conversion successful!');
            } else {
                console.log('Conversion failed.');
            };
        });

    },

};