import { ApplicationCommandOptionType, CommandInteraction, User } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { Category } from "@discordx/utilities";
import { templateEmbed } from "../../lib/embeds.js";

@Discord()
@Category("Miscellaneous")
export class AvatarCommand {
  @Slash({ description: "Get selected user's avatar", name: "avatar" })
  async avatar(
    @SlashOption({
      description: "User to get avatar from",
      name: "user",
      type: ApplicationCommandOptionType.User,
      required: true,
    })
    user: User,
    interaction: CommandInteraction,
  ): Promise<void> {
    await interaction.reply({
      embeds: [
        templateEmbed({
          type: "none",
          title: `🖼 Avatar of ${user.username}`,
          image: user.avatarURL()!,
          interaction,
        }),
      ],
      ephemeral: true,
    });
  }
}
