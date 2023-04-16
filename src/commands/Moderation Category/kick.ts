import { ButtonComponent, Discord, Guard, Slash, SlashOption } from "discordx";
import { Category, PermissionGuard } from "@discordx/utilities";
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  GuildMember,
} from "discord.js";
import { templateEmbed } from "../../lib/embeds.js";

@Discord()
@Category("Moderation")
export class KickCommand {
  public static buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setLabel("Confirm").setCustomId("confirm_kick").setStyle(ButtonStyle.Danger),
  );

  private selectedUser?: GuildMember;
  private reason = "Not specified";

  @ButtonComponent({ id: "confirm_kick" })
  async handler(interaction: ButtonInteraction): Promise<void> {
    try {
      await this.selectedUser?.kick(this.reason);
    } catch (error) {
      await interaction.update({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Something went wrong!",
            description: "The user may not be kickable or something else went *seriously* wrong",
            interaction,
          }),
        ],
        components: [],
      });
      return;
    }

    await interaction.update({
      embeds: [
        templateEmbed({
          type: "success",
          title: "User kicked",
          description: `Successfully kicked <@${this.selectedUser?.id}>\nReason: \`${this.reason}\``,
          interaction,
        }),
      ],
      components: [],
    });
  }

  @Slash({ name: "kick", description: "Kick a user" })
  @Guard(PermissionGuard(["KickMembers"]))
  async kick(
    @SlashOption({
      name: "user",
      description: "Select a user to kick",
      required: true,
      type: ApplicationCommandOptionType.User,
    })
    @SlashOption({
      name: "reason",
      description: "Reason for kicking the user",
      required: false,
      type: ApplicationCommandOptionType.String,
    })
    user: GuildMember,
    reason = "Not specified",
    interaction: CommandInteraction,
  ): Promise<void> {
    this.selectedUser = user;
    this.reason = reason;

    if (!user.kickable) {
      await interaction.reply({
        embeds: [
          templateEmbed({
            type: "error",
            title: "User not kickable",
            description: "The user is not kickable",
            interaction,
          }),
        ],
      });
      return;
    }

    await interaction.reply({
      embeds: [
        templateEmbed({
          type: "default",
          title: "Are you sure?",
          description: `Are you sure you want to kick <@${user.id}>?`,
          interaction,
        }),
      ],
      components: [KickCommand.buttonRow],
    });
  }
}
