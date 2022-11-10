import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { Category } from "@discordx/utilities";
import { ApplicationCommandOptionType, Colors, CommandInteraction, EmbedBuilder, GuildMember } from "discord.js";

@Discord()
@Category("Miscellaneous")
@SlashGroup({
  description: "Get user info or server info",
  name: "info",
})
@SlashGroup("info")
export class InfoCommand {
  @Slash({ description: "Get user info", name: "user" })
  async user(
    @SlashOption({
      description: "User to get info",
      name: "user",
      type: ApplicationCommandOptionType.User,
      required: true,
    })
      member: GuildMember,
      interaction: CommandInteraction,
  ): Promise<void> {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`🙍‍♂ User ${member.user.username}`)
          .addFields([
            { name: "💳 Username", value: member.user.username, inline: true },
            { name: "✏ Nickname", value: member.nickname ? member.nickname : "No nickname", inline: true },
            { name: "🆔 UserID", value: member.user.id.toString(), inline: true },
            { name: "#️⃣ Discriminator", value: member.user.discriminator, inline: true },
            {
              name: "🕐 Joined Discord",
              value: `<t:${Math.trunc(member.user.createdTimestamp / 1000)}:R>`,
              inline: true,
            },
            {
              name: "👋 Joined Server",
              value: `<t:${Math.trunc(member.joinedTimestamp! / 1000)}:R>`,
              inline: true,
            },
          ])
          .setThumbnail(member.user.avatarURL())
          .setColor(Colors.Blurple)
          .setImage(member.user.banner ?? "https://i.redd.it/pyeuy7iyfw961.png"),
      ],
    });
  }

  @Slash({ description: "Get server info", name: "server" })
  async server(interaction: CommandInteraction): Promise<void> {
    const server = await interaction.guild!;

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`🚀 Server ${server.name}`)
          .setColor(Colors.Blurple)
          .addFields([
            { name: "👋 Server name", value: server.name, inline: true },
            { name: "📃 Server ID", value: server.id.toString(), inline: true },
            { name: "🙍‍♂️ Server Owner", value: `<@${server.ownerId}>`, inline: true },
            { name: "👪 All member", value: `${server.memberCount} members`, inline: true },
            { name: "🚫 NSFW Level", value: server.nsfwLevel.toString(), inline: true },
            { name: "👮‍♀️ Verification level", value: server.verificationLevel.toString(), inline: true },
            { name: "✅ isVerified", value: server.verified.toString(), inline: true },
            { name: "🚨 mfaLevel", value: server.mfaLevel.toString(), inline: true },
          ])
          .setThumbnail(<string>server.iconURL()),
      ],
    });
  }
}
