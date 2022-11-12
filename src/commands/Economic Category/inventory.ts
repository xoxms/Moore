import { Discord, Slash } from "discordx";
import { Category } from "@discordx/utilities";
import { Colors, CommandInteraction, EmbedBuilder } from "discord.js";
import { getUserInventoryData } from "../../lib/utils.js";

@Discord()
@Category("Economic")
export class Command {
  @Slash({ name: "inventory", description: "Check your inventory" })
  async inventory(
    interaction: CommandInteraction
  ): Promise<void> {
    const inventory = await getUserInventoryData(interaction.user.id);
    if (!inventory) return;

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`🎒 ${interaction.user.username}'s inventory`)
          .setDescription(
            inventory.map((item) => `${item.emoji} **${item.name}** — ${item.quantity}\n*Item ID* \`${item.id}\` — ${
              item.type}`).join("\n\n") || "You don't have any items in your inventory"
          )
          .setColor(Colors.Green)
      ]
    });
  }
}