import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType, User } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { Category } from "@discordx/utilities";
import axios from "axios";

@Discord()
@Category("Fun")
export class DeepfryCommand {
  @Slash({ description: "DEEP-FRY selected user", name: "deepfry" })
  async deepfry(
    @SlashOption({
      description: "User to deep-fry",
      name: "user",
      type: ApplicationCommandOptionType.User,
      required: true,
    })
    user: User,
    interaction: CommandInteraction,
  ): Promise<void> {
    await interaction.deferReply();
    const avatar = user.displayAvatarURL({ size: 512 });
    const { data } = await axios.get(`https://nekobot.xyz/api/imagegen?type=deepfry&image=${avatar}`);

    await interaction.editReply({
      files: [
        {
          attachment: data.message,
          name: "deepfry.png",
        },
      ],
    });
  }
}
