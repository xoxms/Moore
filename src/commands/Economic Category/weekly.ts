import { Discord, Slash } from "discordx";
import { Category } from "@discordx/utilities";
import { CommandInteraction } from "discord.js";
import { findTargetUser, saveNewUserData } from "../../lib/utils.js";
import ms from "ms";
import { templateEmbed } from "../../lib/embeds.js";

@Discord()
@Category("Economic")
export class WeeklyCommand {
  @Slash({ name: "weekly", description: "Claim your weekly reward" })
  async weekly(interaction: CommandInteraction): Promise<void> {
    const data = await findTargetUser(interaction.user.id, interaction);
    if (!data) return;

    if (Date.now() - (<any>data.timeout).weekly < ms("7d")) {
      await interaction.reply({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Cannot claimed",
            description: `You can claim your daily reward again in **${ms(
              ms("7d") - (Date.now() - (<any>data.timeout).daily),
              {
                long: true,
              },
            )}**`,
            interaction,
          }),
        ],
      });
      return;
    }

    (<any>data.timeout).weekly = Date.now();
    data.coin! += 1500;
    await saveNewUserData(interaction.user.id, data);
    await interaction.reply({
      embeds: [
        templateEmbed({
          type: "success",
          title: "Successfully claimed",
          description: "You have successfully claimed your weekly reward",
          interaction,
        }),
      ],
    });
  }
}
