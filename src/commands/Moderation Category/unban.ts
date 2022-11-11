import { Discord, Guard, Slash, SlashOption } from "discordx";
import { Category, PermissionGuard } from "@discordx/utilities";
import { ApplicationCommandOptionType, Colors, CommandInteraction, EmbedBuilder, Snowflake } from "discord.js";

@Discord()
@Category("Moderation")
export class UnbanCommand {
  @Slash({ name: "unban", description: "Unban a user" })
  @Guard(PermissionGuard(["BanMembers"]))
  async unban(
    @SlashOption({
      name: "id",
      description: "Select a user to unban",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    user: Snowflake,
    interaction: CommandInteraction,
  ): Promise<void> {
    try {
      await interaction.guild?.members.unban(user);
    } catch (error) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Something went wrong!")
            .setDescription("User may not exist or something else went *seriously* wrong")
            .setColor(Colors.Red),]
      });
      return;
    }

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("User unbanned")
          .setDescription(`Successfully unbanned <@${user}>`)
          .setColor(Colors.Green),
      ],
      components: [],
    });
  }
}
