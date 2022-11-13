import { Discord, Slash } from "discordx";
import { Category } from "@discordx/utilities";
import { Colors, CommandInteraction, EmbedBuilder } from "discord.js";
import { findTargetUser, saveNewUserData } from "../../lib/utils";
import ms from "ms";

@Discord()
@Category("Economic")
export class DailyCommand {
  @Slash({ name: "daily", description: "Claim your daily reward" })
  async daily(interaction: CommandInteraction): Promise<void> {
    const data = await findTargetUser(interaction.user.id, interaction);
    if (!data) return;

    if (Date.now() - (<any>data.timeout).daily < ms("1d")) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("❌ You have already claimed your daily reward")
            .setDescription(
              `You can claim your daily reward again in **${ms(ms("1d") - (Date.now() - (<any>data.timeout).daily), {
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
    }

    (<any>data.timeout).daily = Date.now();
    data.coin! += 150;
    await saveNewUserData(interaction.user.id, data);
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("✅ Successfully claimed your daily reward")
          .setDescription("You have successfully claimed your daily reward")
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
