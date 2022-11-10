import { Discord, Slash, SlashOption } from "discordx";
import { Category } from "@discordx/utilities";
import { ApplicationCommandOptionType, CommandInteraction, GuildMember, User } from "discord.js";

@Discord()
@Category("Moderation")
export class KickCommand {
  @Slash({ name: "kick", description: "Kick a user" })
  async kick(
    @SlashOption({
      name: "user",
      description: "Select a user to kick",
      required: true,
      type: ApplicationCommandOptionType.User
    })
    @SlashOption({
      name: "reason",
      description: "Reason for kicking the user",
      required: false,
      type: ApplicationCommandOptionType.String
    })
      user: GuildMember,
      reason: string = "Not specified",
      interaction: CommandInteraction
  ): Promise<void> {
    await user.kick(reason);
    await interaction.reply(`Successfully kicked <@${user.id}>\nReason: \`${reason}\``);
  }
}