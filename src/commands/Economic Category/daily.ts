import { Discord, Slash } from "discordx";
import { Category } from "@discordx/utilities";
import { CommandInteraction } from "discord.js";
import { findTargetUser, saveNewUserData } from "../../lib/utils.js";
import ms from "ms";
import { templateEmbed } from "../../lib/embeds.js";

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
          templateEmbed({
            type: "error",
            title: "Cannot claimed",
            description: `You can claim your daily reward again in **${ms(
              ms("1d") - (Date.now() - (<any>data.timeout).daily),
              {
                long: true,
              },
            )}**`,
            interaction,
          }),
        ],
      });
    }

    (<any>data.timeout).daily = Date.now();
    data.coin! += 150;
    await saveNewUserData(interaction.user.id, data);
    await interaction.reply({
      embeds: [
        templateEmbed({
          type: "success",
          title: "Successfully claimed",
          description: "You have successfully claimed your daily reward",
          interaction,
        }),
      ],
    });
  }
}
