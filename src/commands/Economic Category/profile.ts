import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { Category } from "@discordx/utilities";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { CommandInteraction, GuildMember } from "discord.js";
import { createNewProfile, findTargetUser, getFullUserDetails } from "../../lib/utils.js";
import { templateEmbed } from "../../lib/embeds.js";

@Discord()
@Category("Economic")
@SlashGroup({
  name: "profile",
  description: "View or create new profile",
})
@SlashGroup("profile")
export class ProfileCommand {
  @Slash({ description: "View your profile" })
  async view(
    @SlashOption({
      name: "user",
      description: "User to check their profile",
      type: ApplicationCommandOptionType.User,
      required: false,
    })
    user: GuildMember,
    interaction: CommandInteraction,
  ): Promise<void> {
    const targetUser = user || interaction;
    const data = await getFullUserDetails(targetUser.user.id, interaction);
    if (!data) return;

    await interaction.reply({
      embeds: [
        templateEmbed({
          type: "default",
          title: `${targetUser.user.username}'s profile`,
          fields: [
            {
              name: "💾 Levels",
              value: String(data.level || 1),
              inline: true,
            },
            {
              name: "✨ Experience",
              value: `${String(data.xp || 0)} XPs`,
              inline: true,
            },
            {
              name: "💰 Coins",
              value: `${String(data.coin || 0)} Coins`,
              inline: true,
            },
            {
              name: "🏦 Net Worth",
              value: `${String(
                Number(data.coin) +
                  Number(data.inventory.reduce((acc, cur) => acc + (cur.price || 0) * cur.quantity, 0)),
              )} Coins`,
              inline: true,
            },
            {
              name: "💼 Jobs",
              value: data.jobs || "None",
              inline: true,
            },
          ],
          thumbnail: targetUser.user.displayAvatarURL(),
          interaction,
        }),
      ],
    });
  }

  @Slash({ description: "Create new profile" })
  async create(interaction: CommandInteraction): Promise<void> {
    const data = await findTargetUser(interaction.user.id);
    if (data) {
      await interaction.reply({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Cannot perform operation",
            description: "You already created your profile",
            interaction,
          }),
        ],
      });
      return;
    }

    await createNewProfile(interaction.user.id);

    await interaction.reply({
      embeds: [
        templateEmbed({
          type: "success",
          title: "Successfully perform operation",
          description: "Your profile has been created! Check your profile with `/profile view` command",
          interaction,
        }),
      ],
    });
  }
}
