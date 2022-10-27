import { Discord, MetadataStorage, Slash, SlashGroup } from "discordx";
import { EmbedBuilder, Colors, CommandInteraction } from "discord.js";
import { Category, ICategory } from "@discordx/utilities";
import { Pagination } from "@discordx/pagination";
import { bot } from "../../index.js";
import type { DApplicationCommand } from "discordx";

@Discord()
@Category("Miscellaneous")
@SlashGroup({
  description: "Shows a list of all commands or info about a specific command.",
  name: "help"
})
@SlashGroup("help")
export class HelpCommand {
  @Slash({ description: "Show all available commands" })
  async all(interaction: CommandInteraction) {
    const commands = MetadataStorage.instance.applicationCommandSlashesFlat.map((cmd: DApplicationCommand & ICategory) => {
      return { description: cmd.description, name: cmd.name, category: cmd.category };
    });
    const categories = new Set(commands.map((c) => c.category));
    const pages = Array.from(categories).map((category, idx) => {
      const categoryCommands = commands.filter((c) => c.category === category);
      const embed = new EmbedBuilder()
        .setColor(Colors.Blue)
        .setFooter({
          text: "You can send `/help command` follow with command name to get more information about it.",
          iconURL: interaction.user.avatarURL()!,
        })
        .setThumbnail(bot.user!.displayAvatarURL())
        .setTitle(`[Page ${idx + 1}/${categories.size}] Category: ${category as string}`);

      categoryCommands.forEach((c) => {
        embed.addFields({ name: `/${c.name}`, value: c.description });
      });
      return { embeds: [embed] };
    });

    const pagination = new Pagination(interaction, pages);
    await pagination.send();
  }
}
