import { Discord, Slash } from "discordx";
import { Category } from "@discordx/utilities";
import { CommandInteraction } from "discord.js";
import { prisma } from "../../database/connect.js";
import { templateEmbed } from "../../lib/embeds.js";

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
          templateEmbed({
            type: "error",
            title: "Not found",
            description: "No one create their user profile yet...",
            interaction,
          }),
        ],
      });
      return;
    }

    const leaderboard = leader.map((u, i) => `**${i + 1}.** <@${u.userId}> - **${u.coin}** coins`);

    await interaction.reply({
      embeds: [
        templateEmbed({
          type: "default",
          title: "Global Leaderboard",
          description: leaderboard.join("\n"),
          emote: "🏆",
          interaction,
        }),
      ],
    });
  }
}
