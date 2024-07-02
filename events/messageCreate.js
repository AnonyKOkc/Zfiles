const {
  EmbedBuilder,
  Collection,
  PermissionsBitField,
  ButtonBuilder,
  ActionRowBuilder,
} = require("discord.js");
const ms = require("ms");
const client = require("..");
const db = require("quick.db")


const prefix = client.prefix;
const cooldown = new Collection();

client.on("messageCreate", async (message) => {
  if (message.channel.type == 1) return;

  if (message.content === "event") {
    if (!message.member.permissions.has("Administrator"))
      return message.reply({ content: "> Error: אין לך גישה לפקודה זו" });

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setAuthor({
        name: message.guild.name,
        iconURL: message.guild.iconURL({ dynamic: true }),
      })
      .setDescription("**לחץ על הכפתור כדי להישתתף באיוונט**")
      .setFooter({
        text: message.guild.name,
        iconURL: message.guild.iconURL({ dynamic: true }),
      });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("openroom")
        .setLabel("Open")
        .setStyle(ButtonStyle.Primary)
    );
    message.channel.send({ embeds: [embed], components: [row] });
  }

    // anti link
  if (message.content.includes("discord.gg" || "http" || "https")) {
    if (message.member.permissions.has("Administrator")) return;
    db.add(message.author.id, 1)
    if (db.get(message.author.id) == 3) {
      message.member.timeout(6000 * 10 * 5)
    } else if (db.get(message.author.id) == 10) {
      message.member.ban()
      db.set(message.author.id, 0)
    }
    const memberId = message.author.id;
    const logChannel = message.guild.channels.cache.get(process.env.antiLinkLogs)
    logChannel.send({ embeds: [new EmbedBuilder()
    .setDescription(`${message.author} sent a link (${message.content}) in ${message.channel} warn number ${db.get(memberId)}.`)
    ] })

    message.delete();

    const embed = new EmbedBuilder()
      .setDescription(
        "You can't send links here! Only `Administrator` can send. You have been warnned" + ` \`\`${db.get(memberId)}\`\`th`
      )
      .setColor("Blue")
      .setTimestamp();

    message.channel.send({ embeds: [embed] }).then((msg) => {
      setTimeout(() => {
        msg.delete();
      }, 5000);
    });
  }
  // anti link finished


  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if (cmd.length == 0) return;
  let command = client.commands.get(cmd);
  if (!command) command = client.commands.get(client.aliases.get(cmd));

  if (command) {
    if (command.cooldown) {
      if (cooldown.has(`${command.name}${message.author.id}`))
        return message.channel.send({
          content: "You are on `<duration>` cooldown!".replace(
            "<duration>",
            ms(
              cooldown.get(`${command.name}${message.author.id}`) - Date.now(),
              { long: true }
            )
          ),
        });
      if (command.userPerms || command.botPerms) {
        if (
          !message.member.permissions.has(
            PermissionsBitField.resolve(command.userPerms || [])
          )
        ) {
          const userPerms = new EmbedBuilder()
            .setDescription(
              `🚫 ${message.author}, You don't have \`${command.userPerms}\` permissions to use this command!`
            )
            .setColor("Red");
          return message.reply({ embeds: [userPerms] });
        }
        if (
          !message.guild.members.cache
            .get(client.user.id)
            .permissions.has(
              PermissionsBitField.resolve(command.botPerms || [])
            )
        ) {
          const botPerms = new EmbedBuilder()
            .setDescription(
              `🚫 ${message.author}, I don't have \`${command.botPerms}\` permissions to use this command!`
            )
            .setColor("Red");
          return message.reply({ embeds: [botPerms] });
        }
      }

      command.run(client, message, args);
      cooldown.set(
        `${command.name}${message.author.id}`,
        Date.now() + command.cooldown
      );
      setTimeout(() => {
        cooldown.delete(`${command.name}${message.author.id}`);
      }, command.cooldown);
    } else {
      if (command.userPerms || command.botPerms) {
        if (
          !message.member.permissions.has(
            PermissionsBitField.resolve(command.userPerms || [])
          )
        ) {
          const userPerms = new EmbedBuilder()
            .setDescription(
              `🚫 ${message.author}, You don't have \`${command.userPerms}\` permissions to use this command!`
            )
            .setColor("Red");
          return message.reply({ embeds: [userPerms] });
        }

        if (
          !message.guild.members.cache
            .get(client.user.id)
            .permissions.has(
              PermissionsBitField.resolve(command.botPerms || [])
            )
        ) {
          const botPerms = new EmbedBuilder()
            .setDescription(
              `🚫 ${message.author}, I don't have \`${command.botPerms}\` permissions to use this command!`
            )
            .setColor("Red");
          return message.reply({ embeds: [botPerms] });
        }
      }
      command.run(client, message, args);
    }
  }
});
