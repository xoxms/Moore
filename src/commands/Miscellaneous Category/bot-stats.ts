import { Category } from "@discordx/utilities";
import { Discord, Slash, SlashGroup } from "discordx";
import { Colors, CommandInteraction, EmbedBuilder } from "discord.js";
import ms from "ms";
import os from "os";
import { version } from "discord.js";
import { bot } from "../../index.js";

@Discord()
@Category("Miscellaneous")
@SlashGroup({ description: "Get bot stats", name: "bot-stats" })
@SlashGroup("bot-stats")
export class BotStatsCommand {
  @Slash({ description: "Get bot server stats", name: "server" })
  async server(interaction: CommandInteraction): Promise<void> {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Bot server info")
          .setThumbnail(bot.user!.displayAvatarURL())
          .addFields([
            { name: "Platform", value: `${os.platform()} ${os.release()}`, inline: true },
            { name: "Architecture", value: os.arch(), inline: true },
            { name: "System Uptime", value: ms(ms(`${os.uptime()}s`)), inline: true },
            { name: "System Hostname", value: os.hostname(), inline: true },
            { name: "CPUs", value: [...new Set(os.cpus().map((x) => x.model))].join("\n"), inline: true },
            { name: "CPU Cores", value: os.cpus().length.toString(), inline: true },
            { name: "RAM Free", value: `${(os.freemem() / 1024 / 1024).toFixed(2)} MB`, inline: true },
            { name: "RAM Total", value: `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`, inline: true },
            { name: "RAM Usage", value: `${((1 - os.freemem() / os.totalmem()) * 100).toFixed(2)}%`, inline: true },
            { name: "Discord.js Version", value: `v${version}`, inline: true },
            { name: "Node.js Version", value: process.version, inline: true },
            { name: "Bots Version", value: "0.0.1", inline: true },
          ])
          .setColor([0, 153, 255])
          .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.avatarURL()!,
          }),
      ],
    });
  }

  @Slash({ description: "Get bot user stats", name: "user" })
  async user(interaction: CommandInteraction): Promise<void> {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Bot info")
          .setColor(Colors.Blue)
          .setDescription(
            `
            **Servers:** ${bot.guilds.cache.size}
            **Members:** ${bot.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}
            **Channels:** ${bot.channels.cache.size}
            **Commands:** ${bot.application?.commands.cache.size}
            **Uptime:** ${ms(bot.uptime!)}
          `,
          )
          .setThumbnail(bot.user!.displayAvatarURL())
          .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.avatarURL()!,
          }),
      ],
    });
  }
}
