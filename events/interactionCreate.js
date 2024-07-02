const {
  ButtonBuilder,
  EmbedBuilder,
  Collection,
  ActionRowBuilder,
  PermissionsBitField,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  StringSelectMenuBuilder,
  ChannelType,
} = require("discord.js");
const ms = require("ms");
const client = require("..");
require("dotenv").config();
const db = require("quick.db");

const moment = require("moment")

const cooldown = new Collection();








client.on("interactionCreate", async (interaction) => {
  if (interaction.channel.type == 1) return;

  if (interaction.customId === "a") {
    const embed = new EmbedBuilder()
    .setAuthor({ name: `Rules`, iconURL: interaction.guild.iconURL({ dynamic: true }),})
    .setDescription(`
    ZenoN Shop
    : בעברית
    
    חוקי קנייה- ZenoN Shop
    • אין לקבל החזר כספי
    
    • אין לעשות ריפאונד אחרי העברה בפייפאל
    
    • אמצעי התשלום הינם:פייפאל
    
    • אין להדליף שום דבר אשר נקנה מהחנות
    
    •ברגע שאתה קונה משהו זה אומר שהסכמת על כל החוקים פה
    
    • צוות השרת יכולים לשנות את התקנון
    
    • בעת העברה בפייפאל יש לרשום את המשפט הבא: ״This is a payment for a service that has been done. Charging back or refund cannot be possible for me and it will be considered fraud.״
    מי שיעביר בלי לרשום לא יקבל את מה שהוא רוצה אלא רק אחרי 3 ימים
    
    English :
    
    Buying rules - ZenoN Shop
    
    The authority store
    Buying rules - ZenoN Shop
    • Do not receive a refund
    
    • Do not make a refund after a PayPal transfer
    
    • The payment methods are: Bit/PayPal/Paybox
    
    • Do not leak anything bought from the store
    
    • As soon as you buy something, it means that you have agreed to all the rules here
    
    • The server team to change the regulations
    
    • When transferring via PayPal, the following sentence must be written: "This is a payment for a service rendered. A chargeback or refund cannot be possible for me and it would be considered fraud."
    Those who transfer without registering will not receive the ha they want only after 3 days
    
    Best regards,ZenoN Shop management
    
    בברכה, הנהלת ZenoN Shop`)
   return interaction.reply({embeds: [embed],ephemeral: true})
  }


  const applications = new Map();
  const staffApplicationChannelId = process.env.applicationLogs;
  const logsChannelId = process.env.applicationLogs;
  const usersWithPassedExams = new Set();
  if (interaction.customId === "start_application") {
    if (applications.has(interaction.user.id)) {
      return interaction.reply({
        content: "You already have an ongoing application.",
        ephemeral: true,
      });
    }
    interaction.reply({
      content: "Check DM",
      ephemeral: true,
    });

    applications.set(interaction.user.id, { questions: [], answers: [] });

    const questions = [
      "שם פרטי?",
      "שם משפחה?",
      "גיל?",
      "כמה שעות תוכל לתת ביום?",
      "מ 1-10 כמה תוכל להיות פעיל?",
      "היית פעם צוות, אם כן פרט?",
      "האם תהיה פנוי בשעות הפעילות?",
      "למה אתה חושב שאתה מתאים?",
    ];

    const dmChannel = await interaction.user.createDM();

    for (const question of questions) {
      const embed = new EmbedBuilder()
        .setDescription(question)
        .setColor("Green");
      await dmChannel.send({ embeds: [embed] });
      const response = await dmChannel.awaitMessages({
        max: 1,
        time: 60000,
        errors: ["time"],
      });
      applications.get(interaction.user.id).questions.push(question);
      applications
        .get(interaction.user.id)
        .answers.push(response.first().content);
    }

    const applicationEmbed = new EmbedBuilder()
      .setTitle(`${interaction.user.tag}'s Staff Application`)
      .setDescription(
        applications
          .get(interaction.user.id)
          .questions.map(
            (q, index) =>
              `**${q}**\n${
                applications.get(interaction.user.id).answers[index]
              }`
          )
          .join("\n\n")
      )
      .setFooter({ text: interaction.user.id });

    const staffApplicationChannel = client.channels.cache.get(
      staffApplicationChannelId
    );
    const logsChannel = client.channels.cache.get(logsChannelId);
    const hasPassedExam = usersWithPassedExams.has(interaction.user.id);
    if (staffApplicationChannel && logsChannel) {
      const acceptButton = new ButtonBuilder()
        .setCustomId("accept_application")
        .setLabel("Accept")
        .setStyle("Success");

      const denyButton = new ButtonBuilder()
        .setCustomId("deny_application")
        .setLabel("Deny")
        .setStyle("Danger");

      const row = new ActionRowBuilder().addComponents(
        acceptButton,
        denyButton
      );

      const submissionMessage = await dmChannel.send({
        content: "הטופס הוגש בהצלחה!",
      });

      const components = hasPassedExam ? [] : [row];

      await staffApplicationChannel.send({
        embeds: [applicationEmbed],
        components: components,
      });

      applications.get(interaction.user.id).submissionMessage =
        submissionMessage.id;
    } else {
      await dmChannel.send("נסה מאוחר יותר.");
    }
  }
  if (interaction.customId === "accept_application") {
    if (!interaction.member.permissions.has("Administrator")) {
      return interaction.reply({
        content: "אין לך גישה לאשר טפסים.",
        ephemeral: true,
      });
    }
    const userID = interaction.message.embeds[0].footer.text;
    const user = (await client.users.fetch(userID))
    const guild = client.guilds.cache.get(process.env.guild);
    const role = guild.roles.cache.get(process.env.staff);
    const member = guild.members.cache.get(user.id);

    if (role && member) {
      await member.roles.add(role);
    }

    const acceptButton = new ButtonBuilder()
      .setCustomId("accept_application")
      .setLabel("Accept")
      .setStyle("Success")
      .setDisabled(true);

    const denyButton = new ButtonBuilder()
      .setCustomId("deny_application")
      .setLabel("Deny")
      .setStyle("Danger")
      .setDisabled(true);

    const row = new ActionRowBuilder().addComponents(acceptButton, denyButton);
    await interaction.message.edit({
      components: [row],
    });
    user.send("יפה מאוד, עברת את הבחינה!");

    interaction.reply({
      content: `הטופס של ${user.tag} אושר.`,
      ephemeral: true,
    });
  }
if (interaction.customId === "deny_application") {
    if (!interaction.member.permissions.has("Administrator")) {
      return interaction.reply({
        content: "אין לך גישה לאשר טפסים.",
        ephemeral: true,
      });
    }
    const userID = interaction.message.embeds[0].footer.text;
    const acceptButton = new ButtonBuilder()
      .setCustomId("accept_application")
      .setLabel("Accept")
      .setStyle("Success")
      .setDisabled(true);

    const denyButton = new ButtonBuilder()
      .setCustomId("deny_application")
      .setLabel("Deny")
      .setStyle("Danger")
      .setDisabled(true);

    const row = new ActionRowBuilder().addComponents(acceptButton, denyButton);
    await interaction.message.edit({
      components: [row],
    });
    (await client.users.fetch(userID)).send("מצטערים אבל לא עברת.");

    interaction.reply({
      content: `הטופס של ${(await client.users.fetch(userID)).tag} נדחה.`,
      ephemeral: true,
    });
  }

  if (interaction.customId === "openroom") {
    const user = interaction.user;
    interaction.guild.channels.cache.forEach((channel) => {});

    const embed3 = new EmbedBuilder()
      .setColor("Blue")
      .setDescription(`החדר שלך נפתח בהצלחה!`);
    await interaction.reply({ embeds: [embed3], ephemeral: true });

    const category = "1170476928021569566";
    const channel2 = await interaction.guild.channels.create({
      name: `${user.username}`,
      type: ChannelType.GuildText,
      parent: `${category}`,
    });

    channel2.permissionOverwrites.create(interaction.user.id, {
      ViewChannel: true,
      SendMessages: false,
    });
    channel2.permissionOverwrites.create(interaction.guild.id, {
      ViewChannel: true,
      SendMessages: false,
    });

    channel2.send({ content: `**${user}מישתתף באיוונט**` }).then((msg) => {
      msg.react("✅");
    });
  }

  if (interaction.customId === "Claim_ticket") {
    const PermissionLessEmbed = new EmbedBuilder()
      .setDescription(`**This is for the staff!**`)
      .setAuthor({
        name: interaction.guild.name,
        iconURL: interaction.guild.iconURL(),
      })
      .setColor(process.env.color)
      .setFooter({
        text: process.env.footer,
        iconURL: process.env.logo,
      })
      .setImage(process.env.banner)
      .setTimestamp();

    if (!interaction.member.permissions.has("ManageMessages"))
      return interaction.reply({
        embeds: [PermissionLessEmbed],
        ephemeral: true,
      });
    const existingComponents = interaction.message.components[0].components;

    const claimButtonIndex = existingComponents.findIndex(
      (component) => component.customId === "Claim_ticket"
    );

    if (claimButtonIndex !== -1) {
      existingComponents[claimButtonIndex] = new ButtonBuilder()
        .setStyle("Danger")
        .setLabel("Already Claimed")
        .setEmoji("<:8974480973225000961:994596843642159194>")
        .setCustomId("Claimed")
        .setDisabled(true);

      interaction.message.edit({
        components: [
          new ActionRowBuilder().addComponents(...existingComponents),
        ],
      });

      const embed3 = new EmbedBuilder()
        .setDescription(`**${interaction.user} מטפל בטיקט!**`)
        .setColor(process.env.color)
        .setFooter({
          text: process.env.footer,
          iconURL: process.env.logo,
        })
        .setImage(process.env.banner)
        .setTimestamp();

      db.add(`Claimes_${interaction.user.id}`, 1);

      interaction.channel.send({
        embeds: [embed3],
      });
    }
  }

  if (interaction.customId === "verify") {
    const role = interaction.guild.roles.cache.get(process.env.roleid);
    interaction.member.roles.add(role);

    const embed = new EmbedBuilder()
      .setTitle(interaction.guild.name)
      .setThumbnail(process.env.logo)
      .setDescription(`Successfully got ${role}`)
      .setColor(process.env.color)
      .setFooter({ text: process.env.footer, iconURL: process.env.logo })
      .setTimestamp();

    interaction.reply({ embeds: [embed], ephemeral: true });
  }

  if (interaction.customId === "accepted") {
    const data = await db.get(`accepted_${interaction.message.id}.users`);
    const data_denied = await db.get(`denied_${interaction.message.id}.users`);
    if (data.includes(interaction.user.id)) {
      return interaction.reply({
        content: "You cannot vote twice",
        ephemeral: true,
      });
    }
    if (data_denied.includes(interaction.user.id)) {
      return interaction.reply({
        content: "You cannot vote twice",
        ephemeral: true,
      });
    }
    const new_data = await db.push(
      `accepted_${interaction.message.id}.users`,
      interaction.user.id
    );

    var amount = new_data.users.length;
    interaction.message.components[0].components[0].data.label = `/ ${amount}`;
    interaction.message.edit({ components: interaction.message.components });
    interaction.reply({ content: "You successfully voted!", ephemeral: true });
  }

  if (interaction.customId === "VoteList") {
    let sugUpVote = `accepted_${interaction.message.id}`;
    let sugDownVote = `denied_${interaction.message.id}`;
    let dvoteusers = [];
    let adownvote = await db.get(`${sugDownVote}.users`);

    for (let i = 0; i < adownvote.length; i++) {
      dvoteusers.push(`<@${adownvote[i]}>`);
    }
    let uvoteusers = [];
    let aupvote = await db.get(`${sugUpVote}.users`);
    for (let i = 0; i < aupvote.length; i++) {
      uvoteusers.push(`<@${aupvote[i]}>`);
    }

    let VoteList = new EmbedBuilder()
      .setAuthor({
        name: interaction.guild.name,
        iconURL: interaction.guild.iconURL({
          dynamic: true,
        }),
      })
      .setColor(process.env.color)
      .setTitle("Vote List")
      .setFooter({
        text: `${interaction.user.username}`,
        iconURL: interaction.guild.iconURL(),
      })
      .addFields(
        {
          name: "For",
          value: `${uvoteusers.join("\n") || "None"}`,
          inline: true,
        },
        {
          name: "Against",
          value: `${dvoteusers.join("\n") || "None"}`,
          inline: true,
        }
      )
      .setFooter({
        text: process.env.footer,
        iconURL: process.env.logo,
      })
      .setImage(process.env.banner)
      .setTimestamp();
    await interaction
      .reply({ embeds: [VoteList], ephemeral: true })
      .catch((err) => []);
  }

  if (interaction.customId === "denied") {
    const data = await db.get(`accepted_${interaction.message.id}.users`);
    const data_denied = await db.get(`denied_${interaction.message.id}.users`);
    if (data.includes(interaction.user.id)) {
      return interaction.reply({
        content: "You cannot vote twice",
        ephemeral: true,
      });
    }
    if (data_denied.includes(interaction.user.id)) {
      return interaction.reply({
        content: "You cannot vote twice",
        ephemeral: true,
      });
    }
    const new_data = await db.push(
      `denied_${interaction.message.id}.users`,
      interaction.user.id
    );

    var amount = new_data.users.length;
    interaction.message.components[0].components[1].data.label = `/ ${amount}`;
    interaction.message.edit({ components: interaction.message.components });
    interaction.reply({ content: "You successfully voted!", ephemeral: true });
  }

  if (interaction.customId == "ticket") {
    const user = interaction.user;
    const ticket = client.guilds.cache
      .get(interaction.guildId)
      .channels.cache.find((channel) => {
        channel.topic == `${user.id}`;
      });

    if (ticket) {
      return interaction.reply({
        content: `You already have ticket <#${ticket.id}>`,
        ephemeral: true,
      });
    }
    const embed = new EmbedBuilder()
      .setDescription(`\`\`\`Choose a ticket category\`\`\``)
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setColor(process.env.color)
      .setFooter({
        text: interaction.guild.name,
        iconURL: interaction.guild.iconURL(),
      })
      .setTimestamp();

    const options = [
      {
        label: "Question",
        value: "question",
      },
      {
        label: "Other",
        value: "other",
      },
       {
        label: "buy",
        value: "buy",
      },
    ];

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("menu")
      .setPlaceholder("Select Menu")
      .setOptions(options);

    const ticketMenuOptions = new ActionRowBuilder().addComponents(selectMenu);

    await interaction.reply({
      embeds: [embed],
      components: [ticketMenuOptions],
      ephemeral: true,
    });
  }



  if (interaction.customId == "menu") {
    const ticket = client.guilds.cache
      .get(interaction.guildId)
      .channels.cache.find(
        (channel) => channel.topic == `${interaction.user.id}`
      );

    if (ticket) {
      return interaction.reply({
        content: `You already have a <#${ticket.id}>`,
        ephemeral: true,
      });
    }
    const channel = await interaction.guild.channels.create({
      name: `${interaction.user.username}・${interaction.values[0]}`,
      type: "text",
      parent: process.env.ticketCategoryId,
      topic: interaction.user.id,
      permissionOverwrites: [
        {
          id: interaction.user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        },
        {
          id: interaction.guild.roles.everyone,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.guild.roles.cache.get(process.env.staff),
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
            PermissionsBitField.Flags.ManageMessages,
          ],
        },
      ],
      type: ChannelType.GuildText,
    });


    

    const sendTicketEmbed = new EmbedBuilder()
      .setAuthor({
        name: interaction.guild.name,
        iconURL: interaction.guild.iconURL(),
      })
      .setDescription(
        `\`\`\`Please wait for a staff member to claim your ticket.\`\`\``
      )
      .setColor(process.env.color)
      .setThumbnail(interaction.guild.iconURL())
      .setFooter({
        text: interaction.guild.name,
        iconURL: interaction.guild.iconURL(),
      });

    const buttons = [
      new ButtonBuilder()
        .setStyle("Primary")
        .setLabel("Staff Options")
        .setCustomId("staff_options")
        .setDisabled(false),
      new ButtonBuilder()
        .setStyle("Success")
        .setLabel("Claim Ticket")
        .setCustomId("Claim_ticket")
        .setDisabled(false),
    ];

    const row = new ActionRowBuilder().addComponents(buttons);

    await channel
      .send({
        embeds: [sendTicketEmbed],
        components: [row],
      })
      .then(async (msg) => {
        msg.pin();
      });

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.guild.name,
        iconURL: interaction.guild.iconURL(),
      })
      .setColor(process.env.color)
      .setFooter({
        text: process.env.footer,
        iconURL: process.env.logo,
      })
      .setImage(process.env.banner)
      .setTimestamp()
      .setDescription(
        `\`\`\`Successfully Created Ticket!\`\`\`<#${channel.id}>`
      );
    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  }

  if (interaction.customId == "staff_options") {
    const PermissionLessEmbed = new EmbedBuilder()
      .setDescription(`**This command is only for staff!**`)
      .setColor("Red")
      .setAuthor({
        name: interaction.guild.name,
        iconURL: interaction.guild.iconURL(),
      })
      .setColor(process.env.color)
      .setFooter({
        text: process.env.footer,
        iconURL: process.env.logo,
      })
      .setImage(process.env.banner)
      .setTimestamp();

    if (!interaction.member.permissions.has("ManageMessages"))
      return interaction.reply({
        embeds: [PermissionLessEmbed],
        ephemeral: true,
      });

    const StaffEmbed = new EmbedBuilder()
      .setDescription(`\`\`\`Ticket Options\`\`\``)
      .setAuthor({
        name: interaction.guild.name + " Ticket Options",
        iconURL: interaction.guild.iconURL(),
      })
      .setColor(process.env.color)
      .setFooter({
        text: process.env.footer,
        iconURL: process.env.logo,
      })
      .setImage(process.env.banner)
      .setTimestamp();
    const components = [
      new ButtonBuilder()
        .setStyle("Danger")
        .setLabel("Delete")
        .setCustomId("delete")
        .setDisabled(false),
      new ButtonBuilder()
        .setStyle("Success")
        .setLabel("Rename")
        .setCustomId("rename")
        .setDisabled(false),
      new ButtonBuilder()
        .setStyle("Success")
        .setLabel("Remove Member")
        .setCustomId("remove_from_ticket")
        .setDisabled(false),
      new ButtonBuilder()
        .setStyle("Success")
        .setLabel("Add Member")
        .setCustomId("add_member_to_ticket")
        .setDisabled(false),
    ];

    const row = new ActionRowBuilder().addComponents(components);
    await interaction.reply({
      embeds: [StaffEmbed],
      components: [row],
      ephemeral: true,
    });
  }

  if (interaction.customId === "add_member_to_ticket") {
    if (!interaction.member.permissions.has("ManageMessages"))
      return interaction.reply({
        content: `You are not a staff member!`,
        ephemeral: true,
      });

    const modal = new ModalBuilder()
      .setCustomId("add_to_ticket")
      .setTitle("Add Member To Ticket");

    const newNameInput = new TextInputBuilder()
      .setCustomId("add_member_id")
      .setLabel("The Member ID")
      .setPlaceholder("Exapmle: 123456789123456789")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const actionRow = new ActionRowBuilder().addComponents(newNameInput);
    modal.addComponents(actionRow);

    await interaction.showModal(modal);
  }

  if (interaction.customId === "add_to_ticket") {
    const id = interaction.fields.getTextInputValue("add_member_id");

    const guild = interaction.guild;
    const user = guild.members.cache.get(id);
    if (user) {
      const userid = interaction.channel.topic;

      interaction.channel.permissionOverwrites.set([
        {
          id: userid,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        },
        {
          id: interaction.guild.roles.everyone,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: user.id,
          allow: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.guild.roles.cache.get(process.env.staff),
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
            PermissionsBitField.Flags.ManageMessages,
          ],
        },
      ]);
      interaction.reply({
        content: `${interaction.user.globalName} added ${user} to the ticket!`,
      });
    } else {
      interaction.reply({
        content: "please enter a valid id.",
        ephemeral: true,
      });
    }
  }

  if (interaction.customId === "remove_from_ticket") {
    if (!interaction.member.roles.cache.has(process.env.staff))
      return interaction.reply({
        content: `You are not a staff member!`,
        ephemeral: true,
      });

    const modal = new ModalBuilder()
      .setCustomId("remove_from_ticket2")
      .setTitle("Remove member from ticket");

    const newNameInput = new TextInputBuilder()
      .setCustomId("remove_member")
      .setLabel("Type the discord id of the member you want to remove")
      .setPlaceholder(`Example: ${interaction.user.id}`)
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const actionRow = new ActionRowBuilder().addComponents(newNameInput);
    modal.addComponents(actionRow);

    await interaction.showModal(modal);
  }

  if (interaction.customId === "remove_from_ticket2") {
    const id = interaction.fields.getTextInputValue("remove_member");

    const guild = interaction.guild;
    const user = guild.members.cache.get(id);

    if (user) {
      const userid = interaction.channel.topic;

      interaction.channel.permissionOverwrites.set([
        {
          id: userid,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        },
        {
          id: interaction.guild.roles.everyone,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: user.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.guild.roles.cache.get(process.env.staff),
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
            PermissionsBitField.Flags.ManageMessages,
          ],
        },
      ]);
      interaction.reply({
        content: `${interaction.user.globalName} removed ${user} from the ticket!`,
        ephemeral: true,
      });
    } else {
      interaction.reply({
        content: "please enter a valid id.",
        ephemeral: true,
      });
    }
  }

  if (interaction.customId === "rename") {
    if (!interaction.member.permissions.has("ManageMessages"))
      return interaction.reply({
        content: `You are not a staff member!`,
        ephemeral: true,
      });

    const modal = new ModalBuilder()
      .setCustomId("rename_ticket")
      .setTitle("Rename Ticket");

    const newNameInput = new TextInputBuilder()
      .setCustomId("new_name")
      .setLabel("type the new name for the ticket")
      .setPlaceholder("")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const actionRow = new ActionRowBuilder().addComponents(newNameInput);
    modal.addComponents(actionRow);

    await interaction.showModal(modal);
  }

  if (interaction.customId === "rename_ticket") {
    const newName = interaction.fields.getTextInputValue("new_name");

    const channelNameParts = interaction.channel.name.split("・");
    const existingServerType =
      channelNameParts.length > 1 ? channelNameParts[1].trim() : "";

    const newChannelName = `${newName}・${existingServerType}`;

    interaction.channel.setName(newChannelName);

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(`channel name changed to \`${newChannelName}\`.`)
      .setThumbnail(interaction.user.displayAvatarURL())
      .setColor(process.env.color)
      .setFooter({
        text: process.env.footer,
        iconURL: process.env.logo,
      })
      .setImage(process.env.banner)
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  }

  if (interaction.customId === "delete") {
    if (!interaction.member.permissions.has("ManageMessages"))
      return interaction.reply({
        content: "You can't delete the ticket.",
        ephemeral: true,
      });

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.guild.name,
        iconURL: interaction.guild.iconURL(),
      })
      .setDescription(`**The ticket will deleted in 5s**`)
      .setColor(process.env.color)
      .setFooter({
        text: process.env.footer,
        iconURL: process.env.logo,
      })
      .setImage(process.env.banner)
      .setTimestamp();

    interaction.reply({ embeds: [embed] });

    setTimeout(async () => {
      const discordTranscripts = require("discord-html-transcripts");
      const logChannel = interaction.guild.channels.cache.get(process.env.log);

      const channel = interaction.channel;
      const attachment = await discordTranscripts.createTranscript(channel);

      const embed = new EmbedBuilder()
        .setAuthor({
          name: interaction.guild.name,
          iconURL: process.env.logo,
        })
        .addFields(
          {
            name: `Ticket Owner`,
            value: `<@!${interaction.channel.topic}>`,
            inline: true,
          },
          { name: `Deleted By`, value: `${interaction.user}`, inline: true }
        )
        .setColor(process.env.color)
        .setFooter({
          text: process.env.footer,
          iconURL: process.env.logo,
        })
        .setImage(process.env.banner)
        .setTimestamp();

      logChannel.send({
        embeds: [embed],
        files: [attachment],
      });
      interaction.channel.delete();
    }, 5000);
  }




    if (interaction.customId == "Belo" ){
      
      interaction.reply({
          content: `**  עמלה של 60%  BELO - 3 שימושים ביום **` , ephemeral: true, });
  
        }


        if (interaction.customId == "ASTROPAY" ){
      
          interaction.reply({
              content: `** ars אין הגבלת שימושים יש הגבלה של הטענת הבנק חודשי 500 אלף **` , ephemeral: true, });
      
            }



            
        if (interaction.customId == "LETSBIT" ){
      
          interaction.reply({
              content: `** בין 20-30 שימושים ביום, 5 כרטיסי אשראי עמלה גבוה משאר הבנקים**` , ephemeral: true, });
      
            }


            if (interaction.customId == "MERCADO PAGO" ){
      
              interaction.reply({
                  content: `** עמלה נמוכה + אין הגבלה של כסף **` , ephemeral: true, });
          
                }



                if (interaction.customId == "אלוף" ){
      
                  interaction.reply({
                      content: `** אלוף**` , ephemeral: true, });
              
                    }



             if (interaction.customId == "אחר" ){
      
               interaction.reply({
                    content: `**כל הכבוד הצלחת חולה לך על התחת**` , ephemeral: true, });
                  
                  }




  const slashCommand = client.slashCommands.get(interaction.commandName);
  if (interaction.type == 4) {
    if (slashCommand.autocomplete) {
      const choices = [];
      await slashCommand.autocomplete(interaction, choices);
    }
  }
  if (!interaction.type == 2) return;

  if (!slashCommand)
    return client.slashCommands.delete(interaction.commandName);
  try {
    if (slashCommand.cooldown) {
      if (cooldown.has(`slash-${slashCommand.name}${interaction.user.id}`))
        return interaction.reply({
          content: "You are on `<duration>` cooldown!".replace(
            "<duration>",
            ms(
              cooldown.get(`slash-${slashCommand.name}${interaction.user.id}`) -
                Date.now(),
              { long: true }
            )
          ),
        });
      if (slashCommand.userPerms || slashCommand.botPerms) {
        if (
          !interaction.memberPermissions.has(
            PermissionsBitField.resolve(slashCommand.userPerms || [])
          )
        ) {
          const userPerms = new EmbedBuilder()
            .setDescription(
              `🚫 ${interaction.user}, You don't have \`${slashCommand.userPerms}\` permissions to use this command!`
            )
            .setColor("Red");
          return interaction.reply({ embeds: [userPerms] });
        }
        if (
          !interaction.guild.members.cache
            .get(client.user.id)
            .permissions.has(
              PermissionsBitField.resolve(slashCommand.botPerms || [])
            )
        ) {
          const botPerms = new EmbedBuilder()
            .setDescription(
              `🚫 ${interaction.user}, I don't have \`${slashCommand.botPerms}\` permissions to use this command!`
            )
            .setColor("Red");
          return interaction.reply({ embeds: [botPerms] });
        }
      }

      await slashCommand.run(client, interaction);
      cooldown.set(
        `slash-${slashCommand.name}${interaction.user.id}`,
        Date.now() + slashCommand.cooldown
      );
      setTimeout(() => {
        cooldown.delete(`slash-${slashCommand.name}${interaction.user.id}`);
      }, slashCommand.cooldown);
    } else {
      if (slashCommand.userPerms || slashCommand.botPerms) {
        if (
          !interaction.memberPermissions.has(
            PermissionsBitField.resolve(slashCommand.userPerms || [])
          )
        ) {
          const userPerms = new EmbedBuilder()
            .setDescription(
              `🚫 ${interaction.user}, You don't have \`${slashCommand.userPerms}\` permissions to use this command!`
            )
            .setColor("Red");
          return interaction.reply({ embeds: [userPerms] });
        }
        if (
          !interaction.guild.members.cache
            .get(client.user.id)
            .permissions.has(
              PermissionsBitField.resolve(slashCommand.botPerms || [])
            )
        ) {
          const botPerms = new EmbedBuilder()
            .setDescription(
              `🚫 ${interaction.user}, I don't have \`${slashCommand.botPerms}\` permissions to use this command!`
            )
            .setColor("Red");
          return interaction.reply({ embeds: [botPerms] });
        }
      }
      await slashCommand.run(client, interaction);
    }
  } catch (error) {
    console.log(error);
  }
});



client.guilds.cache.forEach((guild) => {
  const data = db.get(`settings_${guild.id}`);

  if (!data) {
    return;
  }

  const url = "https://www.oref.org.il/WarningMessages/alert/alerts.json";
  prevId = "";
setInterval(() => {
    axios
      .get(url, {
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          Referer: "https://www.oref.org.il/12481-he/Pakar.aspx",
        },
        maxContentLength: Infinity,
      })
      .then((res) => {
        if (res.data !== "" && res.data.constructor === Object) {
          let json = JSON.parse(JSON.stringify(res.data));
          if (json.id != prevId) {
            prevId = json.id;

            let locations = "";
            for (let i = 0; i < json.data.length; i++) {
              locations += json.data[i] + ", ";

              const channel = guild.channels.cache.get(data.channel);

              const embed = new EmbedBuilder()
                .setAuthor({
                  name: `${guild.name} - Alert!`,
                  iconURL: guild.iconURL(),
                })
                .setColor("#2b2d31")
                .setDescription(
                  `- אזעקת צבע אדום / חדירת מחבלים יישובים: \`\`\`${locations}\`\`\`\n\n**נא להישמע להנחיות של פיקוד העורף, להישאר במקלט לאחר 10 דקות מאז שהאזעקה הסתיימה מחשש לירי נוסף או נפילת רסיסים**`
                )
                .setThumbnail(
                  "https://i.ytimg.com/vi/J1lGelkPRWU/maxresdefault.jpg"
                )
                .setImage(
                  "https://cdn.discordapp.com/attachments/1043175008010240000/1161585848890961941/redAlertShon.png?ex=6538d61f&is=6526611f&hm=7dede85dd1efc3ce185308e35a5ab2b88a58f9d711011a041b8da9fd3f87b709&"
                )
                .setTimestamp()
                .setFooter({
                  text: `${guild.name} - Alert!`,
                  iconURL: guild.iconURL(),
                });

              const button1 = new ButtonBuilder()
                .setLabel(`הנחיות על מחבלים`)
                .setStyle("Link")
                .setURL("https://www.oref.org.il/12823-he/pakar.aspx");

              const button2 = new ButtonBuilder()
                .setLabel(`הנחיות על ירי רקטות וטילים`)
                .setStyle("Link")
                .setURL("https://www.oref.org.il/12761-he/pakar.aspx");

              const row = new ActionRowBuilder().setComponents(
                button1,
                button2
              );

              channel.send({
                content: `${data.role ? `<@&${data.role}>` : "‏"}`,
                embeds: [embed],
                components: [row],
              });
            }
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, 1500);
});








