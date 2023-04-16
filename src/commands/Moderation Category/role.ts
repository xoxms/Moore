import { Discord, Guard, Slash, SlashGroup, SlashOption } from "discordx";
import { Category, PermissionGuard } from "@discordx/utilities";
import { CommandInteraction, GuildMember, RoleResolvable } from "discord.js";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { templateEmbed } from "../../lib/embeds.js";

@Discord()
@Category("Moderation")
@SlashGroup({
  description: "Give or remove role from a user",
  name: "role",
})
@SlashGroup("role")
export class RoleCommand {
  @Slash({ name: "give", description: "Give a role to a user" })
  @Guard(PermissionGuard(["ManageRoles"]))
  async give(
    @SlashOption({
      name: "user",
      description: "Select a user to give a role",
      required: true,
      type: ApplicationCommandOptionType.User,
    })
    @SlashOption({
      name: "role",
      description: "Select a role to give to a user",
      required: true,
      type: ApplicationCommandOptionType.Role,
    })
    user: GuildMember,
    role: RoleResolvable,
    interaction: CommandInteraction,
  ): Promise<void> {
    try {
      await user.roles.add(role);
    } catch (error) {
      await interaction.reply({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Something went wrong!",
            description: "I don't have permission to manage roles or something else went *seriously* wrong",
            interaction,
          }),
        ],
      });
    }

    await interaction.reply({
      embeds: [
        templateEmbed({
          type: "success",
          title: "Role given successfully",
          description: `Successfully gave ${role} to <@${user.id}>`,
          interaction,
        }),
      ],
    });
  }

  @Slash({ name: "remove", description: "Give a role from a user" })
  @Guard(PermissionGuard(["ManageRoles"]))
  async remove(
    @SlashOption({
      name: "user",
      description: "Select a user to remove a role",
      required: true,
      type: ApplicationCommandOptionType.User,
    })
    @SlashOption({
      name: "role",
      description: "Select a role to remove from a user",
      required: true,
      type: ApplicationCommandOptionType.Role,
    })
    user: GuildMember,
    role: RoleResolvable,
    interaction: CommandInteraction,
  ): Promise<void> {
    try {
      await user.roles.remove(role);
    } catch (error) {
      await interaction.reply({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Something went wrong!",
            description: "I don't have permission to manage roles or something else went *seriously* wrong",
            interaction,
          }),
        ],
      });
    }

    await interaction.reply({
      embeds: [
        templateEmbed({
          type: "success",
          title: "Role removed successfully",
          description: `Successfully removed ${role} from <@${user.id}>`,
          interaction,
        }),
      ],
    });
  }
}
