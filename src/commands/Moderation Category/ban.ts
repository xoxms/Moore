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
export class BanCommand {
  public static buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setLabel("Confirm").setCustomId("confirm_ban").setStyle(ButtonStyle.Danger),
  );

  private selectedUser?: GuildMember;
  private reason = "Not specified";

  @ButtonComponent({ id: "confirm_ban" })
  async handler(interaction: ButtonInteraction): Promise<void> {
    try {
      await this.selectedUser?.ban({ reason: this.reason });
    } catch (error) {
      await interaction.update({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Something went wrong!",
            description: "The user may not be bannable or something else went *seriously* wrong",
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
          title: "User banned",
          description: `Successfully banned <@${this.selectedUser?.id}>\nReason: \`${this.reason}\``,
          interaction,
        }),
      ],
      components: [],
    });
  }

  @Slash({ name: "ban", description: "Ban a user" })
  @Guard(PermissionGuard(["BanMembers"]))
  async ban(
    @SlashOption({
      name: "user",
      description: "Select a user to ban",
      required: true,
      type: ApplicationCommandOptionType.User,
    })
    @SlashOption({
      name: "reason",
      description: "Reason for banning the user",
      required: false,
      type: ApplicationCommandOptionType.String,
    })
    user: GuildMember,
    reason: string,
    interaction: CommandInteraction,
  ): Promise<void> {
    this.selectedUser = user;
    this.reason = reason;

    if (!user.bannable) {
      await interaction.reply({
        embeds: [
          templateEmbed({
            type: "error",
            title: "User not bannable",
            description: "The user may have a higher role than me or I may not have the ban permission",
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
          description: `Are you sure you want to ban <@${user.id}>?`,
          interaction,
        }),
      ],
      components: [BanCommand.buttonRow],
    });
  }
}
