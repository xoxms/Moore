import { Discord, Slash, SlashOption } from "discordx";
import { ApplicationCommandOptionType, Colors, CommandInteraction, EmbedBuilder, TextChannel } from "discord.js";
import { Category } from "@discordx/utilities";
import axios from "axios";

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
    tags: string = "",
    interaction: CommandInteraction,
  ): Promise<void> {
    if (!(<TextChannel>interaction.channel).nsfw) {
      await interaction.reply("This channel is not Age-Restricted!");
      return;
    }
    
    const { data } = await axios.get(`https://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${tags}&json=1`);
    const image = data[Math.floor(Math.random() * data.length)];

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`Image from ${image.owner}`)
          .setColor("#ffb6c1")
          .setImage(image.file_url)
          .setFooter({ text: `rating: ${image.rating} | score: ${image.score}` })
          .setURL(`https://rule34.xxx/index.php?page=post&s=view&id=${image.id}`),
      ],
    });
  }
}