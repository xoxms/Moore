import { Discord, Slash, SlashOption } from "discordx";
import { Category } from "@discordx/utilities";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { CommandInteraction } from "discord.js";
import { findItemByName, getFullUserDetails, saveNewUserData } from "../../lib/utils.js";
import { FullInventory, Item } from "../../typings/types";
import { templateEmbed } from "../../lib/embeds.js";

@Discord()
@Category("Economic")
export class SellCommand {
  @Slash({ name: "sell", description: "Sell an item from your inventory" })
  async sell(
    @SlashOption({
      name: "item",
      description: "Item to sell",
      type: ApplicationCommandOptionType.String,
      required: true,
    })
    @SlashOption({
      name: "quantity",
      description: "Quantity of item to sell",
      type: ApplicationCommandOptionType.Number,
      required: false,
    })
    item: string,
    quantity = 1,
    interaction: CommandInteraction,
  ): Promise<void> {
    const data = await getFullUserDetails(interaction.user.id, interaction);
    if (!data) return;

    const itemData = await findItemByName(item);
    if (!itemData) {
      await interaction.reply({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Not found",
            description: `Item **${item}** is not found in database`,
            interaction,
          }),
        ],
      });
      return;
    }

    if (!itemData.price) {
      await interaction.reply({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Not sellable",
            description: `Item **${item}** is not sellable or has a price of 0`,
            interaction,
          }),
        ],
      });
      return;
    }

    const itemIndex = (data.inventory as FullInventory).findIndex((i: Item) => i.name === item);
    if (itemIndex === -1) {
      await interaction.reply({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Not found",
            description: `Item **${item}** is not found in your inventory`,
            interaction,
          }),
        ],
      });
      return;
    }

    if (data.inventory[itemIndex].quantity < quantity) {
      await interaction.reply({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Invalid amount",
            description: `You don't have enough **${item}**`,
            interaction,
          }),
        ],
      });
      return;
    }

    data.inventory[itemIndex].quantity -= quantity;
    if (data.inventory[itemIndex].quantity === 0) {
      data.inventory!.splice(itemIndex, 1);
    }
    data.coin! += itemData.price * quantity;
    await saveNewUserData(interaction.user.id, data);
    await interaction.reply({
      embeds: [
        templateEmbed({
          type: "success",
          title: "Successfully perform operation",
          description: `You sold ${quantity}x ${item} for ${itemData.price * quantity} coins!`,
          interaction,
        }),
      ],
    });
  }
}
