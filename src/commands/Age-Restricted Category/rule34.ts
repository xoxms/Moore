import { Discord, Slash, SlashOption } from "discordx";
import { ApplicationCommandOptionType, CommandInteraction, TextChannel } from "discord.js";
import { Category } from "@discordx/utilities";
import axios from "axios";
import { templateEmbed } from "../../lib/embeds.js";

@Discord()
@Category("Age-Restricted")
export class Rule34Command {
  @Slash({ description: "Get random image from rule34.xxx", name: "rule34" })
  async rule34(
    @SlashOption({
      name: "tags",
      description: "Tags to search (Seperated with commas)",
      type: ApplicationCommandOptionType.String,
      required: false,
    })
    tags = "",
    interaction: CommandInteraction,
  ): Promise<void> {
    if (!(<TextChannel>interaction.channel).nsfw) {
      await interaction.reply({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Cannot execute command",
            description: "This command can only be executed from Age-Restricted channel.",
            interaction,
          }),
        ],
      });
      return;
    }

    const { data } = await axios.get(`https://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${tags}&json=1`);
    const image = data[Math.floor(Math.random() * data.length)];

    await interaction.reply({
      embeds: [
        templateEmbed({
          type: "default",
          title: `Image from ${image.owner}`,
          image: image.file_url,
          url: `https://rule34.xxx/index.php?page=post&s=view&id=${image.id}`,
          footer: { text: `rating: ${image.rating} | score: ${image.score}` },
          interaction,
        }),
      ],
    });
  }
}
