import { Discord, Slash } from "discordx";
import { Category } from "@discordx/utilities";
import { Colors, CommandInteraction, EmbedBuilder } from "discord.js";
import { prisma } from "../../database/connect.js";

@Discord()
@Category("Economic")
export class LeaderboardCommand {
  @Slash({ name: "leaderboard", description: "Show the leaderboard" })
  async leaderboard(interaction: CommandInteraction): Promise<void> {
    const leader = await prisma.user.findMany({
      orderBy: {
        coin: "desc",
      },
      take: 10,
    });

    if (!leader) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("❌ No one's here...")
            .setDescription("No one create their account yet. Use `/profile create` command to create one.")
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

    const leaderboard = leader.map((u, i) => `**${i + 1}.** <@${u.userId}> - **${u.coin}** coins`);

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("🏆 Global Leaderboard")
          .setDescription(leaderboard.join("\n"))
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
