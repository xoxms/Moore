import { Discord, Slash, SlashOption } from "discordx";
import { ApplicationCommandOptionType, CommandInteraction, TextChannel } from "discord.js";
import { Category } from "@discordx/utilities";
import axios from "axios";
import { templateEmbed } from "../../lib/embeds.js";

@Discord()
@Category("Age-Restricted")
export class DanbooruCommand {
  public readonly rating = {
    e: "explicit",
    s: "safe",
    q: "questionable",
    u: "unknown",
  };

  @Slash({ description: "Get random danbooru image", name: "danbooru" })
  async danbooru(
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

    const { data } = await axios.get(
      `https://danbooru.donmai.us/posts.json?tags=${tags}&page=${Math.floor(Math.random() * 100) + 1}&limit=1`,
    );
    await interaction.reply({
      embeds: [
        templateEmbed({
          type: "default",
          title: `Image by ${data[0].tag_string_artist}`,
          image: data[0].file_url,
          url: `https://danbooru.donmai.us/posts/${data[0].id}`,
          footer: {
            text: `rating: ${this.rating[data[0].rating as keyof typeof this.rating]} | score: ${data[0].score}`,
          },
          interaction,
        }),
      ],
    });
  }
}
