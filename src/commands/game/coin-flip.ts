import { Discord, Slash, SlashOption } from "discordx";
import { Category } from "@discordx/utilities";
import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder } from "discord.js";

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
      interaction: CommandInteraction,
      seed: number = new Date().getTime(),
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
        new EmbedBuilder()
          .setTitle("🎲 Coin Flip")
          .addFields([
            { name: "Result", value: isEven ? "Heads" : "Tails" },
            { name: "Generated Number", value: String(genNum) },
            { name: "Seed", value: String(seed) },
          ])
          .setColor([0, 255, 0]),
      ],
    });
  }
}
