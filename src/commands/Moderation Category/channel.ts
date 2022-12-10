import { Discord, Guard, Slash, SlashGroup, SlashOption } from "discordx";
import { Category, PermissionGuard } from "@discordx/utilities";
import {
  CategoryChannelResolvable,
  ChannelType,
  Colors,
  CommandInteraction,
  EmbedBuilder,
  NonThreadGuildBasedChannel,
  TextChannel,
} from "discord.js";
import { ApplicationCommandOptionType } from "discord-api-types/v10";

@Discord()
@Category("Moderation")
@SlashGroup({
  description: "Create or delete a channel",
  name: "channel",
})
@SlashGroup("channel")
export class RoleCommand {
  @Slash({ name: "delete", description: "Delete a channel" })
  @Guard(PermissionGuard(["ManageRoles"]))
  async remove(
    @SlashOption({
      name: "channel",
      description: "Channel to delete",
      required: true,
      type: ApplicationCommandOptionType.Channel,
    })
    channel: TextChannel,
    interaction: CommandInteraction,
  ): Promise<void> {
    try {
      await channel.delete();
    } catch (error) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Something went wrong!")
            .setDescription("I don't have permission to manage channels or something else went *seriously* wrong")
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

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Channel deleted successfully")
          .setDescription(`Successfully deleted ${channel.name} channel`)
          .setColor(Colors.Green)
          .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp(),
      ],
    });
  }

  @Slash({ name: "create", description: "Create new channel" })
  @Guard(PermissionGuard(["ManageChannels"]))
  async create(
    @SlashOption({
      name: "name",
      description: "Channel name",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    @SlashOption({
      name: "type",
      description: "Channel type (text, voice)",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    @SlashOption({
      name: "category",
      description: "Channel root category",
      required: false,
      type: ApplicationCommandOptionType.String,
    })
    @SlashOption({
      name: "topic",
      description: "Channel topic",
      required: false,
      type: ApplicationCommandOptionType.String,
    })
    @SlashOption({
      name: "age-restricted",
      description: "Channel age restriction",
      required: false,
      type: ApplicationCommandOptionType.Boolean,
    })
    name: string,
    type: string,
    category: string,
    topic: string,
    ageRestricted: boolean,
    interaction: CommandInteraction,
  ): Promise<void> {
    if (type !== "text" && type !== "voice") {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Invalid input!")
            .setDescription("Channel type must be either text or voice")
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
    const guildChannel = await interaction.guild!.channels.fetch();

    try {
      await interaction.guild!.channels.create({
        name,
        type: type === "text" ? ChannelType.GuildText : ChannelType.GuildVoice,
        topic,
        nsfw: ageRestricted,
        parent: guildChannel.find(
          (c: NonThreadGuildBasedChannel | null) => c?.name === category,
        ) as CategoryChannelResolvable,
      });
    } catch (error) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Something went wrong!")
            .setDescription("I don't have permission to manage channel or something else went *seriously* wrong")
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

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Channel created successfully")
          .setDescription(`Successfully created ${name} channel`)
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
