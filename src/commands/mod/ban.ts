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
export class BanCommand {
  public static buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setLabel("Confirm").setCustomId("confirm_ban").setStyle(ButtonStyle.Danger),
  );

  private selectedUser?: GuildMember;
  private reason: string = "Not specified";

  @ButtonComponent({ id: "confirm_ban" })
  async handler(interaction: ButtonInteraction): Promise<void> {
    try {
      await this.selectedUser?.ban({ reason: this.reason });
    } catch (error) {
      await interaction.update({
        embeds: [
          new EmbedBuilder()
            .setTitle("Something went wrong!")
            .setDescription("The user may not be bannable or something else went *seriously* wrong")
            .setColor(Colors.Red),
        ],
        components: [],
      });
      return;
    }
    await interaction.update({
      embeds: [
        new EmbedBuilder()
          .setTitle("User banned")
          .setDescription(`Successfully banned <@${this.selectedUser?.id}>\nReason: \`${this.reason}\``)
          .setColor(Colors.Green),
      ],
      components: [],
    });
  }

  @Slash({ name: "ban", description: "Ban a user" })
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
          new EmbedBuilder()
            .setTitle("User not bannable")
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
          .setDescription(`You are about to ban <@${user.id}>`)
          .setColor(Colors.Red)
          .setThumbnail(user.displayAvatarURL())
          .setFooter({ iconURL: interaction.user.displayAvatarURL(), text: `Requested by ${interaction.user.tag}` })
          .setTimestamp(),
      ],
      components: [BanCommand.buttonRow],
    });
  }
}
