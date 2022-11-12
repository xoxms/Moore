import { Discord, SlashGroup, Slash, SlashOption } from "discordx";
import { Category } from "@discordx/utilities";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { Colors, CommandInteraction, EmbedBuilder, GuildMember } from "discord.js";
import { createNewProfile, findTargetUser, getFullUserDetails } from "../../lib/utils.js";

@Discord()
@Category("Economic")
@SlashGroup({
  name: "profile",
  description: "View or create new profile"
})
@SlashGroup("profile")
export class ProfileCommand {
  @Slash({ description: "View your profile" })
  async view(
    @SlashOption({
      name: "user",
      description: "User to check their profile",
      type: ApplicationCommandOptionType.User,
      required: false
    })
      user: GuildMember,
      interaction: CommandInteraction,
  ): Promise<void> {
    const targetUser = user || interaction;
    const data = await getFullUserDetails(targetUser.user.id, interaction);
    if (!data) return;

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`${targetUser.user.username}'s profile`)
          .setFields([
            {
              name: "💾 Levels",
              value: String(data.level || 1),
              inline: true
            },
            {
              name: "✨ Experience",
              value: String(data.xp || 0),
              inline: true
            },
            {
              name: "💰 Coins",
              value: String(data.coin || 0),
              inline: true
            },
            {
              name: "🏦 Net Worth",
              value: String(
                (
                  Number(data.coin) +
                  Number(
                    data.inventory.reduce(
                      (acc, cur) => acc + (cur.price || 0) * cur.quantity,
                      0
                    )
                  )
                )
              ),
              inline: true
            },
            {
              name: "💼 Jobs",
              value: data.jobs || "None",
              inline: true
            },
          ])
          .setColor(Colors.Green)
          .setThumbnail(targetUser.user.displayAvatarURL())
          .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp(),
        ]
    });
  }

  @Slash({ description: "Create new profile" })
  async create(
    interaction: CommandInteraction,
  ): Promise<void> {
    const data = await findTargetUser(interaction.user.id);
    if (data) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("❌ Profile already created")
            .setDescription("You already have a profile")
            .setColor(Colors.Red)
            .setFooter({
              text: `Requested by ${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp(),
        ]
      });
      return;
    }

    await createNewProfile(interaction.user.id);

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("✅ Profile created")
          .setDescription("Your profile has been created")
          .setColor(Colors.Green)
          .setThumbnail(interaction.user.displayAvatarURL())
          .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp(),
      ]
    });
  }
}