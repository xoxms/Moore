import { Discord, Guard, Slash, SlashGroup, SlashOption } from "discordx";
import { Category, PermissionGuard } from "@discordx/utilities";
import { Colors, CommandInteraction, EmbedBuilder, GuildMember, RoleManager, RoleResolvable } from "discord.js";
import { ApplicationCommandOptionType } from "discord-api-types/v10";

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
          new EmbedBuilder()
            .setTitle("Something went wrong!")
            .setDescription("I don't have permission to manage roles or something else went *seriously* wrong")
            .setColor(Colors.Red)
            .setFooter({
              text: `Requested by ${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
      });
    }

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Role given successfully")
          .setDescription(`Successfully gave <@&${role}> to <@${user.id}>`)
          .setColor(Colors.Green)
          .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp(),
      ],
    });
  }

  @Slash({ name: "remvoe", description: "Give a role from a user" })
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
          new EmbedBuilder()
            .setTitle("Something went wrong!")
            .setDescription("I don't have permission to manage roles or something else went *seriously* wrong")
            .setColor(Colors.Red)
            .setFooter({
              text: `Requested by ${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
      });
    }

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Role removed successfully")
          .setDescription(`Successfully removed <@&${role}> from <@${user.id}>`)
          .setColor(Colors.Green)
          .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp(),
      ],
    });
  }
}
