import { Discord, Slash, SlashOption } from "discordx";
import { ApplicationCommandOptionType, Colors, CommandInteraction, EmbedBuilder } from "discord.js";
import { Category } from "@discordx/utilities";

@Discord()
@Category("Game")
export class Magic8Ball {
  @Slash({ description: "Ask a question to the magic 8 ball", name: "8ball" })
  async magic8ball(
    @SlashOption({
      description: "Question to ask",
      name: "question",
      type: ApplicationCommandOptionType.String,
      required: true,
    })
    question: string,
    interaction: CommandInteraction,
  ): Promise<void> {
    const answers = [
      "Signs point to yes.",
      "Yes.",
      "Reply hazy, try again.",
      "Without a doubt.",
      "My sources say no.",
      "As I see it, yes.",
      "You may rely on it.",
      "Concentrate and ask again.",
      "Outlook not so good.",
      "It is decidedly so.",
      "Better not tell you now.",
    ];

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("🔮Magic 8 Ball")
          .setDescription(
            `**Question:** ${question}\n**Answer:** ${answers[Math.floor(Math.random() * answers.length)]}`,
          )
          .setColor(Colors.Blue)
          .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp(),
      ],
    });
  }
}
