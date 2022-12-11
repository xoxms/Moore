import type { CommandInteraction } from "discord.js";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import { ButtonComponent, Discord, Slash } from "discordx";
import { Category } from "@discordx/utilities";
import axios from "axios";
import { templateEmbed } from "../../lib/embeds.js";

@Discord()
@Category("Fun")
export class MemeCommand {
  public static buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setLabel("NEXT").setCustomId("fetch_next_memes").setStyle(ButtonStyle.Primary),
  );

  public static async fetchMemes() {
    const { data } = await axios.get("https://meme-api.com/gimme");
    return data;
  }

  private embed: any;

  @ButtonComponent({ id: "fetch_next_memes" })
  async handler(interaction: ButtonInteraction): Promise<void> {
    await interaction.deferUpdate();
    const data = await MemeCommand.fetchMemes();
    await interaction.editReply({
      embeds: [
        this.embed
          .setTitle(data.title)
          .setImage(data.url)
          .setURL(data.postLink)
      ],
      components: [MemeCommand.buttonRow],
    });
  }

  @Slash({ description: "Get random memes", name: "meme" })
  async meme(interaction: CommandInteraction): Promise<void> {
    try {
      const data = await MemeCommand.fetchMemes();

      this.embed = templateEmbed({
        type: "default",
        title: data.title,
        image: data.url,
        url: data.postLink,
        interaction
      });
      await interaction.reply({
        embeds: [
          this.embed
        ],
        components: [MemeCommand.buttonRow],
      });
    } catch(error) {
      await interaction.reply({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Cannot fetch data",
            description: "Error fetching data from host",
            interaction
          })
        ]
      });
      return;
    }
  }
}
