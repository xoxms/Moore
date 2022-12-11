import { Discord, Slash, SlashOption } from "discordx";
import { ApplicationCommandOptionType, CommandInteraction, TextChannel } from "discord.js";
import { Category } from "@discordx/utilities";
import axios from "axios";
import { templateEmbed } from "../../lib/embeds.js";

@Discord()
@Category("Age-Restricted")
export class GelbooruCommand {
  @Slash({ description: "Get random gelbooru image", name: "gelbooru" })
  async gelbooru(
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
      `https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&limit=1&pid=${
        Math.floor(Math.random() * 100) + 1
      }&tags=${tags.split(",").join("+")}`,
    );

    if (!data.post) {
      await interaction.reply({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Not found",
            description: "No results found",
            interaction,
          }),
        ],
      });
      return;
    }

    await interaction.reply({
      embeds: [
        templateEmbed({
          type: "default",
          title: `Image by ${data.post[0].owner}`,
          image: data.post[0].file_url,
          url: `https://gelbooru.com/index.php?page=post&s=view&id=${data.post[0].id}`,
          footer: { text: `rating: ${data.post[0].rating} | score: ${data.post[0].score}` },
          interaction,
        }),
      ],
    });
  }
}
