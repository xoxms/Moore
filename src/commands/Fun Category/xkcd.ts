import type { CommandInteraction } from "discord.js";
import { EmbedBuilder } from "discord.js";
import { Discord, Slash } from "discordx";
import { Category } from "@discordx/utilities";
import axios from "axios";

@Discord()
@Category("Fun")
export class XkcdCommand {
  @Slash({ description: "Get random xkcd comics", name: "xkcd" })
  async xkcd(interaction: CommandInteraction): Promise<void> {
    const estimatedComicsCount = 2600; // Reduced network requests by hardcoding this value, pls forgive me （＞人＜；）
    const { data } = await axios.get(
      `https://xkcd.com/${Math.floor(Math.random() * estimatedComicsCount) + 1}/info.0.json`,
    );

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`#${data.num} - ${data.title}`)
          .setImage(data.img)
          .setDescription(data.alt)
          .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp(),
      ],
    });
  }
}
