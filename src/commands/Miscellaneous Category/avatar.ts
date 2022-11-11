import { ApplicationCommandOptionType, Colors, CommandInteraction, EmbedBuilder, User } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { Category } from "@discordx/utilities";

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
        new EmbedBuilder()
          .setTitle(`🖼 Avatar of ${user.username}`)
          .setImage(user.avatarURL()!)
          .setColor(Colors.Green)
          .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp(),
      ],
      ephemeral: true,
    });
  }
}
