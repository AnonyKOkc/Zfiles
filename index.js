const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  ButtonStyle,
  EmbedBuilder,
  Events,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
    Partials.Reaction,
  ],
});
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { YtDlpPlugin } = require("@distube/yt-dlp");

client.commands = new Collection();
client.aliases = new Collection();
client.slashCommands = new Collection();
client.buttons = new Collection();
client.menus = new Collection();
client.models = new Collection();
client.prefix = "!";

client.distube = new DisTube(client, {
  leaveOnStop: false,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  plugins: [
    new SpotifyPlugin({
      emitEventsAfterFetching: true,
    }),
    new SoundCloudPlugin(),
    new YtDlpPlugin(),
  ],
});

module.exports = client;

const fs = require("fs");
require("dotenv").config();

fs.readdirSync("./handlers").forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});

const { GiveawaysManager } = require("vante-giveaways");
const manager = new GiveawaysManager(client, {
  storage: "./giveaways.json",
  default: {
    embedColor: "#273dd4",
    buttonEmoji: "🎉",
    buttonStyle: ButtonStyle.Secondary,
  },
});

const status = (queue) =>
  `Volume: \`${queue.volume}%\` | Filter: \`${
    queue.filters.names.join(", ") || "Off"
  }\` | Loop: \`${
    queue.repeatMode
      ? queue.repeatMode === 2
        ? "All Queue"
        : "This Song"
      : "Off"
  }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;
client.distube
  .on("playSong", (queue, song) => {
    const embedy = new EmbedBuilder()
      .setTitle(`${song.name}`)
      .setColor("White")
      .setURL(song.url)
      .setDescription(
        `Duration: ${song.formattedDuration}, Requested by ${song.user}`
      )
      .setImage(song.thumbnail)
      .setTimestamp();
    queue.textChannel.send({
      embeds: [embedy],
    });
  })
  .on("addSong", (queue, song) => {
    const embedy = new EmbedBuilder()
      .setTitle(`Added: ${song.name}`)
      .setColor("White")
      .setURL(song.url)
      .setDescription(
        `Duration: ${song.formattedDuration}, Added by ${song.user}`
      )
      .setImage(song.thumbnail)
      .setTimestamp();
    queue.textChannel.send({
      embeds: [embedy],
    });
  })
  .on("addList", (queue, playlist) => {
    const embedy = new EmbedBuilder()
      .setTitle(
        `Added playlist ${song.name} to queue (${playlist.songs.length})`
      )
      .setColor("White")
      .setURL(song.url)
      .setTimestamp();
    queue.textChannel.send({
      embeds: [embedy],
    });
  })
  .on("error", (channel, e) => {
    if (channel)
      channel.send(`An error encountered: ${e.toString().slice(0, 1974)}`);
    else console.error(e);
  })
  .on("searchNoResult", (message, query) =>
    message.channel.send(`No result found for \`${query}\`!`)
  );

client.giveawaysManager = manager;

client.giveawaysManager.on(
  "giveawayJoined",
  (giveaway, member, interaction) => {
    if (!giveaway.isDrop)
      return interaction.reply({
        content: `:tada: Congratulations **${member.user.username}**, you have joined the giveaway`,
        ephemeral: true,
      });

    interaction.reply({
      content: `:tada: Congratulations **${member.user.username}**, you have joined the drop giveaway`,
      ephemeral: true,
    });
  }
);

client.giveawaysManager.on(
  "giveawayLeaved",
  (giveaway, member, interaction) => {
    return interaction.reply({
      content: `**${member.user.username}**, you have left the giveaway`,
      ephemeral: true,
    });
  }
);



fs.readdirSync("./handlers").forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});

client.on(Events.MessageCreate, (message) => {

  if (message.content === "event") {
    if (!message.member.permissions.has('Administrator')) return message.reply({ content: '> Error: אין לך גישה לפקודה זו' })
    
      const embed = new EmbedBuilder()
          .setColor('Blue')
          .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
          .setDescription('**לחץ על הכפתור כדי להישתתף באיוונט**')
          .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })

      const row = new ActionRowBuilder()
          .addComponents(
              new ButtonBuilder()
                  .setCustomId('openroom')
                  .setLabel('Open')
                  .setStyle(ButtonStyle.Primary)
          )
      message.channel.send({ embeds: [embed], components: [row] });
  }
})

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.customId === 'openroom') {

      const user = interaction.user;
      interaction.guild.channels.cache.forEach((channel) => {
          
      }
      )

      const embed3 = new EmbedBuilder()
          .setColor('Blue')
          .setDescription(`החדר שלך נפתח בהצלחה!`)
      await interaction.reply({ embeds: [embed3], ephemeral: true });


      const category = '1184979247740231706'
      const channel2 = await interaction.guild.channels.create({
          name: `${user.username}`,
          type: ChannelType.GuildText,
          parent: `${category}`
      });



      channel2.permissionOverwrites.create(interaction.user.id, { ViewChannel: true, SendMessages: false });
      channel2.permissionOverwrites.create(interaction.guild.id, { ViewChannel: true, SendMessages: false });

      channel2.send({ content: `**${user}מישתתף באיוונט**` }).then((msg) => {

          msg.react('✅')
      })
  }
})




const { Intents } = require("discord.js");

client.on('messageCreate', (message) => {
  if (message.content === '/drop') {
    dropMessage(message);
  }
});

async function dropMessage(message) {
  let count = 10;
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  for (let i = count; i > 0; i--) {
    await message.channel.send(i.toString());
    await delay(1000);
  }

  message.reply('Drop completed!');
}


process.on("unhandledRejection", (reason, promise) => {
  console.log(reason, promise);
});
process.on("uncaughtException", (err, origin) => {
  console.log(err, origin);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.log(err, origin);
});





process.on("unhandledRejection", (reason, promise) => {
  console.log(reason, promise);
});
process.on("uncaughtException", (err, origin) => {
  console.log(err, origin);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.log(err, origin);
});

client.login(process.env.token);