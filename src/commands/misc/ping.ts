import type { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import { bot } from "../../index.js";
import { Category } from "@discordx/utilities";

@Discord()
@Category("Miscellaneous")
export class PingCommand {
  @Slash({ description: "Replies with pong!", name: "ping" })
  async ping(interaction: CommandInteraction): Promise<void> {
    const sent = await interaction.reply({
      content: "Pinging...",
      fetchReply: true,
    });

    const timeDiff = (sent.createdTimestamp - interaction.createdTimestamp);
    await interaction.editReply(`🏓Pong!\nRound-trip latency: ${timeDiff} ms\nWebsocket heartbeat: ${Math.round(bot.ws.ping)} ms`);
  }
}
