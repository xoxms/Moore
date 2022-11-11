import type { CommandInteraction } from "discord.js";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, Colors, EmbedBuilder } from "discord.js";
import { ButtonComponent, Discord, Slash } from "discordx";
import { Category } from "@discordx/utilities";
import axios from "axios";

@Discord()
@Category("Fun")
export class MemeCommand {
  public static buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setLabel("NEXT").setCustomId("fetch_next_memes").setStyle(ButtonStyle.Primary),
  );

  public static async fetchMemes() {
    const { data } = await axios.get("https://meme-api.herokuapp.com/gimme");
    return data;
  }

  @ButtonComponent({ id: "fetch_next_memes" })
  async handler(interaction: ButtonInteraction): Promise<void> {
    await interaction.deferUpdate();
    const data = await MemeCommand.fetchMemes();
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle(data.title)
          .setImage(data.url)
          .setURL(data.postLink)
          .setColor(Colors.Green)
          .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp(),
      ],
      components: [MemeCommand.buttonRow],
    });
  }

  @Slash({ description: "Get random memes", name: "meme" })
  async meme(interaction: CommandInteraction): Promise<void> {
    const data = await MemeCommand.fetchMemes();
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(data.title)
          .setImage(data.url)
          .setURL(data.postLink)
          .setColor(Colors.Green)
          .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp(),
      ],
      components: [MemeCommand.buttonRow],
    });
  }
}
