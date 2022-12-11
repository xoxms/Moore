import { Discord, Slash, SlashOption } from "discordx";
import { Category } from "@discordx/utilities";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { Colors, CommandInteraction, EmbedBuilder, GuildMember } from "discord.js";
import { findTargetUser } from "../../lib/utils.js";

@Discord()
@Category("Economic")
export class BalanceCommand {
  @Slash({ name: "balance", description: "Check your account balance" })
  async command(
    @SlashOption({
      name: "user",
      description: "User to check balance",
      type: ApplicationCommandOptionType.User,
      required: false,
    })
    user: GuildMember,
    interaction: CommandInteraction,
  ): Promise<void> {
    const targetUser = user || interaction.user;
    const data = await findTargetUser(targetUser.id, interaction);
    if (!data) return;

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`💰 ${targetUser.user.username}'s balance`)
          .setDescription(`**${targetUser}** has **${data.coin}** coins`)
          .setColor(Colors.Green)
          .setThumbnail(targetUser.displayAvatarURL())
          .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp(),
      ],
    });
  }
}
