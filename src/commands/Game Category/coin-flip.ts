import { Discord, Slash, SlashOption } from "discordx";
import { Category } from "@discordx/utilities";
import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { templateEmbed } from "../../lib/embeds.js";

@Discord()
@Category("Game")
export class CoinFlipCommand {
  @Slash({ description: "Flip a coin", name: "coin-flip" })
  async coinFlip(
    @SlashOption({
      name: "seed",
      description: "Seed for RNG",
      type: ApplicationCommandOptionType.Integer,
      required: false,
    })
    seed: number = new Date().getTime(),
    interaction: CommandInteraction,
  ): Promise<void> {
    const randomNum = (seedVal: number) => {
      let seed = seedVal;
      const rn = Math.sin(seed++) * 10000;
      return rn - Math.floor(rn);
    };
    const genNum = randomNum(seed) * 100;
    const isEven = Math.trunc(genNum) % 2 === 0;
    await interaction.reply({
      embeds: [
        templateEmbed({
          type: "none",
          title: "🎲 Coin Flip",
          fields: [
            { name: "Result", value: isEven ? "Heads" : "Tails", inline: false },
            { name: "Generated Number", value: String(genNum), inline: false },
            { name: "Seed", value: String(seed), inline: false },
          ],
          interaction,
        }),
      ],
    });
  }
}
