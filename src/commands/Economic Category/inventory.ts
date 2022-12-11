import { Discord, Slash } from "discordx";
import { Category } from "@discordx/utilities";
import { CommandInteraction } from "discord.js";
import { getUserInventoryData } from "../../lib/utils.js";
import { bot } from "../../index.js";
import { Pagination, PaginationType } from "@discordx/pagination";
import { Item } from "../../typings/types";
import { templateEmbed } from "../../lib/embeds.js";

@Discord()
@Category("Economic")
export class InventoryCommand {
  @Slash({ name: "inventory", description: "Check your inventory" })
  async inventory(interaction: CommandInteraction): Promise<void> {
    const inventory = await getUserInventoryData(interaction.user.id, interaction);
    if (!inventory) return;

    function generatePage(items: Array<Array<Item & { quantity: number }>>) {
      const pages = items;
      return pages.map((page) => {
        const embed = templateEmbed({
          type: "default",
          title: `${interaction.user.username}'s inventory`,
          emote: "🎒",
          thumbnail: bot.user!.displayAvatarURL(),
          interaction,
        });

        page.forEach((item) => {
          embed.addFields({
            name: `${item.emoji} ${item.name} — ${item.quantity}`,
            value: `Item ID \`${item.id}\` — ${item.type}`,
          });
        });

        return {
          embeds: [embed],
        };
      });
    }

    const inventoryItems = inventory.reduce((arr: Array<any>, item, index) => {
      const chunkIndex = Math.floor(index / 5);
      if (!arr[chunkIndex]) arr[chunkIndex] = [];
      arr[chunkIndex].push(item);
      return arr;
    }, []);

    const pagination = new Pagination(interaction, generatePage(inventoryItems), {
      type: PaginationType.Button,
    });
    await pagination.send();
  }
}
