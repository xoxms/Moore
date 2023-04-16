import { Discord, Guard, Slash, SlashOption } from "discordx";
import { Category, PermissionGuard } from "@discordx/utilities";
import { ApplicationCommandOptionType, CommandInteraction, Snowflake } from "discord.js";
import { templateEmbed } from "../../lib/embeds.js";

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
          templateEmbed({
            type: "error",
            title: "Something went wrong!",
            description: "User may not exist or something else went *seriously* wrong",
            interaction,
          }),
        ],
      });
      return;
    }

    await interaction.reply({
      embeds: [
        templateEmbed({
          type: "success",
          title: "User unbanned",
          description: `Successfully unbanned <@${user}>`,
          interaction,
        }),
      ],
      components: [],
    });
  }
}
