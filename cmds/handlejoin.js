const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require("../config.json");
const roblox = require('noblox.js')
const discord = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`handlejoin`)
        .setDescription(`Handle a join request in a group.`)
        .addStringOption(opt =>
            opt.setName(`username`)
            .setDescription(`Username of the user you want to accept.`)
            .setRequired(true)
        )
        .addBooleanOption(opt => 
            opt.setName('accept-deny')
            .setDescription(`true = accept, false = deny`)
            .setRequired(true)
        ),
    category: "ranking",
    async execute(interaction) {
        let usera = interaction.member.user.id
        if (!config.management.administrators.find(s => s == usera) && !config.management.lowerusers.find(s => s == usera)) return interaction.reply({ content: "You are not whitelisted to use this bot's administrative functions. Contact its owner if you feel this is a mistake.", ephemeral: true})
        let key = interaction.options.getNumber('group')
        let username = interaction.options.getString('username')
        let status = interaction.options.getBoolean('accept-deny')
        if (config.ranking.enabled == false) return interaction.reply({ content: `Ranking is currently not enabled. Please enable it in the bot's config.`, ephemeral: true })
        let groupObj = await roblox.getGroup(Number(key))
        let uID = await roblox.getIdFromUsername(username).catch(err => {
            return interaction.reply({ content: 'An error occurred while getting the user\'s ID.', ephemeral: true })
        })
        let joinreq = await roblox.getJoinRequest(key, uID).catch(err => {
            return interaction.reply({ content: 'An error occurred while getting the join request.', ephemeral: true })
        })
        if (!joinreq) return interaction.reply({ content: `This user is not pending.`, ephemeral: true })
        let realname = await roblox.getUsernameFromId(uID).catch(err => {
            return interaction.reply({ content: 'An error occurred while getting the user\'s proper username.', ephemeral: true })
        })
        if (status == true) {
            await roblox.handleJoinRequest(Number(key), uID, true).catch(err => {
                return interaction.reply({ content: 'An error occurred while accepting the join request.', ephemeral: true })
            })
            let iEmbed = new discord.MessageEmbed()
                .setTitle(`Success`)
                .setDescription(`${realname} has been accepted into ${groupObj.name}.`)
                .setColor('GREEN')
                .setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${uID}&width=420&height=420&format=png`)
                .setTimestamp()
            interaction.reply({ embeds: [iEmbed], ephemeral: true })
        } else {
            await roblox.handleJoinRequest(Number(key), uID, false).catch(err => {
                return interaction.reply({ content: 'An error occurred while denying the join request.', ephemeral: true })
            })
            let iEmbed = new discord.MessageEmbed()
                .setTitle(`Success`)
                .setDescription(`${realname} has been denied from joining ${groupObj.name}.`)
                .setColor('GREEN')
                .setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${uID}&width=420&height=420&format=png`)
                .setTimestamp()
            interaction.reply({ embeds: [iEmbed], ephemeral: true })
        }
    }
}