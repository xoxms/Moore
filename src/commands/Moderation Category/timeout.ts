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
export class TimeoutCommand {
  public static buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setLabel("Confirm").setCustomId("confirm_timeout").setStyle(ButtonStyle.Danger),
  );

  private selectedUser?: GuildMember;
  private reason = "Not specified";
  private duration = 0;

  @ButtonComponent({ id: "confirm_timeout" })
  async handler(interaction: ButtonInteraction): Promise<void> {
    try {
      await this.selectedUser?.timeout(this.duration, this.reason);
    } catch (error) {
      await interaction.update({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Something went wrong!",
            description: "The user cannot be timeout or something else went *seriously* wrong",
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
          title: "User timeout",
          description: `Successfully timeout <@${this.selectedUser?.id}>\nReason: \`${this.reason}\``,
          interaction,
        }),
      ],
      components: [],
    });
  }

  @Slash({ name: "timeout", description: "Timeout a user" })
  @Guard(PermissionGuard(["ModerateMembers"]))
  async timeout(
    @SlashOption({
      name: "user",
      description: "Select a user to timeout",
      required: true,
      type: ApplicationCommandOptionType.User,
    })
    @SlashOption({
      name: "reason",
      description: "Reason to timeout the user",
      required: false,
      type: ApplicationCommandOptionType.String,
    })
    @SlashOption({
      name: "duration",
      description: "Select a duration to timeout in minutes (0 for clear)",
      required: false,
      type: ApplicationCommandOptionType.Number,
    })
    user: GuildMember,
    reason = "Not specified",
    duration = 0,
    interaction: CommandInteraction,
  ): Promise<void> {
    this.selectedUser = user;
    this.reason = reason;
    this.duration = duration * 60000;

    if (!user.moderatable) {
      await interaction.reply({
        embeds: [
          templateEmbed({
            type: "error",
            title: "User not timeoutable",
            description: "The user cannot be timeout",
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
          description: `Are you sure you want to timeout <@${user.id}>?`,
          interaction,
        }),
      ],
      components: [TimeoutCommand.buttonRow],
    });
  }
}
