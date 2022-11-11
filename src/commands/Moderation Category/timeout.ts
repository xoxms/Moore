import { ButtonComponent, Discord, Guard, Slash, SlashOption } from "discordx";
import { Category, PermissionGuard } from "@discordx/utilities";
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  Colors,
  CommandInteraction,
  EmbedBuilder,
  GuildMember,
} from "discord.js";

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
          new EmbedBuilder()
            .setTitle("Something went wrong!")
            .setDescription("The user may not able to be timeout or something else went *seriously* wrong")
            .setColor(Colors.Red),
        ],
        components: [],
      });
      return;
    }

    await interaction.update({
      embeds: [
        new EmbedBuilder()
          .setTitle("User timeout")
          .setDescription(
            `Successfully timeout <@${this.selectedUser?.id}>\nDuration: \`${this.duration / 60000} minutes\``,
          )
          .setColor(Colors.Green),
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
    interaction: CommandInteraction,
    user: GuildMember,
    reason = "Not specified",
    duration = 0,
  ): Promise<void> {
    this.selectedUser = user;
    this.reason = reason;
    this.duration = duration * 60000;

    if (!user.moderatable) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("User cannot be timeout")
            .setDescription("The user may have a higher role than me or I may not have the ban permission")
            .setColor(Colors.Red)
            .setFooter({
              text: `Requested by ${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
      });
      return;
    }

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Are you sure?")
          .setDescription(`You are about to timeout <@${user.id}>`)
          .setColor(Colors.Red)
          .setThumbnail(user.displayAvatarURL())
          .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp(),
      ],
      components: [TimeoutCommand.buttonRow],
    });
  }
}
