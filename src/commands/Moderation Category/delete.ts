import { Discord, Guard, Slash, SlashOption } from "discordx";
import { Category, PermissionGuard } from "@discordx/utilities";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { Colors, CommandInteraction, EmbedBuilder, TextChannel } from "discord.js";

@Discord()
@Category("Moderation")
export class DeleteMessageCommand {
  @Slash({ name: "delete", description: "Delete message within 2 weeks old" })
  @Guard(PermissionGuard(["ManageMessages"]))
  async delete(
    @SlashOption({
      name: "amount",
      description: "Select a amount of message to delete",
      required: true,
      type: ApplicationCommandOptionType.Number,
    })
    amount: number,
    interaction: CommandInteraction,
  ): Promise<void> {
    try {
      await (interaction.channel as TextChannel)?.bulkDelete(amount);
    } catch (error) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Something went wrong!")
            .setDescription("I don't have permission to delete message or something else went *seriously* wrong")
            .setColor(Colors.Red),
        ],
      });
    }

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Message deleted")
          .setDescription(`Successfully deleted \`${amount}\` messages`)
          .setColor(Colors.Green),
      ],
    });
  }
}
