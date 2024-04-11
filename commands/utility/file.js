const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const consumers = require('stream/consumers');
const fs = require('node:fs');
const { spawn } = require('node:child_process');
const Ffmpeg = require('@ffmpeg-installer/ffmpeg');
const cpuLimit = require('cpulimit');
const { splitText } = require('../../utilities/text.js')

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
        )
        .addSubcommand(command => command
            .setName('text')
            .setDescription('Split up the contents of a TXT file and send them as separate messages.')
            .addAttachmentOption(attachment => attachment
                .setName('text-file')
                .setDescription('The TXT file you want to split up.')
                .setRequired(true)
            )
        ),

    async execute(interaction) {
        const subcommandGroup = interaction.options.getSubcommandGroup();
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'convert') {
            await interaction.deferReply()
                .catch(error => console.error(error));

            const errorDefault = 'Something went wrong, try again!';
            const errorAdvice = '\n\nIf issues persist, then the desired file format might not be compatible with the uploaded attachment, or the file size might be too large for Camiki to reupload.';
    
            const userAttachment = interaction.options.getAttachment('from');
            const attachedURL = userAttachment.url;
            const originalMediaType = userAttachment.contentType.split('/').slice(0, 1).join('');
            const originalFormat = userAttachment.name.split('.').slice(-1).join('').toLowerCase();
            const wantedFormat = interaction.options.getString('to').toLowerCase();
            const finalName = `${userAttachment.name.split('.').slice(0, -1).join('')}.${wantedFormat}`;
    
            const pathToStore = 'Related/TempFiles/';
            const temporaryName = Date.now();
            const inputName = `${temporaryName}.${originalFormat}`;
            const outputName = `${temporaryName}.${wantedFormat}`;
            const inputPath = pathToStore + inputName;
            const outputPath = pathToStore + outputName;

            const cpuLimitOptions = {
                limit: 20, // CPU usage percentage
                includeChildren: true
            };

            try {

                let currentTime;
                function getTimeElapsed() {
                    return currentTime = `${((Date.now() - currentTime) / 1000).toFixed(2)}s`;
                };
    
                // Downloads the attachment
                const response = await fetch(attachedURL);
                const buffer = await consumers.buffer(response.body);
                fs.writeFileSync(inputPath, buffer);
    
                // ffmpeg causing TONS of duplicated frames for videos, this deletes them if input is a video
                let arguments = '';
                if (originalMediaType === 'video') {
                    // vsync has been deprecated
                    // arguments = '-vf mpdecimate -fps_mode vfr';
                    arguments = '-vf mpdecimate -vsync vfr';
                };
    
                // Spawns a child process that runs the ffmpeg command in a shell environment
                const ffmpegProcess = spawn(Ffmpeg.path, ['-i', inputName, arguments, outputName], { cwd: pathToStore, shell: true });
                
                // Limits the total CPU usage of the child process
                cpuLimitOptions.pid = ffmpegProcess.pid;
                cpuLimit.createProcessFamily(cpuLimitOptions, (error, processFamily) => {
                    if (error) { throw error };
                    cpuLimit.limit(processFamily, cpuLimitOptions, (error) => {
                        if (error) { throw error };
                    });
                });

                ffmpegProcess.stderr.once('data', data => {
                    currentTime = Date.now();
                    interaction.followUp(`Your file has begun processing since <t:${Math.trunc(currentTime / 1000)}:R>!`);
                });
        
                ffmpegProcess.on('close', code => {
    
                    if (code !== 0) {
                        interaction.editReply({ content: `Sorry, the conversion has failed! (${getTimeElapsed()}) ${errorAdvice}` });
                        fs.unlink(inputPath, (error) => { if (error) { throw error }; });
                        return;
                    };
    
                    const convertedFile = new AttachmentBuilder().setFile(outputPath).setName(`${finalName}`);
                    interaction.editReply({
                        content: `Here is the original ${originalFormat.toUpperCase()} file after conversion, in ${wantedFormat.toUpperCase()} format! (${getTimeElapsed()})`,
                        files: [convertedFile]
                    })
                        .then(response => {
                            fs.unlink(inputPath, (error) => { if (error) { throw error }; });
                            fs.unlink(outputPath, (error) => { if (error) { throw error }; });
                        })
                        .catch(error => {
                            console.error(error);
                            interaction.editReply({ content: `${errorDefault} (${getTimeElapsed()}) ${errorAdvice}` });
                        });
    
                });
    
            } catch (error) {
                console.error(error);
                interaction.followUp(`${errorDefault} (${getTimeElapsed()}) ${errorAdvice}`);
                fs.unlink(inputPath, (error) => { if (error) { throw error }; });
            };
        } else if (subcommand === 'text') {
            await interaction.deferReply()
                .catch(error => console.error(error))

            // Retrieves the URL of the file
            const userAttachment = interaction.options.getAttachment('text-file')
            const attachedURL = userAttachment.url
            const originalFormat = userAttachment.name.split('.').slice(-1).join('').toLowerCase()
            const temporaryName = Date.now()
            const pathToStore = 'Related/TempFiles/'
            const inputName = `${temporaryName}.${originalFormat}`
            const inputPath = pathToStore + inputName

            // Returns an error if the file is not a TXT file
            if (originalFormat !== 'txt') {
                interaction.followUp({ content: 'Sorry, the file must be a TXT file.', ephemeral: true })
                return;
            }

            // Downloads the attachment
            const response = await fetch(attachedURL);
            const buffer = await consumers.buffer(response.body);
            fs.writeFileSync(inputPath, buffer);
            let data = ''

            // Parses the TXT file
            try {
                data = fs.readFileSync(`${inputPath}`, 'utf8')
            } catch (error) {
                console.error(error)
            }
            const arrayOfText = splitText(data, 2000)
            
            // Sends the contents of the TXT file back as separate messages
            setTimeout(() => {
                for (const textSnippet of arrayOfText) {
                    interaction.followUp({ content: `${textSnippet}` })
                }
            }, 1000)

            // Deletes the downloaded TXT file
            fs.unlink(inputPath, (error) => { if (error) { throw error } })
        };

    },

};