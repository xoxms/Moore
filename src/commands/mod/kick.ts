import { ButtonComponent, Discord, Slash, SlashOption } from "discordx";
import { Category } from "@discordx/utilities";
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
export class KickCommand {
  public static buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setLabel("Confirm").setCustomId("confirm_kick").setStyle(ButtonStyle.Danger),
  );

  private selectedUser?: GuildMember;
  private reason: string = "Not specified";

  @ButtonComponent({ id: "confirm_kick" })
  async handler(interaction: ButtonInteraction): Promise<void> {
    try {
      await this.selectedUser?.kick(this.reason);
    } catch (error) {
      await interaction.update({
        embeds: [
          new EmbedBuilder()
            .setTitle("Something went wrong!")
            .setDescription("The user may not be kickable or something else went *seriously* wrong")
            .setColor(Colors.Red),
        ],
        components: [],
      });
      return;
    }

    await interaction.update({
      embeds: [
        new EmbedBuilder()
          .setTitle("User kicked")
          .setDescription(`Successfully kicked <@${this.selectedUser?.id}>\nReason: \`${this.reason}\``)
          .setColor(Colors.Green),
      ],
      components: [],
    });
  }

  @Slash({ name: "kick", description: "Kick a user" })
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
      reason: string = "Not specified",
      interaction: CommandInteraction,
  ): Promise<void> {
    this.selectedUser = user;
    this.reason = reason;

    if (!user.kickable) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("User not kickable")
            .setDescription("The user may have a higher role than me or I may not have the ban permission")
            .setColor(Colors.Red),
        ],
      });
      return;
    }

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Are you sure?")
          .setDescription(`You are about to kick <@${user.id}>`)
          .setColor(Colors.Red)
          .setThumbnail(user.displayAvatarURL())
          .setFooter({ iconURL: interaction.user.displayAvatarURL(), text: `Requested by ${interaction.user.tag}` })
          .setTimestamp(),
      ],
      components: [KickCommand.buttonRow],
    });
  }
}
