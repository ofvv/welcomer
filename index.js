require('dotenv').config();
const discord = require('discord.js');
const Canvas = require('canvas');
const imageapi = require('blueapi.js');

const client = new discord.Client({
  disableMentions: 'everyone'
})

client.on('ready', async () => {
  console.log([`Bot: ${client.user.username}`,`Welcome Channel: #${client.channels.cache.get(process.env.CHANNELID).name}`,`Welcome Server: ${client.channels.cache.get(process.env.CHANNELID).guild.name}`].join('\n'))
})

client.handleWelcome = async function(member, channel) {
  try {
    if (!member || !channel) return;
    const joinedusername = member.user.username.length > 11 ? member.user.username.substring(0, 11) : member.user.username;
    const canvas = Canvas.createCanvas(700, 250);
    const context = canvas.getContext('2d');
    context.font = '50px Sans';
    const background = await Canvas.loadImage(process.env.IMAGE);
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    const avatar = await Canvas.loadImage(await imageapi.image.circle(member.user.displayAvatarURL({
      format: 'jpg'
    })));
    context.drawImage(avatar, 25, 25, 200, 200);
    context.beginPath();
    context.strokeStyle = "white";
    context.lineWidth = 7;
    context.arc(122, 125, 99, 0, Math.PI * 2, true);
    context.stroke();
    context.closePath();
    context.beginPath();
    context.arc(122, 125, 99, 0, Math.PI * 2, true);
    context.closePath();
    context.fillStyle = '#ffffff';
    context.fillText(`Welcome`, canvas.width / 2.2, canvas.height / 2.7)
    context.fillText(`${joinedusername}#${member.user.discriminator}`, canvas.width / 2.5, canvas.height / 1.4)
    const attachment = new discord.MessageAttachment(canvas.toBuffer(), `welcome_${member.user.id}.png`);
    member.user.send(`**Welcome ${member} to \`${member.guild.name}\`**`, attachment).then(async msg => {
      let link = msg.attachments.first().url;
      const embed = new discord.MessageEmbed()
        .setImage(link)
        .setColor(process.env.COLOR || 'RANDOM')
        .setFooter(`You Are Member #${member.guild.memberCount}!`)
      channel.send(`**Welcome ${member} to \`${member.guild.name}\`**`, embed)
    })
  } catch (e) {}
}

client.on('guildMemberAdd', async member => {
  client.handleWelcome(member, client.channels.cache.get(process.env.CHANNELID))
})

client.login(process.env.TOKEN).catch(() => {console.log(`invalid token!`)})
