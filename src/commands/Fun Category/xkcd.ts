import type { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import { Category } from "@discordx/utilities";
import axios from "axios";
import { templateEmbed } from "../../lib/embeds.js";

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
        templateEmbed({
          type: "default",
          title: `#${data.num} - ${data.title}`,
          description: data.alt || "...",
          image: data.img,
          interaction
        })
      ],
    });
  }
}
