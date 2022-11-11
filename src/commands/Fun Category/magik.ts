import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType, User } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { Category } from "@discordx/utilities";
import axios from "axios";

@Discord()
@Category("Fun")
export class MagikCommand {
  @Slash({ description: "Somehow perform ritual to selected user", name: "magik" })
  async magik(
    @SlashOption({
      description: "User to perform ritual on",
      name: "user",
      type: ApplicationCommandOptionType.User,
      required: true,
    })
    user: User,
    interaction: CommandInteraction,
  ): Promise<void> {
    await interaction.deferReply();
    const avatar = user.displayAvatarURL({ size: 512 });
    const { data } = await axios.get(`https://nekobot.xyz/api/imagegen?type=magik&image=${avatar}&intensity=1`);

    await interaction.editReply({
      files: [
        {
          attachment: data.message,
          name: "magik.png",
        },
      ],
    });
  }
}
