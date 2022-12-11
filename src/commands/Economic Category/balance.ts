import { Discord, Slash, SlashOption } from "discordx";
import { Category } from "@discordx/utilities";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { CommandInteraction, GuildMember } from "discord.js";
import { findTargetUser } from "../../lib/utils.js";
import { templateEmbed } from "../../lib/embeds.js";

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
    const targetUser = user?.user || interaction.user;
    const data = await findTargetUser(targetUser.id, interaction);
    if (!data) return;

    await interaction.reply({
      embeds: [
        templateEmbed({
          type: "default",
          title: `${targetUser.username}'s balance`,
          description: `**${targetUser}** has **${data.coin}** coins`,
          thumbnail: targetUser.displayAvatarURL(),
          emote: "💰",
          interaction,
        }),
      ],
    });
  }
}
