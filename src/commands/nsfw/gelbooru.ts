import { Discord, Slash, SlashOption } from "discordx";
import { ApplicationCommandOptionType, Colors, CommandInteraction, EmbedBuilder, TextChannel } from "discord.js";
import { Category } from "@discordx/utilities";
import axios from "axios";

@Discord()
@Category("NSFW")
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
    tags: string = "",
    interaction: CommandInteraction,
  ): Promise<void> {
    if (!(<TextChannel>interaction.channel).nsfw) {
      await interaction.reply("This channel is not NSFW!");
      return;
    }
    
    const { data } = await axios.get(`https://danbooru.donmai.us/posts.json?tags=${tags}&limit=1`);
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`Image from ${data[0].tag_string_artist}`)
          .setImage(data[0].file_url)
          .setColor(Colors.Green)
          .setURL(`https://danbooru.donmai.us/posts/${data[0].id}`)
          .setFooter({
            text: `rating: ${this.rating[data[0].rating as keyof typeof this.rating]} | score: ${data[0].score}`,
          }),
      ],
    });
  }
}