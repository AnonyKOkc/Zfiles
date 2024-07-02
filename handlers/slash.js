const fs = require("fs");
const { PermissionsBitField } = require("discord.js");
const { Routes } = require("discord-api-types/v9");
const { REST } = require("@discordjs/rest");

const AsciiTable = require("ascii-table");
const table = new AsciiTable()
  .setHeading("Slash Commands", "Stats")
  .setBorder("|", "=", "0", "0");

const token = process.env.token;
const clientId = process.env.client;

const rest = new REST({ version: "9" }).setToken(token);

module.exports = (client) => {
  const slashCommands = [];

  fs.readdirSync("./slashCommands/").forEach(async (dir) => {
    const files = fs
      .readdirSync(`./slashCommands/${dir}/`)
      .filter((file) => file.endsWith(".js"));

    for (const file of files) {
      const slashCommand = require(`../slashCommands/${dir}/${file}`);
      slashCommands.push({
        name: slashCommand.name,
        description: slashCommand.description,
        type: slashCommand.type,
        options: slashCommand.options ? slashCommand.options : null,
        default_permission: slashCommand.default_permission
          ? slashCommand.default_permission
          : null,
        default_member_permissions: slashCommand.default_member_permissions
          ? PermissionsBitField.resolve(
              slashCommand.default_member_permissions
            ).toString()
          : null,
      });

      if (slashCommand.name) {
        client.slashCommands.set(slashCommand.name, slashCommand);
        table.addRow(file.split(".js")[0], "✅");
      } else {
        table.addRow(file.split(".js")[0], "⛔");
      }
    }
  });

  (async () => {
    try {
      await rest.put(
        '930159341414277130'
          ? Routes.applicationGuildCommands(clientId, process.env.guild)
          : Routes.applicationCommands(clientId),
        { body: slashCommands }
      );
    } catch (error) {
      console.log(error);
    }
  })();
};