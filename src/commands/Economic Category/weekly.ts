import { Discord, Slash } from "discordx";
import { Category } from "@discordx/utilities";
import { Colors, CommandInteraction, EmbedBuilder } from "discord.js";
import { findTargetUser, saveNewUserData } from "../../lib/utils.js";
import ms from "ms";

@Discord()
@Category("Economic")
export class WeeklyCommand {
  @Slash({ name: "weekly", description: "Claim your weekly reward" })
  async weekly(interaction: CommandInteraction): Promise<void> {
    const data = await findTargetUser(interaction.user.id, interaction);
    if (!data) return;

    if (Date.now() - (<any>data.timeout).daily < ms("7d")) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("❌ You have already claimed your weekly reward")
            .setDescription(
              `You can claim your daily reward again in **${ms(ms("7d") - (Date.now() - (<any>data.timeout).daily), {
                long: true,
              })}**`,
            )
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

    (<any>data.timeout).daily = Date.now();
    data.coin! += 1500;
    await saveNewUserData(interaction.user.id, data);
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("✅ Successfully claimed your weekly reward")
          .setDescription("You have successfully claimed your weekly reward")
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
