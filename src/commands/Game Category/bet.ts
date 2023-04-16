import { Discord, Slash, SlashOption } from "discordx";
import { Category } from "@discordx/utilities";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { CommandInteraction } from "discord.js";
import { templateEmbed } from "../../lib/embeds.js";

@Discord()
@Category("Game")
export class BetCommand {
  @Slash({ description: "Bet on a number between 1 and 10", name: "bet" })
  async bet(
    @SlashOption({
      name: "number",
      description: "Number to bet on",
      type: ApplicationCommandOptionType.Number,
      required: true,
    })
    @SlashOption({
      name: "amount",
      description: "Amount of money to bet on",
      type: ApplicationCommandOptionType.Number,
      required: true,
    })
    number: number,
    amount: number,
    interaction: CommandInteraction,
  ): Promise<void> {
    const random = Math.floor(Math.random() * 10) + 1;
    if (number === random) {
      await interaction.reply({
        embeds: [
          templateEmbed({
            type: "default",
            title: "You won!",
            description: `The number was ${random}\nYou won ${Math.ceil(amount * 1.3)} coins`,
            interaction,
          }),
        ],
      });
    } else {
      await interaction.reply({
        embeds: [
          templateEmbed({
            type: "error",
            title: "You lost!",
            description: `The number was ${random}\nYou lost ${amount} coins`,
            interaction,
          }),
        ],
      });
    }
  }
}
