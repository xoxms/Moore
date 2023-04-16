import type { DApplicationCommand } from "discordx";
import { Discord, MetadataStorage, Slash, SlashGroup, SlashOption } from "discordx";
import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { Category, ICategory } from "@discordx/utilities";
import { Pagination, PaginationType } from "@discordx/pagination";
import { bot } from "../../index.js";
import { templateEmbed } from "../../lib/embeds.js";

@Discord()
@Category("Miscellaneous")
@SlashGroup({
  description: "Shows a list of all commands or info about a specific command.",
  name: "help",
})
@SlashGroup("help")
export class HelpCommand {
  @Slash({ description: "Show all available commands" })
  async all(interaction: CommandInteraction) {
    const commands = MetadataStorage.instance.applicationCommandSlashesFlat.map(
      (cmd: DApplicationCommand & ICategory) => {
        return {
          description: cmd.description,
          name: cmd.group ? `${cmd.group} (${cmd.name})` : cmd.name,
          category: cmd.category,
        };
      },
    );
    const categories = new Set(commands.map((c) => c.category || ""));
    const pages = Array.from(categories).map((category, idx) => {
      const categoryCommands = commands.filter((c) => c.category === category);
      const embed = templateEmbed({
        type: "default",
        title: `(Page ${idx + 1}/${categories.size}) Category: ${category as string}`,
        footer: {
          text: "You can send `/help command` follow with command name to get more information about it.",
          iconURL: interaction.user.displayAvatarURL(),
        },
        thumbnail: bot.user!.displayAvatarURL(),
        interaction,
      });

      categoryCommands.forEach((c) => {
        embed.addFields({ name: `/${c.name}`, value: c.description });
      });
      return { embeds: [embed] };
    });

    const pagination = new Pagination(interaction, pages, {
      type: PaginationType.SelectMenu,
      pageText: Array.from(categories).map((str) => `${str} Category`),
      placeholder: "Choose category",
      showStartEnd: false,
    });
    await pagination.send();
  }

  @Slash({ description: "Show info about a specific command" })
  async command(
    @SlashOption({
      description: "Command to get info from",
      name: "command",
      type: ApplicationCommandOptionType.String,
      required: true,
    })
    command: string,
    interaction: CommandInteraction,
  ): Promise<void> {
    const cmd = MetadataStorage.instance.applicationCommandSlashesFlat.find(
      (c: DApplicationCommand & ICategory) => c.name === command,
    ) as DApplicationCommand & ICategory;
    if (!cmd) {
      await interaction.reply({
        content: `Command \`${command}\` not found.`,
        ephemeral: true,
      });
      return;
    }

    const embed = templateEmbed({
      type: "default",
      title: cmd.name.toUpperCase(),
      footer: {
        text: "You can send `/help all` to get a list of all commands.",
        iconURL: interaction.user.displayAvatarURL(),
      },
      fields: [
        {
          name: "Description",
          value: cmd.description,
          inline: false,
        },
        {
          name: "Category",
          value: String(cmd.category),
          inline: false,
        },
        {
          name: "Options",
          value: cmd.options?.map((o) => `\`${o.name}\` - ${o.description}`).join("\n") || "None",
          inline: false,
        },
      ],
      thumbnail: bot.user!.displayAvatarURL(),
      interaction,
    });

    await interaction.reply({ embeds: [embed] });
  }
}
