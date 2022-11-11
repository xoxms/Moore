import { Discord, Slash, SlashOption } from "discordx";
import { Category } from "@discordx/utilities";
import { Colors, CommandInteraction, EmbedBuilder } from "discord.js";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import get from "axios";

@Discord()
@Category("Search")
export class RedditCommand {
  @Slash({ name: "reddit", description: "Search for a subreddit" })
  async reddit(
    @SlashOption({
      name: "subreddit",
      description: "Subreddit to search",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    subreddit: string,
    interaction: CommandInteraction,
  ): Promise<void> {
    await interaction.deferReply();

    try {
      const response = await get(`https://www.reddit.com/r/${subreddit}.json`);
      const { data } = response;
      const post = data.data.children[Math.floor(Math.random() * data.data.children.length)].data;
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle(post.title)
            .setDescription(post.selftext || "No description")
            .setFooter({ text: post.subreddit_name_prefixed })
            .setURL(`https://reddit.com${post.permalink}`)
            .setTimestamp(new Date(post.created_utc * 1000))
            .setImage(post.url || post.thumbnail)
            .setColor(Colors.Orange),
        ],
      });
    } catch (error) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Subreddit not found")
            .setDescription(`No subreddit found for ${subreddit}`)
            .setColor(Colors.Red)
            .setFooter({
              text: `Requested by ${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
      });
    }
  }
}
